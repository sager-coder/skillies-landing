"use client";

import React, { useEffect, useState } from "react";
import { Kicker, PrimaryButton, SecondaryButton, Wordmark, Grain } from "../design/Primitives";

type AgendaItem = {
  t: string;
  end: string;
  mins: number;
  type: "Intro" | "Teach" | "Build" | "Break" | "Pitch";
  title: string;
  desc: string;
  tools?: string;
  you?: string;
  variant?: "core" | "break" | "close";
};

const AGENDA: AgendaItem[] = [
  {
    t: "10:00",
    end: "10:30",
    mins: 30,
    type: "Intro",
    title: "Doors, chai, introductions",
    desc: "Meet the other people in the room betting on AI income. Short icebreaker — who you are, what you&apos;re hoping to ship, and what&apos;s been stopping you.",
    you: "You: arrive, settle, meet three people before the first session starts.",
  },
  {
    t: "10:30",
    end: "11:30",
    mins: 60,
    type: "Teach",
    title: "The KDP opportunity, in real numbers",
    desc: "The ₹8L breakdown, month by month. Which no-content categories are actually paying in 2026, which are dying, what Amazon&apos;s algorithm rewards right now — and what it punishes.",
    tools: "Ehsan&apos;s live dashboards · Publisher Rocket · KDP Reports",
  },
  {
    t: "11:30",
    end: "13:00",
    mins: 90,
    type: "Build",
    title: "Your first book — cover to upload",
    desc: "The heart of the day. We build one coloring or puzzle book per person, end-to-end. Claude writes prompts, Canva lays the pages out, KDP ingests the upload — all live, all together, nobody left behind.",
    tools: "Claude · Canva · KDP Create",
    you: "You: walk out of this session with a live Amazon listing URL.",
    variant: "core",
  },
  {
    t: "13:00",
    end: "14:00",
    mins: 60,
    type: "Break",
    title: "Lunch — Malabar biryani, included",
    desc: "Proper Kozhikode-style biryani. Cover reviews over the table. Questions nobody wanted to ask in front of the room. Some of the best paisa conversations happen here.",
    variant: "break",
  },
  {
    t: "14:00",
    end: "15:15",
    mins: 75,
    type: "Teach",
    title: "Scaling 1 book to 10 in 90 days",
    desc: "The stacking system I used to go from 1 book to 63. Reusable templates. Royalty math that actually compounds. The Amazon policy pitfalls that kill new accounts — and how to avoid every one.",
    tools: "Templates · royalty spreadsheet · Amazon policy deck",
  },
  {
    t: "15:15",
    end: "16:00",
    mins: 45,
    type: "Teach",
    title: "Keywords, pricing, first 10 reviews",
    desc: "What to title your book so it actually shows up. How to price it so it sells. How to earn the first ten reviews ethically — because without them, Amazon won&apos;t rank you.",
    tools: "Keyword vault · pricing calculator · review ethics checklist",
  },
  {
    t: "16:00",
    end: "16:30",
    mins: 30,
    type: "Pitch",
    title: "Close · The Founding Batch offer",
    desc: "Only people in this room today unlock the ₹45,000 founding-batch price for the 50-day program. Full details, honest numbers, no pressure. Walk out, or sign up — either way we send you home with a live book.",
    variant: "close",
  },
];

const TYPE_PALETTE: Record<
  AgendaItem["type"],
  { accent: string; soft: string; textOnSoft: string }
> = {
  Intro: { accent: "#5B7B5B", soft: "rgba(91,123,91,0.10)", textOnSoft: "#3D5A3D" },
  Teach: { accent: "#C62828", soft: "rgba(198,40,40,0.08)", textOnSoft: "#C62828" },
  Build: { accent: "#C9A24E", soft: "rgba(201,162,78,0.14)", textOnSoft: "#8a6a1f" },
  Break: { accent: "#8B5A2B", soft: "rgba(139,90,43,0.10)", textOnSoft: "#6B4020" },
  Pitch: { accent: "#1A1A1A", soft: "rgba(26,26,26,0.85)", textOnSoft: "#E6C178" },
};

function DayArc() {
  // Horizontal visualization of the 6-hour day with session blocks
  const startMins = 10 * 60; // 10:00
  const endMins = 16 * 60 + 30; // 16:30
  const total = endMins - startMins;
  return (
    <div
      style={{
        position: "relative",
        padding: "28px 4px 44px",
        marginBottom: 56,
      }}
    >
      {/* hour ticks */}
      <div
        style={{
          position: "relative",
          height: 8,
          borderRadius: 999,
          background: "rgba(26,26,26,0.06)",
          overflow: "hidden",
        }}
      >
        {AGENDA.map((it, i) => {
          const [sh, sm] = it.t.split(":").map(Number);
          const [eh, em] = it.end.split(":").map(Number);
          const start = sh * 60 + sm - startMins;
          const end = eh * 60 + em - startMins;
          const left = (start / total) * 100;
          const width = ((end - start) / total) * 100;
          const pal = TYPE_PALETTE[it.type];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${left}%`,
                width: `${width}%`,
                background: pal.accent,
                opacity: it.variant === "break" ? 0.35 : 0.85,
                borderRight:
                  i < AGENDA.length - 1
                    ? "1.5px solid rgba(255,255,255,0.7)"
                    : "none",
              }}
            />
          );
        })}
      </div>
      {/* hour labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "#9CA3AF",
          fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        {["10 AM", "11", "12", "1 PM", "2", "3", "4", "4:30"].map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function AgendaCard({ item, i }: { item: AgendaItem; i: number }) {
  const pal = TYPE_PALETTE[item.type];
  const isCore = item.variant === "core";
  const isBreak = item.variant === "break";
  const isClose = item.variant === "close";

  let cardBg = "white";
  let cardBorder = "1px solid rgba(26,26,26,0.08)";
  let cardShadow = "0 6px 18px rgba(0,0,0,0.03)";
  let textColor = "#1A1A1A";
  let descColor = "#6B7280";
  let timeColor = pal.accent;
  let toolsBg = "#FAF5EB";

  if (isCore) {
    cardBg =
      "linear-gradient(135deg, rgba(201,162,78,0.07) 0%, rgba(250,245,235,0.7) 100%)";
    cardBorder = "1.5px solid rgba(201,162,78,0.5)";
    cardShadow = "0 30px 70px rgba(201,162,78,0.18)";
  }
  if (isBreak) {
    cardBg =
      "linear-gradient(135deg, rgba(139,90,43,0.06) 0%, rgba(250,245,235,0.8) 100%)";
    cardBorder = "1px dashed rgba(139,90,43,0.28)";
  }
  if (isClose) {
    cardBg = "#1A1A1A";
    cardBorder = "1px solid rgba(255,255,255,0.08)";
    cardShadow = "0 30px 70px rgba(0,0,0,0.20)";
    textColor = "#FAF5EB";
    descColor = "rgba(255,255,255,0.6)";
    timeColor = "#E6C178";
    toolsBg = "rgba(255,255,255,0.05)";
  }

  return (
    <div style={{ position: "relative", display: "flex", gap: 28 }}>
      {/* Timeline dot + connector */}
      <div
        aria-hidden
        style={{
          position: "relative",
          width: 18,
          flexShrink: 0,
          paddingTop: 38,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 42,
            bottom: -12,
            left: 8,
            width: 2,
            background:
              i === AGENDA.length - 1
                ? "transparent"
                : "linear-gradient(to bottom, rgba(26,26,26,0.15), rgba(26,26,26,0.05))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 2,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: isCore
              ? "#C9A24E"
              : isClose
                ? "#1A1A1A"
                : "white",
            border: `2px solid ${pal.accent}`,
            boxShadow: isCore
              ? "0 0 0 4px rgba(201,162,78,0.25)"
              : "none",
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          padding: isCore ? "32px 36px" : "26px 30px",
          borderRadius: 22,
          background: cardBg,
          border: cardBorder,
          boxShadow: cardShadow,
          marginBottom: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isCore && (
          <div
            style={{
              position: "absolute",
              top: -1,
              right: -1,
              padding: "5px 14px",
              background: "#C9A24E",
              color: "#2a1f08",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 900,
              borderBottomLeftRadius: 14,
              borderTopRightRadius: 22,
            }}
          >
            The heart of the day
          </div>
        )}

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 42,
                color: timeColor,
                letterSpacing: "-0.03em",
                lineHeight: 0.85,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.t}
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: isClose ? "rgba(255,255,255,0.45)" : "#9CA3AF",
              }}
            >
              → {item.end}
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 999,
              background: isClose
                ? "rgba(255,255,255,0.08)"
                : pal.soft,
              color: isClose ? "#E6C178" : pal.textOnSoft,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: isClose ? "#E6C178" : pal.accent,
              }}
            />
            {item.type} · {item.mins} min
          </div>
        </div>

        <h3
          style={{
            fontSize: isCore ? 26 : 22,
            fontWeight: 800,
            color: textColor,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontSize: 15,
            color: descColor,
            margin: 0,
            lineHeight: 1.65,
          }}
          dangerouslySetInnerHTML={{ __html: item.desc }}
        />

        {(item.tools || item.you) && (
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: isClose
                ? "1px dashed rgba(255,255,255,0.15)"
                : "1px dashed rgba(26,26,26,0.12)",
              display: "grid",
              gap: 8,
            }}
          >
            {item.tools && (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: isClose ? "#E6C178" : pal.accent,
                    minWidth: 56,
                    paddingTop: 2,
                  }}
                >
                  Tools
                </span>
                <span
                  style={{ color: descColor, lineHeight: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: item.tools }}
                />
              </div>
            )}
            {item.you && (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: isClose ? "#E6C178" : pal.accent,
                    minWidth: 56,
                    paddingTop: 2,
                  }}
                >
                  You
                </span>
                <span
                  style={{
                    color: textColor,
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 14,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.you }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkshopAgenda() {
  return (
    <section id="agenda" style={{ padding: "128px 24px", background: "white" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § The Itinerary
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Sunday · May 31 · 2026</span>
        </div>

        <h2
          style={{
            fontSize: "clamp(44px, 5.5vw, 72px)",
            fontWeight: 900,
            color: "#1A1A1A",
            margin: "0 0 16px",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            maxWidth: 800,
          }}
        >
          Six hours.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            One book, live on Amazon
          </em>{" "}
          by the end.
        </h2>

        <p
          style={{
            fontSize: 17,
            color: "#6B7280",
            margin: "0 0 10px",
            lineHeight: 1.6,
            maxWidth: 620,
          }}
        >
          Tight schedule. No lecture mode. You leave with a book on Amazon, not a binder of theory. Here&apos;s exactly what happens, minute by minute.
        </p>

        <DayArc />

        <div>
          {AGENDA.map((item, i) => (
            <AgendaCard key={i} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const EARLY = [
  "Full day (10 AM – 4 PM)",
  "Malabar biryani lunch",
  "Your first book live on Amazon",
  "Cover & keyword templates",
  "Founding Batch access (₹45K pricing)",
  "Private WhatsApp group (60 days)",
];
const REGULAR = [
  "Full day (10 AM – 4 PM)",
  "Malabar biryani lunch",
  "Your first book live on Amazon",
  "Cover & keyword templates",
  "Standard Batch access",
  "Private WhatsApp group (60 days)",
];

export function WorkshopPricing() {
  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Kicker tone="gold">Seats</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 12px", letterSpacing: "-0.04em" }}>
            Two windows. One room.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div
            style={{
              padding: 36,
              borderRadius: 26,
              background: "white",
              border: "2px solid rgba(201,162,78,0.45)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(201,162,78,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#C9A24E",
                color: "#2a1f08",
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 16,
                letterSpacing: "0.2em",
              }}
            >
              EARLY BIRD
            </div>
            <Kicker tone="gold">Ends May 10</Kicker>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "20px 0 6px" }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", lineHeight: 1 }}>₹1,999</span>
              <span style={{ color: "#9CA3AF", textDecoration: "line-through", fontSize: 18 }}>₹2,499</span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Save ₹500. Same seat, same lunch, same outcome.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {EARLY.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A24E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <PrimaryButton>Grab Early Bird Seat</PrimaryButton>
          </div>
          <div style={{ padding: 36, borderRadius: 26, background: "white", border: "1px solid #F0E8D8" }}>
            <Kicker tone="red">Regular</Kicker>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", margin: "20px 0 6px", lineHeight: 1 }}>₹2,499</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Same day. Same seat. No early bird discount.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {REGULAR.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <SecondaryButton>Reserve Regular</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkshopLocation() {
  return (
    <section style={{ padding: "120px 24px", background: "#1A1A1A", color: "white", position: "relative" }}>
      <Grain opacity={0.05} />
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            aspectRatio: "4/3",
            borderRadius: 22,
            background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
            border: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
            <path d="M0 180 Q100 120 200 160 T400 140" stroke="#C62828" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40 60 L80 120 L140 90 L220 200 L300 180 L360 240" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 6" />
            <circle cx="220" cy="150" r="8" fill="#C62828" />
            <circle cx="220" cy="150" r="18" fill="none" stroke="#C62828" strokeWidth="2" opacity="0.5" />
            <circle cx="220" cy="150" r="28" fill="none" stroke="#C62828" strokeWidth="1" opacity="0.3" />
          </svg>
          <div style={{ position: "absolute", bottom: 22, left: 22 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.24em", color: "#7A9A7A", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 700 }}>Venue</p>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Hyatt Regency, Calicut</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>5 min from Calicut railway</p>
          </div>
        </div>
        <div>
          <Kicker tone="green-light">Where &amp; When</Kicker>
          <h2 style={{ fontSize: "clamp(44px, 5.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "16px 0 28px", lineHeight: 0.98 }}>
            Calicut. May 31.
            <br />
            <span style={{ color: "#EF4444" }}>10:00 AM sharp.</span>
          </h2>
          <div style={{ display: "grid", gap: 16, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>
            <div><strong style={{ color: "white" }}>Full day:</strong> 10 AM – 4 PM, with chai + Malabar biryani included</div>
            <div><strong style={{ color: "white" }}>Bring:</strong> Your laptop. Charger. Notebook.</div>
            <div><strong style={{ color: "white" }}>Language:</strong> English, plain and clear</div>
            <div><strong style={{ color: "white" }}>Seats:</strong> Hard-capped at 150 — no overflow</div>
            <div><strong style={{ color: "white" }}>You leave with:</strong> Your first book, live on Amazon.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "I've never written a book. Can I still do this?", a: "Yes — that's the entire point. No-content books don't require writing. You're designing and curating, not authoring. If you can use a browser, you can publish." },
  { q: "Do I need to know English fluently?", a: "Basic English is enough. KDP's interface is English and the workshop is taught in plain English — no jargon, no lecture-mode. If you can read a product listing on Amazon, you can do this." },
  { q: "Will Amazon actually pay me? How?", a: "Yes. Amazon pays directly to your Indian bank account, monthly, in INR. You need a PAN card and bank account — that's it. We walk through setup live." },
  { q: "How long until my first royalty?", a: "First book live: end of the workshop. First royalty payout: within 60 days of your first sale. Expect ₹500–2,000 in month one if you priced it right — small, but real and compounding." },
  { q: "What's the catch with ₹1,999?", a: "Early bird is a genuine price drop to fill seats before May 10. After that it's ₹2,499. No hidden fees, no upsell pressure. The Founding Batch (₹45,000) is optional and only offered at the end." },
  { q: "Is this a pyramid scheme / MLM / hype thing?", a: "No. You're publishing real books on Amazon, earning real royalties from global readers. We don't recruit, we don't sell courses about selling courses. Proof: 63 books, ₹8L+ earned by the founder, solo." },
];

export function WorkshopFAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" style={{ padding: "120px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Kicker tone="red">Real Questions</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 0", letterSpacing: "-0.04em", lineHeight: 1 }}>
            What people actually ask.
          </h2>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 18,
                  border: `1px solid ${isOpen ? "rgba(198,40,40,0.25)" : "#F0E8D8"}`,
                  overflow: "hidden",
                  transition: "border-color .25s",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    padding: "22px 28px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: isOpen ? "#C62828" : "#1A1A1A",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      border: "1px solid " + (isOpen ? "rgba(198,40,40,0.4)" : "#F0E8D8"),
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      transition: "transform .35s cubic-bezier(.22,1,.36,1)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#C62828" : "#1A1A1A"} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 28px 24px", fontSize: 15, color: "#6B7280", lineHeight: 1.65 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkshopTopBar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "14px 24px",
        background: "rgba(250,245,235,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(26,26,26,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Wordmark size={22} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
        <a href="#books" style={{ color: "inherit", textDecoration: "none" }}>Books</a>
        <a href="#agenda" style={{ color: "inherit", textDecoration: "none" }}>Agenda</a>
        <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>Pricing</a>
        <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <a
          href="#pricing"
          style={{
            padding: "8px 18px",
            background: "#C62828",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Reserve →
        </a>
      </div>
    </div>
  );
}

export function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        padding: "10px 14px 10px 20px",
        background: "#1A1A1A",
        color: "white",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        animation: "slideUp .4s ease-out",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500 }}>
        <strong style={{ color: "#EF4444" }}>89/150</strong> seats · Early bird ends May 10
      </span>
      <a
        href="#pricing"
        style={{
          padding: "10px 20px",
          background: "#C62828",
          color: "white",
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        Reserve ₹1,999 →
      </a>
    </div>
  );
}
