"use client";

/**
 * HeroBlockV2 — the post-pivot homepage hero.
 * 
 * Visual uplift:
 *  - Matches the editorial two-column layout from the reference.
 *  - Headline with inline color highlights.
 *  - Feature highlight row at the bottom of the content column.
 *  - Integrated AgentFunnel visual in the right column.
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AgentFunnel from "./AgentFunnel";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function HeroBlockV2() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <section 
      id="hero"
      className="relative min-h-[90vh] flex flex-col border-b border-sk-hairline" 
    >
      {/* ── Ambient Background Motion ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {/* Vibrant fluid red glows */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 120, 0],
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[90%] h-[90%] rounded-full bg-sk-red/8 blur-[140px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 60, -100, 0],
            scale: [1, 0.9, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-sk-ochre/5 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-sk-red/5 blur-[100px]"
        />
      </div>

      <div className="sk-container relative pt-24 pb-20 md:pt-28 lg:pt-32 md:pb-28">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[12vw] xl:gap-[15vw]">
          {/* Left Column: Messaging */}
          <div className="relative z-10 max-w-[640px]">
            <Eyebrow />
            <Headline />
            <Subhead />
            
            {/* ── Mobile-Optimized Flow (lg:hidden) ── */}
            <div className="lg:hidden mt-10 flex flex-col gap-6">
              {mounted && !isDesktop && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative -mx-6 py-4"
                >
                  <AgentFunnel />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
              >
                <BookDemoBtn />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
              >
                <SeeInActionBtn />
              </motion.div>
            </div>

            {/* ── Desktop CTA Row (lg:block) ── */}
            <div className="hidden lg:block">
              <Ctas />
            </div>

            <FeatureGrid />
          </div>

          {/* Right Column: Visual Funnel (Desktop Only) */}
          <div className="hidden lg:block relative w-full max-w-[850px] xl:max-w-[1000px] mx-auto lg:mx-0 mt-20 lg:mt-0">
            {mounted && isDesktop && (
              <div className="relative lg:-translate-x-32 lg:-translate-y-16 scale-[0.9] md:scale-110 lg:scale-[1.4] origin-center">
                <AgentFunnel />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-sk-red/10 bg-sk-red/[0.04] px-3.5 py-1.5"
    >
      <span className="text-[10px] md:text-[10.5px] font-bold tracking-[0.12em] text-sk-red flex items-center gap-1.5 uppercase">
        <span className="flex items-center gap-1 text-[12px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20" transform="rotate(45 12 12)" />
          </svg>
        </span>
        AI-Powered Sales Automation
      </span>
    </motion.div>
  );
}

function Headline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
      className="sk-font-display text-sk-ink sk-text-balance"
      style={{
        fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
        lineHeight: 0.95,
        fontWeight: 900,
        letterSpacing: "-0.04em",
      }}
    >
      Chatbots don&rsquo;t <br />
      <span className="text-sk-red">sell.</span> Skillies <span className="sk-font-display-italic text-sk-red">does.</span>
    </motion.h1>
  );
}

function Subhead() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
      className="sk-font-body mt-8 max-w-[48ch] text-sk-ink60"
      style={{ fontSize: "1.25rem", lineHeight: 1.5, fontWeight: 400 }}
    >
      Skillies AI handles your leads from first message to booked meeting &mdash;{" "}
      <span className="font-semibold text-sk-red">automatically</span>.
    </motion.p>
  );
}

function SeeInActionBtn() {
  return (
    <a
      href="https://wa.me/918089941131"
      target="_blank"
      rel="noopener noreferrer"
      className="sk-shimmer group relative inline-flex h-[3.75rem] w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-sk-red px-10 text-[15.5px] font-bold tracking-tight text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_20px_50px_rgba(217,52,43,0.3)] active:scale-[0.98]"
    >
      <span>See it in action</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

function BookDemoBtn() {
  return (
    <a
      href="https://cal.com/sager-zmd4kl/30min"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-[3.75rem] w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border-2 border-sk-ink/5 bg-white px-8 text-[15.5px] font-bold tracking-tight transition-all duration-300 hover:border-sk-ink/20 hover:bg-sk-ink/[0.02]"
      style={{ color: "var(--sk-ink)" }}
    >
      <span>Book a 30-min demo</span>
      <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">📅</span>
    </a>
  );
}

function Ctas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
      className="mt-12 flex flex-wrap items-center gap-4"
    >
      <BookDemoBtn />
      <SeeInActionBtn />
    </motion.div>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: "Higher Quality Leads",
      desc: "AI identifies buyers most likely to convert",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      title: "Instant Lead Qualification",
      desc: "Automatically score and qualify leads in real time",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: "More Sales Meetings",
      desc: "Your team talks only with ready-to-buy prospects",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE_OUT_EXPO }}
          className="flex flex-col gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sk-red/5 text-sk-red">
            {f.icon}
          </div>
          <div>
            <h4 className="sk-font-meta text-[13px] font-bold text-sk-ink">{f.title}</h4>
            <p className="sk-font-body mt-1 text-[11.5px] leading-relaxed text-sk-ink60">{f.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
