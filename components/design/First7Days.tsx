"use client";

import React from "react";

type Day = {
  day: number;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  highlight?: boolean;
};

const DAYS: Day[] = [
  { day: 1, title: "Your welcome call", body: "30-min onboarding with your mentor. Map your niche.", tag: "Live", tagColor: "#C62828" },
  { day: 2, title: "AI research toolkit", body: "Install 4 tools. Run your first niche search.", tag: "Setup", tagColor: "#5B7B5B" },
  { day: 3, title: "Find 3 gold niches", body: "Spot the gaps on Amazon nobody's filled yet.", tag: "Research", tagColor: "#5B7B5B" },
  { day: 4, title: "Draft book #1 outline", body: "AI-assisted structure. Title, chapters, hook.", tag: "Build", tagColor: "#C9A24E" },
  { day: 5, title: "Generate manuscript", body: "Turn the outline into a full first draft.", tag: "Build", tagColor: "#C9A24E" },
  { day: 6, title: "Cover design workshop", body: "Design a cover that sells. Live review.", tag: "Live", tagColor: "#C62828" },
  { day: 7, title: "Publish on KDP", body: "Upload, price, list. Your first title goes live.", tag: "Ship", tagColor: "#C9A24E", highlight: true },
];

function DayCard({ day, title, body, tag, tagColor, highlight }: Day) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: 22,
        borderRadius: 16,
        background: highlight
          ? "linear-gradient(180deg, #FFF9E9, #F7EED3)"
          : "white",
        border: highlight ? "2px solid #C9A24E" : "1px solid rgba(26,26,26,0.08)",
        position: "relative",
        boxShadow: highlight
          ? "0 20px 50px rgba(201,162,78,0.25)"
          : "0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 16,
            background: "#C9A24E",
            color: "#1A1A1A",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.2em",
            padding: "4px 12px",
            borderRadius: 999,
          }}
        >
          FIRST WIN
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 800,
            color: highlight ? "#8a6a1f" : "#9CA3AF",
          }}
        >
          Day {day}
        </div>
        {tag && (
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: tagColor,
              border: `1px solid ${tagColor}40`,
              padding: "2px 6px",
              borderRadius: 4,
              textTransform: "uppercase",
            }}
          >
            {tag}
          </div>
        )}
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 22,
          color: "#1A1A1A",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

export default function First7Days() {
  return (
    <section style={{ padding: "120px 48px", background: "#FAF5EB" }}>
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
          § 05 · Your first 7 days
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>So you know before you enroll.</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "end",
            marginBottom: 44,
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(40px, 5vw, 68px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            By day 7,{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                color: "#C62828",
                fontWeight: 400,
              }}
            >
              your first book ships.
            </em>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            Most courses sell you theory for 6 weeks. We ship your first title in week one — so you feel the dopamine of a real outcome before you doubt yourself.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 12,
            position: "relative",
          }}
        >
          {DAYS.map((d) => (
            <DayCard key={d.day} {...d} />
          ))}

          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "14.28%",
              right: "14.28%",
              bottom: -32,
              height: 2,
              background:
                "linear-gradient(90deg, #C62828 0%, #5B7B5B 50%, #C9A24E 100%)",
              opacity: 0.3,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "20px 24px",
            borderRadius: 14,
            background: "white",
            border: "1px solid rgba(26,26,26,0.08)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#1A1A1A",
              color: "#FAF5EB",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Days 8 – 50: scale, refine, and build your catalog.
            </div>
            <div
              style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}
            >
              Weekly mentor reviews. New niche every week. By Day 50 you&apos;ll have 4–7 titles live.
            </div>
          </div>
          <a
            href="#program"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#C62828",
              textDecoration: "none",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            See full syllabus →
          </a>
        </div>
      </div>
    </section>
  );
}
