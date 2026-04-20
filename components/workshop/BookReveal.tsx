"use client";

import React, { ReactNode } from "react";
import { Kicker, Grain } from "../design/Primitives";

/* =========================================================================
   Paperback mockups — three realistic Amazon-style book mocks.
   Shared <Paperback> renders a tilted 3D cover with proper typography.
   Each type supplies its own cover color + hero SVG art.
   ========================================================================= */

function Paperback({
  coverColor,
  textColor = "#FAF5EB",
  accentColor,
  category,
  title,
  subtitle,
  author,
  children,
  rotate = -6,
  bleed = false,
}: {
  coverColor: string;
  textColor?: string;
  accentColor: string;
  category: string;
  title: string;
  subtitle?: string;
  author: string;
  children: React.ReactNode;
  rotate?: number;
  bleed?: boolean;
}) {
  return (
    <div
      style={{
        width: 210,
        height: 290,
        position: "relative",
        transform: `rotate(${rotate}deg) perspective(1200px) rotateY(-10deg)`,
        transformStyle: "preserve-3d",
        flexShrink: 0,
      }}
    >
      {/* Shadow under the book */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -18,
          left: 8,
          right: 8,
          height: 24,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.28), transparent 65%)",
          filter: "blur(6px)",
        }}
      />

      {/* Book body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 3,
          overflow: "hidden",
          background: coverColor,
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.15) inset",
          color: textColor,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Paper-grain overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          }}
        />

        {/* Spine shadow (left edge) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 10,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.40), rgba(0,0,0,0.08) 45%, transparent 90%)",
            pointerEvents: "none",
          }}
        />

        {/* Gold hairline frame */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 10,
            border: `1px solid ${accentColor}60`,
            pointerEvents: "none",
          }}
        />

        {/* Top category band */}
        <div
          style={{
            padding: "18px 20px 0",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 8,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 800,
              color: accentColor,
              textAlign: "center",
            }}
          >
            {category}
          </div>
          <div
            aria-hidden
            style={{
              marginTop: 6,
              height: 1,
              width: 24,
              margin: "6px auto 0",
              background: accentColor,
              opacity: 0.6,
            }}
          />
        </div>

        {/* Title block */}
        <div
          style={{
            padding: "12px 16px 6px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: title.length > 20 ? 22 : 26,
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              color: textColor,
              fontStyle: "italic",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                marginTop: 4,
                fontSize: 8,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: textColor,
                opacity: 0.7,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Hero art area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            zIndex: 1,
            padding: bleed ? 0 : "4px 16px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {children}
        </div>

        {/* Author / imprint band */}
        <div
          style={{
            padding: "10px 20px 16px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <div
            aria-hidden
            style={{
              height: 1,
              width: 24,
              margin: "0 auto 8px",
              background: accentColor,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: textColor,
              opacity: 0.85,
            }}
          >
            {author}
          </div>
        </div>
      </div>

      {/* Page edge (right side) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          right: -3,
          width: 4,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.18), rgba(250,245,235,0.9))",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

function AmazonBadge({
  stars = "4.8",
  reviews,
}: {
  stars?: string;
  reviews: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "rgba(250,245,235,0.96)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(26,26,26,0.08)",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: "#1A1A1A",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="#C9A24E"
        stroke="#C9A24E"
        strokeWidth="1"
      >
        <polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.6" />
      </svg>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{stars}</span>
      <span style={{ color: "#9CA3AF", fontWeight: 400 }}>·</span>
      <span style={{ color: "#6B7280" }}>{reviews}</span>
    </div>
  );
}

function BestSellerRibbon() {
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        padding: "4px 10px",
        background: "#C9A24E",
        color: "#1A1A1A",
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 900,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(201,162,78,0.45)",
        transform: "rotate(4deg)",
        zIndex: 5,
      }}
    >
      #1 Best Seller
    </div>
  );
}

/* --- Hero art per genre --- */

function SpotDiffArt() {
  return (
    <svg
      viewBox="0 0 160 120"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      {/* sky */}
      <rect x="0" y="0" width="160" height="66" fill="#D9E8F2" />
      {/* sun */}
      <circle cx="28" cy="22" r="10" fill="#E6C178" />
      <g stroke="#E6C178" strokeWidth="1.3" strokeLinecap="round">
        <line x1="28" y1="6" x2="28" y2="2" />
        <line x1="16" y1="22" x2="11" y2="22" />
        <line x1="17" y1="10" x2="14" y2="7" />
        <line x1="39" y1="10" x2="42" y2="7" />
      </g>
      {/* clouds */}
      <ellipse cx="120" cy="20" rx="18" ry="7" fill="#FAF5EB" opacity="0.9" />
      <ellipse cx="132" cy="22" rx="10" ry="5" fill="#FAF5EB" opacity="0.9" />
      {/* ground */}
      <rect x="0" y="66" width="160" height="54" fill="#B8D689" />
      <path d="M0 66 Q40 72 80 66 T160 70 L160 80 L0 80 Z" fill="#9CC46E" />
      {/* barn */}
      <rect x="92" y="44" width="44" height="32" fill="#8B1A1A" />
      <path d="M88 44 L114 26 L140 44 Z" fill="#2D2D2D" />
      <rect x="106" y="56" width="12" height="20" fill="#3D5A3D" />
      <rect x="122" y="50" width="9" height="8" fill="#FAF5EB" stroke="#1A1A1A" strokeWidth="0.5" />
      {/* fence */}
      <g stroke="#8B5A2B" strokeWidth="1.5">
        <line x1="0" y1="80" x2="160" y2="80" />
        <line x1="0" y1="86" x2="160" y2="86" />
      </g>
      {[8, 24, 40, 56, 72].map((x) => (
        <line key={x} x1={x} y1="74" x2={x} y2="96" stroke="#8B5A2B" strokeWidth="1.5" />
      ))}
      {/* tree */}
      <rect x="54" y="56" width="3" height="14" fill="#5A3A1A" />
      <circle cx="55.5" cy="52" r="10" fill="#5B7B5B" />
      {/* cow */}
      <ellipse cx="30" cy="88" rx="14" ry="6" fill="#FAF5EB" />
      <circle cx="18" cy="86" r="5" fill="#FAF5EB" />
      <rect x="14" y="83" width="2" height="4" fill="#1A1A1A" />
      <rect x="18" y="83" width="2" height="4" fill="#1A1A1A" />
      <ellipse cx="35" cy="86" rx="4" ry="2" fill="#1A1A1A" />
      <ellipse cx="24" cy="88" rx="3" ry="1.5" fill="#1A1A1A" />
      <rect x="20" y="92" width="1.5" height="4" fill="#1A1A1A" />
      <rect x="38" y="92" width="1.5" height="4" fill="#1A1A1A" />
    </svg>
  );
}

function PuzzleArt() {
  return (
    <svg
      viewBox="0 0 160 120"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      {/* crossword grid background */}
      <g>
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => {
            const filled = [
              [0, 1],
              [0, 4],
              [0, 7],
              [1, 3],
              [2, 0],
              [2, 6],
              [3, 1],
              [3, 4],
              [3, 7],
              [4, 2],
              [4, 5],
              [5, 0],
              [5, 3],
              [5, 8],
              [6, 5],
            ].some(([r, c]) => r === row && c === col);
            return (
              <rect
                key={`${row}-${col}`}
                x={14 + col * 14.8}
                y={14 + row * 13}
                width={13}
                height={11}
                fill={filled ? "#1A1A1A" : "#FAF5EB"}
                stroke="rgba(26,26,26,0.45)"
                strokeWidth="0.3"
              />
            );
          }),
        )}
      </g>
      {/* a few letters filled in */}
      {[
        [1, 1, "P"],
        [1, 2, "U"],
        [2, 2, "Z"],
        [3, 2, "Z"],
        [4, 4, "L"],
        [4, 3, "E"],
        [2, 4, "S"],
      ].map(([r, c, l], i) => (
        <text
          key={i}
          x={14 + (c as number) * 14.8 + 6.5}
          y={14 + (r as number) * 13 + 9}
          fontFamily="Inter, sans-serif"
          fontWeight="800"
          fontSize="8"
          fill="#1A1A1A"
          textAnchor="middle"
        >
          {l}
        </text>
      ))}
      {/* clue numbers */}
      {[
        [0, 2, "1"],
        [0, 5, "2"],
        [2, 1, "3"],
      ].map(([r, c, n], i) => (
        <text
          key={i}
          x={14 + (c as number) * 14.8 + 1.2}
          y={14 + (r as number) * 13 + 4.5}
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize="3.5"
          fill="#6B7280"
        >
          {n}
        </text>
      ))}
      {/* pencil at corner */}
      <g transform="translate(128, 92) rotate(-22)">
        <rect x="0" y="0" width="22" height="3" fill="#C9A24E" />
        <rect x="22" y="0" width="5" height="3" fill="#E6C178" />
        <path d="M27 0 L31 1.5 L27 3 Z" fill="#1A1A1A" />
        <rect x="-4" y="0" width="4" height="3" fill="#F5E6E6" />
      </g>
    </svg>
  );
}

function ColoringArt() {
  return (
    <svg
      viewBox="0 0 160 120"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      fill="none"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* intricate mandala */}
      <circle cx="80" cy="60" r="42" />
      <circle cx="80" cy="60" r="32" />
      <circle cx="80" cy="60" r="22" />
      <circle cx="80" cy="60" r="10" fill="#C9A24E" stroke="#1A1A1A" strokeWidth="1.4" />
      {/* petals outer */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        return (
          <g key={`outer-${i}`} transform={`rotate(${angle} 80 60)`}>
            <path d="M80 18 Q72 30 80 42 Q88 30 80 18Z" />
          </g>
        );
      })}
      {/* petals inner */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45;
        const colored = i === 1 || i === 5;
        return (
          <g key={`inner-${i}`} transform={`rotate(${angle} 80 60)`}>
            <path
              d="M80 38 Q74 48 80 56 Q86 48 80 38Z"
              fill={colored ? "#C62828" : "none"}
              stroke="#1A1A1A"
            />
          </g>
        );
      })}
      {/* dots around edge */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x = 80 + Math.cos(angle) * 50;
        const y = 60 + Math.sin(angle) * 50;
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="#1A1A1A"
            stroke="none"
          />
        );
      })}
      {/* small crayon bottom right, colored red */}
      <g transform="translate(126, 94) rotate(30)">
        <rect x="0" y="0" width="14" height="4" fill="#C62828" stroke="#1A1A1A" strokeWidth="0.8" />
        <path d="M14 0 L18 2 L14 4 Z" fill="#1A1A1A" stroke="none" />
        <rect x="-4" y="0" width="4" height="4" fill="#F5E6E6" stroke="#1A1A1A" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/* --- The three composed mocks --- */

function SpotDiffMock() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 24 }}>
      {/* back book (sibling in series) */}
      <div
        style={{
          position: "absolute",
          left: "18%",
          top: "22%",
          opacity: 0.5,
          transform: "rotate(-16deg)",
          filter: "blur(0.5px)",
        }}
      >
        <Paperback
          coverColor="#3D5A3D"
          accentColor="#E6C178"
          category="Ocean · Book 2"
          title="Fishy Friends"
          author="Skillies Kids"
          rotate={0}
        >
          <div style={{ width: "100%", height: "100%" }} />
        </Paperback>
      </div>
      {/* front book */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <BestSellerRibbon />
        <Paperback
          coverColor="#A12020"
          accentColor="#E6C178"
          category="Farm Adventures · Book 1"
          title="Spot the Difference"
          subtitle="40 puzzles for ages 5-9"
          author="Skillies Kids Press"
        >
          <SpotDiffArt />
        </Paperback>
      </div>
      {/* Amazon rating overlay */}
      <div style={{ position: "absolute", bottom: 10, left: 14, zIndex: 3 }}>
        <AmazonBadge stars="4.8" reviews="1,203 ratings" />
      </div>
    </div>
  );
}

function PuzzleMock() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 24 }}>
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "18%",
          opacity: 0.5,
          transform: "rotate(12deg)",
          filter: "blur(0.5px)",
        }}
      >
        <Paperback
          coverColor="#142821"
          accentColor="#C9A24E"
          category="Word Search · Vol 3"
          title="Sunday Classics"
          author="Skillies Press"
          rotate={0}
        >
          <div style={{ width: "100%", height: "100%" }} />
        </Paperback>
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <BestSellerRibbon />
        <Paperback
          coverColor="#1F3A2E"
          accentColor="#E6C178"
          category="Crossword Classics"
          title="100 Puzzles"
          subtitle="From easy to evil"
          author="Skillies Press"
        >
          <PuzzleArt />
        </Paperback>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 14, zIndex: 3 }}>
        <AmazonBadge stars="4.7" reviews="2,418 ratings" />
      </div>
    </div>
  );
}

function ColoringMock() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 24 }}>
      <div
        style={{
          position: "absolute",
          left: "14%",
          top: "20%",
          opacity: 0.5,
          transform: "rotate(-14deg)",
          filter: "blur(0.5px)",
        }}
      >
        <Paperback
          coverColor="#F0E8D8"
          textColor="#1A1A1A"
          accentColor="#C62828"
          category="Animals · Vol 2"
          title="Kids Coloring"
          author="Skillies Studio"
          rotate={0}
        >
          <div style={{ width: "100%", height: "100%" }} />
        </Paperback>
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <BestSellerRibbon />
        <Paperback
          coverColor="#FAF5EB"
          textColor="#1A1A1A"
          accentColor="#C62828"
          category="Mandalas · Vol 1"
          title="50 Designs"
          subtitle="Intricate · Adult coloring"
          author="Skillies Studio"
        >
          <ColoringArt />
        </Paperback>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 14, zIndex: 3 }}>
        <AmazonBadge stars="4.9" reviews="3,841 ratings" />
      </div>
    </div>
  );
}

type Accent = "red" | "gold" | "green";

function BookTypeCard({
  kicker,
  title,
  hookLine,
  desc,
  bullets,
  mockup,
  accent,
  proof,
}: {
  kicker: string;
  title: string;
  hookLine: string;
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
          aspectRatio: "5/6",
          borderRadius: 18,
          background: t.bg,
          position: "relative",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          minHeight: 340,
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
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: t.solid,
            fontWeight: 400,
            margin: "0 0 14px",
            letterSpacing: "-0.01em",
          }}
        >
          {hookLine}
        </p>
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
          A single puzzle or coloring book earns ₹500–2,000/month. Ten of them earn ₹15,000+. Sixty earns ₹60,000+ passive — that’s the goal of the 50-day program.
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
          <Kicker tone="red">What You’ll Actually Publish</Kicker>
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
            The three book types Amazon sells the most of — and the easiest to start with. No writing experience. No credentials. Global audience, ready to buy.
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
            hookLine="Two scenes. Five hidden differences. Global buyers."
            desc="Two near-identical scenes side-by-side. 5–10 differences to find per page. Kids love them. Parents buy them. Schools and libraries stock them by the dozen."
            bullets={[
              "Claude writes prompts, you build scenes in Canva",
              "Canva does the layout in one template",
              "No text, no translation — sell globally",
            ]}
            mockup={<SpotDiffMock />}
            accent="red"
            proof="Ehsan's best month for this format: ₹18,400"
          />
          <BookTypeCard
            kicker="TYPE 02"
            title="Puzzle Books"
            hookLine="Crosswords, word searches, sudoku. Made in bulk."
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
            hookLine="Line-art pages. Curated, not drawn."
            desc="Line-art illustrations on blank pages. Kids' animals, adult mandalas, seasonal themes. Claude + Canva do 80% of the work — you curate."
            bullets={[
              "Claude prompts + Canva templates = 30 pages in a day",
              "Themed niches (holiday, seasonal, gift) rank fast",
              "Q4 gifting demand spikes royalties",
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
