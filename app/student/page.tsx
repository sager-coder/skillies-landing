/**
 * /student — the student dashboard.
 *
 *   - My Courses (enrolled)
 *   - Locked Courses (browse the rest of the catalog)
 *   - Profile shortcut
 *
 * Distinct from /dashboard which is the founder royalties view.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/design/TopNav";
import CoursesGrid from "@/components/skillies-school/CoursesGrid";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import type { CourseCardData } from "@/components/skillies-school/CourseCard";

export const metadata: Metadata = {
  title: "My Skillies School",
  description: "Your enrolled courses and progress.",
};

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/student");

  // Use service-role for cross-table reads to dodge the post-OTP
  // RLS race that the admin page also guards against.
  const admin = createSupabaseAdminClient();

  const [
    { data: profile },
    { data: allCourses },
    { data: enrollments },
    { data: progress },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("full_name, phone, email")
      .eq("id", user.id)
      .maybeSingle(),
    admin
      .from("courses")
      .select(
        "id, title, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published, sort_order",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    admin
      .from("enrollments")
      .select("course_id, tier, enrolled_at")
      .eq("user_id", user.id),
    admin
      .from("lesson_progress")
      .select("lesson_id, completed, lessons!inner(course_id)")
      .eq("user_id", user.id)
      .eq("completed", true),
  ]);

  const enrolledIds = new Set((enrollments || []).map((e) => e.course_id));

  const courses = (allCourses || []).map<CourseCardData>((c) => ({
    id: c.id,
    title: c.title,
    short_description: c.short_description ?? null,
    mentor_name: c.mentor_name ?? null,
    duration_label: c.duration_label ?? null,
    thumbnail_url: c.thumbnail_url ?? null,
    total_lessons: c.total_lessons ?? null,
    status: c.status,
  }));

  const myCourses = courses.filter((c) => enrolledIds.has(c.id));
  const lockedCourses = courses.filter((c) => !enrolledIds.has(c.id));

  // Per-course completed-lesson counts for progress bars.
  const completedByCourse: Record<string, number> = {};
  for (const row of progress || []) {
    // Supabase nested select: lessons is an object, not an array.
    const courseId = (row as unknown as { lessons?: { course_id?: string } })
      .lessons?.course_id;
    if (courseId) {
      completedByCourse[courseId] = (completedByCourse[courseId] || 0) + 1;
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <TopNav />

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 24px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#C62828",
              }}
            >
              Skillies School · Student
            </div>
            <h1
              style={{
                margin: "10px 0 4px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(36px, 5vw, 56px)",
                letterSpacing: "-0.02em",
                color: "#1A1A1A",
                lineHeight: 1.05,
              }}
            >
              Welcome,{" "}
              <em style={{ color: "#C62828" }}>
                {profile?.full_name?.split(" ")[0] || "Student"}.
              </em>
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#6B7280",
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              {profile?.phone}
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
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              background: "white",
              border: "1px solid rgba(26,26,26,0.10)",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Profile settings →
          </Link>
        </div>
      </section>

      {/* My Courses */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
        <SectionHeading
          kicker={`${myCourses.length} ${myCourses.length === 1 ? "course" : "courses"} unlocked`}
          title="My Courses"
        />
        {myCourses.length === 0 ? (
          <EmptyMyCourses />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 22,
            }}
          >
            {myCourses.map((c) => (
              <EnrolledCourseCard
                key={c.id}
                course={c}
                completedCount={completedByCourse[c.id] || 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* Locked / browse the rest */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 120px",
        }}
      >
        <SectionHeading kicker="Browse the catalog" title="Locked Courses" />
        {lockedCourses.length === 0 ? (
          <div
            style={{
              padding: 28,
              background: "white",
              borderRadius: 16,
              border: "1px dashed rgba(26,26,26,0.10)",
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            You&rsquo;re enrolled in every published course. Nice.
          </div>
        ) : (
          <CoursesGrid
            courses={lockedCourses}
            enrolledIds={[]}
            isLoggedIn
            userPhone={profile?.phone ?? null}
          />
        )}
      </section>
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 4,
        }}
      >
        {kicker}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(28px, 4vw, 40px)",
          letterSpacing: "-0.02em",
          color: "#1A1A1A",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function EmptyMyCourses() {
  return (
    <div
      style={{
        padding: "32px 28px",
        background: "white",
        borderRadius: 18,
        border: "1px dashed rgba(26,26,26,0.10)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginBottom: 6,
          }}
        >
          No courses yet
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>
          Pick one from the catalog and tap <b>Access Course</b> to chat with
          the admin.
        </p>
      </div>
      <Link
        href="/skillies-school/courses"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 22px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "white",
          background: "#C62828",
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        Browse catalog →
      </Link>
    </div>
  );
}

function EnrolledCourseCard({
  course,
  completedCount,
}: {
  course: CourseCardData;
  completedCount: number;
}) {
  const total = course.total_lessons ?? 0;
  const pct = total > 0 ? Math.min(100, Math.round((completedCount / total) * 100)) : 0;

  return (
    <article
      style={{
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          background: course.thumbnail_url
            ? `url(${course.thumbnail_url}) center / cover no-repeat`
            : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
          position: "relative",
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
            top: 14,
            left: 14,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(91,123,91,0.95)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Enrolled
        </div>
      </div>

      <div
        style={{
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 19,
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1.25,
          }}
        >
          {course.title}
        </h3>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
              marginBottom: 6,
            }}
          >
            <span>Progress</span>
            <span style={{ color: "#1A1A1A" }}>
              {completedCount}
              {total ? ` / ${total}` : ""} · {pct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(26,26,26,0.08)",
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
            marginTop: "auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "white",
            background: "#C62828",
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 10px 24px rgba(198,40,40,0.20)",
          }}
        >
          ▶ Watch Course
        </Link>
      </div>
    </article>
  );
}
