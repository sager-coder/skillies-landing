"use client";

/**
 * WhySkilliesIsDifferent · v8 Text Fitting Update.
 * Optimized internal spacing and clamping to ensure all product
 * descriptions fit naturally within the editorial card grid.
 */

import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Self-auditing behavior",
    body: "Every 100 messages, the AI reviews and improves itself based on real outcomes.",
    metric: "12-30% CLOSURE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Perfect patient recall",
    body: "Remembers every inquiry, score, objection, and interaction.",
    metric: "18 MO RECALL",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.04-2.44 2.5 2.5 0 0 1-2-2.5 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2-2.5 2.5 2.5 0 0 1 2.04-2.44A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.04-2.44 2.5 2.5 0 0 0 2-2.5 2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2-2.5 2.5 2.5 0 0 0-2.04-2.44A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
  },
  {
    title: "Visual intelligence",
    body: "Understands images, docs, floor plans, and validates information instantly.",
    metric: "VISION + OCR BUILT-IN",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Operations, not Chat",
    body: "Role-based access, auto assignments, and daily performance summaries.",
    metric: "ROLE-BASED ROUTING",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Intelligent forwarding",
    body: "AI scores leads and routes them to the right sales rep automatically.",
    metric: "SCORE-BASED ASSIGNMENT",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    title: "Calendar fulfillment",
    body: "Books meetings, sends invites, reminders, and reschedules calls.",
    metric: "ZERO DOUBLE-BOOKING",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Closing in-thread",
    body: "Handles objections and closes deals inside the chat before humans jump in.",
    metric: "RTO DROPS BY 40%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
      </svg>
    ),
  },
  {
    title: "Deep domain logic",
    body: "Built for your business with custom flows, calculations, and complex rules.",
    metric: "LOGIC-TUNED ONBOARDING",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export default function WhySkilliesIsDifferent() {
  return (
    <section id="why-different" className="sk-section border-b border-sk-hairline">
      <div className="sk-container">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-sk-red/10 shadow-sm mb-8"
          >
            <span className="text-sk-red text-xs">✦</span>
            <span className="sk-font-meta text-sk-red text-[11px] font-black tracking-[0.2em] uppercase">
              The Skillies Advantage
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-section text-sk-ink sk-text-balance"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1, fontWeight: 900, letterSpacing: "-0.04em" }}
          >
            Eight things every <br />
            <span className="text-sk-red italic">WhatsApp tool can&rsquo;t do.</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-10 space-y-3 text-sk-ink60"
            style={{ fontSize: "1.25rem", lineHeight: 1.5 }}
          >
            <p>AiSensy is ₹3,200/month. We&rsquo;re <span className="font-bold text-sk-ink">₹40,000+/month.</span></p>
            <p>You&rsquo;re not paying for a tool; you&rsquo;re paying for a moat.</p>
            <p className="text-sk-ink40 text-sm tracking-wide">Each capability below is why Skillies is a worker, not a router.</p>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 lg:gap-6"
        >
          {FEATURES.map((f, i) => (
            <motion.article
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                }
              }}
              className="group relative rounded-[1.5rem] md:rounded-[3.2rem] p-4 md:p-9 transition-all duration-700 hover:shadow-[0_60px_100px_-20px_rgba(20,20,20,0.08)] bg-white border border-sk-hairline overflow-hidden flex flex-col h-full aspect-[0.75/1] md:aspect-[0.78/1] min-h-0"
            >
              {/* Card Number */}
              <div className="absolute top-4 right-5 md:top-8 md:right-10 text-sk-red opacity-10 group-hover:opacity-100 transition-opacity duration-700">
                <span className="sk-font-display text-[10px] md:text-[12px] font-bold tracking-widest">{String(i + 1).padStart(2, "0")}</span>
              </div>

              {/* Icon Container */}
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-sk-red/[0.03] flex items-center justify-center text-sk-red mb-4 md:mb-8 group-hover:scale-110 group-hover:bg-sk-red/5 transition-all duration-500 border border-sk-red/5">
                <div className="scale-75 md:scale-100">{f.icon}</div>
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <h3 className="sk-font-section text-[14px] md:text-[24px] text-sk-ink font-black leading-[1.15] mb-1.5 md:mb-4 sk-text-balance min-h-[2.3em] flex items-center">
                  {f.title}
                </h3>
                <p className="sk-font-body text-[9.5px] md:text-[14px] text-sk-ink60 leading-[1.4] md:leading-[1.55] overflow-hidden line-clamp-4 md:line-clamp-5">
                  {f.body}
                </p>
              </div>

              {/* Metric Section */}
              <div className="mt-3 pt-3 md:mt-6 md:pt-6 border-t border-sk-ink/[0.08]">
                <div className="flex items-center justify-between">
                   <div className="w-2 h-2 md:w-3 md:h-3 text-sk-red opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                   </div>
                   <p className="sk-font-meta text-[5.5px] md:text-[10px] text-sk-ink40 font-black tracking-tight md:tracking-widest uppercase text-center px-1">
                    {f.metric}
                   </p>
                   <div className="w-2 h-2 md:w-3 md:h-3 text-sk-red opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                   </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="h-px w-full bg-sk-ink/[0.05] mb-10" />
          <p className="sk-font-meta text-sk-red font-black tracking-[0.4em] text-[10px] md:text-[11px] uppercase opacity-60">
            Built to close more deals, not just reply.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
