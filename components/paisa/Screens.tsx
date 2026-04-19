"use client";

import React, { ReactNode } from "react";

export const PAISA_FOREST = "#1F3A2E";
export const PAISA_FOREST_DEEP = "#142821";
export const PAISA_FOREST_2 = "#2D4A3A";
export const PAISA_GLOW = "#3D5F4A";
export const PAISA_CREAM = "#FAF5EB";
export const PAISA_GOLD = "#C9A24E";
export const PAISA_GOLD_LIGHT = "#E6C178";
export const PAISA_RED = "#C62828";

export function PaisaPhone({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 360,
          height: 640,
          borderRadius: 40,
          overflow: "hidden",
          background: PAISA_FOREST_DEEP,
          position: "relative",
          boxShadow: `0 50px 100px rgba(20,40,33,0.35), 0 0 0 10px ${PAISA_FOREST_DEEP}, 0 0 0 11px ${PAISA_FOREST_2}`,
        }}
      >
        {children}
      </div>
      <p
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "#6B7280",
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

export function PaisaLogo({
  size = 1,
  onDark = true,
}: {
  size?: number;
  onDark?: boolean;
}) {
  const bg = onDark ? "rgba(250,245,235,0.96)" : PAISA_FOREST;
  const fg = onDark ? PAISA_FOREST : PAISA_CREAM;
  const accent = onDark ? PAISA_RED : PAISA_GOLD;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7 * size,
        padding: `${7 * size}px ${14 * size}px`,
        background: bg,
        borderRadius: 999,
      }}
    >
      <span
        style={{
          width: 8 * size,
          height: 8 * size,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 0 ${3 * size}px ${accent}25`,
        }}
      />
      <span
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 16 * size,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: fg,
          fontStyle: "italic",
        }}
      >
        Paisa
        <span style={{ color: accent, fontStyle: "normal" }}>.AI</span>
      </span>
    </div>
  );
}

function ForestAtmosphere({ grainId }: { grainId: string }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 15%, ${PAISA_GLOW}, transparent 55%), radial-gradient(ellipse at 50% 95%, rgba(201,162,78,0.15), transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35))",
          pointerEvents: "none",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.06,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </>
  );
}

export function PaisaCover() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: PAISA_FOREST,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: PAISA_CREAM,
      }}
    >
      <ForestAtmosphere grainId="paisa-cover-grain" />
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <PaisaLogo />
        <div
          style={{
            padding: "5px 12px",
            background: "rgba(201,162,78,0.15)",
            border: `1px solid ${PAISA_GOLD}55`,
            borderRadius: 999,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: PAISA_GOLD_LIGHT,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: PAISA_GOLD,
              boxShadow: `0 0 8px ${PAISA_GOLD}`,
            }}
          />
          EP · 014
        </div>
      </div>

      <div style={{ position: "relative", textAlign: "left" }}>
        <div
          style={{
            height: 1,
            width: 40,
            background: PAISA_GOLD,
            marginBottom: 20,
            opacity: 0.7,
          }}
        />
        <p
          className="font-ml"
          style={{
            fontSize: 17,
            color: PAISA_GOLD_LIGHT,
            margin: "0 0 6px",
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          ഈ ആഴ്ച
        </p>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 62,
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 0.92,
            margin: 0,
            color: PAISA_CREAM,
          }}
        >
          How a{" "}
          <em style={{ fontStyle: "italic", color: PAISA_GOLD_LIGHT }}>quiet</em>
          <br />
          Kerala mom
          <br />
          made <em style={{ fontStyle: "italic" }}>₹4.2L</em>.
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "rgba(250,245,235,0.45)",
            margin: "22px 0 0",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          A weekly story · Malayalam
        </p>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "rgba(250,245,235,0.06)",
          backdropFilter: "blur(10px)",
          borderRadius: 18,
          border: "1px solid rgba(250,245,235,0.10)",
        }}
      >
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: PAISA_CREAM,
          }}
        >
          Swipe to begin
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: PAISA_GOLD,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={PAISA_FOREST_DEEP}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PaisaNewsCard() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: PAISA_FOREST,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        color: PAISA_CREAM,
      }}
    >
      <ForestAtmosphere grainId="paisa-news-grain" />
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <PaisaLogo size={0.78} />
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: PAISA_GOLD_LIGHT,
          }}
        >
          chapter one
        </span>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 110,
            fontWeight: 400,
            color: PAISA_GOLD,
            letterSpacing: "-0.04em",
            lineHeight: 0.8,
            fontStyle: "italic",
          }}
        >
          01
        </div>
        <div style={{ flex: 1, paddingBottom: 14 }}>
          <div
            style={{
              height: 1,
              background: PAISA_GOLD,
              opacity: 0.5,
              marginBottom: 10,
            }}
          />
          <p
            style={{
              fontSize: 10,
              color: PAISA_GOLD_LIGHT,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Claude · Canva · KDP
          </p>
        </div>
      </div>

      <h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 34,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 20px",
          color: PAISA_CREAM,
          textWrap: "balance",
        }}
      >
        One{" "}
        <em style={{ fontStyle: "italic", color: PAISA_GOLD_LIGHT }}>
          coloring book
        </em>{" "}
        a week. Sixty in a year.
      </h2>

      <p
        style={{
          fontSize: 14,
          color: "rgba(250,245,235,0.7)",
          lineHeight: 1.6,
          margin: 0,
          fontWeight: 300,
        }}
      >
        Farida starts every Sunday with Claude. By Friday the book is live on Amazon. Royalties arrive monthly, in INR.
      </p>

      <div
        style={{
          marginTop: "auto",
          padding: "16px 18px",
          background: "rgba(250,245,235,0.07)",
          border: `1px solid ${PAISA_GOLD}40`,
          borderRadius: 16,
          position: "relative",
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: PAISA_GOLD_LIGHT,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 6px",
          }}
        >
          The lesson
        </p>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 16,
            color: PAISA_CREAM,
            margin: 0,
            lineHeight: 1.35,
          }}
        >
          Rhythm beats ambition. One book a week, every week.
        </p>
      </div>
    </div>
  );
}

export function PaisaStatCard() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: PAISA_FOREST,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: PAISA_CREAM,
        textAlign: "center",
      }}
    >
      <ForestAtmosphere grainId="paisa-stat-grain" />
      <div style={{ position: "relative" }}>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: PAISA_GOLD_LIGHT,
            margin: "0 0 4px",
          }}
        >
          the number
        </p>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "rgba(250,245,235,0.55)",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 30px",
          }}
        >
          of the week
        </p>

        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 180,
            fontWeight: 400,
            letterSpacing: "-0.05em",
            lineHeight: 0.82,
            margin: "0 0 4px",
            background: `linear-gradient(180deg, ${PAISA_CREAM} 0%, ${PAISA_GOLD} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ₹4.2<em style={{ fontStyle: "italic" }}>L</em>
        </div>

        <div
          style={{
            height: 1,
            width: 60,
            background: PAISA_GOLD,
            margin: "18px auto 20px",
            opacity: 0.7,
          }}
        />

        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 20,
            color: PAISA_CREAM,
            margin: "0 0 4px",
            lineHeight: 1.3,
            fontStyle: "italic",
          }}
        >
          earned by one Kerala mom
        </p>
        <p
          style={{
            fontSize: 13,
            color: "rgba(250,245,235,0.55)",
            margin: 0,
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          publishing coloring &amp; puzzle
          <br />
          books on Amazon KDP
        </p>

        <div
          style={{
            marginTop: 44,
            padding: "8px 16px",
            display: "inline-block",
            background: "rgba(201,162,78,0.12)",
            border: `1px solid ${PAISA_GOLD}55`,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: PAISA_GOLD_LIGHT,
            textTransform: "uppercase",
          }}
        >
          Amazon KDP · April 2026
        </div>
      </div>
    </div>
  );
}

export function PaisaCTA() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: PAISA_FOREST,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: PAISA_CREAM,
      }}
    >
      <ForestAtmosphere grainId="paisa-cta-grain" />
      <div style={{ position: "relative" }}>
        <PaisaLogo size={0.8} />
      </div>

      <div style={{ position: "relative" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: PAISA_GOLD_LIGHT,
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 14px",
          }}
        >
          This week&apos;s lesson
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 44,
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 18px",
            textWrap: "balance",
          }}
        >
          Come to the{" "}
          <em style={{ fontStyle: "italic", color: PAISA_GOLD_LIGHT }}>
            workshop.
          </em>
          <br />
          Leave with a <em style={{ fontStyle: "italic" }}>book</em>.
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(250,245,235,0.65)",
            lineHeight: 1.55,
            margin: 0,
            textWrap: "pretty",
            fontWeight: 300,
          }}
        >
          One day in Calicut. Your first coloring or puzzle book live on Amazon by 4 PM.
        </p>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            padding: 18,
            borderRadius: 20,
            background: PAISA_FOREST_DEEP,
            color: PAISA_CREAM,
            marginBottom: 14,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${PAISA_GOLD}40`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 90% 50%, ${PAISA_GOLD}30, transparent 60%)`,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  color: PAISA_GOLD_LIGHT,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                Next workshop
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 20,
                  fontStyle: "italic",
                  margin: "0 0 2px",
                }}
              >
                Calicut · May 31
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(250,245,235,0.5)",
                  margin: 0,
                }}
              >
                skillies.ai/workshop
              </p>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: PAISA_GOLD,
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PAISA_FOREST_DEEP} strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "rgba(250,245,235,0.5)",
            textAlign: "center",
            margin: 0,
          }}
        >
          follow @paisa.ai for weekly drops
        </p>
      </div>
    </div>
  );
}

export function PaisaLowerThird() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${PAISA_FOREST}00 0%, ${PAISA_FOREST_DEEP}cc 100%), linear-gradient(135deg, ${PAISA_FOREST_2}, ${PAISA_FOREST_DEEP} 60%, #3a2a12)`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: PAISA_CREAM,
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.05,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id="lt-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lt-grain)" />
      </svg>
      <div style={{ position: "absolute", top: 24, left: 24 }}>
        <PaisaLogo size={0.72} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: `${PAISA_GOLD}`,
          color: PAISA_FOREST_DEEP,
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: 999,
            background: PAISA_FOREST_DEEP,
          }}
        />
        ON AIR
      </div>

      <div
        style={{
          padding: "18px 20px",
          background: "rgba(250,245,235,0.97)",
          color: PAISA_FOREST_DEEP,
          borderRadius: 22,
          backdropFilter: "blur(12px)",
          border: `1px solid ${PAISA_GOLD}44`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: PAISA_FOREST,
              color: PAISA_GOLD_LIGHT,
              display: "grid",
              placeItems: "center",
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 20,
            }}
          >
            E
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 16,
                fontStyle: "italic",
                margin: 0,
                color: PAISA_FOREST,
              }}
            >
              Ehsan Asgar P
            </p>
            <p
              style={{
                fontSize: 9,
                color: "#6B7280",
                margin: 0,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Host · Skillies.AI
            </p>
          </div>
        </div>
        <p
          className="font-ml"
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.35,
            margin: "0 0 4px",
            color: PAISA_FOREST_DEEP,
          }}
        >
          &ldquo;ഒരു ആഴ്ച—ഒരു കഥ...&rdquo;
        </p>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "#6B7280",
            margin: 0,
          }}
        >
          One week — one story.
        </p>
      </div>

      <div
        style={{
          marginTop: 14,
          height: 2,
          borderRadius: 999,
          background: "rgba(250,245,235,0.15)",
        }}
      >
        <div
          style={{
            width: "34%",
            height: "100%",
            background: PAISA_GOLD,
            borderRadius: 999,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "rgba(250,245,235,0.55)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <span>0:31</span>
        <span>1:30</span>
      </div>
    </div>
  );
}

const THUMB_ITEMS = [
  { ep: "014", title: "Farida's ₹4.2L", tag: "KDP story", bg: `linear-gradient(135deg, ${PAISA_FOREST_2}, ${PAISA_FOREST_DEEP})`, accent: PAISA_GOLD },
  { ep: "013", title: "Sixty books", tag: "one year", bg: `linear-gradient(135deg, ${PAISA_FOREST}, ${PAISA_FOREST_DEEP})`, accent: PAISA_GOLD_LIGHT },
  { ep: "012", title: "Gulf NRI wins", tag: "Dubai", bg: `linear-gradient(135deg, ${PAISA_GLOW}, ${PAISA_FOREST_DEEP})`, accent: PAISA_GOLD },
  { ep: "011", title: "Coloring niche", tag: "Claude", bg: `linear-gradient(135deg, ${PAISA_FOREST_2}, ${PAISA_FOREST_DEEP})`, accent: PAISA_RED },
  { ep: "010", title: "First royalty", tag: "month one", bg: `linear-gradient(135deg, ${PAISA_FOREST}, ${PAISA_FOREST_DEEP})`, accent: PAISA_GOLD_LIGHT },
  { ep: "009", title: "Puzzle stacks", tag: "evergreen", bg: `linear-gradient(135deg, ${PAISA_GLOW}, ${PAISA_FOREST_DEEP})`, accent: PAISA_GOLD },
];

export function ThumbnailGrid() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 28,
        padding: 36,
        border: "1px solid #F0E8D8",
        boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.3em",
          color: PAISA_GOLD,
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
        }}
      >
        The grid
      </p>
      <h3
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          margin: "6px 0 24px",
          color: "#1A1A1A",
        }}
      >
        Six weeks, one <em style={{ fontStyle: "italic" }}>rhythm</em>.
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          width: 360,
        }}
      >
        {THUMB_ITEMS.map((x) => (
          <div
            key={x.ep}
            style={{
              aspectRatio: "9/16",
              background: x.bg,
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: PAISA_CREAM,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.08,
                pointerEvents: "none",
              }}
            >
              <filter id={`tg-${x.ep}`}>
                <feTurbulence baseFrequency="0.9" />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter={`url(#tg-${x.ep})`}
              />
            </svg>
            <div
              style={{
                position: "relative",
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 11,
                color: x.accent,
              }}
            >
              ep. {x.ep}
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: PAISA_CREAM,
                }}
              >
                {x.title}
              </div>
              <div
                style={{
                  fontSize: 7,
                  color: x.accent,
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  marginTop: 4,
                  textTransform: "uppercase",
                }}
              >
                {x.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "#6B7280",
          margin: "20px 0 0",
          lineHeight: 1.4,
        }}
      >
        Forest-on-forest with gold accents. Episode number lives in italic serif. Same rhythm every week.
      </p>
    </div>
  );
}
