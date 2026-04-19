"use client";

import React from "react";

/**
 * KDPDashboardProof — embeds the actual KDP Reports screenshot as
 * a framed browser-style card. Drop the PNG into:
 *   public/kdp-dashboard.png
 * The component uses a fallback cream panel until the file is in place.
 */

export default function KDPDashboardProof() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "white",
        border: "1px solid rgba(26,26,26,0.10)",
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          padding: "10px 16px",
          background: "#F4EDDE",
          borderBottom: "1px solid rgba(26,26,26,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#E06C5B", "#E6C178", "#7A9A7A"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: c,
                opacity: 0.75,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            padding: "5px 12px",
            background: "white",
            borderRadius: 6,
            border: "1px solid rgba(26,26,26,0.08)",
            fontSize: 11,
            color: "#6B7280",
            fontFamily: "ui-monospace, Menlo, monospace",
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          kdpreports.amazon.com/royalties
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#9CA3AF",
          }}
        >
          Apr 19, 2026
        </div>
      </div>

      {/* Actual screenshot */}
      <div
        style={{
          position: "relative",
          background: "white",
          lineHeight: 0,
        }}
      >
        <img
          src="/kdp-dashboard.png"
          alt="Actual Kindle Direct Publishing Royalties Estimator showing ₹8,71,982.06 total royalties across 63 books"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        {/* Verified stamp overlay */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            padding: "8px 14px",
            background: "rgba(250,245,235,0.92)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid #5B7B5B",
            borderRadius: 4,
            transform: "rotate(-3deg)",
            color: "#3D5A3D",
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.3em",
            lineHeight: 1.3,
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          VERIFIED<br />
          <span style={{ fontSize: 8, letterSpacing: "0.25em", fontWeight: 700 }}>APR 2026</span>
        </div>
      </div>

      {/* Caption strip */}
      <div
        style={{
          padding: "22px 28px",
          borderTop: "1px solid rgba(26,26,26,0.08)",
          background: "#FAF5EB",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#C62828",
              marginBottom: 6,
            }}
          >
            Exhibit A · My actual KDP dashboard
          </div>
          <p
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "#1A1A1A",
              margin: 0,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            ₹8,71,982.06 total KDP royalties over two years. All 63 books, all real, all auditable.
          </p>
        </div>
        <a
          href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20see%20the%20KDP%20dashboard%20live.%20When%20are%20you%20free%20for%20a%20quick%20WhatsApp%20video%20call%3F%20My%20name%20is%20"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 18px",
            borderRadius: 999,
            background: "#1A1A1A",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Want it live? Ask →
        </a>
      </div>
    </div>
  );
}
