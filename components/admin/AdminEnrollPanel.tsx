"use client";

import React, { useState } from "react";

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

export default function AdminEnrollPanel() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("kdp-mastery");
  const [tier, setTier] = useState<"founding" | "standard" | "pro">("standard");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const onEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const cleaned = phone.replace(/\D/g, "");
      const e164 = cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;

      const res = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: e164, full_name: name, course, tier }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult({ ok: false, error: json.error || "Enrolment failed." });
      } else {
        setResult({
          ok: true,
          message: `Enrolled ${e164} in ${course} (${tier}). Tell them to log in at skillies.ai/login.`,
        });
        setPhone("");
        setName("");
        // refresh list
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err: unknown) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Failed." });
    } finally {
      setBusy(false);
    }
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
      <form onSubmit={onEnroll}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <Field label="Phone (with country code)">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 80899 41131"
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Name (optional)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shamseera M."
              style={inputStyle}
            />
          </Field>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Field label="Course">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              style={inputStyle}
            >
              <option value="kdp-mastery">KDP Mastery · 50-Day Program</option>
            </select>
          </Field>
          <Field label="Tier">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as "founding" | "standard" | "pro")}
              style={inputStyle}
            >
              <option value="standard">Standard · ₹75,000</option>
              <option value="pro">Pro · ₹1,25,000</option>
              <option value="founding">Founding · ₹45,000 (Batch 001)</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={busy || !phone}
          style={{
            padding: "14px 28px",
            background: busy ? "#8B1A1A" : "#C62828",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 999,
            cursor: busy ? "wait" : "pointer",
            boxShadow: "0 12px 30px rgba(198,40,40,0.20)",
            opacity: !phone ? 0.5 : 1,
          }}
        >
          {busy ? "Enrolling…" : "Enrol student"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: 18,
            padding: "12px 16px",
            background: result.ok ? "rgba(91,123,91,0.1)" : "rgba(198,40,40,0.08)",
            border: `1px solid ${result.ok ? "rgba(91,123,91,0.35)" : "rgba(198,40,40,0.30)"}`,
            color: result.ok ? "#3D5A3D" : "#C62828",
            borderRadius: 10,
            fontSize: 14,
            lineHeight: 1.55,
          }}
        >
          {result.ok ? result.message : result.error}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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
