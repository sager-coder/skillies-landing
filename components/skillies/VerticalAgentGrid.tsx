"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VERTICALS, CAPABILITY_META, type Vertical } from "@/lib/verticals";
import { agentAddressForVertical } from "@/lib/links";

/**
 * VerticalAgentGrid · v6 — the For-Business hub grid.
 *
 * Now driven by the canonical lib/verticals list (all 8, including E-commerce),
 * each card carrying its capability pill and its agents.skillies.ai/<slug>
 * address. Replaces the old hand-kept list that had drifted to 7 verticals with
 * fabricated "convos/day" numbers.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function AgentCard({ vertical, index }: { vertical: Vertical; index: number }) {
  const meta = CAPABILITY_META[vertical.capability];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: EASE_OUT_EXPO }}
      className="group relative"
    >
      <Link
        href={`/for/${vertical.slug}`}
        className="block h-full relative rounded-[2.5rem] p-8 md:p-9 bg-white border border-sk-hairline transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(20,20,20,0.08)] hover:scale-[1.02]"
      >
        {/* Color Ribbon */}
        <div
          className="absolute top-0 left-10 right-10 h-1 rounded-b-full transition-all duration-500 group-hover:h-2"
          style={{ background: vertical.accent }}
        />

        <div className="flex flex-col h-full">
          {/* Eyebrow + Status */}
          <div className="flex items-center justify-between mb-7">
            <span className="sk-font-meta text-[10px] font-black tracking-widest uppercase" style={{ color: vertical.accent }}>
              {vertical.eyebrow}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="sk-font-meta text-[9px] font-black text-green-600 uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* Capability pill */}
          <span
            className="sk-font-meta mb-4 inline-flex w-fit rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider"
            style={{ background: `${meta.accent}10`, color: meta.accent }}
          >
            {meta.label}
          </span>

          {/* Title */}
          <h3 className="sk-font-section text-[23px] md:text-[26px] text-sk-ink font-black leading-[1.12] mb-5 min-h-[2.2em] flex items-start">
            {vertical.title}
          </h3>

          {/* Pain Point */}
          <p className="sk-font-body text-[14px] text-sk-ink60 leading-relaxed mb-10 flex-grow">
            {vertical.pain}
          </p>

          {/* Footer · agent address */}
          <div className="mt-auto pt-7 border-t border-sk-hairline flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="sk-font-meta text-[9px] text-sk-ink20 font-black uppercase tracking-widest mb-1">Agent</span>
              <span className="font-mono text-[11px] text-sk-ink40 truncate">
                {agentAddressForVertical(vertical.slug)}
              </span>
            </div>

            <div className="w-10 h-10 flex-shrink-0 rounded-full border border-sk-ink/5 flex items-center justify-center text-sk-ink transition-all duration-300 group-hover:bg-sk-red group-hover:border-sk-red group-hover:text-white group-hover:translate-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function VerticalAgentGrid() {
  return (
    <section id="verticals" className="relative py-24 md:py-32 border-t border-sk-hairline">
      <div className="sk-container">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-sk-red/10 shadow-sm mb-6"
          >
            <span className="text-sk-red text-[10px]">✦</span>
            <span className="sk-font-meta text-sk-red text-[10px] font-black tracking-widest uppercase">
              One worker · eight industries
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-section text-sk-ink sk-text-balance"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02, fontWeight: 900, letterSpacing: "-0.03em" }}
          >
            Find the agent built for{" "}
            <span className="text-sk-red italic">your business.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-7 text-sk-ink60"
            style={{ fontSize: "1.125rem", lineHeight: 1.55 }}
          >
            Same agent core, trained for your industry&rsquo;s exact sales conversation.
            Open any one to see its workflow, demo, and pricing.
          </motion.p>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {VERTICALS.map((v, i) => (
            <AgentCard key={v.slug} vertical={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
