/**
 * /ehsan — the secret founder console. Self-gating: anyone who isn't a
 * signed-in admin sees only the login screen (no layout, no data leak).
 * Admins get the full dashboard (Today / Tasks / Team).
 *
 * Not linked anywhere and not in the proxy matcher — it's reached by URL
 * and protected by the is_admin check here.
 */
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import {
  listTickets,
  getRecentActivity,
  personName,
  startOfTodayISO,
  todayDateISO,
  type ActivityItem,
} from "@/lib/ticket-queries";
import type { Ticket } from "@/lib/tickets";
import EhsanLogin from "./EhsanLogin";
import EhsanDashboard from "./EhsanDashboard";
import type { TeamMember } from "./TasksBoard";

export const dynamic = "force-dynamic";

export default async function EhsanPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let adminName: string | null = null;
  if (user) {
    const admin = createSupabaseAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("is_admin, full_name, username")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = !!profile?.is_admin;
    adminName = profile?.full_name || profile?.username || null;
  }

  if (!isAdmin) return <EhsanLogin />;

  const admin = createSupabaseAdminClient();
  const sinceISO = startOfTodayISO();

  let tickets: Ticket[] = [];
  let loadError: string | null = null;
  try {
    tickets = await listTickets(admin);
  } catch (e: unknown) {
    loadError = e instanceof Error ? e.message : "Failed to load.";
  }

  let activity: ActivityItem[] = [];
  try {
    activity = await getRecentActivity(admin, sinceISO);
  } catch {
    /* table missing pre-migration */
  }

  let team: TeamMember[] = [];
  try {
    const { data } = await admin
      .from("profiles")
      .select("id, full_name, first_name, last_name, phone, email, username")
      .eq("is_team_member", true)
      .order("full_name", { ascending: true });
    team = (data || []).map((p) => ({
      id: p.id,
      name: personName(p),
      username: p.username || null,
    }));
  } catch {
    /* is_team_member / username column missing pre-migration */
  }

  return (
    <EhsanDashboard
      tickets={tickets}
      team={team}
      activity={activity}
      loadError={loadError}
      sinceISO={sinceISO}
      todayDate={todayDateISO()}
      adminName={adminName}
    />
  );
}
