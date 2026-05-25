/**
 * OpenAI streaming chat — a drop-in alternative to `streamAnthropicChat`
 * for when the Anthropic brain is unavailable (e.g. quota exhausted).
 *
 * It emits the SAME tiny SSE line protocol the browser client already
 * parses, so a route can swap providers without any client change:
 *
 *   data: <chunk of assistant text>\n\n   ← per delta
 *   event: done\ndata: ok\n\n             ← terminator
 *   event: error\ndata: <type>\n\n        ← mid-stream error
 *
 * Reuses `ChatTurn` / `StreamResult` / `sanitizeTurns` from
 * `anthropic-stream.ts` (which is kept as-is — the Anthropic path is not
 * deleted). The OpenAI key is read by the caller and passed in.
 */
import type { ChatTurn, StreamResult } from "./anthropic-stream";

// gpt-4o is the Sonnet-equivalent default; fall back to mini if it errors.
export const OPENAI_MODEL_CHAIN = ["gpt-4o", "gpt-4o-mini"];
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function streamOpenAIChat(params: {
  apiKey: string;
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
  logTag?: string;
}): Promise<StreamResult> {
  const { apiKey, system, messages } = params;
  const maxTokens = params.maxTokens ?? 1024;
  const tag = params.logTag ?? "chat";

  const requestBody = (model: string) =>
    JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.map((t) => ({ role: t.role, content: t.content })),
      ],
    });

  // Walk the model chain: open the stream, peek the first frames; a non-OK
  // status → try the next model. First model to stream wins.
  let chosenModel = "";
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let prelude = "";
  const peekDecoder = new TextDecoder();

  for (const model of OPENAI_MODEL_CHAIN) {
    let upstream: Response;
    try {
      upstream = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
      if (buf.includes('"choices"') || buf.includes("[DONE]")) {
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
    console.error(`[${tag}] all openai models failed`);
    return { ok: false, status: 503, error: "all_models_overloaded" };
  }
  console.log(`[${tag}] using model:`, chosenModel);

  const committedReader = reader;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = prelude;
      let doneEmitted = false;

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
          for (const line of frame.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data) continue;
            if (data === "[DONE]") {
              if (!doneEmitted) {
                writeEvent("done", "ok");
                doneEmitted = true;
              }
              continue;
            }
            try {
              const parsed = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const t = parsed.choices?.[0]?.delta?.content;
              if (t) writeChunk(t);
            } catch {
              /* ignore unparseable frame */
            }
          }
        }
      };

      try {
        drainFrames();
        while (true) {
          const { value, done } = await committedReader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          drainFrames();
        }
      } catch (err) {
        console.error(`[${tag}] openai stream relay failed`, err);
        writeEvent("error", "relay_failed");
      } finally {
        if (!doneEmitted) writeEvent("done", "ok");
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
