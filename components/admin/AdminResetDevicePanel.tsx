"use client";

import React, { useState } from "react";

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

/**
 * Admin panel mini-form: type a student's phone, click Reset,
 * their bound_device_id is cleared so they can log in from a new
 * device. Pairs with /api/admin/reset-device.
 */
export default function AdminResetDevicePanel() {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [confirming, setConfirming] = useState(false);

  const doReset = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/reset-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        phone?: string;
        name?: string | null;
        error?: string;
      };
      if (!res.ok) {
        setResult({ ok: false, error: json.error || "Reset failed." });
      } else {
        const who = json.name ? `${json.name} (${json.phone})` : json.phone;
        setResult({
          ok: true,
          message: `Device binding cleared for ${who}. Their next login on any device becomes the new bound one.`,
        });
        setPhone("");
      }
    } catch (err: unknown) {
      setResult({
        ok: false,
        error: err instanceof Error ? err.message : "Reset failed.",
      });
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setConfirming(true);
  };

  return (
    <div
      style={{
        padding: 24,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#C9A24E",
          marginBottom: 8,
        }}
      >
        Reset device lock
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.55,
          margin: "0 0 18px",
        }}
      >
        Clear a student&rsquo;s bound device so they can sign in from a new
        one. Use when a phone is lost, replaced, or they&rsquo;ve legitimately
        switched devices.
      </p>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 80899 41131"
          required
          style={{
            flex: "1 1 220px",
            padding: "11px 14px",
            fontSize: 15,
            border: "1.5px solid #F0E8D8",
            borderRadius: 10,
            outline: "none",
            background: "#FAF5EB",
            color: "#1A1A1A",
          }}
        />
        <button
          type="submit"
          disabled={busy || !phone.trim()}
          style={{
            padding: "11px 22px",
            background: busy ? "#8a6a1f" : "#C9A24E",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 999,
            cursor: busy ? "wait" : "pointer",
            opacity: !phone.trim() ? 0.5 : 1,
          }}
        >
          {busy ? "Resetting…" : "Reset device"}
        </button>
      </form>

      {confirming && !busy && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 14px",
            background: "rgba(201,162,78,0.10)",
            border: "1px solid rgba(201,162,78,0.40)",
            borderRadius: 10,
            fontSize: 13,
            color: "#8a6a1f",
            lineHeight: 1.5,
          }}
        >
          Confirm: clear the device binding for{" "}
          <b>{phone}</b>? They&rsquo;ll be able to sign in from a new device.
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              onClick={doReset}
              style={{
                padding: "8px 16px",
                background: "#C9A24E",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              style={{
                padding: "8px 16px",
                background: "transparent",
                color: "#6B7280",
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid rgba(26,26,26,0.15)",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            background: result.ok ? "rgba(91,123,91,0.1)" : "rgba(198,40,40,0.08)",
            border: `1px solid ${result.ok ? "rgba(91,123,91,0.35)" : "rgba(198,40,40,0.30)"}`,
            color: result.ok ? "#3D5A3D" : "#C62828",
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          {result.ok ? result.message : result.error}
        </div>
      )}
    </div>
  );
}
