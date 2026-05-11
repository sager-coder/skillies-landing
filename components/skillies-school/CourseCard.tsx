import React from "react";
import AccessCourseButton from "./AccessCourseButton";

export type CourseCardData = {
  id: string;
  title: string;
  short_description: string | null;
  mentor_name: string | null;
  duration_label: string | null;
  thumbnail_url: string | null;
  total_lessons: number | null;
  status: string;
};

/**
 * The card used on the public catalog and on the student dashboard.
 *
 * Visual rules:
 *   - `accessState` decides which button + lock state to render.
 *   - If `enrolled` we drop the lock icon and switch the chip to "Enrolled".
 *   - Missing thumbnail → branded gradient with the course initials.
 */
export default function CourseCard({
  course,
  accessState,
  userPhone = null,
}: {
  course: CourseCardData;
  accessState: "anon" | "not-enrolled" | "enrolled";
  /** When known, lets the WhatsApp message include the student's number. */
  userPhone?: string | null;
}) {
  const enrolled = accessState === "enrolled";
  const initials = getInitials(course.title);

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Thumbnail */}
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
          <>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 25% 30%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(201,162,78,0.30), transparent 60%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "rgba(255,255,255,0.92)",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",fontSize: 64,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {initials}
            </div>
          </>
        )}

        {/* Lock badge (or Enrolled badge) */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "6px 10px",
            borderRadius: 999,
            background: enrolled
              ? "rgba(91,123,91,0.95)"
              : "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {enrolled ? <CheckIcon /> : <LockIcon />}
          {enrolled ? "Enrolled" : "Locked"}
        </div>

        {course.status && course.status !== "live" && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(201,162,78,0.95)",
              color: "#3a2c08",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {course.status}
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "22px 22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#1A1A1A",
            lineHeight: 1.25,
          }}
        >
          {course.title}
        </h3>

        {course.short_description && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
              color: "#6B7280",
            }}
          >
            {course.short_description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            fontSize: 12,
            color: "#1A1A1A",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px dashed rgba(26,26,26,0.10)",
          }}
        >
          {course.mentor_name && (
            <MetaLine icon={<UserIcon />} label={course.mentor_name} />
          )}
          {course.duration_label && (
            <MetaLine icon={<ClockIcon />} label={course.duration_label} />
          )}
          {course.total_lessons ? (
            <MetaLine
              icon={<LayersIcon />}
              label={`${course.total_lessons} lessons`}
            />
          ) : null}
        </div>

        <div style={{ marginTop: 14 }}>
          <AccessCourseButton
            fullWidth
            state={
              accessState === "anon"
                ? { kind: "anon", courseId: course.id, courseTitle: course.title }
                : accessState === "enrolled"
                  ? { kind: "enrolled", courseId: course.id }
                  : {
                      kind: "not-enrolled",
                      courseTitle: course.title,
                      phone: userPhone,
                    }
            }
          />
        </div>
      </div>
    </article>
  );
}

function MetaLine({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 600,
      }}
    >
      <span style={{ display: "inline-flex", color: "#C62828" }}>{icon}</span>
      {label}
    </span>
  );
}

function getInitials(title: string): string {
  const words = title
    .split(/[\s·\-—:]+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!words.length) return "SK";
  return words.map((w) => w[0]!.toUpperCase()).join("");
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="11"
        width="16"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l9 4-9 4-9-4 9-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 4 9-4M3 17l9 4 9-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
