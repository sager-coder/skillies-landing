// StatCard — the single "metric tile" used on the Analytics page.
//
// Each card surfaces one number (`value`) with a label above it and an
// optional `delta` (e.g. "+12%") beneath. Pass `disabled` when the metric is
// a "Coming Soon" placeholder — the tile renders greyed out, ignoring the
// `deltaTone` prop.
//
// Server-safe.

import type { CSSProperties, ReactNode } from "react";

type DeltaTone = "up" | "down" | "neutral";

type StatCardProps = {
  label: ReactNode;
  /** Big numeric/short string value. */
  value: string;
  /** Optional small movement indicator, e.g. "+12%". */
  delta?: string;
  /** Color the delta — `up` is green, `down` is red, `neutral` is grey. */
  deltaTone?: DeltaTone;
  /** When true, paints the whole card in muted greys (Coming Soon state). */
  disabled?: boolean;
  style?: CSSProperties;
};

function deltaColor(tone: DeltaTone): string {
  switch (tone) {
    case "up":
      return "#16A34A";
    case "down":
      return "#DC2626";
    case "neutral":
    default:
      return "#525252";
  }
}

export default function StatCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  disabled = false,
  style,
}: StatCardProps) {
  return (
    <div
      aria-disabled={disabled || undefined}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(17,24,39,0.08)",
        borderRadius: 12,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        padding: 20,
        opacity: disabled ? 0.55 : 1,
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "#A3A3A3",
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily:
            "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: disabled ? "#A3A3A3" : "#0A0A0A",
        }}
      >
        {value}
      </div>
      {delta ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 12.5,
            fontWeight: 500,
            color: disabled ? "#A3A3A3" : deltaColor(deltaTone),
            lineHeight: 1.2,
          }}
        >
          {delta}
        </div>
      ) : null}
    </div>
  );
}
