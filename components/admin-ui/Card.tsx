// Card — the foundational surface for the admin dashboard.
// Use whenever you need a bordered, white "panel" container with the standard
// Linear/Stripe-style hairline border + soft shadow. The header slots
// (title/subtitle/action) are optional; if none are passed the card simply
// renders its children inside `padding`.
//
// This is a server-safe component — no client hooks, no event handlers.

import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  /** Padding inside the card. Defaults to `20` (px). Pass `0` to render flush. */
  padding?: number;
  /** Optional title rendered in the header band (Space Grotesk, 16px, 600). */
  title?: ReactNode;
  /** Optional secondary text below the title. */
  subtitle?: ReactNode;
  /** Optional right-aligned slot in the header (typically a Button). */
  action?: ReactNode;
  /** Optional extra inline styles merged onto the outer element. */
  style?: CSSProperties;
  /** Optional className for cases where Tailwind utilities are useful (hover, etc). */
  className?: string;
  children?: ReactNode;
};

export default function Card({
  padding = 20,
  title,
  subtitle,
  action,
  style,
  className,
  children,
}: CardProps) {
  const hasHeader = title || subtitle || action;

  return (
    <div
      className={className}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(17,24,39,0.08)",
        borderRadius: 12,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        color: "#0A0A0A",
        ...style,
      }}
    >
      {hasHeader ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            padding: `${padding}px ${padding}px ${subtitle ? padding - 4 : padding}px`,
            borderBottom: children ? "1px solid rgba(17,24,39,0.06)" : "none",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            {title ? (
              <div
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#0A0A0A",
                  lineHeight: 1.25,
                }}
              >
                {title}
              </div>
            ) : null}
            {subtitle ? (
              <div
                style={{
                  marginTop: title ? 4 : 0,
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#525252",
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
          {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
        </div>
      ) : null}
      <div
        style={{
          padding: hasHeader ? padding : padding,
          paddingTop: hasHeader ? padding : padding,
        }}
      >
        {children}
      </div>
    </div>
  );
}
