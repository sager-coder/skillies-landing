"use client";

import React from "react";

type Receipt = { n: string; l: string; s: string; c: string };

const RECEIPTS: Receipt[] = [
  { n: "₹8,71,982", l: "earned from KDP", s: "Across 63 titles, Mar 2024 – Apr 2026.", c: "#EF4444" },
  { n: "63", l: "books published", s: "AI-assisted, solo operator.", c: "#7A9A7A" },
  { n: "1", l: "laptop, one person", s: "No team, no inventory, no capital.", c: "#E6C178" },
];

export default function PromiseEditorial() {
  return (
    <section
      style={{
        padding: "128px 48px",
        background: "#1A1A1A",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='7'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10%",
          top: "-10%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(198,40,40,0.22), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 60,
          left: 40,
          fontFamily: "'Instrument Serif', serif",
          fontSize: 320,
          lineHeight: 0.8,
          color: "rgba(239,68,68,0.15)",
          fontStyle: "italic",
          pointerEvents: "none",
        }}
      >
        &ldquo;
      </div>

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 40, height: 1, background: "#EF4444" }} />
          § 02 · The Manifesto
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            To be read once, believed forever.
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#7A9A7A",
                fontWeight: 700,
                margin: "0 0 28px",
              }}
            >
              The Skillies.AI Promise
            </p>

            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(56px, 7vw, 96px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                margin: "0 0 32px",
              }}
            >
              <span>We don&apos;t teach AI for</span>{" "}
              <em style={{ color: "#EF4444", fontStyle: "italic" }}>hype.</em>
              <br />
              <span>We teach it for </span>
              <em style={{ color: "#EF4444", fontStyle: "italic" }}>income.</em>
            </h2>

            <p
              style={{
                fontSize: 19,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
                margin: "0 0 36px",
                maxWidth: 560,
              }}
            >
              Every program is built around one question —{" "}
              <em
                className="t-serif-italic"
                style={{ color: "#E6C178" }}
              >
                can you make real money with this skill?
              </em>{" "}
              If the answer is no, we don&apos;t teach it. If the answer is yes, we teach it until you have.
            </p>

            <div
              style={{ display: "flex", alignItems: "center", gap: 18 }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 34,
                    color: "#FAF5EB",
                    lineHeight: 1,
                  }}
                >
                  — Ehsan Asgar P
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginTop: 6,
                  }}
                >
                  Founder · Skillies.AI
                </div>
              </div>
              <div
                aria-hidden
                style={{
                  width: 1,
                  height: 50,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                Signed at Calicut,
                <br />
                April 2026.
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {RECEIPTS.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "22px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.25em",
                    fontWeight: 700,
                    minWidth: 18,
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 44,
                      lineHeight: 1,
                      color: r.c,
                      letterSpacing: "-0.02em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {r.n}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "white",
                      fontWeight: 600,
                      marginTop: 6,
                    }}
                  >
                    {r.l}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      marginTop: 2,
                    }}
                  >
                    {r.s}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                textAlign: "right",
                marginTop: 4,
              }}
            >
              Receipts · not promises.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
