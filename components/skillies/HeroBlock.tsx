/**
 * HeroBlock · the universal hero for every Skillies vertical landing page
 * AND the new B2B homepage.
 *
 * Two layout modes:
 *   - "split"    → 60/40 photo right + text left (default · medical, study abroad,
 *                  coaching, retail)
 *   - "fullbleed"→ photo as page bg with text overlay bottom-left (real estate)
 *   - "asymmetric" → 50/50 with extra whitespace + slow fade (hajj)
 *
 * Variant prop drives sub-style choices (typography weight, italic vs
 * upright, asymmetric whitespace).
 *
 * Designed against the visual design system spec, see
 * skillies-visual-design-system-DRAFT.md Part 3.
 */
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export type HeroVariant =
  | "default"
  | "medical"
  | "realestate"
  | "studyabroad"
  | "coaching"
  | "interiors"
  | "hajj"
  | "retail";

type Cta = { href: string; label: string };

export type HeroBlockProps = {
  /** Headline · can be string or rich JSX (Fraunces is applied automatically). */
  headline: ReactNode;
  /** Sub-headline · sentence to two. Inter, larger size. */
  subhead: ReactNode;
  /** Primary CTA · red pill. */
  ctaPrimary: Cta;
  /** Secondary CTA · ghost pill (optional). */
  ctaSecondary?: Cta;
  /** Trust strip · single line, no logos, no count. */
  trustStrip?: string;
  /** Hero photo · src + alt. */
  image: { src: string; alt: string };
  /** Layout. */
  layout?: "split" | "fullbleed" | "asymmetric";
  /** Per-vertical variant — adjusts typography weight + tracking. */
  variant?: HeroVariant;
};

function HeadlineClass(variant: HeroVariant): string {
  if (variant === "medical") return "sk-font-display-light";
  if (variant === "hajj") return "sk-font-display-italic";
  return "sk-font-display";
}

export default function HeroBlock({
  headline,
  subhead,
  ctaPrimary,
  ctaSecondary,
  trustStrip,
  image,
  layout = "split",
  variant = "default",
}: HeroBlockProps) {
  const headlineClass = HeadlineClass(variant);

  if (layout === "fullbleed") {
    return (
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cream gradient mask, bottom-left bias */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top right, var(--sk-cream) 0%, rgba(250,245,235,0.85) 30%, rgba(250,245,235,0) 70%)",
          }}
        />
        <div className="sk-container relative z-10 flex min-h-[88vh] flex-col justify-end pt-32 pb-24">
          <div className="max-w-[820px]">
            <h1
              className={headlineClass}
              style={{ fontSize: "var(--sk-text-display)" }}
            >
              {headline}
            </h1>
            <p
              className="sk-font-body mt-6 max-w-[58ch] text-[color:var(--sk-ink)]"
              style={{ fontSize: "var(--sk-text-lead)" }}
            >
              {subhead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryCta {...ctaPrimary} />
              {ctaSecondary ? <GhostCta {...ctaSecondary} /> : null}
            </div>
            {trustStrip ? (
              <p
                className="sk-font-meta mt-8"
                style={{ color: "var(--sk-ink60)" }}
              >
                {trustStrip}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // asymmetric (hajj) and split (default) share scaffolding
  const isAsymmetric = layout === "asymmetric";

  return (
    <section className="sk-container pt-24 pb-20 md:pt-32 md:pb-28">
      <div
        className={`grid gap-12 md:gap-16 ${
          isAsymmetric ? "md:grid-cols-2" : "md:grid-cols-[1fr_minmax(0,560px)]"
        }`}
      >
        <div className={`${isAsymmetric ? "self-end" : "self-center"}`}>
          {trustStrip ? (
            <p className="sk-font-meta mb-6" style={{ color: "var(--sk-ink60)" }}>
              {trustStrip}
            </p>
          ) : null}
          <h1
            className={headlineClass}
            style={{
              fontSize: isAsymmetric
                ? "clamp(2.5rem, 4.5vw + 1rem, 4.75rem)"
                : "var(--sk-text-display)",
            }}
          >
            {headline}
          </h1>
          <p
            className="sk-font-body mt-6 max-w-[52ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            {subhead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <PrimaryCta {...ctaPrimary} />
            {ctaSecondary ? <GhostCta {...ctaSecondary} /> : null}
          </div>
        </div>
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-sm ${
            isAsymmetric ? "" : "md:translate-x-6"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function PrimaryCta({ href, label }: Cta) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{
        background: "var(--sk-red)",
        color: "var(--sk-cream)",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}

function GhostCta({ href, label }: Cta) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-colors duration-200"
      style={{
        border: "1px solid var(--sk-ink20)",
        color: "var(--sk-ink)",
      }}
    >
      {label}
    </Link>
  );
}
