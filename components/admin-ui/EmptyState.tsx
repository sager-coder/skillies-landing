// EmptyState — large, centred, friendly "nothing here yet" placeholder.
//
// Drop it inside a Card or directly on a page when a list is empty. The
// `icon` prop accepts a plain emoji string (rendered big) or any ReactNode if
// you want to drop in an SVG. Pair with a primary Button as the `action`.
//
// Server-safe.

import type { CSSProperties, ReactNode } from "react";

type EmptyStateProps = {
  /** Emoji string (e.g. "📭") or any ReactNode for an illustration. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Optional CTA, typically a <Button variant="primary">. */
  action?: ReactNode;
  style?: CSSProperties;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "64px 24px",
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      {icon ? (
        <div
          aria-hidden={typeof icon === "string"}
          style={{
            fontSize: typeof icon === "string" ? 44 : undefined,
            lineHeight: 1,
            marginBottom: 16,
            opacity: 0.9,
          }}
        >
          {icon}
        </div>
      ) : null}
      <div
        style={{
          fontFamily:
            "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 600,
          color: "#0A0A0A",
          letterSpacing: "-0.01em",
          marginBottom: description ? 6 : 0,
        }}
      >
        {title}
      </div>
      {description ? (
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 400,
            color: "#525252",
            lineHeight: 1.55,
            maxWidth: 380,
          }}
        >
          {description}
        </div>
      ) : null}
      {action ? <div style={{ marginTop: 20 }}>{action}</div> : null}
    </div>
  );
}
