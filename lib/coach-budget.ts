/**
 * Token budget for the Skillies KDP Coach.
 *
 * The coach is UNLIMITED — every enrolled student gets uncapped token
 * usage, so this never gates a send. We still record one `coach_usage`
 * row per reply (see /api/student/coach) for analytics, but that data no
 * longer feeds a cap.
 *
 * Callers:
 *   - /api/student/coach          → send gate (now always allowed)
 *   - /api/student/coach/usage    → powers the chat meter (hidden now)
 *   - /student page               → seed the meter on first paint
 *
 * `getCoachBudget` always returns `unlimited: true`, which makes the
 * widget hide the token meter and never lock the composer.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Admin = ReturnType<typeof createSupabaseAdminClient>;

/**
 * Nominal monthly figure kept only to populate the budget snapshot's
 * `limit`/`remaining` fields. The meter is hidden while `unlimited` is
 * true, so this value is never shown to students.
 */
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

/** First instant of next month, UTC — kept only to fill `resetAt`. */
function nextMonthStartUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

/**
 * Return the coach budget snapshot. The coach is unlimited for everyone,
 * so this always reports an uncapped allowance (`unlimited: true`) without
 * reading any usage — there's no cap to enforce.
 *
 * The `admin`/`userId` params and the `opts.unlimited` flag are retained
 * so existing callers stay unchanged and re-introducing a cap later is a
 * single-function edit.
 */
export async function getCoachBudget(
  _admin: Admin,
  _userId: string,
  opts: { unlimited?: boolean; now?: Date } = {},
): Promise<CoachBudget> {
  const now = opts.now ?? new Date();
  const resetAt = nextMonthStartUTC(now).toISOString();

  return {
    used: 0,
    limit: COACH_MONTHLY_TOKEN_LIMIT,
    remaining: COACH_MONTHLY_TOKEN_LIMIT,
    resetAt,
    exceeded: false,
    unlimited: true,
  };
}
