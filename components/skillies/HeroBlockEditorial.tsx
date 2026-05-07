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
      className="sk-section border-b border-sk-hairline overflow-hidden"
      style={{
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
              vertical={vertical}
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

/* Per-vertical chat content for the phone mockup. Each scenario is
   short on purpose — the hero visual reads in 2-3 seconds, not 10. */
const VERTICAL_CHAT: Record<
  Vertical,
  { contactName: string; messages: { from: "buyer" | "agent"; text: string }[] }
> = {
  realestate: {
    contactName: "Skillies · Real Estate",
    messages: [
      { from: "buyer", text: "Saw the Ocean Heights ad. 3BHK still available?" },
      { from: "agent", text: "Yes — Tower B, 4 units left. ₹2.34 Cr all-in. Site visit Saturday 11am?" },
      { from: "buyer", text: "Book it." },
    ],
  },
  studyabroad: {
    contactName: "Skillies · Study Abroad",
    messages: [
      { from: "buyer", text: "MS in Canada Fall 2026 — 7.5 IELTS, 6.8 GPA. Realistic?" },
      { from: "agent", text: "Solid profile. McMaster, Concordia, Carleton all in range. Sending shortlist." },
      { from: "buyer", text: "Counsellor call this week?" },
    ],
  },
  coaching: {
    contactName: "Skillies · Coaching",
    messages: [
      { from: "buyer", text: "NEET batch — son scored 580 in mock. Hostel?" },
      { from: "agent", text: "Top 600 batch fits. Hostel + mess ₹1.4L/yr. Demo class Saturday 10am?" },
      { from: "buyer", text: "Yes. Both of us coming." },
    ],
  },
  interiors: {
    contactName: "Skillies · Interiors",
    messages: [
      { from: "buyer", text: "[Photo] 2BHK Marathahalli — quote for full kitchen?" },
      { from: "agent", text: "Got it. Standard ₹4.8L · Premium ₹7.2L. Designer site visit Sunday?" },
      { from: "buyer", text: "Sunday 11am works." },
    ],
  },
  hajj: {
    contactName: "Skillies · Hajj",
    messages: [
      { from: "buyer", text: "Family of 4. Mahram with my mother. Premium package?" },
      { from: "agent", text: "Premium 28-day · ₹3.95L pp · Madinah 5★ + Makkah Hilton. Document checklist sent." },
      { from: "buyer", text: "Reserve 4 seats." },
    ],
  },
  retail: {
    contactName: "Skillies · Retail",
    messages: [
      { from: "buyer", text: "Refill same as last month — 5kg basmati, 2L oil, sugar 2kg." },
      { from: "agent", text: "₹1,840 total. UPI link sent. Delivering by 6pm tomorrow." },
      { from: "buyer", text: "Paid." },
    ],
  },
  insurance: {
    contactName: "Skillies · Insurance",
    messages: [
      { from: "buyer", text: "Father 62, diabetic. Health cover possible?" },
      { from: "agent", text: "Niva Bupa Senior First — yes, with 2-year waiting period. ₹38,400/yr ₹10L cover." },
      { from: "buyer", text: "Send the proposal." },
    ],
  },
};

function ImageFrame({
  vertical,
  tint,
  accent,
}: {
  vertical: Vertical;
  tint: string;
  accent: string;
}) {
  const chat = VERTICAL_CHAT[vertical];
  return (
    <div
      className="hero-image-frame relative w-full overflow-hidden rounded-[28px]"
      style={{
        // Mobile: 3:2 so it doesn't dominate the viewport.
        // Desktop override below pushes to 4:5 portrait.
        aspectRatio: "3 / 2",
        boxShadow:
          "0 32px 64px -24px rgba(20, 20, 20, 0.18), 0 8px 24px -12px rgba(20, 20, 20, 0.10)",
        background: `linear-gradient(135deg, color-mix(in srgb, ${tint} 35%, white), color-mix(in srgb, ${accent} 12%, white))`,
        padding: "clamp(14px, 2.5vw, 22px)",
      }}
    >
      {/* Inner phone screen */}
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[20px]"
        style={{
          background: "#FFFFFF",
          boxShadow: "inset 0 0 0 1px rgba(20, 20, 20, 0.08)",
        }}
      >
        {/* WhatsApp-style header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: accent,
            color: "#FFFFFF",
          }}
        >
          <div
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "rgba(255, 255, 255, 0.18)",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div className="flex flex-1 flex-col" style={{ minWidth: 0, lineHeight: 1.2 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {chat.contactName}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                opacity: 0.85,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  animation: "skAgentPulse 2.2s ease-out infinite",
                }}
              />
              online · replying instantly
            </span>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 20, 20, 0.02) 0%, rgba(20, 20, 20, 0.04) 100%)",
            padding: "clamp(10px, 2vw, 16px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(6px, 1.2vw, 10px)",
          }}
        >
          {chat.messages.map((msg, i) => {
            const isBuyer = msg.from === "buyer";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.7 + i * 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  alignSelf: isBuyer ? "flex-end" : "flex-start",
                  maxWidth: "84%",
                  padding: "8px 11px",
                  borderRadius: 12,
                  background: isBuyer ? "#dcf8c6" : "#FFFFFF",
                  color: "var(--sk-ink)",
                  fontSize: "0.8125rem",
                  lineHeight: 1.4,
                  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.06)",
                }}
              >
                {msg.text}
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.7 + chat.messages.length * 0.55,
            }}
            style={{
              alignSelf: "flex-start",
              padding: "8px 12px",
              borderRadius: 12,
              background: "#FFFFFF",
              boxShadow: "0 1px 1px rgba(0, 0, 0, 0.06)",
              display: "inline-flex",
              gap: 4,
            }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--sk-ink40)",
                  display: "inline-block",
                  animation: `skTypingDot 1.4s ${d * 0.16}s ease-in-out infinite`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating "agent at work" stat pill — sits over the phone for proof of scale */}
      <motion.div
        className="absolute"
        style={{
          right: "clamp(8px, 2vw, 18px)",
          top: "clamp(8px, 2vw, 18px)",
          padding: "6px 10px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 6px 16px -8px rgba(0, 0, 0, 0.18)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "var(--sk-ink)",
        }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            animation: "skAgentPulse 2.2s ease-out infinite",
          }}
        />
        <span>1,247 conversations now</span>
      </motion.div>

      <style>{`
        @media (min-width: 768px) {
          .hero-image-frame {
            aspect-ratio: 4 / 5;
          }
        }
        @keyframes skAgentPulse {
          0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes skTypingDot {
          0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
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
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
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
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}
