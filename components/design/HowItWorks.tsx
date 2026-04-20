"use client";

import React from "react";
import { Kicker } from "./Primitives";

/**
 * HowItWorks — replaces the v1 WhatIsKDP tiles.
 * Editorial 3-step "loop" spread that matches the rest of the site's
 * Instrument-Serif + grain + newspaper-column aesthetic.
 */

type Step = {
  n: string;
  phase: string;
  when: string;
  title: string;
  hook: string;
  body: string;
  tools: string[];
  accent: string;
  accentSoft: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    phase: "Research",
    when: "Days 1 – 4",
    title: "Find what Amazon is already buying.",
    hook: "We don't guess. We follow the receipts.",
    body: "Use AI to scan Amazon's best-sellers, decode why they sell, and surface under-served niches with proven demand. By day four you have a shortlist worth publishing into — not a hunch.",
    tools: ["Claude", "Publisher Rocket", "KDP Dashboard"],
    accent: "#C62828",
    accentSoft: "rgba(198,40,40,0.10)",
  },
  {
    n: "02",
    phase: "Create",
    when: "Days 5 – 7",
    title: "Build the book with AI, not from scratch.",
    hook: "No writing skill required. Just a laptop and a willing mind.",
    body: "Claude drafts, outlines, and edits. Canva lays out the interior and cover. You curate, approve, refine. What used to take three months of solo writing takes three days of smart direction.",
    tools: ["Claude", "Canva", "KDP Create"],
    accent: "#C9A24E",
    accentSoft: "rgba(201,162,78,0.12)",
  },
  {
    n: "03",
    phase: "Publish",
    when: "Day 7 onward",
    title: "Upload, price, and let Amazon sell.",
    hook: "Your book becomes an asset. Monthly royalties, straight to your bank.",
    body: "Listing goes live the same day you upload. Amazon handles printing, shipping, returns, tax forms — everything. Royalties land in your Indian bank account every month in INR. Build once, earn for years.",
    tools: ["Amazon KDP", "Direct bank deposit", "KDP Reports"],
    accent: "#5B7B5B",
    accentSoft: "rgba(91,123,91,0.10)",
  },
];

function ArrowBetween() {
  return (
    <div
      aria-hidden
      style={{
        alignSelf: "center",
        display: "grid",
        placeItems: "center",
        color: "rgba(26,26,26,0.22)",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function StepCard({ s }: { s: Step }) {
  return (
    <article
      style={{
        position: "relative",
        padding: "40px 32px 36px",
        borderRadius: 24,
        background: "white",
        border: "1px solid #F0E8D8",
        boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.04)";
      }}
    >
      {/* Accent bar at top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 2,
          background: s.accent,
          borderRadius: 999,
        }}
      />

      {/* Number + phase header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 80,
            fontWeight: 400,
            color: s.accent,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
          }}
        >
          {s.n}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: s.accent,
              marginBottom: 4,
            }}
          >
            {s.phase}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {s.when}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#1A1A1A",
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {s.title}
      </h3>

      {/* Hook line */}
      <p
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 19,
          color: s.accent,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        &ldquo;{s.hook}&rdquo;
      </p>

      {/* Body */}
      <p
        style={{
          fontSize: 15,
          color: "#6B7280",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {s.body}
      </p>

      {/* Tools strip */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 18,
          borderTop: "1px dashed rgba(26,26,26,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
        >
          Tools in play
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {s.tools.map((tool) => (
            <span
              key={tool}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                background: s.accentSoft,
                color: s.accent === "#C9A24E" ? "#8a6a1f" : s.accent,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.005em",
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function HowItWorks() {
  return (
    <section
      style={{
        padding: "128px 48px",
        background: "#FAF5EB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* soft grain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='11'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        {/* dateline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § 06 · The Loop
          <span
            style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }}
          />
          <span>Three gears, one machine.</span>
        </div>

        {/* headline + lede */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 40,
            alignItems: "end",
            marginBottom: 72,
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 84px)",
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Research{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                color: "#C9A24E",
                fontWeight: 400,
              }}
            >
              →
            </em>{" "}
            Create{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                color: "#C9A24E",
                fontWeight: 400,
              }}
            >
              →
            </em>{" "}
            Publish.
            <br />
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                color: "#C62828",
                fontWeight: 400,
              }}
            >
              The entire KDP loop, on AI.
            </em>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#6B7280",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 460,
            }}
          >
            Amazon KDP is a selling machine — hundreds of millions of buyers,
            passive royalties, monthly payouts in INR. We teach you to feed
            that machine with AI, start to finish, in under seven days per book.
          </p>
        </div>

        {/* The three cards with arrows between */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 16,
            alignItems: "stretch",
            marginBottom: 64,
          }}
        >
          <StepCard s={STEPS[0]} />
          <ArrowBetween />
          <StepCard s={STEPS[1]} />
          <ArrowBetween />
          <StepCard s={STEPS[2]} />
        </div>

        {/* Closing editorial line — replaces the cheap white CTA banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            alignItems: "center",
            padding: "32px 40px",
            borderTop: "1px solid rgba(26,26,26,0.12)",
            borderBottom: "1px solid rgba(26,26,26,0.12)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#C62828",
              whiteSpace: "nowrap",
            }}
          >
            The honest truth
          </div>
          <p
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(22px, 2.4vw, 34px)",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.3,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            You don’t need to be a writer. You don’t need a degree.
            You need a laptop, two hours a day, and the patience{" "}
            <em style={{ fontStyle: "italic", color: "#C62828" }}>
              to run the loop sixty times.
            </em>
          </p>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "#6B7280",
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            — Ehsan,
            <br />
            63 books in
          </div>
        </div>
      </div>
    </section>
  );
}
