/**
 * PricingSnapshot · per-vertical pricing summary block.
 *
 * Two layouts:
 *   - "tiers"   → multi-column comparison (medical 2-col, coaching 3-col)
 *   - "single"  → one tier card + lots of whitespace (real estate, hajj)
 *
 * The user's interactive calculator at /pricing is the canonical source.
 * This component shows only "from ₹X" or representative tier figures.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export type PricingTier = {
  name: string;
  /** Setup fee summary, e.g. "₹49,999 setup" */
  setup: string;
  /** Monthly fee summary, e.g. "₹24,999 / month" */
  monthly: string;
  bullets: readonly string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};

export type PricingSnapshotProps = {
  tiers: readonly PricingTier[];
  layout?: "tiers" | "single";
  /** Eyebrow text (e.g. "INVESTMENT", "PRICING") */
  eyebrow?: string;
  /** Section background color */
  sectionBg?: string;
  /** Footer note (e.g. "Public calculator at /pricing") */
  footnote?: ReactNode;
};

export default function PricingSnapshot({
  tiers,
  layout = "tiers",
  eyebrow = "PRICING",
  sectionBg,
  footnote,
}: PricingSnapshotProps) {
  if (layout === "single") {
    const t = tiers[0]!;
    return (
      <section className="sk-section border-b border-sk-hairline overflow-hidden">
        <div className="sk-container">
          <div className="mx-auto max-w-[720px]">
            <p
              className="sk-font-meta mb-6"
              style={{ color: "var(--sk-ink60)" }}
            >
              {eyebrow}
            </p>
            <div
              className="sk-font-display"
              style={{
                fontSize: "clamp(3.5rem, 5vw + 1rem, 5.5rem)",
                lineHeight: 1,
                color: "var(--sk-ink)",
              }}
            >
              {t.setup}
            </div>
            <p
              className="sk-font-body mt-3"
              style={{ fontSize: "1.0625rem", color: "var(--sk-ink60)" }}
            >
              setup · then {t.monthly}
            </p>
            <ul className="mt-8 space-y-3 max-w-[52ch]">
              {t.bullets.map((b, i) => (
                <li
                  key={i}
                  className="sk-font-body"
                  style={{ fontSize: "1rem", color: "var(--sk-ink)" }}
                >
                  · {b}
                </li>
              ))}
            </ul>
            {t.ctaLabel && t.ctaHref ? (
              <div className="mt-10">
                <Link
                  href={t.ctaHref}
                  className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium"
                  style={{
                    background: "var(--sk-red)",
                    color: "var(--sk-cream)",
                  }}
                >
                  {t.ctaLabel}
                </Link>
              </div>
            ) : null}
            {footnote ? (
              <p
                className="sk-font-meta mt-10"
                style={{ color: "var(--sk-ink40)" }}
              >
                {footnote}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // tiers layout
  return (
    <section className="sk-section border-b border-sk-hairline overflow-hidden">
      <div className="sk-container">
        <p
          className="sk-font-meta mb-6"
          style={{ color: "var(--sk-ink60)" }}
        >
          {eyebrow}
        </p>
        <div
          className={`grid gap-6 ${
            tiers.length === 2
              ? "md:grid-cols-2"
              : tiers.length === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
          }`}
        >
          {tiers.map((t, i) => (
            <article
              key={i}
              className="rounded-2xl p-8"
              style={{
                border: t.featured
                  ? "1px solid var(--sk-ink)"
                  : "1px solid var(--sk-hairline)",
                background: "transparent",
              }}
            >
              <p
                className="sk-font-meta mb-3"
                style={{ color: "var(--sk-ink60)" }}
              >
                {t.name}
              </p>
              <div
                className="sk-font-display"
                style={{
                  fontSize: "clamp(2.25rem, 3vw + 1rem, 3rem)",
                  lineHeight: 1,
                  color: "var(--sk-ink)",
                }}
              >
                {t.setup}
              </div>
              <p
                className="sk-font-body mt-2"
                style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
              >
                setup · then {t.monthly}
              </p>
              <ul className="mt-6 space-y-2">
                {t.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="sk-font-body"
                    style={{ fontSize: "0.9375rem", color: "var(--sk-ink)" }}
                  >
                    · {b}
                  </li>
                ))}
              </ul>
              {t.ctaLabel && t.ctaHref ? (
                <Link
                  href={t.ctaHref}
                  className="mt-7 inline-flex h-11 items-center rounded-full px-6 text-[14px] font-medium"
                  style={
                    t.featured
                      ? { background: "var(--sk-red)", color: "var(--sk-cream)" }
                      : {
                          border: "1px solid var(--sk-ink20)",
                          color: "var(--sk-ink)",
                        }
                  }
                >
                  {t.ctaLabel}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        {footnote ? (
          <p
            className="sk-font-meta mt-10"
            style={{ color: "var(--sk-ink40)" }}
          >
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
