/**
 * Phase 2 — turn a founder's messy note into clean ticket drafts.
 *
 * Uses Anthropic tool-use (non-streaming) so the model is FORCED to
 * return structured JSON instead of prose we'd have to parse loosely.
 * Walks the shared ANTHROPIC_MODEL_CHAIN so one overloaded model doesn't
 * break the feature. Nothing is saved here — the route hands drafts back
 * to the founder to confirm.
 */
import { ANTHROPIC_MODEL_CHAIN } from "@/lib/anthropic-stream";
import { isTicketPriority, type TicketPriority } from "@/lib/tickets";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export type AiDraft = {
  title: string;
  description: string | null;
  /** Raw name the model picked from the team list (may be empty). */
  assignee_name: string | null;
  priority: TicketPriority;
  /** YYYY-MM-DD or null. */
  due_date: string | null;
};

const TOOL = {
  name: "create_tickets",
  description:
    "Record the list of tasks extracted from the manager's note as clean, individual tickets.",
  input_schema: {
    type: "object" as const,
    properties: {
      tickets: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Short imperative task title, e.g. 'Finish the Dubai order'.",
            },
            description: {
              type: "string",
              description: "Optional one-line detail. Empty string if none.",
            },
            assignee_name: {
              type: "string",
              description:
                "The EXACT name from the provided team list this task is for, or empty string if unclear.",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
            },
            due_date: {
              type: "string",
              description:
                "Due date as YYYY-MM-DD if a date or weekday is mentioned (resolve relative dates against today), else empty string.",
            },
          },
          required: ["title", "priority"],
        },
      },
    },
    required: ["tickets"],
  },
};

type RawDraft = {
  title?: unknown;
  description?: unknown;
  assignee_name?: unknown;
  priority?: unknown;
  due_date?: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export class TicketAiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function draftTicketsFromText(opts: {
  text: string;
  team: { id: string; name: string }[];
  todayLabel: string; // e.g. "Wednesday, 2026-06-03"
}): Promise<AiDraft[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new TicketAiError("AI isn't configured (missing ANTHROPIC_API_KEY).", 500);
  }

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
    "Rules:",
    "- Create one ticket per distinct task. If the note has no real task, return an empty list.",
    "- title: short and imperative.",
    "- assignee_name: copy the EXACT matching name from the team list when the task is clearly for someone; otherwise empty.",
    "- priority: infer from urgency words ('urgent','asap','today' => urgent/high); default medium.",
    "- due_date: resolve any date or weekday to YYYY-MM-DD relative to today; empty if none.",
  ].join("\n");

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
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          system,
          tools: [TOOL],
          tool_choice: { type: "tool", name: "create_tickets" },
          messages: [{ role: "user", content: opts.text.slice(0, 6000) }],
        }),
      });
    } catch (e) {
      lastErr = e instanceof Error ? e.message : "fetch failed";
      continue;
    }

    if (!resp.ok) {
      lastErr = `${resp.status}`;
      // 429/529 => overloaded/rate-limited, try the next model.
      continue;
    }

    let json: {
      content?: { type: string; input?: { tickets?: RawDraft[] } }[];
    };
    try {
      json = await resp.json();
    } catch {
      lastErr = "bad JSON from model";
      continue;
    }

    const block = (json.content || []).find((b) => b.type === "tool_use");
    const raw = block?.input?.tickets;
    if (!Array.isArray(raw)) {
      // Model answered but produced nothing usable — treat as empty.
      return [];
    }

    return raw
      .map((r: RawDraft): AiDraft | null => {
        const title = str(r.title);
        if (!title) return null;
        const priority: TicketPriority = isTicketPriority(r.priority)
          ? r.priority
          : "medium";
        const due = str(r.due_date);
        const description = str(r.description);
        const assignee = str(r.assignee_name);
        return {
          title,
          description: description || null,
          assignee_name: assignee || null,
          priority,
          due_date: DATE_RE.test(due) ? due : null,
        };
      })
      .filter((d): d is AiDraft => d !== null);
  }

  throw new TicketAiError(
    `AI is busy right now (${lastErr || "all models failed"}). Try again.`,
    503,
  );
}

/**
 * Phase 3 — answer a founder's question using ONLY the supplied task
 * snapshot. Non-streaming; returns plain text. Walks the model chain.
 */
export async function answerQuestion(opts: {
  question: string;
  context: string;
  todayLabel: string;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new TicketAiError("AI isn't configured (missing ANTHROPIC_API_KEY).", 500);
  }

  const system = [
    "You are an assistant for a busy founder. Answer questions about the team's work using ONLY the task data below.",
    `Today is ${opts.todayLabel}.`,
    "Be concise and direct: a short sentence or a tight bullet list. Use people's names. Mention overdue/blocked items when relevant. If the data doesn't contain the answer, say so plainly — don't invent anything.",
    "",
    "=== TASK DATA ===",
    opts.context,
    "=== END DATA ===",
  ].join("\n");

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
        body: JSON.stringify({
          model,
          max_tokens: 800,
          system,
          messages: [{ role: "user", content: opts.question.slice(0, 2000) }],
        }),
      });
    } catch (e) {
      lastErr = e instanceof Error ? e.message : "fetch failed";
      continue;
    }
    if (!resp.ok) {
      lastErr = `${resp.status}`;
      continue;
    }
    let json: { content?: { type: string; text?: string }[] };
    try {
      json = await resp.json();
    } catch {
      lastErr = "bad JSON from model";
      continue;
    }
    const text = (json.content || [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("")
      .trim();
    if (text) return text;
    lastErr = "empty answer";
  }

  throw new TicketAiError(
    `AI is busy right now (${lastErr || "all models failed"}). Try again.`,
    503,
  );
}
