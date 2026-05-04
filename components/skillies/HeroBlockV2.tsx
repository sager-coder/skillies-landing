"use client";

/**
 * HeroBlockV2 — the post-pivot homepage hero.
 * 
 * Visual uplift (v4):
 *  - Animated mesh-gradient background for a premium feel.
 *  - Headline polish with text-wrap: balance and refined motion.
 *  - CTA buttons with sk-shimmer and hover scales.
 *  - Metric ticker with subtle separators and smoother count-up.
 */

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Metric = {
  value: number;
  label: string;
  suffix?: string;
};

const METRICS: Metric[] = [
  { value: 6250, label: "Inbound conversations / month" },
  { value: 5, label: "Indian languages supported" },
  { value: 168, label: "Hours worked / week" },
  { value: 0, label: "Days off, sick leaves, attrition" },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function HeroBlockV2() {
  return (
    <section
      id="hero"
      className="sk-grain relative isolate overflow-hidden border-b border-sk-hairline"
      style={{ background: "var(--sk-cream)" }}
    >
      {/* Animated Mesh Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full opacity-40 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--sk-ochre), transparent 70%)" }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full opacity-30 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--sk-red), transparent 70%)" }}
        />
      </div>

      <div className="sk-container pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl">
          <Headline />
          <Subhead />
          <Ctas />
        </div>
        <MetricTicker />
      </div>
    </section>
  );
}

function Headline() {
  return (
    <h1
      className="sk-font-display sk-text-balance"
      style={{
        fontSize: "var(--sk-text-display)",
        color: "var(--sk-ink)",
        lineHeight: 1.05,
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        style={{ display: "block" }}
      >
        Tools don&rsquo;t sell.
      </motion.span>
      <motion.span
        className="sk-font-display-italic relative"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: EASE_OUT_EXPO,
          delay: 0.3,
        }}
        style={{
          display: "block",
          color: "var(--sk-red)",
          transformOrigin: "left center",
        }}
      >
        Workers do.
        <motion.span 
          className="absolute -bottom-2 left-0 h-[3px] bg-sk-red opacity-20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
        />
      </motion.span>
    </h1>
  );
}

function Subhead() {
  return (
    <motion.p
      className="sk-font-body mt-8 max-w-[55ch] sk-text-balance"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.6 }}
      style={{
        fontSize: "var(--sk-text-lead)",
        color: "var(--sk-ink60)",
        lineHeight: 1.6,
      }}
    >
      Your business needs a closer, not just a chatbot. Skillies handles every inbound 
      DM in 5 Indic languages, 24/7, with memory, vision, and zero attrition. 
      Integrated and live from <span style={{ color: "var(--sk-ink)", fontWeight: 600 }}>&#8377;30,000/mo</span>.
    </motion.p>
  );
}

function Ctas() {
  return (
    <motion.div
      className="mt-12 flex flex-wrap gap-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.8 }}
    >
      <a
        href="#agent-in-action"
        className="sk-shimmer group relative inline-flex min-h-[3.5rem] items-center justify-center rounded-full px-8 py-3 text-[15px] md:text-[16px] font-semibold tracking-tight transition-all duration-300 hover:shadow-[0_12px_40px_rgba(217,52,43,0.3)] hover:scale-[1.03] active:scale-[0.98] text-center"
        style={{
          background: "var(--sk-red)",
          color: "var(--sk-cream)",
        }}
      >
        <span>See it in action</span>
        <motion.span 
          className="ml-2 inline-block"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          &darr;
        </motion.span>
      </a>
      <a
        href="https://cal.com/sager-zmd4kl/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="sk-glass group inline-flex min-h-[3.5rem] items-center justify-center rounded-full px-8 py-3 text-[15px] md:text-[16px] font-semibold tracking-tight transition-all duration-300 hover:bg-sk-ink hover:text-sk-cream hover:scale-[1.03] active:scale-[0.98] text-center"
        style={{
          color: "var(--sk-ink)",
        }}
      >
        Book a 30-min call
      </a>
    </motion.div>
  );
}

function MetricTicker() {
  return (
    <motion.div
      className="mt-24 md:mt-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1 }}
    >
      <div
        className="grid gap-x-12 gap-y-12"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          borderTop: "1px solid var(--sk-hairline)",
          paddingTop: "3rem",
        }}
      >
        {METRICS.map((m, i) => (
          <MetricCell
            key={m.label}
            metric={m}
            delay={1.2 + i * 0.15}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MetricCell({ metric, delay }: { metric: Metric; delay: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(metric.value);

  useEffect(() => {
    if (reduced) return;
    setDisplay(0);
    const controls = animate(0, metric.value, {
      duration: 2,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [metric.value, delay, reduced]);

  const formatted = Math.round(display).toLocaleString("en-IN");

  return (
    <div className="flex flex-col relative">
      {/* Subtle separator */}
      <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-sk-hairline hidden md:block opacity-50" />
      
      <span
        className="sk-font-display tabular-nums"
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          color: "var(--sk-ink)",
          lineHeight: 0.9,
          letterSpacing: "-0.03em",
        }}
      >
        {formatted}
        {metric.suffix ?? ""}
      </span>
      <span
        className="sk-font-meta mt-4 block"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "var(--sk-ink40)",
          maxWidth: "24ch",
        }}
      >
        {metric.label}
      </span>
    </div>
  );
}
