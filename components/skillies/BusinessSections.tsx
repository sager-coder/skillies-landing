"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── Icons ────────────────────────────── */

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}

function BoltIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
  );
}

function MessageIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  );
}

function UserIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}

function CalendarLargeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  );
}

function CheckLargeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );
}

/* ─────────────────────────── Feature Row ──────────────────────── */

const FEATURES = [
  {
    title: "Capture More Leads",
    desc: "Engage 24/7 across all channels and never miss a potential customer.",
    icon: <TargetIcon />,
  },
  {
    title: "Qualify Automatically",
    desc: "AI asks the right questions and qualifies leads so your team focuses on the best.",
    icon: <BoltIcon />,
  },
  {
    title: "Close More Sales",
    desc: "Skillies handles the complexity of the sale directly on WhatsApp—without the back-and-forth.",
    icon: <CalendarIcon />,
  },
  {
    title: "Close More Deals",
    desc: "Close high-intent leads faster with real-time follow-ups and smart nurturing.",
    icon: <ChartIcon />,
  },
];

export function BusinessFeatureRow() {
  return (
    <section className="pb-32">
      <div className="sk-container">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE_OUT_EXPO }}
              className="p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-sk-hairline shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-sk-red/5 flex items-center justify-center text-sk-red mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                <div className="scale-75 md:scale-100">{f.icon}</div>
              </div>
              <h4 className="sk-font-display text-[15px] md:text-[20px] font-black text-sk-ink mb-2 md:mb-4 tracking-tight leading-tight">{f.title}</h4>
              <p className="sk-font-body text-[11px] md:text-[15px] leading-relaxed text-sk-ink60">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Process Section ───────────────────── */

const STEPS = [
  { id: "01", title: "Engage", desc: "Skillies starts the conversation instantly across channels.", icon: <MessageIcon /> },
  { id: "02", title: "Qualify", desc: "AI qualifies the lead by asking smart, personalized questions.", icon: <UserIcon /> },
  { id: "03", title: "Nurture", desc: "Skillies follows up and answers every objection instantly.", icon: <CalendarLargeIcon /> },
  { id: "04", title: "Close", desc: "Your team sees closed sales and high-intent buyers.", icon: <CheckLargeIcon /> },
];

export function BusinessProcess() {
  return (
    <section className="py-24 md:py-36 border-y border-sk-hairline relative isolate overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-sk-red/[0.01] -z-10" />
      
      <div className="sk-container">
        <div className="text-center mb-24">
          <p className="sk-font-meta text-sk-red font-black uppercase tracking-[0.2em] text-[11px] mb-6">Automated Workflow</p>
          <h2 className="sk-font-display text-[36px] md:text-[52px] font-black text-sk-ink tracking-tighter leading-none">From lead to sale, <br className="hidden md:block" /> <span className="text-sk-ink40">on autopilot.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden lg:block absolute top-[64px] left-[12.5%] right-[12.5%] h-[2px] z-0">
            <svg width="100%" height="2" fill="none">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--sk-red)" strokeWidth="2" strokeDasharray="8 8" opacity="0.2" />
            </svg>
          </div>
          
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: EASE_OUT_EXPO }}
              className="relative z-10 text-center flex flex-col items-center group"
            >
              <div className="mb-6 sk-font-meta text-sk-red font-black text-[13px] tracking-widest">{s.id}</div>
              <div className="w-[120px] h-[120px] rounded-full bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-sk-hairline flex items-center justify-center text-sk-red mb-10 group-hover:scale-110 transition-transform duration-500 relative">
                <div className="absolute inset-0 rounded-full bg-sk-red/5 scale-0 group-hover:scale-110 transition-transform duration-500 -z-10" />
                {s.icon}
              </div>
              <h4 className="sk-font-display text-[24px] font-black text-sk-ink mb-4 tracking-tight">{s.title}</h4>
              <p className="sk-font-body text-[15px] leading-relaxed text-sk-ink60 max-w-[220px] mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Results Section ───────────────────── */

export function BusinessResults() {
  return (
    <section className="py-24 md:py-40">
      <div className="sk-container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[12vw] xl:gap-[15vw]">
          
          {/* Left: Stats */}
          <div>
            <p className="sk-font-meta text-sk-red font-black uppercase tracking-[0.2em] text-[11px] mb-8">Direct ROI</p>
            <h2 className="sk-font-display text-[36px] md:text-[52px] font-black text-sk-ink leading-[0.95] tracking-tighter mb-10">Businesses that <br /> scaled with Skillies.</h2>
            <p className="sk-font-body text-[19px] text-sk-ink60 mb-20 max-w-md leading-relaxed">From startups to enterprises, Skillies helps sales teams save time, increase conversion, and close more deals.</p>
            
            <div className="space-y-12">
              {[
                { val: "3X", label: "More Qualified Sales", desc: "vs manual qualification" },
                { val: "70%", label: "Time Saved", desc: "per salesperson monthly" },
                { val: "45%", label: "Close Rate Increase", desc: "with instant follow-up" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8 group">
                  <div className="sk-font-display text-[56px] font-black text-sk-red leading-none tabular-nums group-hover:scale-110 transition-transform duration-300">{s.val}</div>
                  <div>
                    <div className="sk-font-meta text-[11px] text-sk-ink font-black uppercase tracking-widest">{s.label}</div>
                    <div className="text-[11px] text-sk-ink40 font-medium mt-1 uppercase tracking-widest">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Testimonial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 md:p-20 rounded-[3rem] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-sk-hairline relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sk-red/[0.01] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-1 text-[#F9AB00]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="sk-font-meta text-[10px] font-black text-sk-ink40 uppercase tracking-[0.15em]">Verified Customer</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-sk-red/5 rounded-xl border border-sk-red/10 text-sk-red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
            <p className="sk-font-body text-[19px] md:text-[22px] text-sk-ink leading-relaxed mb-12 font-medium tracking-tight">
              &ldquo;Skillies transformed the way we handle inbound leads. Our team now focuses only on closing, and our pipeline has never been stronger.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sk-red flex items-center justify-center text-white font-black text-lg">
                A
              </div>
              <div>
                <p className="text-[15px] md:text-[17px] font-black text-sk-ink tracking-tight leading-tight">Arun Nair</p>
                <p className="text-[10px] md:text-[12px] text-sk-ink40 font-black uppercase tracking-widest mt-1">Founder & CEO, Edutech</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
