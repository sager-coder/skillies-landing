"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark, Grain } from "@/components/design/Primitives";

function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 85% 10%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(201,162,78,0.16), transparent 60%), #FAF5EB",
        position: "relative",
        display: "grid",
        placeItems: "center",
        padding: "60px 24px",
      }}
    >
      <Grain opacity={0.06} />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          padding: 32,
          background: "white",
          borderRadius: 24,
          border: "1px solid rgba(26,26,26,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.10)",
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <Wordmark size={20} />
        </a>
        {children}
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/learn";

  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length < 10) {
        setErr("Enter a valid phone number with country code (e.g. 91…).");
        setBusy(false);
        return;
      }
      const e164 = cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: { channel: "sms" },
      });
      if (error) throw error;

      router.push(`/login/verify?phone=${encodeURIComponent(e164)}&next=${encodeURIComponent(next)}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Try again.";
      if (msg.toLowerCase().includes("sms provider")) {
        setErr("SMS provider not configured yet. WhatsApp Ehsan to get manual access while we activate.");
      } else {
        setErr(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: 28,
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#C62828",
        }}
      >
        Sign in · Founding batch
      </div>
      <h1
        style={{
          margin: "10px 0 8px",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(36px, 5vw, 52px)",
          letterSpacing: "-0.02em",
          color: "#1A1A1A",
          lineHeight: 1.05,
        }}
      >
        Enter your <em style={{ fontStyle: "italic", color: "#C62828" }}>WhatsApp number.</em>
      </h1>
      <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
        We&apos;ll text you a one-time code. The number you used to enrol with Ehsan.
      </p>

      <form onSubmit={onSubmit}>
        <label
          style={{
            display: "block",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
        >
          Phone number
        </label>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 80899 41131"
          disabled={busy}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: 18,
            border: "1.5px solid #F0E8D8",
            borderRadius: 12,
            outline: "none",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontVariantNumeric: "tabular-nums",
            color: "#1A1A1A",
            background: "#FAF5EB",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#C62828")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#F0E8D8")}
        />

        {err && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "rgba(198,40,40,0.08)",
              border: "1px solid rgba(198,40,40,0.25)",
              borderRadius: 10,
              fontSize: 13,
              color: "#C62828",
              lineHeight: 1.45,
            }}
          >
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || phone.length < 6}
          style={{
            width: "100%",
            marginTop: 18,
            padding: "14px 24px",
            background: busy ? "#8B1A1A" : "#C62828",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            borderRadius: 999,
            cursor: busy ? "wait" : "pointer",
            boxShadow: "0 12px 30px rgba(198,40,40,0.22)",
            opacity: phone.length < 6 ? 0.5 : 1,
          }}
        >
          {busy ? "Sending code…" : "Send one-time code"}
        </button>
      </form>

      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px dashed rgba(26,26,26,0.10)",
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.6,
        }}
      >
        Not enrolled yet?{" "}
        <a
          href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20enrol%20in%20the%2050-day%20program.%20My%20name%20is%20"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#C62828", fontWeight: 600 }}
        >
          WhatsApp Ehsan →
        </a>
      </div>
    </>
  );
}

function LoginFallback() {
  return (
    <>
      <div style={{ marginTop: 28, height: 14 }} />
      <div
        style={{
          height: 56,
          background: "rgba(26,26,26,0.04)",
          borderRadius: 8,
          marginTop: 12,
        }}
      />
      <div
        style={{
          height: 56,
          background: "rgba(26,26,26,0.04)",
          borderRadius: 12,
          marginTop: 28,
        }}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <LoginShell>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </LoginShell>
  );
}
