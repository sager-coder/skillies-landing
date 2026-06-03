/**
 * The /ehsan voice/text assistant — an agentic Claude loop that can
 * actually act on the founder's request:
 *   - create_task / update_task  → tool calls executed against the DB
 *   - summaries + questions       → answered directly from live context
 *
 * Returns a short text reply (shown in the WhatsApp-style chat) plus a
 * list of actions performed. Server-only (needs the service-role client).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { ANTHROPIC_MODEL_CHAIN } from "@/lib/anthropic-stream";
import { TicketAiError } from "@/lib/ticket-ai";
import {
  listTickets,
  getRecentActivity,
  personName,
  startOfTodayISO,
  todayDateISO,
} from "@/lib/ticket-queries";
import { STATUS_LABEL, isTicketPriority, isTicketStatus } from "@/lib/tickets";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type AssistantTurn = { role: "user" | "assistant"; content: string };

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string };

type AnthropicMessage = { role: "user" | "assistant"; content: string | ContentBlock[] };
type AnthropicResponse = { content?: ContentBlock[]; stop_reason?: string };

const TOOLS = [
  {
    name: "create_task",
    description: "Create a new task and (optionally) assign it to an employee.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Short imperative task title." },
        assignee_id: { type: "string", description: "id from the EMPLOYEES list, or empty if unassigned." },
        priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
        due_date: { type: "string", description: "YYYY-MM-DD, or empty." },
        description: { type: "string", description: "Optional detail, or empty." },
      },
      required: ["title"],
    },
  },
  {
    name: "update_task",
    description: "Change an existing task's status/assignee/priority/due date, or add a progress note.",
    input_schema: {
      type: "object" as const,
      properties: {
        task_id: { type: "string", description: "id from the OPEN TASKS list." },
        status: { type: "string", enum: ["todo", "in_progress", "blocked", "done"] },
        assignee_id: { type: "string", description: "id from the EMPLOYEES list." },
        priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
        due_date: { type: "string", description: "YYYY-MM-DD." },
        comment: { type: "string", description: "A note to add to the task." },
      },
      required: ["task_id"],
    },
  },
];

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function callAnthropic(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<AnthropicResponse> {
  let lastErr = "";
  for (const model of ANTHROPIC_MODEL_CHAIN) {
    let resp: Response;
    try {
      resp = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({ ...body, model }),
      });
    } catch (e) {
      lastErr = e instanceof Error ? e.message : "fetch failed";
      continue;
    }
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      if (/credit|billing|balance|too low/i.test(errBody)) {
        throw new TicketAiError(
          "AI credits are exhausted. Add credits in the Anthropic console (Plans & Billing), then try again.",
          402,
        );
      }
      lastErr = `${resp.status}`;
      continue;
    }
    try {
      return (await resp.json()) as AnthropicResponse;
    } catch {
      lastErr = "bad JSON";
      continue;
    }
  }
  throw new TicketAiError(`AI is busy right now (${lastErr}). Try again.`, 503);
}

async function buildSystem(admin: SupabaseClient): Promise<string> {
  const tickets = await listTickets(admin);
  const open = tickets.filter((t) => t.status !== "done").slice(0, 60);
  const activity = await getRecentActivity(admin, startOfTodayISO());
  const { data: teamRows } = await admin
    .from("profiles")
    .select("id, full_name, first_name, last_name, phone, email")
    .eq("is_team_member", true);
  const team = (teamRows || []).map((p) => ({ id: p.id, name: personName(p) }));
  const today = todayDateISO();

  const employees = team.length
    ? team.map((m) => `- ${m.name} [id: ${m.id}]`).join("\n")
    : "(no employees added yet)";

  const openTasks = open.length
    ? open
        .map(
          (t) =>
            `- "${t.title}" [id: ${t.id}] · ${STATUS_LABEL[t.status]} · ${
              t.assignee?.name || "Unassigned"
            } · ${t.priority}${t.due_date ? ` · due ${t.due_date}${t.due_date < today ? " (OVERDUE)" : ""}` : ""}`,
        )
        .join("\n")
    : "(no open tasks)";

  const activityLines = activity.length
    ? activity
        .map((a) => {
          const who = a.author?.name || "Someone";
          if (a.type === "created") return `- ${who} created "${a.ticket_title}"`;
          if (a.type === "assigned") return `- ${who} reassigned "${a.ticket_title}"`;
          if (a.type === "status_change")
            return `- ${who} moved "${a.ticket_title}" to ${a.new_status ? STATUS_LABEL[a.new_status] : "?"}`;
          return `- ${who} noted on "${a.ticket_title}": ${a.body || ""}`;
        })
        .join("\n")
    : "(no activity logged today)";

  return [
    "You are the employee-management assistant for a founder (Ehsan). He talks to you by voice or text to run his team.",
    `Today is ${today}.`,
    "",
    "What you can do:",
    "- Create tasks (create_task) and assign them to an employee by id.",
    "- Update tasks (update_task): change status/assignee/priority/due date, or add a note. Use the task_id from OPEN TASKS.",
    "- Answer questions and give summaries directly from the data below — do NOT call a tool for those.",
    "",
    "Style: reply like a short WhatsApp message. Confirm any action in one concise sentence, using names. If you can't find a task/employee the user means, ask a brief clarifying question instead of guessing.",
    "",
    "EMPLOYEES (use the id to assign):",
    employees,
    "",
    "OPEN TASKS (use task_id to update):",
    openTasks,
    "",
    "TODAY'S ACTIVITY:",
    activityLines,
  ].join("\n");
}

async function executeTool(
  admin: SupabaseClient,
  userId: string,
  name: string,
  input: Record<string, unknown>,
  performed: string[],
): Promise<string> {
  const now = new Date().toISOString();

  if (name === "create_task") {
    const title = str(input.title);
    if (!title) return "Error: a title is required.";
    const priority = isTicketPriority(input.priority) ? input.priority : "medium";
    const assignee_id = str(input.assignee_id) || null;
    const due = str(input.due_date);
    const { data, error } = await admin
      .from("tickets")
      .insert({
        title,
        description: str(input.description) || null,
        status: "todo",
        priority,
        assignee_id,
        created_by: userId,
        due_date: DATE_RE.test(due) ? due : null,
        source: "ai",
      })
      .select("id")
      .single();
    if (error || !data) return `Error creating task: ${error?.message || "unknown"}`;
    const acts: Record<string, unknown>[] = [
      { ticket_id: data.id, author_id: userId, type: "created", body: title },
    ];
    if (assignee_id)
      acts.push({ ticket_id: data.id, author_id: userId, type: "assigned", body: null });
    await admin.from("ticket_updates").insert(acts);
    performed.push(`Created "${title}"`);
    return `Created task "${title}".`;
  }

  if (name === "update_task") {
    const id = str(input.task_id);
    if (!id) return "Error: task_id is required.";
    const { data: cur } = await admin
      .from("tickets")
      .select("status, assignee_id, title")
      .eq("id", id)
      .maybeSingle();
    if (!cur) return "Error: that task wasn't found.";
    const updates: Record<string, unknown> = {};
    const acts: Record<string, unknown>[] = [];

    const newAssignee = input.assignee_id !== undefined ? str(input.assignee_id) || null : undefined;
    if (newAssignee !== undefined && newAssignee !== cur.assignee_id) {
      updates.assignee_id = newAssignee;
      acts.push({ ticket_id: id, author_id: userId, type: "assigned", body: null });
    }
    if (isTicketPriority(input.priority)) updates.priority = input.priority;
    const due = str(input.due_date);
    if (DATE_RE.test(due)) updates.due_date = due;
    if (isTicketStatus(input.status) && input.status !== cur.status) {
      updates.status = input.status;
      updates.done_at = input.status === "done" ? now : null;
      acts.push({
        ticket_id: id,
        author_id: userId,
        type: "status_change",
        old_status: cur.status,
        new_status: input.status,
      });
    }
    const comment = str(input.comment);
    if (comment) acts.push({ ticket_id: id, author_id: userId, type: "comment", body: comment });

    if (Object.keys(updates).length === 0 && acts.length === 0) return "Nothing to change on that task.";
    updates.updated_at = now;
    await admin.from("tickets").update(updates).eq("id", id);
    if (acts.length) await admin.from("ticket_updates").insert(acts);
    performed.push(`Updated "${cur.title}"`);
    return `Updated task "${cur.title}".`;
  }

  return "Unknown tool.";
}

export async function runAssistant(opts: {
  admin: SupabaseClient;
  userId: string;
  messages: AssistantTurn[];
}): Promise<{ reply: string; performed: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new TicketAiError("AI isn't configured (missing ANTHROPIC_API_KEY).", 500);
  }

  const system = await buildSystem(opts.admin);
  const messages: AnthropicMessage[] = opts.messages
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));
  const performed: string[] = [];

  for (let i = 0; i < 5; i++) {
    const data = await callAnthropic(apiKey, {
      max_tokens: 1024,
      system,
      tools: TOOLS,
      messages,
    });
    const content = data.content || [];
    const toolUses = content.filter(
      (b): b is Extract<ContentBlock, { type: "tool_use" }> => b.type === "tool_use",
    );

    if (toolUses.length === 0) {
      const text = content
        .filter((b): b is Extract<ContentBlock, { type: "text" }> => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      return { reply: text || "Done.", performed };
    }

    messages.push({ role: "assistant", content });
    const results: ContentBlock[] = [];
    for (const tu of toolUses) {
      const out = await executeTool(opts.admin, opts.userId, tu.name, tu.input, performed);
      results.push({ type: "tool_result", tool_use_id: tu.id, content: out });
    }
    messages.push({ role: "user", content: results });
  }

  return {
    reply: performed.length ? `Done: ${performed.join(", ")}.` : "Done.",
    performed,
  };
}
