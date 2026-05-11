import React from "react";
import CourseCard, { type CourseCardData } from "./CourseCard";

/**
 * Responsive grid of course cards.
 * Auto-fills 1 / 2 / 3 columns based on width.
 */
export default function CoursesGrid({
  courses,
  enrolledIds,
  isLoggedIn,
  userPhone = null,
}: {
  courses: CourseCardData[];
  /** IDs of courses the current user is enrolled in. Empty when anon. */
  enrolledIds: string[];
  isLoggedIn: boolean;
  userPhone?: string | null;
}) {
  if (!courses.length) {
    return (
      <div
        style={{
          padding: "64px 24px",
          textAlign: "center",
          color: "#6B7280",
          background: "white",
          borderRadius: 20,
          border: "1px dashed rgba(26,26,26,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginBottom: 8,
          }}
        >
          Coming soon
        </div>
        <p style={{ margin: 0, fontSize: 15 }}>
          New courses are being prepared. Check back shortly.
        </p>
      </div>
    );
  }

  const enrolledSet = new Set(enrolledIds);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 22,
      }}
    >
      {courses.map((c) => {
        const accessState: "anon" | "not-enrolled" | "enrolled" = !isLoggedIn
          ? "anon"
          : enrolledSet.has(c.id)
            ? "enrolled"
            : "not-enrolled";
        return (
          <CourseCard
            key={c.id}
            course={c}
            accessState={accessState}
            userPhone={userPhone}
          />
        );
      })}
    </div>
  );
}
