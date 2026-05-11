"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/country-codes";

/**
 * Two-step signup form:
 *   Step 1 — collect name + email + phone + password, send OTP via
 *            Supabase signUp({phone, password, options: { data }}).
 *   Step 2 — collect 6-digit OTP, verify with verifyOtp({type:'signup'}).
 *            On success Supabase issues a session; we then sync the
 *            profile row (first_name, last_name, email) and redirect.
 *
 * Validation is local and on the Supabase side. We never persist any
 * data client-side beyond React state.
 */
type Step = "form" | "otp";

const PASSWORD_MIN = 8;
const NAME_MAX = 60;

/**
 * DEV-ONLY: entering this OTP in step 2 bypasses real SMS verification.
 * Server-side `/api/dev/verify-signup-otp` enforces the same value AND
 * the NODE_ENV check, so a leaked client constant can't be used in prod.
 */
const DEV_SECRET_OTP = "878790";

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get("next");

  const [step, setStep] = useState<Step>("form");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [national, setNational] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP step state
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) || DEFAULT_COUNTRY;
  const fullPhone = selectedCountry.dial + national;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  /** Local validation, returns an error string or null. */
  const validateForm = (): string | null => {
    if (!firstName.trim()) return "First name is required.";
    if (firstName.length > NAME_MAX) return "First name too long.";
    if (lastName.length > NAME_MAX) return "Last name too long.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email.";
    }
    if (national.length < 6) return "Enter a valid phone number.";
    if (password.length < PASSWORD_MIN) {
      return `Password must be at least ${PASSWORD_MIN} characters.`;
    }
    return null;
  };

  /** Step 1 → Step 2: create the (unconfirmed) auth user, OTP gets sent. */
  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const v = validateForm();
    if (v) {
      setErr(v);
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const f = firstName.trim();
      const l = lastName.trim();
      const { error } = await supabase.auth.signUp({
        phone: fullPhone,
        password,
        options: {
          channel: "sms",
          data: {
            first_name: f,
            last_name: l || null,
            full_name: [f, l].filter(Boolean).join(" "),
            email: email.trim(),
          },
        },
      });
      if (error) throw error;
      setStep("otp");
      setResendCooldown(30);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Couldn't create account.";
      // Friendlier wording for the most common case
      if (/already.*(register|exists)/i.test(msg)) {
        setErr(
          "This phone number already has an account. Sign in instead, or use a different number.",
        );
      } else {
        setErr(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  /** Step 2 → finished: verify the OTP, sync profile fields, redirect. */
  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (code.length !== 6) return;
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      let user;

      // Dev-only secret OTP path. Server route enforces NODE_ENV too,
      // so this branch is dead code in production builds.
      if (
        process.env.NODE_ENV === "development" &&
        code === DEV_SECRET_OTP
      ) {
        const devRes = await fetch("/api/dev/verify-signup-otp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone: fullPhone, otp: code }),
        });
        const devJson = (await devRes.json()) as {
          ok?: boolean;
          error?: string;
        };
        if (!devRes.ok || !devJson.ok) {
          throw new Error(devJson.error || "Dev OTP verify failed.");
        }
        // Phone is now confirmed — sign in with the password chosen in
        // step 1 to obtain a session.
        const { error: signInErr, data: signInData } =
          await supabase.auth.signInWithPassword({
            phone: fullPhone,
            password,
          });
        if (signInErr) throw signInErr;
        user = signInData.user;
      } else {
        const { error: verErr, data: verData } = await supabase.auth.verifyOtp({
          phone: fullPhone,
          token: code,
          type: "sms",
        });
        if (verErr) throw verErr;
        user = verData.user;
      }

      if (!user) throw new Error("Verification didn't return a session.");

      // Sync the profile row via a server endpoint that uses the
      // service-role — bypasses RLS and any cookie-propagation race
      // that would silently drop a direct browser-client update.
      const completeRes = await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        }),
      });
      if (!completeRes.ok) {
        const j = (await completeRes.json().catch(() => ({}))) as {
          error?: string;
        };
        // Non-fatal — the user is signed in, they can fix their
        // profile manually at /student/profile. We surface the error
        // so it's visible.
        console.warn("complete-signup failed:", j.error);
      }

      // Bind the device, just like the OTP login flow does.
      try {
        let deviceId =
          typeof window !== "undefined"
            ? window.localStorage.getItem("skillies_device_id")
            : null;
        if (!deviceId && typeof window !== "undefined") {
          deviceId =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
          window.localStorage.setItem("skillies_device_id", deviceId);
        }
        if (deviceId) {
          await fetch("/api/auth/claim-device", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ deviceId }),
          });
        }
      } catch {
        /* non-fatal — device claim is currently a no-op anyway */
      }

      router.push(rawNext || "/student");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed.";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setErr(null);
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      // resend can be used after signUp to send a fresh OTP without
      // recreating the user.
      const { error } = await supabase.auth.resend({
        type: "sms",
        phone: fullPhone,
      });
      if (error) throw error;
      setResendCooldown(30);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Couldn't resend.");
    } finally {
      setBusy(false);
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={onVerify}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginTop: 28,
          }}
        >
          Verify your number
        </div>
        <h1
          style={{
            margin: "10px 0 8px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(34px, 5vw, 48px)",
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            lineHeight: 1.05,
          }}
        >
          Enter the <em style={{ color: "#C62828" }}>6-digit code.</em>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#6B7280",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          Sent to <b style={{ color: "#1A1A1A" }}>{fullPhone}</b>. Takes 10–30 seconds.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "rgba(91,123,91,0.10)",
              border: "1px solid rgba(91,123,91,0.35)",
              borderRadius: 10,
              fontSize: 12,
              color: "#3D5A3D",
              lineHeight: 1.45,
            }}
          >
            🛠 <b>Dev mode:</b> the OTP <code style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700 }}>878790</code> is accepted for any phone, bypassing Twilio. Production builds reject it.
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          disabled={busy}
          maxLength={6}
          autoFocus
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

        {err && <ErrorBox>{err}</ErrorBox>}

        <button
          type="submit"
          disabled={busy || code.length < 6}
          style={primaryButton(busy, code.length < 6)}
        >
          {busy ? "Verifying…" : "Verify and create account"}
        </button>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setErr(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6B7280",
              textDecoration: "underline",
              textDecorationThickness: 1,
              cursor: "pointer",
              padding: 0,
              fontSize: 13,
            }}
          >
            ← Edit details
          </button>
          {resendCooldown > 0 ? (
            <span>Resend in {resendCooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={busy}
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
      </form>
    );
  }

  // step === "form"
  return (
    <form onSubmit={onSubmitForm}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#C62828",
          marginTop: 28,
        }}
      >
        Create your account
      </div>
      <h1
        style={{
          margin: "10px 0 8px",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(34px, 5vw, 48px)",
          letterSpacing: "-0.02em",
          color: "#1A1A1A",
          lineHeight: 1.05,
        }}
      >
        Welcome to <em style={{ color: "#C62828" }}>Skillies.</em>
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "#6B7280",
          margin: "0 0 22px",
          lineHeight: 1.6,
        }}
      >
        Already have an account?{" "}
        <a
          href={`/login${rawNext ? `?next=${encodeURIComponent(rawNext)}` : ""}`}
          style={{ color: "#C62828", fontWeight: 600 }}
        >
          Sign in →
        </a>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <Field label="First name *">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            required
            maxLength={NAME_MAX}
            style={inputStyle}
          />
        </Field>
        <Field label="Last name">
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            maxLength={NAME_MAX}
            style={inputStyle}
          />
        </Field>
      </div>

      <Spacer />

      <Field label="Email *">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          style={inputStyle}
        />
      </Field>

      <Spacer />

      <Field label="Phone (WhatsApp) *">
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <div
              style={{
                ...inputStyle,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingRight: 30,
              }}
            >
              <span aria-hidden>{selectedCountry.flag}</span>
              <span style={{ fontWeight: 700 }}>{selectedCountry.dial}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.5,
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <select
              aria-label="Country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={busy}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: busy ? "wait" : "pointer",
                fontSize: 16,
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </div>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={national}
            onChange={(e) =>
              setNational(e.target.value.replace(/\D/g, "").slice(0, 15))
            }
            placeholder="Mobile number"
            required
            disabled={busy}
            style={{ ...inputStyle, flex: "1 1 auto", minWidth: 0 }}
          />
        </div>
      </Field>

      <Spacer />

      <Field label={`Password * (min ${PASSWORD_MIN} chars)`}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN}
            style={{ ...inputStyle, paddingRight: 56 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#6B7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "6px 8px",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      {err && <ErrorBox>{err}</ErrorBox>}

      <button
        type="submit"
        disabled={busy}
        style={primaryButton(busy, false)}
      >
        {busy ? "Sending code…" : "Send verification code"}
      </button>

      <p
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "#9CA3AF",
          lineHeight: 1.5,
        }}
      >
        By signing up you agree to our{" "}
        <a href="/terms" style={{ color: "#6B7280", textDecoration: "underline" }}>
          terms
        </a>{" "}
        and{" "}
        <a href="/privacy" style={{ color: "#6B7280", textDecoration: "underline" }}>
          privacy policy
        </a>
        . We&rsquo;ll text you a one-time code on the number above.
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9CA3AF",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
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
      {children}
    </div>
  );
}

function Spacer() {
  return <div style={{ height: 14 }} />;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  fontSize: 15,
  border: "1.5px solid #F0E8D8",
  borderRadius: 12,
  outline: "none",
  background: "#FAF5EB",
  color: "#1A1A1A",
};

const primaryButton = (busy: boolean, disabled: boolean): React.CSSProperties => ({
  width: "100%",
  marginTop: 18,
  padding: "14px 24px",
  background: busy ? "#8B1A1A" : "#C62828",
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  border: "none",
  borderRadius: 999,
  cursor: busy ? "wait" : disabled ? "not-allowed" : "pointer",
  boxShadow: "0 12px 30px rgba(198,40,40,0.22)",
  opacity: disabled ? 0.5 : 1,
});
