/**
 * /api/admin/tickets
 *   GET  → every ticket (hydrated), newest activity first
 *   POST → create a ticket (founder). Writes a 'created' activity row
 *          (+ an 'assigned' row when an assignee is set on creation).
 *
 * Admin-only; all reads/writes go through the service-role client.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { listTickets } from "@/lib/ticket-queries";
import { isTicketPriority } from "@/lib/tickets";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const admin = createSupabaseAdminClient();
    const tickets = await listTickets(admin);
    return NextResponse.json({ tickets });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load tickets.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

type Body = {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  priority?: string;
  due_date?: string | null;
  /** "manual" (default) or "ai" when created from an AI draft. */
  source?: string;
};

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as Body;
    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const priority =
      body.priority && isTicketPriority(body.priority) ? body.priority : "medium";
    const assignee_id = body.assignee_id || null;
    const source = body.source === "ai" ? "ai" : "manual";

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("tickets")
      .insert({
        title,
        description: (body.description || "")?.toString().trim() || null,
        status: "todo",
        priority,
        assignee_id,
        created_by: guard.userId,
        due_date: body.due_date || null,
        source,
      })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create ticket." },
        { status: 500 },
      );
    }

    const activity: Record<string, unknown>[] = [
      { ticket_id: data.id, author_id: guard.userId, type: "created", body: title },
    ];
    if (assignee_id) {
      activity.push({
        ticket_id: data.id,
        author_id: guard.userId,
        type: "assigned",
        body: null,
      });
    }
    await admin.from("ticket_updates").insert(activity);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
