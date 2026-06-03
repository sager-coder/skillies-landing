/**
 * POST /api/student/coach — Skillies KDP Coach chat endpoint.
 *
 * Streams an Anthropic Messages response back as SSE to the student
 * dashboard chat widget. The chat is exclusive to paying students: every
 * caller must be (a) logged in and (b) hold at least one row in
 * `enrollments`. Admins also pass. Anyone else gets a 403.
 *
 * The Anthropic call + model fallback + SSE re-streaming all live in
 * `lib/anthropic-stream.ts`, shared with the business demo agents. This
 * route owns only the auth/enrollment gate and rate limiting.
 *
 * Gate chain (cheap → expensive):
 *   1. Logged-in?                        → 401
 *   2. Rate-limited (per user_id)?       → 429
 *   3. Body valid?                       → 400
 *   4. Enrolled in at least 1 course
 *      OR profiles.is_admin?             → 403
 *   5. Monthly token budget left?        → 402 (admins exempt)
 *   6. Upstream model reachable?         → 502/503
 *
 * The model is MiniMax (MiniMax-Text-01); the key + streaming live in
 * `lib/minimax-stream.ts`. Per-student monthly token budgeting lives in
 * `lib/coach-budget.ts` and is surfaced to the widget so students self-
 * moderate.
 */
import { type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { SKILLIES_KDP_COACH_PROMPT } from "@/lib/skillies-kdp-coach-prompt";
import {
  sanitizeTurns,
  streamMiniMaxChat,
  MINIMAX_DEFAULT_MODEL,
} from "@/lib/minimax-stream";
import { estimateCostUsd } from "@/lib/anthropic-pricing";
import { getCoachBudget } from "@/lib/coach-budget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 30 messages per 5 min = generous for a real student session, tight
// enough that a runaway client loop or key-scraping bot trips the brake.
const MAX_PER_WINDOW = 30;
const WINDOW_SECONDS = 5 * 60;
const MAX_TURNS = 20;
const MAX_USER_CHARS = 4000;

function jsonError(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  // ── 1. Auth ───────────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError(401, { error: "unauthenticated" });

  // ── 2. Rate-limit by user_id ──────────────────────────────────────
  const rl = rateLimit(`coach:${user.id}`, MAX_PER_WINDOW, WINDOW_SECONDS);
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

  // ── 3. Body parse + sanitize ──────────────────────────────────────
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

  // ── 4. Enrollment / admin gate ────────────────────────────────────
  const admin = createSupabaseAdminClient();
  const [{ count: enrollCount }, { data: profile }] = await Promise.all([
    admin
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    admin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const isAdmin = !!profile?.is_admin;
  const hasEnrollment = (enrollCount ?? 0) > 0;
  if (!hasEnrollment && !isAdmin) {
    return jsonError(403, { error: "not_enrolled" });
  }

  // ── 5. Monthly token budget (admins exempt) ───────────────────────
  const budget = await getCoachBudget(admin, user.id, { unlimited: isAdmin });
  if (budget.exceeded) {
    return jsonError(402, {
      error: "budget_exceeded",
      used: budget.used,
      limit: budget.limit,
      resetAt: budget.resetAt,
    });
  }

  // ── 6. MiniMax key ────────────────────────────────────────────────
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.error("[coach] MINIMAX_API_KEY not set");
    return jsonError(500, { error: "coach_not_configured" });
  }

  // ── 7. Stream the reply (MiniMax; re-streamed by the shared lib) ───
  console.log(
    "[coach] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const result = await streamMiniMaxChat({
    apiKey,
    system: SKILLIES_KDP_COACH_PROMPT,
    messages: sanitized.turns,
    maxTokens: 1024,
    logTag: "coach",
    model: MINIMAX_DEFAULT_MODEL,
    // Log token usage + estimated cost once the reply finishes. Fire-and-
    // forget; a failed insert must never break the chat. The streaming
    // function stays alive until the relay closes, so this write lands.
    onUsage: (usage) => {
      const estimated_cost_usd = estimateCostUsd(usage);
      void admin
        .from("coach_usage")
        .insert({
          user_id: user.id,
          model: usage.model,
          input_tokens: usage.inputTokens,
          output_tokens: usage.outputTokens,
          cache_read_tokens: usage.cacheReadTokens,
          cache_creation_tokens: usage.cacheCreationTokens,
          estimated_cost_usd,
        })
        .then(({ error }) => {
          if (error) console.error("[coach] usage insert failed:", error.message);
        });
    },
  });
  if (!result.ok) {
    return jsonError(result.status, { error: result.error });
  }
  return result.response;
}
