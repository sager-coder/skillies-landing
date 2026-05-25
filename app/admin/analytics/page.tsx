/**
 * /admin/analytics — KDP Coach chatbot usage.
 *
 * Server component: reads raw `coach_usage` rows within the selected
 * date range via the service-role client (admin layout already gates
 * is_admin), then aggregates per-student and per-day in memory. Profile
 * names are fetched in a second query keyed by the user_ids seen.
 *
 * Cost is an *estimate* computed at write time from list pricing in
 * lib/anthropic-pricing.ts — useful for relative comparison, not billing.
 */
import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import StatCard from "@/components/admin-ui/StatCard";
import Badge from "@/components/admin-ui/Badge";
import CoachUsageTable, { type CoachUsageRow } from "./CoachUsageTable";
import DailyUsageChart, { type DailyPoint } from "./DailyUsageChart";

export const metadata: Metadata = { title: "Analytics · Skillies Admin" };
export const dynamic = "force-dynamic";

type RangeKey = "7d" | "30d" | "90d" | "all";
const RANGES: { key: RangeKey; label: string; days: number | null }[] = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: null },
];

type UsageRow = {
  user_id: string;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
};

function displayName(p: ProfileRow | undefined, userId: string): string {
  if (!p) return `${userId.slice(0, 8)}…`;
  const full =
    p.full_name?.trim() ||
    [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
  return full || p.email?.trim() || p.phone?.trim() || "Unknown student";
}

const fmtInt = (n: number) => n.toLocaleString("en-US");
const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: n < 1 ? 4 : 2,
  })}`;

// Local YYYY-MM-DD key for day bucketing.
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: RangeKey =
    RANGES.find((r) => r.key === rangeParam)?.key ?? "30d";
  const rangeDef = RANGES.find((r) => r.key === range)!;

  const since =
    rangeDef.days == null
      ? null
      : new Date(Date.now() - rangeDef.days * 24 * 60 * 60 * 1000);

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("coach_usage")
    .select("user_id, input_tokens, output_tokens, estimated_cost_usd, created_at")
    .order("created_at", { ascending: true });
  if (since) query = query.gte("created_at", since.toISOString());

  const { data, error } = await query;
  const usage = (data || []) as UsageRow[];

  // Fetch names for the students that appear in this window.
  const userIds = Array.from(new Set(usage.map((u) => u.user_id)));
  let profiles: ProfileRow[] = [];
  if (userIds.length > 0) {
    const { data: pData } = await admin
      .from("profiles")
      .select("id, full_name, first_name, last_name, email, phone")
      .in("id", userIds);
    profiles = (pData || []) as ProfileRow[];
  }
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  // Aggregate per student.
  const perUser = new Map<
    string,
    {
      messages: number;
      inputTokens: number;
      outputTokens: number;
      cost: number;
      lastUsedAt: string | null;
    }
  >();
  for (const u of usage) {
    const cur =
      perUser.get(u.user_id) ??
      { messages: 0, inputTokens: 0, outputTokens: 0, cost: 0, lastUsedAt: null };
    cur.messages += 1;
    cur.inputTokens += u.input_tokens ?? 0;
    cur.outputTokens += u.output_tokens ?? 0;
    cur.cost += Number(u.estimated_cost_usd ?? 0);
    if (!cur.lastUsedAt || u.created_at > cur.lastUsedAt) {
      cur.lastUsedAt = u.created_at;
    }
    perUser.set(u.user_id, cur);
  }

  const rows: CoachUsageRow[] = Array.from(perUser.entries())
    .map(([userId, v]) => {
      const p = profileById.get(userId);
      return {
        userId,
        name: displayName(p, userId),
        contact: p?.email?.trim() || p?.phone?.trim() || "",
        messages: v.messages,
        inputTokens: v.inputTokens,
        outputTokens: v.outputTokens,
        estimatedCostUsd: v.cost,
        lastUsedAt: v.lastUsedAt,
      };
    })
    .sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd);

  // Aggregate per day. Seed every day in the window so gaps render as 0.
  const perDay = new Map<string, { messages: number; cost: number }>();
  if (since) {
    const cursor = new Date(since);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date();
    while (cursor <= end) {
      perDay.set(dayKey(cursor), { messages: 0, cost: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  for (const u of usage) {
    const key = dayKey(new Date(u.created_at));
    const cur = perDay.get(key) ?? { messages: 0, cost: 0 };
    cur.messages += 1;
    cur.cost += Number(u.estimated_cost_usd ?? 0);
    perDay.set(key, cur);
  }
  const daily: DailyPoint[] = Array.from(perDay.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, v]) => ({ date, messages: v.messages, cost: v.cost }));

  const totals = rows.reduce(
    (acc, r) => {
      acc.messages += r.messages;
      acc.tokens += r.inputTokens + r.outputTokens;
      acc.cost += r.estimatedCostUsd;
      return acc;
    },
    { messages: 0, tokens: 0, cost: 0 },
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
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
            KDP Coach usage
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#525252",
              lineHeight: 1.55,
              maxWidth: "64ch",
            }}
          >
            Who is using the student chatbot, how many messages they&rsquo;ve
            sent, and the estimated Anthropic cost. Cost is estimated from
            list pricing at send time &mdash; a guide, not a bill.
          </p>
        </div>
        <Badge variant="info">Haiku 4.5</Badge>
      </div>

      {/* Range filter — segmented links that set ?range= */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {RANGES.map((r) => {
          const active = r.key === range;
          return (
            <a
              key={r.key}
              href={`/admin/analytics?range=${r.key}`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: 9,
                textDecoration: "none",
                border: "1px solid",
                borderColor: active ? "#C62828" : "rgba(17,24,39,0.12)",
                background: active ? "rgba(198,40,40,0.06)" : "#FFFFFF",
                color: active ? "#C62828" : "#525252",
              }}
            >
              {r.label}
            </a>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Students using coach" value={fmtInt(rows.length)} />
        <StatCard label="Messages answered" value={fmtInt(totals.messages)} />
        <StatCard label="Total tokens" value={fmtInt(totals.tokens)} />
        <StatCard label="Estimated cost" value={fmtUsd(totals.cost)} />
      </div>

      {error ? (
        <div
          style={{
            background: "rgba(198,40,40,0.06)",
            border: "1px solid rgba(198,40,40,0.2)",
            borderRadius: 12,
            padding: 16,
            fontSize: 13.5,
            color: "#C62828",
          }}
        >
          Couldn&rsquo;t load usage data: {error.message}. If the{" "}
          <code>coach_usage</code> table doesn&rsquo;t exist yet, run the
          latest <code>supabase/schema.sql</code>.
        </div>
      ) : (
        <>
          <DailyUsageChart points={daily} />
          <CoachUsageTable rows={rows} />
        </>
      )}
    </div>
  );
}
