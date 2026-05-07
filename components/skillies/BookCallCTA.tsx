"use client";

/**
 * BookCallCTA · the "Talk to Ehsan" / closing CTA.
 * 
 * Visual uplift (v4):
 *  - Wrapped in a premium glass card for emphasis.
 *  - Refined typography and spacing.
 *  - Shimmering CTA button.
 *  - Improved editorial typography for the headline.
 *  - Staggered smooth animations for high-impact reveal.
 */

import Link from "next/link";
import { motion } from "framer-motion";

export type BookCallCTAProps = {
  heading: string;
  note: string;
  calHref?: string;
  verticalLabel?: string;
  variant?: "default" | "soft";
  manglishLine?: string;
};

const DEFAULT_CAL = "https://cal.com/sager-zmd4kl/30min";

const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
};

export default function BookCallCTA({
  heading,
  note,
  calHref = DEFAULT_CAL,
  verticalLabel,
  variant = "default",
  manglishLine,
}: BookCallCTAProps) {
  const calWithVertical = verticalLabel
    ? `${calHref}?notes=${encodeURIComponent("Vertical · " + verticalLabel)}`
    : calHref;

  const renderHeading = () => {
    if (heading.includes(". ")) {
      return heading.split(". ").map((s, i) => (
        <span key={i} className={`block ${i === 1 ? "sk-font-display-italic text-sk-red" : "sk-font-display"}`}>
          {s}{i === 0 ? "." : ""}
        </span>
      ));
    }
    
    if (heading.startsWith("Skillies for ")) {
      const part1 = "Skillies for";
      const part2 = heading.replace("Skillies for ", "");
      return (
        <>
          <span className="sk-font-display block">{part1}</span>
          <span className="sk-font-display-italic text-sk-red block">{part2}</span>
        </>
      );
    }

    return <span className="sk-font-display block">{heading}</span>;
  };

  return (
    <section className="sk-section sk-grain">
      <div className="sk-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[850px] text-center sk-glass rounded-[3.5rem] p-12 md:p-24 border border-sk-hairline shadow-[0_60px_100px_rgba(20,20,20,0.1)] relative overflow-hidden will-change-transform"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(217,52,43,0.05) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,160,107,0.06) 0%, transparent 70%)" }} />

          <motion.p 
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.1 }}
            className="sk-font-meta text-sk-red mb-8 font-black tracking-[0.2em] uppercase text-[10px]"
          >
            {variant === "soft" ? "A Conversation, Not a Sales Call" : "The Last Step"}
          </motion.p>
          
          <motion.h2
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.2 }}
            className="sk-text-balance"
            style={{
              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
              color: "var(--sk-ink)",
              lineHeight: 1.0,
              maxWidth: "18ch",
              margin: "0 auto",
            }}
          >
            {renderHeading()}
          </motion.h2>

          <motion.p
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.3 }}
            className="sk-font-body mt-10 max-w-[52ch] mx-auto text-sk-ink60"
            style={{ fontSize: "1.15rem", lineHeight: 1.6 }}
          >
            {note}
          </motion.p>

          {manglishLine && (
            <motion.p 
              {...FADE_UP}
              transition={{ ...FADE_UP.transition, delay: 0.4 }}
              className="font-ml mt-6 text-sk-ink40 font-medium italic opacity-70"
            >
              {manglishLine}
            </motion.p>
          )}
          
          <motion.div 
            {...FADE_UP}
            transition={{ ...FADE_UP.transition, delay: 0.5 }}
            className="mt-14"
          >
            <Link
              href={calWithVertical}
              target="_blank"
              rel="noreferrer"
              className="sk-shimmer group relative inline-flex min-h-[4rem] items-center justify-center rounded-full px-8 md:px-12 py-4 text-[15px] md:text-[16px] font-bold tracking-tight transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_20px_50px_rgba(217,52,43,0.3)] active:scale-[0.98] text-center"
              style={{
                background: variant === "soft" ? "var(--sk-ink)" : "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              <span className="flex items-center gap-3">
                Book a 30-min call with Ehsan
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <p className="sk-font-meta mt-10 text-[10px] text-sk-ink20 font-black tracking-[0.3em] uppercase">
              Free · 30 minutes · auto-confirmed
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
