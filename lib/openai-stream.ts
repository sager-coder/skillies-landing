/**
 * Shared OpenAI streaming helper for our chat surfaces (the Skillies
 * KDP Coach, the business demo agents, …).
 *
 * What it does
 * ────────────
 * 1. `sanitizeTurns` — coerce a client-supplied messages array into a
 *    clean, OpenAI-valid shape: drop junk, trim, guarantee a leading `user` turn.
 * 2. `streamOpenAIChat` — re-stream the OpenAI SSE response as a tiny SSE line 
 *    protocol the browser can read with a ReadableStream + TextDecoder:
 *
 *      data: <chunk of assistant text>\n\n   ← repeated per delta
 *      event: done\ndata: ok\n\n             ← terminator
 *      event: error\ndata: <type>\n\n        ← only if a committed model
 *                                              errors mid-stream
 */

export const OPENAI_MODEL_CHAIN = [
  "gpt-4o",
  "gpt-4o-mini",
];

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type SanitizeResult =
  | { ok: true; turns: ChatTurn[] }
  | { ok: false; error: string };

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

export type ChatUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
};

export async function streamOpenAIChat(params: {
  apiKey: string;
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
  logTag?: string;
  models?: string[];
  onUsage?: (usage: ChatUsage) => void;
}): Promise<StreamResult> {
  const { apiKey, system, messages, onUsage } = params;
  const maxTokens = params.maxTokens ?? 1024;
  const tag = params.logTag ?? "chat";
  const modelChain =
    params.models && params.models.length > 0
      ? params.models
      : OPENAI_MODEL_CHAIN;

  const requestBody = (model: string) =>
    JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      stream_options: { include_usage: true },
      messages: [
        { role: "system", content: system },
        ...messages.map((t) => ({ role: t.role, content: t.content })),
      ],
    });

  let chosenModel = "";
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let prelude = "";
  const peekDecoder = new TextDecoder();

  for (const model of modelChain) {
    let upstream: Response;
    try {
      upstream = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
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
      
      // OpenAI streams return "data: {...}" or "data: [DONE]"
      if (buf.includes('"error":')) {
        console.error(
          `[${tag}]`,
          model,
          "error in stream",
          "→ trying next model",
        );
        try {
          await r.cancel();
        } catch {}
        decided = true;
      } else if (buf.includes("data: ")) {
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
    } catch {}
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

          for (const line of frame.split("\n")) {
            if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();
              if (!dataStr) continue;
              if (dataStr === "[DONE]") {
                reportUsage();
                writeEvent("done", "ok");
                continue;
              }
              try {
                const parsed = JSON.parse(dataStr);
                
                // Track usage if included
                if (parsed.usage) {
                  usage.inputTokens = parsed.usage.prompt_tokens ?? 0;
                  usage.outputTokens = parsed.usage.completion_tokens ?? 0;
                }
                
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  writeChunk(content);
                }
              } catch (e) {
                // Ignore unparseable chunks
              }
            }
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
