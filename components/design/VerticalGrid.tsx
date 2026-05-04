"use client";

/**
 * VerticalGrid · the 7 vertical cards on the homepage that link to
 * their dedicated /for/<vertical> page.
 * 
 * Visual uplift (v4):
 *  - Refined card styling with high-performance glassmorphism on hover.
 *  - Staggered entrance animations using smooth spring easing.
 *  - Interactive focus state and improved typography hierarchy.
 */

import Link from "next/link";
import { motion } from "framer-motion";

const VERTICALS = [
  {
    href: "/for/real-estate",
    title: "Real Estate",
    pain: "78% of buyers go with whoever replies first. Skillies replies in 4 seconds, not 4 hours.",
    accent: "var(--sk-realestate-slate)",
    eyebrow: "DEVELOPERS · BROKERS",
  },
  {
    href: "/for/hajj",
    title: "Hajj & Umrah",
    pain: "Malayalam voice notes at 1 a.m. while you're in Makkah. Skillies handles it before fajr.",
    accent: "var(--sk-hajj-forest)",
    eyebrow: "PILGRIMAGE OPERATORS",
  },
  {
    href: "/for/study-abroad",
    title: "Study Abroad",
    pain: "A student inquires in Feb, converts in Oct. Skillies remembers every detail in between.",
    accent: "var(--sk-studyabroad-navy)",
    eyebrow: "CONSULTANTS",
  },
  {
    href: "/for/coaching",
    title: "Coaching",
    pain: "Result day — 5,000 parents in 48 hours. Skillies books every demo while you breathe.",
    accent: "var(--sk-coaching-indigo)",
    eyebrow: "NEET · UPSC · IELTS",
  },
  {
    href: "/for/interiors",
    title: "Modular Kitchen",
    pain: "Customer sends a photo at midnight. Skillies suggests 3 rendered options instantly.",
    accent: "var(--sk-interiors-terracotta)",
    eyebrow: "INTERIOR STUDIOS",
  },
  {
    href: "/for/retail",
    title: "Retail & Kirana",
    pain: "Saturday rush — 8 missed orders. Skillies takes orders 24/7 in your language.",
    accent: "var(--sk-retail-saffron)",
    eyebrow: "SHOPS · SALONS · GYMS",
  },
  {
    href: "/for/insurance",
    title: "Insurance",
    pain: "11 PM queries about IRDAI compliance. Skillies answers calmly with carrier facts.",
    accent: "var(--sk-insurance-navy)",
    eyebrow: "BROKERS · AGENCIES",
  },
];

export default function VerticalGrid() {
  return (
    <section id="verticals" className="sk-section sk-grain border-b border-sk-hairline" style={{ background: "var(--sk-cream)" }}>
      <div className="sk-container">
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sk-font-meta text-sk-ink40 font-black tracking-widest uppercase mb-4"
          >
            Built Per Vertical
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-section text-sk-ink sk-text-balance"
            style={{ fontSize: "var(--sk-text-h2)", lineHeight: 1.1 }}
          >
            One product. <br />
            <span className="sk-font-display-italic text-sk-red">Seven different workers.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-6 text-sk-ink60"
            style={{ fontSize: "var(--sk-text-lead)", maxWidth: "55ch" }}
          >
            A real-estate worker doesn&rsquo;t need to grade hairline photos. 
            We build only what your vertical needs — and price only what you switch on.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.href}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -30px 0px" }}
              transition={{ 
                duration: 0.5, 
                delay: (i % 3) * 0.05, 
                ease: [0.22, 1, 0.36, 1] as const
              }}
              className="will-change-transform"
            >
              <Link
                href={v.href}
                className="group block relative rounded-[2rem] p-8 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(20,20,20,0.08)] h-full overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid var(--sk-hairline)",
                }}
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-b-full transition-all duration-500 group-hover:h-2" style={{ background: v.accent }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none" style={{ background: v.accent }} />
                
                <p className="sk-font-meta text-[10px] font-black tracking-widest uppercase mb-4" style={{ color: v.accent }}>
                  {v.eyebrow}
                </p>
                <h3 className="sk-font-section text-2xl text-sk-ink leading-tight mb-4 group-hover:text-sk-red transition-colors duration-300">
                  {v.title}
                </h3>
                <p className="sk-font-body text-sm text-sk-ink60 leading-relaxed mb-8">
                  {v.pain}
                </p>
                
                <div className="mt-auto pt-6 border-t border-sk-hairline flex items-center justify-between">
                  <span className="sk-font-meta text-[10px] text-sk-ink40 font-black uppercase tracking-widest">Explore vertical</span>
                  <span className="text-sk-red transition-all duration-300 group-hover:translate-x-3 group-hover:scale-125">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
