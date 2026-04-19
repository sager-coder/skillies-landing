"use client";

import React, { useState } from "react";
import { Grain } from "../design/Primitives";

/**
 * PaymentDetails — clear, inline payment instructions for the
 * Calicut workshop. No Razorpay yet — UPI to a phone number, then
 * screenshot the confirmation to Ehsan on WhatsApp.
 *
 * Three steps, one big copyable number, one green "send screenshot"
 * CTA. Editorial, not form-y.
 */

const UPI_NUMBER_DISPLAY = "+91 87143 18352";
const UPI_NUMBER_DIGITS = "918714318352";
const WA_CONFIRM =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27ve%20just%20paid%20for%20the%20Calicut%20workshop.%20Sending%20the%20screenshot%20now.%20My%20name%20is%20";

export default function PaymentDetails() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_NUMBER_DIGITS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* swallow */
    }
  };

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
          <span
            style={{ width: 44, height: 1, background: "#EF4444" }}
          />
          § Payment · simple &amp; fast
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span style={{ color: "rgba(255,255,255,0.55)" }}>
            UPI · under a minute
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
            How to pay.{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#E6C178",
              }}
            >
              Three steps.
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
            No online checkout yet. You pay by UPI to the number below,
            screenshot the confirmation, and WhatsApp it to me. I
            confirm your seat the moment I see it.
          </p>
        </div>

        {/* Three steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 18,
            marginBottom: 40,
          }}
        >
          {/* Step 01 */}
          <div
            style={{
              padding: "28px 28px 32px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 48,
                color: "#7A9A7A",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            >
              01
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "white",
                margin: "0 0 10px",
              }}
            >
              Open any UPI app.
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.55,
                margin: "0 0 16px",
              }}
            >
              GPay, PhonePe, Paytm, BHIM, your bank app — whichever
              one you usually use for UPI.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                <span
                  key={app}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Step 02 — THE NUMBER */}
          <div
            style={{
              padding: "28px 28px 32px",
              borderRadius: 20,
              background:
                "linear-gradient(135deg, rgba(201,162,78,0.14), rgba(198,40,40,0.08))",
              border: "1.5px solid rgba(201,162,78,0.45)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 48,
                color: "#E6C178",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            >
              02
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "white",
                margin: "0 0 16px",
              }}
            >
              Send the amount to this number.
            </h3>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#E6C178",
                marginBottom: 6,
              }}
            >
              UPI · Mobile number
            </div>
            <button
              onClick={copy}
              aria-label="Copy UPI number"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "inherit",
                marginBottom: 16,
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(230,193,120,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 30,
                  color: "#FAF5EB",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {UPI_NUMBER_DISPLAY}
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: copied ? "#7A9A7A" : "#E6C178",
                  padding: "6px 10px",
                  borderRadius: 4,
                  border: `1px solid ${copied ? "#7A9A7A" : "#E6C178"}`,
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? "Copied ✓" : "Tap to copy"}
              </span>
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(201,162,78,0.14)",
                  border: "1px solid rgba(201,162,78,0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#E6C178",
                    marginBottom: 2,
                  }}
                >
                  Early bird
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  ₹1,999
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 2,
                  }}
                >
                  Till May 10
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 2,
                  }}
                >
                  Regular
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  ₹2,499
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 2,
                  }}
                >
                  After May 10
                </div>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div
            style={{
              padding: "28px 28px 32px",
              borderRadius: 20,
              background: "rgba(37,211,102,0.06)",
              border: "1px solid rgba(37,211,102,0.25)",
            }}
          >
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 48,
                color: "#25D366",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            >
              03
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "white",
                margin: "0 0 10px",
              }}
            >
              WhatsApp the screenshot.
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.55,
                margin: "0 0 18px",
              }}
            >
              Send the UPI confirmation screenshot to Ehsan at
              +91 80899 41131. Seat confirmed the moment it&apos;s
              seen.
            </p>
            <a
              href={WA_CONFIRM}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                background: "#25D366",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.04em",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 10px 24px rgba(37,211,102,0.35)",
                transition: "transform .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send screenshot
            </a>
          </div>
        </div>

        {/* Reassurance strip */}
        <div
          style={{
            padding: "20px 28px",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.02)",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#7A9A7A",
              boxShadow: "0 0 0 4px rgba(122,154,122,0.22)",
            }}
          />
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.5,
            }}
          >
            Your seat isn&apos;t locked until I see the screenshot. 89 of
            150 seats taken so far — pay early, sleep easy.
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            — Ehsan
          </div>
        </div>
      </div>
    </section>
  );
}
