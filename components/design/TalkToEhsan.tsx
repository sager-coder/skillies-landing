"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Grain } from "./Primitives";

/**
 * TalkToEhsan — a WhatsApp-first contact block.
 * Kerala is WhatsApp-native (more institutional than email), so every
 * surface gets a QR code that scans directly to Ehsan's WhatsApp,
 * paired with copy that makes the personal-reply commitment explicit.
 *
 * Usage:
 *   <TalkToEhsan
 *     context="workshop"                   // optional preset
 *     heading="Questions about May 31?"    // optional overrides
 *     sub="I reply personally. No bot."
 *   />
 */

type Context = "default" | "workshop" | "program" | "mentorship" | "courses" | "proof";

const PRESETS: Record<
  Context,
  { heading: string; sub: string; message: string; ctaLabel: string }
> = {
  default: {
    heading: "Talk to Ehsan, directly.",
    sub: "I reply personally — no bots, no VA, no form queue. Scan the QR or tap the link. Usually within a few hours.",
    message:
      "Hi Ehsan, I just read skillies.ai and I'd like to talk. My name is ",
    ctaLabel: "Message on WhatsApp",
  },
  workshop: {
    heading: "Book the Calicut workshop.",
    sub: "Scan the QR or tap the button. Tell me your name — I'll send the reservation form and payment details in the next reply.",
    message:
      "Hi Ehsan, I want to reserve a seat at the Calicut workshop on May 31 (₹999 early bird). My name is ",
    ctaLabel: "Reserve · ₹999",
  },
  program: {
    heading: "Enroll in the 50-day cohort.",
    sub: "Scan the QR or tap the button. I'll walk you through whether the ₹35,000 group cohort or the founding ₹1,75,000 mentorship is the right fit.",
    message:
      "Hi Ehsan, I'd like to enroll in the 50-day KDP Mastery cohort. My name is ",
    ctaLabel: "Start enrollment",
  },
  mentorship: {
    heading: "Apply for founding mentorship.",
    sub: "Three seats at ₹1,75,000 founding price (regular ₹2,50,000). Six months of 1-on-1 KDP work with me directly. Closes Monday April 28 or when filled.",
    message:
      "MENTORSHIP — I'd like to apply for one of the 3 founding slots at ₹1,75,000. My name is ",
    ctaLabel: "Apply · ₹1,75,000",
  },
  courses: {
    heading: "Get notified on each drop.",
    sub: "Scan or tap. Tell me which course you're waiting on — I'll ping you the day it ships. No list, no spam, just me.",
    message:
      "Hi Ehsan, notify me when the next Skillies.AI course drops. I'm most interested in ",
    ctaLabel: "Notify me",
  },
  proof: {
    heading: "Want the live KDP dashboard?",
    sub: "I'll screen-share the Amazon KDP Reports page with you over WhatsApp video, on a timeline you pick. Every number on this site is auditable.",
    message:
      "Hi Ehsan, can you walk me through your KDP dashboard live? My name is ",
    ctaLabel: "Ask for live access",
  },
};

function enc(s: string) {
  return encodeURIComponent(s);
}

export default function TalkToEhsan({
  context = "default",
  tone = "charcoal",
  heading,
  sub,
  message,
  ctaLabel,
}: {
  context?: Context;
  tone?: "charcoal" | "cream";
  heading?: string;
  sub?: string;
  message?: string;
  ctaLabel?: string;
}) {
  const preset = PRESETS[context];
  const h = heading ?? preset.heading;
  const s = sub ?? preset.sub;
  const m = message ?? preset.message;
  const label = ctaLabel ?? preset.ctaLabel;

  const href = `https://wa.me/918089941131?text=${enc(m)}`;

  const dark = tone === "charcoal";

  return (
    <section
      style={{
        padding: "80px 32px",
        background: dark ? "#1A1A1A" : "#FAF5EB",
        color: dark ? "#FAF5EB" : "#1A1A1A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {dark && <Grain opacity={0.07} />}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? "radial-gradient(ellipse at 90% 30%, rgba(201,162,78,0.22), transparent 60%)"
            : "radial-gradient(ellipse at 10% 20%, rgba(198,40,40,0.10), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="skillies-talk-grid"
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* QR card */}
        <div
          style={{
            width: 220,
            padding: 18,
            background: "white",
            borderRadius: 18,
            boxShadow: dark
              ? "0 30px 70px rgba(0,0,0,0.35)"
              : "0 20px 50px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          <QRCodeSVG
            value={href}
            size={184}
            bgColor="#FFFFFF"
            fgColor="#1A1A1A"
            level="M"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
          <div
            style={{
              marginTop: 12,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "center",
              color: "#C62828",
            }}
          >
            Scan → WhatsApp
          </div>
          {/* Corner stamp */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#25D366",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 18px rgba(37,211,102,0.45)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: dark ? "#E6C178" : "#C62828",
              marginBottom: 16,
            }}
          >
            Talk on WhatsApp
          </div>
          <h3
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 3.8vw, 52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "0 0 16px",
              color: dark ? "#FAF5EB" : "#1A1A1A",
            }}
          >
            {h}
          </h3>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              margin: "0 0 22px",
              maxWidth: 520,
              color: dark ? "rgba(255,255,255,0.68)" : "#6B7280",
            }}
          >
            {s}
          </p>

          {/* Phone + preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              borderRadius: 14,
              background: dark
                ? "rgba(255,255,255,0.06)"
                : "rgba(250,245,235,0.9)",
              border: dark
                ? "1px solid rgba(255,255,255,0.10)"
                : "1px solid rgba(26,26,26,0.10)",
              maxWidth: 520,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: "#25D366",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: dark
                    ? "rgba(255,255,255,0.45)"
                    : "#9CA3AF",
                  marginBottom: 2,
                }}
              >
                +91 80899 41131 · Ehsan
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  color: dark
                    ? "rgba(255,255,255,0.65)"
                    : "#6B7280",
                  lineHeight: 1.4,
                }}
              >
                &ldquo;{m}
                <span style={{ opacity: 0.5 }}>___&rdquo;</span>
              </div>
            </div>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 28px",
              background: "#25D366",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textDecoration: "none",
              borderRadius: 999,
              boxShadow: "0 12px 30px rgba(37,211,102,0.35)",
              transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(37,211,102,0.40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(37,211,102,0.35)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {label}
          </a>
        </div>

        {/* Signature on right */}
        <div
          className="skillies-talk-signature"
          style={{
            textAlign: "right",
            maxWidth: 200,
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 28,
              color: dark ? "#FAF5EB" : "#1A1A1A",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            — Ehsan
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: dark
                ? "rgba(255,255,255,0.45)"
                : "#9CA3AF",
              lineHeight: 1.5,
            }}
          >
            Replies personally<br />
            Malappuram · Kerala
          </div>
        </div>
      </div>
    </section>
  );
}
