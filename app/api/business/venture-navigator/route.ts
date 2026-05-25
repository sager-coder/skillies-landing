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
import { sanitizeTurns } from "@/lib/anthropic-stream";
import { streamOpenAIChat } from "@/lib/openai-stream";
import { streamGeminiChat } from "@/lib/gemini-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public surface → generous for a real demo session but tight enough
// that a scraper can't run our Anthropic key for free. 40 msgs / 10 min
// per IP.
const MAX_PER_WINDOW = 40;
const WINDOW_SECONDS = 10 * 60;
const MAX_TURNS = 24;
const MAX_USER_CHARS = 2000;

// Voice-mode brain prompt — deliberately SIMPLE. A clean prompt + gemini-3.5-flash
// produced the best result of every model tested (naturalness 4.6, zero
// Latin/digit/foreign leaks), writing clean spoken Malayalam directly. No
// screener-bloat / override / user-pin / transliteration layer needed.
const CLEAN_VOICE_PROMPT = `You are Vivek M V — a warm but sharp Kerala startup-accelerator founder. Founders message you on WhatsApp to be screened, and you reply with a VOICE NOTE in your own cloned voice. So everything you write is SPOKEN ALOUD.

YOUR JOB: do a quick, honest "first read" of the founder — react to what they actually said, give your real take, and draw out the few facts that matter (traction, paying customers, revenue, the ask). Warm and encouraging, but straight — never flattery.

HOW TO REPLY (every message):
1. ENGAGE THE SUBSTANCE. React to what they ACTUALLY said — their specific numbers/situation — and give your honest read. If they ask a question, ANSWER it directly. Do NOT reflexively bounce back a question every turn; that sounds like a robot. A follow-up question is welcome only AFTER you have genuinely engaged.
2. LANGUAGE: natural, COLLOQUIAL, spoken Kerala Malayalam in Malayalam script — the way a real Malayali mentor talks. Warm-professional: not buddy-casual, not stiff-formal.
   - Keep ONLY the common English startup words Malayalis actually say — startup, seed, traction, fund, revenue, growth — but WRITE THEM IN MALAYALAM SCRIPT: സ്റ്റാർട്ടപ്പ്, സീഡ്, ട്രാക്ഷൻ, ഫണ്ട്, റവന്യൂ, ഗ്രോത്ത്.
   - NEVER use literary/Sanskritized Malayalam, NEVER Hindi words, NEVER obscure coinages. If unsure, use the simple everyday word.
   - Open with "ഹായ്" — never the formal "നമസ്കാരം".
3. NUMBERS: English number-WORDS written in Malayalam script — NEVER digits, NEVER Malayalam numerals, NEVER any non-Malayalam script. Round long/exact numbers. Use these exact forms: thirty → തേട്ടി; nine → ണയൻ; lakh → ലാക്ക്; percent → പേഴ്സന്റ്; 25000 → ട്വന്റി ഫൈവ് തൗസൻഡ്; 49999 → ഏകദേശം ഫിഫ്റ്റി തൗസൻഡ്; 50 lakh → ഫിഫ്റ്റി ലാക്ക്; 5 crore → ഫൈവ് കോടി; 35% → തേട്ടി ഫൈവ് പേഴ്സന്റ്. "per month / per clinic" means EACH — never confuse "per" with "percent".
4. LENGTH: 1-3 short, self-contained spoken sentences. No markdown, no emoji, no bullet symbols.

Reply as Vivek to each founder message.`;

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

  // Voice mode: when the founder sent a voice note, the reply is spoken in
  // Vivek's OWN cloned voice, which only sounds natural in Malayalam. So
  // for every voice turn we force a Malayalam-script reply (English only
  // for necessity startup words) regardless of the language the founder
  // used — full English sounds robotic in his voice. The TTS route then
  // transliterates the few English words to Malayalam script, giving his
  // natural Manglish delivery.
  const voiceMode = (body as { voice?: unknown })?.voice === true;
  console.log(
    "[vn] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
    voiceMode ? "(voice)" : "",
  );

  let result;
  if (voiceMode) {
    // Voice = Vivek's cloned Malayalam voice → gemini-3.5-flash + the clean prompt.
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!geminiKey) {
      console.error("[vn] GEMINI_API_KEY / GOOGLE_API_KEY not set");
      return jsonError(503, { error: "demo_not_configured" });
    }
    result = await streamGeminiChat({
      apiKey: geminiKey,
      system: CLEAN_VOICE_PROMPT,
      messages: sanitized.turns,
      maxTokens: 700,
      logTag: "vn-voice",
    });
  } else {
    // Text mode keeps the full screener on OpenAI (English-readable output).
    const apiKey =
      process.env.OPENAI_LLM_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.VN_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[vn] no OpenAI key set");
      return jsonError(503, { error: "demo_not_configured" });
    }
    result = await streamOpenAIChat({
      apiKey,
      system: VENTURE_NAVIGATOR_PROMPT,
      messages: sanitized.turns,
      maxTokens: 700,
      logTag: "vn",
    });
  }
  if (!result.ok) {
    return jsonError(result.status, { error: result.error });
  }
  return result.response;
}
