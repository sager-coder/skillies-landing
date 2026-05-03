"use client";

/**
 * VerticalAgentGrid · the motion-rich /for/ chooser grid.
 *
 * Replaces the visual role of `components/design/VerticalGrid.tsx` on the
 * /for/ landing page only — the homepage still uses the calmer original.
 *
 * Each of the 7 vertical cards reads like a live agent panel:
 *   - left-edge accent ribbon (per-vertical token)
 *   - eyebrow kicker in accent color
 *   - title (display serif, modest clamp)
 *   - live status row (pulsing dot + conversations/day)
 *   - pain copy (re-used verbatim from the original VerticalGrid)
 *   - terminal-style "agent activity" line that types out on hover
 *     (and cycles slowly when the card is idle)
 *
 * Motion respects `prefers-reduced-motion` via Framer's `useReducedMotion`.
 * Per-card hover state lives in local component state, not in CSS, so the
 * typing line can re-animate from scratch every time the user mouses in.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────── Data model ───────────────────────── */

type VerticalEntry = {
  /** /for/<slug> destination */
  href: string;
  /** Display title (HTML allowed for the existing `&amp;`s) */
  title: string;
  /** Pain line — re-used verbatim from the original VerticalGrid */
  pain: string;
  /** Eyebrow / kicker text */
  eyebrow: string;
  /** Primary accent CSS variable (drives ribbon + dot + eyebrow) */
  accent: string;
  /** Lighter neutral CSS variable (drives subtle card tint) */
  accentLight: string;
  /** Conversations / day for the live-status row */
  conversations: number;
  /** Single agent-activity line that types out on hover */
  activity: string;
};

const VERTICALS: ReadonlyArray<VerticalEntry> = [
  {
    href: "/for/real-estate",
    title: "Skillies for Real Estate",
    pain: "78% of buyers go with whoever replies first. Your team replies in 4 hours. Skillies replies in 4 seconds.",
    eyebrow: "DEVELOPERS · BROKERS",
    accent: "var(--sk-realestate-slate)",
    accentLight: "var(--sk-realestate-sandstone)",
    conversations: 1200,
    activity: "tool: book_site_visit",
  },
  {
    href: "/for/hajj",
    title: "Skillies for Hajj &amp; Umrah",
    pain: "Malayalam voice notes from older pilgrims at 1 a.m. The owner is in Makkah. Skillies replies before fajr.",
    eyebrow: "PILGRIMAGE OPERATORS",
    accent: "var(--sk-hajj-forest)",
    accentLight: "var(--sk-hajj-ivory)",
    conversations: 340,
    activity: "lang: ml-IN · transcribed",
  },
  {
    href: "/for/study-abroad",
    title: "Skillies for Study Abroad",
    pain: "A student inquires in February, converts in October. Counsellor change in between? Skillies remembers everything.",
    eyebrow: "CONSULTANTS · COUNSELLORS",
    accent: "var(--sk-studyabroad-navy)",
    accentLight: "var(--sk-studyabroad-parchment)",
    conversations: 540,
    activity: "memory: 8-month-thread recalled",
  },
  {
    href: "/for/coaching",
    title: "Skillies for Coaching Institutes",
    pain: "Result day — 5,000 parents in 48 hours, in 4 languages. Counsellors burn out. Skillies books every demo.",
    eyebrow: "INSTITUTES · BATCHES",
    accent: "var(--sk-coaching-indigo)",
    accentLight: "var(--sk-coaching-chalk)",
    conversations: 920,
    activity: "intent: result-day-parent",
  },
  {
    href: "/for/interiors",
    title: "Skillies for Modular Kitchen",
    pain: "Customer sends a kitchen photo at midnight. Skillies suggests three rendered options and a booked visit.",
    eyebrow: "STUDIOS · DESIGNERS",
    accent: "var(--sk-interiors-terracotta)",
    accentLight: "var(--sk-interiors-putty)",
    conversations: 410,
    activity: "vision: kitchen-photo received",
  },
  {
    href: "/for/retail",
    title: "Skillies for Retail &amp; Kirana",
    pain: "Saturday rush — 8 WhatsApp orders missed. They go next door. Skillies takes orders 24/7 in your language.",
    eyebrow: "STORES · SALONS · GYMS",
    accent: "var(--sk-retail-saffron)",
    accentLight: "var(--sk-retail-clay)",
    conversations: 680,
    activity: "tool: capture_order",
  },
  {
    href: "/for/insurance",
    title: "Skillies for Insurance",
    pain: "Diabetic father at 11 PM, IRDAI compliance, premium fear. Skillies answers calmly, in Malayalam, with carrier-specific facts.",
    eyebrow: "BROKERS · AGENTS",
    accent: "var(--sk-insurance-navy)",
    accentLight: "var(--sk-insurance-gold)",
    conversations: 1850,
    activity: "intent: serious-buyer",
  },
];

/* ─────────────────────────── Sub-components ───────────────────── */

type TypingLineProps = {
  /** The text to type out */
  text: string;
  /** Whether the typing animation should run; falls back to full text when false */
  active: boolean;
  /** Approx ms per character (lower = faster) */
  speedMs?: number;
  /** Reuse for both hover and idle cycle */
  cycleKey?: string | number;
  /** Reduced-motion users see the full string immediately */
  reducedMotion: boolean;
  /** Color of the prefix (`>`) */
  promptColor: string;
};

function TypingLine({
  text,
  active,
  speedMs = 28,
  cycleKey,
  reducedMotion,
  promptColor,
}: TypingLineProps) {
  const [shown, setShown] = useState<string>(reducedMotion || !active ? text : "");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (reducedMotion || !active) {
      // Defer the synchronous reset out of the effect body so we don't
      // trigger a cascading render in the same commit.
      const id = window.setTimeout(() => setShown(text), 0);
      return () => window.clearTimeout(id);
    }
    let i = 0;
    const tick = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        timerRef.current = window.setTimeout(tick, speedMs);
      } else {
        timerRef.current = null;
      }
    };
    // Kick off after a brief delay; first tick advances from 0 → 1 char.
    const reset = window.setTimeout(() => {
      setShown("");
      timerRef.current = window.setTimeout(tick, speedMs);
    }, 0);
    return () => {
      window.clearTimeout(reset);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, active, speedMs, cycleKey, reducedMotion]);

  return (
    <span
      className="font-mono"
      style={{
        fontSize: "0.75rem",
        color: "var(--sk-ink60)",
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
        maxWidth: "100%",
      }}
    >
      <span style={{ color: promptColor, marginRight: "0.4em" }}>{">"}</span>
      {shown}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.55ch",
          marginLeft: "0.15em",
          color: promptColor,
          opacity: 0.85,
          animation: reducedMotion ? "none" : "sk-vag-blink 1.05s steps(2, start) infinite",
        }}
      >
        |
      </span>
    </span>
  );
}

type AgentCardProps = {
  vertical: VerticalEntry;
  /** Per-card initial idle delay so the cycle starts feel un-synced */
  idleDelayMs: number;
};

function AgentCard({ vertical, idleDelayMs }: AgentCardProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState<boolean>(false);
  const [cycleKey, setCycleKey] = useState<number>(0);

  // Idle cycle: gently re-trigger the typing line every ~6.8s when the
  // card isn't being hovered, so the page feels alive even at rest.
  useEffect(() => {
    if (reducedMotion) return;
    if (hovered) return;
    const interval = window.setInterval(() => {
      setCycleKey((k) => k + 1);
    }, 6800);
    const initial = window.setTimeout(() => {
      setCycleKey((k) => k + 1);
    }, idleDelayMs);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(initial);
    };
  }, [reducedMotion, hovered, idleDelayMs]);

  const onEnter = useCallback(() => {
    setHovered(true);
    setCycleKey((k) => k + 1);
  }, []);
  const onLeave = useCallback(() => setHovered(false), []);

  return (
    <motion.div
      initial={false}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{ position: "relative", borderRadius: "1rem" }}
    >
      <Link
        href={vertical.href}
        className="group block h-full"
        style={{
          position: "relative",
          display: "block",
          padding: "1.75rem 1.75rem 1.5rem 2rem",
          borderRadius: "1rem",
          border: "1px solid var(--sk-hairline)",
          background: `color-mix(in srgb, ${vertical.accentLight} 9%, var(--sk-cream))`,
          overflow: "hidden",
          minHeight: "100%",
          textDecoration: "none",
          color: "inherit",
          transition: "border-color 240ms ease, box-shadow 240ms ease",
          boxShadow: hovered
            ? `0 14px 30px -22px ${vertical.accent}, 0 4px 12px -10px rgba(20,20,20,0.08)`
            : "0 1px 0 rgba(20,20,20,0.02)",
          borderColor: hovered ? vertical.accent : "var(--sk-hairline)",
        }}
        aria-label={vertical.title.replace("&amp;", "&")}
      >
        {/* Left-edge accent ribbon — thickens on hover. */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: hovered ? 8 : 5,
            background: vertical.accent,
            transition: "width 220ms ease",
          }}
        />

        {/* Eyebrow */}
        <p
          className="sk-font-meta"
          style={{
            color: vertical.accent,
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
          }}
        >
          {vertical.eyebrow}
        </p>

        {/* Title */}
        <h3
          className="sk-font-display mt-3"
          style={{
            fontSize: "clamp(1.5rem, 1vw + 1rem, 1.875rem)",
            color: "var(--sk-ink)",
            lineHeight: 1.08,
          }}
          dangerouslySetInnerHTML={{ __html: vertical.title }}
        />

        {/* Live status row — pulsing dot + conversations / day */}
        <div
          className="mt-3 flex items-center"
          style={{ gap: "0.55rem" }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 999,
              background: vertical.accent,
              boxShadow: `0 0 0 0 ${vertical.accent}`,
              animation: reducedMotion
                ? "none"
                : "sk-vag-pulse 1.9s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              flex: "0 0 auto",
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "var(--sk-ink60)",
              letterSpacing: "-0.005em",
            }}
          >
            Online ·{" "}
            <span style={{ color: "var(--sk-ink)", fontWeight: 500 }}>
              {vertical.conversations.toLocaleString("en-IN")}
            </span>{" "}
            conversations / day
          </span>
        </div>

        {/* Pain copy */}
        <p
          className="sk-font-body mt-4"
          style={{
            fontSize: "0.9375rem",
            color: "var(--sk-ink60)",
            lineHeight: 1.55,
          }}
        >
          {vertical.pain}
        </p>

        {/* Bottom row — explore arrow only (live-chat preview removed) */}
        <div
          className="mt-5 flex items-center justify-end"
          style={{
            paddingTop: "0.85rem",
            borderTop: "1px dashed var(--sk-hairline)",
          }}
        >
          <span
            className="sk-font-meta"
            style={{
              fontSize: "0.75rem",
              color: vertical.accent,
              fontWeight: 600,
              letterSpacing: "0.08em",
              transform: hovered ? "translateX(2px)" : "translateX(0)",
              transition: "transform 220ms ease",
            }}
          >
            EXPLORE →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────── Top-level grid ───────────────────── */

export default function VerticalAgentGrid() {
  // Stable per-card delay seeds so idle typing doesn't synchronize.
  const idleDelays = useMemo<number[]>(
    () => VERTICALS.map((_, i) => 800 + i * 420),
    [],
  );

  return (
    <section
      className="sk-section"
      style={{ background: "var(--cream-dark)", paddingTop: "4rem" }}
    >
      {/* Local keyframes for the pulsing dot + cursor blink. Scoped to
          this component so we don't have to touch globals.css. */}
      <style>{`
        @keyframes sk-vag-pulse {
          0%   { box-shadow: 0 0 0 0   currentColor; opacity: 1; }
          70%  { box-shadow: 0 0 0 10px transparent;  opacity: 0.85; }
          100% { box-shadow: 0 0 0 0   transparent;  opacity: 1; }
        }
        @keyframes sk-vag-blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sk-vag-card-anim { transition: none !important; }
        }
      `}</style>

      <div className="sk-container">
        <div className="mb-10 max-w-[640px]">
          <p
            className="sk-font-meta mb-3"
            style={{ color: "var(--sk-ink60)" }}
          >
            ONE PRODUCT · SEVEN WORKERS
          </p>
          <h2
            className="sk-font-section"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
              lineHeight: 1.06,
              letterSpacing: "-0.018em",
            }}
          >
            Pick the agent closest{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              to your business
            </span>
            .
          </h2>
          <p
            className="sk-font-body mt-3 max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            Each card is a live worker — its own pain, its own demo, its
            own pricing. Click in.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            alignItems: "stretch",
          }}
        >
          {VERTICALS.map((v, i) => (
            <AgentCard
              key={v.href}
              vertical={v}
              idleDelayMs={idleDelays[i] ?? 1200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
