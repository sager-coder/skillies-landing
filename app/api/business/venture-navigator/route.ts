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

  // Voice mode: when the founder sent a voice note, the reply is spoken in
  // Vivek's OWN cloned voice, which only sounds natural in Malayalam. So
  // for every voice turn we force a Malayalam-script reply (English only
  // for necessity startup words) regardless of the language the founder
  // used — full English sounds robotic in his voice. The TTS route then
  // transliterates the few English words to Malayalam script, giving his
  // natural Manglish delivery.
  const voiceMode = (body as { voice?: unknown })?.voice === true;
  let systemPrompt = VENTURE_NAVIGATOR_PROMPT;
  if (voiceMode) {
    // The base prompt's whole "LANGUAGE — MIRROR THE FOUNDER" section makes
    // the agent reply in English to English founders — which sounds robotic
    // in Vivek's cloned voice. Excise that entire section for spoken turns
    // so there's no conflict, then let the override below govern language.
    const base = VENTURE_NAVIGATOR_PROMPT.replace(
      /═+\nLANGUAGE — MIRROR THE FOUNDER\n═+\n[\s\S]*?(?=\n═+\n)/,
      "",
    );
    systemPrompt = `${base}

═══════════════════════════════════════════════
[VOICE TURN — spoken as Vivek in his own cloned Malayalam voice]
═══════════════════════════════════════════════
The founder sent a voice note; your reply is read aloud. Reply as Vivek: a warm but sharp Kerala startup mentor.

ENGAGE THE SUBSTANCE — react to what they ACTUALLY said: their specific numbers/situation, give your honest read, ANSWER direct questions directly. Do NOT reflexively bounce back a question every turn (that sounds like a robot). A follow-up question is welcome ONLY after you have genuinely engaged.

LANGUAGE — natural COLLOQUIAL Kerala Malayalam in Malayalam script (a real Malayali mentor, warm-professional; not buddy-casual, not stiff-formal). Keep the few English startup words Malayalis actually say (startup, seed, traction, fund, revenue, growth) but WRITE THEM IN MALAYALAM SCRIPT (സ്റ്റാർട്ടപ്പ്, സീഡ്, ട്രാക്ഷൻ, ഫണ്ട്, റവന്യൂ, ഗ്രോത്ത്). Never literary/Sanskritized Malayalam, never Hindi words, never obscure coinages. Open with "ഹായ്" (never "നമസ്കാരം"). Numbers as English number-WORDS in Malayalam script (round long ones), NEVER digits or non-Malayalam script; "percent" = "പേഴ്സന്റ്". 1-3 short spoken sentences.

GOOD examples (warm-professional, engages the substance):
• "ഹായ്! അമ്പത് ലാക്ക് സീഡ് കിട്ടിയത് നല്ല കാര്യം. ആ പണം എങ്ങനെ ഉപയോഗിക്കാനാണ് നോക്കുന്നത്?"
• "ഫൈവ് പേഴ്സന്റ് മാത്രമേ പണം തരുന്നുള്ളൂ എന്നത് കുറവാണ്, പക്ഷേ പേടിക്കണ്ട. ആ ഫണൽ നന്നാക്കിയാൽ മതി."
• "കോഫൗണ്ടർ ഇല്ലാത്തത് വലിയ പ്രശ്നമല്ല. നല്ലൊരു ടീമും ട്രാക്ഷനും ഉണ്ടെങ്കിൽ ഞങ്ങള് നോക്കും."`;

    // System instructions alone lose to the model's instinct to mirror the
    // founder's English, so ALSO pin the language in the user turn itself —
    // the strongest lever. (Server-side only; not persisted to history.)
    const li = sanitized.turns.length - 1;
    if (li >= 0) {
      sanitized.turns[li] = {
        ...sanitized.turns[li],
        content:
          sanitized.turns[li].content +
          "\n\n[Reply spoken aloud in Malayalam script. Engage what I actually said; answer directly, don't just ask another question. Open with ഹായ്.]",
      };
    }
  }

  // ── 3. LLM brain key (OpenAI — Anthropic/Sonnet retired for this demo) ──
  // Prefer the dedicated OPENAI_LLM_API_KEY, but fall back to the other OpenAI
  // keys already set on this project (OPENAI_API_KEY / VN_OPENAI_API_KEY) so the
  // brain works even if the dedicated var hasn't been provisioned.
  const apiKey =
    process.env.OPENAI_LLM_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.VN_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[vn] no OpenAI key set (OPENAI_LLM_API_KEY/OPENAI_API_KEY/VN_OPENAI_API_KEY)");
    return jsonError(503, { error: "demo_not_configured" });
  }

  // ── 4. Stream the reply (model fallback handled in the shared lib) ─
  console.log(
    "[vn] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const result = await streamOpenAIChat({
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
