"use client";

/**
 * B2BHowItWorks — motion-rich vertical timeline that walks through the
 * actual B2B journey.
 * 
 * Visual uplift (v4):
 *  - Added spring-based high-performance smooth animations.
 *  - Parallax timeline rail for better depth.
 *  - Floating micro-animations for visual cards.
 *  - Refined chat and slot reveals.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";

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

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  restDelta: 0.001
} as const;

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
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, mv, value]);

  return <span>{display}</span>;
}

function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      animate={!reduced ? {
        y: [0, -10, 0],
      } : {}}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(20,20,20,0.08)] bg-white border border-sk-hairline will-change-transform"
    >
      <div className="mb-6 flex items-center gap-4 pb-4 border-b border-sk-hairline">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sk-ink text-sk-cream shadow-md">
          <span className="sk-font-display text-lg font-bold">S</span>
        </div>
        <div className="flex flex-col">
          <span className="sk-font-body font-bold text-sk-ink">Demo Agent</span>
          <span className="sk-font-meta flex items-center gap-2 text-sk-ink40 text-[10px] tracking-widest font-black">
            <motion.span 
              className="w-2 h-2 rounded-full bg-green-500" 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity }} 
            />
            ACTIVE NOW
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {CHAT_SCRIPT.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ 
              delay: 0.5 + i * 0.4, 
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`flex ${b.side === "buyer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="sk-font-body max-w-[85%] rounded-2xl px-5 py-3 shadow-sm"
              style={{
                fontSize: "0.9375rem",
                background: b.side === "buyer" ? "var(--sk-ink)" : "var(--sk-cream)",
                color: b.side === "buyer" ? "var(--sk-cream)" : "var(--sk-ink)",
                borderRadius: b.side === "buyer" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                border: b.side === "agent" ? "1px solid var(--sk-hairline)" : "none",
              }}
            >
              {b.text}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CalSlotCard() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={!reduced ? {
        y: [0, 10, 0],
      } : {}}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(20,20,20,0.08)] bg-white border border-sk-hairline will-change-transform"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="sk-font-meta text-sk-ink40 font-black text-[10px]">DISCOVERY CALL</span>
        <div className="flex items-center gap-2 sk-glass px-3 py-1.5 rounded-full border border-green-500/20">
          <motion.span 
            className="w-2 h-2 rounded-full bg-green-500" 
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
            transition={{ duration: 2, repeat: Infinity }} 
          />
          <span className="sk-font-meta text-green-600 text-[10px] font-black">SLOT AVAILABLE</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-5 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
          <div
            key={d}
            className={`sk-font-meta flex h-12 flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${i === 2 ? "bg-sk-red border-sk-red text-sk-cream shadow-lg" : "bg-sk-cream/50 border-sk-hairline text-sk-ink40"}`}
          >
            <span className="text-[10px] font-black">{d.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div className="sk-glass rounded-3xl p-6 border border-sk-ink/5">
        <p className="sk-font-meta text-sk-ink40 text-[10px] font-black mb-1">AVAILABLE TIME</p>
        <p className="sk-font-display text-4xl text-sk-ink">11:30 <span className="text-sk-ink20">AM</span></p>
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-sk-hairline">
          <span className="sk-font-body font-bold text-sk-ink text-sm">Ehsan · Founder</span>
          <span className="sk-font-meta text-[10px] text-sk-ink40 font-black">30 MINS</span>
        </div>
      </div>
    </motion.div>
  );
}

function AgentLiveCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      animate={!reduced ? {
        y: [0, -8, 0],
      } : {}}
      transition={{
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(20,20,20,0.08)] bg-white border border-sk-hairline will-change-transform"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <motion.span 
              className="absolute h-full w-full rounded-full bg-green-500" 
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} 
              transition={{ duration: 2, repeat: Infinity }} 
            />
            <span className="relative h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex flex-col">
            <span className="sk-font-body font-bold text-sk-ink">Live Agent</span>
            <span className="sk-font-meta text-sk-ink40 text-[10px] font-black uppercase">WhatsApp API Integrated</span>
          </div>
        </div>
        <span className="sk-font-meta bg-sk-red text-sk-cream px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg shadow-sk-red/20">LIVE</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {LIVE_STATS.map((s, i) => (
          <div key={s.label} className="bg-sk-cream/50 rounded-2xl p-5 border border-sk-hairline">
            <p className="sk-font-display text-2xl text-sk-ink">
              <AnimatedNumber value={s.value} format={s.format} prefix={s.prefix} suffix={s.suffix} inView={inView} />
            </p>
            <p className="sk-font-meta mt-2 text-sk-ink40 text-[9px] font-black leading-tight uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 pt-6 border-t border-sk-hairline">
        <span className="w-1.5 h-1.5 rounded-full bg-sk-red animate-pulse" />
        <span className="sk-font-meta text-sk-ink40 text-[10px] font-bold">Managed service · zero technical overhead</span>
      </div>
    </motion.div>
  );
}

function StepRow({
  index,
  number,
  title,
  body,
  side,
  visual,
  cta,
}: {
  index: number;
  number: string;
  title: string;
  body: string;
  side: "left" | "right";
  visual: React.ReactNode;
  cta?: { label: string; href: string };
}) {
  const isRight = side === "right";

  return (
    <div className="relative md:pl-24">
      {/* Timeline Dot */}
      <div className="absolute hidden md:flex left-[1.5rem] top-0 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
          className="h-6 w-6 rounded-full bg-sk-red border-[4px] border-sk-cream shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: isRight ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          className={isRight ? "md:order-2" : "md:order-1"}
        >
          <span className="sk-font-display text-7xl md:text-8xl text-sk-red opacity-[0.08] leading-none select-none block mb-[-1.5rem]">{number}</span>
          <h3 className="sk-font-section text-3xl text-sk-ink leading-tight mb-6">{title}</h3>
          <p className="sk-font-body text-sk-ink60 leading-relaxed mb-8">{body}</p>
          {cta && (
            <Link 
              href={cta.href} 
              className="sk-font-meta inline-flex items-center gap-3 text-sk-ink font-black text-sm border-b-2 border-sk-red pb-1 transition-all duration-300 hover:gap-5 hover:text-sk-red group"
            >
              {cta.label.toUpperCase()} <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: isRight ? -20 : 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className={isRight ? "md:order-1" : "md:order-2"}
        >
          {visual}
        </motion.div>
      </div>
    </div>
  );
}

export default function B2BHowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="how-it-works" ref={sectionRef} className="sk-section border-b border-sk-hairline">
      <div className="sk-container">
        <div className="max-w-3xl mb-24 md:mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sk-font-meta text-sk-ink40"
          >
            THE PROCESS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="sk-font-section mt-4 text-sk-ink sk-text-balance"
            style={{ fontSize: "var(--sk-text-h2)", lineHeight: 1.1 }}
          >
            From DM to live agent <br />
            <span className="sk-font-display-italic text-sk-red">in three moves.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="sk-font-body mt-6 text-sk-ink60"
            style={{ fontSize: "var(--sk-text-lead)", maxWidth: "55ch" }}
          >
            We don&apos;t give you a builder and a manual. We build, train, and operate 
            the agent for you. You focus on the sales, we focus on the physics.
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline Rail */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute hidden md:block left-[1.5rem] top-0 bottom-0 w-[2px] origin-top z-0"
            style={{ background: "linear-gradient(to bottom, var(--sk-red), var(--sk-ochre), transparent)" }}
          />

          <div className="space-y-32 md:space-y-48">
            <StepRow
              index={0}
              number="01"
              side="right"
              title="Try the agent on yourself"
              body="No sales decks. DM our demo agent and see it switch languages, handle complex queries, and qualify leads live. It's the exact same engine we'll ship for you."
              visual={<ChatPreview />}
              cta={{
                label: "DM the demo agent",
                href: "https://wa.me/918089941131?text=Hi%2C%20I%20want%20to%20try%20the%20agent",
              }}
            />
            <StepRow
              index={1}
              number="02"
              side="left"
              title="30 minutes with Ehsan"
              body="A founder-led scoping call. We define your knowledge base, your CRM integrations, and your language needs. You leave with a clear quote and a launch date."
              visual={<CalSlotCard />}
              cta={{
                label: "Book your slot",
                href: "https://cal.com/sager-zmd4kl/30min",
              }}
            />
            <StepRow
              index={2}
              number="03"
              side="right"
              title="Live in 7-14 days"
              body="We deploy your custom agent on your WhatsApp Business API. No code to write, no prompts to tweak. Just a dashboard to watch the closings happen."
              visual={<AgentLiveCard />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
