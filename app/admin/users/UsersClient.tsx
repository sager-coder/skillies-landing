"use client";

/**
 * Users management — full UX:
 *   - Server-paginated search (debounced) hitting /api/admin/students?q=
 *   - Filter pills: All / Admins / Blocked
 *   - Client-side pagination over the fetched window
 *   - Row click expands a detail panel with: enrolled courses, grant
 *     access form, block toggle
 *   - Toasts surface via Card-styled inline banners
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/admin-ui/Card";
import Button from "@/components/admin-ui/Button";
import Badge from "@/components/admin-ui/Badge";
import SearchInput from "@/components/admin-ui/SearchInput";
import EmptyState from "@/components/admin-ui/EmptyState";
import Pagination from "@/components/admin-ui/Pagination";
import Modal from "@/components/admin-ui/Modal";
import Input from "@/components/admin-ui/Input";

type Enrollment = { course_id: string; tier: string; enrolled_at: string };

type Student = {
  id: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  blocked: boolean;
  bound_device_id: string | null;
  device_bound_at: string | null;
  created_at: string;
  enrollments: Enrollment[];
};

type CourseRef = { id: string; title: string };

const PAGE_SIZE = 20;
type FilterKey = "all" | "admins" | "blocked";

type Toast = { kind: "success" | "error"; message: string } | null;

export default function UsersClient({ courses }: { courses: CourseRef[] }) {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [addOpen, setAddOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/students${query ? `?q=${encodeURIComponent(query)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setStudents(json.students || []);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      if (filter === "admins") return s.is_admin;
      if (filter === "blocked") return s.blocked;
      return true;
    });
  }, [students, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    // Snap back to page 1 whenever filters/query change.
    setPage(1);
  }, [filter, query, students]);

  // Total counts for the filter pills (computed once over full set)
  const totals = useMemo(() => {
    if (!students) return { all: 0, admins: 0, blocked: 0 };
    return {
      all: students.length,
      admins: students.filter((s) => s.is_admin).length,
      blocked: students.filter((s) => s.blocked).length,
    };
  }, [students]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
            }}
          >
            All users
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.5,
            }}
          >
            Every person who has signed in. Search by phone, name, or email.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <span style={{ display: "inline-flex", marginRight: 6 }}>＋</span>
          Add user
        </Button>
      </div>

      {/* Filter + search toolbar */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "rgba(17,24,39,0.04)", borderRadius: 10 }}>
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")} count={totals.all}>
            All
          </FilterPill>
          <FilterPill active={filter === "admins"} onClick={() => setFilter("admins")} count={totals.admins}>
            Admins
          </FilterPill>
          <FilterPill active={filter === "blocked"} onClick={() => setFilter("blocked")} count={totals.blocked}>
            Blocked
          </FilterPill>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <SearchInput
            value={query}
            onChange={setQuery}
            onDebouncedChange={setQuery}
            placeholder="Search by phone, name, or email…"
          />
        </div>
      </div>

      {toast && (
        <div
          style={{
            padding: "10px 14px",
            background:
              toast.kind === "success"
                ? "rgba(22,163,74,0.10)"
                : "rgba(220,38,38,0.08)",
            border: `1px solid ${
              toast.kind === "success" ? "rgba(22,163,74,0.30)" : "rgba(220,38,38,0.25)"
            }`,
            borderRadius: 10,
            fontSize: 13,
            color: toast.kind === "success" ? "#15803D" : "#B91C1C",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Users table */}
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {["User", "Phone", "Email", "Enrolled in", "Status", "Joined", ""].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && !students ? (
                <tr>
                  <td colSpan={7} style={emptyCell}>
                    Loading…
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon="👤"
                      title={query ? "No users match that search" : "No users yet"}
                      description={
                        query
                          ? "Try a different phone, name or email."
                          : "Once people sign in, they'll appear here."
                      }
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((s) => {
                  const open = openDetailId === s.id;
                  const displayName = nameOf(s);
                  return (
                    <React.Fragment key={s.id}>
                      <tr
                        onClick={() => setOpenDetailId((prev) => (prev === s.id ? null : s.id))}
                        style={{
                          background: open ? "rgba(17,24,39,0.02)" : "white",
                          cursor: "pointer",
                          borderTop: "1px solid rgba(17,24,39,0.06)",
                        }}
                      >
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar text={displayName} />
                            <div>
                              <div style={{ fontWeight: 600, color: "#0A0A0A" }}>
                                {displayName}
                              </div>
                              {s.first_name && (
                                <div style={{ fontSize: 12, color: "#A3A3A3" }}>
                                  {s.is_admin ? "Admin" : "Student"}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 }}>
                          {s.phone || "—"}
                        </td>
                        <td style={tdStyle}>{s.email || <span style={{ color: "#A3A3A3" }}>—</span>}</td>
                        <td style={tdStyle}>
                          {s.enrollments.length === 0 ? (
                            <span style={{ color: "#A3A3A3" }}>—</span>
                          ) : (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {s.enrollments.slice(0, 2).map((e) => (
                                <Badge key={e.course_id} variant="success">
                                  {e.course_id}
                                </Badge>
                              ))}
                              {s.enrollments.length > 2 && (
                                <Badge variant="neutral">
                                  +{s.enrollments.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <StatusBadges student={s} />
                        </td>
                        <td style={{ ...tdStyle, color: "#525252", fontSize: 13 }}>
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ color: "#A3A3A3", fontSize: 14 }}>
                            {open ? "▾" : "▸"}
                          </span>
                        </td>
                      </tr>
                      {open && (
                        <tr style={{ background: "rgba(17,24,39,0.02)" }}>
                          <td colSpan={7} style={{ padding: 0 }}>
                            <UserDetail
                              student={s}
                              courses={courses}
                              onChange={() => refresh()}
                              onToast={setToast}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {filtered.length > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Add user modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add user">
        <AddUserForm
          courses={courses}
          onCreated={(msg) => {
            setAddOpen(false);
            setToast({ kind: "success", message: msg });
            refresh();
          }}
          onError={(err) => setToast({ kind: "error", message: err })}
        />
      </Modal>
    </div>
  );
}

function FilterPill({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: "none",
        background: active ? "white" : "transparent",
        color: active ? "#0A0A0A" : "#525252",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
        transition: "background 160ms ease, color 160ms ease",
      }}
    >
      {children}
      <span
        style={{
          minWidth: 18,
          padding: "1px 6px",
          borderRadius: 999,
          background: active ? "rgba(198,40,40,0.10)" : "rgba(17,24,39,0.08)",
          color: active ? "#C62828" : "#525252",
          fontSize: 11,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function StatusBadges({ student }: { student: Student }) {
  if (student.blocked) return <Badge variant="danger">Blocked</Badge>;
  if (student.is_admin) return <Badge variant="info">Admin</Badge>;
  if (student.enrollments.length > 0) return <Badge variant="success">Active</Badge>;
  return <Badge variant="neutral">Signed up</Badge>;
}

function Avatar({ text }: { text: string }) {
  const initials = (text.match(/\b[a-zA-Z0-9]/g) || [])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  return (
    <span
      aria-hidden
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        background: "linear-gradient(135deg, #C62828, #8B1A1A)",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

function nameOf(s: Student): string {
  if (s.full_name) return s.full_name;
  if (s.first_name || s.last_name) {
    return [s.first_name, s.last_name].filter(Boolean).join(" ");
  }
  return s.phone || "—";
}

function UserDetail({
  student,
  courses,
  onChange,
  onToast,
}: {
  student: Student;
  courses: CourseRef[];
  onChange: () => void;
  onToast: (t: Toast) => void;
}) {
  const [chosenCourse, setChosenCourse] = useState(courses[0]?.id || "");
  const [tier, setTier] = useState<"founding" | "standard" | "pro">("standard");
  const [busy, setBusy] = useState(false);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenCourse) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/students/${encodeURIComponent(student.id)}/enrollments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: chosenCourse, tier }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        onToast({ kind: "error", message: json.error || "Failed." });
        return;
      }
      onToast({
        kind: "success",
        message: `Granted ${chosenCourse} (${tier}) to ${nameOf(student)}.`,
      });
      onChange();
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (course_id: string) => {
    if (!confirm(`Revoke "${course_id}" for this user?`)) return;
    const res = await fetch(
      `/api/admin/students/${encodeURIComponent(student.id)}/enrollments?course_id=${encodeURIComponent(course_id)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      onToast({ kind: "success", message: `Revoked ${course_id}.` });
      onChange();
    } else {
      const j = await res.json().catch(() => ({}));
      onToast({ kind: "error", message: j.error || "Failed." });
    }
  };

  const toggleBlock = async () => {
    if (
      !confirm(
        student.blocked
          ? "Unblock this user? They'll regain access immediately."
          : "Block this user? They won't be able to access any course content.",
      )
    )
      return;
    const res = await fetch(
      `/api/admin/students/${encodeURIComponent(student.id)}/block`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: !student.blocked }),
      },
    );
    const json = await res.json();
    if (!res.ok) {
      onToast({ kind: "error", message: json.error || "Failed." });
      return;
    }
    onToast({
      kind: "success",
      message: student.blocked ? "User unblocked." : "User blocked.",
    });
    onChange();
  };

  return (
    <div
      style={{
        padding: "18px 22px 22px",
        borderTop: "1px solid rgba(17,24,39,0.06)",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 1fr",
        gap: 22,
      }}
      className="user-detail-grid"
    >
      {/* Profile */}
      <div>
        <Eyebrow>Profile</Eyebrow>
        <dl style={{ margin: "8px 0 0", display: "grid", rowGap: 6 }}>
          <Row label="Name" value={nameOf(student)} />
          <Row label="Phone" value={student.phone || "—"} mono />
          <Row label="Email" value={student.email || "—"} />
          <Row
            label="Joined"
            value={new Date(student.created_at).toLocaleString()}
          />
        </dl>
      </div>

      {/* Current access */}
      <div>
        <Eyebrow>Current access</Eyebrow>
        {student.enrollments.length === 0 ? (
          <p style={{ fontSize: 13, color: "#525252", margin: "8px 0 0" }}>
            No active enrollments.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "8px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {student.enrollments.map((e) => (
              <li
                key={e.course_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "white",
                  border: "1px solid rgba(17,24,39,0.08)",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontFamily: "ui-monospace, Menlo, monospace" }}>
                    {e.course_id}
                  </div>
                  <div style={{ fontSize: 11, color: "#A3A3A3", marginTop: 2 }}>
                    tier <b>{e.tier}</b> · {new Date(e.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => revoke(e.course_id)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Grant + block actions */}
      <div>
        <Eyebrow>Grant access</Eyebrow>
        <form onSubmit={grant} style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              value={chosenCourse}
              onChange={(e) => setChosenCourse(e.target.value)}
              style={selectStyle}
            >
              {courses.length === 0 && <option value="">No courses</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as "founding" | "standard" | "pro")}
              style={{ ...selectStyle, flex: "0 0 130px" }}
            >
              <option value="standard">standard</option>
              <option value="pro">pro</option>
              <option value="founding">founding</option>
            </select>
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="submit" disabled={busy || !chosenCourse} loading={busy}>
              Grant access
            </Button>
          </div>
        </form>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed rgba(17,24,39,0.10)" }}>
          <Eyebrow>Moderation</Eyebrow>
          <div style={{ marginTop: 8 }}>
            <Button
              variant={student.blocked ? "secondary" : "danger"}
              onClick={toggleBlock}
              size="sm"
            >
              {student.blocked ? "Unblock user" : "Block user"}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .user-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function AddUserForm({
  courses,
  onCreated,
  onError,
}: {
  courses: CourseRef[];
  onCreated: (msg: string) => void;
  onError: (err: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState(courses[0]?.id || "");
  const [tier, setTier] = useState<"founding" | "standard" | "pro">("standard");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      // Reuse the existing enroll endpoint — it creates the auth user
      // (pre-confirmed) AND grants the chosen course in one call.
      const cleaned = phone.replace(/\D/g, "");
      const e164 = cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;
      const res = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: e164,
          full_name: name || null,
          course,
          tier,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        onError(json.error || "Failed to add user.");
        return;
      }
      onCreated(`Added ${e164} to ${course} (${tier}).`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Input
        label="Phone (with country code)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        required
      />
      <div style={{ height: 14 }} />
      <Input
        label="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Student's full name"
      />
      <div style={{ height: 14 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
        <label style={{ display: "block" }}>
          <span style={inputLabelStyle}>Course</span>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={selectStyle}
          >
            {courses.length === 0 && <option value="">No courses</option>}
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "block" }}>
          <span style={inputLabelStyle}>Tier</span>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as "founding" | "standard" | "pro")}
            style={selectStyle}
          >
            <option value="standard">standard</option>
            <option value="pro">pro</option>
            <option value="founding">founding</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" disabled={busy || !phone || !course} loading={busy}>
          Add user
        </Button>
      </div>
    </form>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 600,
        color: "#A3A3A3",
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          gap: 8,
          fontSize: 13,
        }}
      >
        <dt style={{ color: "#A3A3A3" }}>{label}</dt>
        <dd
          style={{
            margin: 0,
            color: "#0A0A0A",
            fontFamily: mono ? "ui-monospace, Menlo, monospace" : undefined,
          }}
        >
          {value}
        </dd>
      </div>
    </>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#A3A3A3",
  background: "rgba(17,24,39,0.02)",
  borderBottom: "1px solid rgba(17,24,39,0.06)",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  color: "#0A0A0A",
  verticalAlign: "middle",
};

const emptyCell: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
  color: "#A3A3A3",
};

const selectStyle: React.CSSProperties = {
  flex: "1 1 200px",
  padding: "9px 12px",
  fontSize: 13,
  border: "1px solid rgba(17,24,39,0.10)",
  borderRadius: 8,
  outline: "none",
  background: "white",
  color: "#0A0A0A",
};

const inputLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#525252",
  marginBottom: 6,
};
