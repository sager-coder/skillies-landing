/**
 * /api/admin/tickets/[id]
 *   GET   → one ticket + its full activity log
 *   PATCH → update fields (status / priority / assignee / due / title /
 *           description). Status + assignee changes write an activity
 *           row so the timeline (and the future AI digest) stay honest.
 *
 * Admin-only; service-role throughout.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { getTicket, getTicketActivity } from "@/lib/ticket-queries";
import { isTicketPriority, isTicketStatus } from "@/lib/tickets";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await ctx.params;
  try {
    const admin = createSupabaseAdminClient();
    const ticket = await getTicket(admin, id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }
    const updates = await getTicketActivity(admin, id);
    return NextResponse.json({ ticket, updates });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load ticket.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

type Patch = {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  assignee_id?: string | null;
  due_date?: string | null;
  /** Optional progress note to append to the activity log. */
  comment?: string;
};

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
    const admin = createSupabaseAdminClient();
    const { data: cur } = await admin
      .from("tickets")
      .select("status, assignee_id")
      .eq("id", id)
      .maybeSingle();
    if (!cur) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    const body = (await req.json()) as Patch;
    const updates: Record<string, unknown> = {};
    const activity: Record<string, unknown>[] = [];
    const now = new Date().toISOString();

    if (body.title !== undefined) {
      const t = body.title.trim();
      if (!t) {
        return NextResponse.json(
          { error: "Title can't be empty." },
          { status: 400 },
        );
      }
      updates.title = t;
    }
    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null;
    }
    if (body.priority !== undefined) {
      if (!isTicketPriority(body.priority)) {
        return NextResponse.json({ error: "Invalid priority." }, { status: 400 });
      }
      updates.priority = body.priority;
    }
    if (body.due_date !== undefined) {
      updates.due_date = body.due_date || null;
    }
    if (
      body.assignee_id !== undefined &&
      (body.assignee_id || null) !== cur.assignee_id
    ) {
      updates.assignee_id = body.assignee_id || null;
      activity.push({
        ticket_id: id,
        author_id: guard.userId,
        type: "assigned",
        body: null,
      });
    }
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

    const comment = (body.comment || "").trim();
    if (comment) {
      activity.push({
        ticket_id: id,
        author_id: guard.userId,
        type: "comment",
        body: comment,
      });
    }

    if (Object.keys(updates).length === 0 && activity.length === 0) {
      return NextResponse.json({ ok: true, unchanged: true });
    }

    // Always bump updated_at so any change (incl. a comment) surfaces in
    // the founder's recent-activity ordering.
    updates.updated_at = now;
    const { error: upErr } = await admin
      .from("tickets")
      .update(updates)
      .eq("id", id);
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
    if (activity.length) {
      await admin.from("ticket_updates").insert(activity);
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
