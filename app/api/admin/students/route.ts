/**
 * /api/admin/students — GET list of all signed-up users (profiles)
 * with their enrollments hydrated. Supports ?q= for a phone/name/email
 * substring filter.
 *
 * "Every user who logs in shows up here" — exactly what the user asked
 * for: after a student logs in via phone-OTP, the trigger creates a
 * profiles row, and they appear in this list for the admin to grant
 * course access.
 */
import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 } as const;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return { error: "Admin only.", status: 403 } as const;
  return { user } as const;
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 100), 500);

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("profiles")
    .select(
      "id, phone, first_name, last_name, full_name, email, is_admin, blocked, bound_device_id, device_bound_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (q) {
    // case-insensitive substring across phone, name, email
    const safe = q.replace(/[%,]/g, "");
    query = query.or(
      `phone.ilike.%${safe}%,full_name.ilike.%${safe}%,email.ilike.%${safe}%`,
    );
  }

  const { data: profiles, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hydrate enrollments per user in one round-trip.
  const userIds = (profiles || []).map((p) => p.id);
  const { data: enrollments } = userIds.length
    ? await admin
        .from("enrollments")
        .select("user_id, course_id, tier, enrolled_at")
        .in("user_id", userIds)
    : { data: [] };

  const byUser = new Map<
    string,
    { course_id: string; tier: string; enrolled_at: string }[]
  >();
  for (const e of enrollments || []) {
    const list = byUser.get(e.user_id) || [];
    list.push({
      course_id: e.course_id,
      tier: e.tier,
      enrolled_at: e.enrolled_at,
    });
    byUser.set(e.user_id, list);
  }

  const result = (profiles || []).map((p) => ({
    ...p,
    enrollments: byUser.get(p.id) || [],
  }));
  return NextResponse.json({ students: result });
}
