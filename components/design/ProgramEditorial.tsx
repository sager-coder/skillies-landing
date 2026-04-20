"use client";

import React from "react";
import { Kicker } from "./Primitives";
import EnrollButton from "./EnrollButton";

/**
 * ProgramEditorial — the 50-day flagship program.
 * Replaces the old v1 Program.tsx Tailwind pricing grid with a proper
 * editorial spread: masthead, track list, tier cards, closing link.
 */

type Track = {
  n: string;
  title: string;
  hook: string;
  body: string;
  days: string;
  accent: string;
};

const TRACKS: Track[] = [
  {
    n: "01",
    title: "Niche research, AI-led",
    hook: "Find what Amazon is actually buying — every week.",
    body: "We scan Amazon's live best-sellers together. Claude decodes why they sell. You build a shortlist of under-served niches with proven demand.",
    days: "Days 1 – 7",
    accent: "#C62828",
  },
  {
    n: "02",
    title: "Book creation workflow",
    hook: "Claude + Canva + KDP, start to finish.",
    body: "The full pipeline: prompts to outline, outline to manuscript, manuscript to laid-out interior. You ship one book inside the first ten days.",
    days: "Days 8 – 15",
    accent: "#C9A24E",
  },
  {
    n: "03",
    title: "Cover design masterclass",
    hook: "Covers that sell, not covers that please.",
    body: "Templated covers in Canva, live critique on yours. Typography and contrast rules that make Amazon thumbnails click. Real before/afters from my own catalog.",
    days: "Days 16 – 22",
    accent: "#5B7B5B",
  },
  {
    n: "04",
    title: "KDP account setup, optimised",
    hook: "Every backend form, filled with you.",
    body: "PAN, bank, tax interview, royalty settings, pricing, keyword research — live screen-share, nothing skipped. No 'figure it out yourself.'",
    days: "Days 23 – 30",
    accent: "#1A1A1A",
  },
  {
    n: "05",
    title: "Scaling · 1 book to 60",
    hook: "The stacking system I used to go from 1 → 63.",
    body: "Reusable templates. Royalty math that compounds. Policy pitfalls that kill new accounts. How to batch six weeks of work into six Sunday mornings.",
    days: "Days 31 – 42",
    accent: "#C62828",
  },
  {
    n: "06",
    title: "Mentorship · and after",
    hook: "Direct access to me, not just course material.",
    body: "Weekly group calls. Private WhatsApp, me + cohort. Live office hours every Sunday. Then lifetime alumni access when new courses drop (Video, Etsy, Meta ads).",
    days: "Days 43 – 50",
    accent: "#C9A24E",
  },
];

function TrackRow({ t }: { t: Track }) {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 28,
        padding: "28px 0",
        borderTop: "1px solid rgba(26,26,26,0.10)",
        alignItems: "baseline",
      }}
    >
      <div
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 44,
          color: t.accent,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          minWidth: 56,
        }}
      >
        {t.n}
      </div>
      <div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-0.02em",
            margin: "0 0 4px",
          }}
        >
          {t.title}
        </h3>
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 17,
            color: t.accent,
            margin: "0 0 10px",
            lineHeight: 1.35,
          }}
        >
          {t.hook}
        </p>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.65,
            maxWidth: 600,
          }}
        >
          {t.body}
        </p>
      </div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          paddingTop: 8,
          whiteSpace: "nowrap",
        }}
      >
        {t.days}
      </div>
    </article>
  );
}

const STANDARD_INCLUDES = [
  "50-day guided mentorship, live cohort",
  "Group calls every Sunday",
  "All templates, prompts, cover packs",
  "KDP account setup, live walkthrough",
  "Alumni community access after launch",
  "Course recording library (replay anytime)",
];

const PRO_INCLUDES = [
  "Everything in the Standard tier",
  "12 × 1-on-1 calls with Ehsan over the 50 days",
  "Private WhatsApp — direct line, no cohort middleman",
  "Custom niche + book-one plan built for you",
  "First access to all future courses (Video, Etsy, Meta)",
  "Launch-week support on your first title",
];

function TierCard({
  tone,
  label,
  price,
  oldPrice,
  priceNote,
  tag,
  subhead,
  includes,
  ctaLabel,
  tier,
  fallbackHref,
  highlighted,
}: {
  tone: "gold" | "red";
  label: string;
  price: string;
  oldPrice?: string;
  priceNote: string;
  tag?: string;
  subhead: string;
  includes: string[];
  ctaLabel: string;
  tier: "standard" | "pro";
  fallbackHref: string;
  highlighted?: boolean;
}) {
  const palette = {
    gold: {
      accent: "#C9A24E",
      accentDark: "#8a6a1f",
      border: "rgba(201,162,78,0.55)",
      ribbon: "#C9A24E",
      ribbonText: "#1A1A1A",
    },
    red: {
      accent: "#C62828",
      accentDark: "#8B1A1A",
      border: "rgba(26,26,26,0.10)",
      ribbon: "#1A1A1A",
      ribbonText: "#FAF5EB",
    },
  }[tone];

  return (
    <div
      style={{
        position: "relative",
        padding: "40px 36px 36px",
        borderRadius: 24,
        background: highlighted
          ? "linear-gradient(135deg, rgba(201,162,78,0.08), #FAF5EB 60%)"
          : "white",
        border: `${highlighted ? 1.5 : 1}px solid ${palette.border}`,
        boxShadow: highlighted
          ? "0 40px 90px rgba(201,162,78,0.18)"
          : "0 20px 50px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {tag && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "6px 16px",
            background: palette.ribbon,
            color: palette.ribbonText,
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 900,
            borderBottomLeftRadius: 14,
          }}
        >
          {tag}
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: palette.accent,
          marginBottom: 14,
        }}
      >
        {label}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "-0.035em",
            lineHeight: 0.9,
            color: "#1A1A1A",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {price}
        </div>
        {oldPrice && (
          <div
            style={{
              fontSize: 20,
              color: "#9CA3AF",
              textDecoration: "line-through",
              fontWeight: 500,
            }}
          >
            {oldPrice}
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          margin: "0 0 6px",
          letterSpacing: "0.02em",
        }}
      >
        {priceNote}
      </p>

      <p
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 17,
          color: palette.accentDark,
          margin: "16px 0 22px",
          lineHeight: 1.4,
          paddingBottom: 18,
          borderBottom: "1px dashed rgba(26,26,26,0.12)",
        }}
      >
        {subhead}
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 28px",
          display: "grid",
          gap: 12,
        }}
      >
        {includes.map((x) => (
          <li
            key={x}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 14,
              color: "#1A1A1A",
              lineHeight: 1.45,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 2 }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {x}
          </li>
        ))}
      </ul>

      <EnrollButton tier={tier} label={ctaLabel} priceLabel={price} />
      <div
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "#9CA3AF",
          lineHeight: 1.5,
        }}
      >
        Prefer UPI + WhatsApp?{" "}
        <a
          href={fallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#6B7280", textDecoration: "underline" }}
        >
          Message Ehsan
        </a>
        .
      </div>
    </div>
  );
}

export default function ProgramEditorial() {
  return (
    <section
      id="program"
      style={{
        padding: "128px 24px",
        background: "#FAF5EB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § 08 · The flagship program
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Small cohort · mentor-led</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 72,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(52px, 7vw, 100px)",
              fontWeight: 900,
              color: "#1A1A1A",
              margin: 0,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            KDP Mastery.
            <br />
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#C62828",
              }}
            >
              Fifty days.
            </em>{" "}
            One mentor.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            The program that took me from zero books to ₹1L/month royalties — packaged as a 50-day guided mentorship. Small cohort, live calls, your first sixty titles shipped alongside mine. No self-study, no lectures on repeat — real work, real deadlines, real royalties.
          </p>
        </div>

        {/* 6-track program breakdown */}
        <div style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <Kicker tone="red">The syllabus · 6 tracks, 50 days</Kicker>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#9CA3AF",
              }}
            >
              Everything, in order.
            </span>
          </div>
          <div
            style={{
              borderBottom: "1.5px solid #1A1A1A",
              paddingBottom: 2,
              marginTop: 14,
            }}
          />
          {TRACKS.map((t) => (
            <TrackRow key={t.n} t={t} />
          ))}
          <div style={{ borderTop: "1.5px solid #1A1A1A", marginTop: 0 }} />
        </div>

        {/* Pricing tiers */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <Kicker tone="gold">Two windows · one cohort</Kicker>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#9CA3AF",
              }}
            >
              Pro seats limited · talk to Ehsan before enrolling.
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              alignItems: "stretch",
            }}
          >
            <TierCard
              tone="red"
              label="Standard Enrollment"
              price="₹75,000"
              priceNote="Open · live cohort · rolling intake"
              tag="Most Popular"
              subhead="The full 50-day program in a live group cohort. Ship your first book in 50 days, or refund per the guarantee."
              includes={STANDARD_INCLUDES}
              ctaLabel="Enroll · Pay ₹75,000"
              tier="standard"
              fallbackHref="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20enroll%20in%20the%2050-day%20KDP%20Mastery%20program%20at%20%E2%82%B975%2C000%20%28standard%29.%20My%20name%20is%20"
              highlighted
            />
            <TierCard
              tone="gold"
              label="Pro · 1-on-1 Mentorship"
              price="₹1,25,000"
              priceNote="By application · 2-3 seats per cohort"
              tag="Pro"
              subhead="Standard, plus twelve 1-on-1 calls, a direct WhatsApp line, and a custom book-one plan built around your niche. Application only."
              includes={PRO_INCLUDES}
              ctaLabel="Apply · Pay ₹1,25,000"
              tier="pro"
              fallbackHref="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20apply%20for%20the%20Pro%20%28%E2%82%B91%2C25%2C000%29%20tier%20of%20the%2050-day%20KDP%20Mastery%20program.%20My%20name%20is%20"
            />
          </div>

          {/* Closed-batch note */}
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.18)",
              background: "rgba(26,26,26,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#6B7280",
              }}
            >
              Batch 001 · Closed
            </div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#6B7280",
                flex: 1,
                minWidth: 0,
              }}
            >
              The first founding batch at ₹45,000 sold out in the Calicut workshop (May 31). That rate won’t reopen.
            </div>
          </div>

          {/* After-payment flow — demystifies the enrollment → login path */}
          <div
            style={{
              marginTop: 28,
              padding: "24px 26px",
              borderRadius: 18,
              background: "white",
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#C62828",
              }}
            >
              <span style={{ width: 20, height: 1, background: "#C62828" }} />
              After you pay
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(26,26,26,0.08)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  textTransform: "none",
                  letterSpacing: "0",
                  color: "#6B7280",
                  fontWeight: 400,
                  fontSize: 12,
                }}
              >
                Four steps, about 24 hours.
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 18,
              }}
            >
              {[
                [
                  "01",
                  "Pay by UPI",
                  "To +91 87143 18352 or ehsansager@okhdfcbank.",
                ],
                [
                  "02",
                  "Screenshot to WhatsApp",
                  "Send the payment confirmation to +91 80899 41131.",
                ],
                [
                  "03",
                  "Ehsan enrols you",
                  "Manual, personal, within 24 hours. You get a WhatsApp ping.",
                ],
                [
                  "04",
                  "Sign in at skillies.ai",
                  "Tap Sign in, enter the same phone number, OTP, you're in.",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 28,
                      fontStyle: "italic",
                      color: "#C62828",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: 4,
                    }}
                  >
                    {t}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}
                  >
                    {d}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: "1px dashed rgba(26,26,26,0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 13,
                }}
              >
                Already paid? Your portal is one tap away.
              </span>
              <a
                href="/login"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C62828",
                  textDecoration: "none",
                }}
              >
                Sign in →
              </a>
            </div>
          </div>
        </div>

        {/* Closing strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            alignItems: "center",
            padding: "28px 36px",
            borderRadius: 22,
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
              inset: 0,
              background:
                "radial-gradient(ellipse at 85% 50%, rgba(201,162,78,0.25), transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#E6C178",
              whiteSpace: "nowrap",
            }}
          >
            Beyond the program
          </div>
          <div
            style={{
              position: "relative",
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(20px, 2.2vw, 28px)",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.35,
            }}
          >
            Beyond the 50-day program, I offer{" "}
            <em style={{ fontStyle: "italic", color: "#E6C178" }}>
              advanced 1-on-1 tracks and done-for-you services
            </em>
            {" "}— pricing starts at ₹1,25,000. Ask on WhatsApp.
          </div>
          <a
            href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20know%20about%20your%20advanced%201-on-1%20tracks%20and%20done-for-you%20services.%20My%20name%20is%20"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "relative",
              padding: "14px 22px",
              background: "#C62828",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: 999,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 12px 30px rgba(198,40,40,0.25)",
            }}
          >
            Ask on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
