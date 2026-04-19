"use client";

import React from "react";
import KDPDashboardProof from "./KDPDashboardProof";

/**
 * The Receipts — Ehsan's actual income ledger.
 * Replaces the fabricated 6-student grid with a honest breakdown
 * of his own numbers: KDP royalties, Etsy printables, passive months.
 */

type Channel = {
  name: string;
  sub: string;
  amount: string;
  chart: number[];
  accent: string;
};

const CHANNELS: Channel[] = [
  {
    name: "Amazon KDP · Royalties",
    sub: "63 books · zero new publishes since Oct 2025",
    amount: "₹1,07,680",
    chart: [0.52, 0.61, 0.55, 0.68, 0.72, 0.66, 0.74, 0.80, 0.75, 0.82, 0.88, 0.96],
    accent: "#C62828",
  },
  {
    name: "Etsy · PageBoo shop",
    sub: "Digital printables · 64 visits, 2 orders",
    amount: "₹8,340",
    chart: [0.12, 0.18, 0.6, 0.08, 0.2, 0.22, 0.2, 0.04, 0.26, 0.3, 0.16, 0.24],
    accent: "#C9A24E",
  },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 220;
  const h = 56;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - v * h;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block" }}
    >
      <polygon points={area} fill={`${color}20`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - data[data.length - 1] * h}
        r="3.5"
        fill={color}
      />
    </svg>
  );
}

function ChannelCard({ c }: { c: Channel }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 18,
        background: "#FAF5EB",
        border: "1px solid rgba(26,26,26,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: c.accent,
              marginBottom: 6,
            }}
          >
            {c.name}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
            {c.sub}
          </div>
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            background: `${c.accent}15`,
            color: c.accent,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            whiteSpace: "nowrap",
          }}
        >
          LAST 30D
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 48,
            color: "#1A1A1A",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {c.amount}
        </div>
      </div>

      <Sparkline data={c.chart} color={c.accent} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#9CA3AF",
          letterSpacing: "0.15em",
          fontWeight: 600,
        }}
      >
        <span>{MONTHS[0]} &apos;25</span>
        <span>{MONTHS[MONTHS.length - 1]} &apos;26</span>
      </div>
    </div>
  );
}

const SUMMARY: Array<[string, string]> = [
  ["63", "books on Amazon"],
  ["6", "months zero publishes"],
  ["₹8,71,982", "KDP royalties lifetime"],
  ["2", "income channels, 1 laptop"],
];

export default function ProofWall() {
  return (
    <section style={{ padding: "120px 48px", background: "white" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
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
          § 04 · The Receipts
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Screenshots on request.</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 40,
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 80px)",
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                color: "#C62828",
                fontWeight: 400,
              }}
            >
              ₹1,16,000
            </em>{" "}
            last month.
            <br />
            Zero new books.
          </h2>
          <div>
            <p
              style={{
                fontSize: 17,
                color: "#6B7280",
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 480,
              }}
            >
              I haven&apos;t published a single new book since October 2025. These are digital assets sitting on Amazon — they kept paying while I taught class, ran my Etsy shop, and prepped the Calicut workshop. That&apos;s the whole point: build once, earn for years.
            </p>
          </div>
        </div>

        {/* KDP dashboard — the main exhibit */}
        <div style={{ marginBottom: 40 }}>
          <KDPDashboardProof />
        </div>

        {/* Two channel cards side-by-side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {CHANNELS.map((c) => (
            <ChannelCard key={c.name} c={c} />
          ))}
        </div>

        {/* Total strip */}
        <div
          style={{
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(198,40,40,0.06), rgba(201,162,78,0.08))",
            border: "1px solid rgba(198,40,40,0.15)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 32,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#C62828",
                marginBottom: 10,
              }}
            >
              Total · last 30 days
            </div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 72,
                color: "#1A1A1A",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹1,16,020
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "10px 0 0",
                lineHeight: 1.5,
                maxWidth: 420,
              }}
            >
              Roughly half my teaching salary — from assets I built in 2025 and stopped touching.
            </p>
          </div>
          <div
            style={{
              borderLeft: "1px solid rgba(26,26,26,0.12)",
              paddingLeft: 32,
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "#1A1A1A",
                lineHeight: 1.35,
                marginBottom: 14,
              }}
            >
              &ldquo;Build once.
              <br />
              Earn while you sleep,
              <br />
              teach, travel, breathe.&rdquo;
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#6B7280",
              }}
            >
              — That&apos;s the whole pitch.
            </div>
          </div>
        </div>

        {/* Summary strip */}
        <div
          style={{
            padding: "24px 32px",
            borderRadius: 18,
            background: "#FAF5EB",
            border: "1px solid rgba(26,26,26,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          {SUMMARY.map(([v, k], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 32,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                {k}
              </div>
            </div>
          ))}
          <a
            href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%20saw%20your%20KDP%20dashboard%20on%20skillies.ai.%20Can%20you%20walk%20me%20through%20it%20live%20over%20WhatsApp%20video%3F%20My%20name%20is%20"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: "#1A1A1A",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Ask for screenshots →
          </a>
        </div>
      </div>
    </section>
  );
}
