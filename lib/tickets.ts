/**
 * Shared ticket vocabulary — statuses, priorities, and their display
 * labels + Badge variants. Imported by both the founder (/ehsan)
 * and employee (/my-tasks) UIs so the two stay perfectly in sync.
 *
 * Server-safe (pure constants, no client hooks).
 */

export const TICKET_STATUSES = [
  "todo",
  "in_progress",
  "blocked",
  "done",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

/** Human labels — short on purpose so they fit in pills + buttons. */
export const STATUS_LABEL: Record<TicketStatus, string> = {
  todo: "To do",
  in_progress: "Doing",
  blocked: "Blocked",
  done: "Done",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

/** Maps onto the admin-ui <Badge variant=…> palette. */
export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

export const STATUS_BADGE: Record<TicketStatus, BadgeVariant> = {
  todo: "neutral",
  in_progress: "info",
  blocked: "warning",
  done: "success",
};

export const PRIORITY_BADGE: Record<TicketPriority, BadgeVariant> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  urgent: "danger",
};

export function isTicketStatus(v: unknown): v is TicketStatus {
  return typeof v === "string" && (TICKET_STATUSES as readonly string[]).includes(v);
}

export function isTicketPriority(v: unknown): v is TicketPriority {
  return typeof v === "string" && (TICKET_PRIORITIES as readonly string[]).includes(v);
}

/** Shape returned by the ticket API routes (assignee/author hydrated). */
export type Person = {
  id: string;
  name: string;
};

export type TicketUpdate = {
  id: string;
  ticket_id: string;
  type: "created" | "comment" | "status_change" | "assigned";
  body: string | null;
  old_status: TicketStatus | null;
  new_status: TicketStatus | null;
  created_at: string;
  author: Person | null;
};

export type Ticket = {
  id: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  due_date: string | null;
  source: "manual" | "ai";
  created_at: string;
  updated_at: string;
  done_at: string | null;
  assignee: Person | null;
  created_by: Person | null;
};
