"use client";

import React, { useState } from "react";
import Image from "next/image";
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
const UPI_VPA = "ehsansager@okhdfcbank";
const WA_CONFIRM =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27ve%20just%20paid%20for%20the%20Calicut%20workshop.%20Sending%20the%20screenshot%20now.%20My%20name%20is%20";

export default function PaymentDetails() {
  const [copiedField, setCopiedField] = useState<null | "number" | "vpa">(null);

  const copy = async (what: "number" | "vpa") => {
    try {
      const value = what === "number" ? UPI_NUMBER_DIGITS : UPI_VPA;
      await navigator.clipboard.writeText(value);
      setCopiedField(what);
      setTimeout(() => setCopiedField(null), 1500);
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

        {/* Two-column layout: QR card on left, steps on right */}
        <div
          className="skillies-pay-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 40,
            alignItems: "stretch",
          }}
        >
          {/* LEFT: QR + copy fields */}
          <div
            style={{
              padding: "36px 36px 32px",
              borderRadius: 22,
              background:
                "linear-gradient(135deg, rgba(201,162,78,0.14), rgba(198,40,40,0.06))",
              border: "1.5px solid rgba(201,162,78,0.45)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 90% 10%, rgba(230,193,120,0.15), transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="skillies-pay-inner"
              style={{ position: "relative", display: "flex", gap: 28 }}
            >
              {/* QR block */}
              <div
                style={{
                  flexShrink: 0,
                  width: 200,
                  padding: 14,
                  background: "white",
                  borderRadius: 16,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                }}
              >
                <Image
                  src="/gpay-qr.png"
                  alt="Google Pay / UPI QR code — scan to pay Ehsan Asgar"
                  width={400}
                  height={533}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                  }}
                  priority
                />
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#C62828",
                    textAlign: "center",
                  }}
                >
                  Scan to pay
                </div>
              </div>

              {/* Right side of the pay card: headline + fields */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#E6C178",
                    marginBottom: 8,
                  }}
                >
                  Pay to
                </div>
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 28,
                    fontStyle: "italic",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    margin: "0 0 6px",
                    color: "white",
                  }}
                >
                  Ehsan Asgar
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 18,
                  }}
                >
                  Account title: &ldquo;sager&rdquo; · GPay &amp; all UPI apps
                </div>

                {/* UPI VPA copy */}
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
                  UPI ID
                </div>
                <button
                  onClick={() => copy("vpa")}
                  aria-label="Copy UPI ID"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "inherit",
                    marginBottom: 12,
                    transition: "border-color .2s",
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
                      fontFamily: "ui-monospace, Menlo, monospace",
                      fontSize: 14,
                      color: "#FAF5EB",
                      letterSpacing: "-0.005em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {UPI_VPA}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: copiedField === "vpa" ? "#7A9A7A" : "#E6C178",
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: `1px solid ${copiedField === "vpa" ? "#7A9A7A" : "#E6C178"}`,
                      whiteSpace: "nowrap",
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  >
                    {copiedField === "vpa" ? "Copied ✓" : "Copy"}
                  </span>
                </button>

                {/* Mobile number copy */}
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
                  Or mobile
                </div>
                <button
                  onClick={() => copy("number")}
                  aria-label="Copy mobile number"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "inherit",
                    marginBottom: 16,
                    transition: "border-color .2s",
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
                      fontFamily: "ui-monospace, Menlo, monospace",
                      fontSize: 14,
                      color: "#FAF5EB",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {UPI_NUMBER_DISPLAY}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: copiedField === "number" ? "#7A9A7A" : "#E6C178",
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: `1px solid ${copiedField === "number" ? "#7A9A7A" : "#E6C178"}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copiedField === "number" ? "Copied ✓" : "Copy"}
                  </span>
                </button>

                {/* Pricing chips */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginTop: "auto",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "rgba(201,162,78,0.16)",
                      border: "1px solid rgba(201,162,78,0.32)",
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
                        fontSize: 20,
                        fontWeight: 900,
                        color: "white",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                      }}
                    >
                      ₹1,999
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.5)",
                        marginTop: 3,
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
                        fontSize: 20,
                        fontWeight: 900,
                        color: "white",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                      }}
                    >
                      ₹2,499
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.5)",
                        marginTop: 3,
                      }}
                    >
                      After May 10
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: the three numbered steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Step 01 */}
            <div
              style={{
                padding: "22px 24px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  color: "#7A9A7A",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  flexShrink: 0,
                  minWidth: 42,
                }}
              >
                01
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "white",
                    margin: "0 0 6px",
                  }}
                >
                  Open any UPI app.
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.55,
                    margin: "0 0 10px",
                  }}
                >
                  GPay, PhonePe, Paytm, BHIM — any app that handles UPI.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                    <span
                      key={app}
                      style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div
              style={{
                padding: "22px 24px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  color: "#E6C178",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  flexShrink: 0,
                  minWidth: 42,
                }}
              >
                02
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "white",
                    margin: "0 0 6px",
                  }}
                >
                  Scan, or paste the UPI ID.
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Either the QR on the left or the <code style={{ fontFamily: "ui-monospace, Menlo, monospace", color: "#E6C178", background: "rgba(201,162,78,0.12)", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>{UPI_VPA}</code> UPI ID. Amount: ₹1,999 early bird (till May 10) or ₹2,499 regular.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div
              style={{
                padding: "22px 24px",
                borderRadius: 18,
                background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.28)",
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  color: "#25D366",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  flexShrink: 0,
                  minWidth: 42,
                }}
              >
                03
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "white",
                    margin: "0 0 6px",
                  }}
                >
                  WhatsApp the screenshot.
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.55,
                    margin: "0 0 12px",
                  }}
                >
                  Send the payment screenshot to Ehsan at +91 80899 41131. Seat confirmed the moment it’s seen.
                </p>
                <a
                  href={WA_CONFIRM}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    background: "#25D366",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    borderRadius: 999,
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(37,211,102,0.35)",
                    transition: "transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send screenshot
                </a>
              </div>
            </div>
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
            Your seat isn’t locked until I see the screenshot. 89 of
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
