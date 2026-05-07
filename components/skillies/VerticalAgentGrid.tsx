"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * VerticalAgentGrid · v5 Luxury Update.
 * Optimized for the 'For Business' page with high-end typography, 
 * glassmorphic cards, and consistent alignment.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const VERTICALS = [
  {
    href: "/for/real-estate",
    title: "Skillies for Real Estate",
    pain: "78% of buyers go with whoever replies first. Skillies replies in 4 seconds, not 4 hours.",
    eyebrow: "DEVELOPERS · BROKERS",
    accent: "var(--sk-red)",
    conversations: 1240,
  },
  {
    href: "/for/hajj",
    title: "Skillies for Travels",
    pain: "Malayalam voice notes at 1 a.m. while you're in Makkah. Skillies handles it before fajr.",
    eyebrow: "PILGRIMAGE OPERATORS",
    accent: "#10B981", // Emerald
    conversations: 348,
  },
  {
    href: "/for/study-abroad",
    title: "Skillies for Study Abroad",
    pain: "A student inquires in Feb, converts in Oct. Skillies remembers every detail in between.",
    eyebrow: "CONSULTANTS · COUNSELLORS",
    accent: "#8B5CF6", // Violet
    conversations: 582,
  },
  {
    href: "/for/coaching",
    title: "Skillies for Coaching",
    pain: "Result day — 5,000 parents in 48 hours. Skillies closes every enrollment while you breathe.",
    eyebrow: "INSTITUTES · BATCHES",
    accent: "#3B82F6", // Blue
    conversations: 915,
  },
  {
    href: "/for/interiors",
    title: "Skillies for Modular Kitchen",
    pain: "Customer sends a photo at midnight. Skillies suggests 3 rendered options instantly.",
    eyebrow: "STUDIOS · DESIGNERS",
    accent: "#F97316", // Orange
    conversations: 426,
  },
  {
    href: "/for/retail",
    title: "Skillies for Retail & Stores",
    pain: "Saturday rush — 8 missed orders. Skillies takes orders 24/7 in your language.",
    eyebrow: "SHOPS · SALONS · GYMS",
    accent: "#EAB308", // Yellow
    conversations: 712,
  },
  {
    href: "/for/insurance",
    title: "Skillies for Insurance",
    pain: "11 PM queries about IRDAI compliance. Skillies answers calmly with carrier facts.",
    eyebrow: "BROKERS · AGENTS",
    accent: "#475569", // Slate
    conversations: 1894,
  },
];

function AgentCard({ vertical, index }: { vertical: typeof VERTICALS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE_OUT_EXPO }}
      className="group relative"
    >
      <Link
        href={vertical.href}
        className="block h-full relative rounded-[2.5rem] p-8 md:p-10 bg-white border border-sk-hairline transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(20,20,20,0.08)] hover:scale-[1.02]"
      >
        {/* Color Ribbon */}
        <div 
          className="absolute top-0 left-10 right-10 h-1 rounded-b-full transition-all duration-500 group-hover:h-2" 
          style={{ background: vertical.accent }} 
        />

        <div className="flex flex-col h-full">
          {/* Eyebrow + Status */}
          <div className="flex items-center justify-between mb-8">
            <span className="sk-font-meta text-[10px] font-black tracking-widest uppercase" style={{ color: vertical.accent }}>
              {vertical.eyebrow}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="sk-font-meta text-[9px] font-black text-green-600 uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="sk-font-section text-[24px] md:text-[28px] text-sk-ink font-black leading-[1.1] mb-6 min-h-[2.2em] flex items-center">
            {vertical.title}
          </h3>

          {/* Pain Point */}
          <p className="sk-font-body text-[14px] text-sk-ink60 leading-relaxed mb-10 flex-grow">
            {vertical.pain}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-sk-hairline flex items-center justify-between">
            <div className="flex flex-col">
              <span className="sk-font-meta text-[9px] text-sk-ink20 font-black uppercase tracking-widest mb-1">ACTIVITY</span>
              <span className="font-mono text-[11px] text-sk-ink40">
                {vertical.conversations.toLocaleString()} convos / day
              </span>
            </div>
            
            <div className="w-10 h-10 rounded-full border border-sk-ink/5 flex items-center justify-center text-sk-ink transition-all duration-300 group-hover:bg-sk-red group-hover:border-sk-red group-hover:text-white group-hover:translate-x-2">
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
    <section className="relative py-24 md:py-32">
      <div className="sk-container">

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {VERTICALS.map((v, i) => (
            <AgentCard key={v.href} vertical={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
