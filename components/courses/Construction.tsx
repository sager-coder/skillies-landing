"use client";

import React from "react";
import { Grain } from "../design/Primitives";

/**
 * Construction — the /courses page is honest about being in progress.
 * Editorial "zine in production" treatment: construction tape, DRAFT
 * stamp, blueprint grid, status rows for every planned course, notify CTA.
 */

type Status = "LIVE" | "DRAFTING" | "RECORDING" | "IN RESEARCH" | "PLANNED";

type Course = {
  title: string;
  tagline: string;
  status: Status;
  progress: number; // 0-100
  eta: string;
  tone: "red" | "gold" | "green" | "charcoal";
};

const COURSES: Course[] = [
  {
    title: "KDP Mastery · 50-Day Program",
    tagline: "The flagship. Live with the founding batch now.",
    status: "LIVE",
    progress: 100,
    eta: "Running · cohort 001",
    tone: "red",
  },
  {
    title: "Cover Design with Claude + Canva",
    tagline: "Extracted from the founding-batch lessons. Standalone module.",
    status: "DRAFTING",
    progress: 60,
    eta: "~ May 15, 2026",
    tone: "gold",
  },
  {
    title: "Amazon Listings that Convert",
    tagline: "Keyword math, copy agents, and the ethics of reviews.",
    status: "RECORDING",
    progress: 35,
    eta: "~ June 2026",
    tone: "gold",
  },
  {
    title: "Claude for Book Outlines · Free preview",
    tagline: "The three-prompt stack I use to scaffold every book.",
    status: "DRAFTING",
    progress: 80,
    eta: "~ April 30, 2026",
    tone: "red",
  },
  {
    title: "Etsy Printables · Weekend income",
    tagline: "My second engine. The full PageBoo playbook.",
    status: "IN RESEARCH",
    progress: 22,
    eta: "~ July 2026",
    tone: "green",
  },
  {
    title: "AI Video Production",
    tagline: "Avatars, voiceovers, editing — the automated stack. In research.",
    status: "IN RESEARCH",
    progress: 12,
    eta: "~ Q3 2026",
    tone: "red",
  },
  {
    title: "Meta Ads with Claude Agents",
    tagline: "Copy agents + funnel math. The new solo ad operator.",
    status: "PLANNED",
    progress: 5,
    eta: "~ Q3 2026",
    tone: "green",
  },
  {
    title: "Build apps with Claude Code",
    tagline: "I'm coding the Skillies.AI web app with it. This course ships when the app does.",
    status: "IN RESEARCH",
    progress: 18,
    eta: "~ Q3 2026",
    tone: "charcoal",
  },
  {
    title: "Royalty Analytics & Scaling",
    tagline: "Advanced. Only after 3+ more cohorts worth of data.",
    status: "PLANNED",
    progress: 0,
    eta: "~ 2027",
    tone: "charcoal",
  },
];

const STATUS_STYLE: Record<Status, { bg: string; fg: string }> = {
  LIVE: { bg: "rgba(91,123,91,0.14)", fg: "#3D5A3D" },
  DRAFTING: { bg: "rgba(201,162,78,0.18)", fg: "#8a6a1f" },
  RECORDING: { bg: "rgba(201,162,78,0.14)", fg: "#8a6a1f" },
  "IN RESEARCH": { bg: "rgba(198,40,40,0.10)", fg: "#C62828" },
  PLANNED: { bg: "rgba(26,26,26,0.08)", fg: "#6B7280" },
};

const TONE_ACCENT: Record<Course["tone"], string> = {
  red: "#C62828",
  gold: "#C9A24E",
  green: "#5B7B5B",
  charcoal: "#1A1A1A",
};

function ConstructionTape() {
  // Horizontal black-and-yellow hazard stripe
  return (
    <div
      aria-hidden
      style={{
        height: 18,
        background:
          "repeating-linear-gradient(45deg, #1A1A1A 0 14px, #E6C178 14px 28px)",
      }}
    />
  );
}

function DraftStamp() {
  return (
    <div
      aria-hidden
      className="skillies-draft-stamp"
      style={{
        position: "absolute",
        top: 48,
        right: "5%",
        transform: "rotate(-8deg)",
        padding: "14px 28px",
        border: "3px solid #C62828",
        borderRadius: 6,
        color: "#C62828",
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: "0.3em",
        opacity: 0.35,
        lineHeight: 1,
        pointerEvents: "none",
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontStyle: "italic",
        textShadow: "0 2px 0 rgba(255,255,255,0.3)",
      }}
    >
      DRAFT 0.3
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          fontFamily: "Inter, sans-serif",
          fontStyle: "normal",
          fontWeight: 700,
          marginTop: 6,
          color: "#C62828",
          opacity: 0.9,
        }}
      >
        APR 19 · 2026
      </div>
    </div>
  );
}

function BlueprintGrid() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.12,
        pointerEvents: "none",
      }}
    >
      <defs>
        <pattern id="blueprint" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1A1A1A" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint)" />
    </svg>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        padding: "5px 11px",
        borderRadius: 4,
        background: s.bg,
        color: s.fg,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: "0.22em",
        fontFamily: "ui-monospace, Menlo, monospace",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function CourseRow({ c, i }: { c: Course; i: number }) {
  const accent = TONE_ACCENT[c.tone];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "42px 1fr 160px 140px 140px",
        gap: 20,
        padding: "22px 0",
        borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
        alignItems: "center",
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 26,
          color: "#9CA3AF",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(i + 1).padStart(2, "0")}
      </div>

      {/* Title + tagline */}
      <div>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A1A",
            margin: "0 0 4px",
            letterSpacing: "-0.015em",
          }}
        >
          {c.title}
        </h3>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: accent,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {c.tagline}
        </p>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={c.status} />
      </div>

      {/* Progress */}
      <div>
        <div
          style={{
            height: 6,
            background: "#F0E8D8",
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: `${c.progress}%`,
              height: "100%",
              background: accent,
              borderRadius: 999,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {c.progress}% built
        </div>
      </div>

      {/* ETA */}
      <div
        style={{
          fontSize: 12,
          color: "#6B7280",
          fontFamily: "ui-monospace, Menlo, monospace",
          textAlign: "right",
        }}
      >
        {c.eta}
      </div>
    </div>
  );
}

export default function CoursesConstruction() {
  return (
    <>
      <ConstructionTape />

      {/* Masthead */}
      <section
        style={{
          position: "relative",
          padding: "80px 32px 60px",
          background: "#FAF5EB",
          overflow: "hidden",
        }}
      >
        <BlueprintGrid />
        <Grain opacity={0.05} />
        <DraftStamp />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
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
            § Courses · Skillies.AI Press
            <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
            <span>Draft 0.3 · Apr 19, 2026</span>
          </div>

          <h1
            style={{
              fontWeight: 900,
              fontSize: "clamp(56px, 8vw, 120px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              color: "#1A1A1A",
              margin: "0 0 20px",
              maxWidth: 1000,
            }}
          >
            The campus is{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                color: "#C62828",
                fontWeight: 400,
              }}
            >
              being built.
            </em>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#6B7280",
              maxWidth: 640,
              margin: "0 0 32px",
              lineHeight: 1.65,
            }}
          >
            Every course on this page is in some stage of research, drafting,
            or recording. I teach during the day, build in the evenings, and
            ship when each course is actually ready — not when the calendar says
            it should be. Cohort members get first access to every new drop.
          </p>

          {/* Notice banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 22px",
              background: "#1A1A1A",
              color: "#FAF5EB",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 48,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6C178" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 22h20L12 2z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="17" r="0.5" fill="#E6C178" />
            </svg>
            <span>
              <strong style={{ color: "#E6C178" }}>Under construction</strong> ·
              First drops land between April and July 2026.
            </span>
          </div>

          {/* What's actually live */}
          <div
            style={{
              padding: "24px 28px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(91,123,91,0.08), rgba(250,245,235,0.5))",
              border: "1px dashed rgba(91,123,91,0.35)",
              maxWidth: 780,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#3D5A3D",
                marginBottom: 10,
              }}
            >
              Currently live · for the founding batch
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "#1A1A1A",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              The 50-day KDP Mastery program is live for the six-student cohort
              that came out of the Calicut workshop. Everything else is being
              built — often drawn from that same cohort’s sessions.
            </p>
          </div>
        </div>
      </section>

      {/* The build log */}
      <section
        style={{
          padding: "0 32px 100px",
          background: "#FAF5EB",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#C62828",
              }}
            >
              The build log
            </div>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#9CA3AF",
              }}
            >
              Updated weekly — honest status.
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 4.5vw, 60px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#1A1A1A",
              margin: "10px 0 32px",
              maxWidth: 900,
            }}
          >
            Nine courses, in various states of being{" "}
            <em style={{ fontStyle: "italic", color: "#C62828" }}>ready.</em>
          </h2>

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "42px 1fr 160px 140px 140px",
              gap: 20,
              padding: "12px 0",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
              borderBottom: "2px solid #1A1A1A",
            }}
          >
            <div>No.</div>
            <div>Course</div>
            <div>Status</div>
            <div>Progress</div>
            <div style={{ textAlign: "right" }}>Est. drop</div>
          </div>

          {/* Rows */}
          <div style={{ borderBottom: "2px solid #1A1A1A" }}>
            {COURSES.map((c, i) => (
              <CourseRow key={c.title} c={c} i={i} />
            ))}
          </div>

          {/* Pencil marginalia */}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              gap: 32,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "#9CA3AF",
                maxWidth: 520,
                lineHeight: 1.5,
              }}
            >
              &ldquo;Dates slip. Scope changes. I’d rather show you the log
              honestly than promise launches I can’t keep.&rdquo; — E.
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#9CA3AF",
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              Last log update · 2026-04-19 14:00 IST
            </div>
          </div>
        </div>
      </section>

      <ConstructionTape />
    </>
  );
}
