/**
 * /skillies-school · the consumer landing page.
 *
 * Now includes the courses catalog inline (between the financial proof
 * block and the "What you actually learn" modules), fetched server-side
 * so anon visitors see the catalog without a client round-trip.
 */
import type { Metadata } from "next";
import SkilliesSchoolContent from "@/components/skillies/SkilliesSchoolContent";
import CoursesSection from "@/components/skillies-school/CoursesSection";
import type { CourseCardData } from "@/components/skillies-school/CourseCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Skillies School · Amazon KDP income skill",
  description:
    "The Amazon KDP methodology that generated ₹8,71,982 from 63 books. Self-paced, founder-taught, Kerala-context. The original Skillies product, still here.",
};

export const dynamic = "force-dynamic";

export default async function SkilliesSchoolPage() {
  const supabase = await createSupabaseServerClient();

  // Catalog of published courses. Until the v2 schema migration runs
  // (adds is_published / sort_order columns), this query may fail
  // silently — we degrade gracefully to "Coming soon".
  let courses: CourseCardData[] = [];
  try {
    const { data } = await supabase
      .from("courses")
      .select(
        "id, title, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published, sort_order",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    courses = (data || []).map((c) => ({
      id: c.id,
      title: c.title,
      short_description: c.short_description ?? null,
      mentor_name: c.mentor_name ?? null,
      duration_label: c.duration_label ?? null,
      thumbnail_url: c.thumbnail_url ?? null,
      total_lessons: c.total_lessons ?? null,
      status: c.status,
    }));
  } catch {
    // Pre-migration fallback — leave courses empty so the section
    // renders the "Coming soon" empty state instead of crashing.
  }

  // Current user + their enrollments, if signed in.
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

  return (
    <SkilliesSchoolContent
      coursesSlot={
        <CoursesSection
          courses={courses}
          enrolledIds={enrolledIds}
          isLoggedIn={!!user}
          userPhone={userPhone}
        />
      }
    />
  );
}
