"use client";

/**
 * JominChatClient — WhatsApp-styled demo chat for the Jomi Insurance
 * agent. Talks to /api/business/jomin (SSE stream, model fallback).
 *
 * Design goals:
 * - Reads like a real WhatsApp thread: teal header with avatar + "online
 *   / typing…", doodle-cream chat background, green outgoing bubbles with
 *   tails, white incoming bubbles, ticks + timestamps, a rounded input
 *   bar with a circular green send button.
 * - Mobile: full-bleed. Desktop: centered in a phone-ish frame so the
 *   demo looks intentional rather than a stretched web form.
 * - Session memory: the full transcript persists in sessionStorage
 *   (cleared when the tab closes) and is sent to the API each turn so
 *   the agent has conversational memory within the session.
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  error?: string;
  ts: number;
};

const STORAGE_KEY = "jomin.demo.v1";

// Seed greeting, in the agent's own voice (Malayalam, offering the four
// covers) — matches the system prompt's example openers.
const INTRO: Msg = {
  id: "intro",
  role: "assistant",
  content:
    "നമസ്കാരം 🙏 Jomi Insurance-ലേക്ക് സ്വാഗതം. ഏത് insurance-നെ കുറിച്ചാണ് അറിയേണ്ടത് — life, health, vehicle, അല്ലെങ്കിൽ home?",
  ts: Date.now(),
};

function clockTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function JominChatClient() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hydrate from sessionStorage (session-scoped memory).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      /* keep intro */
    }
  }, []);

  useEffect(() => {
    const safe = messages.map((m) =>
      m.pending ? { ...m, pending: false } : m,
    );
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe.slice(-100)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const isTyping =
    sending && messages.some((m) => m.role === "assistant" && m.pending);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setError(null);
    setDraft("");

    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      ts: Date.now(),
    };
    const assistantId = `a-${Date.now()}`;
    const placeholder: Msg = {
      id: assistantId,
      role: "assistant",
      content: "",
      pending: true,
      ts: Date.now(),
    };

    const history = [...messages.filter((m) => m.id !== "intro"), userMsg].map(
      (m) => ({ role: m.role, content: m.content }),
    );

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setSending(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/business/jomin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ac.signal,
      });

      if (!res.ok || !res.body) {
        let detail = "";
        try {
          detail = ((await res.json()) as { error?: string }).error ?? "";
        } catch {
          /* not json */
        }
        const nice =
          res.status === 429
            ? "You're sending messages quickly — give it a few seconds."
            : detail === "demo_not_configured"
              ? "The demo isn't configured yet."
              : detail === "all_models_overloaded"
                ? "The assistant is busy right now — try again in a moment."
                : "Something went wrong. Try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, pending: false, content: "", error: nice }
              : m,
          ),
        );
        setError(nice);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let sep = buf.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buf.slice(0, sep);
          buf = buf.slice(sep + 2);
          sep = buf.indexOf("\n\n");

          let ev: string | null = null;
          const dataLines: string[] = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) ev = line.slice(6).trim();
            // SSE: strip "data:" then exactly ONE optional delimiter
            // space. Trimming all leading whitespace would eat real
            // leading spaces in streamed word-deltas (→ "Wehelp").
            else if (line.startsWith("data:"))
              dataLines.push(line.slice(5).replace(/^ /, ""));
          }
          if (dataLines.length === 0) continue;
          const data = dataLines.join("\n");

          if (ev === "error") {
            const nice = acc
              ? undefined
              : "The reply got cut off — tap send to try again.";
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, pending: false, content: acc, error: nice }
                  : m,
              ),
            );
            if (nice) setError(nice);
            return;
          }
          if (ev === "done") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, pending: false, content: acc } : m,
              ),
            );
            return;
          }
          acc += data;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        }
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, pending: false, content: acc } : m,
        ),
      );
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, pending: false, content: "", error: "Network error — try again." }
            : m,
        ),
      );
      setError("Network error — try again.");
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }, [draft, messages, sending]);

  return (
    <div style={page}>
      <div style={frame}>
        {/* Header */}
        <header style={header}>
          <div style={avatar}>JI</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={headerName}>Jomi Insurance</div>
            <div style={headerStatus}>{isTyping ? "typing…" : "online"}</div>
          </div>
          <span style={demoTag}>DEMO</span>
        </header>

        {/* Messages */}
        <div ref={scrollRef} style={chatArea}>
          <div style={dayChip}>
            <span style={dayChipInner}>Demo conversation</span>
          </div>
          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          style={composer}
        >
          <div style={inputPill}>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={1}
              placeholder="Type a message"
              style={inputEl}
            />
          </div>
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || sending}
            style={{
              ...sendBtn,
              opacity: !draft.trim() || sending ? 0.6 : 1,
              cursor: !draft.trim() || sending ? "default" : "pointer",
            }}
          >
            {sending ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden style={{ animation: "jspin 0.9s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.4 20.6 22 12 3.4 3.4l-.5 7.1 13.8 1.5-13.8 1.5z" />
              </svg>
            )}
          </button>
        </form>

        {error && <div style={errorBar}>{error}</div>}
      </div>
      <style>{`
        @keyframes jspin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes jdot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        textarea::placeholder { color: #8696a0; }
      `}</style>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";

  if (m.error) {
    return (
      <div style={{ ...row, justifyContent: "center" }}>
        <div style={errBubble}>{m.error}</div>
      </div>
    );
  }

  if (m.pending && !m.content) {
    return (
      <div style={{ ...row, justifyContent: "flex-start" }}>
        <div style={{ ...bubbleBase, ...inBubble, display: "inline-flex", gap: 4, alignItems: "center", padding: "12px 14px" }}>
          <Dot d="0s" /><Dot d="0.15s" /><Dot d="0.3s" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...row, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={{ ...bubbleBase, ...(isUser ? outBubble : inBubble) }}>
        <span style={bubbleText}>{m.content}</span>
        <span style={metaRow}>
          <span style={timeText}>{clockTime(m.ts)}</span>
          {isUser && (
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden style={{ marginLeft: 3 }}>
              <path d="M11.07 1.04 5.3 7.73 3.3 5.6l-.86.9 2.86 3.05 6.64-7.7-.87-.81Z" fill="#53bdeb" />
              <path d="M15.07 1.04 9.3 7.73l-.5-.53-.86.9.5.53.86.92 6.64-7.7-.87-.81Z" fill="#53bdeb" />
            </svg>
          )}
        </span>
        <span aria-hidden style={isUser ? tailOut : tailIn} />
      </div>
    </div>
  );
}

function Dot({ d }: { d: string }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#90a4ae",
        display: "inline-block",
        animation: `jdot 1.2s ${d} infinite ease-in-out`,
      }}
    />
  );
}

// ── styles ──────────────────────────────────────────────────────────
const WA_BG = "#ECE5DD";
const WA_HEADER = "#075E54";
const WA_OUT = "#DCF8C6";

const page: React.CSSProperties = {
  minHeight: "100dvh",
  background: "#0b141a",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  fontFamily:
    "var(--font-inter), 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

const frame: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  background: WA_BG,
  position: "relative",
  boxShadow: "0 0 40px rgba(0,0,0,0.4)",
};

const header: React.CSSProperties = {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  background: WA_HEADER,
  color: "#fff",
};

const avatar: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#128C7E",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: "0.02em",
  flexShrink: 0,
};

const headerName: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const headerStatus: React.CSSProperties = {
  fontSize: 12.5,
  color: "rgba(255,255,255,0.8)",
  marginTop: 1,
};

const demoTag: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  padding: "3px 7px",
  borderRadius: 6,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
};

const chatArea: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "14px 12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  // Subtle WhatsApp doodle vibe via layered gradients on the warm base.
  backgroundColor: WA_BG,
  backgroundImage:
    "radial-gradient(rgba(0,0,0,0.022) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.018) 1px, transparent 1px)",
  backgroundSize: "26px 26px, 26px 26px",
  backgroundPosition: "0 0, 13px 13px",
};

const dayChip: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  margin: "2px 0 10px",
};
const dayChipInner: React.CSSProperties = {
  fontSize: 12,
  color: "#54656f",
  background: "#ffffffcc",
  padding: "5px 12px",
  borderRadius: 8,
  boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
};

const row: React.CSSProperties = {
  display: "flex",
  width: "100%",
  margin: "1px 0",
};

const bubbleBase: React.CSSProperties = {
  position: "relative",
  maxWidth: "82%",
  padding: "6px 9px 8px 10px",
  borderRadius: 8,
  fontSize: 14.5,
  lineHeight: 1.4,
  color: "#111b21",
  boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
};

const inBubble: React.CSSProperties = {
  background: "#ffffff",
  borderTopLeftRadius: 0,
};
const outBubble: React.CSSProperties = {
  background: WA_OUT,
  borderTopRightRadius: 0,
};

const tailIn: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: -8,
  width: 0,
  height: 0,
  borderTop: "8px solid #ffffff",
  borderLeft: "8px solid transparent",
};
const tailOut: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: -8,
  width: 0,
  height: 0,
  borderTop: `8px solid ${WA_OUT}`,
  borderRight: "8px solid transparent",
};

const bubbleText: React.CSSProperties = {
  display: "inline",
};

const metaRow: React.CSSProperties = {
  float: "right",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: 8,
  marginTop: 4,
  transform: "translateY(3px)",
};
const timeText: React.CSSProperties = {
  fontSize: 11,
  color: "#667781",
};

const errBubble: React.CSSProperties = {
  fontSize: 12.5,
  color: "#7f1d1d",
  background: "#fff1f0",
  border: "1px solid #fca5a5",
  padding: "7px 12px",
  borderRadius: 8,
  maxWidth: "85%",
  textAlign: "center",
};

const composer: React.CSSProperties = {
  flexShrink: 0,
  display: "flex",
  alignItems: "flex-end",
  gap: 8,
  padding: "8px 10px",
  background: "#f0f2f5",
};

const inputPill: React.CSSProperties = {
  flex: 1,
  background: "#fff",
  borderRadius: 22,
  padding: "8px 14px",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
};

const inputEl: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  resize: "none",
  fontSize: 15,
  lineHeight: 1.4,
  fontFamily: "inherit",
  color: "#111b21",
  maxHeight: 110,
  background: "transparent",
};

const sendBtn: React.CSSProperties = {
  flexShrink: 0,
  width: 46,
  height: 46,
  borderRadius: "50%",
  border: "none",
  background: WA_HEADER,
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 140ms ease",
};

const errorBar: React.CSSProperties = {
  position: "absolute",
  bottom: 70,
  left: 12,
  right: 12,
  textAlign: "center",
  fontSize: 12,
  color: "#7f1d1d",
  background: "#fff1f0",
  border: "1px solid #fca5a5",
  borderRadius: 8,
  padding: "6px 10px",
  pointerEvents: "none",
};
