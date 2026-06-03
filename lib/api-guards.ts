/**
 * Auth guards for route handlers.
 *
 * Returns either `{ userId }` on success or `{ error, status }` on
 * failure, so callers narrow with `if ("error" in guard) …` — the same
 * idiom the existing /api/admin/* routes use.
 *
 * The is_admin read deliberately goes through the service-role client:
 * the user-JWT path is subject to RLS and can intermittently return
 * null right after a fresh OTP sign-in (cookie propagation timing),
 * which would 403 a real admin. We've already verified the caller is
 * authenticated before that read, so service-role is safe here.
 */
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export type GuardResult =
  | { userId: string }
  | { error: string; status: number };

export async function requireUser(): Promise<GuardResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 };
  return { userId: user.id };
}

export async function requireAdmin(): Promise<GuardResult> {
  const base = await requireUser();
  if ("error" in base) return base;
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", base.userId)
    .maybeSingle();
  if (!profile?.is_admin) return { error: "Admin only.", status: 403 };
  return base;
}
