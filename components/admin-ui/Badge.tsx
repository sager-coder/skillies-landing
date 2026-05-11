// Badge — small pill used to flag status inside tables and cards.
// Variants apply a subtle tinted background + matching foreground so the badge
// reads at a glance without competing with the surrounding content.
//
// Use cases:
//   neutral — generic tags (e.g. course tier names)
//   success — "Active", "Paid", "Verified"
//   warning — "Pending", "Trial ending"
//   danger  — "Banned", "Failed", "Refunded"
//   info    — "Beta", "New", "Coming soon"
//
// This is a server-safe component.

import type { CSSProperties, ReactNode } from "react";

type Variant = "neutral" | "success" | "warning" | "danger" | "info";

type BadgeProps = {
  variant?: Variant;
  /** Optional extra inline styles. */
  style?: CSSProperties;
  /** Optional className for hover utilities, etc. */
  className?: string;
  children: ReactNode;
};

function palette(variant: Variant) {
  switch (variant) {
    case "success":
      return { bg: "rgba(22,163,74,0.10)", fg: "#15803D" };
    case "warning":
      return { bg: "rgba(217,119,6,0.10)", fg: "#B45309" };
    case "danger":
      return { bg: "rgba(220,38,38,0.10)", fg: "#B91C1C" };
    case "info":
      return { bg: "rgba(37,99,235,0.10)", fg: "#1D4ED8" };
    case "neutral":
    default:
      return { bg: "rgba(17,24,39,0.06)", fg: "#404040" };
  }
}

export default function Badge({
  variant = "neutral",
  style,
  className,
  children,
}: BadgeProps) {
  const { bg, fg } = palette(variant);
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        height: 20,
        borderRadius: 999,
        background: bg,
        color: fg,
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        fontSize: 11.5,
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
