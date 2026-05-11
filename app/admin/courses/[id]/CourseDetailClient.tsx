"use client";

/**
 * Course detail screen for admins.
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ Header card: title, mentor, duration,        │
 *   │ status badge, publish toggle, enrolled count │
 *   ├──────────────────────────────────────────────┤
 *   │ [Enrolled students]      [Assign students] │
 *   │   list + revoke           search + add      │
 *   ├──────────────────────────────────────────────┤
 *   │ Lessons (read-only list with video UID)    │
 *   └──────────────────────────────────────────────┘
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin-ui/Card";
import Badge from "@/components/admin-ui/Badge";
import Button from "@/components/admin-ui/Button";
import SearchInput from "@/components/admin-ui/SearchInput";
import EmptyState from "@/components/admin-ui/EmptyState";

export type CourseDetail = {
  id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  mentor_name: string | null;
  duration_label: string | null;
  thumbnail_url: string | null;
  total_lessons: number | null;
  status: "live" | "drafting" | "recording" | "planned";
  is_published: boolean;
  created_at: string;
};

export type EnrolledStudent = {
  user_id: string;
  tier: string;
  enrolled_at: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  blocked: boolean;
};

export type LessonRow = {
  id: string;
  day: number;
  title: string;
  video_id: string | null;
  duration_seconds: number | null;
  is_published: boolean;
};

type SearchStudent = {
  id: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  blocked: boolean;
  enrollments: { course_id: string; tier: string; enrolled_at: string }[];
};

type Toast = { kind: "success" | "error"; message: string } | null;

export default function CourseDetailClient({
  course,
  lessons,
  initialEnrolled,
}: {
  course: CourseDetail;
  lessons: LessonRow[];
  initialEnrolled: EnrolledStudent[];
}) {
  const [enrolled, setEnrolled] = useState<EnrolledStudent[]>(initialEnrolled);
  const [toast, setToast] = useState<Toast>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const enrolledIds = useMemo(
    () => new Set(enrolled.map((e) => e.user_id)),
    [enrolled],
  );

  const refreshEnrolled = useCallback(async () => {
    // Re-fetch the course's enrollments by hitting the admin students
    // endpoint and filtering, then mapping. We avoid a full server-side
    // page reload to keep the search panel responsive.
    const res = await fetch("/api/admin/students?limit=500", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) return;
    const studs: SearchStudent[] = json.students || [];
    // Pull just the rows that have this course in their enrollments
    const next: EnrolledStudent[] = studs
      .filter((s) => s.enrollments.some((e) => e.course_id === course.id))
      .map((s) => {
        const e = s.enrollments.find((x) => x.course_id === course.id)!;
        return {
          user_id: s.id,
          tier: e.tier,
          enrolled_at: e.enrolled_at,
          phone: s.phone,
          first_name: s.first_name,
          last_name: s.last_name,
          full_name: s.full_name,
          email: s.email,
          is_admin: s.is_admin,
          blocked: s.blocked,
        };
      });
    // Newest first
    next.sort((a, b) => (a.enrolled_at < b.enrolled_at ? 1 : -1));
    setEnrolled(next);
  }, [course.id]);

  const revoke = async (student: EnrolledStudent) => {
    if (!confirm(`Remove ${displayName(student)} from this course?`)) return;
    const res = await fetch(
      `/api/admin/students/${encodeURIComponent(student.user_id)}/enrollments?course_id=${encodeURIComponent(course.id)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setToast({
        kind: "success",
        message: `Removed ${displayName(student)} from the course.`,
      });
      refreshEnrolled();
    } else {
      const j = await res.json().catch(() => ({}));
      setToast({ kind: "error", message: j.error || "Failed." });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Crumb back */}
      <Link
        href="/admin/courses"
        style={{
          fontSize: 13,
          color: "#525252",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          width: "fit-content",
        }}
      >
        ← Back to all courses
      </Link>

      {/* Header */}
      <Card padding={24}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px, 320px) 1fr",
            gap: 24,
            alignItems: "center",
          }}
          className="course-header-grid"
        >
          <CourseThumb course={course} />
          <div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <Badge variant={course.is_published ? "success" : "neutral"}>
                {course.is_published ? "Published" : "Hidden"}
              </Badge>
              <Badge variant={course.status === "live" ? "success" : "warning"}>
                {course.status}
              </Badge>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "ui-monospace, Menlo, monospace",
                  color: "#A3A3A3",
                  alignSelf: "center",
                }}
              >
                {course.id}
              </span>
            </div>
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
              {course.title}
            </h2>
            {course.short_description && (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 14,
                  color: "#525252",
                  lineHeight: 1.55,
                  maxWidth: "60ch",
                }}
              >
                {course.short_description}
              </p>
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px 24px",
                marginTop: 16,
                fontSize: 13,
                color: "#0A0A0A",
              }}
            >
              <Meta label="Mentor" value={course.mentor_name || "—"} />
              <Meta label="Duration" value={course.duration_label || "—"} />
              <Meta
                label="Lessons"
                value={String(course.total_lessons ?? lessons.length)}
              />
              <Meta
                label="Enrolled"
                value={`${enrolled.length} student${enrolled.length === 1 ? "" : "s"}`}
              />
            </div>
          </div>
        </div>
      </Card>

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

      {/* Two-column: enrolled + assign */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
        }}
        className="course-twocol"
      >
        <Card padding={0}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(17,24,39,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={cardTitleStyle}>Enrolled students</h3>
              <p style={cardSubtitleStyle}>
                {enrolled.length} active enrollment
                {enrolled.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button size="sm" onClick={() => setSearchOpen((v) => !v)}>
              {searchOpen ? "Done" : "＋ Assign students"}
            </Button>
          </div>

          {enrolled.length === 0 ? (
            <EmptyState
              icon="👤"
              title="Nobody enrolled yet"
              description="Click ‘Assign students’ on the right to add the first student."
            />
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {enrolled.map((s) => (
                <li
                  key={s.user_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 20px",
                    borderTop: "1px solid rgba(17,24,39,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar text={displayName(s)} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#0A0A0A",
                          fontSize: 14,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {displayName(s)}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#A3A3A3",
                          fontFamily: "ui-monospace, Menlo, monospace",
                        }}
                      >
                        {s.phone || "—"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <Badge variant="neutral">{s.tier}</Badge>
                    {s.blocked && <Badge variant="danger">Blocked</Badge>}
                    <Button size="sm" variant="danger" onClick={() => revoke(s)}>
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <AssignStudentsPanel
          courseId={course.id}
          alreadyEnrolledIds={enrolledIds}
          onAssigned={(msg) => {
            setToast({ kind: "success", message: msg });
            refreshEnrolled();
          }}
          onError={(err) => setToast({ kind: "error", message: err })}
          isOpenHint={searchOpen}
        />
      </div>

      {/* Lessons list */}
      <Card padding={0}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(17,24,39,0.06)",
          }}
        >
          <h3 style={cardTitleStyle}>Lessons</h3>
          <p style={cardSubtitleStyle}>
            {lessons.length} total · {lessons.filter((l) => l.is_published).length} published
          </p>
        </div>
        {lessons.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="No lessons yet"
            description="Lessons need to be inserted via the seed script or the admin lessons API."
          />
        ) : (
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {lessons.map((l) => (
              <li
                key={l.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(17,24,39,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(198,40,40,0.10)",
                      color: "#C62828",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                      fontFamily: "ui-monospace, Menlo, monospace",
                    }}
                  >
                    {l.day}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0A0A0A", fontSize: 14 }}>
                      {l.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#A3A3A3",
                        fontFamily: "ui-monospace, Menlo, monospace",
                      }}
                    >
                      {l.video_id || "no video yet"}
                    </div>
                  </div>
                </div>
                <Badge variant={l.is_published ? "success" : "neutral"}>
                  {l.is_published ? "Published" : "Draft"}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <style>{`
        @media (max-width: 1100px) {
          .course-twocol { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .course-header-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function AssignStudentsPanel({
  courseId,
  alreadyEnrolledIds,
  onAssigned,
  onError,
  isOpenHint,
}: {
  courseId: string;
  alreadyEnrolledIds: Set<string>;
  onAssigned: (msg: string) => void;
  onError: (err: string) => void;
  isOpenHint: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchStudent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<"founding" | "standard" | "pro">("standard");
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/students${query ? `?q=${encodeURIComponent(query)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setResults(json.students || []);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Initial load — show recent signups; subsequent debounced queries
  useEffect(() => {
    run();
  }, [run]);

  const addStudent = async (student: SearchStudent) => {
    setBusyId(student.id);
    try {
      const res = await fetch(
        `/api/admin/students/${encodeURIComponent(student.id)}/enrollments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: courseId, tier }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        onError(json.error || "Failed.");
        return;
      }
      onAssigned(`Assigned ${displayName(student)} (${tier}).`);
    } finally {
      setBusyId(null);
    }
  };

  const visible = (results || []).filter(
    (s) => !alreadyEnrolledIds.has(s.id),
  );

  return (
    <Card padding={0}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(17,24,39,0.06)",
        }}
      >
        <h3 style={cardTitleStyle}>Assign students</h3>
        <p style={cardSubtitleStyle}>
          Pick a tier, then add any signed-up user to this course.
        </p>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              onDebouncedChange={setQuery}
              placeholder="Search by phone, name or email…"
            />
          </div>
          <select
            value={tier}
            onChange={(e) =>
              setTier(e.target.value as "founding" | "standard" | "pro")
            }
            style={{
              padding: "9px 12px",
              fontSize: 13,
              border: "1px solid rgba(17,24,39,0.10)",
              borderRadius: 8,
              outline: "none",
              background: "white",
              color: "#0A0A0A",
              minWidth: 130,
            }}
          >
            <option value="standard">standard</option>
            <option value="pro">pro</option>
            <option value="founding">founding</option>
          </select>
        </div>

        <div
          style={{
            border: "1px solid rgba(17,24,39,0.06)",
            borderRadius: 10,
            maxHeight: 360,
            overflowY: "auto",
            background: isOpenHint ? "white" : "rgba(17,24,39,0.01)",
          }}
        >
          {loading && !results ? (
            <div style={emptyMini}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={emptyMini}>
              {query
                ? "No matches."
                : "All loaded users are already enrolled — try a different search."}
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {visible.slice(0, 40).map((s) => (
                <li
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(17,24,39,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar text={displayName(s)} size={28} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#0A0A0A",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {displayName(s)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#A3A3A3",
                          fontFamily: "ui-monospace, Menlo, monospace",
                        }}
                      >
                        {s.phone || s.email || "—"}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addStudent(s)}
                    disabled={busyId === s.id}
                    loading={busyId === s.id}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

function CourseThumb({ course }: { course: CourseDetail }) {
  if (course.thumbnail_url) {
    return (
      <div
        style={{
          aspectRatio: "16 / 9",
          borderRadius: 12,
          background: `url(${course.thumbnail_url}) center / cover no-repeat`,
          border: "1px solid rgba(17,24,39,0.08)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        aspectRatio: "16 / 9",
        borderRadius: 12,
        background: "linear-gradient(135deg, #C62828, #8B1A1A)",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily:
          "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 24,
      }}
    >
      {initials(course.title)}
    </div>
  );
}

function Avatar({ text, size = 32 }: { text: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "linear-gradient(135deg, #C62828, #8B1A1A)",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontSize: size <= 28 ? 11 : 12,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials(text)}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "#A3A3A3",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
        {value}
      </div>
    </div>
  );
}

function displayName(s: {
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}): string {
  if (s.full_name) return s.full_name;
  const both = [s.first_name, s.last_name].filter(Boolean).join(" ");
  if (both) return both;
  return s.phone || "—";
}

function initials(t: string): string {
  return (t.match(/\b[a-zA-Z0-9]/g) || []).slice(0, 2).join("").toUpperCase() || "?";
}

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 16,
  fontWeight: 600,
  color: "#0A0A0A",
  letterSpacing: "-0.01em",
};

const cardSubtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 13,
  color: "#525252",
};

const emptyMini: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#A3A3A3",
  fontSize: 13,
};
