"use client";

import React, { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton, Grain } from "../design/Primitives";

function TicketStub() {
  return (
    <div
      className="ticket-card"
      style={{
        position: "relative",
        display: "inline-flex",
        maxWidth: "100%",
        background: "#1A1A1A",
        color: "#FAF5EB",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 30px 70px rgba(26,26,26,0.35), 0 2px 0 rgba(201,162,78,0.3) inset",
        transform: "rotate(-2deg)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "58%",
          width: 1,
          background:
            "repeating-linear-gradient(to bottom, rgba(250,245,235,0.35) 0 4px, transparent 4px 10px)",
        }}
      />
      <div className="ticket-main" style={{ padding: "22px 28px", minWidth: 300 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "#C9A24E",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Admit one · Calicut
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', 'Georgia', serif",
            fontStyle: "italic",
            fontSize: 44,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: "0 0 6px",
          }}
        >
          The KDP
          <br />
          <span style={{ color: "#EF4444", fontStyle: "italic" }}>Workshop</span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(250,245,235,0.55)",
            marginTop: 8,
            letterSpacing: "0.05em",
          }}
        >
          Hyatt Regency · Doors 10:00 AM
        </div>
      </div>
      <div
        className="ticket-stub"
        style={{
          padding: "22px 24px",
          background: "#C62828",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 140,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 800,
            opacity: 0.85,
          }}
        >
          Stub
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 800,
              opacity: 0.85,
            }}
          >
            May
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 58,
              fontWeight: 400,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            31
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 800,
              opacity: 0.85,
            }}
          >
            2026
          </div>
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: 0.7,
            textAlign: "right",
          }}
        >
          Vol. 01
        </div>
      </div>
    </div>
  );
}

// Three-tier seat capacity visualizer — shows the ₹999 / ₹1,999 / ₹2,999
// split (50 / 75 / 25 of 150). No fake counts; the proportions are the
// honest scarcity story. A dynamic per-tier "sold" badge can be layered
// on top later once seat-count enforcement ships on the server.
function SeatMeter() {
  const segments: Array<{ w: number; bg: string; label: string }> = [
    { w: 50 / 150, bg: "#C9A24E", label: "50 · ₹999" },
    { w: 75 / 150, bg: "#C62828", label: "75 · ₹1,999" },
    { w: 25 / 150, bg: "#1A1A1A", label: "25 · ₹2,999" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div
        style={{
          position: "relative",
          width: 280,
          height: 8,
          display: "flex",
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(26,26,26,0.08)",
        }}
      >
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              flex: s.w,
              background: s.bg,
              borderRight: i < segments.length - 1 ? "2px solid #FAF5EB" : "none",
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
        <span style={{ color: "#C9A24E", fontWeight: 700 }}>50 early</span>
        <span> · 75 regular · </span>
        <span style={{ color: "#1A1A1A", fontWeight: 700 }}>25 VIP</span>
      </div>
    </div>
  );
}

const DETAILS: Array<[string, string, string]> = [
  ["Date", "May 31, 2026", "Sunday"],
  ["Hours", "10 AM – 4 PM", "Six hours"],
  ["Venue", "Hyatt Regency", "Calicut"],
  ["Language", "English taught", "Clear, no jargon"],
];

export default function WorkshopHero() {
  const target = new Date("2026-05-31T10:00:00+05:30").getTime();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    setDaysLeft(calc());
    const id = setInterval(() => setDaysLeft(calc()), 60000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "120px 24px 80px",
        background:
          "radial-gradient(ellipse at 90% 5%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 5% 95%, rgba(201,162,78,0.18), transparent 60%), #FAF5EB",
        overflow: "hidden",
      }}
    >
      <Grain opacity={0.08} />

      <div
        aria-hidden
        className="skillies-margin-note"
        style={{
          position: "absolute",
          top: "14%",
          right: "6%",
          transform: "rotate(6deg)",
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 22,
          color: "rgba(26,26,26,0.35)",
          maxWidth: 180,
          lineHeight: 1.25,
          textAlign: "right",
        }}
      >
        &quot;One laptop. Six hours.
        <br />
        Your first royalty.&quot;
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "18%",
          left: "6%",
          transform: "rotate(-5deg)",
          width: 92,
          height: 124,
          borderRadius: "3px 10px 10px 3px",
          background: "linear-gradient(135deg, #C62828, #8B1A1A)",
          boxShadow: "0 28px 50px rgba(198,40,40,0.35)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#C9A24E",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 10,
            left: 18,
            height: 3,
            background: "#C9A24E",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 10,
            left: 18,
            height: 2,
            background: "#C9A24E",
            opacity: 0.5,
          }}
        />
      </div>

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
            fontSize: 12,
            color: "#6B7280",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 40, height: 1, background: "#C62828" }} />
          Skillies.AI presents · Vol. 01
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>
            Calicut · {daysLeft ?? "—"} days out
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "clamp(72px, 10vw, 156px)",
                letterSpacing: "-0.055em",
                lineHeight: 0.86,
                color: "#1A1A1A",
              }}
            >
              The{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', 'Georgia', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#C62828",
                }}
              >
                KDP
              </em>
              <br />
              Workshop.
            </h1>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(24px, 2.8vw, 34px)",
                color: "#3D5A3D",
                fontWeight: 400,
                margin: "22px 0 16px",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              One day. One laptop.
              <br />
              One new income stream.
            </p>
            <p
              style={{
                fontSize: 18,
                color: "#6B7280",
                maxWidth: 520,
                margin: "0 0 36px",
                lineHeight: 1.6,
              }}
            >
              A one-day, in-person workshop in Calicut. You walk in with a laptop and a blank slate. You walk out with your first book live on Amazon KDP.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              <PrimaryButton href="#pay">
                Reserve Your Seat · ₹999
              </PrimaryButton>
              <SecondaryButton href="#agenda">
                See the Day’s Agenda
              </SecondaryButton>
            </div>

            <SeatMeter />

            <div
              style={{
                marginTop: 24,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "#6B7280",
                padding: "7px 14px",
                background: "rgba(255,255,255,0.6)",
                borderRadius: 999,
                border: "1px solid #F0E8D8",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "#C62828",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: -4,
                    border: "2px solid #C62828",
                    borderRadius: 999,
                    opacity: 0.4,
                    animation: "pulse 2s infinite",
                  }}
                />
              </span>
              Early bird ₹999 · first 50 seats only
            </div>
          </div>

          <div
            style={{
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <TicketStub />

            <div
              style={{
                padding: "20px 22px",
                borderRadius: 18,
                background: "white",
                border: "1px solid #F0E8D8",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              {DETAILS.map(([k, v, s]) => (
                <div key={k}>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#9CA3AF",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {v}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{s}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#C62828", "#C9A24E", "#5B7B5B", "#1A1A1A"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: c,
                      border: "2px solid #FAF5EB",
                      marginLeft: i === 0 ? 0 : -8,
                    }}
                  />
                ))}
              </div>
              <span>
                Joined by Kerala founders, Gulf NRIs, and a few curious teachers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
