/**
 * /skillies-school/courses — public catalog.
 *
 * Anyone can see all published courses. The button's behaviour is what
 * gates access:
 *   anon          → /login?next=this
 *   logged-in     → WhatsApp deeplink (admin grants access manually)
 *   enrolled      → /learn/<id>
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import CoursesGrid from "@/components/skillies-school/CoursesGrid";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseCardData } from "@/components/skillies-school/CourseCard";

export const metadata: Metadata = {
  title: "Courses · Skillies School",
  description:
    "Every Skillies course. Pick one, get access from the admin, start watching.",
};

export const dynamic = "force-dynamic";

export default async function CoursesCatalogPage() {
  const supabase = await createSupabaseServerClient();

  // Always fetch the published catalog (public, RLS lets everyone read).
  const { data: courses } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published, sort_order",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // Check sign-in + enrollments, if any.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrolledIds: string[] = [];
  let userPhone: string | null = null;

  if (user) {
    const [{ data: profile }, { data: enrollments }] = await Promise.all([
      supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle(),
      supabase.from("enrollments").select("course_id").eq("user_id", user.id),
    ]);
    userPhone = profile?.phone ?? null;
    enrolledIds = (enrollments || []).map((e) => e.course_id);
  }

  const cards: CourseCardData[] = (courses || []).map((c) => ({
    id: c.id,
    title: c.title,
    short_description: c.short_description ?? null,
    mentor_name: c.mentor_name ?? null,
    duration_label: c.duration_label ?? null,
    thumbnail_url: c.thumbnail_url ?? null,
    total_lessons: c.total_lessons ?? null,
    status: c.status,
  }));

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <TopNav />

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 24px 60px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          Skillies School · Courses
        </div>
        <h1
          style={{
            margin: "10px 0 8px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 64px)",
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            lineHeight: 1.05,
          }}
        >
          Every course we{" "}
          <em style={{ color: "#C62828" }}>teach.</em>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#6B7280",
            margin: "10px 0 0",
            lineHeight: 1.6,
            maxWidth: 640,
          }}
        >
          Pick a course, click <b>Access Course</b>, and we&rsquo;ll get you set
          up on WhatsApp. Already enrolled? Sign in and the button becomes{" "}
          <b>Open Course</b>.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 120px",
        }}
      >
        <CoursesGrid
          courses={cards}
          enrolledIds={enrolledIds}
          isLoggedIn={!!user}
          userPhone={userPhone}
        />
      </section>
    </main>
  );
}
