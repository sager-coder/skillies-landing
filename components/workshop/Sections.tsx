"use client";

import React, { useEffect, useState } from "react";
import { Kicker, Wordmark, Grain } from "../design/Primitives";
import WorkshopReserveButton from "./WorkshopReserveButton";

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
    end: "10:20",
    mins: 20,
    type: "Intro",
    title: "Doors open · set up your laptop",
    desc: "Quick check-in. Open your laptop, get on the wifi, open Claude and Canva. No slides, no icebreakers — we start the real work in 20 minutes.",
    you: "You: arrive, log in, and meet the person next to you.",
  },
  {
    t: "10:20",
    end: "11:00",
    mins: 40,
    type: "Teach",
    title: "The ₹10,000 book",
    desc: "One spot-the-difference book. Built in two days. Earned ₹10,000. I walk you through the exact listing, the niche, why it worked, and the four KDP pillars (research · create · cover · upload) — so you know where today fits and what you still have to learn after.",
    tools: "Ehsan’s live KDP dashboard · that book’s listing · royalty screenshot",
  },
  {
    t: "11:00",
    end: "13:00",
    mins: 120,
    type: "Build",
    title: "Build your own spot-the-difference book",
    desc: "The heart of the day. Everyone in the room builds ONE real book, together with me. Claude writes the scene prompts, Canva lays the pages, we review interiors together before anyone moves on. By lunch, every person has a 30-page manuscript ready to upload.",
    tools: "Claude · Canva · one prompt stack · one layout template",
    you: "You: walk out of this session with a finished book interior saved to your laptop.",
    variant: "core",
  },
  {
    t: "13:00",
    end: "13:20",
    mins: 20,
    type: "Break",
    title: "Short reset",
    desc: "Stand up. Stretch. Grab something nearby if you need it. We come back sharp at 13:20 for the cover session — the most common reason KDP books don’t sell.",
    variant: "break",
  },
  {
    t: "13:20",
    end: "14:40",
    mins: 80,
    type: "Build",
    title: "Design the cover that actually sells",
    desc: "You design the cover for the book you just built. Typography rules that win thumbnail wars. Real before/afters from my own catalog. Live critique on every cover before anyone finishes.",
    tools: "Canva · cover template pack · the 5-rule thumbnail checklist",
    you: "You: walk out of this session with a full cover (front, spine, back) ready for KDP.",
    variant: "core",
  },
  {
    t: "14:40",
    end: "15:30",
    mins: 50,
    type: "Teach",
    title: "The path forward",
    desc: "We don’t have time to teach niche research and the full KDP upload end-to-end today — those are big chapters. What I give you: the exact path I followed, so you can shortcut my two years into about six months on your own. Tools I use, order I’d do it in, and the mistakes that cost me the most.",
    tools: "The six-month playbook · niche research cheat sheet · upload checklist",
  },
  {
    t: "15:30",
    end: "16:00",
    mins: 30,
    type: "Pitch",
    title: "If you want the short cut — the 30-day program",
    desc: "Everything I learned in two years, packaged as a 30-day guided cohort. Offline in Calicut or online — your choice. Full refund if you don’t think it’s worth it after the first two weeks. No pressure here — walk out, or sign up. Either way you leave with one real book + cover.",
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

export function WorkshopNextStep() {
  return (
    <section
      style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #1A1A1A 0%, #242424 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(201,162,78,0.18), transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(198,40,40,0.14), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 1040,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#E6C178",
              marginBottom: 14,
            }}
          >
            After the workshop
          </div>
          <h2
            style={{
              fontSize: "clamp(40px, 5vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.0,
              margin: "0 0 20px",
            }}
          >
            The workshop is the taste.{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#EF4444",
              }}
            >
              The 30-day program is the system.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              margin: "0 0 18px",
              maxWidth: 560,
            }}
          >
            Six hours teaches you one book + one cover. That&rsquo;s the hardest
            part to do alone, but it isn&rsquo;t the whole job. The 30-day
            cohort compresses everything I learned in{" "}
            <em style={{ color: "#E6C178", fontStyle: "italic" }}>
              two years
            </em>{" "}
            — niche research that finds books that actually earn, the full book
            stack across all three formats, KDP upload, scaling from 1 to 10+
            titles — into{" "}
            <em style={{ color: "#E6C178", fontStyle: "italic" }}>thirty days</em>.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "grid",
              gap: 10,
              fontSize: 14,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {[
              "Offline in Calicut · or online · your choice",
              "Weekly live sessions + daily asynchronous reviews",
              "Every book type — spot-the-diff, puzzles, coloring",
              "Full KDP upload walkthrough · niche research that pays",
              "Complete refund if you don't think it's worth it after 2 weeks",
            ].map((x) => (
              <li
                key={x}
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E6C178"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/#program"
              style={{
                padding: "13px 24px",
                background: "#EF4444",
                color: "white",
                textDecoration: "none",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              See the 30-day program →
            </a>
            <span
              style={{
                padding: "13px 18px",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
              }}
            >
              No pressure in the room · decide any time.
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "28px 30px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#EF4444",
              marginBottom: 10,
            }}
          >
            The refund promise
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: 26,
              lineHeight: 1.3,
              color: "white",
              margin: "0 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            &ldquo;Complete refund if you don&rsquo;t think it&rsquo;s worth
            it after the first two weeks.&rdquo;
          </div>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            No forms, no questions. Confidence looks like this. If I&rsquo;m
            wrong about this being worth your money, the money goes back.
            That&rsquo;s it.
          </p>
        </div>
      </div>
    </section>
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
            One book + cover, built in the room.
          </em>
        </h2>

        <p
          style={{
            fontSize: 17,
            color: "#6B7280",
            margin: "0 0 10px",
            lineHeight: 1.6,
            maxWidth: 640,
          }}
        >
          Six hours isn&rsquo;t enough to teach all four KDP pillars (niche · book · cover · upload). So we do the one that&rsquo;s hardest to learn alone — book + cover, together — and I hand you the exact path to do the rest at home. The full two-year system is the 30-day program afterwards.
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

const CORE_PERKS = [
  "Full day · 10 AM – 4 PM",
  "One spot-the-difference book, built in the room",
  "One full KDP cover, designed with you",
  "Claude prompt stack + Canva template pack",
  "The six-month playbook (path I followed in 2 years)",
  "Invitation to the 30-day cohort · refund-backed",
];
const VIP_EXTRAS = [
  "Front-row seat · premium view of every live build",
  "Signed copy of a best-selling KDP book from Ehsan's catalog",
  "Post-event WhatsApp group with Ehsan · 30 days direct access",
  "Priority seat in the 30-day cohort",
];

export function WorkshopPricing() {
  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Kicker tone="gold">Seats</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 12px", letterSpacing: "-0.04em" }}>
            Three windows. One room.
          </h2>
          <p style={{ fontSize: 15, color: "#6B7280", margin: "0 auto", maxWidth: 520, lineHeight: 1.6 }}>
            150 seats total. First 50 go at Early Bird. Next 75 at Regular.
            Last 25 reserved for VIP.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {/* EARLY BIRD · ₹999 · gold-featured */}
          <div
            style={{
              padding: 32,
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
              FIRST 50
            </div>
            <Kicker tone="gold">Early bird · 50 seats</Kicker>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "20px 0 6px" }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", lineHeight: 1 }}>₹999</span>
              <span style={{ color: "#9CA3AF", textDecoration: "line-through", fontSize: 16 }}>₹1,999</span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Half off. Same seat, same outcome. Closes at 50 sold.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {CORE_PERKS.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A24E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <WorkshopReserveButton
              tier="workshop-early"
              priceLabel="₹999"
              label="Grab Early Bird · ₹999"
              variant="filled"
            />
          </div>

          {/* REGULAR · ₹1,999 */}
          <div
            style={{
              padding: 32,
              borderRadius: 26,
              background: "white",
              border: "1px solid #F0E8D8",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#1A1A1A",
                color: "white",
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 16,
                letterSpacing: "0.2em",
              }}
            >
              NEXT 75
            </div>
            <Kicker tone="red">Regular · 75 seats</Kicker>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", margin: "20px 0 6px", lineHeight: 1 }}>₹1,999</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Once Early Bird is gone. Same full day, same room.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {CORE_PERKS.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <WorkshopReserveButton
              tier="workshop-regular"
              priceLabel="₹1,999"
              label="Reserve Regular · ₹1,999"
              variant="outline"
            />
          </div>

          {/* VIP · ₹2,999 · dark premium */}
          <div
            style={{
              padding: 32,
              borderRadius: 26,
              background: "linear-gradient(135deg, #1A1A1A 0%, #242424 100%)",
              border: "1.5px solid rgba(230,193,120,0.35)",
              position: "relative",
              overflow: "hidden",
              color: "white",
              boxShadow: "0 30px 70px rgba(26,26,26,0.25)",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 80% 10%, rgba(230,193,120,0.18), transparent 55%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#E6C178",
                color: "#2a1f08",
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 16,
                letterSpacing: "0.2em",
                zIndex: 1,
              }}
            >
              LAST 25 · VIP
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  marginBottom: 4,
                }}
              >
                VIP · 25 seats
              </div>
              <div style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: "-0.045em", margin: "20px 0 6px", lineHeight: 1 }}>₹2,999</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 22px", lineHeight: 1.6 }}>
                Everything in Regular, plus direct access to Ehsan before and
                after the room.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "grid", gap: 10 }}>
                {CORE_PERKS.map((x) => (
                  <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "rgba(230,193,120,0.08)",
                  border: "1px dashed rgba(230,193,120,0.35)",
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#E6C178",
                    marginBottom: 8,
                  }}
                >
                  VIP extras
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {VIP_EXTRAS.map((x) => (
                    <li key={x} style={{ display: "flex", gap: 10, fontSize: 13, color: "white" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E6C178" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <WorkshopReserveButton
                tier="workshop-vip"
                priceLabel="₹2,999"
                label="Book VIP · ₹2,999"
                variant="filled"
              />
            </div>
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
            <div><strong style={{ color: "white" }}>Full day:</strong> 10 AM – 4 PM · working session, not a conference</div>
            <div><strong style={{ color: "white" }}>Bring:</strong> Your laptop. Charger. Notebook. A light lunch if you don&rsquo;t want to step out for a break.</div>
            <div><strong style={{ color: "white" }}>Language:</strong> English, plain and clear</div>
            <div><strong style={{ color: "white" }}>Seats:</strong> Hard-capped at 150 — no overflow</div>
            <div><strong style={{ color: "white" }}>You leave with:</strong> One spot-the-difference book + its cover, ready to upload from home.</div>
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
    short: "Yes. Spot-the-difference books don't need writing.",
    a: "The book you build in the room is a spot-the-difference book — two near-identical scenes, five hidden differences per page. No writing, no credentials, no language. Claude generates the scene prompts, Canva lays the pages out, you curate and click Publish. If you can use a browser, you can publish.",
    pullQuote: "If you can use a browser, you can publish.",
  },
  {
    q: "Six hours — will you teach me everything?",
    short: "No. Six hours is one book + the path.",
    a: "KDP has four pillars: niche research, book creation, cover, upload. Six hours is enough to build ONE book + its cover together — the best-possible working tutorial. What we don't cover (picking niches that actually pay, the KDP upload form, scaling from 1 to 60 books) I walk you through as a clear path you can follow on your own over about six months. The 30-day cohort compresses that into 30 days.",
  },
  {
    q: "Will Amazon actually pay me? How does that work?",
    short: "Yes. Monthly. In INR, straight to your bank.",
    a: "Amazon deposits royalties directly to your Indian bank account every month. You need a PAN card, a bank account, and your KDP tax info filled in — that's the whole setup. I give you the exact upload checklist so you can finish it from home once your book is ready.",
    pullQuote: "It's KDP + PAN + bank. That's the whole stack.",
  },
  {
    q: "What's this about the ₹10,000 book?",
    short: "One book. Two days. Real Amazon royalties.",
    a: "A single spot-the-difference book I made in two days has paid me ₹10,000 so far and still earns. I walk you through the exact listing, niche, and why it worked at the start of the workshop — then we build the same format together. I don't promise you'll hit ₹10,000 with your first book; I promise you'll walk out with a book built the same way mine was.",
  },
  {
    q: "What's the 30-day program? And the refund policy?",
    short: "The full stack, in 30 days, offline or online, refund-backed.",
    a: "The workshop is the taste. The 30-day program is everything I learned in two years: niche research that finds books that actually earn, the full book-creation stack for all three formats (spot-the-diff, puzzles, coloring), covers, KDP upload, scaling to 10+ titles. You pick offline (Calicut batch) or online. Complete refund if you genuinely don't think it's worth it after the first two weeks — I'm confident enough to put that in writing.",
    pullQuote: "Complete refund if it's not worth it. No hoops.",
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
          href="#pay"
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
        <strong style={{ color: "#EF4444" }}>Early bird</strong> · 50 seats at ₹999
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
        Reserve ₹999 →
      </a>
    </div>
  );
}
