"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { agentUrlForVertical, agentAddressForVertical, AGENTS_LIVE } from "@/lib/links";
import { VERTICALS, CAPABILITY_META, type Vertical, type Capability } from "@/lib/verticals";
import { VERTICAL_ICONS } from "@/components/skillies/vertical-icons";

/**
 * VerticalGrid · v6 — "One agent, three jobs."
 *
 * Reframed around the three core agentic capabilities the Skillies agent
 * runs on every channel: Lead Capture · Order Capture · E-commerce.
 *
 * Each of the 8 live verticals now (a) maps to one of those capabilities,
 * and (b) carries its own agent address (agents.skillies.ai/<slug>) so the
 * per-vertical subdomain structure reads clearly. Card navigation is wired
 * through agentUrlForVertical() — it points at the subdomain once
 * AGENTS_LIVE flips, and at the rich internal /for/<slug> page until then.
 *
 * Verticals are kept in sync with content/verticals/*.ts and app/for/*.
 */

const CAPABILITIES: {
  id: Capability;
  label: string;
  blurb: string;
  accent: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "lead",
    label: "Lead Capture",
    blurb: "Greets, qualifies and scores every inquiry — then books the meeting.",
    accent: "#D9342B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
        <path d="m3 7 9 6 9-6" />
        <path d="m16 19 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "order",
    label: "Order Capture",
    blurb: "Takes the order in-chat, confirms details and locks the booking 24/7.",
    accent: "#C9A06B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-2 4h12" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </svg>
    ),
  },
  {
    id: "ecom",
    label: "E-commerce",
    blurb: "Recovers carts, upsells, tracks shipments and brings buyers back.",
    accent: "#141414",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

export default function VerticalGrid() {
  return (
    <section id="verticals" className="sk-section border-b border-sk-hairline">
      <div className="sk-container">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-[10vw] xl:gap-[12vw]">

          {/* Left Column: Header + Capabilities + Vertical Cards */}
          <div className="relative">
            <div className="max-w-xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-sk-red/10 shadow-sm mb-6"
              >
                <span className="text-sk-red text-[10px]">✦</span>
                <span className="sk-font-meta text-sk-red text-[10px] font-black tracking-widest uppercase">
                  One agent · three jobs
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
                Capture the lead. <br />
                Capture the order. <br />
                <span className="text-sk-red italic">Close the sale.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="sk-font-body mt-8 text-sk-ink60"
                style={{ fontSize: "1.125rem", lineHeight: 1.55 }}
              >
                The Skillies agent runs three jobs on autopilot &mdash; and adapts
                into a trained worker for your exact industry. Each vertical gets its
                own agent at <span className="font-semibold text-sk-ink">agents.skillies.ai</span>.
              </motion.p>
            </div>

            {/* Core Capabilities Trio */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14"
            >
              {CAPABILITIES.map((c, i) => (
                <CapabilityCard key={c.id} cap={c} index={i} />
              ))}
            </motion.div>

            {/* Verticals Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-9"
            >
              {VERTICALS.map((v, i) => (
                <VerticalCard key={v.slug} v={v} index={i} />
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

function CapabilityCard({
  cap,
  index,
}: {
  cap: (typeof CAPABILITIES)[number];
  index: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group relative rounded-2xl border border-sk-hairline bg-white p-4 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-25px_rgba(20,20,20,0.18)]"
    >
      {/* Ambient accent glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: cap.accent }}
      />

      <div className="relative flex items-center gap-2.5">
        <motion.div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${cap.accent}12`, color: cap.accent }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        >
          <div className="h-[18px] w-[18px]">{cap.icon}</div>
        </motion.div>
        <span className="sk-font-section text-[13px] font-black leading-tight text-sk-ink">
          {cap.label}
        </span>
      </div>

      <p className="sk-font-body relative mt-3 text-[11px] leading-relaxed text-sk-ink60">
        {cap.blurb}
      </p>

      {/* Animated underline */}
      <motion.div
        className="relative mt-3 h-[2px] rounded-full"
        style={{ background: cap.accent, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

function VerticalCard({ v, index }: { v: Vertical; index: number }) {
  const meta = CAPABILITY_META[v.capability];
  const href = agentUrlForVertical(v.slug);
  const external = href.startsWith("http");

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className="group relative"
    >
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            {/* Icon Box */}
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm border border-transparent transition-all duration-300 group-hover:scale-110 group-hover:border-white/50"
              style={{ background: `${v.accent}12`, color: v.accent }}
            >
              {VERTICAL_ICONS[v.slug]}
            </div>

            {/* Capability pill */}
            <span
              className="sk-font-meta rounded-full px-2 py-0.5 text-[7.5px] md:text-[8.5px] font-black uppercase tracking-wider"
              style={{ background: `${meta.accent}10`, color: meta.accent }}
            >
              {meta.label}
            </span>
          </div>

          <div className="relative">
            <span className="absolute -top-7 right-0 sk-font-display text-[11px] font-bold text-sk-red opacity-30 group-hover:opacity-100 transition-opacity">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h4 className="sk-font-section text-[14px] md:text-[16px] font-bold text-sk-ink mb-1.5 leading-tight transition-colors group-hover:text-sk-red">
              {v.label}
            </h4>
            <p className="sk-font-body text-[10.5px] md:text-[12.5px] text-sk-ink60 leading-relaxed sk-text-balance">
              {v.cardDesc}
            </p>
          </div>
        </div>
      </Link>

      {/* Agent subdomain address row */}
      <div className="mt-3 flex items-center justify-between border-t border-sk-ink/[0.06] pt-2.5">
        <span className="sk-font-meta truncate text-[9px] md:text-[10px] font-bold tracking-tight text-sk-ink40">
          {agentAddressForVertical(v.slug)}
        </span>
        <span
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-sk-ink/5 text-sk-ink40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-sk-red group-hover:border-sk-red group-hover:text-white"
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            {AGENTS_LIVE ? (
              <>
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </>
            ) : (
              <>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </>
            )}
          </svg>
        </span>
      </div>
    </motion.div>
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
        {MESSAGES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.3, duration: 0.4 }}
            className={`flex ${m.type === "sent" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-xl md:rounded-2xl text-[11px] md:text-[14px] leading-relaxed shadow-sm ${
                m.type === "sent" ? "bg-sk-red text-white rounded-tr-none" : "bg-white text-sk-ink rounded-tl-none border border-sk-hairline"
              }`}
            >
              {m.text}
              <div className="text-[8px] md:text-[10px] mt-1 opacity-60 text-right">{m.time}</div>
            </div>
          </motion.div>
        ))}

        {/* Vertical quick-reply chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="flex flex-wrap gap-1.5 pt-2"
        >
          {VERTICALS.map((v) => (
            <div key={v.slug} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white border border-sk-hairline shadow-sm flex items-center justify-center" style={{ color: v.accent }}>
              <div className="scale-[0.65] md:scale-90">{VERTICAL_ICONS[v.slug]}</div>
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
  { type: "sent", text: "Do you have the blue sofa in stock? Can I order it?", time: "10:31 AM" },
  { type: "received", text: "Yes! The Azure 3-seater is in stock ✨ I can take your order right here — shall I confirm it for ₹42,000 with free delivery?", time: "10:31 AM" },
  { type: "sent", text: "Yes please, confirm it", time: "10:32 AM" },
  { type: "received", text: "Done ✅ Order #4471 confirmed. I've sent the invoice and tracking link. Want me to add the matching cushions at 10% off?", time: "10:32 AM" },
];
