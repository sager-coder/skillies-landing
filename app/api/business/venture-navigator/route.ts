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
[VOICE TURN — SPOKEN DELIVERY OVERRIDE]
═══════════════════════════════════════════════
This SUPERSEDES the "LANGUAGE — MIRROR THE FOUNDER" rule above for THIS reply only. The founder sent a voice note, so your reply is spoken aloud in Vivek's own cloned voice — which ONLY sounds natural in Malayalam.
• Reply in MALAYALAM UNICODE SCRIPT (മലയാളം) EVEN IF the founder wrote in English. Full English is FORBIDDEN here — it sounds robotic in his voice.
• Speak almost ENTIRELY in MALAYALAM. Use English for AT MOST one or two words in the whole reply, and ONLY for startup jargon a Malayali founder genuinely always says in English (MRR, ARR, startup, seed, traction). TRANSLATE ordinary words to Malayalam instead of leaving them English — customers → ഉപഭോക്താക്കൾ, growth → വളർച്ച, revenue → വരുമാനം, monthly → പ്രതിമാസ, signal → സൂചന, team → ടീം/സംഘം, paying → പണം നൽകുന്ന, market → വിപണി. If a reply is full of English words it sounds like the voice is READING AN ENGLISH TRANSCRIPT — it must instead sound like a Malayali speaking Malayalam with the odd English term.
• VERBS and connecting words MUST be Malayalam — NEVER an English verb with a Malayalam auxiliary (do NOT write "chase ചെയ്യുന്നു", "build ചെയ്യുന്നു", "raise ചെയ്തു"; say "തേടുന്നു", "ഉണ്ടാക്കുന്നു", "സ്വരൂപിച്ചു"). NEVER place two English words back-to-back beyond one known term — the cloned voice slurs stacked English words into garbage. If you'd need to, say it in Malayalam.
• No romanised/Manglish (Latin-letter Malayalam) — use real Malayalam script for the Malayalam words. NEVER output a digit (0-9) or any non-Malayalam script (no Tamil/Telugu/Devanagari/Latin characters) — write every number as English number-WORDS in Malayalam script, and write "percent" as "പേഴ്സന്റ്" (never "ശതമാനം", never "%").
Spoken style: write in SHORT, self-contained sentences — each sentence is played as its own spoken voice note, so keep every sentence short and clean (the cloned voice slurs long ones). EARLY in the conversation (the first couple of exchanges) reply in just ONE short sentence — that's how WhatsApp voice chats open. Once the founder is engaged and you genuinely have more to say, you MAY reply in 2 to 4 short sentences (each becomes its own note), so they get a fuller answer without waiting turn-by-turn. You judge how many; default to fewer. Say numbers as rounded ENGLISH number-words written in Malayalam script (NOT Malayalam numerals), never digit strings (e.g. "ഏകദേശം ഫിഫ്റ്റി ലാക്ക്", "ട്വൽവ് പേഴ്സന്റ് equity", "ട്വന്റി ഫൈവ് ലാക്ക്"). Round long/exact figures instead of spelling every digit. No markdown, no bullet symbols, no emoji, no asterisks. Every sentence must sound natural read out loud.`;

    // System instructions alone lose to the model's instinct to mirror the
    // founder's English, so ALSO pin the language in the user turn itself —
    // the strongest lever. (Server-side only; not persisted to history.)
    const li = sanitized.turns.length - 1;
    if (li >= 0) {
      sanitized.turns[li] = {
        ...sanitized.turns[li],
        content:
          sanitized.turns[li].content +
          "\n\n[SPOKEN VOICE REPLY — almost ALL Malayalam script (മലയാളം). Use AT MOST one or two English words total, only iconic jargon (MRR, startup, seed); TRANSLATE ordinary words (customers→ഉപഭോക്താക്കൾ, growth→വളർച്ച, revenue→വരുമാനം) — don't leave them English or it sounds like an English transcript. Malayalam verbs (no 'chase ചെയ്യുന്നു'), no two English words in a row. Short self-contained sentences — ONE now if we're starting; 2-4 only once I'm engaged.]",
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
