"use client";

import React, { ReactNode } from "react";
import { Kicker, Grain } from "../design/Primitives";

function SpotDiffMock() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 22,
        alignItems: "center",
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            width: 112,
            height: 148,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 10px 24px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 7,
              textAlign: "center",
              color: "#6B7280",
              letterSpacing: "0.15em",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            FIND THE DIFFERENCE
          </div>
          <svg width="100%" height="92" viewBox="0 0 92 92" style={{ display: "block" }}>
            <rect x="0" y="0" width="92" height="52" fill="#E6F0F5" />
            <rect x="0" y="52" width="92" height="40" fill="#C8E0A8" />
            <circle cx={i === 1 ? "16" : "14"} cy="14" r="7" fill="#E6C178" />
            <rect x="30" y="35" width="34" height="26" fill="#C62828" />
            <path d="M28 35 L47 22 L66 35 Z" fill="#1A1A1A" />
            <rect x="40" y="45" width="8" height="16" fill="#3D5A3D" />
            <rect
              x="52"
              y="42"
              width="8"
              height="7"
              fill="#E6F0F5"
              stroke="#1A1A1A"
              strokeWidth="0.5"
            />
            <circle cx="76" cy="44" r="10" fill="#5B7B5B" />
            <rect x="74" y="52" width="4" height="10" fill="#8B5A2B" />
            {i === 1 && (
              <path
                d="M12 28 Q16 24 20 28"
                stroke="#1A1A1A"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            )}
            <circle cx="16" cy="68" r="3" fill={i === 0 ? "#C62828" : "#C9A24E"} />
            <circle cx="82" cy="72" r="2.5" fill="#C9A24E" />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 6,
              right: 8,
              fontSize: 8,
              fontWeight: 700,
              color: "#9CA3AF",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            P.{i === 0 ? "12" : "13"}
          </div>
        </div>
      ))}
    </div>
  );
}

function PuzzleMock() {
  const letters: Record<number, string> = { 1: "K", 2: "D", 3: "P", 7: "A", 11: "I", 13: "E", 17: "S" };
  const filled = [0, 4, 6, 8, 10, 12, 16, 20, 24];
  return (
    <div style={{ padding: 22, width: "100%", display: "grid", placeItems: "center" }}>
      <div
        style={{
          background: "white",
          borderRadius: 8,
          padding: 14,
          boxShadow: "0 10px 24px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 8,
            textAlign: "center",
            color: "#6B7280",
            letterSpacing: "0.2em",
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          CROSSWORD · 43
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 22px)",
            gridAutoRows: 22,
            gap: 2,
          }}
        >
          {Array.from({ length: 25 }).map((_, i) => {
            const f = filled.includes(i);
            return (
              <div
                key={i}
                style={{
                  background: f ? "#1A1A1A" : "#FAF5EB",
                  borderRadius: 1,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  border: f ? "none" : "1px solid rgba(26,26,26,0.08)",
                  position: "relative",
                }}
              >
                {f ? "" : letters[i] || ""}
                {!f && [1, 5, 14].includes(i) && (
                  <span
                    style={{
                      position: "absolute",
                      top: 1,
                      left: 2,
                      fontSize: 6,
                      color: "#9CA3AF",
                      fontWeight: 700,
                    }}
                  >
                    {[1, 5, 14].indexOf(i) + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ColoringMock() {
  return (
    <div style={{ padding: 18, display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: 160,
          aspectRatio: "3/4",
          background: "white",
          borderRadius: 8,
          boxShadow: "0 10px 24px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.06)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 8,
            textAlign: "center",
            color: "#6B7280",
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          COLOR ME
        </div>
        <svg
          width="100%"
          viewBox="0 0 120 160"
          style={{ flex: 1 }}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="60" cy="60" r="14" />
          <circle cx="60" cy="60" r="6" fill="#C9A24E" stroke="#1A1A1A" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={a} transform={`rotate(${a} 60 60)`}>
              <path d="M60 46 Q52 30 60 18 Q68 30 60 46Z" />
            </g>
          ))}
          <path d="M60 96 L60 148" />
          <path
            d="M60 118 Q44 108 38 120 Q54 126 60 118Z"
            fill="#7A9A7A"
            stroke="#1A1A1A"
          />
          <path d="M60 134 Q76 124 82 136" />
          <path d="M92 138 L110 126" stroke="#C62828" strokeWidth="3" />
          <path
            d="M106 128 L112 122 L114 126 L108 132Z"
            fill="#1A1A1A"
            stroke="#1A1A1A"
          />
        </svg>
        <div
          style={{
            fontSize: 8,
            textAlign: "right",
            color: "#9CA3AF",
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          PAGE 07
        </div>
      </div>
    </div>
  );
}

type Accent = "red" | "gold" | "green";

function BookTypeCard({
  kicker,
  title,
  malayalam,
  translit,
  desc,
  bullets,
  mockup,
  accent,
  proof,
}: {
  kicker: string;
  title: string;
  malayalam: string;
  translit?: string;
  desc: string;
  bullets: string[];
  mockup: ReactNode;
  accent: Accent;
  proof: string;
}) {
  const tones = {
    red: {
      solid: "#C62828",
      soft: "rgba(198,40,40,0.08)",
      border: "rgba(198,40,40,0.25)",
      bg: "linear-gradient(135deg, #F0E8D8, #FAF5EB)",
    },
    gold: {
      solid: "#C9A24E",
      soft: "rgba(201,162,78,0.10)",
      border: "rgba(201,162,78,0.30)",
      bg: "linear-gradient(135deg, rgba(201,162,78,0.10), rgba(230,193,120,0.14))",
    },
    green: {
      solid: "#5B7B5B",
      soft: "rgba(91,123,91,0.10)",
      border: "rgba(91,123,91,0.30)",
      bg: "linear-gradient(135deg, rgba(91,123,91,0.08), rgba(230,193,120,0.08))",
    },
  };
  const t = tones[accent];
  return (
    <div
      style={{
        padding: 28,
        borderRadius: 26,
        background: "white",
        border: "1px solid #F0E8D8",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        transition: "all .35s cubic-bezier(.22,1,.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.10)";
        e.currentTarget.style.borderColor = t.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "#F0E8D8";
      }}
    >
      <div
        style={{
          aspectRatio: "4/3",
          borderRadius: 18,
          background: t.bg,
          position: "relative",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        {mockup}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "5px 12px",
            background: "rgba(250,245,235,0.95)",
            backdropFilter: "blur(6px)",
            color: t.solid,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.22em",
            borderRadius: 999,
          }}
        >
          {kicker}
        </div>
      </div>
      <div>
        <h3
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#1A1A1A",
            margin: "0 0 6px",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h3>
        <p
          className="font-ml"
          style={{
            fontSize: 18,
            color: t.solid,
            fontWeight: 700,
            margin: "0 0 4px",
            letterSpacing: "-0.02em",
          }}
        >
          {malayalam}
        </p>
        {translit && (
          <p
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              margin: "0 0 14px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            {translit}
          </p>
        )}
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 1.6,
            margin: "0 0 16px",
          }}
        >
          {desc}
        </p>
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: "#1A1A1A",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={t.solid}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span style={{ lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: t.soft,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: t.solid,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: t.solid === "#C9A24E" ? "#8a6a1f" : t.solid,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {proof}
          </span>
        </div>
      </div>
    </div>
  );
}

function StackingOutcome() {
  const bars: Array<{ n: string; v: string; c: string }> = [
    { n: "1", v: "₹1.5K", c: "#8B1A1A" },
    { n: "10", v: "₹15K", c: "#C62828" },
    { n: "60", v: "₹60K+", c: "#C9A24E" },
  ];
  return (
    <div
      style={{
        marginTop: 56,
        padding: "40px 44px",
        borderRadius: 28,
        background: "#1A1A1A",
        color: "white",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 40,
        alignItems: "center",
      }}
    >
      <Grain opacity={0.07} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 90% 50%, rgba(198,40,40,0.35), transparent 60%)",
        }}
      />
      <div style={{ position: "relative" }}>
        <Kicker tone="gold">The Stacking Math</Kicker>
        <h3
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "14px 0 10px",
            lineHeight: 1.05,
          }}
        >
          Start with 1 book. Stack to 60.
          <br />
          <span style={{ color: "#EF4444" }}>The royalties compound.</span>
        </h3>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          A single puzzle or coloring book earns ₹500–2,000/month. Ten of them earn ₹15,000+. Sixty earns ₹60,000+ passive — that&apos;s the goal of the 50-day program.
        </p>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
        }}
      >
        {bars.map((s, i) => (
          <div key={s.n} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 76,
                height: 60 + i * 36,
                background: s.c,
                borderRadius: "6px 6px 0 0",
                display: "grid",
                placeItems: "center",
                marginBottom: 10,
                boxShadow: `0 -8px 24px ${s.c}50`,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {s.n === "1" ? "Book" : "Books"}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "white",
                marginTop: 2,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
              }}
            >
              {s.v}/mo
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BookReveal() {
  return (
    <section
      id="books"
      style={{
        padding: "128px 24px",
        background: "#FAF5EB",
        position: "relative",
      }}
    >
      <Grain opacity={0.05} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 64,
            maxWidth: 760,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Kicker tone="red">What You&apos;ll Actually Publish</Kicker>
          <h2
            style={{
              fontSize: "clamp(44px, 5.6vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              color: "#1A1A1A",
              margin: "18px 0 22px",
              lineHeight: 0.95,
            }}
          >
            Not novels. Not theory.
            <br />
            <span style={{ color: "#C62828" }}>No-content books.</span>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#6B7280",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            The three book types Amazon sells the most of — and the easiest to start with. No writing experience. No Malayalam required. Global audience, ready to buy.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          <BookTypeCard
            kicker="TYPE 01"
            title="Spot the Difference"
            malayalam="വ്യത്യാസങ്ങൾ കണ്ടെത്തുക"
            translit="Vyathyasangal Kandethuka"
            desc="Two near-identical scenes side-by-side. 5–10 differences to find per page. Kids love them. Parents buy them. Schools and libraries stock them by the dozen."
            bullets={[
              "Claude writes prompts, you build scenes in Canva",
              "Canva does the layout in one template",
              "No text, no translation — sell globally",
            ]}
            mockup={<SpotDiffMock />}
            accent="red"
            proof="One founding student: ₹4,200 in month one"
          />
          <BookTypeCard
            kicker="TYPE 02"
            title="Puzzle Books"
            malayalam="പസിൽ പുസ്തകങ്ങൾ"
            translit="Puzzle Pusthakangal"
            desc="Crosswords, word searches, sudoku, logic grids. Generated in bulk using AI puzzle tools. The hottest KDP category for adult hobbyists in 2026."
            bullets={[
              "Generator tools make 100+ puzzles in a sitting",
              "Evergreen — same book earns for years",
              "Easy to stack: holiday, themed, seasonal",
            ]}
            mockup={<PuzzleMock />}
            accent="gold"
            proof="Steady ₹8–15K/month once you stack 10+ titles"
          />
          <BookTypeCard
            kicker="TYPE 03"
            title="Coloring Books"
            malayalam="നിറം പൂശൽ പുസ്തകങ്ങൾ"
            translit="Niram Pooshal Pusthakangal"
            desc="Line-art illustrations on blank pages. Kids' animals, Kerala cultural motifs, adult mandalas. Claude + Canva do 80% of the work — you curate."
            bullets={[
              "Claude prompts + Canva templates = 30 pages in a day",
              "Cultural niches (Kerala, Indian, festival) rank fast",
              "Seasonal demand (Q4 gifting) spikes royalties",
            ]}
            mockup={<ColoringMock />}
            accent="green"
            proof="Seasonal spikes hit ₹20,000+ in Q4"
          />
        </div>
        <StackingOutcome />
      </div>
    </section>
  );
}
