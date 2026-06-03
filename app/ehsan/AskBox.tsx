"use client";

/**
 * The founder's "ask anything" box. Posts a question to /api/admin/ask
 * and renders the plain-language answer. Suggested chips make the common
 * questions one tap.
 */
import { useState } from "react";
import Button from "@/components/admin-ui/Button";

const SUGGESTIONS = [
  "What happened today?",
  "What's overdue?",
  "What's blocked?",
  "What is everyone working on?",
];

export default function AskBox({ disabled }: { disabled?: boolean }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = async (question: string) => {
    const query = question.trim();
    if (!query || busy) return;
    setBusy(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/admin/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Couldn't get an answer.");
        return;
      }
      setAnswer(json.answer || "No answer.");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(q);
          }}
          placeholder="Ask anything about your team's work…"
          disabled={disabled}
          style={inputStyle}
        />
        <Button onClick={() => ask(q)} loading={busy} disabled={disabled || !q.trim()}>
          Ask
        </Button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQ(s);
              ask(s);
            }}
            disabled={disabled || busy}
            style={chipStyle}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginTop: 14, fontSize: 13.5, color: "#B91C1C" }}>{error}</div>
      )}

      {answer && (
        <div style={answerStyle}>
          <div style={ansEyebrowStyle}>Answer</div>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#0A0A0A", lineHeight: 1.6 }}>
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  height: 42,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid rgba(17,24,39,0.12)",
  outline: "none",
  fontSize: 14,
  background: "white",
  color: "#0A0A0A",
};
const chipStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid rgba(17,24,39,0.12)",
  background: "white",
  color: "#525252",
  fontSize: 12.5,
  fontWeight: 500,
  cursor: "pointer",
};
const answerStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 16,
  background: "rgba(198,40,40,0.04)",
  border: "1px solid rgba(198,40,40,0.15)",
  borderRadius: 12,
};
const ansEyebrowStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#C62828",
  marginBottom: 8,
};
