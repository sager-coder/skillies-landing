"use client";

/**
 * HumansVsAgent · split-screen "Same job. Different physics." comparison.
 * 
 * Visual uplift (v4):
 *  - Refined card styling with glassmorphism and soft shadows.
 *  - Better typography hierarchy and staggered reveals.
 *  - Modernized issue ticker and counter rows.
 */

import { useEffect, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

export type HumansVsAgentProps = {
  headline?: string;
  subhead?: string;
};

const DEFAULT_HEADLINE = "Same job. Different physics.";
const DEFAULT_SUBHEAD =
  "Hire 10 callers + 2 managers in Kerala for ~₹2.5 L/month. Or ship one agent that doesn't take leaves, doesn't make data-entry errors, and remembers every customer for life.";

const HUMAN_STATS: readonly string[] = [
  "10 callers + 2 managers",
  "4–6 weeks training per hire",
  "30–60% annual attrition",
  "9-to-7 working hours",
  "Weekends + festivals off",
  "Weekly sick days",
  "Errors compound silently",
];

const AGENT_STATS: readonly string[] = [
  "1 agent",
  "24 / 7 / 365",
  "0 attrition",
  "0 sick days",
  "Vision + voice + memory built-in",
  "Improves monthly",
  "IRDAI-compliant",
  "Scales with you",
];

const TICKER_ITEMS: readonly string[] = [
  "Caller called in sick — 47 messages backed up",
  "Manager left — onboarding 2 new hires",
  "Voice note in Mal — caller asked for help",
  "Customer waited 6 hrs for reply",
  "Wrong premium quoted — refund and apology",
];

function XIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sk-red/10 mt-0.5 flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M3 3L11 11M11 3L3 11" stroke="var(--sk-red)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sk-ink/5 mt-0.5 flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="var(--sk-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Counter({ to, inView, formatter }: { to: number; inView: boolean; formatter?: (n: number) => string }) {
  const value = useMotionValue(0);
  const display = useTransform(value, (latest) =>
    formatter ? formatter(latest) : Math.round(latest).toLocaleString("en-IN")
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1] as const,
    });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span>{display}</motion.span>;
}

export default function HumansVsAgent({
  headline = DEFAULT_HEADLINE,
  subhead = DEFAULT_SUBHEAD,
}: HumansVsAgentProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [tickerIndex, setTickerIndex] = useState(0);

  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 4500); // Slower interval for better performance
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const inrFormatter = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <section
      id="humans-vs-agent"
      ref={sectionRef}
      className="sk-section sk-grain overflow-hidden border-b border-sk-hairline"
      style={{ background: "var(--sk-cream)" }}
    >
      <div className="sk-container">
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sk-font-meta text-sk-red"
          >
            The Economics
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-display mt-4"
            style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)", lineHeight: 1.1 }}
          >
            {headline.split(". ").map((s, i) => (
              <span key={i} className={i === 1 ? "sk-font-display-italic text-sk-red block md:inline" : ""}>
                {s}{i === 0 ? ". " : ""}
              </span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-6"
            style={{ fontSize: "var(--sk-text-lead)", color: "var(--sk-ink60)", maxWidth: "60ch" }}
          >
            {subhead}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start gap-12 lg:gap-0">
          {/* LEFT — Without Skillies */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(217,52,43,0.08)] bg-white/40 border border-sk-red/10"
          >
            <p className="sk-font-meta text-sk-red font-bold mb-8">Without Skillies</p>
            <div className="sk-font-display text-sk-ink tabular-nums" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.9 }}>
              <Counter to={250000} inView={inView} formatter={inrFormatter} />
            </div>
            <p className="sk-font-meta mt-4 mb-10 text-sk-ink40 font-bold">/ month operating cost</p>

            <ul className="space-y-4">
              {HUMAN_STATS.map((stat, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="sk-font-body flex gap-4 text-sk-ink opacity-80"
                  style={{ fontSize: "1rem" }}
                >
                  <XIcon />
                  <span>{stat}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 p-6 bg-sk-red/5 rounded-2xl border border-sk-red/10 relative overflow-hidden min-h-[100px] flex flex-col justify-center">
              <p className="sk-font-meta text-[10px] text-sk-red font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sk-red animate-pulse" />
                Live Attrition Log
              </p>
              <AnimatePresence mode="wait">
                {!reducedMotion ? (
                  <motion.p
                    key={tickerIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="sk-font-body text-sm font-medium text-sk-red/80 italic will-change-transform"
                  >
                    &ldquo;{TICKER_ITEMS[tickerIndex]}&rdquo;
                  </motion.p>
                ) : (
                  <p className="sk-font-body text-sm font-medium text-sk-red/80 italic">
                    &ldquo;{TICKER_ITEMS[0]}&rdquo;
                  </p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:flex flex-col items-center justify-center px-12 self-stretch">
            <div className="w-[1px] flex-1 bg-sk-hairline opacity-50" />
            <span className="sk-font-meta my-8 text-sk-ink20 font-black">VS</span>
            <div className="w-[1px] flex-1 bg-sk-hairline opacity-50" />
          </div>

          {/* RIGHT — With Skillies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(20,20,20,0.05)] bg-white border border-sk-ink/5"
          >
            <p className="sk-font-meta text-sk-ink font-bold mb-8">With Skillies</p>
            <div className="sk-font-display text-sk-ink tabular-nums" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.9 }}>
              <Counter to={155000} inView={inView} formatter={inrFormatter} />
            </div>
            <p className="sk-font-meta mt-4 mb-10 text-sk-ink40 font-bold">/ month all-in (Pro tier)</p>

            <ul className="space-y-4">
              {AGENT_STATS.map((stat, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="sk-font-body flex gap-4 text-sk-ink"
                  style={{ fontSize: "1rem" }}
                >
                  <CheckIcon />
                  <span>{stat}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 space-y-4 p-6 sk-glass rounded-2xl">
              <CounterRow label="Conversations handled" value={47892} inView={inView} />
              <CounterRow label="Customers remembered" value={12847} inView={inView} />
              <CounterRow label="Languages supported" value={5} inView={inView} />
            </div>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 md:mt-32 text-center max-w-2xl mx-auto"
        >
          <blockquote className="sk-font-display-italic text-2xl md:text-3xl text-sk-ink leading-tight">
            &ldquo;You won&rsquo;t replace your team. You&rsquo;ll free them to do work humans actually do well.&rdquo;
          </blockquote>
          <footer className="sk-font-meta mt-6 text-sk-ink40 font-bold uppercase tracking-widest">
            &mdash; Ehsan, founder &middot; Skillies.ai
          </footer>
        </motion.div>
      </div>
    </section>
  );
}

function CounterRow({ label, value, inView }: { label: string; value: number; inView: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4 border-b border-sk-hairline pb-3 last:border-0 last:pb-0">
      <span className="sk-font-body text-sm text-sk-ink60">{label}</span>
      <span className="sk-font-display text-lg text-sk-ink">
        <Counter to={value} inView={inView} />
      </span>
    </div>
  );
}
