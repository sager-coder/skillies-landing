"use client";

import React, { useState } from "react";
import { Kicker, Wordmark, Grain } from "../design/Primitives";

type NavItem = { k: string; label: string; icon: string };

const NAV: NavItem[] = [
  { k: "home", label: "Today", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { k: "curriculum", label: "50-Day Path", icon: "M4 6h16M4 12h16M4 18h10" },
  { k: "books", label: "My Books", icon: "M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z M8 4v12" },
  { k: "royalties", label: "Royalties", icon: "M3 17l6-6 4 4 8-8 M14 7h7v7" },
  { k: "cohort", label: "Cohort", icon: "M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2 M9 10a4 4 0 100-8 4 4 0 000 8z M21 20v-2a4 4 0 00-3-3.87 M17 6a4 4 0 010 6" },
  { k: "office", label: "Office Hours", icon: "M15 10l5-5-5-5 M20 5H9a6 6 0 00-6 6v9" },
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
        style={{
          marginTop: "auto",
          padding: 14,
          borderRadius: 16,
          background: "#FAF5EB",
          border: "1px solid #F0E8D8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "#C62828",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            AR
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Arjun R.
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
              Founding Batch
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function DayHeader({
  day = 23,
  total = 50,
}: {
  day?: number;
  total?: number;
}) {
  const pct = (day / total) * 100;
  return (
    <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid #F0E8D8" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <Kicker tone="red">
            Day {day} of {total}
          </Kicker>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
              margin: "10px 0 0",
            }}
          >
            Cover design · iterate your hook
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", margin: "6px 0 0" }}>
            Tuesday, April 28 · ~2h focused work
          </p>
        </div>
        <div style={{ textAlign: "right", minWidth: 180 }}>
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Cohort Progress
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.round(pct)}%
          </div>
        </div>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: "#F0E8D8",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: pct + "%",
            height: "100%",
            background: "linear-gradient(90deg, #C62828, #C9A24E)",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

type Task = { id: number; done: boolean; title: string; time: string };

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, done: true, title: "Watch: What makes a cover sell", time: "12 min video" },
    { id: 2, done: true, title: "Download 5 top-selling covers in your niche", time: "Research" },
    { id: 3, done: false, title: "Generate 8 cover options with Claude + Canva", time: "40 min · with prompts" },
    { id: 4, done: false, title: "Submit top 3 to #cohort-reviews for feedback", time: "10 min" },
    { id: 5, done: false, title: "Final cover uploaded to KDP", time: "Deliverable" },
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
        boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>
        Today&apos;s work
      </h3>
      <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>
        {tasks.filter((t) => t.done).length} of {tasks.length} complete
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
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>{t.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

type Stat = { label: string; val: string; sub: string; accent?: boolean };

const STATS: Stat[] = [
  { label: "Books Live", val: "3", sub: "on Amazon KDP" },
  { label: "This Month", val: "₹12,480", sub: "royalties", accent: true },
  { label: "Lifetime", val: "₹38,200", sub: "across 3 books" },
  { label: "Next Payout", val: "May 29", sub: "estimated" },
];

export function StatsRow() {
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
              ? "1px solid rgba(201,162,78,0.35)"
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
              fontSize: 28,
              fontWeight: 900,
              color: s.accent ? "#C9A24E" : "#1A1A1A",
              letterSpacing: "-0.02em",
              margin: "8px 0 2px",
              fontVariantNumeric: "tabular-nums",
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

export function MentorCard() {
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
        <Kicker tone="green-light">Office Hours</Kicker>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "12px 0 6px",
          }}
        >
          Ehsan — live Q&amp;A
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 18px",
            lineHeight: 1.55,
          }}
        >
          Every Thursday, 8 PM IST. Bring your covers, royalty questions, or stuck drafts.
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
              background: "#7A9A7A",
              boxShadow: "0 0 0 4px rgba(122,154,122,0.25)",
            }}
          />
          <span>
            Next: <strong>Thu, Apr 30 · 8:00 PM</strong>
          </span>
        </div>
        <button
          style={{
            width: "100%",
            marginTop: 14,
            padding: "12px",
            borderRadius: 999,
            border: "none",
            background: "#C62828",
            color: "white",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Add to Calendar →
        </button>
      </div>
    </div>
  );
}

type Post = {
  who: string;
  when: string;
  txt: string;
  badge: string;
  highlight?: boolean;
};

const POSTS: Post[] = [
  { who: "Nafeesa K.", when: "12 min ago", txt: "Submitted my cover v3 — thanks @Faisal for the typography note! Going live tomorrow.", badge: "Day 22" },
  { who: "Faisal M.", when: "1 hr ago", txt: "First book crossed ₹3,000 this month. Niche: Malayalam recipes for NRIs. Validated.", badge: "Day 41", highlight: true },
  { who: "Thahir A.", when: "3 hr ago", txt: "Anyone else stuck on Amazon's listing setup? DMing Ehsan but curious what worked for you.", badge: "Day 18" },
];

export function CohortFeed() {
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
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
          Cohort feed
        </h3>
        <span style={{ fontSize: 12, color: "#6B7280" }}>5 founding students</span>
      </div>
      {POSTS.map((p, i) => (
        <div
          key={i}
          style={{
            padding: "14px 0",
            borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: p.highlight ? "#C9A24E" : "#5B7B5B",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              {p.who.split(" ").map((w) => w[0]).join("")}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{p.who}</span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 999,
                background: "#FAF5EB",
                color: "#6B7280",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {p.badge}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#9CA3AF" }}>{p.when}</span>
          </div>
          <p
            style={{
              margin: "0 0 0 36px",
              fontSize: 13,
              color: p.highlight ? "#1A1A1A" : "#6B7280",
              lineHeight: 1.55,
              fontWeight: p.highlight ? 500 : 400,
            }}
          >
            {p.txt}
          </p>
        </div>
      ))}
    </div>
  );
}
