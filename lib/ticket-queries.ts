/**
 * Server-only ticket read helpers. Take a Supabase client (normally the
 * service-role admin client) and return fully-hydrated Ticket /
 * TicketUpdate objects with assignee + author names resolved in a single
 * extra round-trip — mirroring how /api/admin/students hydrates
 * enrollments.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Person, Ticket, TicketUpdate } from "@/lib/tickets";

type ProfileRow = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
};

/** Best-available display name for a profile row. */
export function personName(p: Partial<ProfileRow> | null | undefined): string {
  if (!p) return "Unknown";
  if (p.full_name) return p.full_name;
  const fl = [p.first_name, p.last_name].filter(Boolean).join(" ");
  if (fl) return fl;
  return p.phone || p.email || "Unknown";
}

export async function hydratePeople(
  admin: SupabaseClient,
  ids: (string | null | undefined)[],
): Promise<Map<string, Person>> {
  const unique = [...new Set(ids.filter(Boolean) as string[])];
  const map = new Map<string, Person>();
  if (!unique.length) return map;
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, first_name, last_name, phone, email")
    .in("id", unique);
  for (const p of (data as ProfileRow[]) || []) {
    map.set(p.id, { id: p.id, name: personName(p) });
  }
  return map;
}

type RawTicket = {
  id: string;
  title: string;
  description: string | null;
  status: Ticket["status"];
  priority: Ticket["priority"];
  assignee_id: string | null;
  created_by: string | null;
  due_date: string | null;
  source: "manual" | "ai";
  created_at: string;
  updated_at: string;
  done_at: string | null;
};

const TICKET_COLS =
  "id, title, description, status, priority, assignee_id, created_by, due_date, source, created_at, updated_at, done_at";

function toTicket(r: RawTicket, people: Map<string, Person>): Ticket {
  const person = (id: string | null): Person | null =>
    id ? people.get(id) || { id, name: "Unknown" } : null;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    priority: r.priority,
    due_date: r.due_date,
    source: r.source,
    created_at: r.created_at,
    updated_at: r.updated_at,
    done_at: r.done_at,
    assignee: person(r.assignee_id),
    created_by: person(r.created_by),
  };
}

/** Every ticket, newest activity first. Throws on DB error (e.g. the
 *  table doesn't exist yet) so callers can surface a migration hint. */
export async function listTickets(admin: SupabaseClient): Promise<Ticket[]> {
  const { data, error } = await admin
    .from("tickets")
    .select(TICKET_COLS)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = (data as RawTicket[]) || [];
  const people = await hydratePeople(
    admin,
    rows.flatMap((r) => [r.assignee_id, r.created_by]),
  );
  return rows.map((r) => toTicket(r, people));
}

export async function getTicket(
  admin: SupabaseClient,
  id: string,
): Promise<Ticket | null> {
  const { data, error } = await admin
    .from("tickets")
    .select(TICKET_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const r = data as RawTicket;
  const people = await hydratePeople(admin, [r.assignee_id, r.created_by]);
  return toTicket(r, people);
}

export async function getTicketActivity(
  admin: SupabaseClient,
  ticketId: string,
): Promise<TicketUpdate[]> {
  const { data } = await admin
    .from("ticket_updates")
    .select("id, ticket_id, type, body, old_status, new_status, created_at, author_id")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: false });
  const rows =
    (data as (Omit<TicketUpdate, "author"> & { author_id: string | null })[]) ||
    [];
  const people = await hydratePeople(admin, rows.map((r) => r.author_id));
  return rows.map((r) => ({
    id: r.id,
    ticket_id: r.ticket_id,
    type: r.type,
    body: r.body,
    old_status: r.old_status,
    new_status: r.new_status,
    created_at: r.created_at,
    author: r.author_id
      ? people.get(r.author_id) || { id: r.author_id, name: "Unknown" }
      : null,
  }));
}

/* ------------------------------------------------------------------ */
/* Phase 3 — "Today" helpers                                           */
/* ------------------------------------------------------------------ */

/**
 * Timezone-aware day boundaries. Default offset is IST (+5:30 = 330
 * minutes) since the founder + team are in India; "today" should mean
 * their calendar day, not the server's UTC day.
 */
export function startOfTodayISO(tzOffsetMinutes = 330): string {
  const offMs = tzOffsetMinutes * 60 * 1000;
  const local = new Date(Date.now() + offMs);
  const midnightLocalAsUTC = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
  );
  return new Date(midnightLocalAsUTC - offMs).toISOString();
}

/** "YYYY-MM-DD" for today in the given tz (default IST). */
export function todayDateISO(tzOffsetMinutes = 330): string {
  const local = new Date(Date.now() + tzOffsetMinutes * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export type ActivityItem = TicketUpdate & { ticket_title: string };

/** Activity since `sinceISO`, hydrated with author name + ticket title. */
export async function getRecentActivity(
  admin: SupabaseClient,
  sinceISO: string,
  limit = 200,
): Promise<ActivityItem[]> {
  const { data } = await admin
    .from("ticket_updates")
    .select(
      "id, ticket_id, type, body, old_status, new_status, created_at, author_id",
    )
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })
    .limit(limit);
  const rows =
    (data as (Omit<TicketUpdate, "author"> & { author_id: string | null })[]) ||
    [];
  if (rows.length === 0) return [];

  const people = await hydratePeople(admin, rows.map((r) => r.author_id));

  const ticketIds = [...new Set(rows.map((r) => r.ticket_id))];
  const titles = new Map<string, string>();
  if (ticketIds.length) {
    const { data: trows } = await admin
      .from("tickets")
      .select("id, title")
      .in("id", ticketIds);
    for (const t of (trows as { id: string; title: string }[]) || []) {
      titles.set(t.id, t.title);
    }
  }

  return rows.map((r) => ({
    id: r.id,
    ticket_id: r.ticket_id,
    type: r.type,
    body: r.body,
    old_status: r.old_status,
    new_status: r.new_status,
    created_at: r.created_at,
    author: r.author_id
      ? people.get(r.author_id) || { id: r.author_id, name: "Unknown" }
      : null,
    ticket_title: titles.get(r.ticket_id) || "(deleted task)",
  }));
}
