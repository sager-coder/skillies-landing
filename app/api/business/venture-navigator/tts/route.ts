/**
 * POST /api/business/venture-navigator/tts — text-to-speech for the
 * Venture Navigator founder demo. Turns the assistant's reply into a
 * spoken voice note in the matching language (English or Malayalam).
 *
 * Voice selection is driven by the SCRIPT of the reply text, not a
 * client hint: Malayalam Unicode → the Malayalam voice, otherwise the
 * English voice. The chat route writes voice-turn replies in a single
 * clean script (English, or Malayalam Unicode — never Manglish), so the
 * detection always lands on the right voice.
 *
 * Model: eleven_v3 — handles English well and is the only ElevenLabs
 * model with real Malayalam (ml) support.
 *
 * Public demo surface → per-IP rate limited. Returns audio/mpeg.
 */
import { type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // eleven_v3 on a long reply can take a few seconds

// Voices live in the connected ElevenLabs account. These IDs are not
// secret. Override via env if you want a different voice without a
// redeploy. English default is a confident male voice (investor-desk
// feel); Malayalam falls back to a Kerala voice for native delivery.
const ENGLISH_VOICE_ID =
  process.env.VN_VOICE_ID_ENGLISH || "pNInz6obpgDQGcFmaJgB"; // confident male advisor voice
const MALAYALAM_VOICE_ID =
  process.env.VN_VOICE_ID_MALAYALAM || "L4moSXE0nLamWh3YGSH1"; // Kerala Malayalam voice
const TTS_MODEL = "eleven_v3";

const MAX_PER_WINDOW = 40;
const WINDOW_SECONDS = 10 * 60;
const MAX_TTS_CHARS = 1200;

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

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("[vn-tts] ELEVENLABS_API_KEY not set");
    return jsonError(503, { error: "tts_not_configured" });
  }

  // Pick the voice from the actual script of the text.
  const isMalayalam = MALAYALAM_RE.test(text);
  const voiceId = isMalayalam ? MALAYALAM_VOICE_ID : ENGLISH_VOICE_ID;

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: TTS_MODEL,
          // Composed, credible delivery — a sharp operator, not a hype
          // reel.
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );
  } catch (err) {
    console.error("[vn-tts] upstream fetch failed:", err);
    return jsonError(502, { error: "tts_unreachable" });
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error(
      "[vn-tts] elevenlabs",
      upstream.status,
      "·",
      errText.slice(0, 300),
    );
    const status =
      upstream.status === 401 || upstream.status === 403
        ? 401
        : upstream.status === 429
          ? 429
          : 502;
    return jsonError(status, {
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
    },
  });
}
