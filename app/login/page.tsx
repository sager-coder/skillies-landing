"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wordmark, Grain } from "@/components/design/Primitives";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/country-codes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Admins now sign in via the standard phone+password form with the
// password set by scripts/set-admin-password.mjs. The /api/dev/admin-login
// route remains as an emergency password-reset (NODE_ENV-guarded) but
// is no longer wired into this page.

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
  // next may be null — claimDeviceAndRedirect resolves a role-aware
  // default (/admin for admins, /student otherwise) when missing.
  const next = params.get("next");

  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [national, setNational] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) || DEFAULT_COUNTRY;
  const fullPhone = selectedCountry.dial + national;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (national.length < 6) {
      setErr("Enter a valid phone number.");
      return;
    }
    if (password.length < 1) {
      setErr("Enter your password.");
      return;
    }
    setBusy(true);
    try {
      // Standard sign-in: phone + password.
      const supabase = createSupabaseBrowserClient();
      const { error, data } = await supabase.auth.signInWithPassword({
        phone: fullPhone,
        password,
      });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("Sign-in returned no session.");

      // Bind device + redirect. Same path the old OTP-verify took.
      await claimDeviceAndRedirect(next, router);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Couldn't sign in.";
      // Friendlier messages for the most common Supabase Auth errors.
      if (/phone.*not.*confirm/i.test(msg)) {
        setErr(
          "This number hasn't been verified yet. Finish signing up at /signup, or contact support if your phone number is already correct.",
        );
      } else if (/invalid.*(login|credentials|password)/i.test(msg)) {
        setErr("Wrong phone or password. Try again.");
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
        Sign in
      </div>
      <h1
        style={{
          margin: "10px 0 8px",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(36px, 5vw, 52px)",
          letterSpacing: "-0.02em",
          color: "#1A1A1A",
          lineHeight: 1.05,
        }}
      >
        Welcome <em style={{ color: "#C62828" }}>back.</em>
      </h1>

<p style={{ fontSize: 15, color: "#6B7280", margin: "16px 0 24px", lineHeight: 1.6 }}>
        New to Skillies?{" "}
        <a
          href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          style={{ color: "#C62828", fontWeight: 600 }}
        >
          Create an account →
        </a>
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
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <div
              style={{
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "14px 30px 14px 14px",
                fontSize: 18,
                border: "1.5px solid #F0E8D8",
                borderRadius: 12,
                color: "#1A1A1A",
                background: "#FAF5EB",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
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
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.5,
                }}
                aria-hidden
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
            disabled={busy}
            style={{
              flex: "1 1 auto",
              minWidth: 0,
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
        </div>

        <label
          style={{
            display: "block",
            marginTop: 18,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
        >
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            disabled={busy}
            style={{
              width: "100%",
              padding: "14px 56px 14px 16px",
              fontSize: 18,
              border: "1.5px solid #F0E8D8",
              borderRadius: 12,
              outline: "none",
              color: "#1A1A1A",
              background: "#FAF5EB",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C62828")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#F0E8D8")}
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

        {err && (
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
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || national.length < 6}
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
            opacity: national.length < 6 ? 0.5 : 1,
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
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
        Using a Skillies tool (Niche Finder, etc.)?{" "}
        <a href="/signin" style={{ color: "#C62828", fontWeight: 600 }}>
          Sign in with email →
        </a>
      </div>
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

  // Role-aware default destination.
  let destination = rawNext;
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
