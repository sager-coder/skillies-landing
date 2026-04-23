"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { DEFAULT_WORKSHOP, type Workshop } from "./workshops";

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
};

type RazorpayWindow = Window & {
  Razorpay?: new (opts: unknown) => {
    open: () => void;
    on: (event: string, handler: (err: unknown) => void) => void;
  };
  // Meta Pixel — the base script in MetaPixel.tsx creates window.fbq if
  // NEXT_PUBLIC_META_PIXEL_ID is set. Absent-pixel case: fbq is undefined
  // and we silently skip the events.
  fbq?: (...args: unknown[]) => void;
};

// Pull UTM tags + referrer out of the current window location. Only used on
// the client. Server ignores missing values gracefully.
function readUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    const p = new URL(window.location.href).searchParams;
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = p.get(key);
      if (v) out[key] = v;
    }
    if (document.referrer) out.referrer = document.referrer.slice(0, 128);
  } catch {
    /* malformed URL — fine, just no UTMs */
  }
  return out;
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const w = window as RazorpayWindow;
  if (w.Razorpay) return true;
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * WorkshopReserveButton — online checkout for the 4-city Kerala workshop
 * tour. Takes a `workshop` (the specific Malappuram/Calicut/Kochi date) so
 * the Razorpay order notes + printed ticket reflect exactly which seat was
 * bought. This doesn't create a /learn enrollment — the workshop is
 * physical, so the webhook just acknowledges payment and Ehsan (or the
 * sales lead) confirms on WhatsApp.
 */
export default function WorkshopReserveButton({
  tier = "workshop-early",
  priceLabel = "₹999",
  label = "Reserve seat · ₹999",
  variant = "filled",
  workshop = DEFAULT_WORKSHOP,
}: {
  tier?: "workshop-early" | "workshop-regular" | "workshop-vip";
  priceLabel?: string;
  label?: string;
  variant?: "filled" | "outline";
  workshop?: Workshop;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [receipt, setReceipt] = useState<{
    name: string;
    phone: string;
    email: string;
    paymentId: string;
    priceLabel: string;
    workshop: Workshop;
  } | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setErr(null);
    setDone(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!name.trim()) {
      setErr("Please enter your name.");
      return;
    }
    if (cleanedPhone.length < 10) {
      setErr("Please enter a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const isTestRun =
        typeof window !== "undefined" &&
        new URL(window.location.href).searchParams.get("test") === "1";
      // Fire Meta Pixel InitiateCheckout — signal the moment the buyer
      // commits to the reservation modal. Safe no-op if Pixel isn't wired.
      const w = window as RazorpayWindow;
      if (typeof w.fbq === "function") {
        w.fbq("track", "InitiateCheckout", {
          content_name: `${workshop.cityShort} Workshop · ${workshop.dateShort}`,
          content_category: "workshop",
          content_ids: [workshop.id],
          currency: "INR",
          value:
            tier === "workshop-vip"
              ? 2999
              : tier === "workshop-regular"
                ? 1999
                : 999,
        });
      }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone,
          full_name: name,
          email,
          // Route the workshop id through the `course` field so Razorpay's
          // order notes carry the city + date. That's what the admin + any
          // future reporting query groups by.
          course: workshop.id,
          tier,
          ...readUtms(),
          ...(isTestRun ? { amount: 100 } : {}),
        }),
      });
      const orderData = (await orderRes.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Couldn't create order.");
      }
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Couldn't load Razorpay.");
      if (!w.Razorpay) throw new Error("Razorpay failed to initialise.");

      const rzp = new w.Razorpay({
        key: orderData.keyId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Skillies.AI",
        description: `${workshop.cityShort} Workshop · ${workshop.dateShort}`,
        image: "/favicon.ico",
        prefill: { name, contact: phone, email },
        theme: { color: "#C62828" },
        modal: {
          ondismiss: () => setBusy(false),
        },
        handler: (r: RazorpayHandlerResponse) => {
          // Fire Meta Pixel Purchase — the conversion event Meta's ML
          // optimises against. Without this, ad spend is blind.
          if (typeof w.fbq === "function") {
            const valueInr =
              tier === "workshop-vip"
                ? 2999
                : tier === "workshop-regular"
                  ? 1999
                  : 999;
            w.fbq("track", "Purchase", {
              content_name: `${workshop.cityShort} Workshop · ${workshop.dateShort}`,
              content_category: "workshop",
              content_ids: [workshop.id],
              currency: "INR",
              value: valueInr,
              order_id: r.razorpay_order_id,
            });
          }
          setReceipt({
            name,
            phone,
            email,
            paymentId: r.razorpay_payment_id,
            priceLabel,
            workshop,
          });
          setBusy(false);
          setDone(true);
        },
      });
      rzp.on("payment.failed", (ev: unknown) => {
        const msg =
          (ev as { error?: { description?: string } })?.error?.description ||
          "Payment failed. No money was taken.";
        setErr(msg);
        setBusy(false);
      });
      rzp.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setErr(msg);
      setBusy(false);
    }
  };

  const btnStyle: React.CSSProperties =
    variant === "filled"
      ? {
          padding: "16px 28px",
          background: "#C62828",
          color: "white",
          fontWeight: 700,
          fontSize: 16,
          borderRadius: 999,
          border: "none",
          boxShadow: "0 16px 36px rgba(198,40,40,0.25)",
          cursor: "pointer",
        }
      : {
          padding: "14px 26px",
          background: "transparent",
          color: "#1A1A1A",
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 999,
          border: "1.5px solid rgba(26,26,26,0.20)",
          cursor: "pointer",
        };

  // Magnetic hover — the outer reserve button gently drifts toward the
  // cursor when you hover it. Inline here (rather than through the shared
  // MagneticButton component) because this button also owns the modal-
  // open side-effect and the branded `btnStyle`; mixing wrappers with
  // existing styles + event state was getting noisy.
  const ctaRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 170, damping: 18, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 170, damping: 18, mass: 0.4 });
  const onCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ctaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const strength = 10; // 10px max drift — subtle
    mx.set(((e.clientX - cx) / (rect.width / 2)) * strength);
    my.set(((e.clientY - cy) / (rect.height / 2)) * strength);
  };
  const onCtaMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <>
      <motion.button
        ref={ctaRef}
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        onMouseMove={onCtaMouseMove}
        onMouseLeave={onCtaMouseLeave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ ...btnStyle, x: smx, y: smy }}
      >
        {label}
      </motion.button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reserve-title"
          onClick={() => !busy && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(26,26,26,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 18,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 440,
              background: "white",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 40px 120px rgba(0,0,0,0.3)",
              color: "#1A1A1A",
            }}
          >
            {done && receipt ? (
              <Ticket
                receipt={receipt}
                onClose={() => setOpen(false)}
              />
            ) : (
              <form onSubmit={submit}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#C62828",
                    marginBottom: 8,
                  }}
                >
                  Reserve · {workshop.cityShort} workshop
                </div>
                <h2
                  id="reserve-title"
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 30,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.1,
                  }}
                >
                  {priceLabel} · {workshop.dateShort}
                </h2>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.55,
                  }}
                >
                  Payment is processed by our partner <b>PageBoo</b> on
                  Razorpay — that&rsquo;s the name on your card / UPI receipt.
                  Your seat is for <b>Skillies.AI · {workshop.city}, {workshop.dateShort}</b>.
                </p>

                <label style={labelStyle}>Your name</label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  style={inputStyle}
                />

                <label style={labelStyle}>WhatsApp number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 80899 41131"
                  autoComplete="tel"
                  style={inputStyle}
                />

                <label style={labelStyle}>Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  style={inputStyle}
                />

                {err && (
                  <div
                    style={{
                      margin: "6px 0 10px",
                      padding: "10px 12px",
                      background: "rgba(198,40,40,0.08)",
                      border: "1px solid rgba(198,40,40,0.25)",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#8B1A1A",
                      lineHeight: 1.4,
                    }}
                  >
                    {err}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={busy}
                    style={{
                      padding: "12px 20px",
                      background: "transparent",
                      border: "1px solid rgba(26,26,26,0.18)",
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#6B7280",
                      cursor: busy ? "wait" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      background: busy ? "#8B1A1A" : "#C62828",
                      color: "white",
                      border: "none",
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: busy ? "wait" : "pointer",
                      boxShadow: "0 12px 28px rgba(198,40,40,0.22)",
                    }}
                  >
                    {busy ? "Opening Razorpay…" : `Pay ${priceLabel}`}
                  </button>
                </div>

                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: 11,
                    color: "#9CA3AF",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Secured by Razorpay · UPI, cards, netbanking
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Ticket({
  receipt,
  onClose,
}: {
  receipt: {
    name: string;
    phone: string;
    email: string;
    paymentId: string;
    priceLabel: string;
    workshop: Workshop;
  };
  onClose: () => void;
}) {
  const paymentShort = receipt.paymentId.slice(-8).toUpperCase();
  const groupUrl = process.env.NEXT_PUBLIC_WORKSHOP_WA_GROUP_URL || "";
  return (
    <div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          background: "rgba(91,123,91,0.14)",
          color: "#3D5A3D",
          display: "grid",
          placeItems: "center",
          marginBottom: 10,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2
        style={{
          margin: "0 0 4px",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontSize: 28,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        Seat reserved.
      </h2>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.55,
        }}
      >
        {receipt.priceLabel} received. Here&rsquo;s your ticket — bring it to
        the venue on {receipt.workshop.dateShort}. A Razorpay receipt is also
        on its way to your email.
      </p>

      {/* Primary next-step: the cohort WhatsApp group, if configured */}
      {groupUrl && (
        <a
          href={groupUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "12px 16px",
            background: "#25D366",
            color: "white",
            textDecoration: "none",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.01em",
            marginBottom: 14,
            boxShadow: "0 10px 26px rgba(37,211,102,0.25)",
          }}
        >
          <span>Join the WhatsApp group · {receipt.workshop.dateShort} attendees</span>
          <span aria-hidden>↗</span>
        </a>
      )}

      {/* Ticket card — this is what prints */}
      <div
        id="skillies-workshop-ticket"
        style={{
          position: "relative",
          padding: "20px 22px 22px",
          borderRadius: 14,
          background:
            "linear-gradient(135deg, #FAF5EB 0%, #FFFFFF 50%, #F7EED3 100%)",
          border: "1.5px dashed rgba(26,26,26,0.25)",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        {/* Perforation dots, left */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "white",
            border: "1px solid rgba(26,26,26,0.15)",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "white",
            border: "1px solid rgba(26,26,26,0.15)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 900,
              color: "#C62828",
            }}
          >
            SKILLIES<span style={{ color: "#1A1A1A" }}>.AI</span> · TICKET
          </div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "#9CA3AF",
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            #{paymentShort}
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 22,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            color: "#1A1A1A",
            marginBottom: 2,
          }}
        >
          The KDP Workshop{" "}
          <em style={{ fontStyle: "italic", color: "#C62828" }}>
            · {receipt.workshop.cityShort}
          </em>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 14,
          }}
        >
          {receipt.workshop.dateLong} · {receipt.workshop.city}, Kerala
        </div>

        <div
          style={{
            borderTop: "1px dashed rgba(26,26,26,0.15)",
            paddingTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            fontSize: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#9CA3AF",
                marginBottom: 4,
              }}
            >
              Attendee
            </div>
            <div style={{ fontWeight: 600, color: "#1A1A1A" }}>
              {receipt.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#6B7280",
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              {receipt.phone}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#9CA3AF",
                marginBottom: 4,
              }}
            >
              Paid
            </div>
            <div style={{ fontWeight: 600, color: "#1A1A1A" }}>
              {receipt.priceLabel}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#5B7B5B",
                fontWeight: 600,
              }}
            >
              Confirmed ✓
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px dashed rgba(26,26,26,0.15)",
            fontSize: 11,
            color: "#6B7280",
            lineHeight: 1.5,
          }}
        >
          Present this ticket at entry. Venue address + what-to-bring will
          be posted in the WhatsApp group above. Questions? +91 80899 41131.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            flex: 1,
            padding: "13px 20px",
            background: "#1A1A1A",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Download / Print ticket
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "13px 20px",
            background: "transparent",
            border: "1px solid rgba(26,26,26,0.18)",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            color: "#6B7280",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#9CA3AF",
  margin: "10px 0 6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 15,
  border: "1.5px solid #F0E8D8",
  borderRadius: 12,
  outline: "none",
  background: "#FAF5EB",
  color: "#1A1A1A",
  fontFamily: "inherit",
  marginBottom: 4,
};
