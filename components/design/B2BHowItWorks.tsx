"use client";

/**
 * B2BHowItWorks — motion-rich vertical timeline that walks through the
 * actual B2B journey:
 *
 *   01 · Try the agent on yourself  (live mini-chat preview)
 *   02 · 30 minutes with Ehsan       (Cal.com slot card)
 *   03 · Live in 7-14 days           (agent-online status card with stats)
 *
 * Layout is a vertical timeline with a thin red rail running down the left
 * edge on desktop. Steps alternate sides (right / left / right). On mobile
 * the rail disappears and steps stack into a single column.
 *
 * Animations:
 *   • Rail scales-in vertically when the section enters view.
 *   • Each step row fades-up and slides in from its anchored side.
 *   • Step 1's chat bubbles fade in sequentially when its row enters view.
 *   • Step 2's slot dot pulses continuously.
 *   • Step 3's stat counters animate from 0 to target on view.
 *
 * Self-contained — does not import the existing HeroChatPreview or
 * RevealOnScroll components.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  type Variants,
} from "framer-motion";

// ──────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────

type ChatBubble = {
  side: "buyer" | "agent";
  text: string;
};

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  format?: "comma" | "plain";
};

// ──────────────────────────────────────────────────────────────────────
// Static content
// ──────────────────────────────────────────────────────────────────────

const CHAT_SCRIPT: ChatBubble[] = [
  { side: "buyer", text: "Hi, looking for a 3BHK in Kakkanad under 1.2 Cr" },
  { side: "agent", text: "Got it. Ready possession or under-construction is fine?" },
  { side: "buyer", text: "Ready. And budget can stretch to 1.35 if it's worth it." },
  { side: "agent", text: "Perfect — sharing 3 options that fit. Site visit Saturday 11am?" },
];

const LIVE_STATS: Stat[] = [
  { label: "Conversations handled", value: 2847, format: "comma" },
  { label: "Languages", value: 5, format: "plain" },
  { label: "Avg response", value: 38, suffix: "ms", format: "plain" },
];

// ──────────────────────────────────────────────────────────────────────
// Animated counter (used inside Step 3 stats)
// ──────────────────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  format = "plain",
  prefix = "",
  suffix = "",
  inView,
}: {
  value: number;
  format?: "comma" | "plain";
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    const n = Math.round(latest);
    const formatted = format === "comma" ? n.toLocaleString("en-IN") : String(n);
    return `${prefix}${formatted}${suffix}`;
  });
  const [display, setDisplay] = useState<string>(`${prefix}0${suffix}`);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, mv, value]);

  return <span>{display}</span>;
}

// ──────────────────────────────────────────────────────────────────────
// Step 1 visual · animated chat preview
// ──────────────────────────────────────────────────────────────────────

function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl p-5"
      style={{
        background: "var(--sk-cream)",
        border: "1px solid var(--sk-hairline)",
        boxShadow:
          "0 1px 0 rgba(20,20,20,0.04), 0 24px 48px -28px rgba(20,20,20,0.18)",
      }}
    >
      {/* Header strip */}
      <div
        className="mb-4 flex items-center gap-3 pb-3"
        style={{ borderBottom: "1px solid var(--sk-hairline)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "var(--sk-ink)", color: "var(--sk-cream)" }}
        >
          <span className="sk-font-display" style={{ fontSize: "0.95rem" }}>
            S
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className="sk-font-body"
            style={{ fontSize: "0.85rem", color: "var(--sk-ink)" }}
          >
            Skillies Demo Agent
          </span>
          <span
            className="sk-font-meta flex items-center gap-1.5"
            style={{ fontSize: "0.7rem", color: "var(--sk-ink60)" }}
          >
            <motion.span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            Online · typically replies instantly
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {CHAT_SCRIPT.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              delay: 0.25 + i * 0.55,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`flex ${b.side === "buyer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="sk-font-body max-w-[82%] rounded-2xl px-3.5 py-2.5"
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.45,
                background:
                  b.side === "buyer" ? "var(--sk-ink)" : "var(--sk-cream)",
                color:
                  b.side === "buyer" ? "var(--sk-cream)" : "var(--sk-ink)",
                border:
                  b.side === "agent"
                    ? "1px solid var(--sk-hairline)"
                    : "1px solid transparent",
                borderBottomRightRadius: b.side === "buyer" ? 6 : undefined,
                borderBottomLeftRadius: b.side === "agent" ? 6 : undefined,
              }}
            >
              {b.text}
            </div>
          </motion.div>
        ))}

        {/* Trailing typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            delay: 0.25 + CHAT_SCRIPT.length * 0.55 + 0.15,
            duration: 0.4,
          }}
          className="flex justify-start"
        >
          <div
            className="flex items-center gap-1 rounded-2xl px-3 py-2.5"
            style={{
              background: "var(--sk-cream)",
              border: "1px solid var(--sk-hairline)",
              borderBottomLeftRadius: 6,
            }}
          >
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--sk-ink40)" }}
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: d * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Step 2 visual · Cal.com slot card
// ──────────────────────────────────────────────────────────────────────

function CalSlotCard() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: "var(--sk-cream)",
        border: "1px solid var(--sk-hairline)",
        boxShadow:
          "0 1px 0 rgba(20,20,20,0.04), 0 24px 48px -28px rgba(20,20,20,0.18)",
      }}
    >
      {/* Top row: brand + live dot */}
      <div className="mb-5 flex items-center justify-between">
        <span
          className="sk-font-meta"
          style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
        >
          CAL.COM · 30 MIN
        </span>
        <span className="flex items-center gap-1.5">
          <motion.span
            aria-hidden
            className="relative inline-block h-2 w-2 rounded-full"
            style={{ background: "#22c55e" }}
            animate={{ scale: [1, 1.45, 1], opacity: [1, 0.85, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="sk-font-meta"
            style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
          >
            SLOT OPEN
          </span>
        </span>
      </div>

      {/* Day pills (one highlighted) */}
      <div className="mb-5 flex gap-1.5">
        {[
          { d: "Mon", on: false },
          { d: "Tue", on: false },
          { d: "Wed", on: true },
          { d: "Thu", on: false },
          { d: "Fri", on: false },
        ].map((p) => (
          <div
            key={p.d}
            className="sk-font-meta flex h-9 flex-1 items-center justify-center rounded-xl"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              color: p.on ? "var(--sk-cream)" : "var(--sk-ink60)",
              background: p.on ? "var(--sk-red)" : "transparent",
              border: p.on
                ? "1px solid var(--sk-red)"
                : "1px solid var(--sk-hairline)",
            }}
          >
            {p.d.toUpperCase()}
          </div>
        ))}
      </div>

      {/* The featured slot */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid var(--sk-ink20)" }}
      >
        <p
          className="sk-font-meta"
          style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
        >
          WEDNESDAY · IST
        </p>
        <p
          className="sk-font-display mt-1"
          style={{
            fontSize: "2.25rem",
            color: "var(--sk-ink)",
            lineHeight: 1.05,
          }}
        >
          11:30 <span style={{ color: "var(--sk-ink60)" }}>AM</span>
        </p>
        <div
          className="mt-4 flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid var(--sk-hairline)" }}
        >
          <span
            className="sk-font-body"
            style={{ fontSize: "0.8rem", color: "var(--sk-ink)" }}
          >
            With Ehsan · Founder
          </span>
          <span
            className="sk-font-meta"
            style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
          >
            30 MIN
          </span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Step 3 visual · Agent live status card
// ──────────────────────────────────────────────────────────────────────

function AgentLiveCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: "var(--sk-cream)",
        border: "1px solid var(--sk-hairline)",
        boxShadow:
          "0 1px 0 rgba(20,20,20,0.04), 0 24px 48px -28px rgba(20,20,20,0.18)",
      }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <motion.span
              aria-hidden
              className="absolute inline-flex h-full w-full rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "#22c55e" }}
            />
          </span>
          <div className="flex flex-col">
            <span
              className="sk-font-body"
              style={{ fontSize: "0.9rem", color: "var(--sk-ink)" }}
            >
              Skillies Agent
            </span>
            <span
              className="sk-font-meta"
              style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
            >
              ONLINE · WHATSAPP BUSINESS API
            </span>
          </div>
        </div>
        <span
          className="sk-font-meta rounded-full px-2.5 py-1"
          style={{
            color: "var(--sk-cream)",
            background: "var(--sk-ink)",
            fontSize: "0.65rem",
            letterSpacing: "0.05em",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {LIVE_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              delay: 0.15 + i * 0.12,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-2xl p-3.5"
            style={{ background: "rgba(20,20,20,0.04)" }}
          >
            <p
              className="sk-font-display"
              style={{
                fontSize: "1.5rem",
                color: "var(--sk-ink)",
                lineHeight: 1.1,
              }}
            >
              <AnimatedNumber
                value={s.value}
                format={s.format}
                prefix={s.prefix}
                suffix={s.suffix}
                inView={inView}
              />
            </p>
            <p
              className="sk-font-meta mt-1.5"
              style={{ color: "var(--sk-ink60)", fontSize: "0.65rem" }}
            >
              {s.label.toUpperCase()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer ticker */}
      <div
        className="mt-5 flex items-center gap-2 pt-4"
        style={{ borderTop: "1px solid var(--sk-hairline)" }}
      >
        <motion.span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--sk-red)" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="sk-font-meta"
          style={{ color: "var(--sk-ink60)", fontSize: "0.7rem" }}
        >
          You don&apos;t write prompts. We operate the agent.
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Single timeline row · alternating side
// ──────────────────────────────────────────────────────────────────────

type StepSide = "left" | "right";

type StepRowProps = {
  index: number;
  number: string;
  title: string;
  body: string;
  side: StepSide;
  visual: React.ReactNode;
  cta?: { label: string; href: string };
};

const sideVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function StepRow({
  index,
  number,
  title,
  body,
  side,
  visual,
  cta,
}: StepRowProps) {
  // On desktop, "side" decides which column the TEXT lives in.
  // text-left at md+: right side  →  visual lives right of text  → text col 1
  // text-right anchored: text col 2, visual col 1
  const textOnRight = side === "right";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sideVariants}
      className="relative md:pl-16"
    >
      {/* Step bullet on the rail (desktop only) */}
      <div
        className="absolute hidden md:flex"
        style={{
          left: "calc(2rem - 11px)",
          top: 0,
          width: 22,
          height: 22,
        }}
      >
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.5,
            delay: 0.1 + index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="block h-full w-full rounded-full"
          style={{
            background: "var(--sk-red)",
            boxShadow: "0 0 0 6px var(--sk-cream)",
          }}
        />
      </div>

      {/* Two-column layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: textOnRight ? 32 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={textOnRight ? "md:order-2" : "md:order-1"}
        >
          <p
            className="sk-font-display"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              color: "var(--sk-red)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            {number}
          </p>
          <h3
            className="sk-font-section mt-2"
            style={{
              fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
              color: "var(--sk-ink)",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h3>
          <p
            className="sk-font-body mt-4 max-w-[520px]"
            style={{
              fontSize: "1rem",
              color: "var(--sk-ink60)",
              lineHeight: 1.6,
            }}
          >
            {body}
          </p>
          {cta ? (
            <Link
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
              className="sk-font-body group mt-5 inline-flex items-center gap-2"
              style={{
                fontSize: "0.95rem",
                color: "var(--sk-ink)",
                borderBottom: "1px solid var(--sk-ink)",
                paddingBottom: 2,
              }}
            >
              <span>{cta.label}</span>
              <motion.span
                aria-hidden
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </motion.span>
            </Link>
          ) : null}
        </motion.div>

        {/* VISUAL BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: textOnRight ? -32 : 32, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={textOnRight ? "md:order-1" : "md:order-2"}
        >
          {visual}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Section
// ──────────────────────────────────────────────────────────────────────

export default function B2BHowItWorks() {
  const railRef = useRef<HTMLDivElement>(null);
  const railInView = useInView(railRef, { once: true, amount: 0.05 });

  return (
    <section className="sk-section">
      <div className="sk-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-[720px] md:mb-24"
        >
          <p
            className="sk-font-meta mb-4"
            style={{ color: "var(--sk-ink60)" }}
          >
            HOW WE WORK
          </p>
          <h2
            className="sk-font-section"
            style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)" }}
          >
            From DM to live agent
            <br />
            <span className="sk-font-display-italic">in three moves.</span>
          </h2>
          <p
            className="sk-font-body mt-5 max-w-[560px]"
            style={{
              fontSize: "1.05rem",
              color: "var(--sk-ink60)",
              lineHeight: 1.55,
            }}
          >
            No drag-and-drop chatbot builder. No &ldquo;configure your bot&rdquo;
            wizard. We build it. You run your business.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={railRef} className="relative">
          {/* Vertical rail (desktop only) */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={railInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-8 top-3 bottom-3 hidden w-px origin-top md:block"
            style={{ background: "var(--sk-red)", opacity: 0.85 }}
          />

          <div className="flex flex-col gap-20 md:gap-32">
            <StepRow
              index={0}
              number="01"
              side="right"
              title="Try the agent on yourself"
              body="DM our public WhatsApp or open a vertical demo. The agent qualifies you the way it'll qualify your customers — voice notes, photos, language switching, the works. No sales call needed to see it work."
              visual={<ChatPreview />}
              cta={{
                label: "Try it now",
                href: "https://wa.me/918089941131?text=Hi%2C%20I%20want%20to%20try%20the%20agent",
              }}
            />
            <StepRow
              index={1}
              number="02"
              side="left"
              title="30 minutes with Ehsan"
              body="Founder-led discovery call. We scope your vertical, your KB, your integrations, your QC volumes. You leave with a Razorpay link and a build start date."
              visual={<CalSlotCard />}
              cta={{
                label: "Book a 30-min call",
                href: "https://cal.com/sager-zmd4kl/30min",
              }}
            />
            <StepRow
              index={2}
              number="03"
              side="right"
              title="Live in 7-14 days"
              body="We build, train, and operate your agent on your WhatsApp Business API number. You don't write prompts. You don't manage a chatbot. You run your business."
              visual={<AgentLiveCard />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
