import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Wordmark, Kicker } from "@/components/design/Primitives";
import LearnTopBar from "@/components/learn/LearnTopBar";

export const metadata = {
  title: "My Courses · Skillies.AI",
};

export const dynamic = "force-dynamic";

type EnrolledCourse = {
  id: string;
  title: string;
  description: string | null;
  total_lessons: number | null;
  status: string;
  tier: "founding" | "standard" | "pro";
  enrolled_at: string;
  completed_count: number;
};

export default async function LearnHomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/learn");

  // Pull enrolled courses via the my_courses view (RLS-scoped to caller)
  const { data: courses } = await supabase
    .from("my_courses")
    .select("*");

  const enrolled = (courses || []) as EnrolledCourse[];

  // No enrolment yet — show a polite empty state, not the public construction page
  if (enrolled.length === 0) {
    return (
      <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
        <LearnTopBar />
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
          <Kicker tone="red">No courses yet</Kicker>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#1A1A1A",
              margin: "12px 0 14px",
            }}
          >
            You’re signed in — no course on this number yet.
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.65 }}>
            If you just paid, your enrolment should land in a few seconds
            (Razorpay sends a signed webhook straight to our system). If
            it doesn&rsquo;t, it usually means the phone number on the
            payment didn&rsquo;t match this one. Either pick up where you
            left off on the program page, or ping Ehsan.
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/#program"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "#C62828",
                color: "white",
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.02em",
                boxShadow: "0 12px 28px rgba(198,40,40,0.22)",
              }}
            >
              Enrol in the 50-day program →
            </a>
            <a
              href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20signed%20in%20but%20don%27t%20see%20my%20course.%20My%20phone%20is%20"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "transparent",
                border: "1px solid rgba(26,26,26,0.18)",
                color: "#1A1A1A",
                fontWeight: 600,
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Ping Ehsan →
            </a>
          </div>
        </section>
      </main>
    );
  }

  // Has at least one enrollment — show the courses grid
  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <LearnTopBar />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px" }}>
        <Kicker tone="red">My Courses</Kicker>
        <h1
          style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#1A1A1A",
            margin: "12px 0 8px",
          }}
        >
          Welcome back.
        </h1>
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 22,
            color: "#6B7280",
            margin: "0 0 40px",
          }}
        >
          Pick up where you left off.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {enrolled.map((c) => (
            <a
              key={c.id}
              href={`/learn/${c.id}`}
              style={{
                position: "relative",
                padding: 28,
                borderRadius: 22,
                background: "white",
                border: "1px solid #F0E8D8",
                textDecoration: "none",
                color: "inherit",
                transition: "transform .25s, box-shadow .25s",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: tierColor(c.tier),
                }}
              >
                {tierLabel(c.tier)}
              </div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                  margin: "10px 0 8px",
                }}
              >
                {c.title}
              </h2>
              {c.description && (
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 18px", lineHeight: 1.55 }}>
                  {c.description}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                <span>
                  {c.completed_count} / {c.total_lessons || 50} lessons
                </span>
                <span style={{ flex: 1, height: 4, background: "#F0E8D8", borderRadius: 999 }}>
                  <span
                    style={{
                      display: "block",
                      width: `${Math.round(((c.completed_count || 0) / (c.total_lessons || 50)) * 100)}%`,
                      height: "100%",
                      background: "#C62828",
                      borderRadius: 999,
                    }}
                  />
                </span>
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  color: "#C62828",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Continue →
              </div>
            </a>
          ))}
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
function tierColor(t: string) {
  if (t === "founding" || t === "pro") return "#C9A24E";
  return "#C62828";
}
