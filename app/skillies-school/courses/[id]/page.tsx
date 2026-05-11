/**
 * /skillies-school/courses/[id] — public course detail.
 *
 * Same Access Course logic as the catalog, just one card.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopNav from "@/components/design/TopNav";
import AccessCourseButton from "@/components/skillies-school/AccessCourseButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("courses")
    .select("title, short_description")
    .eq("id", id)
    .maybeSingle();
  if (!data) return { title: "Course · Skillies School" };
  return {
    title: `${data.title} · Skillies School`,
    description: data.short_description ?? undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: course } = await supabase
    .from("courses")
    .select(
      "id, title, description, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published",
    )
    .eq("id", id)
    .maybeSingle();
  if (!course || !course.is_published) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrolled = false;
  let userPhone: string | null = null;
  if (user) {
    const [{ data: profile }, { data: enrolment }] = await Promise.all([
      supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle(),
      supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .maybeSingle(),
    ]);
    userPhone = profile?.phone ?? null;
    enrolled = !!enrolment;
  }

  const buttonState =
    !user
      ? ({ kind: "anon", courseId: course.id, courseTitle: course.title } as const)
      : enrolled
        ? ({ kind: "enrolled", courseId: course.id } as const)
        : ({
            kind: "not-enrolled",
            courseTitle: course.title,
            phone: userPhone,
          } as const);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <TopNav />

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "120px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 36,
        }}
      >
        <Link
          href="/skillies-school/courses"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#6B7280",
            textDecoration: "none",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          ← All courses
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 480px) 1fr",
            gap: 40,
            alignItems: "start",
          }}
          className="course-detail-grid"
        >
          {/* Thumbnail */}
          <div
            style={{
              aspectRatio: "16 / 9",
              borderRadius: 22,
              overflow: "hidden",
              background: course.thumbnail_url
                ? `url(${course.thumbnail_url}) center / cover no-repeat`
                : "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.10)",
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
          </div>

          {/* Body */}
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
              Skillies School · Course
            </div>
            <h1
              style={{
                margin: "10px 0 12px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(34px, 5vw, 54px)",
                letterSpacing: "-0.02em",
                color: "#1A1A1A",
                lineHeight: 1.05,
              }}
            >
              {course.title}
            </h1>

            {course.short_description && (
              <p
                style={{
                  fontSize: 18,
                  color: "#1A1A1A",
                  lineHeight: 1.55,
                  margin: "0 0 18px",
                  opacity: 0.85,
                }}
              >
                {course.short_description}
              </p>
            )}

            {course.description && (
              <p
                style={{
                  fontSize: 15,
                  color: "#6B7280",
                  lineHeight: 1.65,
                  margin: "0 0 22px",
                  whiteSpace: "pre-line",
                }}
              >
                {course.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px 22px",
                margin: "16px 0 28px",
                fontSize: 13,
                color: "#1A1A1A",
              }}
            >
              {course.mentor_name && (
                <Meta label="Mentor" value={course.mentor_name} />
              )}
              {course.duration_label && (
                <Meta label="Duration" value={course.duration_label} />
              )}
              {course.total_lessons ? (
                <Meta
                  label="Lessons"
                  value={String(course.total_lessons)}
                />
              ) : null}
              <Meta label="Status" value={course.status} />
            </div>

            <AccessCourseButton state={buttonState} />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .course-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
