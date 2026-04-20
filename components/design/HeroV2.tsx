"use client";

import React, { useEffect, useState, Fragment } from "react";
import { KickerPill, PrimaryButton, SecondaryButton, Grain } from "./Primitives";

/**
 * Hero — founder-first, proof-first.
 * The right column is Ehsan's portrait + last-month receipt;
 * no fabricated student testimonials.
 */

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) + amt);
  const g = Math.max(0, ((n >> 8) & 255) + amt);
  const b = Math.max(0, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}

function MiniBook({
  color = "#C62828",
  title = "KDP",
  tilt = -6,
  scale = 1,
}: {
  color?: string;
  title?: string;
  tilt?: number;
  scale?: number;
}) {
  return (
    <div
      style={{
        width: 92 * scale,
        height: 130 * scale,
        transform: `rotate(${tilt}deg) perspective(900px) rotateY(-14deg)`,
        boxShadow:
          "0 30px 60px rgba(26,26,26,0.35), 0 2px 0 rgba(201,162,78,0.5) inset",
        borderRadius: 3,
        position: "relative",
        background: `linear-gradient(135deg, ${color}, ${shade(color, -25)})`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 6 * scale,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "18%",
          height: 1.5,
          background: "rgba(201,162,78,0.85)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "42%",
          color: "rgba(250,245,235,0.95)",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 16 * scale,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: "12%",
          height: 1.5,
          background: "rgba(201,162,78,0.85)",
        }}
      />
    </div>
  );
}

/**
 * Multi-hustle income ticker — shows Ehsan's real channels,
 * rotating through them like a status strip. No fake names.
 */
const HUSTLES: Array<[string, string, string]> = [
  ["KDP royalties", "Amazon · 63 books live", "₹1,08,400 last month"],
  ["Etsy printables", "PageBoo shop · weekends", "US$ 99.98 last 30 days"],
  ["6 months passive", "Zero new publishes since Oct", "Books still earning"],
  ["Next cohort", "Standard ₹75,000 · Pro ₹1,25,000", "Rolling intake"],
];

function IncomeTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % HUSTLES.length),
      2800,
    );
    return () => clearInterval(id);
  }, []);
  const cur = HUSTLES[idx];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 18px 10px 14px",
        borderRadius: 999,
        background: "rgba(91,123,91,0.07)",
        border: "1px solid rgba(91,123,91,0.20)",
        fontSize: 13,
        color: "#3D5A3D",
        marginTop: 20,
        maxWidth: "100%",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            background: "#5B7B5B",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 999,
            background: "#5B7B5B",
            opacity: 0.35,
            animation: "pulseRing 1.8s ease-out infinite",
          }}
        />
      </span>
      <span
        style={{
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontSize: 11,
          color: "#5B7B5B",
        }}
      >
        Live
      </span>
      <span
        style={{ width: 1, height: 14, background: "rgba(91,123,91,0.25)" }}
      />
      <span
        key={idx}
        style={{
          display: "inline-flex",
          gap: 6,
          whiteSpace: "nowrap",
          animation: "tickerIn .5s ease-out",
        }}
      >
        <strong style={{ color: "#1A1A1A", fontWeight: 600 }}>{cur[0]}</strong>
        <span style={{ color: "#6B7280" }}>· {cur[1]}</span>
        <span style={{ color: "#C62828", fontWeight: 700 }}>— {cur[2]}</span>
      </span>
    </div>
  );
}

function QualifierStrip() {
  const rows: Array<[string, string]> = [
    ["You have", "a day job and 2 hrs after it"],
    ["You're tired of", "courses with no proof"],
    ["You want", "assets that earn while you sleep"],
  ];
  return (
    <div
      style={{
        marginTop: 28,
        padding: "18px 20px",
        border: "1px dashed rgba(26,26,26,0.18)",
        borderRadius: 14,
        background: "rgba(250,245,235,0.6)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 10,
        }}
      >
        This is for you if —
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}
      >
        {rows.map(([a, b], i) => (
          <div key={i} style={{ fontSize: 14, lineHeight: 1.4 }}>
            <span style={{ color: "#9CA3AF" }}>{a} </span>
            <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FounderCard — replaces the old FeaturedStudent.
 * Photo (polaroid) + real last-month receipt + decorative book stack.
 * Photo path: /ehsan-founder.jpg (drop the file into public/).
 */
function FounderCard() {
  return (
    <div className="skillies-founder-card" style={{ position: "relative", height: 580 }}>
      {/* gold ambient backdrop */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "8% -5% 8% -5%",
          background:
            "radial-gradient(ellipse, rgba(201,162,78,0.25), transparent 65%)",
          filter: "blur(35px)",
        }}
      />

      {/* decorative book stack, top-right */}
      <div
        aria-hidden
        className="skillies-hide-xs skillies-founder-books"
        style={{
          position: "absolute",
          top: 24,
          right: 6,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <MiniBook color="#C62828" title="KDP" tilt={8} scale={0.9} />
        <MiniBook color="#C9A24E" title="vol.2" tilt={-5} scale={0.75} />
        <MiniBook color="#3D5A3D" title="vol.3" tilt={9} scale={0.7} />
      </div>

      {/* polaroid */}
      <div
        className="skillies-founder-polaroid"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 290,
          padding: 14,
          paddingBottom: 64,
          background: "#FAF5EB",
          boxShadow: "0 40px 80px rgba(0,0,0,0.18)",
          transform: "rotate(-4deg)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            borderRadius: 2,
            background:
              "linear-gradient(135deg, #8B5A2B 0%, #C9A24E 60%, #E6C178 100%)",
            position: "relative",
            overflow: "hidden",
            backgroundImage: "url('/ehsan-founder.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        >
          {/* warm tint overlay for editorial feel */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(198,40,40,0.08) 0%, transparent 30%, rgba(26,26,26,0.15) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 10,
              fontSize: 10,
              color: "rgba(250,245,235,0.9)",
              letterSpacing: "0.2em",
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            APR 2026
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "#1A1A1A",
            lineHeight: 1.2,
          }}
        >
          Ehsan — Malappuram
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          Teacher · AI-powered publisher
        </div>
      </div>

      {/* receipt */}
      <div
        className="skillies-founder-receipt"
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 16,
          zIndex: 4,
          padding: "20px 22px",
          borderRadius: 14,
          background: "white",
          border: "1px solid rgba(26,26,26,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#C62828",
            fontWeight: 700,
            letterSpacing: "0.28em",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          RECEIPT
        </div>
        <div
          style={{ width: 1, alignSelf: "stretch", background: "rgba(26,26,26,0.08)" }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              color: "#6B7280",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Last month · March 2026
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 42,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: "6px 0 4px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ₹1,16,000
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            63 books · zero new publishes in 6 months
          </div>
        </div>
        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(91,123,91,0.12)",
            color: "#3D5A3D",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          PASSIVE
        </div>
      </div>

      {/* caption — editorial-style photo label anchored to the polaroid */}
      <div
        className="skillies-founder-caption"
        style={{
          position: "absolute",
          top: -2,
          left: 20,
          width: 290,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 12,
          color: "rgba(26,26,26,0.55)",
          letterSpacing: "0.01em",
          zIndex: 5,
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Fig. 01</span>
        <span
          aria-hidden
          style={{
            flex: 1,
            height: 1,
            background: "rgba(26,26,26,0.22)",
          }}
        />
        <span style={{ whiteSpace: "nowrap" }}>not a stock photo</span>
      </div>
    </div>
  );
}

type LedgerEntry = {
  n: string;
  label: string;
  sub: string;
  color: string;
  visual: "books" | "sparkline" | "dots" | "dash";
};

const LEDGER: LedgerEntry[] = [
  {
    n: "63",
    label: "books written",
    sub: "All of 2025 · KDP paperbacks",
    color: "#C62828",
    visual: "books",
  },
  {
    n: "₹1,16,000",
    label: "paid in March",
    sub: "KDP + Etsy · net of fees",
    color: "#5B7B5B",
    visual: "sparkline",
  },
  {
    n: "6",
    label: "months untouched",
    sub: "Since Oct 2025 · no new uploads",
    color: "#C9A24E",
    visual: "dots",
  },
  {
    n: "0",
    label: "new books since",
    sub: "The whole engine is passive now",
    color: "#1A1A1A",
    visual: "dash",
  },
];

function LedgerVisual({ kind, color }: { kind: LedgerEntry["visual"]; color: string }) {
  const w = 180;
  const h = 26;
  if (kind === "books") {
    // 21 clusters × 3 books each, visually balanced and legible on
    // mobile retinas. Each cluster is a short triad of bars so the
    // bars stay crisp without reading as 63 hair-thin strokes.
    const clusters = 21;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {Array.from({ length: clusters }).map((_, i) => {
          const hVar = 13 + ((i * 7) % 11);
          const clusterX = (i / clusters) * (w - 4);
          const alpha = 0.4 + ((i * 3) % 10) / 28;
          return (
            <g key={i}>
              <rect x={clusterX} y={h - hVar - 2} width={1.6} height={hVar} fill={color} opacity={alpha} />
              <rect x={clusterX + 2.4} y={h - hVar - 2} width={1.6} height={hVar - 2} fill={color} opacity={alpha * 0.85} />
              <rect x={clusterX + 4.8} y={h - hVar - 2} width={1.6} height={hVar - 4} fill={color} opacity={alpha * 0.7} />
            </g>
          );
        })}
      </svg>
    );
  }
  if (kind === "sparkline") {
    const data = [0.32, 0.40, 0.38, 0.46, 0.52, 0.50, 0.58, 0.64, 0.62, 0.74, 0.82, 0.95];
    const pts = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * (w - 4) + 2;
        const y = h - v * (h - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");
    const area = `2,${h - 2} ${pts} ${w - 2},${h - 2}`;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polygon points={area} fill={`${color}1F`} />
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={w - 2}
          cy={h - data[data.length - 1] * (h - 4) - 2}
          r={2.4}
          fill={color}
        />
      </svg>
    );
  }
  if (kind === "dots") {
    // 6 hollow rings — one per month untouched
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <circle
            key={i}
            cx={10 + i * 18}
            cy={h / 2}
            r={6}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            opacity={0.85}
          />
        ))}
      </svg>
    );
  }
  // passive — a dashed flat baseline (no new production activity) followed
  // by a small heartbeat pulse and an end dot (income still arriving).
  // The "still earning" green matches the sparkline tone.
  const green = "#5B7B5B";
  const hbX = w - 56;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <line
        x1={2}
        y1={h / 2}
        x2={hbX}
        y2={h / 2}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeDasharray="3 5"
        opacity={0.55}
      />
      <path
        d={`M ${hbX},${h / 2} l 6,0 l 3,-9 l 4,14 l 4,-18 l 4,13 l 4,0 l 18,0`}
        stroke={green}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={w - 2} cy={h / 2} r={2.8} fill={green} />
    </svg>
  );
}

export default function HeroV2() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "140px 48px 80px",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 85% 10%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(201,162,78,0.16), transparent 60%), #FAF5EB",
      }}
    >
      <Grain opacity={0.09} />

      {/* handwritten margin note — now a founder whisper, not a fake mentor */}
      <div
        aria-hidden
        className="skillies-margin-note"
        style={{
          position: "absolute",
          top: "16%",
          right: "3%",
          transform: "rotate(4deg)",
          maxWidth: 220,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "rgba(26,26,26,0.55)",
            lineHeight: 1.35,
          }}
        >
          &quot;I built this between
          <br />
          classes, after school,
          <br />
          with a ₹35,000 laptop.&quot;
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "linear-gradient(135deg, #C62828, #8B1A1A)",
              color: "#FAF5EB",
              display: "grid",
              placeItems: "center",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.1em",
            }}
          >
            E
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#6B7280",
            }}
          >
            — Ehsan · Founder
          </div>
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          Vol. 01 · The Skillies Manifesto
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Kerala · India · 2026</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.7fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <KickerPill tone="green">AI skills that generate real income</KickerPill>

            <h1
              style={{
                margin: "28px 0 20px",
                fontWeight: 900,
                fontSize: "clamp(82px, 11vw, 184px)",
                letterSpacing: "-0.06em",
                lineHeight: 0.82,
                color: "#1A1A1A",
              }}
            >
              Human&nbsp;brain.
              <br />
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#C62828",
                }}
              >
                AI&nbsp;skills.
              </em>
              <br />
              Real&nbsp;income.
            </h1>

            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(26px, 2.8vw, 40px)",
                color: "#3D5A3D",
                fontWeight: 400,
                margin: "0 0 22px",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              Earn while you sleep.
            </p>

            <p
              style={{
                fontSize: 18,
                color: "#6B7280",
                maxWidth: 560,
                margin: "0 0 28px",
                lineHeight: 1.65,
              }}
            >
              Skillies.AI is a research-and-teach school for the age of AI. We find what actually pays in 2026 — not 2018&apos;s playbook — and teach it to people who&apos;ll use it. Last month, the books I published on Amazon KDP paid me ₹1,16,000 without me touching them in six. Proof, not hype.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <PrimaryButton href="/workshop">Join the Calicut workshop · ₹1,999</PrimaryButton>
              <SecondaryButton href="#program">See the 50-day program</SecondaryButton>
            </div>

            <IncomeTicker />

            <QualifierStrip />

            {/* Ledger card — replaces the old 4-column stat row */}
            <div
              style={{
                marginTop: 32,
                position: "relative",
                padding: "22px 28px 24px",
                borderRadius: 16,
                background: "rgba(250,245,235,0.7)",
                border: "1px solid rgba(26,26,26,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* subtle paper grain */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.05,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  borderRadius: 16,
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='13'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                }}
              />
              {/* ledger header */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#9CA3AF",
                }}
              >
                <span style={{ width: 20, height: 1, background: "#C62828" }} />
                <span>By the numbers · as of March 2026</span>
                <span
                  style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }}
                />
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    textTransform: "none",
                    letterSpacing: "0",
                    color: "#6B7280",
                    fontWeight: 400,
                    fontSize: 12,
                  }}
                >
                  Receipts, not promises
                </span>
              </div>

              {/* 4 ledger columns */}
              <div
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 0,
                }}
              >
                {LEDGER.map((s, i, arr) => (
                  <Fragment key={s.label}>
                    <div
                      style={{
                        paddingRight: 18,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontSize: 52,
                          lineHeight: 0.95,
                          color: s.color,
                          letterSpacing: "-0.03em",
                          fontStyle: "italic",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {s.n}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "#1A1A1A",
                          fontWeight: 700,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontStyle: "italic",
                          fontSize: 12,
                          color: "#6B7280",
                          lineHeight: 1.35,
                        }}
                      >
                        {s.sub}
                      </div>
                      <div style={{ marginTop: 2 }}>
                        <LedgerVisual kind={s.visual} color={s.color} />
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          width: 1,
                          background:
                            "linear-gradient(to bottom, transparent, rgba(26,26,26,0.12), transparent)",
                          marginRight: 18,
                          marginLeft: -18,
                        }}
                      />
                    )}
                  </Fragment>
                ))}
              </div>

              {/* footer */}
              <div
                style={{
                  position: "relative",
                  marginTop: 20,
                  paddingTop: 14,
                  borderTop: "1px dashed rgba(26,26,26,0.12)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  color: "#6B7280",
                  letterSpacing: "0.02em",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  A full ledger — screenshots on request.
                </span>
                <a
                  href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20can%20you%20share%20the%20KDP%20dashboard%20screenshots%3F%20My%20name%20is%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C62828",
                    textDecoration: "none",
                  }}
                >
                  Ask on WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <FounderCard />
        </div>
      </div>
    </section>
  );
}
