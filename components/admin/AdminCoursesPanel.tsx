"use client";

import React, { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  mentor_name: string | null;
  duration_label: string | null;
  thumbnail_url: string | null;
  total_lessons: number | null;
  status: "live" | "drafting" | "recording" | "planned";
  is_published: boolean;
  sort_order: number;
};

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

export default function AdminCoursesPanel() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setCourses(json.courses || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const togglePublished = async (c: Course) => {
    const res = await fetch(`/api/admin/courses/${encodeURIComponent(c.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !c.is_published }),
    });
    if (res.ok) refresh();
    else {
      const j = await res.json().catch(() => ({}));
      setResult({ ok: false, error: j.error || "Failed." });
    }
  };

  const remove = async (c: Course) => {
    if (
      !confirm(
        `Delete "${c.title}"? This deletes all enrollments and lessons for this course. This cannot be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/courses/${encodeURIComponent(c.id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setResult({ ok: true, message: `Deleted "${c.title}".` });
      refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setResult({ ok: false, error: j.error || "Failed." });
    }
  };

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
            Course Management
          </div>
          <h2
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
            }}
          >
            Courses
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowCreate(true);
          }}
          style={primaryBtn}
        >
          + New course
        </button>
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

      {(showCreate || editing) && (
        <CourseFormCard
          initial={editing}
          onCancel={() => {
            setShowCreate(false);
            setEditing(null);
          }}
          onSaved={(msg) => {
            setShowCreate(false);
            setEditing(null);
            setResult({ ok: true, message: msg });
            refresh();
          }}
          onError={(err) => setResult({ ok: false, error: err })}
        />
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#FAF5EB" }}>
              {["Course", "Mentor", "Duration", "Lessons", "Status", "Published", ""].map(
                (h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading && !courses ? (
              <tr>
                <td colSpan={7} style={emptyCell}>
                  Loading…
                </td>
              </tr>
            ) : !courses || courses.length === 0 ? (
              <tr>
                <td colSpan={7} style={emptyCell}>
                  No courses yet. Click <b>+ New course</b> to add one.
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: "#1A1A1A" }}>
                      {c.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "ui-monospace, Menlo, monospace",
                        color: "#9CA3AF",
                      }}
                    >
                      {c.id}
                    </div>
                  </td>
                  <td style={tdStyle}>{c.mentor_name || "—"}</td>
                  <td style={tdStyle}>{c.duration_label || "—"}</td>
                  <td style={tdStyle}>{c.total_lessons ?? "—"}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        color: "#C62828",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      type="button"
                      onClick={() => togglePublished(c)}
                      style={{
                        ...pillBtn,
                        background: c.is_published
                          ? "rgba(91,123,91,0.95)"
                          : "rgba(26,26,26,0.08)",
                        color: c.is_published ? "white" : "#6B7280",
                      }}
                    >
                      {c.is_published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        style={ghostBtn}
                        onClick={() => {
                          setShowCreate(false);
                          setEditing(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={dangerBtn}
                        onClick={() => remove(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseFormCard({
  initial,
  onCancel,
  onSaved,
  onError,
}: {
  initial: Course | null;
  onCancel: () => void;
  onSaved: (message: string) => void;
  onError: (err: string) => void;
}) {
  const [id, setId] = useState(initial?.id || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [shortDesc, setShortDesc] = useState(initial?.short_description || "");
  const [desc, setDesc] = useState(initial?.description || "");
  const [mentor, setMentor] = useState(initial?.mentor_name || "");
  const [duration, setDuration] = useState(initial?.duration_label || "");
  const [thumb, setThumb] = useState(initial?.thumbnail_url || "");
  const [totalLessons, setTotalLessons] = useState<string>(
    initial?.total_lessons?.toString() || "",
  );
  const [status, setStatus] = useState<Course["status"]>(initial?.status || "live");
  const [busy, setBusy] = useState(false);

  const isEdit = !!initial;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        title,
        short_description: shortDesc,
        description: desc,
        mentor_name: mentor,
        duration_label: duration,
        thumbnail_url: thumb,
        total_lessons: totalLessons ? Number(totalLessons) : null,
        status,
      };
      const res = isEdit
        ? await fetch(`/api/admin/courses/${encodeURIComponent(initial!.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...payload }),
          });
      const json = await res.json();
      if (!res.ok) {
        onError(json.error || "Failed.");
      } else {
        onSaved(
          isEdit ? `Updated "${title}".` : `Created "${title}".`,
        );
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        marginBottom: 22,
        padding: 22,
        background: "#FAF5EB",
        borderRadius: 14,
        border: "1px solid rgba(26,26,26,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#C62828",
          marginBottom: 12,
        }}
      >
        {isEdit ? `Edit · ${initial!.id}` : "New course"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <Field label="ID (URL slug)">
          <input
            value={id}
            onChange={(e) =>
              setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            disabled={isEdit}
            placeholder="e.g. kdp-mastery"
            required
            style={{ ...inputStyle, opacity: isEdit ? 0.5 : 1 }}
          />
        </Field>
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="KDP Mastery · 50-Day Program"
            style={inputStyle}
          />
        </Field>
        <Field label="Mentor">
          <input
            value={mentor}
            onChange={(e) => setMentor(e.target.value)}
            placeholder="Ehsan Sager"
            style={inputStyle}
          />
        </Field>
        <Field label="Duration label">
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="50 days"
            style={inputStyle}
          />
        </Field>
        <Field label="Total lessons">
          <input
            type="number"
            min={0}
            value={totalLessons}
            onChange={(e) => setTotalLessons(e.target.value)}
            placeholder="50"
            style={inputStyle}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Course["status"])}
            style={inputStyle}
          >
            <option value="live">live</option>
            <option value="drafting">drafting</option>
            <option value="recording">recording</option>
            <option value="planned">planned</option>
          </select>
        </Field>
      </div>
      <div style={{ marginTop: 12 }}>
        <Field label="Thumbnail URL (optional)">
          <input
            value={thumb}
            onChange={(e) => setThumb(e.target.value)}
            placeholder="https://… (leave blank for branded gradient)"
            style={inputStyle}
          />
        </Field>
      </div>
      <div style={{ marginTop: 12 }}>
        <Field label="Short description (one line, for cards)">
          <input
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            maxLength={140}
            placeholder="One sentence that sells the course."
            style={inputStyle}
          />
        </Field>
      </div>
      <div style={{ marginTop: 12 }}>
        <Field label="Long description (course detail page)">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="What the course covers, who it's for, how it's run…"
            style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }}
          />
        </Field>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <button type="submit" disabled={busy} style={primaryBtn}>
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create course"}
        </button>
        <button type="button" onClick={onCancel} style={ghostBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  fontSize: 14,
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

const ghostBtn: React.CSSProperties = {
  padding: "8px 14px",
  background: "transparent",
  color: "#1A1A1A",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "1px solid rgba(26,26,26,0.12)",
  borderRadius: 999,
  cursor: "pointer",
};

const dangerBtn: React.CSSProperties = {
  padding: "8px 14px",
  background: "transparent",
  color: "#C62828",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "1px solid rgba(198,40,40,0.30)",
  borderRadius: 999,
  cursor: "pointer",
};

const pillBtn: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  border: "none",
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
