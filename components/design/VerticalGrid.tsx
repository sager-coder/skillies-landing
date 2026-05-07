"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

/**
 * VerticalGrid · v5 High-Fidelity Update.
 * Matches the 2-column layout with a left-side feature grid and 
 * a right-side WhatsApp interactive preview.
 */

const VERTICALS = [
  {
    id: "01",
    title: "Real Estate",
    desc: "Replies instantly to property inquiries and books serious buyers.",
    href: "/for/real-estate",
    color: "#EF4444", // Red
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M9 8h1" />
        <path d="M9 12h1" />
        <path d="M9 16h1" />
        <path d="M14 8h1" />
        <path d="M14 12h1" />
        <path d="M14 16h1" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Travel & Tourism",
    desc: "Handles trip inquiries, follow-ups, and booking conversations 24/7.",
    href: "/for/travel",
    color: "#10B981", // Emerald
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Study Abroad",
    desc: "Follows up with students and nurtures long decision cycles.",
    href: "/for/study-abroad",
    color: "#8B5CF6", // Violet
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Coaching",
    desc: "Qualifies students and books demo sessions automatically.",
    href: "/for/coaching",
    color: "#3B82F6", // Blue
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "05",
    title: "Modular Kitchen",
    desc: "Converts showroom inquiries into booked consultations.",
    href: "/for/interiors",
    color: "#F97316", // Orange
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    ),
  },
  {
    id: "06",
    title: "Retail & Stores",
    desc: "Handles orders, support, and customer follow-ups instantly.",
    href: "/for/retail",
    color: "#EAB308", // Yellow
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "07",
    title: "Insurance",
    desc: "Explains plans, collects leads, and schedules callbacks.",
    href: "/for/insurance",
    color: "#475569", // Slate
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    id: "08",
    title: "Multi-Team Operations",
    desc: "Works across sales, support, onboarding, and customer success.",
    href: "/for/enterprise",
    color: "#EC4899", // Pink
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function VerticalGrid() {
  return (
    <section id="verticals" className="sk-section border-b border-sk-hairline">
      <div className="sk-container">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-[12vw] xl:gap-[15vw]">
          
          {/* Left Column: Text + Vertical Cards */}
          <div className="relative">
            <div className="max-w-xl mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-sk-red/10 shadow-sm mb-6"
              >
                <span className="text-sk-red text-[10px]">✦</span>
                <span className="sk-font-meta text-sk-red text-[10px] font-black tracking-widest uppercase">
                  AI-Powered Sales Automation
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="sk-font-section text-sk-ink sk-text-balance"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.0, fontWeight: 900, letterSpacing: "-0.03em" }}
              >
                One product. <br />
                <span className="text-sk-red italic">Seven different workers.</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="sk-font-body mt-8 text-sk-ink60"
                style={{ fontSize: "1.125rem", lineHeight: 1.5 }}
              >
                Every business has different sales workflows. <br />
                Skillies adapts like a trained AI employee for your industry.
              </motion.p>
            </div>

            {/* Verticals Grid */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-10"
            >
              {VERTICALS.map((v) => (
                <motion.div
                  key={v.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <Link href={v.href} className="group block relative">
                    <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5">
                      {/* Icon Box */}
                      <div 
                        className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-transparent group-hover:border-white/50"
                        style={{ background: `${v.color}10`, color: v.color }}
                      >
                        <div className="scale-75 md:scale-100">{v.icon}</div>
                      </div>
                      
                      <div className="relative flex-1">
                        {/* Number */}
                        <span className="absolute -top-1 -right-0 sk-font-display text-[9px] md:text-[11px] font-bold text-sk-red opacity-30 group-hover:opacity-100 transition-opacity">
                          {v.id}
                        </span>
                        
                        <h4 className="sk-font-section text-[13px] md:text-[17px] font-bold text-sk-ink mb-1 md:mb-2 group-hover:text-sk-red transition-colors leading-tight">
                          {v.title}
                        </h4>
                        <p className="sk-font-body text-[10px] md:text-[13px] text-sk-ink60 leading-relaxed sk-text-balance line-clamp-3 md:line-clamp-none">
                          {v.desc}
                        </p>
                        
                        {/* Circle Arrow */}
                        <div className="mt-3 w-6 h-6 md:w-7 md:h-7 rounded-full border border-sk-ink/5 flex items-center justify-center transition-all duration-300 group-hover:bg-sk-red group-hover:border-sk-red group-hover:text-white group-hover:translate-x-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: WhatsApp Interactive Preview */}
          <div className="relative sticky top-32">
            <WhatsAppChatPreview />
          </div>

        </div>
      </div>
    </section>
  );
}

function WhatsAppChatPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-[320px] md:max-w-[420px] rounded-[2rem] md:rounded-[3rem] bg-white shadow-[0_60px_120px_-20px_rgba(20,20,20,0.12)] border border-sk-hairline overflow-hidden p-2 md:p-3 scale-[0.95] md:scale-100 origin-top"
    >
      {/* Header */}
      <div className="bg-[#f0f2f5]/90 p-3 md:p-5 flex items-center justify-between border-b border-sk-hairline">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-sk-ink flex items-center justify-center text-white">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5">
               <path d="M12 21a9 9 0 1 0-9-9c0 1.48.35 2.89 1 4.12L3 21l4.88-1c1.23.65 2.64 1 4.12 1Z" />
             </svg>
          </div>
          <div>
            <h5 className="sk-font-body font-bold text-sk-ink text-xs md:text-sm">Skillies AI</h5>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="sk-font-meta text-[8px] md:text-[10px] font-bold text-green-600">Online</span>
            </span>
          </div>
        </div>
        <div className="flex gap-4 opacity-40">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-[#f0f2f5]/20 min-h-[380px] md:min-h-[500px]">
        {/* Messages with staggered entrance */}
        {MESSAGES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.5 + i * 1.2, duration: 0.6 }}
            className={`flex ${m.type === "sent" ? "justify-end" : "justify-start"}`}
          >
             <div 
               className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-xl md:rounded-2xl text-[11px] md:text-[14px] leading-relaxed shadow-sm ${
                 m.type === "sent" ? "bg-sk-red text-white rounded-tr-none" : "bg-white text-sk-ink rounded-tl-none border border-sk-hairline"
               }`}
             >
                {m.text}
                <div className={`text-[8px] md:text-[10px] mt-1 opacity-60 text-right`}>{m.time}</div>
             </div>
          </motion.div>
        ))}

        {/* Vertical Selection Quick Reply Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 4.5, duration: 0.6 }}
          className="flex flex-wrap gap-1.5 pt-2"
        >
          {VERTICALS.slice(0, 8).map((v) => (
            <div key={v.id} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white border border-sk-hairline shadow-sm flex items-center justify-center text-sk-ink/40">
              <div className="scale-75 md:scale-100">{v.icon}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer / Input Bar */}
      <div className="p-3 md:p-4 bg-white border-t border-sk-hairline flex items-center gap-3 md:gap-4">
        <div className="flex-1 bg-[#f0f2f5] rounded-full px-4 md:px-5 py-2 md:py-3 flex items-center justify-between text-sk-ink30 text-[11px] md:text-[13px]">
           <span>Type a message...</span>
           <div className="flex gap-2 md:gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-4.5 md:h-4.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
           </div>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sk-red flex items-center justify-center text-white shadow-lg shadow-sk-red/20">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5 md:w-5 md:h-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
        </div>
      </div>
    </motion.div>
  );
}

const MESSAGES = [
  { type: "received", text: "Hi! I'm Skillies AI 👋 How can I help you today?", time: "10:30 AM" },
  { type: "sent", text: "What can Skillies AI do for different businesses?", time: "10:31 AM" },
  { type: "received", text: "Great question! Skillies AI works like 7 specialized employees—each built for a specific industry. Here's how it helps ✨", time: "10:31 AM" },
  { type: "sent", text: "Show me the verticals", time: "10:32 AM" },
  { type: "received", text: "Sure! Here are the 7 verticals Skillies AI supports.", time: "10:32 AM" },
];
