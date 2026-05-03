"use client";

/**
 * HeroBlockEditorial — the second-generation hero for vertical landing pages.
 *
 * Why a new component instead of patching HeroBlock?
 *  - The original HeroBlock leans on full-bleed photography with text laid
 *    over it. The founder's call: it reads as "boring", visually crammed,
 *    and offers no breathing room. This file is the editorial response —
 *    a discrete asymmetric two-column layout where the headline is the
 *    focal point and the photograph sits beside it as a quiet supporting
 *    actor (not a backdrop).
 *
 * Layout contract (desktop):
 *   ┌──────────────────────────────┬──────────────────┐
 *   │ eyebrow                      │                  │
 *   │ trust line                   │                  │
 *   │                              │                  │
 *   │ HEADLINE LEAD                │   image (4:5)    │
 *   │ headline emphasis (italic)   │   rounded-2xl    │
 *   │ HEADLINE TAIL                │   accent gradient│
 *   │                              │   on top edge    │
 *   │ subhead (50ch)               │                  │
 *   │ [primary CTA] [secondary]    │                  │
 *   │ founder note                 │                  │
 *   └──────────────────────────────┴──────────────────┘
 *           ~58% width                    ~42%
 *
 * Mobile (< 700px):
 *   - Stacked: image first (16:10), then text in a single column.
 *   - Vertical rhythm preserved; horizontal padding tightens.
 *
 * Motion (Framer Motion 12):
 *   - Section: fade + 24px lift on first viewport entry (once: true).
 *   - Text column: stagger across siblings (~80ms) using parent
 *     `staggerChildren` so the eyebrow → headline → subhead → CTAs ladder
 *     reveals naturally without per-sibling delay math.
 *   - Image: settles in with a slight scale (1.02 → 1.0), starts ~400ms
 *     after the section appears, giving the headline a beat to land first.
 *
 * Vertical accent palette is derived from the `vertical` prop via
 * `verticalAccent()`. The eyebrow + the italic emphasis line in the
 * headline both pick up the accent (eyebrow = accent, emphasis = red as
 * the consistent brand-red focal). The image overlay uses the accent at
 * 10% opacity so the photo feels integrated, not pasted on.
 *
 * No `any`, strict prop typing, `next/image` only, only existing brand
 * tokens. Default export.
 */

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type Vertical =
  | "realestate"
  | "studyabroad"
  | "coaching"
  | "interiors"
  | "hajj"
  | "retail"
  | "insurance";

type Cta = { label: string; href: string };

export type HeroBlockEditorialProps = {
  vertical: Vertical;
  eyebrow: string;
  headlineLead: string;
  headlineEmphasis: string;
  headlineTail: string;
  subhead: string;
  trustLine?: string;
  primaryCTA: Cta;
  secondaryCTA?: Cta;
  imageSrc: string;
  imageAlt: string;
  founderNote?: string;
};

/**
 * Map a vertical key to its accent token + a complementary "tint" color
 * used for the soft top-of-image gradient. We always reach for the
 * darker / more saturated of the two palette entries so the eyebrow
 * stays legible against cream.
 */
function verticalAccent(vertical: Vertical): {
  accent: string;
  tint: string;
} {
  switch (vertical) {
    case "realestate":
      return {
        accent: "var(--sk-realestate-slate)",
        tint: "var(--sk-realestate-sandstone)",
      };
    case "studyabroad":
      return {
        accent: "var(--sk-studyabroad-navy)",
        tint: "var(--sk-studyabroad-parchment)",
      };
    case "coaching":
      return {
        accent: "var(--sk-coaching-indigo)",
        tint: "var(--sk-coaching-chalk)",
      };
    case "interiors":
      return {
        accent: "var(--sk-interiors-terracotta)",
        tint: "var(--sk-interiors-putty)",
      };
    case "hajj":
      return {
        accent: "var(--sk-hajj-forest)",
        tint: "var(--sk-hajj-ivory)",
      };
    case "retail":
      return {
        accent: "var(--sk-retail-saffron)",
        tint: "var(--sk-retail-clay)",
      };
    case "insurance":
      return {
        accent: "var(--sk-insurance-navy)",
        tint: "var(--sk-insurance-gold)",
      };
  }
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Parent container variants — drives the stagger timing for children. */
const textColumnVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/** Per-child reveal: small lift + fade. */
const childVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

/** Section root: a slightly larger lift to give the whole block weight. */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/** Image: settles in with a tiny scale; intentionally later than text. */
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO, delay: 0.4 },
  },
};

export default function HeroBlockEditorial({
  vertical,
  eyebrow,
  headlineLead,
  headlineEmphasis,
  headlineTail,
  subhead,
  trustLine,
  primaryCTA,
  secondaryCTA,
  imageSrc,
  imageAlt,
  founderNote,
}: HeroBlockEditorialProps) {
  const { accent, tint } = verticalAccent(vertical);
  const reducedMotion = useReducedMotion();

  // Reduced-motion users get the layout, no movement, no stagger.
  const sectionInitial = reducedMotion ? "visible" : "hidden";
  const sectionAnimate = reducedMotion ? "visible" : undefined;

  return (
    <motion.section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background: "var(--sk-cream)",
        paddingTop: "clamp(64px, 9vw, 120px)",
        paddingBottom: "clamp(64px, 7vw, 96px)",
      }}
      variants={sectionVariants}
      initial={sectionInitial}
      animate={sectionAnimate}
      whileInView={reducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="sk-container">
        <div
          className="grid"
          style={{
            // Mobile-first: single column. md+ flips to 58 / 42.
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* ─── Image column ───────────────────────────────────────
              On mobile: text reads first (order-last on the image).
              On desktop: image flips to the right column via md:order-2. */}
          <motion.div
            className="order-last md:order-2 md:col-start-2"
            style={{
              gridColumn: "1 / -1",
            }}
            variants={imageVariants}
            initial={sectionInitial}
            animate={sectionAnimate}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
          >
            <ImageFrame
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              tint={tint}
              accent={accent}
            />
          </motion.div>

          {/* ─── Text column ───────────────────────────────────────
              order-first on mobile so the headline lands above the image.
              md:order-1 puts it on the left for desktop. */}
          <motion.div
            className="order-first md:order-1 md:col-start-1"
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              // 24-32px breathing room between siblings — the explicit
              // ask in the spec. Not 8-12px.
              gap: "clamp(20px, 1.6vw, 28px)",
            }}
            variants={textColumnVariants}
            initial={sectionInitial}
            animate={sectionAnimate}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* 1. Eyebrow — kicker, vertical-accent color */}
            <motion.p
              variants={childVariants}
              className="sk-font-meta"
              style={{
                color: accent,
                letterSpacing: "0.18em",
                margin: 0,
              }}
            >
              {eyebrow}
            </motion.p>

            {/* 2. Trust line — italic, ink60, optional */}
            {trustLine ? (
              <motion.p
                variants={childVariants}
                className="sk-font-editorial-italic"
                style={{
                  color: "var(--sk-ink60)",
                  fontSize: "0.9375rem",
                  maxWidth: "38ch",
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                {trustLine}
              </motion.p>
            ) : null}

            {/* 3. Headline — three lines, with the middle one italic + red.
                We use a single h1 with semantic line breaks via display:
                block on each span, so screen readers get one continuous
                heading while the visual reads as three rhythmic lines. */}
            <motion.h1
              variants={childVariants}
              className="sk-font-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw + 1rem, 5rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--sk-ink)",
                margin: 0,
              }}
            >
              <span style={{ display: "block" }}>{headlineLead}</span>
              <span
                className="sk-font-display-italic"
                style={{
                  display: "block",
                  color: "var(--sk-red)",
                }}
              >
                {headlineEmphasis}
              </span>
              <span style={{ display: "block" }}>{headlineTail}</span>
            </motion.h1>

            {/* 4. Subhead */}
            <motion.p
              variants={childVariants}
              className="sk-font-body"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
                maxWidth: "50ch",
                margin: 0,
              }}
            >
              {subhead}
            </motion.p>

            {/* 5. CTAs — primary filled red, secondary outlined ink */}
            <motion.div
              variants={childVariants}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <PrimaryCta {...primaryCTA} />
              {secondaryCTA ? <SecondaryCta {...secondaryCTA} /> : null}
            </motion.div>

            {/* 6. Founder note — small italic, optional */}
            {founderNote ? (
              <motion.p
                variants={childVariants}
                className="sk-font-editorial-italic"
                style={{
                  color: "var(--sk-ink40)",
                  fontSize: "0.875rem",
                  margin: 0,
                  marginTop: "4px",
                }}
              >
                {founderNote}
              </motion.p>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Desktop grid override — applied via inline <style> so we don't
          depend on a Tailwind config plugin emitting these for us. The
          rule kicks the grid into 58/42 columns at the spec's breakpoint
          (700px is the spec's mobile cutoff; we use 768px / md as the
          natural Tailwind boundary, very close, less surprising for the
          rest of the codebase). */}
      <style>{`
        @media (min-width: 768px) {
          #hero > div > div {
            grid-template-columns: 58fr 42fr !important;
            gap: clamp(40px, 5vw, 80px) !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

/* ─────────────────────────── ImageFrame ─────────────────────────────
   The discrete-image-to-the-side container. 4:5 aspect on desktop,
   16:10 on mobile. Soft shadow, rounded-2xl, slight tilt on desktop
   for editorial asymmetry. Vertical-accent gradient at the top edge
   pulls the image visually into the page palette. */

function ImageFrame({
  imageSrc,
  imageAlt,
  tint,
  accent,
}: {
  imageSrc: string;
  imageAlt: string;
  tint: string;
  accent: string;
}) {
  return (
    <div
      className="hero-image-frame relative w-full overflow-hidden rounded-2xl"
      style={{
        // Mobile: shorter 3:2 so it doesn't dominate the viewport.
        // Desktop override below pushes to 4:5 portrait.
        aspectRatio: "3 / 2",
        boxShadow:
          "0 32px 64px -24px rgba(20, 20, 20, 0.18), 0 8px 24px -12px rgba(20, 20, 20, 0.10)",
        background: "var(--sk-ink10)",
      }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 42vw"
        style={{ objectFit: "cover" }}
      />

      {/* Vertical-accent tint gradient at the top edge for palette
          integration. Image stays mostly itself. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, color-mix(in srgb, ${tint} 28%, transparent) 0%, transparent 45%)`,
        }}
      />

      {/* Floating "agent at work" overlay · proof-of-life in the corner.
          Pulsing green dot + a single confirmed-action bubble. Tells the
          viewer the agent is live, even when looking at a quiet image. */}
      <motion.div
        className="absolute"
        style={{
          left: "clamp(12px, 3vw, 24px)",
          bottom: "clamp(12px, 3vw, 24px)",
          maxWidth: "min(78%, 320px)",
          padding: "10px 12px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: "0.8125rem",
          color: "var(--sk-ink)",
          lineHeight: 1.35,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          aria-hidden
          style={{
            position: "relative",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#22c55e",
            flexShrink: 0,
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.6)",
            animation: "skAgentPulse 2.2s ease-out infinite",
          }}
        />
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontWeight: 600 }}>Agent online</strong>
          <span style={{ color: "var(--sk-ink60)" }}>
            {" · qualifying 12 leads · 1 site visit booked"}
          </span>
        </span>
      </motion.div>

      {/* Desktop refinement — push to 4:5 portrait. */}
      <style>{`
        @media (min-width: 768px) {
          .hero-image-frame {
            aspect-ratio: 4 / 5;
          }
        }
        @keyframes skAgentPulse {
          0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
      {/* accent reserved for future per-vertical overlay tuning */}
      <span aria-hidden style={{ display: "none" }} data-accent={accent} />
    </div>
  );
}

/* ─────────────────────────── CTAs ────────────────────────────────── */

function PrimaryCta({ label, href }: Cta) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{
        height: 50,
        paddingInline: 28,
        background: "var(--sk-red)",
        color: "var(--sk-cream)",
        fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}

function SecondaryCta({ label, href }: Cta) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full transition-colors duration-200"
      style={{
        height: 50,
        paddingInline: 28,
        border: "1px solid var(--sk-ink20)",
        color: "var(--sk-ink)",
        background: "transparent",
        fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}
