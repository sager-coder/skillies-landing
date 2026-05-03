/**
 * CaseStudyCard · one quote, three metrics, optional photo.
 *
 * If `verified === false`, shows "modeled on real outcomes" disclosure
 * (per visual design system spec — never fake-attribute a hypothetical).
 */
import Image from "next/image";
import type { ReactNode } from "react";

export type CaseStudyCardProps = {
  quote: ReactNode;
  author: string;
  role: string;
  metrics?: readonly { label: string; value: string }[];
  /** Photo for split layout */
  image?: { src: string; alt: string };
  /** False = hypothetical (shows disclosure) */
  verified?: boolean;
  /** Section background color */
  sectionBg?: string;
  /** Layout — "quote-led" stacks vertically; "split" is 50/50 photo + quote */
  layout?: "quote-led" | "split";
};

export default function CaseStudyCard({
  quote,
  author,
  role,
  metrics,
  image,
  verified = false,
  sectionBg,
  layout = "quote-led",
}: CaseStudyCardProps) {
  const Quote = (
    <>
      <blockquote
        className="sk-font-display-italic"
        style={{
          fontSize: "clamp(1.5rem, 2vw + 1rem, 2rem)",
          color: "var(--sk-ink)",
          lineHeight: 1.4,
        }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="sk-font-body mt-6" style={{ fontSize: "1rem", color: "var(--sk-ink)" }}>
        <strong>{author}</strong>
        <span style={{ color: "var(--sk-ink60)" }}> · {role}</span>
      </p>
      {!verified ? (
        <p
          className="sk-font-meta mt-3"
          style={{ color: "var(--sk-ink40)" }}
        >
          MODELED ON REAL OUTCOMES
        </p>
      ) : null}
      {metrics && metrics.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {metrics.map((m, i) => (
            <div key={i}>
              <div
                className="sk-font-display"
                style={{
                  fontSize: "clamp(1.5rem, 2vw + 1rem, 2.25rem)",
                  color: "var(--sk-ink)",
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <p
                className="sk-font-meta mt-2"
                style={{ color: "var(--sk-ink60)" }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );

  if (layout === "split" && image) {
    return (
      <section
        className="sk-section"
        style={sectionBg ? { background: sectionBg } : undefined}
      >
        <div className="sk-container">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>{Quote}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="sk-section"
      style={sectionBg ? { background: sectionBg } : undefined}
    >
      <div className="sk-container">
        <div className="mx-auto max-w-[820px]">{Quote}</div>
      </div>
    </section>
  );
}
