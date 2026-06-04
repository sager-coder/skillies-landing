/**
 * /api/admin/team/[id]
 *   PATCH  { password }  → reset an employee's login password
 *   DELETE               → remove the employee (deletes their login;
 *                          their tasks stay but become unassigned)
 *
 * Admin-only. Refuses to touch non-team-members / admins for safety.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { MIN_PASSWORD_LENGTH } from "@/lib/staff-auth";

export const runtime = "nodejs";

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
    const body = (await req.json()) as { password?: string };
    const password = body.password || "";
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 },
      );
    }
    const admin = createSupabaseAdminClient();
    const { data: prof } = await admin
      .from("profiles")
      .select("is_team_member")
      .eq("id", id)
      .maybeSingle();
    if (!prof?.is_team_member) {
      return NextResponse.json({ error: "Not a team member." }, { status: 404 });
    }
    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
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
  try {
    if (id === guard.userId) {
      return NextResponse.json({ error: "You can't delete yourself." }, { status: 400 });
    }
    const admin = createSupabaseAdminClient();
    const { data: prof } = await admin
      .from("profiles")
      .select("is_team_member, is_admin")
      .eq("id", id)
      .maybeSingle();
    if (!prof) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (prof.is_admin) {
      return NextResponse.json({ error: "Can't delete an admin here." }, { status: 400 });
    }
    // Deleting the auth user cascades the profile; their tickets'
    // assignee_id / activity author_id are set null by the FK rules.
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
