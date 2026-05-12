"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wordmark, Grain } from "@/components/design/Primitives";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * /login — sitewide sign-in (email OTP only).
 *
 * One auth surface for everything on skillies.ai: students hitting course
 * content, tool users hitting the niche finder, admins. All sign in with
 * email, all get verified via Supabase email OTP sent through our Resend
 * SMTP (mail.skillies.ai → Skillies-branded subject + sender).
 *
 * After verifyOtp succeeds, `claimDeviceAndRedirect` runs the device-claim
 * call (currently a no-op on the server — one-device enforcement is
 * disabled — but the call path is kept so re-enabling it later only needs
 * a server-side toggle) and resolves the role-aware destination.
 *
 * Phone + password is gone. Existing phone-only Supabase users need an
 * email added to their profile before they can sign in here; admin can do
 * that one-time in the Supabase dashboard.
 */

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  // next may be null — claimDeviceAndRedirect resolves a role-aware
  // default (/admin for admins, /student otherwise) when missing.
  const next = params.get("next");

  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Already signed in (Supabase session cookie present)? Skip the form
  // entirely and run the same post-auth path the verify step would.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session?.access_token) {
          await claimDeviceAndRedirect(next, router);
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
      // Bind the device cookie + redirect (role-aware destination).
      // Same post-auth path the old phone+password flow used.
      await claimDeviceAndRedirect(next, router);
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
        Sign in
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
          ? "Same email signs you in across every Skillies tool and course. New email? Your first search is free."
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
    </>
  );
}

/**
 * After a successful sign-in (any path), this binds the device cookie
 * and resolves the role-aware default destination. Centralised so the
 * password and dev-admin paths share exactly the same post-auth logic.
 */
async function claimDeviceAndRedirect(
  rawNext: string | null,
  router: ReturnType<typeof useRouter>,
): Promise<void> {
  // Device id is per-browser; persistent so subsequent logins from the
  // same browser stay bound to the same device.
  let deviceId: string | null = null;
  try {
    deviceId = window.localStorage.getItem("skillies_device_id");
    if (!deviceId) {
      deviceId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
      window.localStorage.setItem("skillies_device_id", deviceId);
    }
  } catch {
    deviceId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
  }
  // Best-effort device-claim. The endpoint is currently a no-op (one-
  // device enforcement is disabled), so we never expect a 403 here.
  // Kept so the cookie still gets stamped and the call path stays in
  // place for an easy future re-enable.
  await fetch("/api/auth/claim-device", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ deviceId }),
  }).catch(() => {});

  // Destination resolution chain (most specific → least):
  //   1. ?next= param passed to /login from a tool's "Sign in with email"
  //      button or a course gate.
  //   2. document.referrer if it's same-origin and not the login page
  //      itself — sends the user back to whatever page they were on when
  //      they clicked Sign In in the top nav.
  //   3. Role-aware default: /admin for admins, /student otherwise.
  let destination: string | null = rawNext;
  if (!destination && typeof window !== "undefined") {
    const ref = document.referrer;
    if (
      ref &&
      ref.startsWith(window.location.origin) &&
      !ref.includes("/login") &&
      !ref.includes("/signup")
    ) {
      destination = ref.slice(window.location.origin.length) || "/";
    }
  }
  if (!destination) {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      destination = profile?.is_admin ? "/admin" : "/student";
    } else {
      destination = "/student";
    }
  }
  router.push(destination);
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
        marginTop: 14,
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
        marginTop: 14,
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

function LoginFallback() {
  return (
    <>
      <div style={{ marginTop: 28, height: 14 }} />
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            height: 56,
            background: "rgba(26,26,26,0.04)",
            borderRadius: 12,
            marginTop: 12,
          }}
        />
      ))}
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

export default function LoginPage() {
  return (
    <LoginShell>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </LoginShell>
  );
}
