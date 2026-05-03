"use client";

/**
 * AgentInAction — three vertical-themed chat panels that loop continuously,
 * showing the same agent handling Real Estate, Insurance, and Coaching
 * conversations side-by-side. Above them: a live-feeling counter of
 * concurrent conversations across India; below them: a four-stat callout.
 *
 * The chat animation pattern per panel:
 *   typing dot → buyer message → typing dot → agent message → … → pause →
 *   reset (panel fades out, restarts from message 0).
 *
 * Each panel runs on its own React state machine so they don't sync up
 * mechanically — variation feels alive, sync feels like a slideshow.
 */

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── Data model ───────────────────────── */

type Sender = "buyer" | "agent";

type ChatMessage = {
  sender: Sender;
  text: string;
  /** Optional small caption rendered under the bubble (e.g. "image attached"). */
  meta?: string;
};

type Vertical = {
  key: string;
  label: string;
  scenario: string;
  /** Background color of the panel body. */
  bg: string;
  /** Accent color used for the agent avatar dot + buyer bubble. */
  accent: string;
  /** Color of the buyer bubble text against the accent. */
  accentInk: string;
  messages: ChatMessage[];
};

const VERTICALS: Vertical[] = [
  {
    key: "real-estate",
    label: "Real Estate",
    scenario: "2BHK floor plan inquiry",
    bg: "var(--sk-realestate-sandstone)",
    accent: "var(--sk-realestate-slate)",
    accentInk: "var(--sk-cream)",
    messages: [
      { sender: "buyer", text: "Got the brochure. Can I see the 2BHK floor plan?" },
      {
        sender: "agent",
        text: "Sending the 920 sq ft layout now — kitchen on the east, both bedrooms with attached bath.",
        meta: "1 image - floorplan-2bhk.png",
      },
      { sender: "buyer", text: "What about parking and the corner unit price?" },
      {
        sender: "agent",
        text: "Covered parking included. Corner unit is 78L all-in. Want me to block a site visit Saturday?",
      },
    ],
  },
  {
    key: "insurance",
    label: "Insurance",
    scenario: "Tata AIA term plan, family of four",
    bg: "var(--sk-cream)",
    accent: "var(--sk-insurance-navy)",
    accentInk: "var(--sk-cream)",
    messages: [
      { sender: "buyer", text: "Looking at Tata AIA Sampoorna Raksha. Worth it for me?" },
      {
        sender: "agent",
        text: "Pulling up your file — wife + two kids under 10, last income range you shared was 18-22L. So yes, 1.5Cr cover at this stage.",
      },
      { sender: "buyer", text: "You remember from last time?" },
      {
        sender: "agent",
        text: "Every conversation. I'll send the premium quote and the 3 riders worth adding. No double-asking.",
      },
    ],
  },
  {
    key: "coaching",
    label: "Coaching",
    scenario: "NEET batch result-day enquiries",
    bg: "var(--sk-coaching-chalk)",
    accent: "var(--sk-coaching-indigo)",
    accentInk: "var(--sk-cream)",
    messages: [
      { sender: "buyer", text: "Saw your result post. My daughter scored 612, repeating year. Batch open?" },
      {
        sender: "agent",
        text: "Congratulations — 612 is a strong base. Repeater batch starts 18th, two seats left in the morning section.",
      },
      { sender: "buyer", text: "Can she sit in for a demo class?" },
      {
        sender: "agent",
        text: "Booked her for Saturday 10am with Dr. Menon (Bio). I'll WhatsApp the address by evening.",
      },
    ],
  },
];

/* ──────────────────────── Top-level section ────────────────────── */

export default function AgentInAction() {
  return (
    <section
      id="agent-in-action"
      className="relative"
      style={{ background: "var(--sk-cream)" }}
    >
      <div className="sk-container py-24 md:py-32">
        <Header />
        <LiveTicker />
        <PanelGrid />
        <Callout />
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="max-w-[40ch]">
      <p className="sk-font-meta">Agent in action</p>
      <h2
        className="sk-font-section mt-3"
        style={{
          fontSize: "var(--sk-text-h2)",
          color: "var(--sk-ink)",
        }}
      >
        One agent. Five verticals. Every conversation.
      </h2>
    </div>
  );
}

/* ───────────────────────── Live ticker ─────────────────────────── */

function LiveTicker() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const id = window.setInterval(() => {
      // Random walk around 1247 — bounded so we never sit on the same value
      // for long but never spiral away from realistic.
      setCount((prev) => {
        const jitter = Math.floor(Math.random() * 31) - 15; // -15..+15
        const next = prev + jitter;
        // Soft clamp toward 1247 so the walk doesn't drift forever.
        if (next < 1180) return 1200;
        if (next > 1320) return 1300;
        return next;
      });
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="mt-8 inline-flex items-center gap-3 rounded-full"
      style={{
        background: "var(--sk-cream)",
        border: "1px solid var(--sk-hairline)",
        padding: "0.6rem 1.1rem",
      }}
    >
      <span
        aria-hidden
        className="relative inline-flex h-2 w-2"
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--sk-red)", animation: "pulse 1.6s ease-in-out infinite" }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: "var(--sk-red)" }}
        />
      </span>
      <p
        className="sk-font-body"
        style={{
          fontSize: "0.9375rem",
          color: "var(--sk-ink)",
          letterSpacing: "-0.005em",
        }}
      >
        Right now, agents are handling{" "}
        <span style={{ fontWeight: 600 }} className="tabular-nums">
          {count.toLocaleString("en-IN")}
        </span>{" "}
        <span style={{ color: "var(--sk-ink60)" }}>conversations across India</span>
      </p>
    </div>
  );
}

/* ──────────────────────── Panel grid ───────────────────────────── */

function PanelGrid() {
  return (
    <div
      className="mt-12 grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {VERTICALS.map((v, i) => (
        <ChatPanel key={v.key} vertical={v} startDelay={i * 0.6} />
      ))}
    </div>
  );
}

/* ──────────────────────── Single chat panel ─────────────────────
   State machine: visibleCount tracks how many messages are revealed.
   typing=true between message reveals. Each message dwells, the next
   typing-dot appears, then the next message reveals. After the final
   message, holds for ~3.5s then resets visibleCount→0 and loops.
*/

function ChatPanel({
  vertical,
  startDelay,
}: {
  vertical: Vertical;
  startDelay: number;
}) {
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
    };

    // Reduced-motion users see the full thread, no looping. Routed through
    // schedule() so the setState calls don't run synchronously inside the
    // effect body (matches react-hooks/set-state-in-effect).
    if (reduced) {
      schedule(() => {
        setVisibleCount(vertical.messages.length);
        setTyping(false);
      }, 0);
      return () => {
        cancelled = true;
        timeouts.forEach((id) => window.clearTimeout(id));
      };
    }

    const runCycle = () => {
      let t = startDelay * 1000;
      schedule(() => {
        setVisibleCount(0);
        setTyping(false);
      }, t);

      vertical.messages.forEach((_, idx) => {
        // Typing dot appears, then the message reveals 850ms later.
        schedule(() => setTyping(true), t);
        t += 850;
        schedule(() => {
          setTyping(false);
          setVisibleCount(idx + 1);
        }, t);
        // Dwell between messages.
        t += 1200;
      });

      // Hold the completed thread, then reset and loop.
      t += 2500;
      schedule(() => {
        if (!cancelled) runCycle();
      }, t);
    };

    runCycle();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [vertical.messages, startDelay, reduced]);

  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      style={{
        background: vertical.bg,
        border: "1px solid var(--sk-hairline)",
        minHeight: 460,
      }}
    >
      <PanelHeader vertical={vertical} />
      <div
        className="flex-1 px-4 pt-4 pb-5 sm:px-5"
        style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
      >
        <AnimatePresence mode="popLayout">
          {vertical.messages.slice(0, visibleCount).map((msg, idx) => (
            <ChatBubble
              key={`${vertical.key}-${idx}-${visibleCount}`}
              msg={msg}
              vertical={vertical}
            />
          ))}
        </AnimatePresence>
        {typing ? <TypingDots vertical={vertical} /> : null}
      </div>
    </motion.div>
  );
}

function PanelHeader({ vertical }: { vertical: Vertical }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-4"
      style={{
        borderBottom: "1px solid var(--sk-hairline)",
        background: "rgba(255, 255, 255, 0.35)",
      }}
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: vertical.accent,
          color: vertical.accentInk,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 600,
          fontSize: "0.95rem",
        }}
      >
        S
      </span>
      <div className="min-w-0">
        <p
          className="sk-font-body truncate"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--sk-ink)",
          }}
        >
          Skillies - {vertical.label}
        </p>
        <p
          className="sk-font-body truncate"
          style={{ fontSize: "0.75rem", color: "var(--sk-ink60)" }}
        >
          {vertical.scenario}
        </p>
      </div>
    </div>
  );
}

function ChatBubble({
  msg,
  vertical,
}: {
  msg: ChatMessage;
  vertical: Vertical;
}) {
  const isBuyer = msg.sender === "buyer";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      style={{
        alignSelf: isBuyer ? "flex-end" : "flex-start",
        maxWidth: "82%",
      }}
    >
      <div
        style={{
          background: isBuyer ? vertical.accent : "rgba(255,255,255,0.92)",
          color: isBuyer ? vertical.accentInk : "var(--sk-ink)",
          padding: "0.6rem 0.85rem",
          borderRadius: isBuyer
            ? "14px 14px 4px 14px"
            : "14px 14px 14px 4px",
          fontSize: "0.875rem",
          lineHeight: 1.4,
          letterSpacing: "-0.005em",
          fontFamily: "var(--font-geist-sans), Inter, system-ui, sans-serif",
          boxShadow: isBuyer ? "none" : "0 1px 0 rgba(20,20,20,0.04)",
        }}
      >
        {msg.text}
      </div>
      {msg.meta ? (
        <p
          className="sk-font-meta mt-1"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.06em",
            color: "var(--sk-ink60)",
            paddingLeft: isBuyer ? 0 : "0.25rem",
            paddingRight: isBuyer ? "0.25rem" : 0,
            textAlign: isBuyer ? "right" : "left",
          }}
        >
          {msg.meta}
        </p>
      ) : null}
    </motion.div>
  );
}

function TypingDots({ vertical }: { vertical: Vertical }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        alignSelf: "flex-start",
        background: "rgba(255,255,255,0.92)",
        padding: "0.6rem 0.85rem",
        borderRadius: "14px 14px 14px 4px",
        display: "inline-flex",
        gap: "4px",
        alignItems: "center",
      }}
      aria-label="Agent is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: vertical.accent,
            display: "inline-block",
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </motion.div>
  );
}

/* ──────────────────────── Bottom callout ───────────────────────── */

function Callout() {
  const stats: Array<{ value: string; label: string }> = [
    { value: "12k+", label: "messages / day" },
    { value: "5", label: "languages" },
    { value: "38ms", label: "median response" },
    { value: "0", label: "callers managed" },
  ];

  return (
    <motion.div
      className="mt-12 grid gap-y-6 rounded-2xl"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        background: "var(--sk-ink)",
        color: "var(--sk-cream)",
        padding: "2rem 2.25rem",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col"
          style={{
            // Subtle hairline separators between cells on wider screens.
            borderLeft:
              i === 0 ? "none" : "1px solid rgba(250, 245, 235, 0.12)",
            paddingLeft: i === 0 ? 0 : "1.25rem",
          }}
        >
          <span
            className="sk-font-display tabular-nums"
            style={{
              fontSize: "clamp(1.75rem, 2.4vw + 0.5rem, 2.5rem)",
              color: "var(--sk-cream)",
              lineHeight: 1,
            }}
          >
            {s.value}
          </span>
          <span
            className="sk-font-meta mt-2"
            style={{
              color: "rgba(250, 245, 235, 0.6)",
              letterSpacing: "0.08em",
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
