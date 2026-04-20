"use client";

import React from "react";
import { Grain } from "../design/Primitives";
import WorkshopReserveButton from "./WorkshopReserveButton";

/**
 * PaymentDetails — Razorpay-only checkout for the Calicut workshop.
 * UPI-QR + WhatsApp-screenshot flow lived here until Razorpay went
 * live across both domains; now every reservation goes through the
 * modal and Razorpay emails the student a receipt.
 */

export default function PaymentDetails() {
  return (
    <section
      id="pay"
      style={{
        padding: "128px 24px",
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
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(201,162,78,0.18), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(198,40,40,0.15), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
        {/* Masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#EF4444" }} />
          § Reserve · one tap
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span style={{ color: "rgba(255,255,255,0.55)" }}>
            Instant · 30 seconds
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 80px)",
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            Reserve your seat.{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#E6C178",
              }}
            >
              Instant.
            </em>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Pays securely through Razorpay — UPI, cards, or netbanking. Seat
            auto-confirmed the moment the payment clears; you&rsquo;ll get a
            printable ticket on screen and a Razorpay receipt in your email.
          </p>
        </div>

        {/* The only CTA. */}
        <div
          style={{
            padding: "36px 36px 32px",
            borderRadius: 22,
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.20), rgba(201,162,78,0.10))",
            border: "1.5px solid rgba(239,68,68,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#EF4444",
                marginBottom: 10,
              }}
            >
              Early bird · till May 10
            </div>
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(32px, 3.4vw, 44px)",
                fontWeight: 400,
                letterSpacing: "-0.015em",
                lineHeight: 1.12,
                color: "white",
              }}
            >
              The KDP Workshop ·{" "}
              <em style={{ fontStyle: "italic", color: "#E6C178" }}>
                Calicut, May 31
              </em>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                marginTop: 10,
                lineHeight: 1.55,
              }}
            >
              One day, in-person. Your first book goes live on Amazon KDP
              before you leave the room.
            </div>
          </div>
          <WorkshopReserveButton
            tier="workshop-early"
            priceLabel="₹1,999"
            label="Reserve seat · ₹1,999"
          />
        </div>

        {/* Trust strip — small footnote on security + refund */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>🔒 Secured by Razorpay · 256-bit SSL</span>
          <span>↻ Cancellation &amp; refund policy — see the FAQ below</span>
          <span>📩 Razorpay receipt in your inbox within 60s</span>
        </div>
      </div>
    </section>
  );
}
