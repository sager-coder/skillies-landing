/**
 * /admin/today — the founder's daily snapshot. Server-rendered (reloads
 * to refresh). Answers "what happened today?" at a glance + an AI ask
 * box for anything else. Gated by the /admin layout (is_admin).
 */
import Card from "@/components/admin-ui/Card";
import StatCard from "@/components/admin-ui/StatCard";
import Badge from "@/components/admin-ui/Badge";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  listTickets,
  getRecentActivity,
  startOfTodayISO,
  todayDateISO,
  type ActivityItem,
} from "@/lib/ticket-queries";
import { STATUS_LABEL, PRIORITY_LABEL, type Ticket } from "@/lib/tickets";
import AskBox from "./AskBox";

export const dynamic = "force-dynamic";

function timeIST(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function activityText(a: ActivityItem): string {
  const who = a.author?.name || "Someone";
  if (a.type === "created") return `${who} created “${a.ticket_title}”`;
  if (a.type === "assigned") return `${who} reassigned “${a.ticket_title}”`;
  if (a.type === "status_change")
    return `${who} moved “${a.ticket_title}” to ${a.new_status ? STATUS_LABEL[a.new_status] : "?"}`;
  return `${who} noted on “${a.ticket_title}”: ${a.body || ""}`;
}

export default async function TodayPage() {
  const admin = createSupabaseAdminClient();
  const since = startOfTodayISO();
  const today = todayDateISO();

  let tickets: Ticket[] = [];
  let loadError: string | null = null;
  try {
    tickets = await listTickets(admin);
  } catch (e: unknown) {
    loadError = e instanceof Error ? e.message : "Failed to load.";
  }

  let activity: ActivityItem[] = [];
  try {
    activity = await getRecentActivity(admin, since);
  } catch {
    /* table missing pre-migration */
  }

  const migrationNeeded =
    !!loadError && /exist|relation|schema cache|column/i.test(loadError);

  const doneToday = tickets.filter((t) => t.done_at && t.done_at >= since);
  const inProgress = tickets.filter((t) => t.status === "in_progress");
  const blocked = tickets.filter((t) => t.status === "blocked");
  const overdue = tickets.filter(
    (t) => t.due_date && t.status !== "done" && t.due_date < today,
  );

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={h2Style}>Today</h2>
        <p style={subtitleStyle}>{dateLabel} · your team at a glance</p>
      </div>

      {migrationNeeded && (
        <Card style={{ borderColor: "rgba(217,119,6,0.35)" }}>
          <div style={{ fontWeight: 600, color: "#B45309", marginBottom: 6 }}>
            One setup step left
          </div>
          <p style={{ fontSize: 13.5, color: "#525252", margin: 0, lineHeight: 1.55 }}>
            Run <code style={codeStyle}>supabase/schema.sql</code> in the
            Supabase SQL Editor, then reload.
          </p>
        </Card>
      )}

      {/* Ask box */}
      <Card title="Ask anything" subtitle="Answered from your live task data.">
        <AskBox disabled={migrationNeeded} />
      </Card>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Done today" value={String(doneToday.length)} />
        <StatCard label="In progress" value={String(inProgress.length)} />
        <StatCard
          label="Blocked"
          value={String(blocked.length)}
          delta={blocked.length ? "needs attention" : undefined}
          deltaTone={blocked.length ? "down" : "neutral"}
        />
        <StatCard
          label="Overdue"
          value={String(overdue.length)}
          delta={overdue.length ? "needs attention" : undefined}
          deltaTone={overdue.length ? "down" : "neutral"}
        />
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
        className="today-grid"
      >
        {/* Activity feed */}
        <Card title="Today's activity" subtitle={`${activity.length} update${activity.length === 1 ? "" : "s"} since midnight`}>
          {activity.length === 0 ? (
            <p style={mutedStyle}>
              Nothing logged yet today. Updates from your team will appear here.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {activity.map((a) => (
                <li key={a.id} style={{ display: "flex", gap: 10 }}>
                  <div style={dotStyle} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, color: "#0A0A0A", lineHeight: 1.45 }}>
                      {activityText(a)}
                    </div>
                    <div style={{ fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>
                      {timeIST(a.created_at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Needs attention */}
        <Card title="Needs attention">
          <AttentionList
            heading="Overdue"
            empty="Nothing overdue 🎉"
            items={overdue.map((t) => ({
              id: t.id,
              title: t.title,
              who: t.assignee?.name || "Unassigned",
              tag: t.due_date ? `due ${t.due_date}` : "",
              tone: "danger" as const,
            }))}
          />
          <div style={{ height: 16 }} />
          <AttentionList
            heading="Blocked"
            empty="Nothing blocked"
            items={blocked.map((t) => ({
              id: t.id,
              title: t.title,
              who: t.assignee?.name || "Unassigned",
              tag: PRIORITY_LABEL[t.priority],
              tone: "warning" as const,
            }))}
          />
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .today-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function AttentionList({
  heading,
  empty,
  items,
}: {
  heading: string;
  empty: string;
  items: { id: string; title: string; who: string; tag: string; tone: "danger" | "warning" }[];
}) {
  return (
    <div>
      <div style={listHeadingStyle}>{heading}</div>
      {items.length === 0 ? (
        <p style={{ ...mutedStyle, margin: "8px 0 0" }}>{empty}</p>
      ) : (
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it) => (
            <li
              key={it.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "#FCFCFC",
                border: "1px solid rgba(17,24,39,0.07)",
                borderRadius: 9,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {it.title}
                </div>
                <div style={{ fontSize: 11.5, color: "#A3A3A3", marginTop: 1 }}>{it.who}</div>
              </div>
              {it.tag && <Badge variant={it.tone}>{it.tag}</Badge>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const h2Style: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 28,
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#0A0A0A",
};
const subtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 14,
  color: "#525252",
};
const mutedStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#A3A3A3",
  margin: 0,
  lineHeight: 1.55,
};
const listHeadingStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#A3A3A3",
};
const dotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#C62828",
  marginTop: 5,
  flexShrink: 0,
};
const codeStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: 12,
  background: "rgba(17,24,39,0.06)",
  padding: "1px 5px",
  borderRadius: 4,
};
