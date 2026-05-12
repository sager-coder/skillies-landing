"use client";

/**
 * /signin · sitewide tool sign-in (email OTP).
 *
 * Parallel to /login (which is the student phone+password page). Anything
 * that isn't course content — the niche finder, dropshipping finder,
 * future tools — bounces users here. After verifyOtp the Supabase session
 * cookie is set sitewide, so subsequent tools just pick up the session
 * and skip this page entirely.
 *
 * Two steps, both on the same page:
 *   1. Email → "Send code" → POST /api/auth/send-email-otp
 *   2. 6/8-digit code → "Verify" → supabase.auth.verifyOtp({ email, token,
 *      type: 'email' }) → router.push(next)
 *
 * No device-binding here — that's only for course content at /login. Tool
 * users can sign in from any browser without getting 403-locked.
 */
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wordmark, Grain } from "@/components/design/Primitives";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SigninShell({ children }: { children: React.ReactNode }) {
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

function SigninForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/tools";

  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // If already signed in (session cookie present), skip straight to next.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session?.access_token) {
          router.replace(next);
        }
      } catch {
        /* env vars missing → user just signs in normally */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, next]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (!EMAIL_RE.test(email)) {
      setErr("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        email?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Couldn't send code.");
      }
      setStep("verify");
      setInfo(`Code sent to ${email}. Check your inbox (and spam folder).`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (code.length < 4) {
      setErr("Enter the code from your email.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error) throw error;
      router.push(next);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Verification failed.");
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
        Sign in · tools
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
        {step === "request" ? (
          <>
            Continue with your{" "}
            <em style={{ fontStyle: "italic", color: "#C62828" }}>email.</em>
          </>
        ) : (
          <>
            Enter the{" "}
            <em style={{ fontStyle: "italic", color: "#C62828" }}>code</em> we sent.
          </>
        )}
      </h1>
      <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
        {step === "request"
          ? "Same email signs you in across every Skillies tool. New email? Your first search is free."
          : `Code sent to ${email}. Type it below to finish signing in.`}
      </p>

      {step === "request" && (
        <form onSubmit={onSend}>
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
            Email
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            disabled={busy}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 18,
              border: "1.5px solid #F0E8D8",
              borderRadius: 12,
              outline: "none",
              fontFamily: "ui-monospace, Menlo, monospace",
              color: "#1A1A1A",
              background: "#FAF5EB",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C62828")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#F0E8D8")}
          />
          {err && <ErrorBox text={err} />}
          <button
            type="submit"
            disabled={busy || !EMAIL_RE.test(email)}
            style={primaryBtn(busy, !EMAIL_RE.test(email))}
          >
            {busy ? "Sending code…" : "Send one-time code"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={onVerify}>
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
            Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
            }
            placeholder="••••••"
            disabled={busy}
            maxLength={10}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 22,
              letterSpacing: "0.4em",
              textAlign: "center",
              border: "1.5px solid #F0E8D8",
              borderRadius: 12,
              outline: "none",
              fontFamily: "ui-monospace, Menlo, monospace",
              color: "#1A1A1A",
              background: "#FAF5EB",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C62828")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#F0E8D8")}
          />
          {info && !err && <InfoBox text={info} />}
          {err && <ErrorBox text={err} />}
          <button
            type="submit"
            disabled={busy || code.length < 4}
            style={primaryBtn(busy, code.length < 4)}
          >
            {busy ? "Verifying…" : "Verify and continue"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setCode("");
              setErr(null);
              setInfo(null);
            }}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px",
              background: "transparent",
              border: "none",
              color: "#6B7280",
              fontSize: 13,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Use a different email
          </button>
        </form>
      )}

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
        Skillies School student?{" "}
        <a href="/login" style={{ color: "#C62828", fontWeight: 600 }}>
          Sign in with phone instead →
        </a>
      </div>
    </>
  );
}

function primaryBtn(busy: boolean, disabled: boolean): React.CSSProperties {
  return {
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
    opacity: disabled ? 0.5 : 1,
  };
}

function ErrorBox({ text }: { text: string }) {
  return (
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
      {text}
    </div>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 14px",
        background: "rgba(0,167,84,0.08)",
        border: "1px solid rgba(0,167,84,0.25)",
        borderRadius: 10,
        fontSize: 13,
        color: "#00a754",
        lineHeight: 1.45,
      }}
    >
      {text}
    </div>
  );
}

function SigninFallback() {
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

export default function SigninPage() {
  return (
    <SigninShell>
      <Suspense fallback={<SigninFallback />}>
        <SigninForm />
      </Suspense>
    </SigninShell>
  );
}
