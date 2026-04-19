import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LearnTopBar from "@/components/learn/LearnTopBar";
import LessonPlayer from "@/components/learn/LessonPlayer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ course: string; day: string }> };

export default async function LessonPage({ params }: Props) {
  const { course: courseId, day } = await params;
  const dayNum = parseInt(day, 10);
  if (Number.isNaN(dayNum)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/learn/${courseId}/${day}`);

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("tier")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!enrollment) redirect("/learn");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, day, title, description, video_id, duration_seconds, is_published, course_id")
    .eq("course_id", courseId)
    .eq("day", dayNum)
    .single();
  if (!lesson) notFound();

  if (!lesson.is_published) {
    return (
      <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
        <LearnTopBar />
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
          <Link
            href={`/learn/${courseId}`}
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#6B7280",
              textDecoration: "none",
            }}
          >
            ← Back to {courseId}
          </Link>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#1A1A1A",
              margin: "20px 0 14px",
            }}
          >
            Day {lesson.day} drops soon.
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.65 }}>
            Ehsan is recording this lesson now. You&apos;ll get a WhatsApp ping the moment it&apos;s live.
          </p>
        </section>
      </main>
    );
  }

  // adjacent lessons for nav
  const { data: adjacent } = await supabase
    .from("lessons")
    .select("day, title, is_published")
    .eq("course_id", courseId)
    .in("day", [dayNum - 1, dayNum + 1])
    .order("day", { ascending: true });
  const prev = adjacent?.find((a) => a.day === dayNum - 1);
  const next = adjacent?.find((a) => a.day === dayNum + 1);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <LearnTopBar />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 100px" }}>
        <Link
          href={`/learn/${courseId}`}
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
          ← All lessons
        </Link>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          Day {String(lesson.day).padStart(2, "0")} · KDP Mastery
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1A1A1A",
            margin: "12px 0 20px",
          }}
        >
          {lesson.title}
        </h1>

        <LessonPlayer
          videoId={lesson.video_id}
          lessonId={lesson.id}
          title={lesson.title}
        />

        {lesson.description && (
          <div
            style={{
              marginTop: 28,
              padding: 24,
              background: "white",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: 16,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#1A1A1A",
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.description}
          </div>
        )}

        {/* Prev / Next nav */}
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {prev ? (
            <Link
              href={`/learn/${courseId}/${prev.day}`}
              style={{
                padding: 18,
                background: "white",
                borderRadius: 14,
                border: "1px solid rgba(26,26,26,0.08)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, color: "#9CA3AF" }}>
                ← Day {prev.day}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>
                {prev.title}
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/learn/${courseId}/${next.day}`}
              style={{
                padding: 18,
                background: "white",
                borderRadius: 14,
                border: "1px solid rgba(26,26,26,0.08)",
                textDecoration: "none",
                color: "inherit",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, color: "#9CA3AF" }}>
                Day {next.day} →
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 4 }}>
                {next.title}
              </div>
            </Link>
          ) : <div />}
        </div>
      </section>
    </main>
  );
}
