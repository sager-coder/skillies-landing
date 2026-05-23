/**
 * POST /api/business/venture-navigator/transcribe — speech-to-text for
 * the founder voice demo, via Gemini multimodal.
 *
 * A founder pitching by voice will speak English, Malayalam, or a mix.
 * Gemini 2.5 Flash reliably tells Malayalam from English and returns the
 * correct NATIVE script (Malayalam Unicode, never romanised) — which is
 * what lets the agent mirror the language and the TTS route pick the
 * right voice. Startup vocabulary (MRR, traction, pre-seed, cap table…)
 * stays in English even inside a Malayalam sentence, the way founders
 * actually talk.
 *
 * Input: multipart form with `file` — the client converts the browser
 * recording to 16kHz mono WAV (a format Gemini always accepts).
 *
 * Output: { transcript, language: "ml" | "en" }.
 *
 * Public demo surface → per-IP rate limited.
 */
import { type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

const MAX_PER_WINDOW = 40;
const WINDOW_SECONDS = 10 * 60;
const MAX_BYTES = 20 * 1024 * 1024; // Gemini inline_data ceiling territory
const AUDIO_MODEL = process.env.GEMINI_AUDIO_MODEL || "gemini-2.5-flash";

const PROMPT =
  "Transcribe this audio exactly as spoken. The speaker is a startup founder using either English or Malayalam (often mixing in English business words). " +
  "Respond with STRICT JSON only, no markdown fences, in this shape: " +
  '{"language":"ml" or "en","text":"the transcript"}. ' +
  "Set language to the dominant language of the sentence. " +
  "For Malayalam, write the transcript in Malayalam Unicode script (മലയാളം) — NEVER romanise it and never use any other Indic script. " +
  "For English, write plain English. Keep startup/business terms and brand names in English even within Malayalam (e.g. MRR, traction, pre-seed, runway, cap table, SaaS, MVP). " +
  'If the audio is empty or unintelligible, return {"language":"en","text":""}.';

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return (
    req.headers.get("cf-connecting-ip") ||
    fwd.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function jsonError(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`vn-stt:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS);
  if (!rl.ok) {
    return jsonError(429, {
      error: "rate-limited",
      retryAfterSeconds: rl.retryAfterSeconds,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[vn-stt] GEMINI_API_KEY not set");
    return jsonError(503, { error: "stt_not_configured" });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError(400, { error: "bad_form" });
  }
  const file = form.get("file");
  if (!file || !(file instanceof Blob)) {
    return jsonError(400, { error: "no_file" });
  }
  if (file.size === 0) return jsonError(400, { error: "empty_file" });
  if (file.size > MAX_BYTES) return jsonError(413, { error: "file_too_large" });

  const mime = file.type || "audio/wav";
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  const reqBody = JSON.stringify({
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mime, data: base64 } },
        ],
      },
    ],
    generationConfig: { temperature: 0 },
  });

  // Gemini occasionally returns 503 (overloaded) / 429. Retry a couple
  // of times with short backoff before giving up.
  let upstream: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${AUDIO_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: reqBody,
        },
      );
    } catch (err) {
      console.error("[vn-stt] gemini fetch failed:", err);
      if (attempt === 2) return jsonError(502, { error: "stt_unreachable" });
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    if (upstream.ok) break;
    if (upstream.status === 503 || upstream.status === 429) {
      console.warn(`[vn-stt] gemini ${upstream.status} — retry ${attempt + 1}`);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }
    }
    break; // non-retryable status
  }

  if (!upstream || !upstream.ok) {
    const status = upstream?.status ?? 502;
    const errText = upstream ? await upstream.text().catch(() => "") : "";
    console.error("[vn-stt] gemini failed", status, "·", errText.slice(0, 300));
    return jsonError(status < 500 ? status : 502, {
      error: "stt_failed",
      upstream_status: status,
    });
  }

  let raw = "";
  try {
    const data = (await upstream.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return jsonError(502, { error: "stt_bad_response" });
  }

  // Gemini sometimes wraps JSON in ```json fences — strip and parse.
  let transcript = "";
  let language = "en";
  try {
    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { language?: string; text?: string };
    transcript = (parsed.text ?? "").trim();
    language = parsed.language === "ml" ? "ml" : "en";
  } catch {
    // Couldn't parse JSON — fall back to using the raw text, and detect
    // script for the language.
    transcript = raw.trim();
    language = /[ഀ-ൿ]/.test(transcript) ? "ml" : "en";
  }

  return Response.json({ transcript, language });
}
