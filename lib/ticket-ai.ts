/**
 * AI helpers for the ticketing system, powered by Gemini (free tier — no
 * paid credits). Two functions:
 *   - draftTicketsFromText: messy note → clean ticket drafts (JSON)
 *   - answerQuestion:       founder's question → plain-text answer
 *
 * Same signatures as before so the routes are unchanged.
 */
import { geminiComplete, parseLlmJson } from "@/lib/gemini";
import { isTicketPriority, type TicketPriority } from "@/lib/tickets";

// Re-export so existing imports (`from "@/lib/ticket-ai"`) keep working.
export { TicketAiError } from "@/lib/ai-error";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export type AiDraft = {
  title: string;
  description: string | null;
  /** Raw name the model picked from the team list (may be empty). */
  assignee_name: string | null;
  priority: TicketPriority;
  /** YYYY-MM-DD or null. */
  due_date: string | null;
};

type RawDraft = {
  title?: unknown;
  description?: unknown;
  assignee_name?: unknown;
  priority?: unknown;
  due_date?: unknown;
};

export async function draftTicketsFromText(opts: {
  text: string;
  team: { id: string; name: string }[];
  todayLabel: string;
}): Promise<AiDraft[]> {
  const teamList =
    opts.team.length > 0
      ? opts.team.map((t) => `- ${t.name}`).join("\n")
      : "(no team members added yet)";

  const system = [
    "You convert a manager's quick, messy note into a clean list of work tickets.",
    `Today is ${opts.todayLabel}.`,
    "",
    "Team members you can assign to:",
    teamList,
    "",
    "Output ONLY a JSON object of this exact shape (no prose, no code fences):",
    '{"tickets":[{"title":"","description":"","assignee_name":"","priority":"low|medium|high|urgent","due_date":"YYYY-MM-DD or empty"}]}',
    "",
    "Rules:",
    "- One ticket per distinct task. If there is no real task, return {\"tickets\":[]}.",
    "- title: short and imperative.",
    "- assignee_name: copy the EXACT matching name from the team list when clear; otherwise empty.",
    "- priority: infer from urgency words ('urgent','asap','today' => urgent/high); default medium.",
    "- due_date: resolve any date/weekday to YYYY-MM-DD relative to today; empty if none.",
  ].join("\n");

  const raw = await geminiComplete({
    system,
    messages: [{ role: "user", content: opts.text.slice(0, 6000) }],
    json: true,
    maxTokens: 1500,
  });

  const parsed = parseLlmJson<{ tickets?: RawDraft[] }>(raw);
  const list = parsed && Array.isArray(parsed.tickets) ? parsed.tickets : [];

  return list
    .map((r): AiDraft | null => {
      const title = str(r.title);
      if (!title) return null;
      const priority: TicketPriority = isTicketPriority(r.priority) ? r.priority : "medium";
      const due = str(r.due_date);
      return {
        title,
        description: str(r.description) || null,
        assignee_name: str(r.assignee_name) || null,
        priority,
        due_date: DATE_RE.test(due) ? due : null,
      };
    })
    .filter((d): d is AiDraft => d !== null);
}

export async function answerQuestion(opts: {
  question: string;
  context: string;
  todayLabel: string;
}): Promise<string> {
  const system = [
    "You are an assistant for a busy founder. Answer questions about the team's work using ONLY the task data below.",
    `Today is ${opts.todayLabel}.`,
    "Be concise and direct: a short sentence or a tight bullet list. Use people's names. Mention overdue/blocked items when relevant. If the data doesn't contain the answer, say so plainly — don't invent anything.",
    "",
    "=== TASK DATA ===",
    opts.context,
    "=== END DATA ===",
  ].join("\n");

  return geminiComplete({
    system,
    messages: [{ role: "user", content: opts.question.slice(0, 2000) }],
    json: false,
    maxTokens: 800,
  });
}
