/**
 * /api/tickets/[id]/update — the EMPLOYEE write path.
 *   POST { status?, note? } → change status and/or post a progress note
 *   on a ticket assigned to the caller.
 *
 * Any signed-in user may call it, but we verify the ticket is assigned
 * to them before touching anything. Writes go through service-role so we
 * can update the ticket and append the activity row together; RLS on the
 * tables is the second line of defense.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/api-guards";
import { isTicketStatus } from "@/lib/tickets";

export const runtime = "nodejs";

type Body = { status?: string; note?: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await ctx.params;
  try {
    const admin = createSupabaseAdminClient();
    const { data: cur } = await admin
      .from("tickets")
      .select("status, assignee_id")
      .eq("id", id)
      .maybeSingle();
    if (!cur) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    if (cur.assignee_id !== guard.userId) {
      return NextResponse.json(
        { error: "This task isn't assigned to you." },
        { status: 403 },
      );
    }

    const body = (await req.json()) as Body;
    const note = (body.note || "").trim();
    const updates: Record<string, unknown> = {};
    const activity: Record<string, unknown>[] = [];
    const now = new Date().toISOString();

    if (body.status !== undefined && body.status !== cur.status) {
      if (!isTicketStatus(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = body.status;
      updates.done_at = body.status === "done" ? now : null;
      activity.push({
        ticket_id: id,
        author_id: guard.userId,
        type: "status_change",
        old_status: cur.status,
        new_status: body.status,
      });
    }

    if (note) {
      activity.push({
        ticket_id: id,
        author_id: guard.userId,
        type: "comment",
        body: note,
      });
    }

    if (activity.length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    // Bump updated_at on any activity so the ticket surfaces in the
    // founder's "recent activity" view.
    updates.updated_at = now;
    const { error: upErr } = await admin
      .from("tickets")
      .update(updates)
      .eq("id", id);
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
    await admin.from("ticket_updates").insert(activity);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
