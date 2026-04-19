"use client";

import React from "react";
import {
  Kicker,
  KickerPill,
  PrimaryButton,
  SecondaryButton,
  Wordmark,
  Grain,
} from "../design/Primitives";

export function CoursePortalNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "16px 32px",
        background: "rgba(250,245,235,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(26,26,26,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/" aria-label="Skillies.AI — home" style={{ textDecoration: "none" }}>
          <Wordmark size={20} />
        </a>
        <div style={{ width: 1, height: 20, background: "#D4C9B1" }} />
        <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Courses</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 28,
          fontSize: 13,
          fontWeight: 500,
          color: "#6B7280",
        }}
      >
        <a href="#" style={{ color: "#1A1A1A", textDecoration: "none" }}>Browse</a>
        <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>My Learning</a>
        <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Community</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            padding: "8px 14px",
            background: "white",
            border: "1px solid #F0E8D8",
            borderRadius: 999,
            fontSize: 13,
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 220,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search courses…
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: "#5B7B5B",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          AR
        </div>
      </div>
    </nav>
  );
}

export function CoursePortalHero() {
  const upNext: Array<{ n: string; t: string }> = [
    { n: "24", t: "Pricing your book psychologically" },
    { n: "25", t: "Amazon listings that convert" },
    { n: "26", t: "Your first 10 reviews, ethically" },
  ];
  return (
    <section style={{ padding: "56px 32px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <Kicker tone="red">Picked up where you left off</Kicker>
      <h1
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: "#1A1A1A",
          letterSpacing: "-0.03em",
          margin: "14px 0 28px",
        }}
      >
        Keep publishing, Arjun.
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
        <div
          style={{
            padding: 32,
            borderRadius: 24,
            background: "#1A1A1A",
            color: "white",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: 280,
          }}
        >
          <Grain opacity={0.06} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 30%, rgba(198,40,40,0.35), transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 32,
              right: 32,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            FLAGSHIP · 50 DAYS
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#EF4444",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Next Lesson · Day 23
            </div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 8px",
              }}
            >
              Cover design that sells on KDP
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                margin: "0 0 18px",
              }}
            >
              12 min · Module 3 of 7 · 46% complete
            </p>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: "46%",
                  height: "100%",
                  background: "linear-gradient(90deg, #C62828, #C9A24E)",
                  borderRadius: 999,
                }}
              />
            </div>
            <PrimaryButton>Resume Lesson</PrimaryButton>
          </div>
        </div>
        <div
          style={{
            padding: 28,
            borderRadius: 24,
            background: "white",
            border: "1px solid #F0E8D8",
          }}
        >
          <Kicker tone="gold">Up Next</Kicker>
          <div style={{ marginTop: 18 }}>
            {upNext.map((x, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#C62828",
                    letterSpacing: "0.05em",
                    minWidth: 28,
                  }}
                >
                  D{x.n}
                </div>
                <div style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 500 }}>
                  {x.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  title: string;
  kicker: string;
  tone?: "red" | "green" | "gold";
  stats: string;
  progress?: number;
  locked?: boolean;
};

export function CourseCard({
  title,
  kicker,
  tone = "red",
  stats,
  progress,
  locked,
}: CardProps) {
  const toneColors = { red: "#C62828", green: "#5B7B5B", gold: "#C9A24E" };
  const bgs = {
    red: "radial-gradient(ellipse at 70% 20%, rgba(198,40,40,0.20), transparent 60%), #1A1A1A",
    green:
      "radial-gradient(ellipse at 70% 20%, rgba(91,123,91,0.25), transparent 60%), #1A1A1A",
    gold:
      "radial-gradient(ellipse at 70% 20%, rgba(201,162,78,0.25), transparent 60%), #1A1A1A",
  };
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "white",
        border: "1px solid #F0E8D8",
        transition: "transform .3s, box-shadow .3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div
        style={{
          height: 140,
          background: bgs[tone],
          position: "relative",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            color: toneColors[tone],
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {kicker}
        </div>
        {locked && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "-0.02em",
            margin: "0 0 6px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 14px" }}>{stats}</p>
        {progress != null ? (
          <>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: "#F0E8D8",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: progress + "%",
                  height: "100%",
                  background: toneColors[tone],
                  borderRadius: 999,
                }}
              />
            </div>
            <p
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                margin: 0,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {progress}% complete
            </p>
          </>
        ) : locked ? (
          <p
            style={{
              fontSize: 12,
              color: "#C9A24E",
              margin: 0,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            ★ Unlock with KDP Mastery
          </p>
        ) : (
          <p
            style={{
              fontSize: 12,
              color: "#5B7B5B",
              margin: 0,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            ● Free preview available
          </p>
        )}
      </div>
    </div>
  );
}

export function CourseCatalog() {
  return (
    <section style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Kicker tone="green">Catalog</Kicker>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              margin: "10px 0 0",
            }}
          >
            Every skill we teach
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: 4,
            background: "white",
            borderRadius: 999,
            border: "1px solid #F0E8D8",
          }}
        >
          {["All", "KDP", "AI Tools", "Paisa"].map((f, i) => (
            <button
              key={f}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background: i === 0 ? "#1A1A1A" : "transparent",
                color: i === 0 ? "white" : "#6B7280",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <CourseCard
          title="KDP Mastery · 50-Day Program"
          kicker="Flagship · 50 days"
          tone="red"
          stats="50 lessons · 7 modules · mentor access"
          progress={46}
        />
        <CourseCard
          title="Cover Design with Claude + Canva"
          kicker="Module · 6 lessons"
          tone="gold"
          stats="6 lessons · 1h 40m total"
          progress={100}
        />
        <CourseCard
          title="Amazon Listings that Convert"
          kicker="Module · 4 lessons"
          tone="green"
          stats="4 lessons · 58m · templates included"
          progress={25}
        />
        <CourseCard
          title="Claude for Book Outlines"
          kicker="Free · 3 lessons"
          tone="red"
          stats="3 lessons · 42m · open preview"
        />
        <CourseCard
          title="Royalty Analytics & Scaling"
          kicker="Advanced · Locked"
          tone="gold"
          stats="8 lessons · requires KDP Mastery"
          locked
        />
        <CourseCard
          title="Paisa AI Show — Behind the scenes"
          kicker="Coming soon"
          tone="green"
          stats="How we produce the weekly Malayalam series"
        />
      </div>
    </section>
  );
}

export function CourseInstructors() {
  return (
    <section style={{ padding: "56px 32px 96px", maxWidth: 1200, margin: "0 auto" }}>
      <Kicker tone="red">Taught by</Kicker>
      <div
        style={{
          marginTop: 16,
          padding: 32,
          borderRadius: 24,
          background: "white",
          border: "1px solid #F0E8D8",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 28,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            background: "linear-gradient(135deg, #8B1A1A, #C62828)",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          E
        </div>
        <div>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Ehsan Asgar P
          </h3>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 10px" }}>
            Founder, Skillies.AI · Malappuram, Kerala
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <KickerPill tone="red">₹15,50,000+ earned, solo</KickerPill>
            <KickerPill tone="green">63 books published</KickerPill>
            <KickerPill tone="gold">5 founding students mentored</KickerPill>
          </div>
        </div>
        <SecondaryButton>Read bio</SecondaryButton>
      </div>
    </section>
  );
}
