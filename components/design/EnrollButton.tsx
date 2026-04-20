"use client";

import React, { useEffect, useRef, useState } from "react";

type Tier = "founding" | "standard" | "pro";

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayWindow = Window & {
  Razorpay?: new (opts: unknown) => {
    open: () => void;
    close: () => void;
    on: (event: string, handler: (err: unknown) => void) => void;
  };
};

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

export default function EnrollButton({
  course = "kdp-mastery",
  tier,
  label,
  priceLabel,
  variant = "filled",
}: {
  course?: string;
  tier: Tier;
  label: string;
  priceLabel: string;
  variant?: "filled" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
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
      // `?test=1` in the URL swaps the tier price for a ₹1 charge so we
      // can smoke-test the live Razorpay → webhook → Supabase-enrollment
      // path end-to-end without moving real money. Everyone else pays the
      // server-side tier price.
      const isTestRun =
        typeof window !== "undefined" &&
        new URL(window.location.href).searchParams.get("test") === "1";
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone,
          full_name: name,
          email,
          course,
          tier,
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
        throw new Error(orderData.error || "Couldn't create payment order.");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Couldn't load Razorpay. Check your connection.");
      }
      const w = window as RazorpayWindow;
      if (!w.Razorpay) throw new Error("Razorpay failed to initialise.");

      const rzp = new w.Razorpay({
        key: orderData.keyId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Skillies.AI",
        description: `${tier === "pro" ? "KDP Mastery · Pro" : tier === "founding" ? "KDP Mastery · Founding" : "KDP Mastery · Standard"}`,
        image: "/favicon.ico",
        prefill: {
          name,
          contact: phone,
          email,
        },
        theme: { color: "#C62828" },
        modal: {
          ondismiss: () => setBusy(false),
        },
        handler: (_response: RazorpayHandlerResponse) => {
          // Payment captured. The webhook does the actual enrollment;
          // we just show a friendly success state.
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
          padding: "14px 26px",
          background: "#C62828",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
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

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        style={btnStyle}
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-title"
          onClick={() => !busy && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(26,26,26,0.45)",
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
            }}
          >
            {done ? (
              <SuccessPanel priceLabel={priceLabel} onClose={() => setOpen(false)} />
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
                  Enroll · {tier === "pro" ? "Pro" : "Standard"}
                </div>
                <h2
                  id="enroll-title"
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 28,
                    letterSpacing: "-0.015em",
                    color: "#1A1A1A",
                    lineHeight: 1.1,
                  }}
                >
                  {priceLabel}
                </h2>
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.55,
                  }}
                >
                  Payment is processed by our partner <b>PageBoo</b> on
                  Razorpay — that&rsquo;s the name on your card / UPI receipt.
                  Your course is <b>Skillies.AI</b>.
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
                      flex: "0 0 auto",
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
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  Secured by Razorpay · 256-bit SSL · UPI, cards, netbanking
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SuccessPanel({
  priceLabel,
  onClose,
}: {
  priceLabel: string;
  onClose: () => void;
}) {
  const cohortGroup = process.env.NEXT_PUBLIC_PROGRAM_WA_GROUP_URL || "";
  return (
    <div>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "rgba(91,123,91,0.14)",
          color: "#3D5A3D",
          display: "grid",
          placeItems: "center",
          margin: "0 0 14px",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2
        style={{
          margin: "0 0 6px",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontSize: 32,
          letterSpacing: "-0.02em",
          color: "#1A1A1A",
          lineHeight: 1.1,
        }}
      >
        You&rsquo;re in.
      </h2>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 1.6,
        }}
      >
        Payment of {priceLabel} received. You&rsquo;re enrolled in KDP
        Mastery. Sign in with the same phone number — you&rsquo;ll get a
        one-time code, then you&rsquo;re straight in.
      </p>

      {cohortGroup && (
        <a
          href={cohortGroup}
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
          <span>Join the cohort WhatsApp group</span>
          <span aria-hidden>↗</span>
        </a>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <a
          href="/login"
          style={{
            flex: 1,
            padding: "13px 20px",
            background: "#1A1A1A",
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          Sign in now →
        </a>
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
