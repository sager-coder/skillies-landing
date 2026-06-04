"use client";

/**
 * Employee task view. Deliberately minimal + thumb-friendly: each task
 * is a card, status is a row of big tap targets, and a note box lets the
 * person leave a one-line progress update. Every change posts to
 * /api/tickets/[id]/update and writes to the activity log the founder
 * sees.
 */
import { useCallback, useMemo, useState } from "react";
import Badge from "@/components/admin-ui/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  TICKET_STATUSES,
  STATUS_LABEL,
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
}: {
  initialTickets: Task[];
  name: string | null;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTickets);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const update = useCallback(
    async (id: string, payload: { status?: TicketStatus; note?: string }) => {
      const res = await fetch(`/api/tickets/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        flash(json.error || "Couldn't save — try again.");
        return false;
      }
      if (payload.status) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: payload.status!,
                  updated_at: new Date().toISOString(),
                }
              : t,
          ),
        );
      }
      flash(payload.note ? "Note added ✓" : "Updated ✓");
      return true;
    },
    [flash],
  );

  const { active, done } = useMemo(() => {
    const a = tasks.filter((t) => t.status !== "done");
    const d = tasks.filter((t) => t.status === "done");
    return { active: a, done: d };
  }, [tasks]);

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
        {/* Top bar */}
        <header style={headerStyle}>
          <span style={brandStyle}>
            SKILLIES<span style={{ color: "#C62828" }}>.AI</span>
          </span>
          <LogoutButton />
        </header>

        {/* Greeting */}
        <div style={{ padding: "8px 0 20px" }}>
          <h1 style={h1Style}>{name ? `Hi ${name} 👋` : "Your tasks"}</h1>
          <p style={{ margin: "6px 0 0", color: "#525252", fontSize: 14 }}>
            {active.length === 0
              ? "Nothing on your plate right now."
              : `You have ${active.length} task${active.length === 1 ? "" : "s"} to work on.`}
          </p>
        </div>

        {toast && <div style={toastStyle}>{toast}</div>}

        {/* Active */}
        {active.length === 0 && done.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: 40 }}>🎉</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>No tasks assigned</div>
            <div style={{ color: "#525252", fontSize: 14, marginTop: 4 }}>
              When your manager assigns you something, it&apos;ll appear here.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {active.map((t) => (
              <TaskCard key={t.id} task={t} onUpdate={update} />
            ))}
          </div>
        )}

        {/* Done */}
        {done.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={sectionLabelStyle}>Done ({done.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
              {done.map((t) => (
                <TaskCard key={t.id} task={t} onUpdate={update} />
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (
    id: string,
    payload: { status?: TicketStatus; note?: string },
  ) => Promise<boolean>;
}) {
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const dimmed = task.status === "done";

  const overdue =
    !!task.due_date &&
    task.status !== "done" &&
    new Date(task.due_date) < new Date(new Date().toDateString());

  const postNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    const ok = await onUpdate(task.id, { note: note.trim() });
    setBusy(false);
    if (ok) {
      setNote("");
      setNoteOpen(false);
    }
  };

  return (
    <div style={{ ...cardStyle, opacity: dimmed ? 0.7 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.35 }}>
          {task.title}
        </div>
        <Badge variant={PRIORITY_BADGE[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
      </div>

      {task.description && (
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#525252", lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      {task.due_date && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: overdue ? "#B91C1C" : "#A3A3A3", fontWeight: overdue ? 600 : 400 }}>
          Due {new Date(task.due_date).toLocaleDateString()}
          {overdue ? " · overdue" : ""}
        </div>
      )}

      {/* Status picker */}
      <div style={{ marginTop: 14 }}>
        <div style={miniLabelStyle}>Status</div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {TICKET_STATUSES.map((s) => {
            const active = task.status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (!active) onUpdate(task.id, { status: s });
                }}
                style={{
                  flex: "1 1 0",
                  minWidth: 72,
                  padding: "9px 8px",
                  borderRadius: 9,
                  border: active ? "1px solid #C62828" : "1px solid rgba(17,24,39,0.12)",
                  background: active ? "#C62828" : "white",
                  color: active ? "white" : "#525252",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: active ? "default" : "pointer",
                }}
              >
                {STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div style={{ marginTop: 12 }}>
        {!noteOpen ? (
          <button type="button" onClick={() => setNoteOpen(true)} style={addNoteBtnStyle}>
            ＋ Add a progress note
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") postNote();
              }}
              placeholder="What's the latest?"
              style={noteInputStyle}
            />
            <button
              type="button"
              onClick={postNote}
              disabled={busy || !note.trim()}
              style={{
                ...postBtnStyle,
                opacity: busy || !note.trim() ? 0.5 : 1,
                cursor: busy || !note.trim() ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "…" : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await Promise.race([
        supabase.auth.signOut({ scope: "local" }),
        new Promise<void>((r) => setTimeout(r, 1500)),
      ]);
    } catch {
      /* swallow */
    }
    try {
      for (const part of document.cookie.split(";")) {
        const n = part.trim().split("=")[0];
        if (n && n.startsWith("sb-")) {
          document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    } catch {
      /* swallow */
    }
    // Back to the employee login (the /my-tasks page shows it when logged out).
    window.location.href = "/my-tasks";
  };
  return (
    <button type="button" onClick={logout} disabled={busy} style={logoutStyle}>
      {busy ? "…" : "Log out"}
    </button>
  );
}

/* styles */
const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#FAF9F7",
  fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
  color: "#0A0A0A",
};
const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
};
const brandStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 17,
  letterSpacing: "-0.01em",
};
const h1Style: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 26,
  fontWeight: 600,
  letterSpacing: "-0.02em",
};
const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(17,24,39,0.08)",
  borderRadius: 14,
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  padding: 16,
};
const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#A3A3A3",
};
const miniLabelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#A3A3A3",
};
const addNoteBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#C62828",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
};
const noteInputStyle: React.CSSProperties = {
  flex: 1,
  height: 40,
  padding: "0 12px",
  borderRadius: 9,
  border: "1px solid rgba(17,24,39,0.12)",
  outline: "none",
  fontSize: 14,
  background: "white",
  color: "#0A0A0A",
};
const postBtnStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 9,
  border: "none",
  background: "#C62828",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
};
const logoutStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(17,24,39,0.12)",
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 13,
  fontWeight: 500,
  color: "#525252",
  cursor: "pointer",
};
const toastStyle: React.CSSProperties = {
  position: "sticky",
  top: 8,
  zIndex: 10,
  margin: "0 0 14px",
  padding: "10px 14px",
  background: "rgba(22,163,74,0.12)",
  border: "1px solid rgba(22,163,74,0.30)",
  borderRadius: 10,
  fontSize: 13.5,
  color: "#15803D",
  fontWeight: 500,
};
const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "56px 24px",
  background: "white",
  border: "1px solid rgba(17,24,39,0.08)",
  borderRadius: 14,
};
