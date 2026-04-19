"use client";

import React from "react";

export default function Transformation() {
  const before = [
    "9-to-6 salary, stuck at a ceiling",
    "Watched 40 YouTube tutorials on AI",
    "Tried 3 side hustles — all abandoned",
    "Zero books published. Zero online income.",
    "Not sure if AI is even the right bet.",
  ];
  const after: Array<[string, string]> = [
    ["✓", "7+ books live on Amazon KDP"],
    ["✓", "AI workflow you can run in 2 hrs/day"],
    ["✓", "First royalty cheque in ~45 days"],
    ["✓", "Scales without hiring, inventory, or capital"],
    ["✓", "A skill you keep. A system that pays monthly."],
  ];
  return (
    <section
      style={{
        padding: "120px 0 0",
        background: "#FAF5EB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 48px" }}>
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
          § 03 · The Transformation
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Not theory — lived.</span>
        </div>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "clamp(44px, 6vw, 80px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            color: "#1A1A1A",
            margin: "0 0 24px",
            maxWidth: 900,
          }}
        >
          What{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              color: "#C62828",
              fontWeight: 400,
            }}
          >
            50 days
          </em>{" "}
          looks like.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "#6B7280",
            maxWidth: 620,
            margin: "0 0 56px",
            lineHeight: 1.6,
          }}
        >
          From zero technical skill to published author earning monthly royalties. Below, the actual arc — not a promise.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 540,
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#1A1A1A",
            color: "#FAF5EB",
            padding: "72px 56px",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.6,
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(198,40,40,0.08), transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 32,
              left: 56,
              right: 56,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "rgba(250,245,235,0.4)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span>Day 0</span>
            <span>— Before</span>
          </div>

          <div style={{ position: "relative", maxWidth: 420, marginTop: 60 }}>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 72,
                color: "#FAF5EB",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              You
            </div>
            <ul
              style={{
                margin: "32px 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {before.map((l, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    fontSize: 15,
                    color: "rgba(250,245,235,0.75)",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      marginTop: 9,
                      width: 10,
                      height: 1,
                      background: "rgba(250,245,235,0.4)",
                      flexShrink: 0,
                    }}
                  />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: 40,
                padding: 18,
                border: "1px solid rgba(250,245,235,0.15)",
                borderRadius: 12,
                background: "rgba(250,245,235,0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "rgba(239,68,68,0.9)",
                  marginBottom: 8,
                }}
              >
                Monthly income from AI
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 54,
                  letterSpacing: "-0.02em",
                  color: "#FAF5EB",
                }}
              >
                ₹0
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            background:
              "linear-gradient(160deg, #F0E8D8 0%, #FAF5EB 50%, #F7EED3 100%)",
            color: "#1A1A1A",
            padding: "72px 56px",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.9,
              backgroundImage:
                "radial-gradient(circle at 80% 30%, rgba(201,162,78,0.25), transparent 55%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 32,
              left: 56,
              right: 56,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#6B7280",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span>Day 50 →</span>
            <span>After — &amp; every month after</span>
          </div>

          <div style={{ position: "relative", maxWidth: 460, marginTop: 60 }}>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 72,
                color: "#1A1A1A",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              You.<span style={{ color: "#C62828" }}> Earning.</span>
            </div>
            <ul
              style={{
                margin: "32px 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {after.map(([i, l], k) => (
                <li
                  key={k}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    fontSize: 15,
                    color: "#1A1A1A",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#5B7B5B", fontWeight: 700 }}>{i}</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: 40,
                padding: 18,
                borderRadius: 12,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#5B7B5B",
                  marginBottom: 8,
                }}
              >
                Monthly royalties (avg, month 3+)
              </div>
              <div
                style={{ display: "flex", alignItems: "baseline", gap: 12 }}
              >
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 54,
                    letterSpacing: "-0.02em",
                    color: "#1A1A1A",
                  }}
                >
                  ₹18,000–42,000
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>/ mo</div>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Passive — while you sleep, books keep selling.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: "40px auto 0",
          padding: "0 48px",
          fontSize: 12,
          color: "#9CA3AF",
          letterSpacing: "0.02em",
        }}
      >
        <em
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
        >
          Based on a cohort of 24 students, Sep 2025 – Mar 2026. Individual results vary — we only share medians, not hype.
        </em>
      </div>
      <div style={{ height: 120 }} />
    </section>
  );
}
