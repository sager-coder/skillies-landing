"use client";

/**
 * HeroBlockV2 — the post-pivot homepage hero.
 *
 * Replaces the static editorial HeroBlock with an alive, motion-rich entry:
 *  - Two-line headline ("Tools don't sell. / Workers do.") with a scale-in
 *    cubic ease on the italic red second line.
 *  - Animated metric ticker (4 stats, count-up on mount) that reframes the
 *    pitch as "what one worker absorbs" rather than "tools you assemble".
 *  - Cream background with a subtle ochre/red radial wash, anchored to the
 *    upper-left so it doesn't fight the headline.
 *
 * No props — this is the singular homepage hero. Hardcoded copy is
 * intentional; if we ever need a second instance, lift to props then.
 */

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Metric = {
  /** Final value the counter lands on. */
  value: number;
  /** Caption shown beneath the number. */
  label: string;
  /** Optional suffix (e.g. "+" or "/wk"). Numbers stay clean without one. */
  suffix?: string;
};

const METRICS: Metric[] = [
  { value: 6250, label: "Inbound conversations / month" },
  { value: 5, label: "Indic languages supported" },
  { value: 168, label: "Hours worked / week" },
  { value: 12, label: "Hires you avoid" },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function HeroBlockV2() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--sk-cream)" }}
    >
      {/* Ambient gradient — radial ochre→red wash, low opacity, top-left bias.
          Pointer-events:none so it never intercepts CTA clicks. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 18% 22%, rgba(201, 160, 107, 0.22), transparent 65%),
            radial-gradient(ellipse 55% 45% at 82% 8%, rgba(217, 52, 43, 0.14), transparent 60%)
          `,
        }}
      />

      <div className="sk-container pt-24 pb-16 md:pt-36 md:pb-24">
        <Headline />
        <Subhead />
        <Ctas />
        <MetricTicker />
      </div>
    </section>
  );
}

/* ─────────────────────────── Headline ─────────────────────────── */

function Headline() {
  return (
    <h1
      className="sk-font-display max-w-[18ch]"
      style={{
        fontSize: "var(--sk-text-display)",
        color: "var(--sk-ink)",
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        style={{ display: "block" }}
      >
        Tools don&rsquo;t sell.
      </motion.span>
      <motion.span
        className="sk-font-display-italic"
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.85,
          ease: EASE_OUT_EXPO,
          delay: 0.25,
        }}
        style={{
          display: "block",
          color: "var(--sk-red)",
          transformOrigin: "left center",
        }}
      >
        Workers do.
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────── Subhead ──────────────────────────── */

function Subhead() {
  return (
    <motion.p
      className="sk-font-body mt-7 max-w-[60ch]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.55 }}
      style={{
        fontSize: "var(--sk-text-lead)",
        color: "var(--sk-ink60)",
      }}
    >
      An AI sales worker for your business — handles every inbound DM in 5
      Indic languages, 24/7, with memory, vision, and zero attrition. From{" "}
      <span style={{ color: "var(--sk-ink)", fontWeight: 500 }}>
        &#8377;30,000/mo
      </span>
      .
    </motion.p>
  );
}

/* ──────────────────────────── CTAs ────────────────────────────── */

function Ctas() {
  return (
    <motion.div
      className="mt-10 flex flex-wrap gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.7 }}
    >
      <a
        href="#agent-in-action"
        className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
        style={{
          background: "var(--sk-red)",
          color: "var(--sk-cream)",
          letterSpacing: "-0.005em",
        }}
      >
        See it in action <span aria-hidden className="ml-1.5">&darr;</span>
      </a>
      <a
        href="https://cal.com/sager-zmd4kl/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-colors duration-200"
        style={{
          border: "1px solid var(--sk-ink20)",
          color: "var(--sk-ink)",
        }}
      >
        Book a 30-min call
      </a>
    </motion.div>
  );
}

/* ─────────────────────── Metric ticker ────────────────────────── */

function MetricTicker() {
  return (
    <motion.div
      className="mt-16 md:mt-20"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.85 }}
    >
      <div
        className="grid gap-x-8 gap-y-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          borderTop: "1px solid var(--sk-hairline)",
          paddingTop: "2.25rem",
        }}
      >
        {METRICS.map((m, i) => (
          <MetricCell
            key={m.label}
            metric={m}
            // Cascade each cell's count-up so they don't all spike together.
            delay={0.95 + i * 0.12}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MetricCell({ metric, delay }: { metric: Metric; delay: number }) {
  const reduced = useReducedMotion();
  // Initialize with target so SSR / no-JS / crawlers see the real number.
  // After mount we briefly reset to 0 and animate up — SSR snapshot stays correct.
  const [display, setDisplay] = useState(metric.value);

  useEffect(() => {
    if (reduced) return; // Reduced-motion users keep the static target.
    setDisplay(0);
    const controls = animate(0, metric.value, {
      duration: 1.8,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [metric.value, delay, reduced]);

  // Round during the tween — fractional pixels in giant numerals look noisy.
  const formatted = Math.round(display).toLocaleString("en-IN");

  return (
    <div className="flex flex-col">
      <span
        className="sk-font-display tabular-nums"
        style={{
          fontSize: "clamp(2.5rem, 4vw + 0.5rem, 4rem)",
          color: "var(--sk-ink)",
          lineHeight: 1,
        }}
      >
        {formatted}
        {metric.suffix ?? ""}
      </span>
      <span
        className="sk-font-body mt-3"
        style={{
          fontSize: "0.9375rem",
          color: "var(--sk-ink60)",
          letterSpacing: "-0.005em",
          maxWidth: "22ch",
        }}
      >
        {metric.label}
      </span>
    </div>
  );
}
