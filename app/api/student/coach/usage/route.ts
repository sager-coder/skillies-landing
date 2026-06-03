/**
 * GET /api/student/coach/usage — the caller's KDP Coach token budget for
 * the current calendar month. Powers the live "tokens left" meter in the
 * chat widget; the widget refetches this after each reply.
 *
 * Auth only — any logged-in user may read their own budget. (The send
 * endpoint, not this one, enforces enrollment + the cap.) Admins come
 * back `unlimited`.
 */
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getCoachBudget } from "@/lib/coach-budget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const budget = await getCoachBudget(admin, user.id, {
    unlimited: !!profile?.is_admin,
  });

  return new Response(JSON.stringify(budget), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
