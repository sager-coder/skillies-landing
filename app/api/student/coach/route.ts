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
 *   5. All models overloaded?            → 503
 */
import { type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { SKILLIES_KDP_COACH_PROMPT } from "@/lib/skillies-kdp-coach-prompt";
import {
  ANTHROPIC_HAIKU_MODEL,
  sanitizeTurns,
  streamAnthropicChat,
} from "@/lib/anthropic-stream";

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

  // ── 5. Anthropic key ──────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[coach] ANTHROPIC_API_KEY not set");
    return jsonError(500, { error: "coach_not_configured" });
  }

  // ── 6. Stream the reply (model fallback handled in the shared lib) ─
  console.log(
    "[coach] request:",
    sanitized.turns.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const result = await streamAnthropicChat({
    apiKey,
    system: SKILLIES_KDP_COACH_PROMPT,
    messages: sanitized.turns,
    maxTokens: 1024,
    logTag: "coach",
    // Pin the student coach to Haiku (low-cost tier), no fallback.
    modelChain: [ANTHROPIC_HAIKU_MODEL],
  });
  if (!result.ok) {
    return jsonError(result.status, { error: result.error });
  }
  return result.response;
}
