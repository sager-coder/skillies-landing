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

// ── Inputs ──────────────────────────────────────────────────────────────────
type Source = { icon: React.ReactNode; title: string; sub: string };
type Niche = { letter: string; bg: string; title: string; sub: string; score: number };

const SOURCES: Source[] = [
  {
    icon: (
      <span style={{ fontWeight: 700, color: "#ff9900", fontSize: 18 }}>a</span>
    ),
    title: "Amazon.com",
    sub: "Millions of Books",
  },
  { icon: <span aria-hidden>📊</span>, title: "Sales Rank (BSR)", sub: "Real-time data" },
  { icon: <span aria-hidden>★</span>, title: "Reviews", sub: "Quantity & quality" },
  { icon: <span aria-hidden>🏷</span>, title: "Categories", sub: "Niche mapping" },
  { icon: <span aria-hidden>👤</span>, title: "Competition", sub: "Market analysis" },
  { icon: <span aria-hidden>📈</span>, title: "Trends", sub: "Growing demands" },
];

const NICHES: Niche[] = [
  { letter: "M", bg: "#e7d2ad", title: "Mindfulness Journals", sub: "Low competition · High demand", score: 96 },
  { letter: "P", bg: "#d8c19a", title: "Prayer Journals",      sub: "Low competition · High demand", score: 93 },
  { letter: "T", bg: "#e8b97a", title: "Toddler Activity Books", sub: "Low competition · High demand", score: 92 },
  { letter: "G", bg: "#cdbfa3", title: "Gratitude Journals",   sub: "Low competition · High demand", score: 91 },
  { letter: "R", bg: "#c8c5b4", title: "Retirement Planning",  sub: "Low competition · High demand", score: 89 },
];

// ── SVG geometry constants ──────────────────────────────────────────────────
// Coordinate space: 1000 wide × varies by row count. We use real CSS pixels
// so SVG and HTML overlap pixel-perfectly.
const W = 1000;
const H = 720;
const BOT_X = W / 2;
const BOT_Y = H / 2 + 10;
const BOT_R = 80;

// Source cards: 6 rows down the left side, anchored to the right edge of
// each card so the connection line starts where the card ends.
const SRC_X = 240; // right edge of source cards
const SRC_TOP = 100;
const SRC_GAP = 86;
const sourceY = (i: number) => SRC_TOP + i * SRC_GAP;

// Niche cards: 5 rows down the right side, anchored to the left edge.
const NCH_X = 760; // left edge of niche cards
const NCH_TOP = 110;
const NCH_GAP = 92;
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
        <span className="kdp-ai-icon">🧠</span>
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
