"use client";

/**
 * Skillies KDP Niche Finder hero animation — native Next.js port.
 *
 * Story: Amazon's vast catalog (left) → AI bot filters (centre) →
 * profitable niches surface (right). Continuous steady-state loop —
 * starts past the entry phase so the bot is breathing, particles are
 * flowing, badges are visible from frame 1.
 *
 * Source: ported from the Claude Design hand-off scene that runs on
 * the FastAPI niche-finder app (web/static/hero/anim/hero-scene.jsx).
 * Adapted to React 19 imports + a single-file client component.
 */

import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";

// ── Easing ──────────────────────────────────────────────────────────────────
const Easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack: (t: number) => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};
const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v));

// ── Timeline ────────────────────────────────────────────────────────────────
const TimelineContext = createContext<{ time: number }>({ time: 0 });
const useTime = () => useContext(TimelineContext).time;

// Steady-state clock: every entry animation has finished by ~6.4s, so we
// start the clock past that point. Time then grows monotonically forever —
// the continuous loops (bot breathing, ring rotation, scan band, book
// floats, dot pulses, particle streams) all use sin/modulo of `time` so
// they keep running smoothly. No reset to an empty stage.
const STEADY_STATE_START = 7.0;

function LoopedScene({
  paused = false,
  children,
}: {
  paused?: boolean;
  children: React.ReactNode;
}) {
  const [time, setTime] = useState(STEADY_STATE_START);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
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

  // prefers-reduced-motion: pin to a stable settled frame, no rAF
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tEffective = reduced ? STEADY_STATE_START : time;

  const ctx = useMemo(() => ({ time: tEffective }), [tEffective]);
  return (
    <TimelineContext.Provider value={ctx}>{children}</TimelineContext.Provider>
  );
}

// ── Constants ───────────────────────────────────────────────────────────────
const W = 1600,
  H = 900;
const CREAM_DARK = "#F5DDC9";
const RED = "#C62828";
const RED_BRIGHT = "#E03A3A";
const RED_SOFT = "rgba(198,40,40,0.55)";
const RED_FAINT = "rgba(198,40,40,0.22)";
const CHARCOAL = "#2A2118";

const BOT = { x: 820, y: 470, r: 130 };

type LeftBook = {
  x: number;
  y: number;
  size: number;
  delay: number;
  tilt: number;
  variant: number;
};
type RightBook = {
  x: number;
  y: number;
  size: number;
  popDelay: number;
  variant: number;
};

const LEFT_BOOKS: LeftBook[] = [
  { x: 290, y: 270, size: 82, delay: 0.4, tilt: -6, variant: 0 },
  { x: 475, y: 325, size: 60, delay: 0.55, tilt: 4, variant: 1 },
  { x: 175, y: 410, size: 68, delay: 0.65, tilt: -3, variant: 2 },
  { x: 360, y: 505, size: 52, delay: 0.8, tilt: 7, variant: 3 },
  { x: 145, y: 615, size: 74, delay: 0.92, tilt: -5, variant: 4 },
  { x: 480, y: 615, size: 62, delay: 1.05, tilt: 3, variant: 5 },
  { x: 320, y: 730, size: 54, delay: 1.18, tilt: -2, variant: 6 },
  { x: 555, y: 460, size: 46, delay: 1.3, tilt: 5, variant: 7 },
];

const RIGHT_BOOKS: RightBook[] = [
  { x: 1240, y: 270, size: 92, popDelay: 4.05, variant: 0 },
  { x: 1290, y: 470, size: 92, popDelay: 4.45, variant: 6 },
  { x: 1240, y: 670, size: 92, popDelay: 4.85, variant: 4 },
];

// ── Bezier helpers ──────────────────────────────────────────────────────────
type Pt = { x: number; y: number };
type CPath = { p0: Pt; c1: Pt; c2: Pt; p1: Pt };

function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
}
function buildPath(a: Pt, b: Pt, sideBias = 1): CPath {
  const dx = b.x - a.x;
  const c1: Pt = { x: a.x + dx * 0.45 * sideBias, y: a.y };
  const c2: Pt = { x: b.x - dx * 0.4 * sideBias, y: b.y };
  return { p0: a, c1, c2, p1: b };
}

const LEFT_PATHS: CPath[] = LEFT_BOOKS.map((b) => {
  const dy = (b.y - BOT.y) * 0.35;
  const target: Pt = { x: BOT.x - BOT.r * 0.95, y: BOT.y + dy };
  return buildPath(b, target, 1);
});
const RIGHT_PATHS: CPath[] = RIGHT_BOOKS.map((b) => {
  const dy = (b.y - BOT.y) * 0.35;
  const source: Pt = { x: BOT.x + BOT.r * 0.95, y: BOT.y + dy };
  return buildPath(source, b, 1);
});

// ── 8 cover variants ────────────────────────────────────────────────────────
type CoverProps = { s: number; c: string };
const COVER_VARIANTS: Array<(p: CoverProps) => React.ReactElement> = [
  ({ s, c }) => (
    <g>
      <rect x={-0.42 * s} y={-0.3 * s} width={0.84 * s} height={0.1 * s} fill={c} />
      <rect x={-0.34 * s} y={-0.1 * s} width={0.62 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.34 * s} y={0.0 * s} width={0.46 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.34 * s} y={0.18 * s} width={0.2 * s} height={0.04 * s} rx={1} fill={c} opacity="0.6" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <circle cx={-0.18 * s} cy={-0.18 * s} r={0.1 * s} fill={c} />
      <circle cx={0.1 * s} cy={-0.18 * s} r={0.05 * s} fill={c} opacity="0.55" />
      <rect x={-0.32 * s} y={0.04 * s} width={0.62 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.32 * s} y={0.14 * s} width={0.4 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.32 * s} y={0.24 * s} width={0.18 * s} height={0.04 * s} rx={1} fill={c} opacity="0.55" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <path
        d={`M${-0.3 * s},${-0.05 * s} L${-0.05 * s},${-0.26 * s} L${0.1 * s},${-0.1 * s} L${0.3 * s},${-0.2 * s} L${0.3 * s},${0.0 * s} L${-0.3 * s},${0.0 * s} Z`}
        fill={c}
      />
      <rect x={-0.3 * s} y={0.1 * s} width={0.55 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.3 * s} y={0.2 * s} width={0.3 * s} height={0.04 * s} rx={1} fill={c} opacity="0.6" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <path
        d={`M${-0.4 * s},${-0.1 * s} L${0.4 * s},${-0.3 * s} L${0.4 * s},${-0.2 * s} L${-0.4 * s},${0.0 * s} Z`}
        fill={c}
      />
      <rect x={-0.3 * s} y={0.08 * s} width={0.55 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.3 * s} y={0.18 * s} width={0.36 * s} height={0.04 * s} rx={1} fill={c} opacity="0.6" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <circle
        cx={0.12 * s}
        cy={-0.18 * s}
        r={0.13 * s}
        fill="none"
        stroke={c}
        strokeWidth={Math.max(1, s * 0.04)}
      />
      <rect x={-0.32 * s} y={0.04 * s} width={0.6 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.32 * s} y={0.14 * s} width={0.4 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.32 * s} y={0.24 * s} width={0.2 * s} height={0.04 * s} rx={1} fill={c} opacity="0.55" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <rect x={-0.36 * s} y={-0.3 * s} width={0.72 * s} height={0.36 * s} fill={c} opacity="0.18" />
      <text
        x={0}
        y={-0.04 * s}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize={s * 0.32}
        fill={c}
      >
        A
      </text>
      <rect x={-0.3 * s} y={0.14 * s} width={0.5 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.3 * s} y={0.24 * s} width={0.28 * s} height={0.04 * s} rx={1} fill={c} opacity="0.55" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <rect x={-0.22 * s} y={-0.1 * s} width={0.06 * s} height={0.16 * s} fill={c} />
      <rect x={-0.1 * s} y={-0.22 * s} width={0.06 * s} height={0.28 * s} fill={c} />
      <rect x={0.02 * s} y={-0.04 * s} width={0.06 * s} height={0.1 * s} fill={c} opacity="0.6" />
      <rect x={0.14 * s} y={-0.16 * s} width={0.06 * s} height={0.22 * s} fill={c} />
      <rect x={-0.3 * s} y={0.16 * s} width={0.55 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.3 * s} y={0.26 * s} width={0.3 * s} height={0.04 * s} rx={1} fill={c} opacity="0.6" />
    </g>
  ),
  ({ s, c }) => (
    <g>
      <path
        d={`M${-0.34 * s},${-0.1 * s} Q${-0.1 * s},${-0.3 * s} ${0.1 * s},${-0.1 * s} T${0.34 * s},${-0.1 * s}`}
        fill="none"
        stroke={c}
        strokeWidth={Math.max(1.2, s * 0.05)}
        strokeLinecap="round"
      />
      <rect x={-0.3 * s} y={0.1 * s} width={0.55 * s} height={0.05 * s} rx={1} fill={c} />
      <rect x={-0.3 * s} y={0.2 * s} width={0.34 * s} height={0.04 * s} rx={1} fill={c} opacity="0.6" />
    </g>
  ),
];

function BookGlyph({
  x,
  y,
  size,
  tilt = 0,
  variant = 0,
  color = CHARCOAL,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  size: number;
  tilt?: number;
  variant?: number;
  color?: string;
  opacity?: number;
  scale?: number;
}) {
  const r = size * 0.8;
  const bw = size * 0.78;
  const bh = size * 0.96;
  const Cover = COVER_VARIANTS[variant % COVER_VARIANTS.length];
  return (
    <g
      transform={`translate(${x},${y}) scale(${scale}) rotate(${tilt})`}
      opacity={opacity}
    >
      <circle cx="0" cy="0" r={r + 4} fill="#fff" />
      <circle cx="0" cy="0" r={r} fill="#FBF6EE" stroke={CREAM_DARK} strokeWidth="1.4" />
      <g>
        <rect x={-bw / 2 + 2} y={-bh / 2 + 4} width={bw} height={bh} rx={3} fill="rgba(40,25,10,0.10)" />
        <rect
          x={-bw / 2}
          y={-bh / 2}
          width={bw}
          height={bh}
          rx={3}
          fill="#FFFEFB"
          stroke={color}
          strokeWidth={Math.max(1.4, size * 0.022)}
        />
        <line
          x1={-bw / 2 + bw * 0.1}
          y1={-bh / 2 + 2}
          x2={-bw / 2 + bw * 0.1}
          y2={bh / 2 - 2}
          stroke={color}
          strokeWidth={Math.max(1, size * 0.018)}
          opacity="0.45"
        />
        <g transform={`translate(${bw * 0.06},0)`}>
          <Cover s={size} c={color} />
        </g>
      </g>
    </g>
  );
}

function RedBookGlyph({
  x,
  y,
  size,
  variant = 0,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  size: number;
  variant?: number;
  opacity?: number;
  scale?: number;
}) {
  const r = size * 0.62;
  const bw = size * 0.5;
  const bh = size * 0.62;
  const Cover = COVER_VARIANTS[variant % COVER_VARIANTS.length];
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <circle cx="0" cy="0" r={r + 8} fill="#fff" />
      <circle cx="0" cy="0" r={r} fill={RED} />
      <g>
        <rect x={-bw / 2 + 1.5} y={-bh / 2 + 3} width={bw} height={bh} rx={3} fill="rgba(0,0,0,0.18)" />
        <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={3} fill="#fff" />
        <line
          x1={-bw / 2 + bw * 0.1}
          y1={-bh / 2 + 2}
          x2={-bw / 2 + bw * 0.1}
          y2={bh / 2 - 2}
          stroke={RED}
          strokeWidth={Math.max(1, size * 0.018)}
          opacity="0.35"
        />
        <g transform={`translate(${bw * 0.05},0)`}>
          <Cover s={size * 0.62} c={RED} />
        </g>
      </g>
    </g>
  );
}

function DottedPath({
  path,
  reveal = 1,
  count = 26,
  dotR = 2.6,
  color = RED_SOFT,
}: {
  path: CPath;
  reveal?: number;
  count?: number;
  dotR?: number;
  color?: string;
}) {
  const dots = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const p = cubic(path.p0, path.c1, path.c2, path.p1, t);
    const localOpacity = clamp((reveal - t) / 0.08, 0, 1);
    if (localOpacity <= 0) continue;
    dots.push(
      <circle key={i} cx={p.x} cy={p.y} r={dotR} fill={color} opacity={localOpacity} />,
    );
  }
  return <g>{dots}</g>;
}

function ParticleStream({
  path,
  time,
  enabled,
  count = 4,
  speed = 0.5,
  color = RED,
  baseOpacity = 0.85,
}: {
  path: CPath;
  time: number;
  enabled: boolean;
  count?: number;
  speed?: number;
  color?: string;
  baseOpacity?: number;
}) {
  if (!enabled) return null;
  const items = [];
  for (let i = 0; i < count; i++) {
    const phase = i / count;
    const t = ((time * speed) + phase) % 1;
    const p = cubic(path.p0, path.c1, path.c2, path.p1, t);
    const fade = Math.min(t * 6, (1 - t) * 6, 1);
    items.push(
      <circle
        key={i}
        cx={p.x}
        cy={p.y}
        r={3.2}
        fill={color}
        opacity={baseOpacity * Math.max(0, fade)}
      />,
    );
  }
  return <g>{items}</g>;
}

// Deterministic ambient red dot fields
type Dot = { x: number; y: number; r: number; o: number; delay: number };
function makeDots(
  seed: number,
  count: number,
  xMin: number,
  xRange: number,
  yMin: number,
  yRange: number,
  rMin: number,
  rRange: number,
  oMin: number,
  oRange: number,
  dMin: number,
  dRange: number,
): Dot[] {
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: xMin + r() * xRange,
      y: yMin + r() * yRange,
      r: rMin + r() * rRange,
      o: oMin + r() * oRange,
      delay: dMin + r() * dRange,
    });
  }
  return dots;
}
const AMBIENT_DOTS = makeDots(7, 110, 100, 500, 200, 580, 1.6, 2.6, 0.18, 0.45, 0.4, 1.6);
const RIGHT_DOTS = makeDots(23, 32, 1080, 380, 240, 470, 1.6, 2.0, 0.18, 0.3, 4.2, 0.8);

// ── Bot ─────────────────────────────────────────────────────────────────────
function Bot({ time, t01 }: { time: number; t01: number }) {
  const breathe = 1 + 0.012 * Math.sin(time * 1.6);
  const scanCycle = 2.6;
  const scanT = ((time + 0.4) % scanCycle) / scanCycle;
  const scanY = -BOT.r * 0.55 + scanT * (BOT.r * 1.1);
  const scanOpacity = scanT < 0.05 || scanT > 0.95 ? 0 : 0.55 * Math.sin(scanT * Math.PI);
  const rot = (time * 12) % 360;
  const e = clamp((t01 - 1.5) / 0.9, 0, 1);
  const entry = Easing.easeOutBack(e);
  const opacity = e;
  // Periodic "filter pulse" — every ~5s the bot's halo brightens for 0.8s.
  const cycle = 5.0;
  const phase = time % cycle;
  const glow = phase < 0.8 ? 0.5 + 0.5 * Math.sin((phase / 0.8) * Math.PI) : 0;

  return (
    <g
      transform={`translate(${BOT.x},${BOT.y}) scale(${entry * breathe})`}
      opacity={opacity}
    >
      <g transform={`rotate(${rot})`}>
        <circle
          cx="0"
          cy="0"
          r={BOT.r + 18}
          fill="none"
          stroke={RED_FAINT}
          strokeWidth="1.4"
          strokeDasharray="3 7"
        />
      </g>
      <circle cx="0" cy="0" r={BOT.r + 36} fill={RED} opacity={0.08 + glow * 0.12} />
      <circle cx="0" cy="0" r={BOT.r} fill="#fff" stroke={CREAM_DARK} strokeWidth="1.5" />
      <circle
        cx="0"
        cy="0"
        r={BOT.r - 10}
        fill="none"
        stroke={RED_FAINT}
        strokeWidth="1.2"
        strokeDasharray="2 6"
      />
      <defs>
        <clipPath id="botClip">
          <circle cx="0" cy="0" r={BOT.r - 4} />
        </clipPath>
      </defs>
      <g clipPath="url(#botClip)">
        <rect x={-BOT.r} y={scanY} width={BOT.r * 2} height="6" fill={RED_BRIGHT} opacity={scanOpacity} />
      </g>
      <g transform="translate(0,-12)">
        <line x1="0" y1="-58" x2="0" y2="-38" stroke={RED} strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="-62" r="6" fill={RED} />
        <rect x="-44" y="-38" width="88" height="60" rx="14" fill="none" stroke={RED} strokeWidth="3.6" />
        <rect x="-54" y="-22" width="10" height="22" rx="4" fill="none" stroke={RED} strokeWidth="3.2" />
        <rect x="44" y="-22" width="10" height="22" rx="4" fill="none" stroke={RED} strokeWidth="3.2" />
        <rect x="-30" y="-22" width="60" height="22" rx="4" fill={RED} />
        <rect x="-22" y="-15" width="14" height="8" rx="1.5" fill="#fff" />
        <rect x="8" y="-15" width="14" height="8" rx="1.5" fill="#fff" />
        <rect x="-20" y="8" width="40" height="6" rx="2" fill={RED} />
      </g>
      <text
        x="0"
        y="78"
        textAnchor="middle"
        fill={RED}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="-0.5"
      >
        skillies.ai
      </text>
    </g>
  );
}

function TitlePill({ t01 }: { t01: number }) {
  const e = clamp(t01 / 0.7, 0, 1);
  const eased = Easing.easeOutBack(e);
  const ty = (1 - eased) * -40;
  const opacity = e;
  return (
    <g transform={`translate(${W / 2},${130 + ty})`} opacity={opacity}>
      <rect
        x={-185}
        y={-38}
        width={370}
        height={76}
        rx={38}
        fill={RED}
        style={{ filter: "drop-shadow(0 18px 50px rgba(198,40,40,0.30))" }}
      />
      <text
        x="0"
        y="9"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="6"
      >
        SKILLIES AI
      </text>
    </g>
  );
}

function BottomLabels({ t01 }: { t01: number }) {
  const a = clamp((t01 - 5.6) / 0.8, 0, 1);
  const eased = Easing.easeOutCubic(a);
  return (
    <g opacity={eased} transform={`translate(0, ${(1 - eased) * 8})`}>
      <text
        x={310}
        y={840}
        textAnchor="middle"
        fill={RED}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="28"
      >
        Amazon.com books
      </text>
      <text
        x={1260}
        y={840}
        textAnchor="middle"
        fill={RED}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="28"
      >
        Profitable books
      </text>
    </g>
  );
}

type BadgeKind = "profitable" | "bsr" | "lowreviews";
function BadgeIcon({ kind }: { kind: BadgeKind }) {
  if (kind === "profitable") {
    return (
      <path
        d="M0,-12 L3.5,-3.5 L13,-3.5 L5.5,2 L8,11 L0,5.5 L-8,11 L-5.5,2 L-13,-3.5 L-3.5,-3.5 Z"
        fill={RED}
      />
    );
  }
  if (kind === "bsr") {
    return (
      <g
        stroke={RED}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-12,-12)"
      >
        <polyline points="0,18 8,10 14,16 24,4" />
        <polyline points="18,4 24,4 24,10" />
      </g>
    );
  }
  if (kind === "lowreviews") {
    return (
      <g>
        <path
          d="M-3,-12 L-0.5,-4.5 L7,-4.5 L1,-0.5 L3,7 L-3,2.5 L-9,7 L-7,-0.5 L-13,-4.5 L-5.5,-4.5 Z"
          fill="none"
          stroke={RED}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="6" r="7.5" fill={RED} />
        <path
          d="M6.5,4 L10,8 L13.5,4"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  return null;
}

function Badge({
  x,
  y,
  kind,
  label,
  t01,
  appear,
  width = 200,
}: {
  x: number;
  y: number;
  kind: BadgeKind;
  label: string;
  t01: number;
  appear: number;
  width?: number;
}) {
  const a = clamp((t01 - appear) / 0.55, 0, 1);
  const eased = Easing.easeOutBack(a);
  const tx = (1 - eased) * -24;
  return (
    <g transform={`translate(${x + tx},${y})`} opacity={a}>
      <rect
        x="0"
        y="-28"
        width={width}
        height="56"
        rx="28"
        fill="#fff"
        style={{ filter: "drop-shadow(0 12px 28px rgba(40,20,10,0.12))" }}
      />
      <rect
        x="0"
        y="-28"
        width={width}
        height="56"
        rx="28"
        fill="none"
        stroke={RED_FAINT}
        strokeWidth="1"
      />
      <g transform="translate(28,0)">
        <BadgeIcon kind={kind} />
      </g>
      <text
        x="56"
        y="8"
        fill={RED}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
      >
        {label}
        {kind === "bsr" ? " ↑" : ""}
      </text>
    </g>
  );
}

// ── Master scene ────────────────────────────────────────────────────────────
function HeroScene() {
  const time = useTime();
  const t01 = time;
  const leftReveal = clamp((time - 1.8) / 1.0, 0, 1);
  const rightReveal = clamp((time - 3.5) / 0.9, 0, 1);
  const leftStreaming = time > 2.4;
  const rightStreaming = time > 4.0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Ambient red dots */}
      <g>
        {AMBIENT_DOTS.map((d, i) => {
          const a = clamp((time - d.delay) / 0.6, 0, 1);
          const pulse = 0.85 + 0.15 * Math.sin((time + i * 0.21) * 1.4);
          return (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={RED}
              opacity={d.o * a * pulse}
            />
          );
        })}
      </g>
      <g>
        {RIGHT_DOTS.map((d, i) => {
          const a = clamp((time - d.delay) / 0.6, 0, 1);
          const pulse = 0.85 + 0.15 * Math.sin((time + i * 0.31) * 1.4);
          return (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={RED}
              opacity={d.o * a * pulse}
            />
          );
        })}
      </g>

      <g>
        {LEFT_PATHS.map((p, i) => (
          <DottedPath key={i} path={p} reveal={leftReveal} count={28} dotR={2.6} color={RED_SOFT} />
        ))}
      </g>
      <g>
        {RIGHT_PATHS.map((p, i) => (
          <DottedPath key={i} path={p} reveal={rightReveal} count={32} dotR={2.6} color={RED_SOFT} />
        ))}
      </g>

      <g>
        {LEFT_PATHS.map((p, i) => (
          <ParticleStream
            key={i}
            path={p}
            time={time}
            enabled={leftStreaming}
            count={3}
            speed={0.42 + (i % 3) * 0.04}
            color={RED_BRIGHT}
            baseOpacity={0.9}
          />
        ))}
      </g>
      <g>
        {RIGHT_PATHS.map((p, i) => (
          <ParticleStream
            key={i}
            path={p}
            time={time}
            enabled={rightStreaming}
            count={3}
            speed={0.5 + (i % 3) * 0.04}
            color={RED_BRIGHT}
            baseOpacity={0.9}
          />
        ))}
      </g>

      <g>
        {LEFT_BOOKS.map((b, i) => {
          const a = clamp((time - b.delay) / 0.5, 0, 1);
          const eased = Easing.easeOutBack(a);
          const float = 2 * Math.sin((time + i * 0.7) * 1.1);
          return (
            <g key={i}>
              <ellipse
                cx={b.x}
                cy={b.y + b.size * 0.85}
                rx={b.size * 0.55}
                ry="6"
                fill="rgba(60,30,10,0.08)"
                opacity={a * 0.6}
              />
              <g transform={`translate(0, ${float})`}>
                <BookGlyph
                  x={b.x}
                  y={b.y}
                  size={b.size}
                  tilt={b.tilt}
                  variant={b.variant}
                  opacity={a}
                  scale={eased}
                />
              </g>
            </g>
          );
        })}
      </g>

      <Bot time={time} t01={t01} />

      <g>
        {RIGHT_BOOKS.map((b, i) => {
          const a = clamp((time - b.popDelay) / 0.45, 0, 1);
          const eased = Easing.easeOutBack(a);
          const float = 2 * Math.sin((time + i * 0.9 + 1.5) * 1.1);
          const glow = 0.4 + 0.3 * Math.sin((time + i * 0.6) * 1.6);
          return (
            <g key={i}>
              <circle cx={b.x} cy={b.y} r={b.size * 0.85} fill={RED} opacity={a * 0.18 * glow} />
              <g transform={`translate(0, ${float})`}>
                <RedBookGlyph
                  x={b.x}
                  y={b.y}
                  size={b.size}
                  variant={b.variant}
                  opacity={a}
                  scale={eased}
                />
              </g>
            </g>
          );
        })}
      </g>

      <Badge x={1330} y={250} width={210} kind="profitable" label="Profitable" t01={t01} appear={5.0} />
      <Badge x={1380} y={450} width={154} kind="bsr" label="BSR" t01={t01} appear={5.3} />
      <Badge x={1330} y={650} width={234} kind="lowreviews" label="Low reviews" t01={t01} appear={5.6} />

      <BottomLabels t01={t01} />
      <TitlePill t01={t01} />
    </svg>
  );
}

export default function KdpHeroScene() {
  return (
    <LoopedScene>
      <HeroScene />
    </LoopedScene>
  );
}
