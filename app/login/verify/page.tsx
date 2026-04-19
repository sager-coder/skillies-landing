"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark, Grain } from "@/components/design/Primitives";

function VerifyShell({ children }: { children: React.ReactNode }) {
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

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const next = params.get("next") || "/learn";

  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (code.length < 6) return;
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
      });
      if (error) throw error;
      // Enforce single-device access: kick out every prior session on other
      // devices. The old device's refresh token is revoked; its access token
      // dies on its own (≤1h), at which point it redirects to /login.
      await supabase.auth.signOut({ scope: "others" });
      router.push(next);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed.";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setErr(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel: "sms" },
      });
      if (error) throw error;
      setResendCooldown(30);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Couldn't resend code.";
      setErr(msg);
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
        One-time code · sent to {phone || "your phone"}
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
        Enter the <em style={{ fontStyle: "italic", color: "#C62828" }}>6-digit code.</em>
      </h1>
      <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
        Just sent it to your WhatsApp number. Takes 10–30 seconds.
      </p>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          disabled={busy}
          maxLength={6}
          style={{
            width: "100%",
            padding: "18px 16px",
            fontSize: 32,
            border: "1.5px solid #F0E8D8",
            borderRadius: 12,
            outline: "none",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.4em",
            textAlign: "center",
            color: "#1A1A1A",
            background: "#FAF5EB",
            fontWeight: 700,
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
          disabled={busy || code.length < 6}
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
            opacity: code.length < 6 ? 0.5 : 1,
          }}
        >
          {busy ? "Verifying…" : "Verify and continue"}
        </button>
      </form>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          color: "#6B7280",
        }}
      >
        <a
          href="/login"
          style={{ color: "#6B7280", textDecoration: "underline", textDecorationThickness: 1 }}
        >
          ← Use a different number
        </a>
        {resendCooldown > 0 ? (
          <span>Resend in {resendCooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            style={{
              background: "none",
              border: "none",
              color: "#C62828",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
            }}
          >
            Resend code
          </button>
        )}
      </div>
    </>
  );
}

function VerifyFallback() {
  return (
    <>
      <div style={{ marginTop: 28, height: 14 }} />
      <div
        style={{
          height: 72,
          background: "rgba(26,26,26,0.04)",
          borderRadius: 12,
          marginTop: 28,
        }}
      />
      <div
        style={{
          height: 56,
          background: "rgba(26,26,26,0.04)",
          borderRadius: 999,
          marginTop: 18,
        }}
      />
    </>
  );
}

export default function VerifyPage() {
  return (
    <VerifyShell>
      <Suspense fallback={<VerifyFallback />}>
        <VerifyForm />
      </Suspense>
    </VerifyShell>
  );
}
