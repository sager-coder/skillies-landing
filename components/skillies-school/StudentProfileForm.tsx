"use client";

/**
 * Student profile editor — uses the admin-ui design primitives so it
 * matches the rest of the SaaS aesthetic. Phone is read-only; first /
 * last name and email are editable. Save goes through the server
 * endpoint that uses service-role to avoid RLS races.
 */
import React, { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Input from "@/components/admin-ui/Input";
import Button from "@/components/admin-ui/Button";

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
  // Best-effort split of legacy `full_name` for pre-existing rows that
  // only have it.
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
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = "/login";
  };

  return (
    <>
      <form onSubmit={onSave}>
        <Input
          label="Phone (login)"
          value={initial.phone}
          readOnly
          inputStyle={{ opacity: 0.7, cursor: "not-allowed" }}
        />
        <Hint>
          This is also your login key. Email Ehsan if you need to change it.
        </Hint>

        <Spacer />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Input
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>

        <Spacer />

        <Input
          label="Email (for course updates)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        {result && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background:
                result.ok
                  ? "rgba(22,163,74,0.10)"
                  : "rgba(220,38,38,0.08)",
              border: `1px solid ${
                result.ok ? "rgba(22,163,74,0.30)" : "rgba(220,38,38,0.25)"
              }`,
              borderRadius: 10,
              fontSize: 13,
              color: result.ok ? "#15803D" : "#B91C1C",
            }}
          >
            {result.ok ? result.message : result.error}
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <Button type="submit" loading={busy} disabled={busy}>
            Save changes
          </Button>
        </div>
      </form>

      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid rgba(17,24,39,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#0A0A0A",
              marginBottom: 2,
            }}
          >
            Sign out
          </div>
          <div style={{ fontSize: 12, color: "#525252" }}>
            Sign out on this device. You can sign in again any time.
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 6,
        fontSize: 12,
        color: "#A3A3A3",
      }}
    >
      {children}
    </div>
  );
}

function Spacer() {
  return <div style={{ height: 16 }} />;
}
