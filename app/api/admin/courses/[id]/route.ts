/**
 * /api/admin/courses/[id]
 *
 *   PATCH  → update fields on an existing course
 *   DELETE → remove the course (cascades to enrollments + lessons)
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
  // Use service-role for the is_admin read. The user-JWT path is
  // subject to RLS and can intermittently return null right after a
  // fresh sign-in (cookie propagation timing), which would 403 real
  // admins. Service-role is safe here because we've already verified
  // the caller is authenticated.
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) return { error: "Admin only.", status: 403 } as const;
  return { user } as const;
}

type Patch = {
  title?: string;
  description?: string | null;
  short_description?: string | null;
  mentor_name?: string | null;
  duration_label?: string | null;
  thumbnail_url?: string | null;
  total_lessons?: number | null;
  status?: "live" | "drafting" | "recording" | "planned";
  is_published?: boolean;
  sort_order?: number;
};

const VALID_STATUSES = ["live", "drafting", "recording", "planned"] as const;

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await ctx.params;
  try {
    const body = (await req.json()) as Patch;
    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.description !== undefined)
      updates.description = body.description?.trim() || null;
    if (body.short_description !== undefined)
      updates.short_description = body.short_description?.trim() || null;
    if (body.mentor_name !== undefined)
      updates.mentor_name = body.mentor_name?.trim() || null;
    if (body.duration_label !== undefined)
      updates.duration_label = body.duration_label?.trim() || null;
    if (body.thumbnail_url !== undefined)
      updates.thumbnail_url = body.thumbnail_url?.trim() || null;
    if (body.total_lessons !== undefined)
      updates.total_lessons = body.total_lessons ?? null;
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = body.status;
    }
    if (body.is_published !== undefined) updates.is_published = body.is_published;
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ course: data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await ctx.params;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("courses").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
