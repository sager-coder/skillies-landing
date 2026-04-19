"use client";

import React, { useEffect, useState, Fragment } from "react";
import { KickerPill, PrimaryButton, SecondaryButton, Grain } from "./Primitives";

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
  author = "KK",
  tilt = -6,
  scale = 1,
}: {
  color?: string;
  title?: string;
  author?: string;
  tilt?: number;
  scale?: number;
}) {
  return (
    <div
      style={{
        width: 150 * scale,
        height: 210 * scale,
        transform: `rotate(${tilt}deg) perspective(900px) rotateY(-14deg)`,
        boxShadow:
          "0 40px 80px rgba(26,26,26,0.35), 0 2px 0 rgba(201,162,78,0.5) inset",
        borderRadius: 4,
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
          width: 8 * scale,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "14%",
          height: 2,
          background: "rgba(201,162,78,0.85)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "40%",
          color: "rgba(250,245,235,0.95)",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 26 * scale,
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
          bottom: "14%",
          fontSize: 9 * scale,
          letterSpacing: "0.3em",
          color: "rgba(201,162,78,0.9)",
          fontWeight: 700,
        }}
      >
        {author}
      </div>
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: "10%",
          height: 2,
          background: "rgba(201,162,78,0.85)",
        }}
      />
    </div>
  );
}

const TICKER_ITEMS: Array<[string, string, string, string]> = [
  ["Arjun M.", "Kottayam", "published book #4", "₹12,400 this month"],
  ["Priya S.", "Calicut", "hit ₹1L lifetime", "58 days in"],
  ["Rahul K.", "Kochi", "first royalty cheque", "₹3,280"],
  ["Anjali V.", "Thrissur", "niche: kids activity", "11 titles live"],
  ["Mohammed F.", "Malappuram", "scaled to 5 niches", "₹24,600 last month"],
];

function OutcomeTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % TICKER_ITEMS.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);
  const cur = TICKER_ITEMS[idx];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 16px 10px 14px",
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
        <span style={{ color: "#1A1A1A" }}>· {cur[2]}</span>
        <span style={{ color: "#C62828", fontWeight: 700 }}>— {cur[3]}</span>
      </span>
    </div>
  );
}

function QualifierStrip() {
  const rows: Array<[string, string]> = [
    ["You have", "a laptop and 2 hrs a day"],
    ["You're tired of", "promises with no proof"],
    ["You want", "income, not another course"],
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

function FeaturedStudent() {
  return (
    <div style={{ position: "relative", height: 520 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "10% -5% 10% -5%",
          background:
            "radial-gradient(ellipse, rgba(201,162,78,0.22), transparent 65%)",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 30,
          width: 240,
          padding: 14,
          paddingBottom: 44,
          background: "#FAF5EB",
          boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
          transform: "rotate(-5deg)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 240,
            borderRadius: 2,
            background:
              "linear-gradient(135deg, #3D5A3D 0%, #5B7B5B 55%, #7A9A7A 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 200 240"
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
          >
            <circle cx="100" cy="90" r="38" fill="rgba(250,245,235,0.9)" />
            <path
              d="M 30 240 Q 30 150 100 150 Q 170 150 170 240 Z"
              fill="rgba(250,245,235,0.9)"
            />
            <rect x="0" y="200" width="200" height="40" fill="rgba(26,26,26,0.15)" />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 10,
              fontSize: 10,
              color: "rgba(250,245,235,0.8)",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            APR 2026
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 16,
            color: "#1A1A1A",
            lineHeight: 1.2,
          }}
        >
          Priya S. — Calicut
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
          Enrolled Sep 2025
        </div>
      </div>

      <div style={{ position: "absolute", top: 160, right: 0, zIndex: 3 }}>
        <MiniBook color="#C62828" title="Mindful" author="PRIYA S." tilt={6} scale={1.2} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 20,
          zIndex: 4,
          padding: "20px 22px",
          borderRadius: 14,
          background: "white",
          border: "1px solid rgba(26,26,26,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
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
            Earned in 90 days
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 40,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: "6px 0 4px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ₹1,24,380
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            Across 7 books · Amazon KDP royalties
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
          ▲ 18%
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: -4,
          right: 8,
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "rgba(26,26,26,0.55)",
          transform: "rotate(2deg)",
        }}
      >
        Fig. 01 — real student, real royalties.
      </div>
    </div>
  );
}

const STATS: Array<[string, string, string]> = [
  ["63", "books published", "#C62828"],
  ["₹8L+", "student earnings", "#5B7B5B"],
  ["50", "days to first ₹", "#C9A24E"],
  ["100%", "Malayalam-first", "#1A1A1A"],
];

export default function HeroV2() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "120px 48px 80px",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 85% 10%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(201,162,78,0.16), transparent 60%), #FAF5EB",
      }}
    >
      <Grain opacity={0.09} />

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "14%",
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
          &quot;I&apos;ll show you the exact
          <br />
          system I used to earn
          <br />
          ₹8L from one laptop.&quot;
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
            KK
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
            — Your mentor
          </div>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          left: "3%",
          transform: "rotate(-14deg)",
          border: "3px solid #C62828",
          borderRadius: 6,
          padding: "8px 14px",
          color: "#C62828",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.3em",
          opacity: 0.5,
        }}
      >
        EST. 2025 · CALICUT
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
              className="font-ml"
              style={{
                fontSize: "clamp(22px, 2.4vw, 32px)",
                color: "#3D5A3D",
                fontWeight: 700,
                margin: "0 0 26px",
                letterSpacing: "-0.015em",
                lineHeight: 1.22,
              }}
            >
              We don&apos;t teach theory. We teach you how to earn.
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
              Proof-backed systems, Malayalam-first training, and six-figure case studies from real Kerala founders — not Silicon Valley fantasies.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <PrimaryButton href="#program">Start your journey — ₹45K</PrimaryButton>
              <SecondaryButton href="#how">Watch the 2-min trailer</SecondaryButton>
            </div>

            <OutcomeTicker />

            <QualifierStrip />

            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                borderTop: "1px solid rgba(26,26,26,0.15)",
                borderBottom: "1px solid rgba(26,26,26,0.15)",
                padding: "18px 0",
                marginTop: 28,
              }}
            >
              {STATS.map(([v, k, c], i, arr) => (
                <Fragment key={k}>
                  <div style={{ flex: 1, paddingRight: 16 }}>
                    <div
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 34,
                        lineHeight: 1,
                        color: c,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#6B7280",
                        fontWeight: 700,
                        marginTop: 6,
                      }}
                    >
                      {k}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 1, background: "rgba(26,26,26,0.1)" }} />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <FeaturedStudent />
        </div>
      </div>
    </section>
  );
}
