"use client";

/**
 * Employee task board — a lightweight kanban (To do / Doing / Blocked /
 * Done) over ONLY the person's own tasks. Drag a card between columns on
 * desktop; on a phone, tap a card and use the status buttons (drag isn't
 * reliable on touch). Every change posts to /api/tickets/[id]/update.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Badge from "@/components/admin-ui/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  TICKET_STATUSES,
  BOARD_ORDER,
  STATUS_LABEL,
  STATUS_BADGE,
  PRIORITY_LABEL,
  PRIORITY_BADGE,
  type TicketStatus,
  type TicketPriority,
} from "@/lib/tickets";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  done_at: string | null;
};

export default function MyTasksClient({
  initialTickets,
  name,
  userId,
}: {
  initialTickets: Task[];
  name: string | null;
  userId: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTickets);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TicketStatus | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const didDrag = useRef(false);

  const flash = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const post = useCallback(
    async (id: string, payload: { status?: TicketStatus; note?: string }) => {
      const res = await fetch(`/api/tickets/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok;
    },
    [],
  );

  const move = useCallback(
    async (id: string, status: TicketStatus) => {
      const t = tasks.find((x) => x.id === id);
      if (!t || t.status === status) return;
      const prev = t.status;
      const now = new Date().toISOString();
      setTasks((p) =>
        p.map((x) =>
          x.id === id ? { ...x, status, updated_at: now, done_at: status === "done" ? now : null } : x,
        ),
      );
      const ok = await post(id, { status });
      if (!ok) {
        setTasks((p) => p.map((x) => (x.id === id ? { ...x, status: prev } : x)));
        flash("Couldn't save — try again.");
      } else {
        flash("Updated ✓");
      }
    },
    [tasks, post, flash],
  );

  const detail = detailId ? tasks.find((t) => t.id === detailId) || null : null;

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <header style={headerStyle}>
          <span style={brandStyle}>SKILLIES<span style={{ color: "#C62828" }}>.AI</span></span>
          <LogoutButton />
        </header>

        <div style={{ padding: "8px 0 18px" }}>
          <h1 style={h1Style}>{name ? `Hi ${name} 👋` : "Your tasks"}</h1>
          <p style={{ margin: "6px 0 0", color: "#525252", fontSize: 14 }}>
            Drag a card to change its status — or tap it to update + leave a note.
          </p>
        </div>

        {toast && <div style={toastStyle}>{toast}</div>}

        {tasks.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: 40 }}>🎉</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>No tasks assigned</div>
            <div style={{ color: "#525252", fontSize: 14, marginTop: 4 }}>
              When your manager assigns you something, it&apos;ll appear here.
            </div>
          </div>
        ) : (
          <div className="mytasks-board" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
            {BOARD_ORDER.map((status) => {
              const colTasks = tasks.filter((t) => t.status === status);
              const isOver = overCol === status;
              return (
                <div
                  key={status}
                  className="mytasks-col"
                  onDragEnter={(e) => e.preventDefault()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (overCol !== status) setOverCol(status);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain") || draggingId;
                    if (id) move(id, status);
                    setOverCol(null);
                    setDraggingId(null);
                  }}
                  style={{
                    ...columnStyle,
                    background: isOver ? "rgba(198,40,40,0.06)" : "rgba(17,24,39,0.03)",
                    outline: isOver ? "2px dashed rgba(198,40,40,0.45)" : "2px dashed transparent",
                  }}
                >
                  <div style={colHeaderStyle}>
                    <Badge variant={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</Badge>
                    <span style={{ color: "#A3A3A3", fontSize: 12, fontWeight: 700 }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 90 }}>
                    {colTasks.map((t) => {
                      const overdue = !!t.due_date && t.status !== "done" && new Date(t.due_date) < new Date(new Date().toDateString());
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", t.id);
                            e.dataTransfer.effectAllowed = "move";
                            didDrag.current = false;
                            // Defer the state change so the native drag fully
                            // starts before this card re-renders (a synchronous
                            // re-render cancels the drag in some browsers).
                            const dragId = t.id;
                            setTimeout(() => setDraggingId(dragId), 0);
                          }}
                          onDrag={() => { didDrag.current = true; }}
                          onDragEnd={() => { setDraggingId(null); setOverCol(null); }}
                          onClick={() => { if (!didDrag.current) setDetailId(t.id); }}
                          style={{ ...cardStyle, opacity: draggingId === t.id ? 0.45 : 1 }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0A0A0A", lineHeight: 1.35 }}>{t.title}</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                            <Badge variant={PRIORITY_BADGE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                            {t.due_date && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: overdue ? "rgba(220,38,38,0.10)" : "rgba(17,24,39,0.06)",
                                  color: overdue ? "#B91C1C" : "#525252",
                                }}
                              >
                                📅 {overdue ? "Overdue · " : "Due "}
                                {new Date(t.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {colTasks.length === 0 && (
                      <div style={dropZoneStyle}>Drop here</div>
                    )}
                  </div>
                </div>
              );
            })}
            <style>{`@media (max-width: 720px){ .mytasks-board{ flex-direction: column; } .mytasks-col{ max-width: none !important; } }`}</style>
          </div>
        )}

        <div style={{ height: 48 }} />
      </div>

      {detail && (
        <TaskDetail
          task={detail}
          userId={userId}
          onClose={() => setDetailId(null)}
          onMove={move}
          onNote={async (id, note) => {
            const ok = await post(id, { note });
            if (ok) flash("Update added ✓");
            else flash("Couldn't save — try again.");
            return ok;
          }}
        />
      )}
    </div>
  );
}

type UpdateRow = {
  id: string;
  type: string;
  body: string | null;
  old_status: string | null;
  new_status: string | null;
  created_at: string;
  author_id: string | null;
};

/** Read this ticket's activity via RLS (employee can only see their own). */
async function fetchTicketUpdates(ticketId: string): Promise<UpdateRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("ticket_updates")
      .select("id, type, body, old_status, new_status, created_at, author_id")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false });
    return (data as UpdateRow[]) || [];
  } catch {
    return [];
  }
}

function TaskDetail({
  task,
  userId,
  onClose,
  onMove,
  onNote,
}: {
  task: Task;
  userId: string;
  onClose: () => void;
  onMove: (id: string, status: TicketStatus) => void;
  onNote: (id: string, note: string) => Promise<boolean>;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [updates, setUpdates] = useState<UpdateRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchTicketUpdates(task.id).then((rows) => {
      if (alive) setUpdates(rows);
    });
    return () => {
      alive = false;
    };
  }, [task.id]);

  const submitNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    const ok = await onNote(task.id, note.trim());
    setBusy(false);
    if (ok) {
      setNote("");
      setUpdates(await fetchTicketUpdates(task.id));
    }
  };

  const overdue = !!task.due_date && task.status !== "done" && new Date(task.due_date) < new Date(new Date().toDateString());

  return (
    <div style={overlayStyle} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={drawerStyle}>
        <style>{`@keyframes drawerIn { from { transform: translateX(24px); opacity: 0.4; } to { transform: translateX(0); opacity: 1; } }`}</style>

        <div style={drawerHeaderStyle}>
          <span style={{ fontSize: 11, color: "#A3A3A3", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Task</span>
          <button type="button" onClick={onClose} aria-label="Close" style={closeBtnStyle}>✕</button>
        </div>

        <div style={{ padding: "4px 22px 28px", overflowY: "auto", flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.35 }}>{task.title}</h2>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
            <Badge variant={PRIORITY_BADGE[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
            {task.due_date ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: overdue ? "rgba(220,38,38,0.10)" : "rgba(17,24,39,0.06)", color: overdue ? "#B91C1C" : "#404040" }}>
                📅 {overdue ? "Overdue · " : "Due "}
                {new Date(task.due_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              </span>
            ) : (
              <span style={{ fontSize: 12.5, color: "#A3A3A3" }}>No deadline</span>
            )}
          </div>

          {task.description && (
            <p style={{ margin: "14px 0 0", fontSize: 14, color: "#525252", lineHeight: 1.55 }}>{task.description}</p>
          )}

          <div style={{ marginTop: 22 }}>
            <div style={miniLabelStyle}>Status</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {TICKET_STATUSES.map((s) => {
                const active = task.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { if (!active) onMove(task.id, s); }}
                    style={{ flex: "1 1 0", minWidth: 72, padding: "10px 8px", borderRadius: 9, border: active ? "1px solid #C62828" : "1px solid rgba(17,24,39,0.12)", background: active ? "#C62828" : "white", color: active ? "white" : "#525252", fontWeight: 600, fontSize: 13, cursor: active ? "default" : "pointer" }}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={miniLabelStyle}>Add an update for your manager</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitNote(); }}
                placeholder="e.g. Finished the draft, sending for review…"
                style={noteInputStyle}
              />
              <button type="button" onClick={submitNote} disabled={busy || !note.trim()} style={{ ...postBtnStyle, opacity: busy || !note.trim() ? 0.5 : 1 }}>
                {busy ? "…" : "Post"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <div style={miniLabelStyle}>Progress &amp; history</div>
            <div style={{ marginTop: 12 }}>
              {updates === null ? (
                <div style={{ fontSize: 13, color: "#A3A3A3" }}>Loading…</div>
              ) : updates.length === 0 ? (
                <div style={{ fontSize: 13, color: "#A3A3A3" }}>No updates yet — add the first one above.</div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {updates.map((u) => (
                    <li key={u.id} style={{ display: "flex", gap: 10 }}>
                      <div style={dotStyle} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, color: "#0A0A0A", lineHeight: 1.45 }}>{activityText(u, userId)}</div>
                        <div style={{ fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>{relativeTime(u.created_at)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function activityText(u: UpdateRow, userId: string): string {
  const you = u.author_id === userId;
  if (u.type === "created") return "Manager created this task";
  if (u.type === "assigned") return "Assigned to you";
  if (u.type === "status_change")
    return `${you ? "You" : "Manager"} moved it to ${u.new_status ? STATUS_LABEL[u.new_status as TicketStatus] : "?"}`;
  return `${you ? "You" : "Manager"}: ${u.body || ""}`;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

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
    // Back to the employee login (the /my-tasks page shows it when logged out).
    window.location.href = "/my-tasks";
  };
  return <button type="button" onClick={logout} disabled={busy} style={logoutStyle}>{busy ? "…" : "Log out"}</button>;
}

/* styles */
const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#FAF9F7", fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif", color: "#0A0A0A" };
const headerStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" };
const brandStyle: React.CSSProperties = { fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" };
const h1Style: React.CSSProperties = { margin: 0, fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" };
const columnStyle: React.CSSProperties = { flex: "1 0 250px", minWidth: 250, maxWidth: 360, borderRadius: 12, padding: 10, boxSizing: "border-box", transition: "background 120ms ease" };
const colHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 10px" };
const cardStyle: React.CSSProperties = { background: "white", border: "1px solid rgba(17,24,39,0.08)", borderRadius: 12, padding: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", cursor: "grab" };
const dropZoneStyle: React.CSSProperties = { fontSize: 12, color: "#B8B8B8", padding: "22px 4px", textAlign: "center", border: "1px dashed rgba(17,24,39,0.12)", borderRadius: 8 };
const toastStyle: React.CSSProperties = { position: "sticky", top: 8, zIndex: 10, margin: "0 0 14px", padding: "10px 14px", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.30)", borderRadius: 10, fontSize: 13.5, color: "#15803D", fontWeight: 500 };
const emptyStyle: React.CSSProperties = { textAlign: "center", padding: "56px 24px", background: "white", border: "1px solid rgba(17,24,39,0.08)", borderRadius: 14 };
const miniLabelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, color: "#A3A3A3" };
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 60, background: "rgba(10,10,10,0.45)", display: "flex", justifyContent: "flex-end" };
const drawerStyle: React.CSSProperties = { width: "min(460px, 100%)", height: "100%", background: "white", display: "flex", flexDirection: "column", boxShadow: "-12px 0 44px rgba(0,0,0,0.22)", animation: "drawerIn 200ms ease" };
const drawerHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 6px" };
const closeBtnStyle: React.CSSProperties = { border: "none", background: "transparent", fontSize: 16, color: "#A3A3A3", cursor: "pointer", lineHeight: 1, padding: 6 };
const dotStyle: React.CSSProperties = { width: 8, height: 8, borderRadius: 999, background: "#C62828", marginTop: 5, flexShrink: 0 };
const noteInputStyle: React.CSSProperties = { flex: 1, height: 42, padding: "0 14px", borderRadius: 10, border: "1px solid rgba(17,24,39,0.12)", outline: "none", fontSize: 14, background: "white", color: "#0A0A0A" };
const postBtnStyle: React.CSSProperties = { height: 42, padding: "0 18px", borderRadius: 10, border: "none", background: "#C62828", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" };
const logoutStyle: React.CSSProperties = { background: "transparent", border: "1px solid rgba(17,24,39,0.12)", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 500, color: "#525252", cursor: "pointer" };
