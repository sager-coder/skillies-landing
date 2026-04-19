"use client";

import React, { Fragment } from "react";
import { Kicker } from "./Primitives";

/**
 * About — editorial portrait + founder narrative.
 * Uses real photo at /ehsan-founder.jpg (drop into public/).
 * Narrative: teacher by day, AI publisher by night, multiple income streams.
 */

const STATS: Array<[string, string, string]> = [
  ["63", "Books", "#EF4444"],
  ["₹1.16L", "Last month", "#7A9A7A"],
  ["1", "Laptop · solo", "white"],
];

const HUSTLES: Array<[string, string, string]> = [
  ["Day job", "Malayalam teacher, Malappuram", "The steady one."],
  ["KDP stacks", "63 books on Amazon — all published 2025", "Passive since Oct."],
  ["Etsy printables", "PageBoo shop · small but growing", "Built on weekends."],
  ["Skillies.AI", "First cohort: 6 students from the workshop", "Now live."],
];

export default function AboutEditorial() {
  return (
    <section
      id="about"
      style={{
        padding: "128px 24px",
        background: "#1A1A1A",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-10%",
          top: "-10%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(198,40,40,0.20), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="skillies-about-grid"
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
          gap: 72,
          alignItems: "center",
        }}
      >
        {/* Editorial portrait — real photo */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "3/4",
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.35), 0 2px 0 rgba(201,162,78,0.25) inset",
              background: "#1A1A1A",
              backgroundImage: "url('/ehsan-founder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 28%",
            }}
          >
            {/* warm red-lift over the photo (editorial feel) */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(198,40,40,0.14) 0%, transparent 35%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.55) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            {/* grain */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.12,
                mixBlendMode: "overlay",
                pointerEvents: "none",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
              }}
            />
            {/* caption plate */}
            <div
              style={{
                position: "absolute",
                bottom: 22,
                left: 22,
                right: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "rgba(255,255,255,0.75)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              <span>Fig. 02 · Between classes · Apr 2026</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>No. 037</span>
            </div>
          </div>
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -18,
              right: -18,
              width: 108,
              height: 108,
              border: "2px solid rgba(198,40,40,0.35)",
              borderRadius: 22,
              zIndex: -1,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -18,
              left: -18,
              width: 72,
              height: 72,
              background: "rgba(91,123,91,0.12)",
              borderRadius: 22,
              zIndex: -1,
            }}
          />
        </div>

        {/* Bio */}
        <div>
          <Kicker tone="green-light">Your Mentor</Kicker>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(44px, 5.5vw, 72px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              margin: "18px 0 10px",
            }}
          >
            Ehsan <em style={{ fontStyle: "italic", color: "#EF4444" }}>Asgar P.</em>
          </h2>
          <p
            className="font-ml"
            style={{
              fontSize: 20,
              color: "#7A9A7A",
              margin: "0 0 28px",
              letterSpacing: "-0.01em",
              fontWeight: 600,
            }}
          >
            Teacher · Publisher · Founder, Skillies.AI · Malappuram
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              fontSize: 17,
              margin: "0 0 28px",
              maxWidth: 560,
            }}
          >
            <p style={{ margin: 0 }}>
              I teach Malayalam at a school in Malappuram. In the gaps between classes — lunch breaks, after-school hours, Sunday mornings — I learned to use AI tools to publish books on Amazon.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: 1.4,
                color: "#E6C178",
                borderLeft: "2px solid rgba(201,162,78,0.5)",
                paddingLeft: 18,
              }}
            >
              &ldquo;I haven&apos;t published a book in six months. Last month, they paid
              me ₹1,16,000. These aren&apos;t lottery tickets — they&apos;re assets.&rdquo;
            </p>
            <p style={{ margin: 0 }}>
              Skillies.AI is the playbook. I ran the first Calicut workshop, enrolled six founding students, and a few more asked for an online version. So we&apos;re building that next.
            </p>
          </div>

          {/* Hustle stack — multiple income streams, all side-door */}
          <div
            style={{
              marginBottom: 32,
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px dashed rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "rgba(122,154,122,0.9)",
                marginBottom: 14,
              }}
            >
              What I do · in parallel
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {HUSTLES.map(([title, sub, note]) => (
                <div
                  key={title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr auto",
                    gap: 14,
                    alignItems: "baseline",
                    fontSize: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "white",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.55)" }}>{sub}</div>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      color: "rgba(230,193,120,0.85)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* stat strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              padding: "18px 0",
              gap: 0,
            }}
          >
            {STATS.map(([n, l, c], i, arr) => (
              <Fragment key={l}>
                <div style={{ flex: 1, paddingRight: 16 }}>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 36,
                      lineHeight: 1,
                      color: c,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 700,
                      marginTop: 6,
                    }}
                  >
                    {l}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{ width: 1, height: 44, background: "rgba(255,255,255,0.12)" }}
                  />
                )}
              </Fragment>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Signed at Calicut · April 2026
          </div>
        </div>
      </div>
    </section>
  );
}
