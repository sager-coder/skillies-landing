"use client";

import React from "react";
import { PaisaLogo } from "./Screens";

const WATCH: Array<[string, string, string, string]> = [
  ["Instagram Reels", "@paisa.ai", "Drops every Sunday · 90s", "https://instagram.com"],
  ["YouTube Shorts", "/@paisa.ai", "Full archive · free forever", "https://youtube.com"],
  ["WhatsApp Channel", "Direct updates", "Story previews before they drop", "https://wa.me/918089941131"],
];

export default function PaisaIntro() {
  return (
    <section
      style={{
        padding: "120px 48px 80px",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(31,58,46,0.18), transparent 50%), #FAF5EB",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          textAlign: "center",
          marginBottom: 64,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            marginBottom: 28,
          }}
        >
          <PaisaLogo size={1.4} onDark={false} />
        </div>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#1F3A2E",
            margin: 0,
          }}
        >
          A Skillies.AI production · Weekly Malayalam income stories
        </p>
        <h1
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(56px, 8vw, 120px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 0.92,
            color: "#1A1A1A",
            margin: "26px 0 22px",
            textWrap: "balance",
          }}
        >
          One week —{" "}
          <em style={{ fontStyle: "italic", color: "#1F3A2E" }}>one story.</em>
        </h1>
        <p
          className="font-ml"
          style={{
            fontSize: 22,
            color: "#3D5A3D",
            fontWeight: 600,
            margin: "0 0 20px",
            letterSpacing: "-0.01em",
          }}
        >
          ഒരു ആഴ്ച — ഒരു കഥ
        </p>
        <p
          style={{
            fontSize: 18,
            color: "#6B7280",
            maxWidth: 680,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Every Sunday, a real Kerala founder, a real AI workflow, a real payout. No hype. No theory. Just the week&apos;s best example of AI skills turning into rupees.
        </p>
      </div>

      {/* where to watch */}
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#1F3A2E" }} />
          Where to watch
          <span
            style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }}
          />
          <span>Free · every Sunday, 6 PM IST</span>
        </div>
        <div
          className="skillies-watch-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {WATCH.map(([platform, handle, sub, href]) => (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                padding: "22px 24px",
                borderRadius: 20,
                background: "white",
                border: "1px solid rgba(31,58,46,0.12)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "transform .25s, border-color .25s, box-shadow .25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(31,58,46,0.35)";
                e.currentTarget.style.boxShadow =
                  "0 20px 50px rgba(31,58,46,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = "rgba(31,58,46,0.12)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#1F3A2E",
                }}
              >
                {platform}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 26,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                }}
              >
                {handle}
              </span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>{sub}</span>
              <span
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#C9A24E",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Follow →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
