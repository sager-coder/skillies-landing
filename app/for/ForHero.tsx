"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BigStatTicker from "@/components/skillies/BigStatTicker";

/**
 * ForHero · v6 New Stat UI.
 * Replaced the single stat card with a 'Metric Pillar' system.
 * This is more robust against text overflow and feels more premium.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── Typed code line ──────────────────── */

type Token = {
  text: string;
  color?: string;
  italic?: boolean;
};

const CODE_TOKENS: Token[] = [
  { text: "> ", color: "var(--sk-red)" },
  { text: "skillies" },
  { text: "." },
  { text: "deploy", color: "var(--sk-red)" },
  { text: "({ vertical: " },
  { text: "\"_your_pick_\"", color: "var(--sk-ochre)", italic: true },
  { text: ", language: " },
  { text: "\"Mal+Eng\"", color: "var(--sk-ochre)" },
  { text: ", memory: " },
  { text: "\"lifelong\"", color: "var(--sk-ochre)" },
  { text: " })" },
];

function TypedCodeLine() {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const total = CODE_TOKENS.reduce((acc, t) => acc + t.text.length, 0);
  const [chars, setChars] = useState<number>(reducedMotion ? total : 0);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    let i = 0;
    const tick = () => {
      i += 1;
      setChars(i);
      if (i < total) window.setTimeout(tick, 18);
    };
    const start = window.setTimeout(tick, 500);
    return () => window.clearTimeout(start);
  }, [inView, reducedMotion, total]);

  let currentChars = chars;
  const visible = CODE_TOKENS.reduce((acc, t) => {
    if (currentChars <= 0) return acc;
    const sliceLen = Math.min(t.text.length, currentChars);
    acc.push({ ...t, text: t.text.slice(0, sliceLen) });
    currentChars -= sliceLen;
    return acc;
  }, [] as Token[]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
      className="mt-10 p-5 md:p-6 rounded-2xl border border-sk-hairline bg-white/40 backdrop-blur-md shadow-sm font-mono text-[12px] md:text-[13px] leading-relaxed max-w-xl"
    >
      {visible.map((t, i) => (
        <span key={i} style={{ color: t.color ?? "var(--sk-ink)", fontStyle: t.italic ? "italic" : "normal" }}>
          {t.text}
        </span>
      ))}
      <span className="inline-block ml-1 text-sk-red animate-pulse">▍</span>
    </motion.div>
  );
}

/* ─────────────────────────── Metric Pillars ─────────────────── */

const STATS = [
  { value: 7, label: "verticals active", prefix: "" },
  { value: 16, label: "agents online", prefix: "" },
  { value: 2400, label: "convos this hour", prefix: "~" },
];

function MetricPillars() {
  return (
    <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: EASE_OUT_EXPO }}
          className="flex-1 min-w-[140px] p-6 md:p-8 rounded-[2rem] bg-white border border-sk-hairline shadow-[0_30px_60px_-15px_rgba(20,20,20,0.06)] group hover:scale-[1.05] transition-transform duration-500"
        >
          <div className="sk-font-display text-[32px] md:text-[36px] font-black tracking-tighter text-sk-ink leading-none group-hover:text-sk-red transition-colors duration-300">
            <BigStatTicker to={s.value} format="comma" prefix={s.prefix} />
          </div>
          <div className="sk-font-meta mt-4 text-[10px] text-sk-ink40 font-black uppercase tracking-[0.12em] leading-tight">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Section ──────────────────────────── */

export default function ForHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="sk-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Messaging */}
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sk-red/10 bg-sk-red/[0.04] mb-8"
            >
              <span className="text-[10.5px] font-bold tracking-[0.12em] text-sk-red uppercase flex items-center gap-1.5">
                <span className="text-sm">▍</span> PICK YOUR VERTICAL
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="sk-font-display text-sk-ink sk-text-balance"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Skillies for <br />
              <span className="sk-font-display-italic text-sk-red">your business.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="sk-font-body mt-10 text-sk-ink60"
              style={{ fontSize: "1.25rem", lineHeight: 1.5, maxWidth: "45ch" }}
            >
              Seven vertical-specific AI sales workers. Pick the one closest 
              to your business &mdash; each has its own pain, demo, and price.
            </motion.p>

            <TypedCodeLine />
          </div>

          {/* Right Side: Stats (New Pillars UI) */}
          <div className="relative w-full lg:pl-12">
            <MetricPillars />
            
            {/* Subtle atmospheric glow behind stats */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sk-red/[0.04] blur-[100px] -z-10 pointer-events-none rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
