// CoachUsageTable — per-student KDP Coach usage rows. Receives plain,
// pre-aggregated data from the server page and renders it with the shared
// admin Table (client-only because the table uses render callbacks).

"use client";

import Table, { type Column } from "@/components/admin-ui/Table";

export type CoachUsageRow = {
  userId: string;
  name: string;
  contact: string;
  messages: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  lastUsedAt: string | null;
};

const fmtInt = (n: number) => n.toLocaleString("en-US");
const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: n < 1 ? 4 : 2,
  })}`;
const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export default function CoachUsageTable({ rows }: { rows: CoachUsageRow[] }) {
  const columns: Column<CoachUsageRow>[] = [
    {
      key: "name",
      header: "Student",
      render: (r) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontWeight: 600 }}>{r.name}</span>
          {r.contact ? (
            <span style={{ fontSize: 12, color: "#A3A3A3" }}>{r.contact}</span>
          ) : null}
        </div>
      ),
    },
    {
      key: "messages",
      header: "Messages",
      align: "right",
      render: (r) => fmtInt(r.messages),
    },
    {
      key: "inputTokens",
      header: "Input tokens",
      align: "right",
      render: (r) => fmtInt(r.inputTokens),
    },
    {
      key: "outputTokens",
      header: "Output tokens",
      align: "right",
      render: (r) => fmtInt(r.outputTokens),
    },
    {
      key: "estimatedCostUsd",
      header: "Est. cost",
      align: "right",
      render: (r) => (
        <span style={{ fontWeight: 600 }}>{fmtUsd(r.estimatedCostUsd)}</span>
      ),
    },
    {
      key: "lastUsedAt",
      header: "Last used",
      align: "right",
      render: (r) => fmtDate(r.lastUsedAt),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={rows}
      keyExtractor={(r) => r.userId}
      emptyMessage="No coach usage logged yet. Usage appears here once an enrolled student chats with the KDP Coach."
    />
  );
}
