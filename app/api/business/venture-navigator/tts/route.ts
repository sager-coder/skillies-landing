/**
 * POST /api/business/venture-navigator/tts — text-to-speech for the
 * Venture Navigator founder demo, in Vivek's OWN cloned voice.
 *
 * Backed by the self-hosted IndicF5 voice clone served on Modal
 * (app `vivek-voice-api`), not a managed TTS provider. The model speaks
 * with Vivek's actual voice for both English and Malayalam replies.
 *
 * IndicF5 is Indic-native and was fine-tuned on Vivek's Manglish reels
 * transcribed into Malayalam script, so it mispronounces Latin-script
 * English ("traction" → garbage). To fix that we transliterate the reply
 * to Malayalam script (English words spelled phonetically) BEFORE sending
 * it to the voice — the displayed chat text stays English-readable, only
 * the spoken input changes. Pure-Malayalam replies skip transliteration;
 * any transliteration failure falls back to the original text so voice
 * never breaks.
 *
 * Public demo surface → per-IP rate limited. Returns audio/mpeg.
 *
 * Latency: Modal scales to zero, so the first request after idle cold-
 * starts (~40-60s); warm requests are ~13-17s on A10G (IndicF5 runs ~32
 * sequential diffusion steps). The client falls back to a text bubble if
 * this route doesn't return audio in time, so a cold hit degrades
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
// Any Latin letter means there's English to transliterate for IndicF5.
const LATIN_RE = /[A-Za-z]/;
const TRANSLIT_MODEL = process.env.VN_TRANSLIT_MODEL || "gpt-4o";
const TRANSLIT_PROMPT =
  "Transliterate the following into Malayalam script the way a native " +
  "Malayali would pronounce it out loud. Spell English words PHONETICALLY " +
  "in Malayalam script (do not translate the meaning). Leave text that is " +
  "already Malayalam unchanged. Output ONLY the Malayalam-script result, " +
  "nothing else:\n\n";

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

// Render English (Latin) words as Malayalam script so IndicF5 pronounces
// them like Vivek would. Best-effort: skips pure-Malayalam text and falls
// back to the original on any failure so the voice path never breaks.
async function toMalayalamScript(text: string): Promise<string> {
  if (!LATIN_RE.test(text)) return text;
  const apiKey = process.env.VN_OPENAI_API_KEY;
  if (!apiKey) return text;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TRANSLIT_MODEL,
        temperature: 0,
        messages: [{ role: "user", content: TRANSLIT_PROMPT + text }],
      }),
    });
    if (!r.ok) return text;
    const d = (await r.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const out = (d?.choices?.[0]?.message?.content ?? "").trim();
    return out || text;
  } catch {
    return text;
  }
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

  // Transliterate English → Malayalam script for correct IndicF5 delivery.
  const speakText = await toMalayalamScript(text);
  const transliterated = speakText !== text;

  let upstream: Response;
  try {
    upstream = await fetch(VOICE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text: speakText }),
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
      "X-Spoke-Transliterated": transliterated ? "1" : "0",
    },
  });
}

// Warm-up: a GET boots the Modal container (which loads the model on
// startup), so a voice reply that follows comes back warm instead of
// cold-starting into a text fallback. Fired when the user starts
// recording. Best-effort, fire-and-forget from the client.
export async function GET() {
  try {
    const base = VOICE_API_URL.replace(/\/tts$/, "");
    await fetch(`${base}/health`, { method: "GET" });
  } catch {
    /* best-effort warm-up */
  }
  return Response.json({ warming: true });
}
