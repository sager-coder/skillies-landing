/**
 * PainCard · 3 stat-and-quote rows (or photo bands) showing the vertical-
 * specific pains the customer feels.
 *
 * Real-estate variant uses no chrome (96px numerals, just text).
 * Medical / coaching use teal/indigo left border + smaller stats.
 * Hajj uses italic quotes (no statistics).
 * Retail uses plain bullets with red arrow.
 */
import type { ReactNode } from "react";

export type PainItem = {
  /** Headline stat — "63%" / "₹14,000" / quote-leading word */
  stat?: string;
  /** Body text */
  label: ReactNode;
  /** For hajj-quote variant */
  quote?: string;
  /** Attribution for quote (hajj) */
  attribution?: string;
};

export type PainCardVariant =
  | "default"
  | "stat-large" /* real-estate · 96px numerals, no chrome */
  | "stat-bordered" /* medical/coaching · teal or indigo border-left */
  | "quote" /* hajj · italic quotes, no stats */
  | "bullet"; /* retail · plain bullets, red arrow */

export type PainCardProps = {
  items: readonly PainItem[];
  variant?: PainCardVariant;
  /** CSS color string for accent (border, numeral) — passed in by vertical page */
  accent?: string;
};

export default function PainCard({
  items,
  variant = "default",
  accent = "var(--sk-ink)",
}: PainCardProps) {
  if (variant === "stat-large") {
    return (
      <section className="sk-section">
        <div className="sk-container">
          <div className="grid gap-12 md:grid-cols-3 md:gap-16">
            {items.map((p, i) => (
              <div key={i}>
                <div
                  className="sk-font-display"
                  style={{
                    fontSize: "clamp(4.5rem, 6vw + 1rem, 6rem)",
                    lineHeight: 0.9,
                    color: "var(--sk-ink)",
                  }}
                >
                  {p.stat}
                </div>
                <p
                  className="sk-font-body mt-4 max-w-[24ch]"
                  style={{ fontSize: "1rem", color: accent }}
                >
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "stat-bordered") {
    return (
      <section className="sk-section">
        <div className="sk-container">
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {items.map((p, i) => (
              <div
                key={i}
                style={{ borderLeft: `2px solid ${accent}`, paddingLeft: "1.5rem" }}
              >
                <div
                  className="sk-font-display"
                  style={{
                    fontSize: "clamp(3rem, 4vw + 1rem, 4.5rem)",
                    lineHeight: 1,
                    color: "var(--sk-ink)",
                  }}
                >
                  {p.stat}
                </div>
                <p
                  className="sk-font-body mt-3"
                  style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
                >
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "quote") {
    return (
      <section className="sk-section">
        <div className="sk-container">
          <div className="space-y-12 max-w-[820px]">
            {items.map((p, i) => (
              <blockquote
                key={i}
                style={{ borderLeft: `2px solid ${accent}`, paddingLeft: "2rem" }}
              >
                <p
                  className="sk-font-display-italic"
                  style={{
                    fontSize: "clamp(1.25rem, 1.5vw + 1rem, 1.75rem)",
                    color: "var(--sk-ink)",
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;{p.quote ?? p.label}&rdquo;
                </p>
                {p.attribution ? (
                  <footer
                    className="sk-font-meta mt-4"
                    style={{ color: accent }}
                  >
                    — {p.attribution}
                  </footer>
                ) : null}
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "bullet") {
    return (
      <section className="sk-section">
        <div className="sk-container">
          <ul className="max-w-[640px] space-y-5">
            {items.map((p, i) => (
              <li
                key={i}
                className="sk-font-body flex gap-4"
                style={{ fontSize: "1.0625rem", color: "var(--sk-ink)" }}
              >
                <span style={{ color: "var(--sk-red)", fontWeight: 500 }}>→</span>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // default · 3 stat blocks with red underline
  return (
    <section className="sk-section">
      <div className="sk-container">
        <div className="grid gap-10 md:grid-cols-3">
          {items.map((p, i) => (
            <div key={i}>
              <div
                className="sk-font-display"
                style={{
                  fontSize: "clamp(2.75rem, 4vw + 1rem, 4rem)",
                  color: "var(--sk-ink)",
                  borderBottom: `2px solid var(--sk-red)`,
                  display: "inline-block",
                  paddingBottom: "0.25rem",
                }}
              >
                {p.stat}
              </div>
              <p
                className="sk-font-body mt-4"
                style={{ fontSize: "1rem", color: "var(--sk-ink60)" }}
              >
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
