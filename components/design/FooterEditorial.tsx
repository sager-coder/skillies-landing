"use client";

import React from "react";
import { Grain } from "./Primitives";

type Col = { kicker: string; items: Array<[string, string]> };

const COLUMNS: Col[] = [
  {
    kicker: "Learn",
    items: [
      ["KDP Mastery · 50-day program", "/#program"],
      ["Course catalog", "/courses"],
      ["Student dashboard", "/dashboard"],
      ["The 7-day onboarding", "/#program"],
    ],
  },
  {
    kicker: "Events",
    items: [
      ["Calicut workshop · May 31", "/workshop"],
      ["Founding batch pricing", "/workshop#pricing"],
      ["Paisa.AI weekly show", "/paisa"],
      ["Upcoming dates", "/#faq"],
    ],
  },
  {
    kicker: "Company",
    items: [
      ["The manifesto", "/#promise"],
      ["Proof & receipts", "/#proof"],
      ["About Ehsan", "/#about"],
      ["FAQ", "/#faq"],
    ],
  },
];

const SOCIAL: Array<[string, string]> = [
  ["Instagram · @skillies.ai", "https://instagram.com/skillies.ai"],
  ["YouTube · Paisa.AI", "https://youtube.com"],
  ["WhatsApp · +91 80899 41131", "https://wa.me/918089941131"],
];

export default function FooterEditorial() {
  return (
    <footer
      style={{
        padding: "128px 24px 48px",
        background: "#1A1A1A",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grain opacity={0.06} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10%",
          top: "-10%",
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(circle, rgba(198,40,40,0.18), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        {/* Hero CTA block */}
        <div style={{ maxWidth: 900 }}>
          <p
            style={{
              color: "#7A9A7A",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: 12,
              fontWeight: 700,
              margin: "0 0 20px",
            }}
          >
            § Final · Ready?
          </p>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 7vw, 96px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              margin: "0 0 28px",
              textWrap: "balance",
            }}
          >
            Your first book could be
            <br />
            <em style={{ fontStyle: "italic", color: "#EF4444" }}>
              live on Amazon in 7 days.
            </em>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 560,
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            One message to Ehsan. That&apos;s the start. No commitment until you&apos;re ready.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies.AI%20KDP%20Mastery%20Program."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 32px",
                background: "#C62828",
                color: "white",
                fontWeight: 600,
                fontSize: 17,
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 18px 50px rgba(198,40,40,0.30)",
                transition: "all .3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EF4444";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C62828";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Message Ehsan on WhatsApp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8l4 4-4 4M3 12h18" />
              </svg>
            </a>
            <a
              href="/workshop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "18px 28px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                fontWeight: 500,
                fontSize: 15,
                borderRadius: 999,
                textDecoration: "none",
                transition: "background .2s, border-color .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Or: attend the Calicut workshop →
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            margin: "96px 0 48px",
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Link columns */}
        <div
          className="skillies-footer-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 900,
                fontSize: 28,
                letterSpacing: "-0.03em",
                margin: "0 0 12px",
              }}
            >
              SKILLIES<span style={{ color: "#EF4444" }}>.AI</span>
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                margin: "0 0 18px",
                maxWidth: 360,
              }}
            >
              Practical AI skills that turn into real income. Proof-backed, Malayalam-first. Built in Malappuram, Kerala.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              {SOCIAL.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#EF4444")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.kicker}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#7A9A7A",
                  fontWeight: 700,
                  margin: "0 0 18px",
                }}
              >
                {col.kicker}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.items.map(([label, href]) => (
                  <li key={href + label}>
                    <a
                      href={href}
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        transition: "color .2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "white")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                      }
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            © {new Date().getFullYear()} Skillies.AI · Malappuram, Kerala, India
          </p>
          <p
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              margin: 0,
            }}
          >
            ഉറങ്ങുമ്പോഴും പൈസ വരും
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                color: "rgba(255,255,255,0.25)",
                marginLeft: 10,
              }}
            >
              — even while you sleep, money flows.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
