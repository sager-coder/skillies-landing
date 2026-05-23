/**
 * POST /api/business/venture-navigator — public demo chat for the
 * Venture Navigator founder-intake agent.
 *
 * Powers the /business/venture-navigator sales-demo page: a founder (or
 * Vivek's own team) can pitch the agent and watch it do the first read —
 * draw out the few facts that matter, give an honest reaction, and route
 * a strong founder onward — before the real WhatsApp integration is
 * wired up. No auth — public demo surface — so we lean on a per-IP rate
 * limit to keep the Anthropic bill sane.
 *
 * The Anthropic call, model fallback, and SSE re-streaming all live in
 * `lib/anthropic-stream.ts` (shared with the other chat surfaces). This
 * route owns only IP rate limiting, body sanitising, and the system
 * prompt.
 *
 * Gate chain:
 *   1. Rate-limited (per IP)?  → 429
 *   2. Body valid?             → 400
 *   3. Configured?             → 503 (no ANTHROPIC_API_KEY)
 *   4. All models overloaded?  → 503
 */
import { type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { VENTURE_NAVIGATOR_PROMPT } from "@/lib/venture-navigator-prompt";
import { sanitizeTurns, streamAnthropicChat } from "@/lib/anthropic-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public surface → generous for a real demo session but tight enough
// that a scraper can't run our Anthropic key for free. 40 msgs / 10 min
// per IP.
const MAX_PER_WINDOW = 40;
const WINDOW_SECONDS = 10 * 60;
const MAX_TURNS = 24;
const MAX_USER_CHARS = 2000;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return (
    req.headers.get("cf-connecting-ip") ||
    first ||
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
  // ── 1. Per-IP rate limit ──────────────────────────────────────────
  const ip = clientIp(req);
  const rl = rateLimit(`vn:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({
        error: "rate-limited",
        retryAfterSeconds: rl.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfterSeconds),
        },
      },
    );
  }

  // ── 2. Body parse + sanitize ──────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "bad_json" });
  }
  const sanitized = sanitizeTurns((body as { messages?: unknown })?.messages, {
    maxTurns: MAX_TURNS,
    maxUserChars: MAX_USER_CHARS,
  });
  if (!sanitized.ok) {
    return jsonError(400, { error: sanitized.error });
  }

  // Voice mode: when the founder sent a voice note, the reply is read
  // aloud (TTS). We append a directive so the agent produces TTS-friendly
  // text in the matching language — English, or Malayalam *script* (not
  // Manglish, which a TTS voice mangles). The TTS route then picks the
  // voice from the script of the reply.
  const voiceMode = (body as { voice?: unknown })?.voice === true;
  const langHint = (body as { lang?: unknown })?.lang;
  let systemPrompt = VENTURE_NAVIGATOR_PROMPT;
  if (voiceMode) {
    const wantsMalayalam =
      langHint === "ml" ||
      langHint === "mal" ||
      // If the latest user turn is in Malayalam script, default to Malayalam.
      /[ഀ-ൿ]/.test(sanitized.turns[sanitized.turns.length - 1]?.content ?? "");
    systemPrompt = `${VENTURE_NAVIGATOR_PROMPT}

═══════════════════════════════════════════════
[VOICE TURN — SPOKEN DELIVERY OVERRIDE]
═══════════════════════════════════════════════
The founder sent a voice note, so your reply is read aloud by a text-to-speech voice. This instruction has the HIGHEST priority for this one reply, because a TTS engine can only pronounce a single native script cleanly:
${
  wantsMalayalam
    ? `Write 100% of your reply in MALAYALAM UNICODE SCRIPT. Romanised/Manglish/Latin-letter Malayalam is FORBIDDEN here — do not use it even if the founder spoke that way. Only genuine English startup nouns (startup, MRR, traction, pre-seed, runway, equity, pitch deck) may stay in English, the way founders actually say them aloud. Keep the tone that of a sharp, grounded operator talking straight to a founder — confident and warm, never a news-reader.`
    : "Write your reply in clean, simple spoken English (relaxed Indian-English is perfect). Plain and direct, like an operator who respects the founder's time."
}
Spoken style: short — 2 to 4 short sentences, one idea, end with one question. Say numbers as rounded words, never digit strings (e.g. "around fifty lakhs", "twelve percent equity"). No markdown, no bullet symbols, no emoji, no asterisks. It has to sound natural read out loud.`;
  }

  // ── 3. Anthropic key ──────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[vn] ANTHROPIC_API_KEY not set");
    return jsonError(503, { error: "demo_not_configured" });
  }

  // ── 4. Stream the reply (model fallback handled in the shared lib) ─
  console.log(
    "[vn] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const result = await streamAnthropicChat({
    apiKey,
    system: systemPrompt,
    messages: sanitized.turns,
    maxTokens: 700, // WhatsApp-length replies; the agent is told to be terse
    logTag: voiceMode ? "vn-voice" : "vn",
  });
  if (!result.ok) {
    return jsonError(result.status, { error: result.error });
  }
  return result.response;
}
