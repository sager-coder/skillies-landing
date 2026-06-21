"use client";

/**
 * AgentWorkflow — the "how the agent actually works" section for a vertical
 * landing page. Renders the 4-step agentic flow (capture → … → close/fulfil)
 * from the canonical lib/verticals config, with an animated connecting line so
 * the steps read as one continuous, automated pipeline.
 */

import { motion, useReducedMotion } from "framer-motion";
import { getVertical, CAPABILITY_META, type Capability } from "@/lib/verticals";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const STEP_ICON: Record<Capability, React.ReactNode[]> = {
  lead: [icon("inbox"), icon("filter"), icon("calendar"), icon("repeat")],
  order: [icon("cart"), icon("check"), icon("rupee"), icon("bell")],
  ecom: [icon("chat"), icon("cart"), icon("rupee"), icon("repeat")],
};

export default function AgentWorkflow({ slug }: { slug: string }) {
  const reduced = useReducedMotion();
  const v = getVertical(slug);
  if (!v) return null;

  const meta = CAPABILITY_META[v.capability];
  const icons = STEP_ICON[v.capability];

  return (
    <section className="sk-section border-t border-sk-hairline" aria-label="How the agent works">
      <div className="sk-container">
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border shadow-sm mb-6"
            style={{ borderColor: `${v.accent}22` }}
          >
            <span className="text-[10px]" style={{ color: v.accent }}>✦</span>
            <span className="sk-font-meta text-[10px] font-black tracking-widest uppercase" style={{ color: v.accent }}>
              How the agent works · {meta.label}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-section text-sk-ink sk-text-balance"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.04, fontWeight: 900, letterSpacing: "-0.03em" }}
          >
            Your {v.label.toLowerCase()} workflow,{" "}
            <span className="italic" style={{ color: v.accent }}>running on autopilot.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-6 text-sk-ink60"
            style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}
          >
            One conversation, four jobs — captured, handled, and closed without a human touching the thread.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px" style={{ background: "var(--sk-hairline)" }}>
            <motion.div
              className="h-px origin-left"
              style={{ background: v.accent }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.2 }}
            />
          </div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            {v.workflow.map((step, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
                }}
                className="relative"
              >
                {/* Node */}
                <div className="relative flex items-center gap-4 mb-5">
                  <motion.div
                    className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_18px_40px_-18px_rgba(20,20,20,0.25)]"
                    style={{ border: `1px solid ${v.accent}22`, color: v.accent }}
                    animate={reduced ? {} : { y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    <div className="h-6 w-6">{icons[i]}</div>
                  </motion.div>
                  <span
                    className="sk-font-display text-[34px] font-black leading-none"
                    style={{ color: v.accent, opacity: 0.18 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="sk-font-section text-[17px] md:text-[19px] font-bold text-sk-ink mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="sk-font-body text-[13px] md:text-[14px] text-sk-ink60 leading-relaxed sk-text-balance">
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function icon(name: string): React.ReactNode {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "inbox":
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case "repeat":
      return (
        <svg {...common}>
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...common}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
