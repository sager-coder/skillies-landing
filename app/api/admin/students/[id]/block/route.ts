/**
 * /api/admin/students/[id]/block
 *
 *   POST { blocked: boolean }   → toggle profile.blocked
 *
 * Admin-only. We use the service-role to write, scoped to the target
 * user id; the `is_admin` check happens against the caller's session
 * user, not the target.
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
    const body = (await req.json()) as { blocked?: boolean };
    if (typeof body.blocked !== "boolean") {
      return NextResponse.json(
        { error: "`blocked` must be a boolean." },
        { status: 400 },
      );
    }
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({ blocked: body.blocked })
      .eq("id", userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, blocked: body.blocked });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
