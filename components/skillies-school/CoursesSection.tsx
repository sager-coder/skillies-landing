import React from "react";
import CoursesGrid from "./CoursesGrid";
import type { CourseCardData } from "./CourseCard";

/**
 * Catalog section embedded inside the Skillies School landing page.
 * Matches the section / container / typography rhythm of the rest of
 * the page (sk-section, sk-container, sk-font-section).
 *
 * Always renders — the empty state inside CoursesGrid handles the
 * "Coming soon" view when no courses are published yet.
 */
export default function CoursesSection({
  courses,
  enrolledIds,
  isLoggedIn,
  userPhone = null,
}: {
  courses: CourseCardData[];
  enrolledIds: string[];
  isLoggedIn: boolean;
  userPhone?: string | null;
}) {
  return (
    <section id="courses" className="sk-section relative">
      <div className="sk-container">
        <p
          className="sk-font-meta mb-3"
          style={{ color: "var(--sk-red)" }}
        >
          COURSES · ALL OF THEM
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <h2
            className="sk-font-section max-w-[24ch]"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
              margin: 0,
            }}
          >
            Pick a course. Get access.
          </h2>
          <p
            className="sk-font-body"
            style={{
              fontSize: "1rem",
              color: "var(--sk-ink60)",
              maxWidth: "42ch",
              margin: 0,
            }}
          >
            {isLoggedIn
              ? "Locked courses send you to WhatsApp for access. Unlocked ones open straight to the player."
              : "Click Access Course on any card — we'll sign you in, then route you to WhatsApp so the admin can confirm payment manually."}
          </p>
        </div>
        <CoursesGrid
          courses={courses}
          enrolledIds={enrolledIds}
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
        />
      </div>
    </section>
  );
}
