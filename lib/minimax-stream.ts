/**
 * MiniMax streaming helper for the Skillies KDP Coach.
 *
 * MiniMax's `chatcompletion_v2` endpoint is *OpenAI-compatible-ish* but
 * with three quirks that the plain OpenAI helper doesn't handle, so it
 * gets its own streamer:
 *
 *   1. Different URL: POST https://api.minimax.io/v1/text/chatcompletion_v2
 *   2. No `[DONE]` terminator. The stream ends with a final frame whose
 *      `object` is "chat.completion" (delta frames are
 *      "chat.completion.chunk"). That final frame also carries a full
 *      `message.content` copy of the whole reply — we MUST ignore it or
 *      the text doubles — plus the real `usage` (prompt/completion tokens).
 *   3. Errors arrive as HTTP 200 + `base_resp.status_code != 0` (e.g.
 *      1004 auth, 1008 insufficient balance, 1002 rate limit), not as the
 *      OpenAI `{"error": …}` shape.
 *
 * It re-streams MiniMax's SSE as the same tiny line protocol the browser
 * widget already understands (see KdpCoachWidget):
 *
 *      data: <chunk of assistant text>\n\n   ← repeated per delta
 *      event: done\ndata: ok\n\n             ← terminator
 *      event: error\ndata: <type>\n\n        ← on a committed-stream error
 *
 * `sanitizeTurns`, the `ChatTurn`/`ChatUsage`/`StreamResult` types are
 * shared with the OpenAI helper.
 */

import {
  sanitizeTurns,
  type ChatTurn,
  type ChatUsage,
  type StreamResult,
} from "@/lib/openai-stream";

export { sanitizeTurns };
export type { ChatTurn, ChatUsage, StreamResult };

// MiniMax international endpoint. `.minimaxi.chat` is the legacy alias and
// resolves to the same backend.
const MINIMAX_API_URL = "https://api.minimax.io/v1/text/chatcompletion_v2";

/** MiniMax's flagship text model. */
export const MINIMAX_DEFAULT_MODEL = "MiniMax-Text-01";

/** Map a MiniMax `base_resp.status_code` to a short error type for the UI. */
function miniMaxErrorType(code: number): string {
  switch (code) {
    case 1002:
      return "rate_limit_error";
    case 1004:
      return "authentication_error";
    case 1008:
      return "insufficient_balance";
    case 1013:
    case 1000:
    case 1001:
      return "overloaded_error";
    case 1027:
    case 2013:
      return "invalid_request_error";
    default:
      return "upstream_error";
  }
}

/**
 * Open a streaming MiniMax chat and re-stream it as our minimal SSE line
 * protocol. Returns a ready-to-return Response on success, or a typed
 * error for the caller to map to a status.
 *
 * @param apiKey    MiniMax API key (server-side only).
 * @param system    System prompt text (prepended as a `system` turn).
 * @param messages  Sanitised, alternating turns (use `sanitizeTurns`).
 * @param maxTokens Response cap. Defaults to 1024.
 * @param model     MiniMax model id. Defaults to MiniMax-Text-01.
 * @param logTag    Short prefix for server logs, e.g. "coach".
 */
export async function streamMiniMaxChat(params: {
  apiKey: string;
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
  model?: string;
  logTag?: string;
  onUsage?: (usage: ChatUsage) => void;
}): Promise<StreamResult> {
  const { apiKey, system, messages, onUsage } = params;
  const maxTokens = params.maxTokens ?? 1024;
  const tag = params.logTag ?? "chat";
  const model = params.model ?? MINIMAX_DEFAULT_MODEL;

  let upstream: Response;
  try {
    upstream = await fetch(MINIMAX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        stream: true,
        messages: [
          { role: "system", content: system },
          ...messages.map((t) => ({ role: t.role, content: t.content })),
        ],
      }),
    });
  } catch (err) {
    console.error(`[${tag}]`, model, "fetch failed:", err);
    return { ok: false, status: 503, error: "upstream_unreachable" };
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error(
      `[${tag}]`,
      model,
      "non-ok",
      upstream.status,
      "·",
      errText.slice(0, 200),
    );
    // 401/403 → bad key; everything else → generic upstream failure.
    const status = upstream.status === 401 || upstream.status === 403 ? 502 : 503;
    return { ok: false, status, error: "upstream_error" };
  }

  // Peek the first frames: a non-zero `base_resp.status_code` before any
  // text means the request was rejected (bad key, no balance, …) → bail
  // out with a typed error instead of opening an empty stream.
  const reader = upstream.body.getReader();
  const peekDecoder = new TextDecoder();
  let prelude = "";
  let decided = false;
  let peeks = 0;
  while (!decided && peeks < 50) {
    peeks++;
    const { value, done } = await reader.read();
    if (done) break;
    prelude += peekDecoder.decode(value, { stream: true });
    const errMatch = prelude.match(/"status_code"\s*:\s*([1-9]\d*)/);
    if (errMatch) {
      const code = Number(errMatch[1]);
      const type = miniMaxErrorType(code);
      console.error(`[${tag}]`, model, "base_resp error:", code, type);
      try {
        await reader.cancel();
      } catch {
        /* already closed */
      }
      // Auth / balance failures are not transient — surface 502 so the
      // route can tell the student the coach is down for an admin reason.
      const status = type === "authentication_error" ? 502 : 503;
      return { ok: false, status, error: type };
    }
    if (
      prelude.includes("chat.completion.chunk") ||
      /"delta"\s*:\s*\{[^}]*"content"/.test(prelude)
    ) {
      decided = true;
    }
  }

  console.log(`[${tag}] using model:`, model);

  const committedReader = reader;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = prelude;

      const usage: ChatUsage = {
        model,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheCreationTokens: 0,
      };
      let usageReported = false;
      const reportUsage = () => {
        if (usageReported || !onUsage) return;
        usageReported = true;
        try {
          onUsage(usage);
        } catch (err) {
          console.error(`[${tag}] onUsage callback threw`, err);
        }
      };

      let doneWritten = false;
      const writeChunk = (text: string) => {
        const lines = text
          .split("\n")
          .map((l) => `data: ${l}`)
          .join("\n");
        controller.enqueue(encoder.encode(`${lines}\n\n`));
      };
      const writeEvent = (name: string, payload: string) => {
        controller.enqueue(
          encoder.encode(`event: ${name}\ndata: ${payload}\n\n`),
        );
      };
      const writeDone = () => {
        if (doneWritten) return;
        doneWritten = true;
        reportUsage();
        writeEvent("done", "ok");
      };

      const drainFrames = () => {
        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          sep = buffer.indexOf("\n\n");

          for (const line of frame.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const dataStr = line.slice(5).trim();
            if (!dataStr || dataStr === "[DONE]") continue;
            let parsed: {
              object?: string;
              choices?: Array<{
                delta?: { content?: string };
                finish_reason?: string | null;
              }>;
              usage?: { prompt_tokens?: number; completion_tokens?: number };
              base_resp?: { status_code?: number; status_msg?: string };
            };
            try {
              parsed = JSON.parse(dataStr);
            } catch {
              continue; // ignore unparseable frame
            }

            // Mid-stream error.
            const code = parsed.base_resp?.status_code;
            if (typeof code === "number" && code !== 0) {
              const type = miniMaxErrorType(code);
              console.error(
                `[${tag}] mid-stream error:`,
                code,
                parsed.base_resp?.status_msg,
              );
              writeEvent("error", type);
              return;
            }

            // Capture usage whenever MiniMax reports real counts (the
            // final "chat.completion" frame).
            const u = parsed.usage;
            if (u && (u.prompt_tokens || u.completion_tokens)) {
              usage.inputTokens = u.prompt_tokens ?? usage.inputTokens;
              usage.outputTokens = u.completion_tokens ?? usage.outputTokens;
            }

            // Only the incremental delta frames carry text we forward.
            // The terminal "chat.completion" frame restates the whole
            // reply in `message.content` — forwarding it would double the
            // text, so we never read `message`.
            if (parsed.object === "chat.completion") {
              writeDone();
              continue;
            }
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) writeChunk(delta);
          }
        }
      };

      try {
        drainFrames(); // flush the peeked prelude first
        while (true) {
          const { value, done } = await committedReader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          drainFrames();
        }
      } catch (err) {
        console.error(`[${tag}] stream relay failed`, err);
        writeEvent("error", "relay_failed");
      } finally {
        // MiniMax usually sends the terminal frame, but if the socket
        // closes first we still emit a clean done + log whatever usage we
        // captured so the budget meter and cost log stay accurate.
        writeDone();
        controller.close();
      }
    },
  });

  return {
    ok: true,
    response: new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        Connection: "keep-alive",
      },
    }),
  };
}
