/**
 * Non-streaming Gemini completion helper for the ticketing AI (Assistant,
 * AI-create, ask box). Gemini's free tier means these features don't burn
 * paid credits. Thinking is disabled (these are short, structured replies)
 * and we walk a small model fallback chain for resilience.
 */
import { TicketAiError } from "@/lib/ai-error";

// 2.5-flash is the reliable free model right now; the others are fallbacks.
export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export type LlmTurn = { role: "user" | "assistant"; content: string };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
};

export async function geminiComplete(opts: {
  system: string;
  messages: LlmTurn[];
  json?: boolean;
  maxTokens?: number;
}): Promise<string> {
  // Try both keys the rest of the app uses, in order. Lets us recover if
  // one is set-but-invalid in the environment.
  const keys = [process.env.GEMINI_API_KEY, process.env.GOOGLE_API_KEY].filter(
    (k): k is string => !!k,
  );
  if (keys.length === 0) {
    throw new TicketAiError("AI isn't configured (set GEMINI_API_KEY in Vercel).", 500);
  }

  const contents = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: opts.maxTokens ?? 1024,
    temperature: 0.4,
    // These replies don't need chain-of-thought; thinking eats the token
    // budget and can truncate the answer.
    thinkingConfig: { thinkingBudget: 0 },
  };
  if (opts.json) generationConfig.responseMimeType = "application/json";

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: opts.system }] },
    contents,
    generationConfig,
  });

  let lastErr = "";
  let keyRejected = "";
  for (const apiKey of keys) {
    for (const model of GEMINI_MODELS) {
      let resp: Response;
      try {
        resp = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
      } catch (e) {
        lastErr = e instanceof Error ? e.message : "fetch failed";
        continue;
      }

      if (resp.status === 429) {
        throw new TicketAiError(
          "AI free-tier limit reached for now. Wait a minute and try again — or enable Gemini billing for higher limits (still very cheap).",
          429,
        );
      }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        if (resp.status === 401 || resp.status === 403 || resp.status === 400) {
          // Bad / blocked key — capture the real reason, skip to the next key.
          let msg = `${resp.status}`;
          try {
            const parsed = JSON.parse(errText) as { error?: { message?: string } };
            if (parsed.error?.message) msg = parsed.error.message;
          } catch {
            /* keep the status code */
          }
          keyRejected = msg;
          break;
        }
        lastErr = `${resp.status}`; // 503 high-demand etc. — try the next model
        continue;
      }

      let json: GeminiResponse;
      try {
        json = (await resp.json()) as GeminiResponse;
      } catch {
        lastErr = "bad JSON";
        continue;
      }
      const text = (json.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text ?? "")
        .join("")
        .trim();
      if (text) return text;
      lastErr = json.error?.message || "empty response";
    }
  }

  if (keyRejected) {
    throw new TicketAiError(
      `Gemini rejected the API key (${keyRejected}). In Vercel, set GEMINI_API_KEY to a valid Google AI Studio key with the Generative Language API enabled.`,
      502,
    );
  }
  throw new TicketAiError(`AI is busy right now (${lastErr}). Try again.`, 503);
}

/** Parse a JSON string that may be wrapped in ```json fences or have stray text. */
export function parseLlmJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Strip code fences / find the first {...} or [...] block.
    const fenced = raw.replace(/```json|```/gi, "").trim();
    try {
      return JSON.parse(fenced) as T;
    } catch {
      const start = fenced.search(/[[{]/);
      const end = Math.max(fenced.lastIndexOf("}"), fenced.lastIndexOf("]"));
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(fenced.slice(start, end + 1)) as T;
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}
