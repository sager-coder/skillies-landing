/**
 * /learn/[courseId] — the gated lesson list for an enrolled student.
 *
 * Guards:
 *   1. Must be signed in.
 *   2. Must have an enrollment row for this course (or be an admin).
 *
 * The page renders a left-rail list of lessons and the LessonPlayer on
 * the right, with the chosen lesson controlled by `?day=`. Watermark is
 * the student's masked phone.
 */
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LearnTopBar from "@/components/learn/LearnTopBar";
import LessonPlayer from "@/components/learn/LessonPlayer";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

type Params = { params: Promise<{ courseId: string }>; searchParams: Promise<{ day?: string }> };

export const dynamic = "force-dynamic";

export default async function LearnCoursePage({
  params,
  searchParams,
}: Params) {
  const { courseId } = await params;
  const { day } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/learn/${encodeURIComponent(courseId)}`);

  // Use the admin client to dodge the post-OTP RLS race that admin/page.tsx
  // already documents — same trade-off, we still gate on enrollment below.
  const admin = createSupabaseAdminClient();

  const [
    { data: profile },
    { data: course },
    { data: enrolment },
    { data: lessons },
    { data: progress },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("phone, is_admin, full_name")
      .eq("id", user.id)
      .maybeSingle(),
    admin
      .from("courses")
      .select("id, title, mentor_name, total_lessons")
      .eq("id", courseId)
      .maybeSingle(),
    admin
      .from("enrollments")
      .select("id, tier")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle(),
    admin
      .from("lessons")
      .select("id, day, title, description, video_id, duration_seconds, is_published")
      .eq("course_id", courseId)
      .order("day", { ascending: true }),
    admin
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id),
  ]);

  if (!course) notFound();

  const isAdmin = !!profile?.is_admin;
  if (!enrolment && !isAdmin) {
    // Not enrolled and not admin — bounce to the public course page where
    // the WhatsApp CTA lives.
    redirect(`/skillies-school/courses/${encodeURIComponent(courseId)}`);
  }

  const publishedLessons = (lessons || []).filter((l) => l.is_published || isAdmin);
  const requestedDay = day ? Number(day) : null;
  const activeLesson =
    publishedLessons.find((l) => l.day === requestedDay) ||
    publishedLessons[0] ||
    null;

  const completedSet = new Set(
    (progress || []).filter((p) => p.completed).map((p) => p.lesson_id),
  );

  const watermark = profile?.phone ? maskPhone(profile.phone) : "STUDENT";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FAF5EB",
      }}
    >
      <LearnTopBar />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 28,
        }}
        className="learn-grid"
      >
        {/* Player + lesson info */}
        <div>
          <div style={{ marginBottom: 18 }}>
            <Link
              href="/student"
              style={{
                fontSize: 12,
                color: "#6B7280",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Back to dashboard
            </Link>
            <h1
              style={{
                margin: "8px 0 4px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 40px)",
                letterSpacing: "-0.02em",
                color: "#1A1A1A",
                lineHeight: 1.1,
              }}
            >
              {course.title}
            </h1>
            {course.mentor_name && (
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                with <b style={{ color: "#1A1A1A" }}>{course.mentor_name}</b>
              </div>
            )}
          </div>

          {activeLesson ? (
            <>
              <LessonPlayer
                videoId={activeLesson.video_id || null}
                lessonId={activeLesson.id}
                title={activeLesson.title}
                watermark={watermark}
              />
              <div style={{ marginTop: 22 }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#C62828",
                  }}
                >
                  Day {activeLesson.day}
                </div>
                <h2
                  style={{
                    margin: "8px 0 10px",
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    color: "#1A1A1A",
                    lineHeight: 1.2,
                  }}
                >
                  {activeLesson.title}
                </h2>
                {activeLesson.description && (
                  <p
                    style={{
                      fontSize: 15,
                      color: "#6B7280",
                      lineHeight: 1.65,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {activeLesson.description}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "60px 28px",
                background: "white",
                borderRadius: 18,
                border: "1px dashed rgba(26,26,26,0.10)",
                textAlign: "center",
                color: "#6B7280",
              }}
            >
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
                Lessons coming
              </div>
              <p style={{ margin: 0, fontSize: 15 }}>
                Your course is unlocked. Lessons will appear here as they&rsquo;re
                published.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar — lesson list */}
        <aside
          style={{
            background: "white",
            borderRadius: 18,
            border: "1px solid rgba(26,26,26,0.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
            padding: 16,
            position: "sticky",
            top: 88,
            alignSelf: "start",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
          className="learn-sidebar"
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
              padding: "4px 8px 10px",
            }}
          >
            Lessons · {publishedLessons.length}
            {course.total_lessons ? ` / ${course.total_lessons}` : ""}
          </div>
          {publishedLessons.length === 0 ? (
            <div style={{ padding: 12, fontSize: 13, color: "#6B7280" }}>
              No lessons published yet.
            </div>
          ) : (
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {publishedLessons.map((l) => {
                const isActive = activeLesson?.id === l.id;
                const done = completedSet.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/learn/${encodeURIComponent(courseId)}?day=${l.day}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        textDecoration: "none",
                        background: isActive ? "rgba(198,40,40,0.10)" : "transparent",
                        color: isActive ? "#C62828" : "#1A1A1A",
                        border: isActive
                          ? "1px solid rgba(198,40,40,0.25)"
                          : "1px solid transparent",
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          flexShrink: 0,
                          borderRadius: 8,
                          background: done
                            ? "#5B7B5B"
                            : isActive
                              ? "#C62828"
                              : "rgba(26,26,26,0.06)",
                          color: done || isActive ? "white" : "#6B7280",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          fontFamily: "ui-monospace, Menlo, monospace",
                        }}
                      >
                        {done ? "✓" : l.day}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 500,
                          lineHeight: 1.3,
                        }}
                      >
                        {l.title}
                        {!l.is_published && isAdmin && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 9,
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: 999,
                              background: "rgba(201,162,78,0.18)",
                              color: "#8a6a1f",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Draft
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .learn-grid { grid-template-columns: 1fr !important; }
          .learn-sidebar { position: static !important; max-height: none !important; }
        }
      `}</style>
    </main>
  );
}

/**
 * Mask all but the last 4 digits of an E.164 number — used for the
 * personal watermark drifting on the player.
 */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return phone;
  return "•••• " + digits.slice(-4);
}
