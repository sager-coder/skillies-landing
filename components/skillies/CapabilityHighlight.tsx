/**
 * CapabilityHighlight · grid of capability cards. Each card has title + body
 * + optional mini media (looped video, screen-record, chat-bubble preview).
 *
 * Card background, border, hairline color shift per vertical.
 * Grid is 3-up on desktop by default; can be 2-up for premium tiers.
 */
import type { ReactNode } from "react";

export type CapabilityItem = {
  title: string;
  body: ReactNode;
  /** Optional mini-media node (img, video, chat preview) */
  media?: ReactNode;
};

export type CapabilityHighlightProps = {
  items: readonly CapabilityItem[];
  /** Section title */
  title?: ReactNode;
  /** Section eyebrow text */
  eyebrow?: string;
  /** Number of columns at md+ breakpoint */
  columns?: 2 | 3;
  /** Card background color (vertical accent) */
  cardBg?: string;
  /** Card hairline color (border accent) */
  cardHairline?: string;
  /** Hairline position on card */
  hairlinePosition?: "top" | "bottom" | "left";
  /** Section background color (full-bleed tint) */
  sectionBg?: string;
};

export default function CapabilityHighlight({
  items,
  title,
  eyebrow,
  columns = 3,
  cardBg,
  cardHairline,
  hairlinePosition = "top",
  sectionBg,
}: CapabilityHighlightProps) {
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section
      className="sk-section"
      style={sectionBg ? { background: sectionBg } : undefined}
    >
      <div className="sk-container">
        {(eyebrow || title) && (
          <div className="mb-12 max-w-[640px]">
            {eyebrow ? (
              <p
                className="sk-font-meta mb-4"
                style={{ color: "var(--sk-ink60)" }}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                className="sk-font-section"
                style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)" }}
              >
                {title}
              </h2>
            ) : null}
          </div>
        )}
        <div className={`grid gap-6 sm:gap-8 ${gridCols}`}>
          {items.map((c, i) => {
            const hairlineStyle: React.CSSProperties = {};
            if (cardHairline) {
              if (hairlinePosition === "top")
                hairlineStyle.borderTop = `1px solid ${cardHairline}`;
              if (hairlinePosition === "bottom")
                hairlineStyle.borderBottom = `2px solid ${cardHairline}`;
              if (hairlinePosition === "left")
                hairlineStyle.borderLeft = `2px solid ${cardHairline}`;
            }
            return (
              <article
                key={i}
                className="rounded-2xl p-7"
                style={{
                  background: cardBg ?? "var(--sk-cream)",
                  border: cardBg ? "none" : "1px solid var(--sk-hairline)",
                  ...hairlineStyle,
                }}
              >
                <h3
                  className="sk-font-section mb-2"
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--sk-ink)",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="sk-font-body"
                  style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
                >
                  {c.body}
                </p>
                {c.media ? <div className="mt-4">{c.media}</div> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
