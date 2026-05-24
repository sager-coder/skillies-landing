/**
 * POST /api/business/insurance-consultant — public demo chat for the
 * Insurance Consultant (Kerala life-insurance advisory) WhatsApp agent.
 *
 * This powers the /business/insurance-consultant sales-demo page: a
 * prospect (or the team) can chat with the configured advisory agent
 * before the real WhatsApp integration is wired up. No auth — it's a
 * public demo surface — so we lean on a per-IP rate limit to keep the
 * Anthropic bill sane.
 *
 * The Anthropic call, model fallback, and SSE re-streaming all live in
 * `lib/anthropic-stream.ts` (shared with the other demos). This route
 * owns only IP rate limiting, body sanitising, and the system prompt.
 *
 * Gate chain:
 *   1. Rate-limited (per IP)?  → 429
 *   2. Body valid?             → 400
 *   3. Configured?             → 503 (no ANTHROPIC_API_KEY)
 *   4. All models overloaded?  → 503
 */
import { type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { INSURANCE_CONSULTANT_PROMPT } from "@/lib/insurance-consultant-prompt";
import { sanitizeTurns, streamAnthropicChat } from "@/lib/anthropic-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public surface → keep it generous for a real demo session but tight
// enough that a scraper can't run our Anthropic key for free. 40 msgs
// per 10 min per IP.
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
  const rl = rateLimit(`insurance-consultant:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS);
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

  // Voice mode: when the customer sent a voice note, the reply will be
  // spoken aloud (TTS). We append a directive so the agent produces
  // TTS-friendly text in the matching language — Malayalam *script*
  // (not Manglish, which a TTS voice mangles) or clean English. The
  // TTS route then picks the voice from the script of the reply.
  const voiceMode = (body as { voice?: unknown })?.voice === true;
  const langHint = (body as { lang?: unknown })?.lang;
  let systemPrompt = INSURANCE_CONSULTANT_PROMPT;
  if (voiceMode) {
    const wantsMalayalam =
      langHint === "ml" ||
      langHint === "mal" ||
      // If the latest user turn is in Malayalam script, default to Malayalam.
      /[ഀ-ൿ]/.test(sanitized.turns[sanitized.turns.length - 1]?.content ?? "");
    systemPrompt = `${INSURANCE_CONSULTANT_PROMPT}

═══════════════════════════════════════════════
[VOICE TURN — OVERRIDES THE SCRIPT-MIRROR RULE]
═══════════════════════════════════════════════
The customer sent a voice note, so your reply is read aloud by a text-to-speech voice. This single instruction has the HIGHEST priority and explicitly SUPERSEDES Hard Rule 9 (the Malayalam-script / English language rule) for this one reply, because a TTS engine can only pronounce a native script correctly:
${
  wantsMalayalam
    ? `Write 100% of your reply in MALAYALAM UNICODE SCRIPT (e.g. നമസ്കാരം, വയസ്സ്, വേണം). Romanised/Manglish/Latin-letter Malayalam is STRICTLY FORBIDDEN in this reply — do not use it even if the customer wrote that way. Only genuine English insurance/finance nouns (premium, policy, ULIP, fund, annuity, pension, return, sum assured) may stay in English, as Malayalis say them aloud.

Speak in CASUAL, EVERYDAY KERALA SPOKEN MALAYALAM (നാടൻ സംസാര ശൈലി) — the warm, friendly way a real Keralite talks to a neighbour, NOT formal, literary, or news-reader Malayalam. Use relaxed colloquial phrasing and natural spoken sentence-enders where they fit (…ണ്ട്, …ആ, …ട്ടോ, …ല്ലേ, …അല്ലേ, …ഉണ്ടല്ലോ, …ആണേ). Examples of the tone: "ഓക്കെ, അത് നടക്കും ട്ടോ.", "നിങ്ങക്ക് ഇത് നല്ല ചേരും.", "ഒരു കാര്യം ചോദിക്കട്ടേ —". Sound like a helpful local friend who happens to know insurance, never a textbook or a call-centre script.`
    : "Write your reply in clean, simple, friendly spoken English (relaxed Indian-English is perfect)."
}
Spoken style: short — 2 to 4 short sentences, one idea, end with one question. Numbers as rounded words, never digit strings (e.g. "around twelve thousand", "ten lakh cover", "about six percent"). No markdown, no bullet symbols, no emoji, no asterisks. It must sound natural read out loud.`;
  }

  // ── 3. Anthropic key ──────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[insurance-consultant] ANTHROPIC_API_KEY not set");
    return jsonError(503, { error: "demo_not_configured" });
  }

  // ── 4. Stream the reply (model fallback handled in the shared lib) ─
  console.log(
    "[insurance-consultant] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const result = await streamAnthropicChat({
    apiKey,
    system: systemPrompt,
    messages: sanitized.turns,
    maxTokens: 700, // WhatsApp-length replies; the agent is told to be terse
    logTag: voiceMode ? "insurance-consultant-voice" : "insurance-consultant",
  });
  if (!result.ok) {
    return jsonError(result.status, { error: result.error });
  }
  return result.response;
}
