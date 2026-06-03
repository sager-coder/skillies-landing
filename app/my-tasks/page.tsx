/**
 * /my-tasks — the employee view. Mobile-first, no admin shell.
 *
 * Auth: the proxy redirects anon users to /login. We still fetch with
 * the USER-scoped client so RLS (tickets_select_assignee) guarantees a
 * person only ever sees their own tickets.
 */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Ticket } from "@/lib/tickets";
import MyTasksClient from "./MyTasksClient";
import EmployeeLogin from "./EmployeeLogin";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  description: string | null;
  status: Ticket["status"];
  priority: Ticket["priority"];
  due_date: string | null;
  created_at: string;
  updated_at: string;
  done_at: string | null;
};

export default async function MyTasksPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <EmployeeLogin />;

  let rows: Row[] = [];
  try {
    const { data } = await supabase
      .from("tickets")
      .select(
        "id, title, description, status, priority, due_date, created_at, updated_at, done_at",
      )
      .eq("assignee_id", user.id)
      .order("updated_at", { ascending: false });
    rows = (data as Row[]) || [];
  } catch {
    /* table not migrated yet — show the empty state */
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, first_name")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.first_name || profile?.full_name || null;

  return <MyTasksClient initialTickets={rows} name={name} />;
}
