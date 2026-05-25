/**
 * Gemini streaming chat helper — emits the SAME minimal SSE line protocol as
 * streamAnthropicChat / streamOpenAIChat so the browser client is unchanged:
 *
 *   data: <chunk of assistant text>\n\n   ← per delta
 *   event: done\ndata: ok\n\n             ← terminator
 *   event: error\ndata: <type>\n\n        ← mid-stream error
 *
 * Why this is the VN brain: a clean, simple system prompt + gemini-3.5-flash
 * produced the best result of every model tested (naturalness 4.6, zero
 * Latin/digit/foreign leaks across the validation set) — so it writes clean
 * spoken Malayalam DIRECTLY, no transliteration layer needed. The API key is
 * read by the caller and passed in; it never leaves the server.
 */
import type { ChatTurn, StreamResult } from "./anthropic-stream";

export const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function streamGeminiChat(params: {
  apiKey: string;
  system: string;
  messages: ChatTurn[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  logTag?: string;
}): Promise<StreamResult> {
  const { apiKey, system, messages } = params;
  const model = params.model ?? GEMINI_MODEL;
  const tag = params.logTag ?? "chat";

  // Gemini uses "model" for the assistant role and a top-level system_instruction.
  const contents = messages.map((t) => ({
    role: t.role === "assistant" ? "model" : "user",
    parts: [{ text: t.content }],
  }));
  const reqBody = JSON.stringify({
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      temperature: params.temperature ?? 0.6,
      maxOutputTokens: params.maxTokens ?? 1024,
      // gemini-3.5-flash "thinks" by default, which eats the output-token
      // budget and truncates the reply mid-sentence. These are short screening
      // replies — no thinking needed; disabling it gives full answers + speed.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const url = `${GEMINI_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reqBody,
    });
  } catch (err) {
    console.error(`[${tag}] gemini fetch failed:`, err);
    return { ok: false, status: 503, error: "upstream_unreachable" };
  }
  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error(`[${tag}] gemini non-ok`, upstream.status, "·", errText.slice(0, 200));
    return { ok: false, status: 503, error: "upstream_error" };
  }

  const reader = upstream.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let doneSent = false;
      const writeChunk = (text: string) => {
        const lines = text.split("\n").map((l) => `data: ${l}`).join("\n");
        controller.enqueue(encoder.encode(`${lines}\n\n`));
      };
      const writeEvent = (name: string, payload: string) => {
        controller.enqueue(encoder.encode(`event: ${name}\ndata: ${payload}\n\n`));
      };

      // Gemini SSE: `data: {candidates:[{content:{parts:[{text}]}}]}` per chunk.
      const drain = () => {
        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          sep = buffer.indexOf("\n\n");
          for (const line of frame.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as {
                candidates?: { content?: { parts?: { text?: string }[] } }[];
              };
              const text = parsed.candidates?.[0]?.content?.parts
                ?.map((p) => p.text ?? "")
                .join("");
              if (text) writeChunk(text);
            } catch {
              /* ignore partial/keepalive frame */
            }
          }
        }
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          // Gemini delimits SSE frames with CRLF (\r\n\r\n); strip \r so the
          // \n\n frame-splitter in drain() matches (otherwise zero content).
          buffer += decoder.decode(value, { stream: true }).replace(/\r/g, "");
          drain();
        }
        if (!doneSent) {
          writeEvent("done", "ok");
          doneSent = true;
        }
      } catch (err) {
        console.error(`[${tag}] gemini stream relay failed`, err);
        writeEvent("error", "relay_failed");
      } finally {
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
