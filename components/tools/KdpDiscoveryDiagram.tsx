"use client";

/**
 * KDP Discovery Diagram — the new 3-zone hero animation.
 *
 *   ANALYZE  →  AI BOT  →  SORT & DELIVER
 *
 * Six labelled data-source cards on the left flow into the central bot via
 * dotted red bezier paths with travelling particles; five ranked niche
 * result cards on the right receive the bot's output the same way.
 *
 * Built as React state-driven SVG so we can keep the same continuous
 * particle-stream animation pattern the brand established. The cards
 * themselves are real DOM (HTML) so text and icons stay crisp.
 */

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ── Continuous clock ────────────────────────────────────────────────────────
function useClock(paused = false): number {
  const [time, setTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTime(4);
      return;
    }
    const step = (ts: number) => {
      if (lastRef.current == null) lastRef.current = ts;
      const dt = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      setTime((t) => t + dt);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [paused]);

  return time;
}

// ── Bezier helpers ──────────────────────────────────────────────────────────
type Pt = { x: number; y: number };
function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * c1.x +
      3 * u * t * t * c2.x +
      t * t * t * p1.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * c1.y +
      3 * u * t * t * c2.y +
      t * t * t * p1.y,
  };
}

// ── Premium icon SVGs ───────────────────────────────────────────────────────
// Custom-drawn at 28×28 viewBox, designed as a small consistent set. Match
// the screenshot's per-category colors (orange Amazon, gray-red BSR bars,
// black star, orange tag, gray person, red trend) so each row reads as a
// distinct domain rather than a flat icon wall.
const IconAmazon = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <text x="14" y="18.5" textAnchor="middle" fontFamily="Inter, sans-serif"
          fontWeight="800" fontSize="18" fill="#ff9900"
          style={{ fontStyle: "italic" }}>a</text>
    <path
      d="M5 22 Q14 26 23 22"
      fill="none" stroke="#ff9900" strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M21 21.5 L23.5 22 L22 24" fill="none" stroke="#ff9900"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBars = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <rect x="4"  y="14" width="4" height="10" rx="1" fill="#9ca3af" />
    <rect x="10" y="10" width="4" height="14" rx="1" fill="#6b7280" />
    <rect x="16" y="6"  width="4" height="18" rx="1" fill="#d9342b" />
    <rect x="22" y="12" width="4" height="12" rx="1" fill="#9ca3af" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <path
      d="M14 3.5 L17.2 10 L24.5 11 L19.2 16 L20.5 23 L14 19.6 L7.5 23 L8.8 16 L3.5 11 L10.8 10 Z"
      fill="#141414"
    />
  </svg>
);
const IconTag = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <path
      d="M14.2 3 L24.8 3 L24.8 13.6 L13.6 24.8 L3 14.2 Z"
      fill="#f5b557" stroke="#c9892a" strokeWidth="1.4" strokeLinejoin="round"
    />
    <circle cx="20" cy="8" r="1.8" fill="#fff" />
  </svg>
);
const IconPerson = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <circle cx="14" cy="9" r="4.5" fill="#9ca3af" />
    <path
      d="M3.5 24 Q3.5 15 14 15 Q24.5 15 24.5 24 Z"
      fill="#9ca3af"
    />
  </svg>
);
const IconTrend = () => (
  <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden>
    <path
      d="M3.5 21 L10 14.5 L14 18.5 L23 9.5"
      fill="none" stroke="#d9342b" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M19.5 9.5 L23.5 9.5 L23.5 13.5"
      fill="none" stroke="#d9342b" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="14" cy="18.5" r="1.4" fill="#d9342b" />
  </svg>
);

// ── Inputs ──────────────────────────────────────────────────────────────────
type Source = { icon: React.ReactNode; title: string; sub: string };
type Niche = { letter: string; bg: string; title: string; sub: string; score: number };

const SOURCES: Source[] = [
  { icon: <IconAmazon />, title: "Amazon.com",      sub: "Millions of Books" },
  { icon: <IconBars />,   title: "Sales Rank (BSR)", sub: "Real-time data" },
  { icon: <IconStar />,   title: "Reviews",         sub: "Quantity & quality" },
  { icon: <IconTag />,    title: "Categories",      sub: "Niche mapping" },
  { icon: <IconPerson />, title: "Competition",     sub: "Market analysis" },
  { icon: <IconTrend />,  title: "Trends",          sub: "Growing demands" },
];

const NICHES: Niche[] = [
  { letter: "M", bg: "#e7d2ad", title: "Mindfulness Journals", sub: "Low competition · High demand", score: 96 },
  { letter: "P", bg: "#d8c19a", title: "Prayer Journals",      sub: "Low competition · High demand", score: 93 },
  { letter: "T", bg: "#e8b97a", title: "Toddler Activity Books", sub: "Low competition · High demand", score: 92 },
  { letter: "G", bg: "#cdbfa3", title: "Gratitude Journals",   sub: "Low competition · High demand", score: 91 },
  { letter: "R", bg: "#c8c5b4", title: "Retirement Planning",  sub: "Low competition · High demand", score: 89 },
];

// ── SVG geometry constants ──────────────────────────────────────────────────
// Coordinate space: 1000 wide × 820 tall. Extra vertical room (vs prior 720)
// gives the AI Powered Algorithm card breathing room below the niche cards
// so it doesn't overlap row 5.
const W = 1000;
const H = 780;             // matches CSS aspect-ratio 1000/780
const BOT_X = W / 2;
const BOT_Y = 380;         // bot anchored ~50 % from top — leaves bottom for AI card
const BOT_R = 80;

// Source cards: 6 rows down the left side. Slightly tighter gap (86 → 84) +
// earlier start so all 6 fit cleanly above the bot's bottom edge.
const SRC_X = 240; // right edge of source cards
const SRC_TOP = 100;
const SRC_GAP = 86;
const sourceY = (i: number) => SRC_TOP + i * SRC_GAP;

// Niche cards: 5 rows down the right side. Tighter gap (92 → 86) so card 5
// ends well above the AI card.
const NCH_X = 760;
const NCH_TOP = 110;
const NCH_GAP = 86;
const nicheY = (i: number) => NCH_TOP + i * NCH_GAP;

// ── Component ───────────────────────────────────────────────────────────────
export default function KdpDiscoveryDiagram() {
  const time = useClock();

  // Build paths once
  const leftPaths = useMemo(
    () =>
      SOURCES.map((_, i) => {
        const a = { x: SRC_X, y: sourceY(i) + 26 };
        const b = { x: BOT_X - BOT_R + 6, y: BOT_Y + (sourceY(i) + 26 - BOT_Y) * 0.15 };
        return {
          p0: a,
          c1: { x: a.x + (b.x - a.x) * 0.55, y: a.y },
          c2: { x: b.x - (b.x - a.x) * 0.40, y: b.y },
          p1: b,
        };
      }),
    [],
  );
  const rightPaths = useMemo(
    () =>
      NICHES.map((_, i) => {
        const a = { x: BOT_X + BOT_R - 6, y: BOT_Y + (nicheY(i) + 30 - BOT_Y) * 0.15 };
        const b = { x: NCH_X, y: nicheY(i) + 30 };
        return {
          p0: a,
          c1: { x: a.x + (b.x - a.x) * 0.40, y: a.y },
          c2: { x: b.x - (b.x - a.x) * 0.55, y: b.y },
          p1: b,
        };
      }),
    [],
  );

  // Pre-compute dot positions along each path (24 dots/path)
  const DOT_COUNT = 22;
  const dotsAlong = (p: { p0: Pt; c1: Pt; c2: Pt; p1: Pt }) => {
    const out: Pt[] = [];
    for (let i = 1; i < DOT_COUNT; i++) {
      out.push(cubic(p.p0, p.c1, p.c2, p.p1, i / DOT_COUNT));
    }
    return out;
  };

  return (
    <div className="kdp-diagram">
      {/* ───── Source cards (LEFT) ───── */}
      <div className="kdp-diagram-col kdp-diagram-col-left">
        <div className="kdp-col-header">
          <span className="kdp-col-step">1. ANALYZE</span>
          <p>We scan &amp; analyze<br />all Amazon books</p>
        </div>
        {SOURCES.map((s, i) => (
          <div
            key={s.title}
            className="kdp-source-card"
            style={{
              top: sourceY(i),
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="kdp-source-icon">{s.icon}</div>
            <div>
              <div className="kdp-source-title">{s.title}</div>
              <div className="kdp-source-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ───── Niche cards (RIGHT) ───── */}
      <div className="kdp-diagram-col kdp-diagram-col-right">
        <div className="kdp-col-header kdp-col-header-right">
          <span className="kdp-col-step">2. SORT &amp; DELIVER</span>
          <p>We sort the data and deliver<br />high-probability niches</p>
        </div>
        {NICHES.map((n, i) => (
          <div
            key={n.title}
            className="kdp-niche-card"
            style={{
              top: nicheY(i),
              animationDelay: `${0.4 + i * 0.10}s`,
            }}
          >
            <div
              className="kdp-niche-thumb"
              style={{ background: n.bg }}
            >
              <span>{n.letter}</span>
            </div>
            <div className="kdp-niche-meta">
              <div className="kdp-niche-title">{n.title}</div>
              <div className="kdp-niche-sub">{n.sub}</div>
              <div className="kdp-niche-bsr">
                BSR Potential:&nbsp;
                <span className="kdp-niche-bars">
                  <i /><i /><i /><i /><i />
                </span>
              </div>
            </div>
            <div className="kdp-niche-score">
              <div className="kdp-niche-score-num">{n.score}</div>
              <div className="kdp-niche-score-label">Great</div>
            </div>
          </div>
        ))}
        <a className="kdp-view-all" href="#kdp-tool">
          View all proven niches →
        </a>
      </div>

      {/* ───── SVG overlay (lines + bot + particles + AI card) ───── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="kdp-diagram-svg"
        aria-hidden
      >
        {/* Concentric ambient rings around the bot */}
        <g className="kdp-bot-rings">
          <circle cx={BOT_X} cy={BOT_Y} r={BOT_R + 60} fill="none" stroke="rgba(217,52,43,0.10)" strokeWidth="1.5" strokeDasharray="3 6" />
          <circle cx={BOT_X} cy={BOT_Y} r={BOT_R + 32} fill="rgba(217,52,43,0.06)" />
          <circle cx={BOT_X} cy={BOT_Y} r={BOT_R + 16} fill="rgba(217,52,43,0.10)" />
        </g>

        {/* Dotted source → bot lines */}
        <g>
          {leftPaths.map((p, i) =>
            dotsAlong(p).map((d, j) => {
              const reveal = Math.min(1, Math.max(0, time * 0.6 - i * 0.08));
              const t = (j + 1) / DOT_COUNT;
              const alpha = Math.min(1, Math.max(0, (reveal - t) * 8));
              if (alpha <= 0) return null;
              return (
                <circle
                  key={`l-${i}-${j}`}
                  cx={d.x}
                  cy={d.y}
                  r={1.6}
                  fill="rgba(217,52,43,0.55)"
                  opacity={alpha}
                />
              );
            }),
          )}
        </g>

        {/* Bot → niche lines */}
        <g>
          {rightPaths.map((p, i) =>
            dotsAlong(p).map((d, j) => {
              const reveal = Math.min(1, Math.max(0, time * 0.55 - 0.6 - i * 0.10));
              const t = (j + 1) / DOT_COUNT;
              const alpha = Math.min(1, Math.max(0, (reveal - t) * 8));
              if (alpha <= 0) return null;
              return (
                <circle
                  key={`r-${i}-${j}`}
                  cx={d.x}
                  cy={d.y}
                  r={1.6}
                  fill="rgba(217,52,43,0.55)"
                  opacity={alpha}
                />
              );
            }),
          )}
        </g>

        {/* Particle streams (left → bot, then bot → right). Continuous loop. */}
        <g>
          {leftPaths.map((p, i) => {
            const items = [];
            const speed = 0.40 + (i % 3) * 0.04;
            for (let k = 0; k < 3; k++) {
              const phase = k / 3;
              const t = ((time * speed + phase + i * 0.07) % 1);
              if (time < 1.2 + i * 0.08) continue;
              const dot = cubic(p.p0, p.c1, p.c2, p.p1, t);
              const fade = Math.min(t * 5, (1 - t) * 5, 1);
              items.push(
                <circle
                  key={`lp-${i}-${k}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={2.6}
                  fill="#d9342b"
                  opacity={Math.max(0, fade) * 0.9}
                />,
              );
            }
            return <g key={`lps-${i}`}>{items}</g>;
          })}
        </g>
        <g>
          {rightPaths.map((p, i) => {
            const items = [];
            const speed = 0.45 + (i % 3) * 0.04;
            for (let k = 0; k < 3; k++) {
              const phase = k / 3;
              const t = ((time * speed + phase + i * 0.07) % 1);
              if (time < 2.4 + i * 0.10) continue;
              const dot = cubic(p.p0, p.c1, p.c2, p.p1, t);
              const fade = Math.min(t * 5, (1 - t) * 5, 1);
              items.push(
                <circle
                  key={`rp-${i}-${k}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={2.6}
                  fill="#d9342b"
                  opacity={Math.max(0, fade) * 0.9}
                />,
              );
            }
            return <g key={`rps-${i}`}>{items}</g>;
          })}
        </g>

        {/* The bot itself */}
        <g
          transform={`translate(${BOT_X},${BOT_Y}) scale(${
            1 + 0.012 * Math.sin(time * 1.6)
          })`}
        >
          <circle r={BOT_R} fill="#ffffff" stroke="rgba(217,52,43,0.20)" strokeWidth="1.5" />
          <circle r={BOT_R - 6} fill="none" stroke="rgba(217,52,43,0.12)" strokeDasharray="2 5" strokeWidth="1.2" />
          <g transform="translate(0,-6)">
            <line x1="0" y1="-46" x2="0" y2="-32" stroke="#d9342b" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="0" cy="-50" r="5" fill="#d9342b" />
            <rect x="-32" y="-30" width="64" height="44" rx="11" fill="#ffffff" stroke="#d9342b" strokeWidth="3" />
            <rect x="-40" y="-18" width="8" height="18" rx="3" fill="none" stroke="#d9342b" strokeWidth="2.6" />
            <rect x="32"  y="-18" width="8" height="18" rx="3" fill="none" stroke="#d9342b" strokeWidth="2.6" />
            <rect x="-22" y="-18" width="44" height="18" rx="3" fill="#d9342b" />
            <ellipse cx="-9" cy="-9" rx="4" ry="5" fill="#fff" />
            <ellipse cx="9"  cy="-9" rx="4" ry="5" fill="#fff" />
            <circle cx="-9" cy="-9" r="2" fill="#d9342b" />
            <circle cx="9"  cy="-9" r="2" fill="#d9342b" />
            <rect x="-14" y="6" width="28" height="4" rx="1.5" fill="#d9342b" />
          </g>
          <text
            x="0"
            y={BOT_R - 18}
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="700"
            fontSize="16"
            letterSpacing="-0.02em"
            fill="#d9342b"
          >
            skillies.ai
          </text>
        </g>
      </svg>

      {/* ───── AI Powered Algorithm card (under the bot) ───── */}
      <div className="kdp-ai-card">
        <span className="kdp-ai-icon" aria-hidden>
          <svg viewBox="0 0 32 32" width="22" height="22">
            <defs>
              <linearGradient id="kdp-brain-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="#f08c84" />
                <stop offset="100%" stopColor="#d9342b" />
              </linearGradient>
            </defs>
            <path
              d="M11 5.5 C8.2 5.5 6.2 7.4 6.2 10 C4.8 10.7 4 12 4 13.6 C4 15 4.6 16.1 5.6 16.8
                 C5.2 17.5 5 18.3 5 19.2 C5 21.6 6.7 23.5 9 24 C9.4 25.7 10.9 27 12.7 27
                 C14 27 15 26.3 15.5 25.4 L15.5 6.5 C15 5.7 14 5.5 13 5.5 C12.4 5.5 11.6 5.5 11 5.5 Z"
              fill="url(#kdp-brain-grad)"
            />
            <path
              d="M21 5.5 C23.8 5.5 25.8 7.4 25.8 10 C27.2 10.7 28 12 28 13.6 C28 15 27.4 16.1 26.4 16.8
                 C26.8 17.5 27 18.3 27 19.2 C27 21.6 25.3 23.5 23 24 C22.6 25.7 21.1 27 19.3 27
                 C18 27 17 26.3 16.5 25.4 L16.5 6.5 C17 5.7 18 5.5 19 5.5 C19.6 5.5 20.4 5.5 21 5.5 Z"
              fill="url(#kdp-brain-grad)"
              opacity="0.85"
            />
            {/* Subtle highlight line down the centre fold */}
            <path d="M16 6 L16 26"
                  stroke="#ffffff" strokeWidth="0.8" opacity="0.45" />
            {/* Tiny circuit dot accents */}
            <circle cx="9.5"  cy="13" r="0.9" fill="#ffffff" opacity="0.7" />
            <circle cx="22.5" cy="13" r="0.9" fill="#ffffff" opacity="0.7" />
            <circle cx="11"   cy="20" r="0.7" fill="#ffffff" opacity="0.6" />
            <circle cx="21"   cy="20" r="0.7" fill="#ffffff" opacity="0.6" />
          </svg>
        </span>
        <div>
          <div className="kdp-ai-title">AI POWERED ALGORITHM</div>
          <div className="kdp-ai-sub">
            Analyzing 50M+ data points<br />every single day
          </div>
        </div>
      </div>
    </div>
  );
}
