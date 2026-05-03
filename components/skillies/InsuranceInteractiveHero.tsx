"use client";

/**
 * InsuranceInteractiveHero — bespoke hero for /for/insurance.
 *
 * Why a bespoke hero on this single page?
 *  - Insurance is the highest-stakes vertical we sell into. Buyers want
 *    proof, not promise. The founder asked for a hero that *plays out*
 *    real situations — five different ones — instead of one frozen
 *    screenshot. Think Apple product-page demo, but in WhatsApp aesthetic
 *    and tuned to insurance-broker pain.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────┬──────────────────┐
 *   │ eyebrow                      │  [tab pill bar]  │
 *   │ trust line                   │                  │
 *   │ HEADLINE LEAD                │  Phone-frame     │
 *   │ headline emphasis (italic)   │  WhatsApp chat   │
 *   │ HEADLINE TAIL                │  (animated)      │
 *   │ subhead (50ch)               │                  │
 *   │ [primary CTA] [secondary]    │  caption (italic)│
 *   └──────────────────────────────┴──────────────────┘
 *           ~50%                            ~50%
 *
 * Mobile (< 768px):
 *   - Stacked: text first, then the interactive demo.
 *   - Tab pills horizontal-scroll if they overflow.
 *
 * Interaction:
 *  - 5 SCENARIOS (declared at top of file) — visitor clicks a tab to
 *    switch. The chat thread resets and replays through Framer Motion's
 *    AnimatePresence keyed on scenario index.
 *  - Each agent message is preceded by a brief typing-dots placeholder
 *    (~600ms) before the bubble appears. This is implemented entirely
 *    via per-message Framer Motion delays — no setTimeout chains.
 *
 * Reduced motion: all message reveals collapse to instant fade-in. The
 * typing indicator is suppressed (its keyframe animation is skipped).
 *
 * Strict TypeScript, no `any`. Single default export. No external icons.
 */

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ─────────────────────────── Scenario data ───────────────────────────
   All 5 emotional-resonance scenarios for the insurance vertical.
   Verbatim from the brief — do not paraphrase. */

type Sender = "buyer" | "agent";

type TextMessage = {
  kind: "text";
  from: Sender;
  text: string;
};

type CardMessage = {
  kind: "card";
  from: Sender;
  title: string;
  /** 2-3 short spec lines, rendered as a stacked list inside the card. */
  specs: string[];
};

type LinkCardMessage = {
  kind: "linkcard";
  from: Sender;
  title: string;
  subtitle: string;
};

type VoiceNoteMessage = {
  kind: "voicenote";
  from: Sender;
  durationLabel: string;
  /** Caption shown next to the waveform — what the buyer "said". */
  spokenLabel: string;
};

type ImageUploadMessage = {
  kind: "image";
  from: Sender;
  filename: string;
};

type Message =
  | TextMessage
  | CardMessage
  | LinkCardMessage
  | VoiceNoteMessage
  | ImageUploadMessage;

type Scenario = {
  /** Tab pill label (short — must fit in horizontal pill bar). */
  tabLabel: string;
  /** What plays out below the chat — the "what just happened" italic line. */
  caption: string;
  /** Ordered chat thread. */
  messages: Message[];
};

const SCENARIOS: readonly Scenario[] = [
  /* ── 1 · 11:30 PM diabetic father (default · open on load) ────────── */
  {
    tabLabel: "Pre-existing condition · 11:30 PM",
    caption:
      "What just happened: pre-existing-disease conversation handled at 11:30 PM with IRDAI-compliant phrasing, three plans matched against the stated condition, tele-medical scheduled — all in under 90 seconds without a human awake.",
    messages: [
      {
        kind: "text",
        from: "buyer",
        text:
          "Need health cover for my father. He's 62 and diabetic for 10 years. 11:30 PM here, sorry for the late message.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Not late at all — I work 24/7. To match the right plan I need 3 quick things: his sugar reading on last test, current medication, and whether he's had any hospitalisation in 5 years.",
      },
      {
        kind: "text",
        from: "buyer",
        text: "HbA1c 7.2 last month. Metformin 500mg. No hospitalisation.",
      },
      {
        kind: "text",
        from: "agent",
        text: "Sending three plans tuned for stable Type-2 diabetic seniors:",
      },
      {
        kind: "card",
        from: "agent",
        title: "Niva Bupa Senior First",
        specs: [
          "₹38,400/yr · ₹10L cover",
          "2-year PED waiting period",
          "Loading 25%",
        ],
      },
      {
        kind: "card",
        from: "agent",
        title: "Star Senior Citizens Red Carpet",
        specs: [
          "₹42,900/yr · ₹10L cover",
          "1-year PED waiting period",
          "Loading 30%",
        ],
      },
      {
        kind: "card",
        from: "agent",
        title: "Care Plus Senior",
        specs: [
          "₹45,200/yr · ₹10L cover",
          "2-year PED waiting period",
          "Loading 25%",
        ],
      },
      {
        kind: "text",
        from: "agent",
        text:
          "All three CSR > 92% (FY25). Subject to medical underwriting. Want me to schedule a tele-medical for this week?",
      },
      { kind: "text", from: "buyer", text: "Sunday 11 AM works." },
      {
        kind: "text",
        from: "agent",
        text:
          "Booked. You'll get the meds-list + family-history form on WhatsApp by tomorrow morning.",
      },
    ],
  },

  /* ── 2 · The renewal that almost lapsed ───────────────────────────── */
  {
    tabLabel: "Renewal capture · 3 days before lapse",
    caption:
      "What just happened: customer almost lapsed his term plan. Eight months ago when this policy was sold, the agent filed an automatic 60d/30d/7d reminder cadence. Today the customer realises three days before lapse — agent has the policy number, premium, and Razorpay link ready in seconds. ₹47,200 trail-commission saved for life.",
    messages: [
      {
        kind: "text",
        from: "buyer",
        text: "Hey, my term insurance — is it expiring next month?",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Tata AIA Sampoorna Raksha · policy #TA-2023-1149 · renewal due in 3 days, not next month.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Reminder calendar I filed when you signed up in 2023: 60d → done · 30d → done · 7d → today.",
      },
      { kind: "text", from: "buyer", text: "Damn. Premium same as last year?" },
      {
        kind: "text",
        from: "agent",
        text:
          "Yes — ₹47,200 · paid annually. No medical re-underwriting needed since you're under 45 and no claims filed.",
      },
      {
        kind: "text",
        from: "agent",
        text: "Razorpay link below. Valid 72 hours.",
      },
      {
        kind: "linkcard",
        from: "agent",
        title: "Pay ₹47,200 · Tata AIA renewal",
        subtitle: "Policy #TA-2023-1149 · Razorpay · valid 72h",
      },
      { kind: "text", from: "buyer", text: "Paid." },
      {
        kind: "text",
        from: "agent",
        text:
          "Confirmed. New policy schedule + tax certificate in your email by EOD. Renewal calendar reset for 2027.",
      },
    ],
  },

  /* ── 3 · The voice note in Malayalam ──────────────────────────────── */
  {
    tabLabel: "Voice note · Mal/Hin/Tam",
    caption:
      "What just happened: 65-year-old uncle voice-noted in slurred Malayalam. Whisper transcribed it, agent identified renewal anxiety (not a complaint), pulled his file, offered three context-aware options with clear premium math in Mal — and routed to a Mal-speaking senior agent with full thread history. Younger team would've replied 'please type in English.'",
    messages: [
      {
        kind: "voicenote",
        from: "buyer",
        durationLabel: "0:28",
        spokenLabel:
          "mone, ente policy maaranamo? engane saathiyaakum...",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Transcribing your voice note · auto-detected Malayalam (regional dialect)…",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "I heard: “son, do I need to change my policy? how can I do it…” · is that right?",
      },
      { kind: "text", from: "buyer", text: "Athe." },
      {
        kind: "text",
        from: "agent",
        text:
          "Looking at your file: HDFC Life Click 2 Protect Super · ₹8,40,000 sum assured · 12 years remaining.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Three options · don't change (premium frozen at age-50 rate forever) · upgrade to ₹15L (new premium ₹14,200/yr) · port to ICICI iProtect Smart for similar cover at ₹11,800/yr. Which one feels right?",
      },
      {
        kind: "text",
        from: "buyer",
        text: "Ente premium koodumo upgrade cheythal?",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Athe — ₹4,200 koodum onnu kollum (about ₹350/month). Senior agent ke call cheyyikkattuo ennu vacha?",
      },
      { kind: "text", from: "buyer", text: "Yes please." },
      {
        kind: "text",
        from: "agent",
        text:
          "Agent Ramesh (15 years insurance experience) · he speaks Mal · scheduled for Monday 10 AM. Full context attached: your file, what you asked, the three options.",
      },
    ],
  },

  /* ── 4 · Adding mother to the floater ─────────────────────────────── */
  {
    tabLabel: "Mid-policy endorsement",
    caption:
      "What just happened: existing customer needed to add a hypertensive mother to a floater. Agent recalled the active policy, knew the carrier's endorsement rules, presented two routes with concrete premium math, and accepted a prescription image upload directly in the thread. No 'please email' redirect.",
    messages: [
      {
        kind: "text",
        from: "buyer",
        text:
          "Mom got diagnosed with hypertension yesterday. Can I add her to my floater?",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "I see your active floater — HDFC Ergo Optima Restore · ₹10L family-of-3 (you, wife, kid). Mother is 58.",
      },
      {
        kind: "text",
        from: "agent",
        text: "Yes, you can add her. Two routes:",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Route A · Endorsement (mid-term add) · pro-rata premium ₹14,400 for the remaining 7 months · 30-day waiting period for new HTN claims.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Route B · Add at next renewal · waits 4 months but premium proration reset · slightly cheaper net.",
      },
      { kind: "text", from: "buyer", text: "Difference?" },
      {
        kind: "text",
        from: "agent",
        text:
          "Route A starts cover from day 1 (except HTN-related for 30 days). Route B saves you ₹3,800 but mother stays uncovered for 4 months. With a fresh diagnosis, Route A is the safer call.",
      },
      { kind: "text", from: "buyer", text: "Route A." },
      {
        kind: "text",
        from: "agent",
        text:
          "Form pre-filled with your existing details. Need: her Aadhaar, latest BP reading, hypertension prescription. Upload here when ready.",
      },
      {
        kind: "image",
        from: "buyer",
        filename: "medical-prescription.jpg",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Got the prescription · valid · enalapril 5mg + amlodipine confirmed. Submitting endorsement to HDFC Ergo. ETA 48 hrs.",
      },
    ],
  },

  /* ── 5 · Family of 4 in 90 seconds ────────────────────────────────── */
  {
    tabLabel: "Family floater · 4 lives, 90 seconds",
    caption:
      "What just happened: four lives, three age bands, one chronic condition. Agent ran two underwriting structures, recommended the smarter one with reasoning, added a rider, returned a final number. Tele-counsellors typically take 30 minutes for this and skip the structure-B optimisation entirely.",
    messages: [
      {
        kind: "text",
        from: "buyer",
        text:
          "Looking for family health cover. Me 38, wife 35, son 8, my dad 65. Dad has BP.",
      },
      {
        kind: "text",
        from: "agent",
        text: "Got it — 4 lives, one with BP. Two structures, side-by-side:",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Structure A · One floater for all 4 → ₹38,400/yr ₹10L · loading 18% on dad's age + BP.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Structure B · Floater for 3 (you+wife+son ₹16,200/yr ₹10L) + standalone Senior Plan for dad (₹26,800/yr ₹5L) → Total ₹43,000/yr but dad's claim history doesn't affect family premium.",
      },
      {
        kind: "text",
        from: "agent",
        text:
          "Recommended: B. Dad's BP can mean rising premiums; isolating him keeps the family premium stable. ₹4,600/yr extra is cheaper than future re-rating shock.",
      },
      { kind: "text", from: "buyer", text: "What if I want NCB protection?" },
      {
        kind: "text",
        from: "agent",
        text:
          "Add ₹1,800/yr NCB-Protect rider — claim doesn't reset the no-claim bonus. Recommended on Structure B's family floater since you have a child.",
      },
      { kind: "text", from: "buyer", text: "Final number." },
      {
        kind: "text",
        from: "agent",
        text:
          "Annual ₹44,800 all-in (Structure B + NCB rider). Tele-medical for dad needed (90% pass-through for stable BP). Documents required.",
      },
    ],
  },
] as const;

/* ─────────────────────────── Motion variants ─────────────────────────
   Section-level fade-up + text-column stagger lifted from
   HeroBlockEditorial so the pages feel cohesive even though the right
   column is bespoke. */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

const textColumnVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

const demoColumnVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO, delay: 0.35 },
  },
};

/* ─────────────────────────── Component ───────────────────────────── */

export default function InsuranceInteractiveHero() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  const sectionInitial = reducedMotion ? "visible" : "hidden";
  const sectionAnimate = reducedMotion ? "visible" : undefined;

  const activeScenario = SCENARIOS[activeIndex];

  return (
    <motion.section
      id="hero-insurance-interactive"
      className="relative overflow-hidden"
      style={{
        background: "var(--sk-cream)",
        paddingTop: "clamp(64px, 9vw, 120px)",
        paddingBottom: "clamp(64px, 7vw, 96px)",
      }}
      variants={sectionVariants}
      initial={sectionInitial}
      animate={sectionAnimate}
      whileInView={reducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="sk-container">
        <div
          className="grid hero-insurance-grid"
          style={{
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* ─── Text column ─────────────────────────────────────── */}
          <motion.div
            className="order-first md:order-1"
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(20px, 1.6vw, 28px)",
            }}
            variants={textColumnVariants}
            initial={sectionInitial}
            animate={sectionAnimate}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.p
              variants={childVariants}
              className="sk-font-meta"
              style={{
                color: "var(--sk-insurance-navy)",
                letterSpacing: "0.18em",
                margin: 0,
              }}
            >
              SKILLIES FOR · INSURANCE
            </motion.p>

            <motion.p
              variants={childVariants}
              className="sk-font-editorial-italic"
              style={{
                color: "var(--sk-ink60)",
                fontSize: "0.9375rem",
                maxWidth: "42ch",
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              IRDAI-compliant disclaimers · Lifelong per-customer memory · 5
              Indian languages · Razorpay first-premium collection
            </motion.p>

            <motion.h1
              variants={childVariants}
              className="sk-font-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw + 1rem, 5rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--sk-ink)",
                margin: 0,
              }}
            >
              <span style={{ display: "block" }}>Answer the</span>
              <span
                className="sk-font-display-italic"
                style={{
                  display: "block",
                  color: "var(--sk-red)",
                }}
              >
                diabetic father&apos;s question
              </span>
              <span style={{ display: "block" }}>at 11 PM, in Malayalam.</span>
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="sk-font-body"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
                maxWidth: "50ch",
                margin: 0,
              }}
            >
              Skillies handles the four hardest insurance conversations —
              pre-existing-disease quoting, renewal recovery, voice-note
              triage, mid-policy endorsements — without a human awake.
              IRDAI-clean by default. Built for brokers and agencies who want
              to keep every commission rupee.
            </motion.p>

            <motion.div
              variants={childVariants}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <PrimaryCta
                label="See it qualify a lead live"
                href="/demo/insurance"
              />
              <SecondaryCta
                label="Book Ehsan"
                href="https://cal.com/sager-zmd4kl/30min"
              />
            </motion.div>
          </motion.div>

          {/* ─── Demo column (tab pills + phone-frame chat + caption) ── */}
          <motion.div
            className="order-last md:order-2"
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(16px, 1.6vw, 22px)",
              minWidth: 0,
            }}
            variants={demoColumnVariants}
            initial={sectionInitial}
            animate={sectionAnimate}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.15 }}
          >
            <TabBar
              scenarios={SCENARIOS}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />

            <PhoneFrame>
              <AnimatePresence mode="wait">
                <ChatThread
                  key={activeIndex}
                  scenario={activeScenario}
                  reducedMotion={reducedMotion ?? false}
                />
              </AnimatePresence>
            </PhoneFrame>

            <AnimatePresence mode="wait">
              <motion.p
                key={`cap-${activeIndex}`}
                className="sk-font-editorial-italic"
                style={{
                  color: "var(--sk-ink60)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.55,
                  margin: 0,
                  maxWidth: "60ch",
                }}
                initial={
                  reducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              >
                {activeScenario.caption}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Desktop grid override + animation keyframes. */}
      <style>{`
        @media (min-width: 768px) {
          #hero-insurance-interactive .hero-insurance-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: clamp(40px, 5vw, 80px) !important;
          }
        }
        @keyframes skInsAgentPulse {
          0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes skInsTypingDot {
          0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
          30%           { opacity: 1;    transform: translateY(-2px); }
        }
        @keyframes skInsWaveform {
          0%, 100% { transform: scaleY(0.4); }
          50%      { transform: scaleY(1);   }
        }
      `}</style>
    </motion.section>
  );
}

/* ─────────────────────────── TabBar ──────────────────────────────── */

function TabBar({
  scenarios,
  activeIndex,
  onSelect,
}: {
  scenarios: readonly Scenario[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Insurance scenarios"
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        // Native iOS-like inertia + hide scrollbars in webkit; keep
        // them visible on Firefox/desktop where they're less ugly.
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
      }}
    >
      {scenarios.map((s, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={s.tabLabel}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(i)}
            className="transition-colors duration-200"
            style={{
              flex: "0 0 auto",
              height: 36,
              paddingInline: 14,
              borderRadius: 999,
              background: isActive
                ? "var(--sk-insurance-navy)"
                : "transparent",
              color: isActive ? "#FFFFFF" : "var(--sk-ink60)",
              border: isActive
                ? "1px solid var(--sk-insurance-navy)"
                : "1px solid var(--sk-ink20)",
              fontFamily:
                "var(--font-inter), 'Inter', system-ui, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              letterSpacing: "-0.005em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {s.tabLabel}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── PhoneFrame ──────────────────────────── */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const accent = "var(--sk-insurance-navy)";
  const tint = "var(--sk-insurance-gold)";
  return (
    <div
      className="hero-ins-phone-frame relative w-full overflow-hidden rounded-[28px]"
      style={{
        // Mobile: 4:3 landscape-ish (a touch taller than the editorial
        // hero's 3:2 because we're packing more messages in).
        // Desktop override below pushes to 5:6 portrait.
        aspectRatio: "4 / 3",
        boxShadow:
          "0 32px 64px -24px rgba(20, 20, 20, 0.18), 0 8px 24px -12px rgba(20, 20, 20, 0.10)",
        background: `linear-gradient(135deg, color-mix(in srgb, ${tint} 35%, white), color-mix(in srgb, ${accent} 12%, white))`,
        padding: "clamp(14px, 2.5vw, 22px)",
        // The longer scenarios (e.g. mid-policy endorsement) need a real
        // minimum so the chat doesn't crush. The aspect ratio still
        // handles wide viewports — minHeight only kicks in below ~600px
        // viewport widths, where 4:3 would otherwise make this too short.
        minHeight: 420,
      }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[20px]"
        style={{
          background: "#FFFFFF",
          boxShadow: "inset 0 0 0 1px rgba(20, 20, 20, 0.08)",
        }}
      >
        {/* WhatsApp-style header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: accent, color: "#FFFFFF" }}
        >
          <div
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "rgba(255, 255, 255, 0.18)",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div
            className="flex flex-1 flex-col"
            style={{ minWidth: 0, lineHeight: 1.2 }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Skillies · Insurance
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                opacity: 0.85,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  animation: "skInsAgentPulse 2.2s ease-out infinite",
                }}
              />
              online · replying instantly
            </span>
          </div>
        </div>

        {/* Chat scroll area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 20, 20, 0.02) 0%, rgba(20, 20, 20, 0.04) 100%)",
            padding: "clamp(10px, 2vw, 16px)",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hero-ins-phone-frame {
            aspect-ratio: 5 / 6;
            min-height: 560px;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── ChatThread ──────────────────────────── */

/**
 * Renders an animated sequence of messages for one scenario.
 *
 * Pacing model (no setTimeout chains):
 *  - Each message gets a per-index delay computed once via useMemo.
 *  - Buyer messages: ~450ms apart (instant reply feel).
 *  - Agent messages: previous-end + ~600ms typing indicator + 450ms.
 *  - The "typing indicator" is a tiny inline component that renders ~600ms
 *    BEFORE its parent agent message appears. We hold a render-window per
 *    index, animated entirely with Framer Motion delays.
 *
 * Reduced motion: all delays collapse to 0; typing indicators are
 * hidden; messages fade in instantly.
 */
function ChatThread({
  scenario,
  reducedMotion,
}: {
  scenario: Scenario;
  reducedMotion: boolean;
}) {
  // Pre-compute timing offsets so message i has a fixed "appearAt" and
  // any preceding agent typing-dot has a fixed window. Per-message rather
  // than parent stagger so agent vs buyer get different pacing.
  const timing = useMemo(() => {
    const TYPING_MS = 600;
    const AGENT_GAP_MS = 450;
    const BUYER_GAP_MS = 450;

    const out: { appearAt: number; typingFrom: number | null }[] = [];
    let cursor = 0; // ms

    scenario.messages.forEach((msg, i) => {
      const isAgent = msg.from === "agent";
      // Don't show typing on the very first message; messages flow in fast.
      if (isAgent && i > 0) {
        const typingFrom = cursor + 120; // a tiny breath after prior msg
        cursor = typingFrom + TYPING_MS;
        out.push({ appearAt: cursor, typingFrom });
        cursor += AGENT_GAP_MS;
      } else {
        cursor += i === 0 ? 250 : BUYER_GAP_MS;
        out.push({ appearAt: cursor, typingFrom: null });
      }
    });

    return out;
  }, [scenario]);

  return (
    <motion.div
      // exit fade for the whole thread when scenario switches.
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(6px, 1.2vw, 10px)",
      }}
    >
      {scenario.messages.map((msg, i) => {
        const t = timing[i];
        const appearDelaySec = reducedMotion ? 0 : t.appearAt / 1000;
        const typingFromSec =
          reducedMotion || t.typingFrom == null
            ? null
            : t.typingFrom / 1000;
        const typingDurSec =
          typingFromSec == null ? 0 : appearDelaySec - typingFromSec;
        return (
          <div
            key={`${msg.kind}-${i}`}
            style={{
              alignSelf: msg.from === "buyer" ? "flex-end" : "flex-start",
              maxWidth: "86%",
            }}
          >
            {/* Typing indicator that appears BEFORE the message and
                exits as the message animates in. We rely on Framer
                Motion's keyframed opacity so we don't have to manage
                state. */}
            {typingFromSec != null && typingDurSec > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.96, 1, 1, 0.98],
                }}
                transition={{
                  delay: typingFromSec,
                  duration: typingDurSec,
                  times: [0, 0.18, 0.82, 1],
                  ease: EASE_OUT_EXPO,
                }}
                style={{
                  display: "inline-flex",
                  gap: 4,
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.06)",
                  marginBottom: 4,
                }}
                aria-hidden
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--sk-ink40)",
                      display: "inline-block",
                      animation: `skInsTypingDot 1.4s ${d * 0.16}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </motion.div>
            ) : null}

            <motion.div
              initial={
                reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.36,
                delay: appearDelaySec,
                ease: EASE_OUT_EXPO,
              }}
            >
              <MessageBody msg={msg} />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─────────────────────────── MessageBody ─────────────────────────── */

function MessageBody({ msg }: { msg: Message }) {
  const isBuyer = msg.from === "buyer";

  // Common bubble styles for text-like messages.
  const bubbleBase: React.CSSProperties = {
    padding: "8px 11px",
    borderRadius: 12,
    background: isBuyer ? "#dcf8c6" : "#FFFFFF",
    color: "var(--sk-ink)",
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.06)",
  };

  switch (msg.kind) {
    case "text":
      return <div style={bubbleBase}>{msg.text}</div>;

    case "card":
      return (
        <div
          style={{
            ...bubbleBase,
            background: "#FFFFFF",
            padding: "10px 12px",
            border: "1px solid var(--sk-ink10)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 220,
          }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--sk-ink)",
              lineHeight: 1.25,
            }}
          >
            {msg.title}
          </span>
          {msg.specs.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.75rem",
                color: "var(--sk-ink60)",
                lineHeight: 1.35,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      );

    case "linkcard":
      return (
        <div
          style={{
            ...bubbleBase,
            background: "#FFFFFF",
            padding: "10px 12px",
            border: "1px solid var(--sk-insurance-navy)",
            borderLeft: "3px solid var(--sk-insurance-navy)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 220,
          }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--sk-insurance-navy)",
              lineHeight: 1.25,
            }}
          >
            {msg.title}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--sk-ink60)",
              lineHeight: 1.35,
            }}
          >
            {msg.subtitle}
          </span>
        </div>
      );

    case "voicenote":
      return <VoiceNoteBubble msg={msg} isBuyer={isBuyer} />;

    case "image":
      return (
        <div
          style={{
            ...bubbleBase,
            background: isBuyer ? "#dcf8c6" : "#FFFFFF",
            padding: 6,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxWidth: 200,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "4 / 3",
              borderRadius: 8,
              background:
                "repeating-linear-gradient(135deg, color-mix(in srgb, var(--sk-insurance-navy) 8%, white) 0 8px, color-mix(in srgb, var(--sk-insurance-navy) 14%, white) 8px 16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sk-insurance-navy)",
            }}
            aria-hidden
          >
            <PhotoIcon />
          </div>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--sk-ink60)",
              paddingInline: 4,
            }}
          >
            [{msg.filename}]
          </span>
        </div>
      );
  }
}

function VoiceNoteBubble({
  msg,
  isBuyer,
}: {
  msg: VoiceNoteMessage;
  isBuyer: boolean;
}) {
  // 14 fake bars to suggest a waveform; heights vary deterministically.
  const bars = useMemo(() => {
    const heights = [
      0.4, 0.7, 0.9, 0.55, 0.8, 1.0, 0.65, 0.45, 0.85, 0.7, 0.5, 0.95, 0.6,
      0.4,
    ];
    return heights;
  }, []);

  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 12,
        background: isBuyer ? "#dcf8c6" : "#FFFFFF",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 220,
        maxWidth: 280,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--sk-insurance-navy)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <PlayIcon />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            height: 18,
          }}
          aria-hidden
        >
          {bars.map((h, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 2,
                background: "var(--sk-insurance-navy)",
                opacity: 0.55,
                height: `${Math.round(h * 100)}%`,
                animation: `skInsWaveform 1.3s ${i * 0.06}s ease-in-out infinite`,
                transformOrigin: "center",
                borderRadius: 1,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: "0.6875rem",
            color: "var(--sk-ink60)",
            flex: "0 0 auto",
          }}
        >
          {msg.durationLabel}
        </span>
      </div>
      <span
        style={{
          fontSize: "0.6875rem",
          fontStyle: "italic",
          color: "var(--sk-ink60)",
          lineHeight: 1.35,
        }}
      >
        {msg.spokenLabel}
      </span>
    </div>
  );
}

/* ─────────────────────────── Inline icons ────────────────────────── */

function PlayIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M2 1.5L8.5 5L2 8.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="2"
        y="3.5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="7.5" cy="9" r="1.6" fill="currentColor" />
      <path
        d="M3 16L8.5 11.5L12 14L15.5 10.5L20 15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────── CTAs ────────────────────────────────── */

function PrimaryCta({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
      style={{
        height: 50,
        paddingInline: 28,
        background: "var(--sk-red)",
        color: "var(--sk-cream)",
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}

function SecondaryCta({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full transition-colors duration-200"
      style={{
        height: 50,
        paddingInline: 28,
        border: "1px solid var(--sk-ink20)",
        color: "var(--sk-ink)",
        background: "transparent",
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </Link>
  );
}
