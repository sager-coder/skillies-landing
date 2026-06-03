/**
 * /api/admin/ask — Phase 3 "ask anything".
 *   POST { question } → a plain-language answer generated from a compact
 *   snapshot of the live task data (open tasks + today's activity).
 *
 * Admin-only. Context is bounded (open tickets + today's log) to keep
 * token cost low.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import {
  listTickets,
  getRecentActivity,
  startOfTodayISO,
  todayDateISO,
} from "@/lib/ticket-queries";
import { answerQuestion, TicketAiError } from "@/lib/ticket-ai";
import { STATUS_LABEL } from "@/lib/tickets";

export const runtime = "nodejs";

function timeIST(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as { question?: string };
    const question = (body.question || "").trim();
    if (!question) {
      return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const since = startOfTodayISO();
    const tickets = await listTickets(admin);
    const activity = await getRecentActivity(admin, since);

    const today = todayDateISO();
    const open = tickets.filter((t) => t.status !== "done");
    const doneToday = tickets.filter((t) => t.done_at && t.done_at >= since);

    const openLines = open.length
      ? open
          .map(
            (t) =>
              `- [${STATUS_LABEL[t.status]}, ${t.priority}] "${t.title}" — ${
                t.assignee?.name || "Unassigned"
              }${t.due_date ? `, due ${t.due_date}${t.due_date < today ? " (OVERDUE)" : ""}` : ""}`,
          )
          .join("\n")
      : "(none)";

    const doneLines = doneToday.length
      ? doneToday.map((t) => `- "${t.title}" — ${t.assignee?.name || "Unassigned"}`).join("\n")
      : "(none)";

    const activityLines = activity.length
      ? activity
          .map((a) => {
            const who = a.author?.name || "Someone";
            if (a.type === "created") return `- ${timeIST(a.created_at)} ${who} created "${a.ticket_title}"`;
            if (a.type === "assigned") return `- ${timeIST(a.created_at)} ${who} reassigned "${a.ticket_title}"`;
            if (a.type === "status_change")
              return `- ${timeIST(a.created_at)} ${who} moved "${a.ticket_title}" to ${
                a.new_status ? STATUS_LABEL[a.new_status] : "?"
              }`;
            return `- ${timeIST(a.created_at)} ${who} noted on "${a.ticket_title}": ${a.body || ""}`;
          })
          .join("\n")
      : "(no activity logged today)";

    const context = [
      `OPEN TASKS (${open.length}):`,
      openLines,
      "",
      `COMPLETED TODAY (${doneToday.length}):`,
      doneLines,
      "",
      `TODAY'S ACTIVITY (${activity.length}):`,
      activityLines,
    ].join("\n");

    const todayLabel = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const answer = await answerQuestion({ question, context, todayLabel });
    return NextResponse.json({ answer });
  } catch (e: unknown) {
    if (e instanceof TicketAiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
