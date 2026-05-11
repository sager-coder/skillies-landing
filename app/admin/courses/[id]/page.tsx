/**
 * /admin/courses/[id] — single course detail.
 *
 * Server loads the course, its lessons, and the currently enrolled
 * students. Defers interactive state (assign-user search, revoke,
 * lesson visibility toggles) to the client component.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import CourseDetailClient, { type CourseDetail, type EnrolledStudent, type LessonRow } from "./CourseDetailClient";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} · Skillies Admin` };
}

export default async function CourseDetailPage({ params }: Params) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const [{ data: course }, { data: lessons }, { data: enrollments }] = await Promise.all([
    admin
      .from("courses")
      .select(
        "id, title, description, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published, sort_order, created_at",
      )
      .eq("id", id)
      .maybeSingle(),
    admin
      .from("lessons")
      .select("id, day, title, video_id, duration_seconds, is_published")
      .eq("course_id", id)
      .order("day", { ascending: true }),
    admin
      .from("enrollments")
      .select("user_id, tier, enrolled_at, enrolled_by")
      .eq("course_id", id)
      .order("enrolled_at", { ascending: false }),
  ]);

  if (!course) notFound();

  // Hydrate enrollments with profile info
  const userIds = (enrollments || []).map((e) => e.user_id);
  const { data: profileRows } = userIds.length
    ? await admin
        .from("profiles")
        .select("id, phone, first_name, last_name, full_name, email, is_admin, blocked, created_at")
        .in("id", userIds)
    : { data: [] };
  const profileMap = new Map((profileRows || []).map((p) => [p.id, p]));

  const enrolledStudents: EnrolledStudent[] = (enrollments || []).map((e) => {
    const p = profileMap.get(e.user_id);
    return {
      user_id: e.user_id,
      tier: e.tier,
      enrolled_at: e.enrolled_at,
      phone: p?.phone ?? null,
      first_name: p?.first_name ?? null,
      last_name: p?.last_name ?? null,
      full_name: p?.full_name ?? null,
      email: p?.email ?? null,
      is_admin: !!p?.is_admin,
      blocked: !!p?.blocked,
    };
  });

  const lessonRows: LessonRow[] = (lessons || []).map((l) => ({
    id: l.id,
    day: l.day,
    title: l.title,
    video_id: l.video_id,
    duration_seconds: l.duration_seconds,
    is_published: l.is_published,
  }));

  const detail: CourseDetail = {
    id: course.id,
    title: course.title,
    short_description: course.short_description,
    description: course.description,
    mentor_name: course.mentor_name,
    duration_label: course.duration_label,
    thumbnail_url: course.thumbnail_url,
    total_lessons: course.total_lessons,
    status: course.status,
    is_published: course.is_published,
    created_at: course.created_at,
  };

  return (
    <CourseDetailClient
      course={detail}
      lessons={lessonRows}
      initialEnrolled={enrolledStudents}
    />
  );
}
