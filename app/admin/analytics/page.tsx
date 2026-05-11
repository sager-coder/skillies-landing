/**
 * /admin/analytics — placeholder dashboard. Renders 4 disabled stat
 * cards + an empty-state hero. Replace this with real data when
 * analytics is built.
 */
import type { Metadata } from "next";
import StatCard from "@/components/admin-ui/StatCard";
import Card from "@/components/admin-ui/Card";
import Badge from "@/components/admin-ui/Badge";

export const metadata: Metadata = { title: "Analytics · Skillies Admin" };

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Coming soon ribbon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
            }}
          >
            Analytics overview
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.55,
              maxWidth: "60ch",
            }}
          >
            Track signups, course enrollments, watch time and revenue in
            one place. We&rsquo;re wiring it up.
          </p>
        </div>
        <Badge variant="info">Coming soon</Badge>
      </div>

      {/* Stat-card grid — all disabled to convey placeholder */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          label="Signed-up students"
          value="—"
          delta="+0 this week"
          deltaTone="neutral"
          disabled
        />
        <StatCard
          label="Active enrollments"
          value="—"
          delta="+0 this week"
          deltaTone="neutral"
          disabled
        />
        <StatCard
          label="Lessons watched"
          value="—"
          delta="+0 today"
          deltaTone="neutral"
          disabled
        />
        <StatCard
          label="Revenue"
          value="—"
          delta="₹0 this month"
          deltaTone="neutral"
          disabled
        />
      </div>

      {/* Two large chart placeholders */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
        className="analytics-charts"
      >
        <ChartPlaceholder title="Daily signups" subtitle="Last 30 days" />
        <ChartPlaceholder title="Top courses" subtitle="By enrollments" compact />
      </div>

      <Card padding={32}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "32px 16px",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(198,40,40,0.08)",
              color: "#C62828",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 3 5-7" />
            </svg>
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#0A0A0A",
            }}
          >
            Analytics is on the way.
          </h3>
          <p
            style={{
              margin: 0,
              maxWidth: "52ch",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.6,
            }}
          >
            Live signups, course-by-course funnels, lesson completion
            rates, payment flow and student watch-time will appear here
            once we wire in event tracking. For now, head to{" "}
            <a
              href="/admin/users"
              style={{ color: "#C62828", fontWeight: 600, textDecoration: "none" }}
            >
              Users
            </a>{" "}
            or{" "}
            <a
              href="/admin/courses"
              style={{ color: "#C62828", fontWeight: 600, textDecoration: "none" }}
            >
              Courses
            </a>{" "}
            to manage the school.
          </p>
        </div>
      </Card>

      <style>{`
        @media (max-width: 900px) {
          .analytics-charts { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ChartPlaceholder({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(17,24,39,0.08)",
        borderRadius: 12,
        padding: 20,
        height: compact ? 240 : 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#0A0A0A",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "#A3A3A3", marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        <Badge variant="info">Soon</Badge>
      </div>

      {/* Faux chart bars */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          opacity: 0.4,
        }}
        aria-hidden
      >
        {compact
          ? Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${30 + ((i * 17) % 50)}%`,
                  background: "linear-gradient(180deg, rgba(198,40,40,0.35), rgba(198,40,40,0.12))",
                  borderRadius: 6,
                }}
              />
            ))
          : Array.from({ length: 30 }, (_, i) => {
              // pseudo-random but deterministic so SSR/CSR match
              const h = 20 + (((i + 1) * 73) % 70);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background:
                      "linear-gradient(180deg, rgba(198,40,40,0.30), rgba(198,40,40,0.08))",
                    borderRadius: 4,
                  }}
                />
              );
            })}
      </div>
    </div>
  );
}
