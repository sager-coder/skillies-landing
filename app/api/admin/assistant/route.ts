/**
 * /api/admin/assistant — the /ehsan voice/text manager.
 *   POST { messages: [{role,content}] } → { reply, performed }
 *
 * Runs the agentic loop (create/update tasks via tools, or summarize)
 * and returns a short text reply. Admin-only.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { runAssistant, type AssistantTurn } from "@/lib/ticket-assistant";
import { TicketAiError } from "@/lib/ticket-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as { messages?: AssistantTurn[] };
    const messages: AssistantTurn[] = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim().length > 0,
          )
          .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }))
      : [];
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Send a message first." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { reply, performed } = await runAssistant({
      admin,
      userId: guard.userId,
      messages,
    });
    return NextResponse.json({ reply, performed });
  } catch (e: unknown) {
    if (e instanceof TicketAiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
