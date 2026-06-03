/**
 * /admin/tickets — the founder's task board. The /admin layout already
 * enforces auth + is_admin, so this page just loads data (service-role)
 * and hands it to the client.
 *
 * If the tickets tables don't exist yet (migration not run), we catch
 * the error and pass a hint down instead of crashing the route.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { listTickets, personName } from "@/lib/ticket-queries";
import type { Ticket } from "@/lib/tickets";
import TicketsClient from "./TicketsClient";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const admin = createSupabaseAdminClient();

  let tickets: Ticket[] = [];
  let loadError: string | null = null;
  try {
    tickets = await listTickets(admin);
  } catch (e: unknown) {
    loadError = e instanceof Error ? e.message : "Failed to load tickets.";
  }

  let team: { id: string; name: string }[] = [];
  try {
    const { data } = await admin
      .from("profiles")
      .select("id, full_name, first_name, last_name, phone, email")
      .eq("is_team_member", true)
      .order("full_name", { ascending: true });
    team = (data || []).map((p) => ({ id: p.id, name: personName(p) }));
  } catch {
    /* is_team_member column missing pre-migration — leave team empty */
  }

  return (
    <TicketsClient
      initialTickets={tickets}
      team={team}
      loadError={loadError}
    />
  );
}
