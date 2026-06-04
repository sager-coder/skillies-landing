/**
 * The /ehsan voice/text assistant, powered by Gemini (free tier).
 *
 * One call → the model returns JSON: a short reply + a list of actions
 * (create_task / update_task). We execute the actions against the DB and
 * return the reply. Questions/summaries come back as reply with no
 * actions. Provider-agnostic: no tool-calling plumbing.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { geminiComplete, parseLlmJson } from "@/lib/gemini";
import {
  listTickets,
  getRecentActivity,
  personName,
  startOfTodayISO,
  todayDateISO,
} from "@/lib/ticket-queries";
import { STATUS_LABEL, isTicketPriority, isTicketStatus } from "@/lib/tickets";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type AssistantTurn = { role: "user" | "assistant"; content: string };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function buildContext(admin: SupabaseClient): Promise<string> {
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
    `Today is ${today}.`,
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

const INSTRUCTIONS = [
  "You are the employee-management assistant for a founder (Ehsan). He talks to you by voice or text to run his team.",
  "",
  "Output ONLY JSON (no prose, no code fences) of this exact shape:",
  '{"reply":"<short WhatsApp-style message back to Ehsan>","actions":[]}',
  "",
  "Each item in actions is ONE of:",
  '- {"type":"create_task","title":"...","assignee_id":"<id from EMPLOYEES or empty>","priority":"low|medium|high|urgent","due_date":"YYYY-MM-DD or empty","description":""}',
  '- {"type":"update_task","task_id":"<id from OPEN TASKS>","status":"todo|in_progress|blocked|done","assignee_id":"...","priority":"...","due_date":"...","comment":"..."}',
  '- {"type":"delete_task","task_id":"<id from OPEN TASKS>"}',
  "",
  "Rules:",
  "- You CAN create, update, and delete tasks. (You cannot add/remove employees — that's done on the Employees tab.)",
  "- Delete a task only when the user clearly asks to delete/remove it. Confirm what you deleted in the reply.",
  '- For questions or summaries (e.g. "what happened today?"), set actions to [] and put the full answer in reply.',
  "- When you create/update, confirm briefly in reply using names (e.g. \"Created the supplier call for Ramesh, urgent.\").",
  "- For update_task include ONLY the fields you want to change.",
  "- Use ids exactly as listed below in the ACTIONS. If you can't find the task/employee meant, set actions to [] and ask a short clarifying question in reply.",
  "- NEVER show internal ids in the reply text — refer to tasks by their title and people by name.",
  "- Resolve relative dates (tomorrow, Friday, etc.) to YYYY-MM-DD using today's date.",
].join("\n");

async function executeAction(
  admin: SupabaseClient,
  userId: string,
  action: Record<string, unknown>,
  performed: string[],
): Promise<string> {
  const type = str(action.type);
  const now = new Date().toISOString();

  if (type === "create_task") {
    const title = str(action.title);
    if (!title) return "Error: a task title was missing.";
    const priority = isTicketPriority(action.priority) ? action.priority : "medium";
    const assignee_id = str(action.assignee_id) || null;
    const due = str(action.due_date);
    const { data, error } = await admin
      .from("tickets")
      .insert({
        title,
        description: str(action.description) || null,
        status: "todo",
        priority,
        assignee_id,
        created_by: userId,
        due_date: DATE_RE.test(due) ? due : null,
        source: "ai",
      })
      .select("id")
      .single();
    if (error || !data) return `Error creating "${title}": ${error?.message || "unknown"}`;
    const acts: Record<string, unknown>[] = [
      { ticket_id: data.id, author_id: userId, type: "created", body: title },
    ];
    if (assignee_id)
      acts.push({ ticket_id: data.id, author_id: userId, type: "assigned", body: null });
    await admin.from("ticket_updates").insert(acts);
    performed.push(`Created "${title}"`);
    return `Created "${title}".`;
  }

  if (type === "update_task") {
    const id = str(action.task_id);
    if (!id) return "Error: no task id given.";
    const { data: cur } = await admin
      .from("tickets")
      .select("status, assignee_id, title")
      .eq("id", id)
      .maybeSingle();
    if (!cur) return "Error: that task wasn't found.";
    const updates: Record<string, unknown> = {};
    const acts: Record<string, unknown>[] = [];

    const newAssignee = action.assignee_id !== undefined ? str(action.assignee_id) || null : undefined;
    if (newAssignee !== undefined && newAssignee !== cur.assignee_id) {
      updates.assignee_id = newAssignee;
      acts.push({ ticket_id: id, author_id: userId, type: "assigned", body: null });
    }
    if (isTicketPriority(action.priority)) updates.priority = action.priority;
    const due = str(action.due_date);
    if (DATE_RE.test(due)) updates.due_date = due;
    if (isTicketStatus(action.status) && action.status !== cur.status) {
      updates.status = action.status;
      updates.done_at = action.status === "done" ? now : null;
      acts.push({
        ticket_id: id,
        author_id: userId,
        type: "status_change",
        old_status: cur.status,
        new_status: action.status,
      });
    }
    const comment = str(action.comment);
    if (comment) acts.push({ ticket_id: id, author_id: userId, type: "comment", body: comment });

    if (Object.keys(updates).length === 0 && acts.length === 0)
      return `Nothing to change on "${cur.title}".`;
    updates.updated_at = now;
    await admin.from("tickets").update(updates).eq("id", id);
    if (acts.length) await admin.from("ticket_updates").insert(acts);
    performed.push(`Updated "${cur.title}"`);
    return `Updated "${cur.title}".`;
  }

  if (type === "delete_task") {
    const id = str(action.task_id);
    if (!id) return "Error: no task id given.";
    const { data: cur } = await admin
      .from("tickets")
      .select("title")
      .eq("id", id)
      .maybeSingle();
    if (!cur) return "Error: that task wasn't found.";
    // ticket_updates rows cascade-delete via the FK.
    const { error } = await admin.from("tickets").delete().eq("id", id);
    if (error) return `Error deleting "${cur.title}": ${error.message}`;
    performed.push(`Deleted "${cur.title}"`);
    return `Deleted "${cur.title}".`;
  }

  return `Unknown action: ${type}`;
}

export async function runAssistant(opts: {
  admin: SupabaseClient;
  userId: string;
  messages: AssistantTurn[];
}): Promise<{ reply: string; performed: string[] }> {
  const context = await buildContext(opts.admin);
  const system = `${INSTRUCTIONS}\n\n${context}`;
  const messages = opts.messages.slice(-12);

  const raw = await geminiComplete({ system, messages, json: true, maxTokens: 1024 });
  const parsed = parseLlmJson<{ reply?: string; actions?: Record<string, unknown>[] }>(raw);

  if (!parsed) {
    // Model didn't return clean JSON — surface whatever text it gave.
    return { reply: raw.trim() || "Sorry, try rephrasing that.", performed: [] };
  }

  const performed: string[] = [];
  const failures: string[] = [];
  const actions = Array.isArray(parsed.actions) ? parsed.actions : [];
  for (const action of actions) {
    if (!action || typeof action !== "object") continue;
    const result = await executeAction(opts.admin, opts.userId, action, performed);
    if (/^(Error|Nothing|Unknown)/.test(result)) failures.push(result);
  }

  let reply = str(parsed.reply);
  if (!reply) reply = performed.length ? `Done: ${performed.join(", ")}.` : "Done.";
  if (failures.length) reply += `\n\n⚠️ ${failures.join(" ")}`;

  return { reply, performed };
}
