"use client";

import React, { useCallback, useEffect, useState } from "react";

type Student = {
  id: string;
  phone: string | null;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  bound_device_id: string | null;
  device_bound_at: string | null;
  created_at: string;
  enrollments: {
    course_id: string;
    tier: string;
    enrolled_at: string;
  }[];
};

type CourseRef = { id: string; title: string };

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

export default function AdminStudentsPanel({
  courses,
}: {
  /** Server-rendered list of available courses; saves a round-trip. */
  courses: CourseRef[];
}) {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/students${debouncedQ ? `?q=${encodeURIComponent(debouncedQ)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setStudents(json.students || []);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div
      style={{
        padding: 28,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Student Management
          </div>
          <h2
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
            }}
          >
            Signed-up students
          </h2>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by phone, name or email…"
          style={{
            padding: "10px 14px",
            fontSize: 14,
            border: "1.5px solid #F0E8D8",
            borderRadius: 999,
            outline: "none",
            minWidth: 260,
            background: "#FAF5EB",
          }}
        />
      </div>

      {result && (
        <div
          style={{
            marginBottom: 14,
            padding: "10px 14px",
            background: result.ok
              ? "rgba(91,123,91,0.10)"
              : "rgba(198,40,40,0.08)",
            border: `1px solid ${
              result.ok ? "rgba(91,123,91,0.35)" : "rgba(198,40,40,0.30)"
            }`,
            color: result.ok ? "#3D5A3D" : "#C62828",
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          {result.ok ? result.message : result.error}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#FAF5EB" }}>
              {["Phone", "Name", "Email", "Enrolled in", "Signed up", ""].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && !students ? (
              <tr>
                <td colSpan={6} style={emptyCell}>
                  Loading…
                </td>
              </tr>
            ) : !students || students.length === 0 ? (
              <tr>
                <td colSpan={6} style={emptyCell}>
                  No students {debouncedQ ? "match that search" : "yet"}.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const isOpen = openId === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <tr
                      style={{
                        background: isOpen ? "#FAF5EB" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setOpenId((prev) => (prev === s.id ? null : s.id))
                      }
                    >
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "ui-monospace, Menlo, monospace",
                        }}
                      >
                        {s.phone || "—"}
                        {s.is_admin && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 9,
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: 999,
                              background: "rgba(198,40,40,0.10)",
                              color: "#C62828",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Admin
                          </span>
                        )}
                      </td>
                      <td style={tdStyle}>{s.full_name || "—"}</td>
                      <td style={tdStyle}>{s.email || "—"}</td>
                      <td style={tdStyle}>
                        {s.enrollments.length === 0 ? (
                          <span style={{ color: "#9CA3AF" }}>None</span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {s.enrollments.map((e) => (
                              <span
                                key={e.course_id}
                                style={{
                                  padding: "3px 8px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  borderRadius: 999,
                                  background: "rgba(91,123,91,0.12)",
                                  color: "#3D5A3D",
                                  fontFamily: "ui-monospace, Menlo, monospace",
                                }}
                                title={`Tier: ${e.tier}`}
                              >
                                {e.course_id}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "#6B7280",
                          fontFamily: "ui-monospace, Menlo, monospace",
                          fontSize: 12,
                        }}
                      >
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#9CA3AF", fontSize: 18 }}>
                          {isOpen ? "▾" : "▸"}
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} style={{ padding: 0, background: "#FAF5EB" }}>
                          <StudentDetail
                            student={s}
                            courses={courses}
                            onChange={() => {
                              refresh();
                            }}
                            onResult={setResult}
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
    </div>
  );
}

function StudentDetail({
  student,
  courses,
  onChange,
  onResult,
}: {
  student: Student;
  courses: CourseRef[];
  onChange: () => void;
  onResult: (r: Result) => void;
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
        onResult({ ok: false, error: json.error || "Failed." });
      } else {
        onResult({
          ok: true,
          message: `Granted ${chosenCourse} (${tier}) to ${student.phone || student.full_name}.`,
        });
        onChange();
      }
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (course_id: string) => {
    if (!confirm(`Revoke access to "${course_id}" for ${student.phone}?`)) return;
    const res = await fetch(
      `/api/admin/students/${encodeURIComponent(student.id)}/enrollments?course_id=${encodeURIComponent(course_id)}`,
      { method: "DELETE" },
    );
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      onResult({ ok: true, message: `Revoked ${course_id}.` });
      onChange();
    } else {
      onResult({ ok: false, error: json.error || "Failed." });
    }
  };

  return (
    <div
      style={{
        padding: "18px 22px 22px",
        borderTop: "1px solid rgba(26,26,26,0.06)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        {/* Existing access */}
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
              marginBottom: 8,
            }}
          >
            Current access
          </div>
          {student.enrollments.length === 0 ? (
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              No active enrollments.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {student.enrollments.map((e) => (
                <li
                  key={e.course_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "white",
                    border: "1px solid rgba(26,26,26,0.08)",
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontFamily: "ui-monospace, Menlo, monospace",
                        fontSize: 13,
                      }}
                    >
                      {e.course_id}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        marginTop: 2,
                      }}
                    >
                      tier <b>{e.tier}</b> ·{" "}
                      {new Date(e.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={dangerBtn}
                    onClick={() => revoke(e.course_id)}
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Grant access form */}
        <form onSubmit={grant}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#C62828",
              marginBottom: 8,
            }}
          >
            Grant access
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              value={chosenCourse}
              onChange={(e) => setChosenCourse(e.target.value)}
              style={{ ...inputStyle, flex: "1 1 200px" }}
            >
              {courses.length === 0 && <option value="">No courses</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.id})
                </option>
              ))}
            </select>
            <select
              value={tier}
              onChange={(e) =>
                setTier(e.target.value as "founding" | "standard" | "pro")
              }
              style={{ ...inputStyle, flex: "0 0 140px" }}
            >
              <option value="standard">standard</option>
              <option value="pro">pro</option>
              <option value="founding">founding</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={busy || !chosenCourse}
            style={{ ...primaryBtn, marginTop: 12 }}
          >
            {busy ? "Granting…" : "Grant course access"}
          </button>

          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 10 }}>
            Student gets access immediately. They&rsquo;ll see <b>Open Course</b>{" "}
            on their dashboard.
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
  border: "1.5px solid #F0E8D8",
  borderRadius: 10,
  outline: "none",
  background: "white",
  color: "#1A1A1A",
};

const primaryBtn: React.CSSProperties = {
  padding: "11px 22px",
  background: "#C62828",
  color: "white",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(198,40,40,0.20)",
};

const dangerBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "transparent",
  color: "#C62828",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "1px solid rgba(198,40,40,0.30)",
  borderRadius: 999,
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#9CA3AF",
  borderBottom: "1px solid rgba(26,26,26,0.06)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderTop: "1px solid rgba(26,26,26,0.04)",
  fontSize: 13,
  color: "#1A1A1A",
};

const emptyCell: React.CSSProperties = {
  padding: 28,
  textAlign: "center",
  color: "#9CA3AF",
  fontSize: 14,
};
