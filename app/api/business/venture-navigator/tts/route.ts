/**
 * POST /api/business/venture-navigator/tts — text-to-speech for the
 * Venture Navigator founder demo, in Vivek's OWN cloned voice.
 *
 * Backed by the self-hosted IndicF5 voice clone served on Modal
 * (app `vivek-voice-api`), not a managed TTS provider. The model speaks
 * with Vivek's actual voice for both English and Malayalam replies — the
 * reference clip and fine-tune are baked into the Modal service, so this
 * route just forwards the text and streams back the mp3.
 *
 * Public demo surface → per-IP rate limited. Returns audio/mpeg.
 *
 * Note on cold starts: the Modal service scales to zero, so the first
 * request after a long idle can take ~30-60s while a GPU container boots;
 * warm requests are ~1-2s. The client falls back to a text bubble if this
 * route doesn't return audio in time, so a cold first hit degrades
 * gracefully rather than breaking the demo.
 */
import { type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // owned-voice cold start can take a while

// Self-hosted owned-voice endpoint (Modal). Public URL, not a secret;
// override via env to repoint without a redeploy.
const VOICE_API_URL =
  process.env.VN_VOICE_API_URL ||
  "https://sager-coder--vivek-voice-api-web.modal.run/tts";

const MAX_PER_WINDOW = 40;
const WINDOW_SECONDS = 10 * 60;
const MAX_TTS_CHARS = 1200;

// Malayalam Unicode block — informational only (the voice is always
// Vivek's; this just tags the response for debugging).
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

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`vn-tts:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS);
  if (!rl.ok) {
    return jsonError(429, {
      error: "rate-limited",
      retryAfterSeconds: rl.retryAfterSeconds,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "bad_json" });
  }
  const rawText = (body as { text?: unknown })?.text;
  if (typeof rawText !== "string" || !rawText.trim()) {
    return jsonError(400, { error: "missing_text" });
  }
  const text = rawText.trim().slice(0, MAX_TTS_CHARS);
  const isMalayalam = MALAYALAM_RE.test(text);

  let upstream: Response;
  try {
    upstream = await fetch(VOICE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("[vn-tts] owned-voice fetch failed:", err);
    return jsonError(502, { error: "tts_unreachable" });
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error("[vn-tts] owned-voice", upstream.status, "·", errText.slice(0, 300));
    return jsonError(502, {
      error: "tts_failed",
      upstream_status: upstream.status,
    });
  }

  // Stream the audio straight through to the client.
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Voice-Lang": isMalayalam ? "ml" : "en",
      "X-Voice-Source": "owned-indicf5",
    },
  });
}
