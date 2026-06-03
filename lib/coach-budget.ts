/**
 * Per-student token budget for the Skillies KDP Coach.
 *
 * Every student gets a fixed allowance of model tokens per calendar month
 * (resets on the 1st, UTC). Usage is derived from the `coach_usage` table
 * the chat already writes one row per reply into — we sum input+output
 * tokens for the current month. No extra bookkeeping table needed.
 *
 * Two callers:
 *   - /api/student/coach          → gate a send (block once over budget)
 *   - /api/student/coach/usage    → report remaining for the chat meter
 *   - /student page               → seed the meter on first paint
 *
 * The monthly cap keeps each student's spend bounded and is surfaced in
 * the widget so they self-moderate. Admins are exempt.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Admin = ReturnType<typeof createSupabaseAdminClient>;

/** Tokens (input + output) a student may spend per calendar month. */
export const COACH_MONTHLY_TOKEN_LIMIT = 1_000_000;

export type CoachBudget = {
  used: number;
  limit: number;
  remaining: number;
  /** ISO timestamp of the next reset (first of next month, UTC). */
  resetAt: string;
  /** True once the student has spent their whole monthly allowance. */
  exceeded: boolean;
  /** Admins have no cap; the widget hides the meter when true. */
  unlimited: boolean;
};

/** First instant of the current month, UTC. */
function monthStartUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** First instant of next month, UTC — when the allowance resets. */
function nextMonthStartUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

/**
 * Sum this calendar month's coach token usage for a student and return a
 * budget snapshot. `unlimited` short-circuits the sum for admins.
 *
 * The 1M cap maps to ~100 replies/month (each reply re-sends the large
 * system prompt — MiniMax has no prompt caching), so a student never
 * approaches Supabase's 1000-row select cap before being blocked.
 */
export async function getCoachBudget(
  admin: Admin,
  userId: string,
  opts: { unlimited?: boolean; now?: Date } = {},
): Promise<CoachBudget> {
  const now = opts.now ?? new Date();
  const resetAt = nextMonthStartUTC(now).toISOString();

  if (opts.unlimited) {
    return {
      used: 0,
      limit: COACH_MONTHLY_TOKEN_LIMIT,
      remaining: COACH_MONTHLY_TOKEN_LIMIT,
      resetAt,
      exceeded: false,
      unlimited: true,
    };
  }

  const since = monthStartUTC(now).toISOString();
  const { data, error } = await admin
    .from("coach_usage")
    .select("input_tokens, output_tokens")
    .eq("user_id", userId)
    .gte("created_at", since);

  let used = 0;
  if (error) {
    // Fail open: a usage-read hiccup must never wrongly lock a student
    // out of the coach. We log and treat them as having spent nothing.
    console.error("[coach-budget] usage read failed:", error.message);
  } else if (data) {
    for (const row of data) {
      used += (row.input_tokens ?? 0) + (row.output_tokens ?? 0);
    }
  }

  const remaining = Math.max(0, COACH_MONTHLY_TOKEN_LIMIT - used);
  return {
    used,
    limit: COACH_MONTHLY_TOKEN_LIMIT,
    remaining,
    resetAt,
    exceeded: used >= COACH_MONTHLY_TOKEN_LIMIT,
    unlimited: false,
  };
}
