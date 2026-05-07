"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BigStatTicker from "@/components/skillies/BigStatTicker";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── Dashboard Visual ─────────────────── */

function DashboardVisual() {
  return (
    <div className="relative w-full aspect-[1.1/1] md:aspect-square scale-[0.85] md:scale-100 origin-center">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <div className="w-[120%] aspect-square border border-sk-ink/[0.08] rounded-full" />
        <div className="absolute w-[90%] aspect-square border border-sk-ink/[0.12] rounded-full" />
        <div className="absolute w-[60%] aspect-square border border-sk-ink/[0.18] rounded-full" />
      </div>

      {/* Main Performance Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
        className="absolute top-0 left-0 w-[60%] md:w-[58%] p-4 md:p-8 rounded-[1.25rem] md:rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white/40 z-20 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sk-red/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="sk-font-meta text-[7px] md:text-[10px] text-sk-ink40 font-bold uppercase tracking-[0.2em] mb-3 md:mb-6">Analytics</p>
        <div className="grid grid-cols-2 gap-3 md:gap-8">
          <div className="relative">
            <p className="sk-font-display text-[20px] md:text-[32px] font-black text-sk-ink leading-none tracking-tighter">1,250</p>
            <div className="flex items-center gap-1 mt-1 md:mt-2">
              <span className="text-[8px] md:text-[11px] text-green-500 font-bold">↑ 28%</span>
            </div>
            <p className="sk-font-meta text-[7px] md:text-[9px] text-sk-ink40 uppercase mt-2 md:mt-4 font-black tracking-widest leading-tight">Qualified</p>
          </div>
          <div className="relative">
            <p className="sk-font-display text-[20px] md:text-[32px] font-black text-sk-ink leading-none tracking-tighter">320</p>
            <div className="flex items-center gap-1 mt-1 md:mt-2">
              <span className="text-[8px] md:text-[11px] text-green-500 font-bold">↑ 24%</span>
            </div>
            <p className="sk-font-meta text-[7px] md:text-[9px] text-sk-ink40 uppercase mt-2 md:mt-4 font-black tracking-widest leading-tight">Closed</p>
          </div>
        </div>
      </motion.div>

      {/* Leads Captured Donut */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: EASE_OUT_EXPO }}
        className="absolute bottom-2 left-0 md:bottom-0 md:left-[8%] w-[65%] md:w-[58%] p-4 md:p-8 rounded-[1.25rem] md:rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white/40 z-30"
      >
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <p className="sk-font-meta text-[7px] md:text-[10px] text-sk-ink40 font-bold uppercase tracking-[0.2em]">Efficiency</p>
          <div className="flex gap-1">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sk-red" />
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sk-red/20" />
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-8">
          <div className="relative w-14 h-14 md:w-24 md:h-24 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-sk-ink/[0.03]" strokeWidth="4.5" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-sk-red" strokeWidth="4.5" strokeDasharray="65, 100" strokeLinecap="round" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-sk-ochre" strokeWidth="4.5" strokeDasharray="20, 100" strokeDashoffset="-68" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[12px] md:text-[18px] font-black text-sk-ink leading-none tabular-nums">2.5k</span>
              <span className="text-[6px] md:text-[8px] text-sk-ink40 font-black uppercase mt-0.5">Total</span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5 md:space-y-2.5">
            {[
              { l: "Ads", v: "42%", c: "bg-sk-red" },
              { l: "WA", v: "28%", c: "bg-sk-ochre" },
              { l: "Insta", v: "16%", c: "bg-purple-400" },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between group/row cursor-default">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${d.c} shadow-sm transition-transform`} />
                  <span className="text-[8px] md:text-[10px] text-sk-ink60 font-bold">{d.l}</span>
                </div>
                <span className="text-[8px] md:text-[10px] font-black text-sk-ink tabular-nums">{d.v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Conversations Side Card */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -30, rotate: 2 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: EASE_OUT_EXPO }}
        className="absolute top-[38%] right-0 w-[48%] md:w-[44%] p-4 md:p-6 rounded-[1.25rem] md:rounded-[2rem] bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] border border-sk-hairline z-10"
      >
        <p className="sk-font-meta text-[7px] md:text-[10px] text-sk-ink40 font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">AI Workers</p>
        <div className="space-y-3.5 md:space-y-5">
          {[
            { label: "Leads", val: "1,860", inc: "+27%", color: "text-blue-500", bg: "bg-blue-50", icon: (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            )},
            { label: "Qual.", val: "980", inc: "+18%", color: "text-sk-red", bg: "bg-sk-red/5", icon: (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            )},
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 md:gap-4 group/ai cursor-pointer">
              <div className={`w-6 h-6 md:w-9 md:h-9 rounded-lg md:rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover/ai:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-[10px] md:text-[13px] font-black text-sk-ink tabular-nums leading-none">{item.val}</p>
                  <p className={`text-[7px] md:text-[9px] font-black ${item.color} tracking-tight`}>{item.inc}</p>
                </div>
                <p className="text-[7px] md:text-[10px] text-sk-ink40 font-black uppercase tracking-widest mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE_OUT_EXPO }}
        className="absolute -bottom-1 md:-bottom-6 right-[8%] md:right-[15%] px-3.5 md:px-5 py-2 md:py-3 rounded-full bg-sk-ink text-white shadow-2xl flex items-center gap-2 md:gap-3 z-40 border border-white/10"
      >
        <span className="relative flex h-1 w-1 md:h-2 md:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1 w-1 md:h-2 md:w-2 bg-green-500"></span>
        </span>
        <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-[0.15em]">Live Scoping</span>
      </motion.div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-sk-red/5 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-sk-ochre/5 blur-[120px] -z-10 rounded-full" />
    </div>
  );
}

/* ─────────────────────────── Section ──────────────────────────── */

export default function ForHeroV2() {
  return (
    <section className="relative pt-24 pb-16 md:pt-28 lg:pt-32 md:pb-32 overflow-hidden">
      <div className="sk-container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[12vw] xl:gap-[15vw]">
          
          {/* Left Side: Content */}
          <div className="relative z-10 max-w-[640px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sk-red/10 bg-sk-red/[0.04] mb-10 shadow-sm"
            >
              <span className="text-[10px] font-black tracking-[0.18em] text-sk-red uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sk-red animate-pulse" /> AUTOMATE YOUR SALES
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="sk-font-display text-sk-ink sk-text-balance"
              style={{
                fontSize: "clamp(2.8rem, 5.2vw, 4rem)",
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Your sales team <br />
              should <span className="text-sk-ink40">close deals.</span> <br />
              Skillies <span className="text-sk-red italic sk-font-display-italic relative">
                handles the conversations.
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-sk-red/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="sk-font-body mt-12 text-sk-ink60"
              style={{ fontSize: "1.35rem", lineHeight: 1.45, maxWidth: "42ch", fontWeight: 450 }}
            >
              Skillies AI replaces the friction of manual qualification. We capture every inbound lead, 
              identify the buyers, and close sales &mdash; <span className="text-sk-ink font-bold italic">while you sleep.</span>
            </motion.p>


            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-10 gap-y-4"
            >
              {["5 Indian Languages", "WhatsApp first", "Zero Lead Leakage"].map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 group cursor-default">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 transition-colors group-hover:bg-green-500/20">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-[10px] font-black text-sk-ink40 uppercase tracking-[0.2em]">{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Dashboard Visual */}
          <div className="relative">
            <DashboardVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
