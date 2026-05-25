// DailyUsageChart — per-day bar chart of KDP Coach messages, with the
// day's estimated cost on hover. Server-safe: pure presentational, takes
// pre-aggregated points sorted ascending by date.

import Card from "@/components/admin-ui/Card";

export type DailyPoint = {
  /** YYYY-MM-DD */
  date: string;
  messages: number;
  cost: number;
};

const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: n < 1 ? 4 : 2,
  })}`;

// Short label for the x-axis: "May 3".
function shortLabel(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DailyUsageChart({ points }: { points: DailyPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.messages));
  const peak = points.length;
  // With many days, only label a handful so the axis stays readable.
  const labelEvery = peak <= 14 ? 1 : Math.ceil(peak / 10);

  return (
    <Card padding={20}>
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
            Messages per day
          </div>
          <div style={{ fontSize: 12, color: "#A3A3A3", marginTop: 2 }}>
            Hover a bar for that day&rsquo;s estimated cost
          </div>
        </div>
      </div>

      {points.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#A3A3A3",
            fontSize: 13,
          }}
        >
          No usage in this range yet.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: points.length > 40 ? 2 : 4,
            height: 200,
          }}
        >
          {points.map((p, i) => {
            const h = (p.messages / max) * 100;
            return (
              <div
                key={p.date}
                title={`${shortLabel(p.date)} · ${p.messages} message${
                  p.messages === 1 ? "" : "s"
                } · ${fmtUsd(p.cost)}`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${Math.max(h, p.messages > 0 ? 4 : 0)}%`,
                    minHeight: p.messages > 0 ? 3 : 0,
                    background:
                      "linear-gradient(180deg, rgba(198,40,40,0.55), rgba(198,40,40,0.2))",
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: "#A3A3A3",
                    whiteSpace: "nowrap",
                    height: 12,
                    overflow: "hidden",
                  }}
                >
                  {i % labelEvery === 0 ? shortLabel(p.date) : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
