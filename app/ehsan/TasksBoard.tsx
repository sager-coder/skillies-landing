"use client";

/**
 * Linear-style task board for the /ehsan console.
 *   - One column per status (To do / Doing / Blocked / Done)
 *   - Drag a card between columns to change its status (native HTML5 DnD)
 *   - Click a card to open full details (status/assignee/priority/due,
 *     note, activity) — also the mobile way to change status
 *   - "New task" + "✨ AI create", and an assignee filter
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/admin-ui/Card";
import Button from "@/components/admin-ui/Button";
import Badge from "@/components/admin-ui/Badge";
import Modal from "@/components/admin-ui/Modal";
import Input from "@/components/admin-ui/Input";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  STATUS_LABEL,
  PRIORITY_LABEL,
  STATUS_BADGE,
  PRIORITY_BADGE,
  type Ticket,
  type TicketUpdate,
  type TicketStatus,
} from "@/lib/tickets";

export type TeamMember = { id: string; name: string; username?: string | null };
type Toast = { kind: "success" | "error"; message: string } | null;

export default function TasksBoard({
  initialTickets,
  team,
  loadError,
}: {
  initialTickets: Ticket[];
  team: TeamMember[];
  loadError: string | null;
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [toast, setToast] = useState<Toast>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TicketStatus | null>(null);
  const didDrag = useRef(false);

  const migrationNeeded =
    !!loadError && /exist|relation|schema cache|column/i.test(loadError);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/tickets", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setTickets(json.tickets || []);
    else setToast({ kind: "error", message: json.error || "Failed to load." });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const patchTicket = useCallback(
    async (id: string, patch: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast({ kind: "error", message: json.error || "Update failed." });
        return false;
      }
      await refresh();
      return true;
    },
    [refresh],
  );

  // Optimistic status move (drag-drop). Updates the card instantly, then saves.
  const moveTicket = useCallback(
    async (id: string, status: TicketStatus) => {
      const t = tickets.find((x) => x.id === id);
      if (!t || t.status === status) return;
      const now = new Date().toISOString();
      setTickets((prev) =>
        prev.map((x) =>
          x.id === id
            ? { ...x, status, updated_at: now, done_at: status === "done" ? now : null }
            : x,
        ),
      );
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setToast({ kind: "error", message: "Couldn't move that task." });
        refresh();
      }
    },
    [tickets, refresh],
  );

  const visible = useMemo(
    () => (assignee ? tickets.filter((t) => t.assignee?.id === assignee) : tickets),
    [tickets, assignee],
  );

  const detailTicket = detailId ? tickets.find((t) => t.id === detailId) || null : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#525252" }}>Assignee:</span>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={{ ...selectStyle, width: "auto", minWidth: 150 }}>
            <option value="">Everyone</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setNewOpen(true)} disabled={migrationNeeded}>
            <span style={{ marginRight: 6 }}>＋</span>New task
          </Button>
          <Button onClick={() => setAiOpen(true)} disabled={migrationNeeded}>
            <span style={{ marginRight: 6 }}>✨</span>AI create
          </Button>
        </div>
      </div>

      {migrationNeeded && (
        <Card style={{ borderColor: "rgba(217,119,6,0.35)" }}>
          <div style={{ fontWeight: 600, color: "#B45309", marginBottom: 6 }}>One setup step left</div>
          <p style={{ fontSize: 13.5, color: "#525252", margin: 0 }}>
            Run <code style={codeStyle}>supabase/schema.sql</code> in the Supabase SQL Editor, then refresh.
          </p>
        </Card>
      )}

      {toast && <ToastBanner toast={toast} />}

      {/* Board */}
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
        {TICKET_STATUSES.map((status) => {
          const colTickets = visible.filter((t) => t.status === status);
          const isOver = overCol === status;
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                if (overCol !== status) setOverCol(status);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain") || draggingId;
                if (id) moveTicket(id, status);
                setOverCol(null);
                setDraggingId(null);
              }}
              style={{
                ...columnStyle,
                background: isOver ? "rgba(198,40,40,0.06)" : "rgba(17,24,39,0.025)",
                outline: isOver ? "2px dashed rgba(198,40,40,0.45)" : "2px dashed transparent",
              }}
            >
              <div style={colHeaderStyle}>
                <Badge variant={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</Badge>
                <span style={{ color: "#A3A3A3", fontSize: 12, fontWeight: 700 }}>{colTickets.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 60 }}>
                {colTickets.map((t) => {
                  const overdue =
                    !!t.due_date && t.status !== "done" && new Date(t.due_date) < new Date(new Date().toDateString());
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", t.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDraggingId(t.id);
                        didDrag.current = false;
                      }}
                      onDrag={() => {
                        didDrag.current = true;
                      }}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverCol(null);
                      }}
                      onClick={() => {
                        if (!didDrag.current) setDetailId(t.id);
                      }}
                      style={{ ...cardStyle, opacity: draggingId === t.id ? 0.45 : 1 }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0A0A0A", lineHeight: 1.35 }}>
                        {t.title}
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                        <Badge variant={PRIORITY_BADGE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                        {t.due_date && (
                          <span style={{ fontSize: 11.5, color: overdue ? "#B91C1C" : "#A3A3A3", fontWeight: overdue ? 600 : 400 }}>
                            {new Date(t.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            {overdue ? " · overdue" : ""}
                          </span>
                        )}
                        {t.source === "ai" && <span style={{ fontSize: 11, color: "#A3A3A3" }}>✨</span>}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 12, color: "#525252", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={avatarDot}>{initials(t.assignee?.name)}</span>
                        {t.assignee?.name || "Unassigned"}
                      </div>
                    </div>
                  );
                })}
                {colTickets.length === 0 && (
                  <div style={{ fontSize: 12, color: "#C4C4C4", padding: "10px 4px", textAlign: "center" }}>
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New task modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New task" width={520}>
        <NewTaskForm
          team={team}
          onCreated={(msg) => { setNewOpen(false); setToast({ kind: "success", message: msg }); refresh(); }}
          onError={(err) => setToast({ kind: "error", message: err })}
        />
      </Modal>

      {/* AI create modal */}
      <Modal open={aiOpen} onClose={() => setAiOpen(false)} title="Create tasks with AI" width={560}>
        <AiCreateForm
          team={team}
          onCreated={(msg) => { setAiOpen(false); setToast({ kind: "success", message: msg }); refresh(); }}
          onError={(err) => setToast({ kind: "error", message: err })}
        />
      </Modal>

      {/* Detail modal */}
      <Modal open={!!detailTicket} onClose={() => setDetailId(null)} title={detailTicket?.title || "Task"} width={720}>
        {detailTicket && <TicketDetail ticket={detailTicket} team={team} onPatch={patchTicket} />}
      </Modal>
    </div>
  );
}

function initials(name?: string | null): string {
  if (!name) return "?";
  return (name.match(/\b[a-zA-Z0-9]/g) || []).slice(0, 2).join("").toUpperCase() || "?";
}

/* ---- detail panel ---- */

function TicketDetail({
  ticket,
  team,
  onPatch,
}: {
  ticket: Ticket;
  team: TeamMember[];
  onPatch: (id: string, patch: Record<string, unknown>) => Promise<boolean>;
}) {
  const [updates, setUpdates] = useState<TicketUpdate[] | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const loadActivity = useCallback(async () => {
    const res = await fetch(`/api/admin/tickets/${ticket.id}`, { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setUpdates(json.updates || []);
  }, [ticket.id]);

  useEffect(() => { loadActivity(); }, [loadActivity]);

  const change = async (patch: Record<string, unknown>) => {
    const ok = await onPatch(ticket.id, patch);
    if (ok) loadActivity();
  };

  const postNote = async () => {
    const body = note.trim();
    if (!body) return;
    setBusy(true);
    try {
      const ok = await onPatch(ticket.id, { comment: body });
      if (ok) { setNote(""); loadActivity(); }
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ticket-detail-grid">
      <div>
        <Eyebrow>Details</Eyebrow>
        {ticket.description ? (
          <p style={{ fontSize: 13.5, color: "#404040", margin: "8px 0 16px", lineHeight: 1.55 }}>{ticket.description}</p>
        ) : (
          <p style={{ fontSize: 13, color: "#A3A3A3", margin: "8px 0 16px" }}>No description.</p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Status">
            <select value={ticket.status} onChange={(e) => change({ status: e.target.value })} style={selectStyle}>
              {TICKET_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={ticket.priority} onChange={(e) => change({ priority: e.target.value })} style={selectStyle}>
              {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
            </select>
          </Field>
          <Field label="Assignee">
            <select value={ticket.assignee?.id || ""} onChange={(e) => change({ assignee_id: e.target.value || null })} style={selectStyle}>
              <option value="">Unassigned</option>
              {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Due date">
            <input type="date" value={ticket.due_date || ""} onChange={(e) => change({ due_date: e.target.value || null })} style={selectStyle} />
          </Field>
        </div>
        <div style={{ marginTop: 16 }}>
          <Eyebrow>Leave a note</Eyebrow>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") postNote(); }}
              placeholder="Add an instruction or update…"
              style={{ ...selectStyle, flex: 1 }}
            />
            <Button onClick={postNote} loading={busy} disabled={!note.trim()}>Post</Button>
          </div>
        </div>
      </div>

      <div>
        <Eyebrow>Activity</Eyebrow>
        <div style={{ marginTop: 10 }}>
          {updates === null ? (
            <div style={{ fontSize: 13, color: "#A3A3A3" }}>Loading…</div>
          ) : updates.length === 0 ? (
            <div style={{ fontSize: 13, color: "#A3A3A3" }}>No activity yet.</div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {updates.map((u) => (
                <li key={u.id} style={{ display: "flex", gap: 10 }}>
                  <div style={timelineDot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#0A0A0A" }}><ActivityText update={u} /></div>
                    <div style={{ fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>{u.author?.name || "Someone"} · {relativeTime(u.created_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .ticket-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function ActivityText({ update: u }: { update: TicketUpdate }) {
  if (u.type === "created") return <>Created this task.</>;
  if (u.type === "assigned") return <>Reassigned the task.</>;
  if (u.type === "status_change")
    return <>Moved from <b>{u.old_status ? STATUS_LABEL[u.old_status] : "—"}</b> to <b>{u.new_status ? STATUS_LABEL[u.new_status] : "—"}</b>.</>;
  return <>{u.body}</>;
}

/* ---- AI create ---- */

type Draft = {
  title: string;
  description: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
  priority: string;
  due_date: string | null;
};

function AiCreateForm({
  team,
  onCreated,
  onError,
}: {
  team: TeamMember[];
  onCreated: (msg: string) => void;
  onError: (err: string) => void;
}) {
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [creating, setCreating] = useState(false);

  const runDraft = async () => {
    if (!text.trim()) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/admin/tickets/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (!res.ok) { onError(json.error || "Couldn't draft tasks."); return; }
      const d: Draft[] = json.drafts || [];
      if (d.length === 0) { onError("No tasks found in that note. Try adding more detail."); return; }
      setDrafts(d);
    } finally { setDrafting(false); }
  };

  const createAll = async () => {
    if (!drafts || drafts.length === 0) return;
    setCreating(true);
    try {
      const results = await Promise.all(
        drafts.map((d) =>
          fetch("/api/admin/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: d.title, description: d.description, assignee_id: d.assignee_id, priority: d.priority, due_date: d.due_date, source: "ai" }),
          }).then((r) => r.ok),
        ),
      );
      const n = results.filter(Boolean).length;
      onCreated(`Created ${n} task${n === 1 ? "" : "s"} with AI.`);
    } finally { setCreating(false); }
  };

  const patch = (i: number, p: Partial<Draft>) =>
    setDrafts((prev) => (prev ? prev.map((d, idx) => (idx === i ? { ...d, ...p } : d)) : prev));
  const remove = (i: number) =>
    setDrafts((prev) => (prev ? prev.filter((_, idx) => idx !== i) : prev));

  if (!drafts) {
    return (
      <div>
        <p style={{ fontSize: 13.5, color: "#525252", margin: "0 0 12px", lineHeight: 1.55 }}>
          Paste a messy note — voice transcript, WhatsApp dump, whatever. The AI turns it into clean tasks you can review before saving.
        </p>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="e.g. Tell Ahmed to finish the Dubai order by Thursday, urgent. Priya redo the report."
          style={{ ...selectStyle, height: "auto", padding: "10px 12px", resize: "vertical", lineHeight: 1.5 }}
        />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={runDraft} loading={drafting} disabled={!text.trim()}>{drafting ? "Reading…" : "✨ Draft tasks"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "#525252", margin: "0 0 14px" }}>
        Review and tweak, then create. {drafts.length} task{drafts.length === 1 ? "" : "s"} found.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "48vh", overflowY: "auto" }}>
        {drafts.map((d, i) => (
          <div key={i} style={{ border: "1px solid rgba(17,24,39,0.10)", borderRadius: 10, padding: 12, background: "#FCFCFC" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={d.title} onChange={(e) => patch(i, { title: e.target.value })} style={{ ...selectStyle, fontWeight: 600 }} />
              <button type="button" onClick={() => remove(i)} aria-label="Remove" style={{ border: "none", background: "transparent", color: "#A3A3A3", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
              <select value={d.assignee_id || ""} onChange={(e) => patch(i, { assignee_id: e.target.value || null })} style={selectStyle}>
                <option value="">Unassigned</option>
                {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select value={d.priority} onChange={(e) => patch(i, { priority: e.target.value })} style={selectStyle}>
                {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
              </select>
              <input type="date" value={d.due_date || ""} onChange={(e) => patch(i, { due_date: e.target.value || null })} style={selectStyle} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 10 }}>
        <Button variant="secondary" onClick={() => setDrafts(null)} disabled={creating}>Back</Button>
        <Button onClick={createAll} loading={creating} disabled={drafts.length === 0}>Create {drafts.length} task{drafts.length === 1 ? "" : "s"}</Button>
      </div>
    </div>
  );
}

/* ---- new task ---- */

function NewTaskForm({
  team,
  onCreated,
  onError,
}: {
  team: TeamMember[];
  onCreated: (msg: string) => void;
  onError: (err: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: description || null, assignee_id: assignee || null, priority, due_date: due || null }),
      });
      const json = await res.json();
      if (!res.ok) { onError(json.error || "Failed to create task."); return; }
      onCreated(`Created “${title.trim()}”.`);
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit}>
      <Input label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Finish the Dubai order" required autoFocus />
      <div style={{ height: 14 }} />
      <label style={{ display: "block" }}>
        <span style={fieldLabelStyle}>Description (optional)</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any detail the assignee needs…" rows={3} style={{ ...selectStyle, height: "auto", padding: "10px 12px", resize: "vertical" }} />
      </label>
      <div style={{ height: 14 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={{ display: "block" }}>
          <span style={fieldLabelStyle}>Assignee</span>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={selectStyle}>
            <option value="">Unassigned</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label style={{ display: "block" }}>
          <span style={fieldLabelStyle}>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
            {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
          </select>
        </label>
      </div>
      <div style={{ height: 14 }} />
      <label style={{ display: "block" }}>
        <span style={fieldLabelStyle}>Due date (optional)</span>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={selectStyle} />
      </label>
      {team.length === 0 && (
        <p style={{ fontSize: 12.5, color: "#A3A3A3", margin: "12px 0 0" }}>
          Tip: add an employee on the Employees tab so you can assign this task.
        </p>
      )}
      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" disabled={busy || !title.trim()} loading={busy}>Create task</Button>
      </div>
    </form>
  );
}

/* ---- bits + styles ---- */

function ToastBanner({ toast }: { toast: NonNullable<Toast> }) {
  return (
    <div style={{ padding: "10px 14px", background: toast.kind === "success" ? "rgba(22,163,74,0.10)" : "rgba(220,38,38,0.08)", border: `1px solid ${toast.kind === "success" ? "rgba(22,163,74,0.30)" : "rgba(220,38,38,0.25)"}`, borderRadius: 10, fontSize: 13, color: toast.kind === "success" ? "#15803D" : "#B91C1C" }}>
      {toast.message}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "block" }}><span style={fieldLabelStyle}>{label}</span>{children}</label>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "#A3A3A3" }}>{children}</div>;
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

const selectStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, border: "1px solid rgba(17,24,39,0.10)", borderRadius: 8, outline: "none", background: "white", color: "#0A0A0A", boxSizing: "border-box" };
const fieldLabelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#525252", marginBottom: 6 };
const codeStyle: React.CSSProperties = { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, background: "rgba(17,24,39,0.06)", padding: "1px 5px", borderRadius: 4 };
const timelineDot: React.CSSProperties = { width: 8, height: 8, borderRadius: 999, background: "#C62828", marginTop: 5, flexShrink: 0 };
const columnStyle: React.CSSProperties = { flex: "1 0 250px", minWidth: 250, maxWidth: 340, borderRadius: 12, padding: 10, boxSizing: "border-box", transition: "background 120ms ease" };
const colHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 10px" };
const cardStyle: React.CSSProperties = { background: "white", border: "1px solid rgba(17,24,39,0.08)", borderRadius: 10, padding: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", cursor: "grab" };
const avatarDot: React.CSSProperties = { width: 18, height: 18, borderRadius: 999, background: "linear-gradient(135deg, #C62828, #8B1A1A)", color: "white", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 };
