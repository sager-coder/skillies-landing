"use client";

/**
 * Employee login — username + password (the credentials their manager
 * gave them). Maps to a Supabase email+password account via the synthetic
 * email, then reloads so the page shows their tasks.
 */
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { usernameToEmail } from "@/lib/staff-auth";
import PasswordField from "@/components/PasswordField";

export default function EmployeeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setBusy(true);
    setErr(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: usernameToEmail(username),
        password,
      });
      if (error) {
        setErr("Wrong username or password.");
        return;
      }
      window.location.reload();
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={pageStyle}>
      <form onSubmit={submit} style={cardStyle}>
        <div style={brandStyle}>
          SKILLIES<span style={{ color: "#C62828" }}>.AI</span>
        </div>
        <h1 style={titleStyle}>Your tasks</h1>
        <p style={subStyle}>Sign in with the username and password your manager gave you.</p>

        <label style={labelStyle}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="your username"
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: 14 }}>Password</label>
        <PasswordField value={password} onChange={setPassword} placeholder="••••••••" inputStyle={inputStyle} />

        {err && <div style={errStyle}>{err}</div>}

        <button type="submit" disabled={busy || !username.trim() || !password} style={btnStyle(busy || !username.trim() || !password)}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#FAF9F7", fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: 380, background: "white", borderRadius: 16, padding: 28, border: "1px solid rgba(17,24,39,0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" };
const brandStyle: React.CSSProperties = { fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#0A0A0A" };
const titleStyle: React.CSSProperties = { margin: "18px 0 4px", fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "#0A0A0A" };
const subStyle: React.CSSProperties = { margin: "0 0 18px", fontSize: 13.5, color: "#6B7280", lineHeight: 1.5 };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#525252", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 42, padding: "0 14px", borderRadius: 10, border: "1px solid rgba(17,24,39,0.14)", outline: "none", fontSize: 15, background: "white", color: "#0A0A0A", boxSizing: "border-box" };
const errStyle: React.CSSProperties = { marginTop: 14, padding: "10px 12px", background: "rgba(198,40,40,0.08)", border: "1px solid rgba(198,40,40,0.25)", borderRadius: 9, fontSize: 13, color: "#C62828" };
const btnStyle = (disabled: boolean): React.CSSProperties => ({ width: "100%", marginTop: 20, height: 44, borderRadius: 10, border: "none", background: "#C62828", color: "white", fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1 });
