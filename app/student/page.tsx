/**
 * /student — student dashboard.
 *
 * Layout: public TopNav + cream-background main (matches the rest of
 * the consumer site). Content uses the polished card primitives.
 *   - Hero strip: greeting + 3 stat tiles
 *   - "Continue learning" grid of enrolled course cards (progress bar
 *     + Watch button → /learn/<id>)
 *   - "Discover more" grid of locked courses with WhatsApp request CTA
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import TopNav from "@/components/design/TopNav";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import StudentDashboardClient, {
  type StudentCourse,
  type StudentStats,
} from "./StudentDashboardClient";

export const metadata: Metadata = { title: "Dashboard · Skillies School" };
export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/student");

  const admin = createSupabaseAdminClient();

  const [
    { data: profile },
    { data: allCourses },
    { data: enrollments },
    { data: progress },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("first_name, last_name, full_name, phone, email")
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
      .eq("user_id", user.id),
  ]);

  const enrolledIds = new Set((enrollments || []).map((e) => e.course_id));

  // Completed lesson counts per course → progress bars.
  const completedByCourse: Record<string, number> = {};
  for (const row of progress || []) {
    if (!row.completed) continue;
    const courseId = (row as unknown as { lessons?: { course_id?: string } })
      .lessons?.course_id;
    if (courseId) {
      completedByCourse[courseId] = (completedByCourse[courseId] || 0) + 1;
    }
  }

  const courses: StudentCourse[] = (allCourses || []).map((c) => ({
    id: c.id,
    title: c.title,
    short_description: c.short_description ?? null,
    mentor_name: c.mentor_name ?? null,
    duration_label: c.duration_label ?? null,
    thumbnail_url: c.thumbnail_url ?? null,
    total_lessons: c.total_lessons ?? null,
    status: c.status,
    enrolled: enrolledIds.has(c.id),
    completed_count: completedByCourse[c.id] || 0,
  }));

  const myCourses = courses.filter((c) => c.enrolled);
  const lockedCourses = courses.filter((c) => !c.enrolled);

  const stats: StudentStats = {
    enrolledCount: myCourses.length,
    completedLessons: Object.values(completedByCourse).reduce(
      (s, n) => s + n,
      0,
    ),
    totalLessons: myCourses.reduce((s, c) => s + (c.total_lessons || 0), 0),
  };

  const firstName =
    (profile?.first_name as string | null) ||
    (profile?.full_name?.split(" ")[0] as string | undefined) ||
    null;

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <TopNav />
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <StudentDashboardClient
          firstName={firstName}
          stats={stats}
          myCourses={myCourses}
          lockedCourses={lockedCourses}
          userPhone={profile?.phone ?? null}
        />
      </section>
    </main>
  );
}
