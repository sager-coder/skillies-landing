"use client";

import React, { useEffect, useState } from "react";
import { Kicker, PrimaryButton, SecondaryButton, Wordmark, Grain } from "../design/Primitives";

const AGENDA: Array<{ t: string; h: string; d: string; highlight?: boolean }> = [
  { t: "10:00", h: "Doors · chai · introductions", d: "Meet the other Malayalees betting on AI for real income. Short icebreaker." },
  { t: "10:30", h: "The KDP opportunity, in real numbers", d: "₹8L breakdown. Which no-content categories pay in 2026. What Amazon rewards now — and what it punishes." },
  { t: "11:30", h: "Your first book — cover to upload", d: "We build one coloring or puzzle book per person, end-to-end. Claude prompts, Canva layout, KDP upload — live, together.", highlight: true },
  { t: "13:00", h: "Lunch · Malabar biryani (included)", d: "Networking. Paisa conversations. Cover reviews over lunch." },
  { t: "14:00", h: "Scaling 1 book to 10 in 90 days", d: "The stacking system. Reusable templates. Royalty math. Amazon policy pitfalls to avoid." },
  { t: "15:15", h: "Keywords, pricing, first 10 reviews", d: "What to title, how to price, how to earn reviews ethically. The three levers that move royalties fastest." },
  { t: "16:00", h: "Close · Founding Batch offer", d: "Only workshop attendees unlock ₹45,000 pricing on the 50-day mentorship." },
];

export function WorkshopAgenda() {
  return (
    <section id="agenda" style={{ padding: "120px 24px", background: "white" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Kicker tone="red">The Day</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 12px", letterSpacing: "-0.04em", lineHeight: 1 }}>
            Six hours. One laptop.
            <br />Your first book live.
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", margin: "14px auto 0", maxWidth: 520, lineHeight: 1.6 }}>
            Tight schedule. No fluff. You leave with a book on Amazon, not a binder of theory.
          </p>
        </div>
        {AGENDA.map((it, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr auto",
              gap: 24,
              padding: "24px 0",
              borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
              background: it.highlight
                ? "linear-gradient(90deg, rgba(198,40,40,0.04), transparent 50%)"
                : "transparent",
              marginLeft: it.highlight ? -24 : 0,
              marginRight: it.highlight ? -24 : 0,
              paddingLeft: it.highlight ? 24 : 0,
              paddingRight: it.highlight ? 24 : 0,
              borderRadius: it.highlight ? 16 : 0,
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 15,
                fontWeight: 700,
                color: "#C62828",
                letterSpacing: "0.02em",
                paddingTop: 3,
              }}
            >
              {it.t}
            </div>
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px", letterSpacing: "-0.015em" }}>{it.h}</h3>
              <p style={{ fontSize: 15, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{it.d}</p>
            </div>
            {it.highlight && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(198,40,40,0.1)",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  color: "#C62828",
                }}
              >
                CORE
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const EARLY = [
  "Full day (10 AM – 4 PM)",
  "Malabar biryani lunch",
  "Your first book live on Amazon",
  "Cover & keyword templates",
  "Founding Batch access (₹45K pricing)",
  "Private WhatsApp group (60 days)",
];
const REGULAR = [
  "Full day (10 AM – 4 PM)",
  "Malabar biryani lunch",
  "Your first book live on Amazon",
  "Cover & keyword templates",
  "Standard Batch access",
  "Private WhatsApp group (60 days)",
];

export function WorkshopPricing() {
  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Kicker tone="gold">Seats</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 12px", letterSpacing: "-0.04em" }}>
            Two windows. One room.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div
            style={{
              padding: 36,
              borderRadius: 26,
              background: "white",
              border: "2px solid rgba(201,162,78,0.45)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(201,162,78,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#C9A24E",
                color: "#2a1f08",
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 16,
                letterSpacing: "0.2em",
              }}
            >
              EARLY BIRD
            </div>
            <Kicker tone="gold">Ends May 10</Kicker>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "20px 0 6px" }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", lineHeight: 1 }}>₹1,999</span>
              <span style={{ color: "#9CA3AF", textDecoration: "line-through", fontSize: 18 }}>₹2,499</span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Save ₹500. Same seat, same lunch, same outcome.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {EARLY.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A24E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <PrimaryButton>Grab Early Bird Seat</PrimaryButton>
          </div>
          <div style={{ padding: 36, borderRadius: 26, background: "white", border: "1px solid #F0E8D8" }}>
            <Kicker tone="red">Regular</Kicker>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.045em", margin: "20px 0 6px", lineHeight: 1 }}>₹2,499</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 22px", lineHeight: 1.6 }}>
              Same day. Same seat. No early bird discount.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
              {REGULAR.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1A1A1A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <SecondaryButton>Reserve Regular</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkshopLocation() {
  return (
    <section style={{ padding: "120px 24px", background: "#1A1A1A", color: "white", position: "relative" }}>
      <Grain opacity={0.05} />
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            aspectRatio: "4/3",
            borderRadius: 22,
            background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
            border: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
            <path d="M0 180 Q100 120 200 160 T400 140" stroke="#C62828" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40 60 L80 120 L140 90 L220 200 L300 180 L360 240" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 6" />
            <circle cx="220" cy="150" r="8" fill="#C62828" />
            <circle cx="220" cy="150" r="18" fill="none" stroke="#C62828" strokeWidth="2" opacity="0.5" />
            <circle cx="220" cy="150" r="28" fill="none" stroke="#C62828" strokeWidth="1" opacity="0.3" />
          </svg>
          <div style={{ position: "absolute", bottom: 22, left: 22 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.24em", color: "#7A9A7A", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 700 }}>Venue</p>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Hyatt Regency, Calicut</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>5 min from Calicut railway</p>
          </div>
        </div>
        <div>
          <Kicker tone="green-light">Where &amp; When</Kicker>
          <h2 style={{ fontSize: "clamp(44px, 5.5vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "16px 0 28px", lineHeight: 0.98 }}>
            Calicut. May 31.
            <br />
            <span style={{ color: "#EF4444" }}>10:00 AM sharp.</span>
          </h2>
          <div style={{ display: "grid", gap: 16, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>
            <div><strong style={{ color: "white" }}>Full day:</strong> 10 AM – 4 PM, with chai + Malabar biryani included</div>
            <div><strong style={{ color: "white" }}>Bring:</strong> Your laptop. Charger. Notebook.</div>
            <div><strong style={{ color: "white" }}>Language:</strong> English, plain and clear</div>
            <div><strong style={{ color: "white" }}>Seats:</strong> Hard-capped at 150 — no overflow</div>
            <div><strong style={{ color: "white" }}>You leave with:</strong> Your first book, live on Amazon.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "I've never written a book. Can I still do this?", a: "Yes — that's the entire point. No-content books don't require writing. You're designing and curating, not authoring. If you can use a browser, you can publish." },
  { q: "Do I need to know English fluently?", a: "Basic English is enough. KDP's interface is English and the workshop is taught in plain English — no jargon, no lecture-mode. If you can read a product listing on Amazon, you can do this." },
  { q: "Will Amazon actually pay me? How?", a: "Yes. Amazon pays directly to your Indian bank account, monthly, in INR. You need a PAN card and bank account — that's it. We walk through setup live." },
  { q: "How long until my first royalty?", a: "First book live: end of the workshop. First royalty payout: within 60 days of your first sale. Expect ₹500–2,000 in month one if you priced it right — small, but real and compounding." },
  { q: "What's the catch with ₹1,999?", a: "Early bird is a genuine price drop to fill seats before May 10. After that it's ₹2,499. No hidden fees, no upsell pressure. The Founding Batch (₹45,000) is optional and only offered at the end." },
  { q: "Is this a pyramid scheme / MLM / hype thing?", a: "No. You're publishing real books on Amazon, earning real royalties from global readers. We don't recruit, we don't sell courses about selling courses. Proof: 63 books, ₹8L+ earned by the founder, solo." },
];

export function WorkshopFAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" style={{ padding: "120px 24px", background: "#FAF5EB" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Kicker tone="red">Real Questions</Kicker>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, color: "#1A1A1A", margin: "16px 0 0", letterSpacing: "-0.04em", lineHeight: 1 }}>
            What people actually ask.
          </h2>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 18,
                  border: `1px solid ${isOpen ? "rgba(198,40,40,0.25)" : "#F0E8D8"}`,
                  overflow: "hidden",
                  transition: "border-color .25s",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    padding: "22px 28px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: isOpen ? "#C62828" : "#1A1A1A",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      border: "1px solid " + (isOpen ? "rgba(198,40,40,0.4)" : "#F0E8D8"),
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      transition: "transform .35s cubic-bezier(.22,1,.36,1)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#C62828" : "#1A1A1A"} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 28px 24px", fontSize: 15, color: "#6B7280", lineHeight: 1.65 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkshopTopBar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "14px 24px",
        background: "rgba(250,245,235,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(26,26,26,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Wordmark size={22} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
        <a href="#books" style={{ color: "inherit", textDecoration: "none" }}>Books</a>
        <a href="#agenda" style={{ color: "inherit", textDecoration: "none" }}>Agenda</a>
        <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>Pricing</a>
        <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <a
          href="#pricing"
          style={{
            padding: "8px 18px",
            background: "#C62828",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Reserve →
        </a>
      </div>
    </div>
  );
}

export function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        padding: "10px 14px 10px 20px",
        background: "#1A1A1A",
        color: "white",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        animation: "slideUp .4s ease-out",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500 }}>
        <strong style={{ color: "#EF4444" }}>89/150</strong> seats · Early bird ends May 10
      </span>
      <a
        href="#pricing"
        style={{
          padding: "10px 20px",
          background: "#C62828",
          color: "white",
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        Reserve ₹1,999 →
      </a>
    </div>
  );
}
