import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Kicker } from "@/components/design/Primitives";
import LearnTopBar from "@/components/learn/LearnTopBar";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ course: string }> };

type Lesson = {
  id: string;
  day: number;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  is_published: boolean;
};

type ProgressRow = { lesson_id: string; completed: boolean };

export default async function CoursePage({ params }: Props) {
  const { course: courseId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/learn/${courseId}`);

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, description, total_lessons")
    .eq("id", courseId)
    .single();
  if (!course) notFound();

  // Confirm enrollment (RLS already gates this, but check explicitly for nicer UX)
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("tier, enrolled_at")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!enrollment) redirect("/learn");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, day, title, description, duration_seconds, is_published")
    .eq("course_id", courseId)
    .order("day", { ascending: true });

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  const completedSet = new Set(
    ((progress || []) as ProgressRow[]).filter((p) => p.completed).map((p) => p.lesson_id),
  );

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <LearnTopBar />
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px 100px" }}>
        <Link
          href="/learn"
          style={{
            display: "inline-block",
            marginBottom: 18,
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#6B7280",
            textDecoration: "none",
          }}
        >
          ← All my courses
        </Link>

        <Kicker tone="red">{tierLabel(enrollment.tier)}</Kicker>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1A1A1A",
            margin: "12px 0 10px",
          }}
        >
          {course.title}
        </h1>
        {course.description && (
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.6, maxWidth: 640 }}>
            {course.description}
          </p>
        )}

        <div style={{ marginTop: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Kicker tone="red">Lessons</Kicker>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "ui-monospace, Menlo, monospace" }}>
              {completedSet.size} / {course.total_lessons || 50} done
            </span>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {(lessons || []).map((l: Lesson) => {
              const done = completedSet.has(l.id);
              const locked = !l.is_published;
              return (
                <Link
                  key={l.id}
                  href={locked ? "#" : `/learn/${courseId}/${l.day}`}
                  onClick={(e) => locked && e.preventDefault()}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "16px 20px",
                    background: locked ? "rgba(26,26,26,0.04)" : "white",
                    border: "1px solid rgba(26,26,26,0.08)",
                    borderRadius: 14,
                    textDecoration: "none",
                    color: "inherit",
                    opacity: locked ? 0.55 : 1,
                    cursor: locked ? "not-allowed" : "pointer",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 26,
                      color: done ? "#5B7B5B" : locked ? "#9CA3AF" : "#C62828",
                    }}
                  >
                    {String(l.day).padStart(2, "0")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{l.title}</div>
                    {l.description && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          marginTop: 2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                        }}
                      >
                        {l.description}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: done ? "#5B7B5B" : locked ? "#9CA3AF" : "#C62828",
                    }}
                  >
                    {done ? "✓ Done" : locked ? "Soon" : "Watch"}
                  </div>
                </Link>
              );
            })}
            {(!lessons || lessons.length === 0) && (
              <div
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  background: "white",
                  borderRadius: 16,
                  border: "1px dashed rgba(26,26,26,0.15)",
                  color: "#6B7280",
                  fontSize: 14,
                }}
              >
                No lessons published yet — first ones drop this week.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function tierLabel(t: string) {
  if (t === "founding") return "Founding · Batch 001";
  if (t === "pro") return "Pro · 1-on-1";
  return "Standard";
}
