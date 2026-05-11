"use client";

/**
 * Course management. Search + status filter, table with thumbnail/title,
 * mentor, duration, enrolled count, status badge, published toggle, and
 * row actions (edit, delete). "+ New course" opens a modal.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/admin-ui/Card";
import Button from "@/components/admin-ui/Button";
import Badge from "@/components/admin-ui/Badge";
import SearchInput from "@/components/admin-ui/SearchInput";
import EmptyState from "@/components/admin-ui/EmptyState";
import Modal from "@/components/admin-ui/Modal";
import Input from "@/components/admin-ui/Input";

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
  created_at: string;
  enrolled_count: number;
};

type FilterKey = "all" | "published" | "hidden";
type Toast = { kind: "success" | "error"; message: string } | null;

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editing, setEditing] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/courses", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setCourses(json.courses || []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (filter === "published" && !c.is_published) return false;
      if (filter === "hidden" && c.is_published) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.mentor_name || "").toLowerCase().includes(q)
      );
    });
  }, [courses, query, filter]);

  const totals = useMemo(() => {
    if (!courses) return { all: 0, published: 0, hidden: 0 };
    return {
      all: courses.length,
      published: courses.filter((c) => c.is_published).length,
      hidden: courses.filter((c) => !c.is_published).length,
    };
  }, [courses]);

  const totalEnrollments = useMemo(
    () => (courses || []).reduce((s, c) => s + c.enrolled_count, 0),
    [courses],
  );

  const togglePublished = async (c: Course) => {
    const res = await fetch(`/api/admin/courses/${encodeURIComponent(c.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !c.is_published }),
    });
    if (res.ok) {
      setToast({
        kind: "success",
        message: c.is_published ? "Course hidden." : "Course published.",
      });
      refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setToast({ kind: "error", message: j.error || "Failed." });
    }
  };

  const remove = async (c: Course) => {
    if (
      !confirm(
        `Delete "${c.title}"? This deletes all enrollments and lessons for this course. Cannot be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/courses/${encodeURIComponent(c.id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setToast({ kind: "success", message: `Deleted "${c.title}".` });
      refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setToast({ kind: "error", message: j.error || "Failed." });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
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
            Course catalog
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.5,
            }}
          >
            {courses === null
              ? "Loading…"
              : `${totals.all} ${totals.all === 1 ? "course" : "courses"} · ${totalEnrollments} total enrollments`}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <span style={{ marginRight: 6 }}>＋</span>
          New course
        </Button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 4,
            padding: 4,
            background: "rgba(17,24,39,0.04)",
            borderRadius: 10,
          }}
        >
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")} count={totals.all}>
            All
          </FilterPill>
          <FilterPill
            active={filter === "published"}
            onClick={() => setFilter("published")}
            count={totals.published}
          >
            Published
          </FilterPill>
          <FilterPill
            active={filter === "hidden"}
            onClick={() => setFilter("hidden")}
            count={totals.hidden}
          >
            Hidden
          </FilterPill>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <SearchInput
            value={query}
            onChange={setQuery}
            onDebouncedChange={setQuery}
            placeholder="Search by title, ID, or mentor…"
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

      {/* Table */}
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {[
                  "Course",
                  "Mentor",
                  "Duration",
                  "Lessons",
                  "Enrolled",
                  "Status",
                  "Published",
                  "",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses === null ? (
                <tr>
                  <td colSpan={8} style={emptyCell}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <EmptyState
                      icon="📚"
                      title={query || filter !== "all" ? "No courses match" : "No courses yet"}
                      description={
                        query || filter !== "all"
                          ? "Try a different search or filter."
                          : "Click ‘+ New course’ to add the first one."
                      }
                      action={
                        !query && filter === "all" ? (
                          <Button onClick={() => setCreating(true)}>＋ New course</Button>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderTop: "1px solid rgba(17,24,39,0.06)",
                      transition: "background 160ms ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(17,24,39,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CourseThumb course={c} />
                        <div>
                          <div style={{ fontWeight: 600, color: "#0A0A0A" }}>
                            {c.title}
                          </div>
                          <div style={{ fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace", color: "#A3A3A3", marginTop: 2 }}>
                            {c.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{c.mentor_name || <Muted>—</Muted>}</td>
                    <td style={tdStyle}>{c.duration_label || <Muted>—</Muted>}</td>
                    <td style={tdStyle}>{c.total_lessons ?? <Muted>—</Muted>}</td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: "#0A0A0A" }}>
                        {c.enrolled_count}
                      </span>
                      {c.enrolled_count > 0 && (
                        <span style={{ marginLeft: 6, color: "#A3A3A3", fontSize: 12 }}>
                          student{c.enrolled_count === 1 ? "" : "s"}
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                    </td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={c.is_published}
                        onClick={() => togglePublished(c)}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 999,
                          background: c.is_published ? "#16A34A" : "rgba(17,24,39,0.15)",
                          border: "none",
                          padding: 0,
                          position: "relative",
                          cursor: "pointer",
                          transition: "background 160ms ease",
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            top: 2,
                            left: c.is_published ? 18 : 2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "white",
                            transition: "left 160ms ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.20)",
                          }}
                        />
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(c)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => remove(c)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="New course" width={620}>
        <CourseForm
          initial={null}
          onSaved={(msg) => {
            setCreating(false);
            setToast({ kind: "success", message: msg });
            refresh();
          }}
          onError={(err) => setToast({ kind: "error", message: err })}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit · ${editing?.id || ""}`} width={620}>
        {editing && (
          <CourseForm
            initial={editing}
            onSaved={(msg) => {
              setEditing(null);
              setToast({ kind: "success", message: msg });
              refresh();
            }}
            onError={(err) => setToast({ kind: "error", message: err })}
          />
        )}
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

function CourseThumb({ course }: { course: Course }) {
  if (course.thumbnail_url) {
    return (
      <div
        style={{
          width: 48,
          height: 32,
          borderRadius: 6,
          background: `url(${course.thumbnail_url}) center / cover no-repeat`,
          flexShrink: 0,
          border: "1px solid rgba(17,24,39,0.08)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 48,
        height: 32,
        borderRadius: 6,
        background: "linear-gradient(135deg, #C62828, #8B1A1A)",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      {initialsOf(course.title)}
    </div>
  );
}

function statusVariant(s: Course["status"]): "success" | "warning" | "info" | "neutral" {
  if (s === "live") return "success";
  if (s === "drafting" || s === "recording") return "warning";
  return "neutral";
}

function initialsOf(t: string): string {
  return (t.match(/\b[a-zA-Z0-9]/g) || []).slice(0, 2).join("").toUpperCase() || "SK";
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#A3A3A3" }}>{children}</span>;
}

function CourseForm({
  initial,
  onSaved,
  onError,
}: {
  initial: Course | null;
  onSaved: (msg: string) => void;
  onError: (err: string) => void;
}) {
  const isEdit = !!initial;
  const [id, setId] = useState(initial?.id || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [shortDesc, setShortDesc] = useState(initial?.short_description || "");
  const [desc, setDesc] = useState(initial?.description || "");
  const [mentor, setMentor] = useState(initial?.mentor_name || "");
  const [duration, setDuration] = useState(initial?.duration_label || "");
  const [thumb, setThumb] = useState(initial?.thumbnail_url || "");
  const [totalLessons, setTotalLessons] = useState(
    initial?.total_lessons?.toString() || "",
  );
  const [status, setStatus] = useState<Course["status"]>(initial?.status || "live");
  const [busy, setBusy] = useState(false);

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
        onSaved(isEdit ? `Updated "${title}".` : `Created "${title}".`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <Input
          label="ID (URL slug)"
          value={id}
          onChange={(e) =>
            setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
          }
          disabled={isEdit}
          required
          placeholder="kdp-mastery"
        />
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="KDP Mastery · 50-Day Program"
        />
        <Input
          label="Mentor"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
          placeholder="Ehsan Sager"
        />
        <Input
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="50 days"
        />
        <Input
          label="Total lessons"
          type="number"
          min={0}
          value={totalLessons}
          onChange={(e) => setTotalLessons(e.target.value)}
          placeholder="50"
        />
        <label style={{ display: "block" }}>
          <span style={inputLabelStyle}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Course["status"])}
            style={selectStyle}
          >
            <option value="live">live</option>
            <option value="drafting">drafting</option>
            <option value="recording">recording</option>
            <option value="planned">planned</option>
          </select>
        </label>
      </div>

      <div style={{ height: 12 }} />
      <Input
        label="Thumbnail URL"
        value={thumb}
        onChange={(e) => setThumb(e.target.value)}
        placeholder="https://… (leave blank for branded gradient)"
      />
      <div style={{ height: 12 }} />
      <Input
        label="Short description"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        maxLength={140}
        placeholder="One sentence that sells the course."
      />
      <div style={{ height: 12 }} />
      <label style={{ display: "block" }}>
        <span style={inputLabelStyle}>Long description</span>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={5}
          placeholder="What the course covers, who it's for, how it's run."
          style={{
            ...selectStyle,
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: 1.5,
            padding: "10px 12px",
          }}
        />
      </label>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button type="submit" loading={busy}>
          {isEdit ? "Save changes" : "Create course"}
        </Button>
      </div>
    </form>
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
  width: "100%",
  padding: "9px 12px",
  fontSize: 14,
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
