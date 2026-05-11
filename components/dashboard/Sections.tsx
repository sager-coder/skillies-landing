"use client";

import React, { useState } from "react";
import { Kicker, Wordmark, Grain } from "../design/Primitives";

/**
 * Dashboard — reframed as Ehsan's live income & ops view.
 * Not a "student dashboard prototype" anymore — this is the founder's
 * actual command center: KDP royalties, Etsy, teaching, workshop prep.
 */

type NavItem = { k: string; label: string; icon: string };

const NAV: NavItem[] = [
  { k: "home", label: "Overview", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { k: "royalties", label: "KDP Royalties", icon: "M3 17l6-6 4 4 8-8 M14 7h7v7" },
  { k: "etsy", label: "Etsy · PageBoo", icon: "M4 6h16M4 12h16M4 18h10" },
  { k: "cohort", label: "Founding batch", icon: "M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2 M9 10a4 4 0 100-8 4 4 0 000 8z M21 20v-2a4 4 0 00-3-3.87 M17 6a4 4 0 010 6" },
  { k: "calendar", label: "Teaching calendar", icon: "M8 7V3M16 7V3M3 11h18 M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
];

export function DashSidebar({
  active,
  onNav,
}: {
  active: string;
  onNav: (k: string) => void;
}) {
  return (
    <aside
      className="dash-sidebar"
      style={{
        width: 240,
        background: "white",
        borderRight: "1px solid #F0E8D8",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "4px 12px 20px" }}>
        <a href="/" aria-label="Skillies.AI — marketing site" style={{ textDecoration: "none" }}>
          <Wordmark size={20} />
        </a>
      </div>
      {NAV.map((it) => (
        <button
          key={it.k}
          onClick={() => onNav(it.k)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: active === it.k ? "rgba(198,40,40,0.08)" : "transparent",
            color: active === it.k ? "#C62828" : "#1A1A1A",
            fontWeight: active === it.k ? 600 : 500,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.icon} />
          </svg>
          {it.label}
        </button>
      ))}
      <div
        className="dash-profile-card"
        style={{
          marginTop: "auto",
          padding: 14,
          borderRadius: 16,
          background: "#FAF5EB",
          border: "1px solid #F0E8D8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              overflow: "hidden",
              backgroundImage: "url('/ehsan-founder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 28%",
              background: "linear-gradient(135deg, #C62828, #8B1A1A)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 0 }}>E</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Ehsan A.
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
              Founder
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function DashHeader() {
  return (
    <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid #F0E8D8" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 4,
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Kicker tone="red">Live · updated 4 hours ago</Kicker>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
              margin: "10px 0 0",
            }}
          >
            Overview · March 2026
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", margin: "6px 0 0" }}>
            No new books published in 6 months. Everything below is passive.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "#FAF5EB",
            borderRadius: 999,
            border: "1px solid #F0E8D8",
            fontSize: 12,
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#5B7B5B",
              boxShadow: "0 0 0 3px rgba(91,123,91,0.25)",
            }}
          />
          Also teaching Mon–Fri, 8 AM – 3 PM
        </div>
      </div>
    </div>
  );
}

type Stat = { label: string; val: string; sub: string; accent?: "red" | "gold" | "green" };

const STATS: Stat[] = [
  { label: "Last month", val: "₹1,16,020", sub: "KDP + Etsy", accent: "gold" },
  { label: "Books live", val: "63", sub: "all published in 2025" },
  { label: "KDP lifetime", val: "₹8,71,982", sub: "all 63 books · 2024–26" },
  { label: "Months passive", val: "6", sub: "zero new publishes", accent: "green" },
];

export function StatsRow() {
  const accentColors = { red: "#C62828", gold: "#C9A24E", green: "#5B7B5B" };
  const borderColors = {
    red: "rgba(198,40,40,0.35)",
    gold: "rgba(201,162,78,0.35)",
    green: "rgba(91,123,91,0.35)",
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 20,
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={i}
          style={{
            padding: 20,
            background: "white",
            borderRadius: 20,
            border: s.accent
              ? `1px solid ${borderColors[s.accent]}`
              : "1px solid #F0E8D8",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 400,
              color: s.accent ? accentColors[s.accent] : "#1A1A1A",
              letterSpacing: "-0.02em",
              margin: "10px 0 2px",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {s.val}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * RoyaltiesChart — simple monthly bars with sept→mar, showing
 * how income stayed steady / grew even without new publishes.
 */
const MONTHLY: Array<[string, number, boolean]> = [
  ["Sep", 0.62, false],
  ["Oct", 0.71, true],   // last publish
  ["Nov", 0.64, true],
  ["Dec", 0.84, true],
  ["Jan", 0.69, true],
  ["Feb", 0.78, true],
  ["Mar", 0.96, true],
];

export function RoyaltiesChart() {
  return (
    <div
      style={{
        padding: 28,
        background: "white",
        borderRadius: 24,
        border: "1px solid #F0E8D8",
        boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 28,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: "0 0 4px",
            }}
          >
            KDP royalties · last 7 months
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            The red line marks the last time I published a book.
          </p>
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",fontSize: 16,
            color: "#C62828",
          }}
        >
          ↗ +54% vs Sep
        </div>
      </div>
      <div
        className="dash-royalties-bars"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 14,
          alignItems: "flex-end",
          height: 220,
          position: "relative",
        }}
      >
        {/* "last publish" marker */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 36,
            left: "14.28%",
            width: 2,
            borderLeft: "2px dashed rgba(198,40,40,0.35)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "16%",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          ← last publish
        </div>
        {MONTHLY.map(([month, height, passive], i) => (
          <div
            key={month}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1A1A1A",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(height * 120)}k
            </div>
            <div
              style={{
                width: "100%",
                maxWidth: 46,
                height: `${height * 70}%`,
                borderRadius: "6px 6px 0 0",
                background: passive
                  ? "linear-gradient(180deg, #C9A24E, #8a6a1f)"
                  : "linear-gradient(180deg, #C62828, #8B1A1A)",
                boxShadow: passive
                  ? "0 -8px 20px rgba(201,162,78,0.25)"
                  : "0 -8px 20px rgba(198,40,40,0.25)",
              }}
            />
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#9CA3AF",
              }}
            >
              {month}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 18,
          fontSize: 11,
          color: "#6B7280",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{ width: 10, height: 10, borderRadius: 2, background: "#C62828" }}
          />
          With new publishes
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{ width: 10, height: 10, borderRadius: 2, background: "#C9A24E" }}
          />
          Fully passive
        </span>
      </div>
    </div>
  );
}

/**
 * FocusList — what I'm actually working on this week (instead of teaching)
 */
type Focus = { id: number; done: boolean; title: string; when: string };

export function FocusList() {
  const [tasks, setTasks] = useState<Focus[]>([
    { id: 1, done: true, title: "Ship Calicut workshop landing page", when: "Last week" },
    { id: 2, done: true, title: "Confirm Hyatt Regency booking (150 seats)", when: "Last week" },
    { id: 3, done: false, title: "Onboard founding batch — weekly Zoom calls", when: "In progress" },
    { id: 4, done: false, title: "Draft online course outline (4 askers)", when: "This week" },
    { id: 5, done: false, title: "Etsy printables — 10 new listings", when: "Weekends" },
  ]);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  return (
    <div
      style={{
        padding: 32,
        background: "white",
        borderRadius: 24,
        border: "1px solid #F0E8D8",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>
        This week · around teaching
      </h3>
      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>
        School 8–3, everything else fits around it.
      </p>
      {tasks.map((t, i) => (
        <div
          key={t.id}
          onClick={() => toggle(t.id)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "14px 0",
            borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              marginTop: 2,
              width: 22,
              height: 22,
              borderRadius: 999,
              flexShrink: 0,
              border: t.done ? "none" : "1.5px solid #D4C9B1",
              background: t.done ? "#C62828" : "transparent",
              display: "grid",
              placeItems: "center",
            }}
          >
            {t.done && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 500,
                color: t.done ? "#9CA3AF" : "#1A1A1A",
                textDecoration: t.done ? "line-through" : "none",
              }}
            >
              {t.title}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>
              {t.when}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * NextPayout — Amazon's next royalty payment date, timer-style
 */
export function NextPayoutCard() {
  return (
    <div
      style={{
        padding: 24,
        background: "#1A1A1A",
        color: "white",
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grain opacity={0.07} />
      <div style={{ position: "relative" }}>
        <Kicker tone="green-light">Amazon payout</Kicker>
        <h3
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 44,fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: "12px 0 6px",
            lineHeight: 0.95,
          }}
        >
          May 29
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 18px",
            lineHeight: 1.55,
          }}
        >
          Estimated INR deposit from Amazon KDP. Every month, like clockwork, from books I finished writing months ago.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 13,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#E6C178",
              boxShadow: "0 0 0 4px rgba(230,193,120,0.25)",
            }}
          />
          <span>
            Expected: <strong>~₹1,08,000</strong> (KDP only)
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Founding batch snapshot — 6 students, honest numbers
 */
export function FoundingBatch() {
  const members = [
    { initials: "SM", color: "#C62828" },
    { initials: "AR", color: "#5B7B5B" },
    { initials: "NK", color: "#C9A24E" },
    { initials: "FH", color: "#8B1A1A" },
    { initials: "TA", color: "#3D5A3D" },
    { initials: "RP", color: "#E6C178" },
  ];
  return (
    <div
      style={{
        padding: 24,
        background: "white",
        borderRadius: 20,
        border: "1px solid #F0E8D8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
          Founding batch
        </h3>
        <span
          style={{
            fontSize: 10,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(198,40,40,0.08)",
            color: "#C62828",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Batch · 001
        </span>
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.55 }}>
        Six students from the first Calicut workshop. Everyone in week three now. Four are asking for an online version — that’s what we’re building next.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
        {members.map((m, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${m.color}, ${m.color}dd)`,
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.05em",
              border: "2px solid white",
              marginLeft: i === 0 ? 0 : -10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {m.initials}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          paddingTop: 14,
          borderTop: "1px solid #F0E8D8",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Enrolled
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>6 / 6</div>
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Week
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#C62828" }}>3 of 7</div>
        </div>
      </div>
    </div>
  );
}
