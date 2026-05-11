"use client";

/**
 * PasswordGate · the access-code screen for prospect demos.
 *
 * Two transports for resilience:
 *
 *   1. Native HTML form POST (the default · works in every browser AND
 *      every WebView, including WhatsApp's in-app browser, where a
 *      JS fetch + window.location.reload() can drop the just-set cookie).
 *      Form submits → server responds with 303 redirect + Set-Cookie →
 *      browser handles cookie + navigation natively.
 *
 *   2. JS progressive enhancement (when JavaScript is enabled and the
 *      fetch path looks reliable). On submit, intercept e.preventDefault(),
 *      POST JSON, on success reload. Falls back to native form submit on
 *      any error so we never leave the user stuck.
 *
 * Server-side initial errors (e.g. ?demo_error=wrong_code from a prior form
 * POST that failed) are passed in via the `initialError` prop.
 */

import { useState } from "react";

const CREAM = "#FAF5EB";
const INK = "#1A1A1A";
const ACCENT = "#0F766E";
const RED = "#C62828";
const GOLD = "#C9A24E";

const ERROR_MESSAGES: Record<string, string> = {
  wrong_password: "That access code didn't match. Try again.",
  missing_password: "Please enter the access code.",
  demo_not_configured: "This demo isn't active right now. Message Ehsan.",
  unknown_slug: "This demo link is invalid. Message Ehsan.",
};

export default function PasswordGate({
  slug,
  initialError,
}: {
  slug: string;
  initialError?: string | null;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Progressive enhancement · only intercept if window.fetch exists AND
    // the form has a button doing the submit. If anything goes wrong, we
    // re-trigger the form submission natively so the user is never stuck.
    if (typeof window === "undefined" || typeof window.fetch !== "function") {
      return; // let the native form submit run
    }
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const formEl = e.currentTarget;
    try {
      const res = await fetch("/api/demo/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send credentials in case the cookie scope ever changes;
        // harmless for same-origin POSTs.
        credentials: "same-origin",
        body: JSON.stringify({ slug, password }),
      });
      if (res.ok) {
        // Cookie is set · reload to render the demo server-side.
        window.location.reload();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      const msg =
        ERROR_MESSAGES[data.error ?? ""] ??
        "Could not verify. Try again or message Ehsan.";
      setError(msg);
      setBusy(false);
    } catch {
      // fetch threw (network / CORS / extension blocking) · fall back to
      // native form submission, which works without JS in any browser.
      try {
        formEl.submit();
        return;
      } catch {
        setError("Network error. Check your connection and try again.");
        setBusy(false);
      }
    }
  }

  return (
    <main
      style={{
        background: CREAM,
        minHeight: "100vh",
        color: INK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          background: "#FFFFFF",
          border: `1px solid ${ACCENT}33`,
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 18px 60px rgba(15, 118, 110, 0.10)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: GOLD,
            margin: "0 0 14px",
          }}
        >
          Private Demo · Skillies.AI
        </p>

        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}
        >
          This demo is access-coded.
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "#595959",
            lineHeight: 1.55,
            margin: "0 0 28px",
          }}
        >
          Enter the access code Ehsan sent you to open the demo. Code is
          valid for 7 days on this device.
        </p>

        <form
          action="/api/demo/auth"
          method="post"
          onSubmit={handleSubmit}
          // Critical for native-form fallback · the action URL must be
          // exactly the auth route AND we send the slug as a hidden field.
        >
          <input type="hidden" name="slug" value={slug} />
          <label
            htmlFor="demo-password"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#595959",
              marginBottom: 8,
            }}
          >
            Access code
          </label>
          <input
            id="demo-password"
            name="password"
            type="password"
            autoFocus
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              fontSize: 16,
              border: "1px solid #D1D5DB",
              borderRadius: 10,
              outline: "none",
              background: "#FAF5EB",
              color: INK,
              marginBottom: error ? 8 : 18,
            }}
          />
          {error ? (
            <p
              role="alert"
              style={{
                fontSize: 13,
                color: RED,
                margin: "0 0 18px",
                lineHeight: 1.45,
              }}
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || password.length === 0}
            style={{
              width: "100%",
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.04em",
              background: busy ? "#9CA3AF" : ACCENT,
              color: CREAM,
              border: "none",
              borderRadius: 10,
              cursor: busy ? "wait" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {busy ? "Verifying…" : "Open the demo"}
          </button>
        </form>

        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            margin: "26px 0 0",
            textAlign: "center",
            lineHeight: 1.45,
          }}
        >
          No account needed · just the access code from Ehsan.
        </p>
      </div>
    </main>
  );
}
