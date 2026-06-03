"use client";

/**
 * The /ehsan console — one secret page with three tabs:
 *   Today  · stats + AI summary (ask box) + today's activity
 *   Tasks  · the full task board (create / AI create / assign / manage)
 *   Team   · list employees + add one with a username + password
 */
import { useCallback, useState } from "react";
import Card from "@/components/admin-ui/Card";
import StatCard from "@/components/admin-ui/StatCard";
import Badge from "@/components/admin-ui/Badge";
import Button from "@/components/admin-ui/Button";
import Input from "@/components/admin-ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { MIN_PASSWORD_LENGTH } from "@/lib/staff-auth";
import {
  STATUS_LABEL,
  PRIORITY_LABEL,
  type Ticket,
} from "@/lib/tickets";
import type { ActivityItem } from "@/lib/ticket-queries";
import AskBox from "./AskBox";
import TasksBoard, { type TeamMember } from "./TasksBoard";

type Tab = "today" | "tasks" | "team";

export default function EhsanDashboard({
  tickets,
  team: initialTeam,
  activity,
  loadError,
  sinceISO,
  todayDate,
  adminName,
}: {
  tickets: Ticket[];
  team: TeamMember[];
  activity: ActivityItem[];
  loadError: string | null;
  sinceISO: string;
  todayDate: string;
  adminName: string | null;
}) {
  const [tab, setTab] = useState<Tab>("today");
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);

  const refreshTeam = useCallback(async () => {
    const res = await fetch("/api/admin/team", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setTeam(json.team || []);
  }, []);

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>
        {/* Top bar */}
        <header style={headerStyle}>
          <div style={brandStyle}>
            SKILLIES<span style={{ color: "#C62828" }}>.AI</span>
            <span style={consoleTag}>console</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {adminName && <span style={{ fontSize: 13, color: "#525252" }}>{adminName}</span>}
            <LogoutButton />
          </div>
        </header>

        {/* Tabs */}
        <div style={tabsWrap}>
          {(["today", "tasks", "team"] as Tab[]).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} style={tabBtn(tab === t)}>
              {t === "today" ? "Today" : t === "tasks" ? "Tasks" : "Team"}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px 0 64px" }}>
          {tab === "today" && (
            <TodayPanel
              tickets={tickets}
              activity={activity}
              sinceISO={sinceISO}
              todayDate={todayDate}
              loadError={loadError}
            />
          )}
          {tab === "tasks" && (
            <TasksBoard initialTickets={tickets} team={team} loadError={loadError} />
          )}
          {tab === "team" && <TeamManager team={team} onChange={refreshTeam} />}
        </div>
      </div>
    </div>
  );
}

/* ---- Today ---- */

function TodayPanel({
  tickets,
  activity,
  sinceISO,
  todayDate,
  loadError,
}: {
  tickets: Ticket[];
  activity: ActivityItem[];
  sinceISO: string;
  todayDate: string;
  loadError: string | null;
}) {
  const migrationNeeded = !!loadError && /exist|relation|schema cache|column/i.test(loadError);

  const doneToday = tickets.filter((t) => t.done_at && t.done_at >= sinceISO);
  const inProgress = tickets.filter((t) => t.status === "in_progress");
  const blocked = tickets.filter((t) => t.status === "blocked");
  const overdue = tickets.filter((t) => t.due_date && t.status !== "done" && t.due_date < todayDate);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {migrationNeeded && (
        <Card style={{ borderColor: "rgba(217,119,6,0.35)" }}>
          <div style={{ fontWeight: 600, color: "#B45309", marginBottom: 6 }}>One setup step left</div>
          <p style={{ fontSize: 13.5, color: "#525252", margin: 0 }}>
            Run <code style={codeStyle}>supabase/schema.sql</code> in Supabase → SQL Editor, then reload.
          </p>
        </Card>
      )}

      <Card title="Ask anything" subtitle="Answered from your live task data.">
        <AskBox disabled={migrationNeeded} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
        <StatCard label="Done today" value={String(doneToday.length)} />
        <StatCard label="In progress" value={String(inProgress.length)} />
        <StatCard label="Blocked" value={String(blocked.length)} delta={blocked.length ? "needs attention" : undefined} deltaTone={blocked.length ? "down" : "neutral"} />
        <StatCard label="Overdue" value={String(overdue.length)} delta={overdue.length ? "needs attention" : undefined} deltaTone={overdue.length ? "down" : "neutral"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, alignItems: "start" }} className="ehsan-today-grid">
        <Card title="Today's activity" subtitle={`${activity.length} update${activity.length === 1 ? "" : "s"} since midnight`}>
          {activity.length === 0 ? (
            <p style={mutedStyle}>Nothing logged yet today. Updates from your team appear here.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {activity.map((a) => (
                <li key={a.id} style={{ display: "flex", gap: 10 }}>
                  <div style={dotStyle} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, color: "#0A0A0A", lineHeight: 1.45 }}>{activityText(a)}</div>
                    <div style={{ fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>{timeIST(a.created_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Needs attention">
          <AttentionList heading="Overdue" empty="Nothing overdue 🎉" items={overdue.map((t) => ({ id: t.id, title: t.title, who: t.assignee?.name || "Unassigned", tag: t.due_date ? `due ${t.due_date}` : "", tone: "danger" as const }))} />
          <div style={{ height: 16 }} />
          <AttentionList heading="Blocked" empty="Nothing blocked" items={blocked.map((t) => ({ id: t.id, title: t.title, who: t.assignee?.name || "Unassigned", tag: PRIORITY_LABEL[t.priority], tone: "warning" as const }))} />
        </Card>
      </div>

      <style>{`@media (max-width: 900px) { .ehsan-today-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function AttentionList({ heading, empty, items }: { heading: string; empty: string; items: { id: string; title: string; who: string; tag: string; tone: "danger" | "warning" }[] }) {
  return (
    <div>
      <div style={listHeadingStyle}>{heading}</div>
      {items.length === 0 ? (
        <p style={{ ...mutedStyle, margin: "8px 0 0" }}>{empty}</p>
      ) : (
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it) => (
            <li key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "8px 10px", background: "#FCFCFC", border: "1px solid rgba(17,24,39,0.07)", borderRadius: 9 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.title}</div>
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

/* ---- Team ---- */

function TeamManager({ team, onChange }: { team: TeamMember[]; onChange: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || password.length < MIN_PASSWORD_LENGTH) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });
      const json = await res.json();
      if (!res.ok) { setMsg({ kind: "error", text: json.error || "Failed." }); return; }
      setMsg({ kind: "success", text: `Added ${json.name}. Share these → username: ${json.username}, password: (the one you set). They log in at /my-tasks.` });
      setName(""); setUsername(""); setPassword("");
      onChange();
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }} className="ehsan-team-grid">
      <Card title="Add a teammate" subtitle="Creates their username + password login.">
        <form onSubmit={add}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Kumar" required />
          <div style={{ height: 12 }} />
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ramesh" autoCapitalize="none" required />
          <div style={{ height: 12 }} />
          <Input label={`Password (min ${MIN_PASSWORD_LENGTH} chars)`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="set a password" />
          {msg && (
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 9, fontSize: 13, lineHeight: 1.5, background: msg.kind === "success" ? "rgba(22,163,74,0.10)" : "rgba(220,38,38,0.08)", border: `1px solid ${msg.kind === "success" ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.25)"}`, color: msg.kind === "success" ? "#15803D" : "#B91C1C" }}>
              {msg.text}
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <Button type="submit" loading={busy} disabled={!name.trim() || !username.trim() || password.length < MIN_PASSWORD_LENGTH}>
              Add teammate
            </Button>
          </div>
        </form>
      </Card>

      <Card title={`Team (${team.length})`}>
        {team.length === 0 ? (
          <p style={mutedStyle}>No teammates yet. Add your first on the left.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {team.map((m) => (
              <li key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#FCFCFC", border: "1px solid rgba(17,24,39,0.07)", borderRadius: 9 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{m.name}</span>
                {m.username && <span style={{ fontSize: 12.5, color: "#A3A3A3", fontFamily: "ui-monospace, Menlo, monospace" }}>@{m.username}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <style>{`@media (max-width: 800px) { .ehsan-team-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ---- bits ---- */

function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await Promise.race([supabase.auth.signOut({ scope: "local" }), new Promise<void>((r) => setTimeout(r, 1500))]);
    } catch { /* swallow */ }
    try {
      for (const part of document.cookie.split(";")) {
        const n = part.trim().split("=")[0];
        if (n && n.startsWith("sb-")) document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    } catch { /* swallow */ }
    window.location.href = "/ehsan";
  };
  return <button type="button" onClick={logout} disabled={busy} style={logoutStyle}>{busy ? "…" : "Log out"}</button>;
}

function activityText(a: ActivityItem): string {
  const who = a.author?.name || "Someone";
  if (a.type === "created") return `${who} created “${a.ticket_title}”`;
  if (a.type === "assigned") return `${who} reassigned “${a.ticket_title}”`;
  if (a.type === "status_change") return `${who} moved “${a.ticket_title}” to ${a.new_status ? STATUS_LABEL[a.new_status] : "?"}`;
  return `${who} noted on “${a.ticket_title}”: ${a.body || ""}`;
}

function timeIST(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#FAF9F7", fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif", color: "#0A0A0A" };
const headerStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(17,24,39,0.08)" };
const brandStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" };
const consoleTag: React.CSSProperties = { fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#A3A3A3", border: "1px solid rgba(17,24,39,0.12)", borderRadius: 999, padding: "2px 8px" };
const tabsWrap: React.CSSProperties = { display: "inline-flex", gap: 4, padding: 4, background: "rgba(17,24,39,0.04)", borderRadius: 10, marginTop: 20 };
const tabBtn = (active: boolean): React.CSSProperties => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: active ? "white" : "transparent", color: active ? "#0A0A0A" : "#525252", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none" });
const mutedStyle: React.CSSProperties = { fontSize: 13, color: "#A3A3A3", margin: 0, lineHeight: 1.55 };
const listHeadingStyle: React.CSSProperties = { fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: "#A3A3A3" };
const dotStyle: React.CSSProperties = { width: 8, height: 8, borderRadius: 999, background: "#C62828", marginTop: 5, flexShrink: 0 };
const codeStyle: React.CSSProperties = { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, background: "rgba(17,24,39,0.06)", padding: "1px 5px", borderRadius: 4 };
const logoutStyle: React.CSSProperties = { background: "transparent", border: "1px solid rgba(17,24,39,0.12)", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 500, color: "#525252", cursor: "pointer" };
