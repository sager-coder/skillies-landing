/**
 * POST /api/business/venture-navigator/transcribe — speech-to-text for
 * the founder voice demo, via OpenAI gpt-4o-transcribe.
 *
 * A founder pitching by voice speaks English, Malayalam, or a mix.
 * gpt-4o-transcribe auto-detects the language and returns the correct
 * NATIVE script (Malayalam Unicode for Malayalam, plain English for
 * English) — verified on real clips. The `prompt` keeps startup/business
 * terms (MRR, traction, pre-seed, cap table…) in English even inside a
 * Malayalam sentence, the way founders actually talk.
 *
 * Input: multipart form with `file` — the client converts the browser
 * recording to 16kHz mono WAV.
 *
 * Output: { transcript, language: "ml" | "en" }. Language is derived from
 * the script of the returned text (lets the agent mirror the language).
 *
 * Key is read from VN_OPENAI_API_KEY — a Venture-Navigator-scoped OpenAI
 * key, deliberately NOT the generic OPENAI_API_KEY, so this client's key
 * stays isolated from other clients/surfaces.
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
const MAX_BYTES = 25 * 1024 * 1024; // OpenAI audio upload ceiling
const STT_MODEL = process.env.VN_STT_MODEL || "gpt-4o-transcribe";

const PROMPT =
  "The speaker is a startup founder pitching, speaking English or Malayalam " +
  "(often mixing in English business terms). Keep startup and business terms " +
  "and brand names in English even within a Malayalam sentence: MRR, ARR, " +
  "traction, pre-seed, seed, runway, cap table, SaaS, MVP, GTM, B2B.";

// Malayalam Unicode block.
const MALAYALAM_RE = /[ഀ-ൿ]/;

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

function extForMime(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) return "m4a";
  if (mime.includes("mpeg") || mime.includes("mp3") || mime.includes("mpga")) return "mp3";
  if (mime.includes("flac")) return "flac";
  return "wav";
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

  const apiKey = process.env.VN_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[vn-stt] VN_OPENAI_API_KEY not set");
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
  const out = new FormData();
  out.append("file", file, `audio.${extForMime(mime)}`);
  out.append("model", STT_MODEL);
  out.append("response_format", "json");
  out.append("prompt", PROMPT);

  // OpenAI can return transient 429/503 under load. Retry a couple of
  // times with short backoff before giving up.
  let upstream: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: out,
      });
    } catch (err) {
      console.error("[vn-stt] openai fetch failed:", err);
      if (attempt === 2) return jsonError(502, { error: "stt_unreachable" });
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    if (upstream.ok) break;
    if ((upstream.status === 429 || upstream.status === 503) && attempt < 2) {
      console.warn(`[vn-stt] openai ${upstream.status} — retry ${attempt + 1}`);
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    break; // non-retryable status
  }

  if (!upstream || !upstream.ok) {
    const status = upstream?.status ?? 502;
    const errText = upstream ? await upstream.text().catch(() => "") : "";
    console.error("[vn-stt] openai failed", status, "·", errText.slice(0, 300));
    return jsonError(status < 500 ? status : 502, {
      error: "stt_failed",
      upstream_status: status,
    });
  }

  let transcript = "";
  try {
    const data = (await upstream.json()) as { text?: string };
    transcript = (data.text ?? "").trim();
  } catch {
    return jsonError(502, { error: "stt_bad_response" });
  }

  const language = MALAYALAM_RE.test(transcript) ? "ml" : "en";
  return Response.json({ transcript, language });
}
