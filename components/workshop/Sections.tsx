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
    desc: "Meet the other people in the room betting on AI income. Short icebreaker — who you are, what you’re hoping to ship, and what’s been stopping you.",
    you: "You: arrive, settle, meet three people before the first session starts.",
  },
  {
    t: "10:30",
    end: "11:30",
    mins: 60,
    type: "Teach",
    title: "The KDP opportunity, in real numbers",
    desc: "The ₹8.72L breakdown, month by month. Which no-content categories are actually paying in 2026, which are dying, what Amazon’s algorithm rewards right now — and what it punishes.",
    tools: "Ehsan’s live dashboards · Publisher Rocket · KDP Reports",
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
    desc: "What to title your book so it actually shows up. How to price it so it sells. How to earn the first ten reviews ethically — because without them, Amazon won’t rank you.",
    tools: "Keyword vault · pricing calculator · review ethics checklist",
  },
  {
    t: "16:00",
    end: "16:30",
    mins: 30,
    type: "Pitch",
    title: "Close · Next-cohort enrollment",
    desc: "If the day has you ready to go deeper, this is when I walk through the 50-day program — Standard at ₹75,000, Pro 1-on-1 track at ₹1,25,000. Full details, honest numbers, no pressure. Walk out, or sign up — either way you leave with a live book.",
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
          Tight schedule. No lecture mode. You leave with a book on Amazon, not a binder of theory. Here’s exactly what happens, minute by minute.
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
  "Priority seat in the next cohort",
  "Private WhatsApp group (60 days)",
];
const REGULAR = [
  "Full day (10 AM – 4 PM)",
  "Malabar biryani lunch",
  "Your first book live on Amazon",
  "Cover & keyword templates",
  "Next-cohort invitation",
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
            <PrimaryButton
              href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20ready%20to%20reserve%20my%20seat%20at%20the%20Calicut%20workshop%20on%20May%2031%20%E2%80%94%20%E2%82%B91%2C999%20early%20bird.%20Please%20share%20the%20payment%20details.%20My%20name%20is%20"
              target="_blank"
              rel="noopener noreferrer"
            >
              Grab Early Bird Seat
            </PrimaryButton>
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
            <SecondaryButton
              href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20ready%20to%20reserve%20my%20seat%20at%20the%20Calicut%20workshop%20on%20May%2031%20%E2%80%94%20%E2%82%B92%2C499%20regular.%20Please%20share%20the%20payment%20details.%20My%20name%20is%20"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserve Regular
            </SecondaryButton>
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

type FaqEntry = {
  q: string;
  short?: string; // italic serif one-liner summary
  a: string;
  pullQuote?: string;
};

const FAQS: FaqEntry[] = [
  {
    q: "I've never written a book. Can I still do this?",
    short: "Yes. That's the whole point.",
    a: "No-content books — spot the difference, puzzles, coloring — don't need writing. You're designing and curating, not authoring. If you can open a browser, follow a workflow, and click Upload, you can publish. That's it.",
    pullQuote: "If you can use a browser, you can publish.",
  },
  {
    q: "Do I need to fluent English?",
    short: "Basic English is enough.",
    a: "KDP's interface is in English and the workshop is taught in plain English — no jargon, no lecture-mode. If you can read an Amazon product listing, you'll be fine. I'll keep it simple.",
  },
  {
    q: "Will Amazon actually pay me? How does that work?",
    short: "Yes. Monthly. In INR, straight to your bank.",
    a: "Amazon deposits royalties directly to your Indian bank account every month. You need a PAN card, a bank account, and your KDP tax info filled in — that's the whole setup. We walk through every form live so nobody leaves confused.",
    pullQuote: "It's KDP + PAN + bank. That's the whole stack.",
  },
  {
    q: "How long until my first royalty?",
    short: "First book ships the same day. First payout: ~60 days.",
    a: "Your first book goes live on Amazon at the end of the workshop. Your first royalty deposit lands within ~60 days of your first sale. Month one is usually ₹500–2,000 — small, but real, and it compounds every month you keep publishing.",
  },
  {
    q: "What's the catch with ₹1,999?",
    short: "No catch. Early-bird pricing ends May 10.",
    a: "₹1,999 is a genuine early-bird drop to fill seats before May 10. After that it goes back to ₹2,499. No hidden fees, no upsell pressure during the day. At 4 PM I'll walk through the 50-day program (Standard ₹75,000 / Pro ₹1,25,000) — entirely optional, walk out if you'd like.",
  },
  {
    q: "Is this a pyramid / MLM / hype thing?",
    short: "No. You're publishing real books to real readers.",
    a: "You're uploading paperbacks to Amazon. Global readers buy them. Amazon pays you royalties. There's no network to join, no downline to recruit, no 'course about selling courses.' The proof is my own dashboard — ₹8,71,982 across 63 titles, all verifiable.",
    pullQuote: "No downline. No recruiting. Just books on Amazon.",
  },
];

function FaqRow({ item, i }: { item: FaqEntry; i: number }) {
  const num = String(i + 1).padStart(2, "0");
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 0.9fr) 1.4fr",
        gap: 56,
        padding: "44px 0",
        borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.10)",
      }}
    >
      {/* Left: question */}
      <div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginBottom: 10,
          }}
        >
          Q · {num}
        </div>
        <h3
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 2.6vw, 36px)",
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            color: "#1A1A1A",
            margin: "0 0 10px",
          }}
        >
          &ldquo;{item.q}&rdquo;
        </h3>
        {item.short && (
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.5,
              fontStyle: "italic",
              fontFamily: "'Instrument Serif', serif",
            }}
          >
            {item.short}
          </p>
        )}
      </div>

      {/* Right: answer */}
      <div>
        <p
          style={{
            fontSize: 16,
            color: "#3f3f46",
            lineHeight: 1.8,
            margin: 0,
            maxWidth: 580,
          }}
        >
          {item.a}
        </p>
        {item.pullQuote && (
          <blockquote
            style={{
              marginTop: 18,
              marginLeft: 0,
              paddingLeft: 18,
              borderLeft: "2px solid #C9A24E",
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.45,
              color: "#8a6a1f",
            }}
          >
            {item.pullQuote}
          </blockquote>
        )}
      </div>
    </article>
  );
}

export function WorkshopFAQ() {
  return (
    <section id="faq" style={{ padding: "128px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Editorial masthead */}
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
          § Q &amp; A · The Honest Column
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Six questions, straight answers.</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 44,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 900,
              color: "#1A1A1A",
              margin: 0,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
            }}
          >
            What people actually ask,{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#C62828",
              }}
            >
              answered straight.
            </em>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 420,
            }}
          >
            Every answer here comes from a real WhatsApp message I’ve already replied to. If yours isn’t below, ask me — I still reply personally.
          </p>
        </div>

        {/* The Q&A column */}
        <div
          style={{
            borderTop: "2px solid #1A1A1A",
            borderBottom: "2px solid #1A1A1A",
          }}
        >
          {FAQS.map((item, i) => (
            <FaqRow key={i} item={item} i={i} />
          ))}
        </div>

        {/* Signature + CTA */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 28,
                color: "#1A1A1A",
                lineHeight: 1,
              }}
            >
              — Ehsan
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#6B7280",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              Founder · Replies personally
            </div>
          </div>
          <a
            href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%20have%20a%20question%20about%20the%20Calicut%20workshop%20on%20May%2031.%20My%20name%20is%20"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 24px",
              background: "#1A1A1A",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Ask your own question →
          </a>
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
          href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20ready%20to%20reserve%20my%20seat%20at%20the%20Calicut%20workshop%20on%20May%2031%20%E2%80%94%20%E2%82%B91%2C999%20early%20bird.%20Please%20share%20the%20payment%20details.%20My%20name%20is%20"
          target="_blank"
          rel="noopener noreferrer"
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
      className="skillies-sticky-cta"
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
        href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20ready%20to%20reserve%20my%20seat%20at%20the%20Calicut%20workshop%20on%20May%2031%20%E2%80%94%20%E2%82%B91%2C999%20early%20bird.%20Please%20share%20the%20payment%20details.%20My%20name%20is%20"
        target="_blank"
        rel="noopener noreferrer"
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
