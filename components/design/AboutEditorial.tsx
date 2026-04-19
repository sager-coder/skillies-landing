"use client";

import React, { Fragment } from "react";
import { Kicker } from "./Primitives";

const STATS: Array<[string, string, string]> = [
  ["63", "Books", "#EF4444"],
  ["₹8L+", "Royalties", "#7A9A7A"],
  ["1", "Laptop · solo", "white"],
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
      {/* soft red glow at top */}
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
        {/* Red-on-red editorial portrait */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "3/4",
              borderRadius: 22,
              overflow: "hidden",
              background:
                "radial-gradient(ellipse at 50% 40%, #C62828 0%, #8B1A1A 55%, #2a0808 100%)",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.35), 0 2px 0 rgba(201,162,78,0.25) inset",
            }}
          >
            {/* subject silhouette */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "72%",
                height: "62%",
                background:
                  "radial-gradient(ellipse at 50% 15%, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.96) 60%, transparent 82%)",
                borderRadius: "50% 50% 0 0 / 42% 42% 0 0",
              }}
            />
            {/* top vignette */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4))",
              }}
            />
            {/* grain */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.15,
                mixBlendMode: "overlay",
                pointerEvents: "none",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
              }}
            />
            {/* caption */}
            <div
              style={{
                position: "absolute",
                bottom: 22,
                left: 22,
                right: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              <span>Fig. 02 · Malappuram rooftop · 2026</span>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>No. 037</span>
            </div>
          </div>
          {/* decorative outline */}
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
            Founder · Skillies.AI · Malappuram, Kerala
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              fontSize: 17,
              margin: "0 0 32px",
              maxWidth: 560,
            }}
          >
            <p style={{ margin: 0 }}>
              I published my first book on Amazon KDP using AI. Then another. 63 titles later, I had earned ₹8L+ in royalties — one laptop, one room, one cohort at a time.
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
              &ldquo;Ordinary people can use AI to build real income — not by becoming
              developers, but by learning skills the market will pay for.&rdquo;
            </p>
            <p style={{ margin: 0 }}>
              Skillies.AI is that proof turned into a platform — Malayalam-first, proof-backed, and closed to anyone who wants hype instead of income.
            </p>
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
