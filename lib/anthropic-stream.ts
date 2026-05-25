/**
 * Shared Anthropic streaming helper for our chat surfaces (the Skillies
 * KDP Coach, the business demo agents, …). One battle-tested path so a
 * fix — like the model-fallback chain that survives a single model being
 * overloaded — benefits every chat at once.
 *
 * What it does
 * ────────────
 * 1. `sanitizeTurns` — coerce a client-supplied messages array into a
 *    clean, Anthropic-valid shape: drop junk, trim, collapse consecutive
 *    same-role turns, guarantee a leading `user` turn, keep a trailing
 *    window.
 * 2. `streamAnthropicChat` — walk a model fallback chain, peek the first
 *    frames of each model's stream, and re-stream the first model that
 *    actually produces content as a tiny SSE line protocol the browser
 *    can read with a ReadableStream + TextDecoder:
 *
 *      data: <chunk of assistant text>\n\n   ← repeated per delta
 *      event: done\ndata: ok\n\n             ← terminator
 *      event: error\ndata: <type>\n\n        ← only if a committed model
 *                                              errors mid-stream
 *
 * The Anthropic API key is read by the caller and passed in — it never
 * leaves the server. System prompts are passed in too (they're product
 * IP and stay server-side).
 */

// Sonnet 4.6 is preferred. Anthropic occasionally returns
// `overloaded_error` (HTTP 529) for one model while others have
// capacity, so we degrade Sonnet → Opus → Haiku and use the first model
// that yields a streamable response. When Sonnet recovers it's used
// again automatically.
export const ANTHROPIC_MODEL_CHAIN = [
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "claude-haiku-4-5-20251001",
];

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type SanitizeResult =
  | { ok: true; turns: ChatTurn[] }
  | { ok: false; error: string };

/**
 * Validate + normalise a raw client messages array into Anthropic-valid
 * alternating turns. Returns `{ ok: false, error }` for unrecoverable
 * input so the caller can map it to a 400.
 */
export function sanitizeTurns(
  messagesIn: unknown,
  opts: { maxTurns?: number; maxUserChars?: number } = {},
): SanitizeResult {
  const maxTurns = opts.maxTurns ?? 20;
  const maxUserChars = opts.maxUserChars ?? 4000;

  if (!Array.isArray(messagesIn) || messagesIn.length === 0) {
    return { ok: false, error: "missing_messages" };
  }

  const turns: ChatTurn[] = [];
  for (const raw of messagesIn) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as { role?: unknown; content?: unknown };
    if (m.role !== "user" && m.role !== "assistant") continue;
    if (typeof m.content !== "string") continue;
    const text = m.content.trim();
    if (!text) continue;
    turns.push({
      role: m.role,
      content: m.role === "user" ? text.slice(0, maxUserChars) : text,
    });
  }
  if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
    return { ok: false, error: "last_message_must_be_user" };
  }

  // Anthropic requires strictly alternating roles starting with `user`.
  // Collapse consecutive same-role turns (a stale-closure race or a
  // voice transcript appended after a typed line can produce two in a
  // row) by merging their text.
  const collapsed: ChatTurn[] = [];
  for (const t of turns) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.role === t.role) {
      last.content = `${last.content}\n\n${t.content}`;
    } else {
      collapsed.push({ ...t });
    }
  }
  while (collapsed.length && collapsed[0].role !== "user") collapsed.shift();

  const trimmed = collapsed.slice(-maxTurns);
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  if (trimmed.length === 0) return { ok: false, error: "no_user_turn" };

  return { ok: true, turns: trimmed };
}

export type StreamResult =
  | { ok: true; response: Response }
  | { ok: false; status: number; error: string };

/** Token usage for one completed assistant reply. */
export type ChatUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
};

/**
 * Open a streaming Anthropic chat with model fallback and re-stream it
 * as our minimal SSE line protocol. Returns a ready-to-return Response
 * on success, or a typed error for the caller to map to a status.
 *
 * @param apiKey      Anthropic API key (server-side only).
 * @param system      System prompt text. Cached via `cache_control`.
 * @param messages    Sanitised, alternating turns (use `sanitizeTurns`).
 * @param maxTokens   Response cap. Defaults to 1024 (WhatsApp-length).
 * @param logTag      Short prefix for server logs, e.g. "coach" / "jomin".
 */
export async function streamAnthropicChat(params: {
  apiKey: string;
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
  logTag?: string;
  /**
   * Override the model fallback chain for this caller. Defaults to the
   * shared `ANTHROPIC_MODEL_CHAIN`. Use a cheaper single-model chain (e.g.
   * Haiku only) on cost-sensitive surfaces.
   */
  models?: string[];
  /**
   * Fired once when the reply finishes, with token counts for the model
   * that actually answered. Used for usage/cost logging. Errors thrown
   * here are swallowed so logging never breaks the chat.
   */
  onUsage?: (usage: ChatUsage) => void;
}): Promise<StreamResult> {
  const { apiKey, system, messages, onUsage } = params;
  const maxTokens = params.maxTokens ?? 1024;
  const tag = params.logTag ?? "chat";
  const modelChain =
    params.models && params.models.length > 0
      ? params.models
      : ANTHROPIC_MODEL_CHAIN;

  const requestBody = (model: string) =>
    JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      system: [
        {
          type: "text",
          text: system,
          // Cache the (large) system prompt. ~90% cheaper input + lower
          // latency on every follow-up within the 5-min cache window.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((t) => ({ role: t.role, content: t.content })),
    });

  // Walk the model chain. For each: open the stream, peek the first
  // frames — non-OK status or an `error` event before any text → try the
  // next model. First model to produce content wins.
  let chosenModel = "";
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let prelude = ""; // bytes already pulled off `reader` during the peek
  const peekDecoder = new TextDecoder();

  for (const model of modelChain) {
    let upstream: Response;
    try {
      upstream = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: requestBody(model),
      });
    } catch (err) {
      console.error(`[${tag}]`, model, "fetch failed:", err);
      continue;
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
        "→ trying next model",
      );
      continue;
    }

    const r = upstream.body.getReader();
    let buf = "";
    let decided = false;
    let good = false;
    let peeks = 0;
    while (!decided && peeks < 50) {
      peeks++;
      const { value, done } = await r.read();
      if (done) break;
      buf += peekDecoder.decode(value, { stream: true });
      if (/event:\s*error/.test(buf) || /"type"\s*:\s*"error"/.test(buf)) {
        const m = buf.match(/"type"\s*:\s*"([a-z_]+_error)"/);
        console.error(
          `[${tag}]`,
          model,
          "error event:",
          m?.[1] ?? "unknown",
          "→ trying next model",
        );
        try {
          await r.cancel();
        } catch {
          /* already closed */
        }
        decided = true;
      } else if (
        buf.includes("content_block_delta") ||
        buf.includes("content_block_start") ||
        buf.includes('"type":"message_start"')
      ) {
        good = true;
        decided = true;
      }
    }

    if (good) {
      chosenModel = model;
      reader = r;
      prelude = buf;
      break;
    }
    try {
      await r.cancel();
    } catch {
      /* noop */
    }
  }

  if (!reader) {
    console.error(`[${tag}] all models failed/overloaded`);
    return { ok: false, status: 503, error: "all_models_overloaded" };
  }
  console.log(`[${tag}] using model:`, chosenModel);

  const committedReader = reader;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = prelude;

      // Usage accumulates across frames: input + cache counts arrive in
      // `message_start`, the final output count in `message_delta`.
      const usage: ChatUsage = {
        model: chosenModel,
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

      const drainFrames = () => {
        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          sep = buffer.indexOf("\n\n");

          let eventName: string | null = null;
          const dataLines: string[] = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trim());
            }
          }
          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join("\n");

          if (eventName === "content_block_delta") {
            try {
              const parsed = JSON.parse(dataStr) as {
                delta?: { type?: string; text?: string };
              };
              if (parsed.delta?.type === "text_delta" && parsed.delta.text) {
                writeChunk(parsed.delta.text);
              }
            } catch {
              /* ignore unparseable frame */
            }
          } else if (eventName === "message_start") {
            try {
              const parsed = JSON.parse(dataStr) as {
                message?: {
                  usage?: {
                    input_tokens?: number;
                    output_tokens?: number;
                    cache_read_input_tokens?: number;
                    cache_creation_input_tokens?: number;
                  };
                };
              };
              const u = parsed.message?.usage;
              if (u) {
                usage.inputTokens = u.input_tokens ?? 0;
                usage.cacheReadTokens = u.cache_read_input_tokens ?? 0;
                usage.cacheCreationTokens = u.cache_creation_input_tokens ?? 0;
                usage.outputTokens = u.output_tokens ?? 0;
              }
            } catch {
              /* ignore unparseable frame */
            }
          } else if (eventName === "message_delta") {
            try {
              const parsed = JSON.parse(dataStr) as {
                usage?: { output_tokens?: number };
              };
              if (typeof parsed.usage?.output_tokens === "number") {
                usage.outputTokens = parsed.usage.output_tokens;
              }
            } catch {
              /* ignore unparseable frame */
            }
          } else if (eventName === "message_stop") {
            reportUsage();
            writeEvent("done", "ok");
          } else if (eventName === "error") {
            let errType = "upstream_stream_error";
            try {
              const parsed = JSON.parse(dataStr) as {
                error?: { type?: string; message?: string };
              };
              if (parsed.error?.type) errType = parsed.error.type;
              console.error(
                `[${tag}] anthropic stream error:`,
                parsed.error?.type,
                "·",
                parsed.error?.message,
              );
            } catch {
              console.error(
                `[${tag}] anthropic stream error (raw):`,
                dataStr.slice(0, 300),
              );
            }
            writeEvent("error", errType);
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
        // Safety net: if the stream ended without a clean message_stop
        // we still log whatever usage we captured (output may be 0).
        reportUsage();
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
