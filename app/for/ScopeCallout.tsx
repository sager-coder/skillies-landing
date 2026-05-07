"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * ScopeCallout · v5 Luxury Uplift.
 * Transforms the "Don't see your vertical?" section into a high-end 
 * technical showcase with dark glassmorphism and atmospheric depth.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EDITOR_BG = "rgba(10, 10, 10, 0.85)";
const KEYWORD = "var(--sk-red)";
const STRING = "var(--sk-ochre)";
const COMMENT = "rgba(255, 255, 255, 0.4)";
const CAL_HREF = "https://cal.com/sager-zmd4kl/30min";

const LINES = [
  { tokens: [{ text: "// Don't see your vertical?", color: COMMENT, italic: true }] },
  { tokens: [
    { text: "const ", color: KEYWORD }, { text: "yourBusiness " },
    { text: "= ", color: KEYWORD }, { text: "await ", color: KEYWORD },
    { text: "skillies." }, { text: "scope", color: KEYWORD }, { text: "({" }
  ]},
  { tokens: [{ text: "  audience: " }, { text: "\"your customers\"", color: STRING }, { text: "," }] },
  { tokens: [{ text: "  languages: " }, { text: "detect", color: KEYWORD }, { text: "()," }] },
  { tokens: [
    { text: "  integrations: [" }, { text: "\"your CRM\"", color: STRING }, 
    { text: ", " }, { text: "\"your billing\"", color: STRING }, { text: "]," }
  ]},
  { tokens: [{ text: "  timeline: " }, { text: "\"2 weeks\"", color: STRING }] },
  { tokens: [{ text: "});" }] },
  { tokens: [{ text: "" }] },
  { tokens: [{ text: "// → Book a 30-min call. We build.", color: COMMENT, italic: true }] },
];

export default function ScopeCallout() {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="sk-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Messaging */}
          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sk-font-meta text-sk-ink40 mb-6 font-black tracking-[0.2em] uppercase text-[10px]"
            >
              SCOPE A NEW VERTICAL
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE_OUT_EXPO }}
              className="sk-font-section text-sk-ink sk-text-balance"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1.05, fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              Your vertical isn&rsquo;t in the grid? <br />
              <span className="text-sk-red italic">We build.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE_OUT_EXPO }}
              className="sk-font-body mt-8 text-sk-ink60"
              style={{ fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "45ch" }}
            >
              30-min scope call, then a working agent in your stack inside 
              two weeks. Same engine. Same memory. Your customers&rsquo; language and your tools.
            </motion.p>
          </div>

          {/* Right Side: The Editor Card */}
          <div className="relative">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              className="relative rounded-3xl overflow-hidden shadow-[0_60px_100px_-30px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-xl"
              style={{ background: EDITOR_BG }}
            >
              {/* Titlebar */}
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-mono text-[10px] text-white/30 tracking-widest ml-2 uppercase">scope.your-vertical.ts</span>
              </div>

              {/* Body */}
              <div className="p-8 font-mono text-[13px] leading-relaxed text-white/80">
                {LINES.map((line, idx) => (
                  <div key={idx} className="flex gap-6">
                    <span className="text-white/10 w-4 text-right select-none">{idx + 1}</span>
                    <div className="flex-1">
                      {line.tokens.map((t, i) => (
                        <span key={i} style={{ color: t.color ?? "inherit", fontStyle: t.italic ? "italic" : "normal" }}>
                          {t.text}
                        </span>
                      ))}
                      {idx === LINES.length - 1 && <span className="inline-block ml-1 text-sk-red animate-pulse">▍</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">ready · ready to deploy</span>
                <Link
                  href={CAL_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex items-center gap-3 px-5 py-2 rounded-lg bg-sk-red text-white text-[13px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sk-red/20"
                >
                  <span className="text-[10px]">▶</span> Run · book Ehsan
                </Link>
              </div>
            </motion.div>

            {/* Ambient Background Glows behind the card */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-sk-red/10 blur-[100px] -z-10 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sk-ochre/5 blur-[100px] -z-10 rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
