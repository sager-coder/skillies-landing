"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Initial = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  full_name: string;
};

export default function SignupDetailsForm({
  initial,
  next,
}: {
  initial: Initial;
  next: string;
}) {
  // Best-effort split of an existing full_name if first/last are blank.
  const splitFromFullName = (() => {
    if (initial.first_name || initial.last_name) return null;
    const parts = (initial.full_name || "").trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return null;
    return {
      first: parts[0],
      last: parts.slice(1).join(" "),
    };
  })();

  const [firstName, setFirstName] = useState(
    initial.first_name || splitFromFullName?.first || "",
  );
  const [lastName, setLastName] = useState(
    initial.last_name || splitFromFullName?.last || "",
  );
  const [email, setEmail] = useState(initial.email || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!firstName.trim()) {
      setErr("Please tell us your first name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErr("Please enter a valid email.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired — please sign in again.");

      const f = firstName.trim();
      const l = lastName.trim();
      const full = [f, l].filter(Boolean).join(" ");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: f,
          last_name: l || null,
          full_name: full || null,
          email: email.trim(),
        })
        .eq("id", user.id);
      if (error) throw error;

      router.push(next);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Field label="Phone (login)">
        <input
          value={initial.phone}
          readOnly
          style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
        />
        <Hint>You signed in with this number. To change it later, email Ehsan.</Hint>
      </Field>

      <div style={{ height: 16 }} />

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
            required
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

      <Field label="Email *">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          style={inputStyle}
        />
        <Hint>We&rsquo;ll send course updates here — no spam.</Hint>
      </Field>

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
        disabled={busy}
        style={{
          width: "100%",
          marginTop: 22,
          padding: "14px 24px",
          background: busy ? "#8B1A1A" : "#C62828",
          color: "white",
          fontSize: 16,
          fontWeight: 700,
          border: "none",
          borderRadius: 999,
          cursor: busy ? "wait" : "pointer",
          boxShadow: "0 12px 30px rgba(198,40,40,0.22)",
        }}
      >
        {busy ? "Saving…" : "Save and continue →"}
      </button>
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

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        marginTop: 6,
        fontSize: 12,
        color: "#9CA3AF",
      }}
    >
      {children}
    </span>
  );
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
