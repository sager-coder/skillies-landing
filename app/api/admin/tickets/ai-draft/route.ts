/**
 * /api/admin/tickets/ai-draft — Phase 2.
 *   POST { text } → drafts (NOT saved). The founder reviews + confirms,
 *   then the client creates them via POST /api/admin/tickets (source:ai).
 *
 * Admin-only.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { personName } from "@/lib/ticket-queries";
import { draftTicketsFromText, TicketAiError } from "@/lib/ticket-ai";

export const runtime = "nodejs";

type TeamMember = { id: string; name: string };

/** Best-effort match of the model's free-text name to a real teammate. */
function matchAssignee(name: string | null, team: TeamMember[]): TeamMember | null {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  if (!n) return null;
  return (
    team.find((t) => t.name.toLowerCase() === n) ||
    team.find((t) => t.name.toLowerCase().split(/\s+/)[0] === n) ||
    team.find(
      (t) =>
        t.name.toLowerCase().includes(n) || n.includes(t.name.toLowerCase()),
    ) ||
    null
  );
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as { text?: string };
    const text = (body.text || "").trim();
    if (!text) {
      return NextResponse.json(
        { error: "Paste a note first." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("id, full_name, first_name, last_name, phone, email")
      .eq("is_team_member", true);
    const team: TeamMember[] = (data || []).map((p) => ({
      id: p.id,
      name: personName(p),
    }));

    const now = new Date();
    const todayLabel = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const aiDrafts = await draftTicketsFromText({ text, team, todayLabel });

    const drafts = aiDrafts.map((d) => {
      const match = matchAssignee(d.assignee_name, team);
      return {
        title: d.title,
        description: d.description,
        priority: d.priority,
        due_date: d.due_date,
        assignee_id: match?.id || null,
        assignee_name: match?.name || null,
      };
    });

    return NextResponse.json({ drafts });
  } catch (e: unknown) {
    if (e instanceof TicketAiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
