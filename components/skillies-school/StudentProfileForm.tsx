"use client";

import React, { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

export default function StudentProfileForm({
  initial,
}: {
  initial: {
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
  };
}) {
  // Best-effort split of full_name for legacy profiles that only had it.
  const splitLegacy = (() => {
    if (initial.first_name || initial.last_name) return null;
    const parts = (initial.full_name || "").trim().split(/\s+/);
    if (!parts[0]) return null;
    return { first: parts[0], last: parts.slice(1).join(" ") };
  })();

  const [firstName, setFirstName] = useState(
    initial.first_name || splitLegacy?.first || "",
  );
  const [lastName, setLastName] = useState(
    initial.last_name || splitLegacy?.last || "",
  );
  const [email, setEmail] = useState(initial.email);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      // Go through the server endpoint so the write uses service-role
      // and isn't subject to RLS or session-cookie timing races.
      const res = await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !j.ok) {
        throw new Error(j.error || "Save failed.");
      }
      setResult({ ok: true, message: "Saved." });
    } catch (e: unknown) {
      setResult({
        ok: false,
        error: e instanceof Error ? e.message : "Failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  const onSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: 28,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
      }}
    >
      <form onSubmit={onSave}>
        <Field label="Phone (login)">
          <input
            value={initial.phone}
            readOnly
            style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
          />
          <span style={hintStyle}>
            This is also your one-device login key. Email Ehsan to change it.
          </span>
        </Field>

        <div style={{ height: 16 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Field label="First name">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
              style={inputStyle}
            />
          </Field>
          <Field label="Last name">
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
              style={inputStyle}
            />
          </Field>
        </div>

        <div style={{ height: 16 }} />

        <Field label="Email (for course updates)">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            style={inputStyle}
          />
        </Field>

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 22,
            padding: "13px 26px",
            background: busy ? "#8B1A1A" : "#C62828",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 999,
            cursor: busy ? "wait" : "pointer",
            boxShadow: "0 10px 24px rgba(198,40,40,0.20)",
          }}
        >
          {busy ? "Saving…" : "Save changes"}
        </button>

        {result && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: result.ok
                ? "rgba(91,123,91,0.10)"
                : "rgba(198,40,40,0.08)",
              border: `1px solid ${
                result.ok ? "rgba(91,123,91,0.35)" : "rgba(198,40,40,0.30)"
              }`,
              color: result.ok ? "#3D5A3D" : "#C62828",
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            {result.ok ? result.message : result.error}
          </div>
        )}
      </form>

      <div
        style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: "1px dashed rgba(26,26,26,0.10)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          Signed in on this device.
        </span>
        <button
          type="button"
          onClick={onSignOut}
          style={{
            padding: "8px 14px",
            background: "transparent",
            color: "#6B7280",
            border: "1px solid rgba(26,26,26,0.12)",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1.5px solid #F0E8D8",
  borderRadius: 10,
  outline: "none",
  background: "#FAF5EB",
  color: "#1A1A1A",
};

const hintStyle: React.CSSProperties = {
  display: "block",
  marginTop: 6,
  fontSize: 12,
  color: "#9CA3AF",
};
