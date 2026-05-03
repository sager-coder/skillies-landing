/**
 * HeroChatPreview · animated WhatsApp-style chat preview that types itself
 * out on hero load. Replaces the static founder-quote card on homepage —
 * shows the product instead of describing it.
 *
 * Default · cycles through 3 vertical scenarios on the homepage.
 * lockTo · vertical-page mode · stays on one scenario (no cycling).
 */
"use client";

import { useEffect, useState } from "react";

type Bubble = {
  from: "user" | "agent";
  text: string;
  /** ms to "type" before fully appearing */
  typeMs?: number;
};

type Scenario = {
  key: string;
  vertical: string;
  accent: string;
  thread: Bubble[];
};

export type LockToVertical =
  | "real-estate"
  | "hajj"
  | "study-abroad"
  | "coaching"
  | "interiors"
  | "retail"
  | "insurance";

const SCENARIOS: Scenario[] = [
  {
    key: "real-estate",
    vertical: "Skillies for Real Estate",
    accent: "var(--sk-realestate-slate)",
    thread: [
      { from: "user", text: "Hi, saw your ad for Ocean Heights. 3BHK 1850 sqft still available?" },
      {
        from: "agent",
        text: "Yes — Tower B has 4 units left. Carpet 1,140 sqft (RERA), super 1,850 sqft. Possession Q3 2026 with OC. All-in ₹2.34 Cr inc. parking + GST + reg.",
      },
      { from: "user", text: "Site visit Saturday 11 AM possible?" },
      {
        from: "agent",
        text: "Booked. Sales head Rajesh confirms Sat 11 AM. Floor plan + RERA cert + bank-approval list incoming.",
      },
    ],
  },
  {
    key: "hajj",
    vertical: "Skillies for Hajj & Umrah",
    accent: "var(--sk-hajj-forest)",
    thread: [
      {
        from: "user",
        text: "Assalamu alaikum. Umrah package undo December-il? Family of 6 — vappakku 71, ummakku 68.",
      },
      {
        from: "agent",
        text: "Walaikum assalam. Vappakku BP/sugar undenkil Green Zone (Ajyad) recommend. Hotel Haram-leku 600 metre walk mathi, AC bus available. Total ekarakshena ₹3.6L per person.",
      },
      { from: "user", text: "Athey. Madinah ethra night?" },
      {
        from: "agent",
        text: "6 night Madinah · Movenpick Anwar, walking distance to Masjid an-Nabawi. Mu'allim Mecca + Madinah onnichu undakum, InshaAllah.",
      },
    ],
  },
  {
    key: "coaching",
    vertical: "Skillies for Coaching",
    accent: "var(--sk-coaching-indigo)",
    thread: [
      {
        from: "user",
        text: "Hi mera beta NEET 2027 ke liye coaching dhoondh raha hai. Fee structure bhej do.",
      },
      {
        from: "agent",
        text: "Beta ka Class 12 result aaya hai? Marks bata sakte hain to main exact batch (Foundation/Pinnacle/Dropper) ke fee aur faculty bhej deta hu.",
      },
      { from: "user", text: "489 marks. Drop year sochte hain. Kota ya home se?" },
      {
        from: "agent",
        text: "489 — strong dropper candidate. Pinnacle Dropper Phase-1 Kohinoor batch best fit. ₹3.45L total · EMI Propelld ₹14,800/mo over 24 months. Demo class Sat 11 AM book karu?",
      },
    ],
  },
  {
    key: "study-abroad",
    vertical: "Skillies for Study Abroad",
    accent: "var(--sk-studyabroad-navy)",
    thread: [
      {
        from: "user",
        text: "Hi · MS in Canada plan und. ente IELTS 6.5, Writing 5.5.",
      },
      {
        from: "agent",
        text: "Overall 6.5 nallathaanu — most Canadian universities accept. Pakshe Writing 5.5 visa-il problem aakum (SDS-il band-balance vendam). Re-test 4-6 weeks prep, OR pre-sessional English at university. Cost ariyaam, ipo decision veno?",
      },
      { from: "user", text: "Budget ₹25L per year mathram. Tier-2 universities show cheyyamo?" },
      {
        from: "agent",
        text: "6-uni shortlist anuppi · Trent, Brock, Ontario Tech, UNB, Memorial, Lakehead. Tuition ₹15-22L/yr range, scholarship-eligible. Sep 2026 / Jan 2027 — eth match aakum?",
      },
    ],
  },
  {
    key: "interiors",
    vertical: "Skillies for Modular Kitchen",
    accent: "var(--sk-interiors-terracotta)",
    thread: [
      {
        from: "user",
        text: "Hi · just got 2BHK in Whitefield, need full kitchen + 2 wardrobes. Budget around ₹5L.",
      },
      {
        from: "agent",
        text: "Got it. Could you send a photo of the empty kitchen? L-shape vs U-shape changes the quote. Also finish: laminate (₹3.8-4.2L), acrylic (₹4.5-5.2L), or PU (₹5.5-6.5L)?",
      },
      { from: "user", text: "[photo of empty kitchen] · acrylic preferred" },
      {
        from: "agent",
        text: "L-shape, ~9x10 ft, window left wall. Acrylic + brass handles · ₹4.6-5.0L kitchen, ₹1.2L for 2 wardrobes. Past project photos matching this style coming below. Designer Priya available Sat 11 AM or Sun 4 PM — book?",
      },
    ],
  },
  {
    key: "retail",
    vertical: "Skillies for Retail",
    accent: "var(--sk-retail-saffron)",
    thread: [
      {
        from: "user",
        text: "Hi · atta 5kg + 2L sunflower oil + 1kg sugar venam. Naale evening del-aano?",
      },
      {
        from: "agent",
        text: "Chechi, Aashirvaad atta 5kg ₹285, Sundrop 2L ₹420, sugar 1kg ₹52 — total ₹757. Naale evening 6-7pm del aakum, free above ₹500. UPI link aytho aanu COD aano?",
      },
      { from: "user", text: "UPI ayachu kollam." },
      {
        from: "agent",
        text: "Order confirm. Pay link · razorpay.me/skillies-demo. Delivery boy Rajesh — 98xxx-xxxxx. 6 PM-nu mumbu ethum.",
      },
    ],
  },
  {
    key: "insurance",
    vertical: "Skillies for Insurance",
    accent: "var(--sk-insurance-navy)",
    thread: [
      {
        from: "user",
        text: "Hi · ₹1 Cr term cover venam, age 38, non-smoker. Premium evidi range?",
      },
      {
        from: "agent",
        text: "Healthy non-smoker 38 male · ₹1 Cr term, 35-yr policy term · annual premium ₹14,000-22,000 across HDFC Life / ICICI Pru / Max Life / Tata AIA. Subject to medicals. Want carrier-by-carrier breakdown with CSR for each?",
      },
      { from: "user", text: "Athey. Mom-inu diabetes und, oru cover edukan plan und." },
      {
        from: "agent",
        text: "Diabetic parents-il health cover possible · loading 25-40%, 30-day waiting for diabetes claims. Niva Bupa + Star Health typically takes diabetic seniors warmly. Mom age + sugar levels share cheytho — 3 carriers compare cheyam.",
      },
    ],
  },
];

export default function HeroChatPreview({
  lockTo,
}: {
  /** When set, freezes the preview to one vertical scenario (no cycling). */
  lockTo?: LockToVertical;
} = {}) {
  // If lockTo is set, find the matching scenario and stay on it
  const lockedIdx = lockTo
    ? SCENARIOS.findIndex((s) => s.key === lockTo)
    : -1;
  const startIdx = lockedIdx >= 0 ? lockedIdx : 0;

  const [scenarioIdx, setScenarioIdx] = useState(startIdx);
  const [bubbleIdx, setBubbleIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const scenario = SCENARIOS[scenarioIdx]!;

  // Type bubbles in sequence, then pause, then next scenario
  useEffect(() => {
    if (paused) return;
    if (bubbleIdx < scenario.thread.length) {
      const t = setTimeout(
        () => setBubbleIdx((i) => i + 1),
        bubbleIdx === 0 ? 600 : 1800,
      );
      return () => clearTimeout(t);
    }
    // All bubbles shown — wait, then advance (or restart if locked)
    const t = setTimeout(() => {
      setBubbleIdx(0);
      if (lockedIdx >= 0) {
        // stay on locked scenario · don't cycle
      } else {
        setScenarioIdx((i) => (i + 1) % SCENARIOS.length);
      }
    }, 4500);
    return () => clearTimeout(t);
  }, [bubbleIdx, scenarioIdx, scenario.thread.length, paused, lockedIdx]);

  return (
    <aside
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: "var(--sk-ink)",
        border: "1px solid var(--sk-ink)",
        padding: "0",
        boxShadow:
          "0 24px 60px -20px rgba(20,20,20,0.25), 0 8px 20px -8px rgba(20,20,20,0.15)",
      }}
    >
      {/* Header strip · vertical name + status dot */}
      <div
        style={{
          padding: "18px 24px",
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#34D399",
              boxShadow: "0 0 12px rgba(52,211,153,0.6)",
              display: "inline-block",
              animation: "skPulse 1.6s ease-in-out infinite",
            }}
          />
          <p
            className="sk-font-meta"
            style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}
          >
            {scenario.vertical.toUpperCase()}
          </p>
        </div>
        {lockedIdx < 0 ? (
          <div className="hidden sm:flex" style={{ gap: 4 }}>
            {SCENARIOS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    i === scenarioIdx
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.2)",
                  transition: "background 300ms",
                }}
              />
            ))}
          </div>
        ) : (
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            LIVE
          </span>
        )}
      </div>

      {/* Chat bubbles */}
      <div
        style={{
          padding: "24px",
          minHeight: 360,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "var(--sk-ink)",
        }}
      >
        {scenario.thread.slice(0, bubbleIdx).map((b, i) => (
          <div
            key={`${scenarioIdx}-${i}`}
            className="sk-bubble-in"
            style={{
              alignSelf: b.from === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "10px 14px",
              borderRadius: 14,
              background:
                b.from === "user"
                  ? "var(--sk-red)"
                  : "rgba(255,255,255,0.08)",
              color:
                b.from === "user" ? "var(--sk-cream)" : "rgba(255,255,255,0.92)",
              fontSize: 14,
              lineHeight: 1.45,
              fontFamily:
                "var(--font-inter), 'Inter', system-ui, sans-serif",
              borderTopRightRadius: b.from === "user" ? 4 : 14,
              borderTopLeftRadius: b.from === "user" ? 14 : 4,
            }}
          >
            {b.text}
          </div>
        ))}

        {/* Typing indicator while waiting for next bubble */}
        {!paused &&
        bubbleIdx > 0 &&
        bubbleIdx < scenario.thread.length &&
        scenario.thread[bubbleIdx]?.from === "agent" ? (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "12px 16px",
              borderRadius: 14,
              borderTopLeftRadius: 4,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <span className="sk-typing-dot" />
            <span className="sk-typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="sk-typing-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        ) : null}
      </div>

      {/* Footer · attribution */}
      <div
        style={{
          padding: "14px 24px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          fontFamily:
            "var(--font-inter), 'Inter', system-ui, sans-serif",
          letterSpacing: "0.04em",
        }}
      >
        Real-time scoping · Skillies AI sales worker · Hover to pause
      </div>

      <style>{`
        @keyframes skBubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sk-bubble-in {
          animation: skBubbleIn 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes skPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes skTyping {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%           { transform: translateY(-3px); opacity: 1; }
        }
        .sk-typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          animation: skTyping 1s ease-in-out infinite;
        }
      `}</style>
    </aside>
  );
}
