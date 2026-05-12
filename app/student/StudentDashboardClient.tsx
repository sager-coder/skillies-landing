"use client";

/**
 * Visual layer of the student dashboard. Receives pre-aggregated data
 * from the server component and renders the modern SaaS layout:
 *   - Welcome row with three small stat tiles
 *   - "Continue learning" grid of enrolled course cards (progress bar
 *     + Watch button → /learn/<id>)
 *   - "Discover more" grid of locked courses with WhatsApp request CTA
 */
import React from "react";
import Link from "next/link";
import Card from "@/components/admin-ui/Card";
import Badge from "@/components/admin-ui/Badge";
import Button from "@/components/admin-ui/Button";
import EmptyState from "@/components/admin-ui/EmptyState";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type StudentCourse = {
  id: string;
  title: string;
  short_description: string | null;
  mentor_name: string | null;
  duration_label: string | null;
  thumbnail_url: string | null;
  total_lessons: number | null;
  status: string;
  enrolled: boolean;
  completed_count: number;
};

export type StudentStats = {
  enrolledCount: number;
  completedLessons: number;
  totalLessons: number;
};

export default function StudentDashboardClient({
  firstName,
  stats,
  myCourses,
  lockedCourses,
  userPhone,
}: {
  firstName: string | null;
  stats: StudentStats;
  myCourses: StudentCourse[];
  lockedCourses: StudentCourse[];
  userPhone: string | null;
}) {
  const completionPct =
    stats.totalLessons > 0
      ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero strip */}
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
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.55,
              maxWidth: "60ch",
            }}
          >
            Pick up where you left off, or browse new courses to add to
            your library.
          </p>
        </div>
        <Link
          href="/student/profile"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: "#0A0A0A",
            background: "white",
            border: "1px solid rgba(17,24,39,0.10)",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 160ms ease, border-color 160ms ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(17,24,39,0.04)";
            e.currentTarget.style.borderColor = "rgba(17,24,39,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "rgba(17,24,39,0.10)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
          </svg>
          Profile settings
        </Link>
      </div>

      {/* Stat tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatTile
          label="Courses unlocked"
          value={String(stats.enrolledCount)}
          hint={
            stats.enrolledCount === 0
              ? "Tap a course below to start"
              : stats.enrolledCount === 1
                ? "1 course in your library"
                : `${stats.enrolledCount} courses in your library`
          }
        />
        <StatTile
          label="Lessons completed"
          value={String(stats.completedLessons)}
          hint={
            stats.totalLessons
              ? `of ${stats.totalLessons} total · ${completionPct}%`
              : "Watch a lesson to start"
          }
        />
        <StatTile
          label="Overall progress"
          value={`${completionPct}%`}
          hint={completionPct === 100 ? "All caught up · 🎉" : "Keep going"}
          progress={completionPct}
        />
      </div>

      {/* Continue learning */}
      <SectionHeader
        eyebrow={`${myCourses.length} ${myCourses.length === 1 ? "course" : "courses"} unlocked`}
        title="Continue learning"
      />
      {myCourses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          description="Pick a course below and chat with the admin on WhatsApp to get access."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {myCourses.map((c) => (
            <EnrolledCourseCard key={c.id} course={c} />
          ))}
        </div>
      )}

      {/* Discover */}
      {lockedCourses.length > 0 && (
        <>
          <SectionHeader
            eyebrow="Browse the catalog"
            title="Discover more courses"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {lockedCourses.map((c) => (
              <LockedCourseCard key={c.id} course={c} userPhone={userPhone} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "#A3A3A3",
          marginBottom: 6,
        }}
      >
        {eyebrow}
      </div>
      <h3
        style={{
          margin: 0,
          fontFamily:
            "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#0A0A0A",
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  progress?: number;
}) {
  return (
    <Card padding={20}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "#A3A3A3",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily:
            "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 30,
          fontWeight: 600,
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "#525252",
        }}
      >
        {hint}
      </div>
      {typeof progress === "number" && (
        <div
          style={{
            marginTop: 12,
            height: 6,
            background: "rgba(17,24,39,0.06)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, progress)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #C62828, #E45656)",
              transition: "width 600ms ease",
            }}
          />
        </div>
      )}
    </Card>
  );
}

function EnrolledCourseCard({ course }: { course: StudentCourse }) {
  const total = course.total_lessons ?? 0;
  const pct =
    total > 0
      ? Math.min(100, Math.round((course.completed_count / total) * 100))
      : 0;
  return (
    <Card padding={0}>
      <div
        style={{
          aspectRatio: "16 / 9",
          position: "relative",
          background: course.thumbnail_url
            ? `url(${course.thumbnail_url}) center / cover no-repeat`
            : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
          overflow: "hidden",
        }}
      >
        {!course.thumbnail_url && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 25% 30%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(201,162,78,0.30), transparent 60%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <Badge variant="success">Enrolled</Badge>
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#0A0A0A",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {course.title}
          </h4>
          {course.mentor_name && (
            <div style={{ marginTop: 4, fontSize: 13, color: "#525252" }}>
              with <b style={{ color: "#0A0A0A" }}>{course.mentor_name}</b>
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#A3A3A3",
              marginBottom: 6,
            }}
          >
            <span>Progress</span>
            <span style={{ color: "#0A0A0A" }}>
              {course.completed_count}
              {total ? ` / ${total}` : ""} · {pct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(17,24,39,0.06)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #C62828, #E45656)",
                transition: "width 600ms ease",
              }}
            />
          </div>
        </div>

        <Link
          href={`/learn/${encodeURIComponent(course.id)}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 20px",
            background: "#C62828",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 160ms ease, transform 160ms ease",
            boxShadow: "0 1px 2px rgba(198,40,40,0.20)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#B22020")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C62828")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          {pct === 0 ? "Start course" : pct === 100 ? "Review course" : "Continue watching"}
        </Link>
      </div>
    </Card>
  );
}

function LockedCourseCard({
  course,
  userPhone,
}: {
  course: StudentCourse;
  userPhone: string | null;
}) {
  return (
    <Card padding={0}>
      <div
        style={{
          aspectRatio: "16 / 9",
          position: "relative",
          background: course.thumbnail_url
            ? `url(${course.thumbnail_url}) center / cover no-repeat`
            : "linear-gradient(135deg, #6B7280 0%, #374151 100%)",
          filter: "saturate(0.8)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <Badge variant="neutral">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
              </svg>
              Locked
            </span>
          </Badge>
        </div>
      </div>
      <div
        style={{
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#0A0A0A",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {course.title}
          </h4>
          {course.short_description && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "#525252",
                lineHeight: 1.5,
              }}
            >
              {course.short_description}
            </p>
          )}
        </div>
        <a
          href={buildWhatsAppUrl({
            courseTitle: course.title,
            phone: userPhone ?? undefined,
          })}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 16px",
            background: "white",
            color: "#0A0A0A",
            fontSize: 13,
            fontWeight: 600,
            border: "1px solid rgba(17,24,39,0.12)",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 160ms ease, border-color 160ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(17,24,39,0.04)";
            e.currentTarget.style.borderColor = "rgba(17,24,39,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "rgba(17,24,39,0.12)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.9.5.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
          </svg>
          Request access on WhatsApp
        </a>
      </div>
    </Card>
  );
}
