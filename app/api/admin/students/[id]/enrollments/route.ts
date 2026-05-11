/**
 * /api/admin/students/[id]/enrollments
 *
 *   POST   { course_id, tier? }   → grant access (upsert)
 *   DELETE { course_id }          → revoke access
 *
 * "id" is the auth user id (profiles.id). Admin-only.
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
  return { user, adminId: user.id } as const;
}

const VALID_TIERS = ["founding", "standard", "pro"] as const;

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id: userId } = await ctx.params;
  try {
    const body = (await req.json()) as { course_id?: string; tier?: string };
    const course_id = (body.course_id || "").trim();
    const tier = (body.tier || "standard") as (typeof VALID_TIERS)[number];
    if (!course_id) {
      return NextResponse.json({ error: "course_id required." }, { status: 400 });
    }
    if (!VALID_TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    // Defence-in-depth: confirm both records exist.
    const [{ data: profile }, { data: course }] = await Promise.all([
      admin.from("profiles").select("id").eq("id", userId).maybeSingle(),
      admin.from("courses").select("id").eq("id", course_id).maybeSingle(),
    ]);
    if (!profile) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const { data, error } = await admin
      .from("enrollments")
      .upsert(
        {
          user_id: userId,
          course_id,
          tier,
          enrolled_by: guard.adminId,
        },
        { onConflict: "user_id,course_id" },
      )
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ enrollment: data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id: userId } = await ctx.params;
  try {
    // Accept course_id via JSON body or ?course_id= for flexibility.
    let course_id = new URL(req.url).searchParams.get("course_id") || "";
    if (!course_id) {
      const body = await req.json().catch(() => ({})) as { course_id?: string };
      course_id = body.course_id || "";
    }
    course_id = course_id.trim();
    if (!course_id) {
      return NextResponse.json({ error: "course_id required." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("enrollments")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", course_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
