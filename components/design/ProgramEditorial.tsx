"use client";

import React from "react";
import Link from "next/link";
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

const COHORT_INCLUDES = [
  "50-day live cohort · weekly Zoom Q&A",
  "All templates, prompts, cover packs",
  "KDP account setup walkthrough",
  "Alumni community access after launch",
  "Course recording library (replay anytime)",
  "Refund-backed guarantee · see FAQ",
];

const MENTORSHIP_INCLUDES = [
  "Everything in the Cohort tier",
  "45-min KDP account audit at kickoff",
  "12 × bi-weekly 1-on-1 Zoom calls with Ehsan (6 months)",
  "Private WhatsApp line · 48-hr SLA · Mon–Fri",
  "Written reviews of up to 10 of your books",
  "Founding-price testimonial exchange (₹75,000 off)",
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
  href,
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
  tier?: "standard" | "pro";
  href?: string;
  highlighted?: boolean;
}) {
  // TierCard renders either an EnrollButton (Razorpay flow via tier prop)
  // or a plain link (href prop — used for products whose sale happens on
  // a separate page, like /mentorship which needs a WhatsApp application
  // first before any payment).
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

      {href ? (
        <Link
          href={href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 28px",
            background: "#1A1A1A",
            color: "white",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.02em",
            boxShadow: "0 16px 36px rgba(26,26,26,0.2)",
          }}
        >
          {ctaLabel} →
        </Link>
      ) : (
        <EnrollButton
          tier={tier as "standard" | "pro"}
          label={ctaLabel}
          priceLabel={price}
        />
      )}
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
            The program that took me from zero books to ₹1L/month royalties — packaged as a 50-day guided cohort. Weekly live Q&A with me, the full four-pillar system, and your first books shipped alongside the batch. No self-study, no lectures on repeat — real work, real deadlines, real royalties.
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
            <Kicker tone="gold">Two paths · two prices</Kicker>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#9CA3AF",
              }}
            >
              Mentorship is application-only · 3 founding seats.
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
              label="Cohort Enrollment"
              price="₹35,000"
              priceNote="Open · live cohort · rolling intake"
              tag="Most Popular"
              subhead="The full 50-day program in a live group cohort. Ship your first book in 50 days, or refund per the guarantee."
              includes={COHORT_INCLUDES}
              ctaLabel="Enroll · Pay ₹35,000"
              tier="standard"
              highlighted
            />
            <TierCard
              tone="gold"
              label="Founding Mentorship"
              price="₹1,75,000"
              oldPrice="₹2,50,000"
              priceNote="3 founding seats · closes April 28"
              tag="Premium"
              subhead="Six months, 1-on-1 with me. Account audit, bi-weekly calls, direct WhatsApp, book reviews. Full details and apply on the mentorship page."
              includes={MENTORSHIP_INCLUDES}
              ctaLabel="See Mentorship · Apply"
              href="/mentorship"
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
            Before the cohort
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
            Still deciding? Start with the{" "}
            <em style={{ fontStyle: "italic", color: "#E6C178" }}>
              one-day Calicut workshop on May 31
            </em>
            {" "}— six hours, one book built in the room, ₹999 early bird. The cleanest way to meet me before committing to the cohort.
          </div>
          <Link
            href="/workshop"
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
            See the workshop →
          </Link>
        </div>
      </div>
    </section>
  );
}
