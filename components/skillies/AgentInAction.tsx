"use client";

/**
 * AgentInAction — three vertical-themed chat panels that loop continuously.
 * 
 * Visual uplift (v4):
 *  - Glassmorphism on panels and headers.
 *  - Refined typography and spacing.
 *  - Subtle gradients and better depth for bubbles.
 *  - More polished live indicator.
 */

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Sender = "buyer" | "agent";

type ChatMessage = {
  sender: Sender;
  text: string;
  meta?: string;
};

type Vertical = {
  key: string;
  label: string;
  scenario: string;
  bg: string;
  accent: string;
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

export default function AgentInAction() {
  return (
    <section
      id="agent-in-action"
      className="relative sk-grain border-b border-sk-hairline overflow-hidden"
      style={{ background: "var(--sk-cream)" }}
    >
      <div className="sk-container py-32 md:py-44">
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
    <div className="max-w-2xl">
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sk-font-meta"
      >
        Agent in action
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="sk-font-section mt-4 sk-text-balance"
        style={{
          fontSize: "var(--sk-text-h2)",
          color: "var(--sk-ink)",
          lineHeight: 1.1,
        }}
      >
        One agent. Five verticals. <br />
        <span className="text-sk-red">Every conversation remembered.</span>
      </motion.h2>
    </div>
  );
}

function LiveTicker() {
  const [count, setCount] = useState(1247);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setCount((prev) => {
        const jitter = Math.floor(Math.random() * 31) - 15;
        const next = prev + jitter;
        if (next < 1180) return 1200;
        if (next > 1320) return 1300;
        return next;
      });
    }, 5000); // Slower interval for better performance
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mt-10 inline-flex items-center gap-4 rounded-full sk-glass px-6 py-3"
    >
      <div className="relative flex h-3 w-3">
        <motion.span
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-full w-full rounded-full bg-sk-red opacity-75"
        />
        <span className="relative h-3 w-3 rounded-full bg-sk-red shadow-[0_0_8px_var(--sk-red)]" />
      </div>
      <p
        className="sk-font-body"
        style={{
          fontSize: "1rem",
          color: "var(--sk-ink)",
          letterSpacing: "-0.01em",
        }}
      >
        Currently handling{" "}
        <span style={{ fontWeight: 700 }} className="tabular-nums">
          {count.toLocaleString("en-IN")}
        </span>{" "}
        <span className="opacity-60">conversations live</span>
      </p>
    </motion.div>
  );
}

function PanelGrid() {
  return (
    <div
      className="mt-16 grid gap-8"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      }}
    >
      {VERTICALS.map((v, i) => (
        <div key={v.key} className={i > 0 ? "hidden lg:block" : ""}>
          <ChatPanel vertical={v} startDelay={i * 0.5} />
        </div>
      ))}
    </div>
  );
}

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
      let t = (startDelay * 1000) + 500;
      schedule(() => {
        setVisibleCount(0);
        setTyping(false);
      }, t);

      vertical.messages.forEach((_, idx) => {
        schedule(() => setTyping(true), t);
        t += 1000;
        schedule(() => {
          setTyping(false);
          setVisibleCount(idx + 1);
        }, t);
        t += 1500;
      });

      t += 3500;
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
      className="flex flex-col overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(20,20,20,0.05)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      style={{
        background: `linear-gradient(to bottom, white, ${vertical.bg})`,
        border: "1px solid var(--sk-hairline)",
        minHeight: 520,
      }}
    >
      <PanelHeader vertical={vertical} />
      <div
        className="flex-1 px-6 pt-6 pb-8"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <AnimatePresence initial={false}>
          {vertical.messages.slice(0, visibleCount).map((msg, idx) => (
            <ChatBubble
              key={`${vertical.key}-${idx}`}
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
      className="flex items-center gap-4 px-6 py-5 sk-glass border-b border-sk-hairline"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
        style={{
          background: vertical.accent,
          color: vertical.accentInk,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 700,
          fontSize: "1.1rem",
        }}
      >
        S
      </div>
      <div className="min-w-0">
        <p
          className="sk-font-body truncate font-bold"
          style={{
            fontSize: "0.95rem",
            color: "var(--sk-ink)",
          }}
        >
          {vertical.label} Agent
        </p>
        <p
          className="sk-font-body truncate opacity-60 italic"
          style={{ fontSize: "0.8rem" }}
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
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      style={{
        alignSelf: isBuyer ? "flex-end" : "flex-start",
        maxWidth: "85%",
      }}
    >
      <div
        className="shadow-sm"
        style={{
          background: isBuyer ? vertical.accent : "white",
          color: isBuyer ? vertical.accentInk : "var(--sk-ink)",
          padding: "0.8rem 1.1rem",
          borderRadius: isBuyer
            ? "20px 20px 4px 20px"
            : "20px 20px 20px 4px",
          fontSize: "0.9375rem",
          lineHeight: 1.5,
          letterSpacing: "-0.01em",
          border: isBuyer ? "none" : "1px solid var(--sk-hairline)",
        }}
      >
        {msg.text}
      </div>
      {msg.meta ? (
        <p
          className="sk-font-meta mt-2"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
            color: "var(--sk-ink40)",
            textAlign: isBuyer ? "right" : "left",
            fontWeight: 600,
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
      className="inline-flex gap-1.5 px-4 py-3 bg-white rounded-full border border-sk-hairline shadow-sm"
      aria-label="Agent is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: vertical.accent }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
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

function Callout() {
  const stats: Array<{ value: string; label: string }> = [
    { value: "12k+", label: "messages / day" },
    { value: "5", label: "languages" },
    { value: "38ms", label: "median response" },
    { value: "0", label: "callers managed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
      className="mt-20 grid gap-8 rounded-[2.5rem] sk-glass p-8 md:p-12"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col relative"
        >
          {i > 0 && (
            <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-sk-hairline hidden md:block opacity-30" />
          )}
          <span
            className="sk-font-display tabular-nums"
            style={{
              fontSize: "clamp(2rem, 3vw, 3.5rem)",
              color: "var(--sk-red)",
              lineHeight: 1,
            }}
          >
            {s.value}
          </span>
          <span
            className="sk-font-meta mt-3"
            style={{
              color: "var(--sk-ink40)",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
