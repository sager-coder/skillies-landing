"use client";

/**
 * KdpCoachWidget — floating in-app tutor for paying Skillies students.
 *
 * Rendered only when `enrolled` is true. The server resolves enrollment
 * already (see /app/student/page.tsx); the widget itself doesn't fetch
 * gating data on mount. The /api/student/coach route re-checks
 * enrollment server-side anyway, so a curious client can't bypass.
 *
 * Shape
 * ─────
 * - A small Skillies-red launcher in the bottom-right corner with a
 *   chat-bubble icon. Sits at z-50 — TopNav is z-60 so the launcher
 *   never overlays the nav.
 * - Click → slides a chat panel up (full-height on mobile, ~520px tall
 *   floating card on desktop).
 * - Conversation persists in localStorage so a refresh keeps history.
 *   Key includes userId so multiple accounts on the same device don't
 *   bleed into each other.
 *
 * Streaming
 * ─────────
 * `/api/student/coach` streams an SSE feed of plain `data: <chunk>` lines
 * terminated by `event: done`. We append each chunk to the in-progress
 * assistant message so the student sees text typing in real time.
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True while we're still streaming this message's text. */
  pending?: boolean;
  /** Set when the request failed for this message. */
  error?: string;
  ts: number;
};

const STORAGE_KEY_PREFIX = "skillies.kdp-coach.v1.";
const INTRO_MESSAGE: ChatMessage = {
  id: "intro",
  role: "assistant",
  content:
    "Hi — I'm your Skillies KDP Coach. Ask me anything about niche validation, BSR, covers, the Claude-first workflow, KDP listing, pricing, or what to do when a book stalls. Short, specific questions get the sharpest answers.",
  ts: 0,
};

export default function KdpCoachWidget({ userId }: { userId: string }) {
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ── localStorage hydration / persistence ─────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      /* corrupt JSON → keep the intro */
    }
  }, [storageKey]);

  useEffect(() => {
    // Don't persist the in-flight pending bubble (it'd resurrect mid-
    // stream-text without a stream to feed it on next mount).
    const safe = messages.map((m) =>
      m.pending ? { ...m, pending: false, content: m.content || "(interrupted)" } : m,
    );
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(safe.slice(-100)));
    } catch {
      /* quota / private mode → ignore */
    }
  }, [messages, storageKey]);

  // ── auto-scroll on new content ───────────────────────────────────
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // ── focus textarea when opening ──────────────────────────────────
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ── abort any in-flight stream when the widget unmounts ──────────
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;

    setError(null);
    setDraft("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      ts: Date.now(),
    };
    const assistantId = `a-${Date.now()}`;
    const placeholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      pending: true,
      ts: Date.now(),
    };

    // Snapshot the history we'll send upstream BEFORE we append the
    // pending bubble — the API expects only real turns.
    const history = [...messages.filter((m) => m.id !== "intro"), userMsg].map(
      (m) => ({ role: m.role, content: m.content }),
    );

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setSending(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/student/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ac.signal,
      });

      if (!res.ok || !res.body) {
        let detail = "";
        try {
          const j = (await res.json()) as { error?: string };
          detail = j.error ?? "";
        } catch {
          /* not JSON */
        }
        const niceError =
          res.status === 429
            ? "You're sending messages too fast — try again in a minute."
            : res.status === 403
              ? "The coach is only available for enrolled students."
              : detail === "coach_not_configured"
                ? "The coach isn't configured on this server yet. Tell Ehsan."
                : "Something broke. Try again in a moment.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, pending: false, content: "", error: niceError }
              : m,
          ),
        );
        setError(niceError);
        return;
      }

      // Read the SSE stream.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let sep = buf.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buf.slice(0, sep);
          buf = buf.slice(sep + 2);
          sep = buf.indexOf("\n\n");

          let eventName: string | null = null;
          const dataLines: string[] = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataLines.push(line.slice(5));
          }
          if (dataLines.length === 0) continue;
          const data = dataLines.join("\n").trimStart();

          if (eventName === "error") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      pending: false,
                      content: assistantText,
                      error: "Connection dropped mid-reply. Try again.",
                    }
                  : m,
              ),
            );
            setError("Connection dropped mid-reply. Try again.");
            return;
          }
          if (eventName === "done") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, pending: false, content: assistantText }
                  : m,
              ),
            );
            return;
          }
          // Plain delta (eventName is null / data-only frames).
          assistantText += data;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantText } : m,
            ),
          );
        }
      }
      // Stream ended without an explicit `done` event — finalize anyway.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, pending: false, content: assistantText } : m,
        ),
      );
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      console.error("[coach] send failed", err);
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

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([INTRO_MESSAGE]);
    setError(null);
    setSending(false);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Skillies KDP Coach"
          style={launcherStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#B22020";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#C62828";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={launcherLabel}>KDP Coach</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div style={panelOuter} role="dialog" aria-label="Skillies KDP Coach">
          {/* Header */}
          <div style={panelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={avatarBadge}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={headerTitle}>Skillies KDP Coach</div>
                <div style={headerSubtitle}>Your daily-use tutor · powered by Claude</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                onClick={resetChat}
                aria-label="Start a new chat"
                title="Start a new chat"
                style={iconBtn}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(17,24,39,0.06)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                  <polyline points="21 4 21 10 15 10" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close coach"
                title="Close"
                style={iconBtn}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(17,24,39,0.06)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={messagesScroll}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            style={composerWrap}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask about niches, BSR, covers, the workflow…"
              rows={1}
              disabled={sending}
              style={textarea}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={sending || !draft.trim()}
              style={{
                ...sendButton,
                opacity: sending || !draft.trim() ? 0.5 : 1,
                cursor: sending || !draft.trim() ? "not-allowed" : "pointer",
              }}
            >
              {sending ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden
                  style={{ animation: "kdp-spin 0.9s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M3.4 20.6 22 12 3.4 3.4l-.5 7.1 13.8 1.5-13.8 1.5z" />
                </svg>
              )}
            </button>
          </form>

          {error && (
            <div style={errorBar} role="status">
              {error}
            </div>
          )}
          <style>{`@keyframes kdp-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}

// ── Bubble ──────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const wrap: React.CSSProperties = {
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    width: "100%",
  };
  const bubble: React.CSSProperties = {
    maxWidth: "85%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.55,
    color: isUser ? "#FFFFFF" : "#0A0A0A",
    background: isUser
      ? "linear-gradient(135deg, #C62828 0%, #B22020 100%)"
      : "#F4EFE4",
    border: isUser ? "none" : "1px solid rgba(17,24,39,0.06)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  if (message.error) {
    return (
      <div style={wrap}>
        <div
          style={{
            ...bubble,
            background: "#FFF1F0",
            border: "1px solid #FCA5A5",
            color: "#7F1D1D",
          }}
        >
          {message.error}
        </div>
      </div>
    );
  }

  if (message.pending && !message.content) {
    return (
      <div style={wrap}>
        <div style={bubble}>
          <TypingDots />
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={bubble}>{message.content}</div>
    </div>
  );
}

function TypingDots() {
  return (
    <span
      aria-label="Coach is typing"
      style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
    >
      <Dot delay="0s" />
      <Dot delay="0.15s" />
      <Dot delay="0.3s" />
      <style>{`@keyframes kdp-bounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }`}</style>
    </span>
  );
}
function Dot({ delay }: { delay: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#C62828",
        animation: `kdp-bounce 1.2s ${delay} infinite ease-in-out`,
        display: "inline-block",
      }}
    />
  );
}

// ── styles ──────────────────────────────────────────────────────────
const launcherStyle: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  zIndex: 50,
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 18px",
  background: "#C62828",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  fontFamily:
    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "-0.01em",
  boxShadow: "0 8px 24px rgba(198,40,40,0.35), 0 2px 6px rgba(0,0,0,0.08)",
  transition: "background 160ms ease, transform 160ms ease",
};

const launcherLabel: React.CSSProperties = {
  whiteSpace: "nowrap",
};

const panelOuter: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  zIndex: 50,
  width: "min(380px, calc(100vw - 24px))",
  height: "min(620px, calc(100vh - 80px))",
  background: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid rgba(17,24,39,0.10)",
  boxShadow: "0 24px 64px rgba(17,24,39,0.18), 0 8px 16px rgba(17,24,39,0.06)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily:
    "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
};

const panelHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "12px 14px",
  borderBottom: "1px solid rgba(17,24,39,0.06)",
  background: "#FAF5EB",
};

const avatarBadge: React.CSSProperties = {
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "linear-gradient(135deg, #C62828 0%, #8B1A1A 100%)",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const headerTitle: React.CSSProperties = {
  fontFamily:
    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: "#0A0A0A",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const headerSubtitle: React.CSSProperties = {
  marginTop: 2,
  fontSize: 11,
  color: "#525252",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const iconBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  color: "#525252",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 140ms ease",
};

const messagesScroll: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "16px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const composerWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: 8,
  padding: "10px 12px 12px",
  borderTop: "1px solid rgba(17,24,39,0.06)",
  background: "#FFFFFF",
};

const textarea: React.CSSProperties = {
  flex: 1,
  resize: "none",
  border: "1px solid rgba(17,24,39,0.10)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  lineHeight: 1.5,
  fontFamily: "inherit",
  color: "#0A0A0A",
  background: "#FAFAFA",
  outline: "none",
  maxHeight: 120,
  minHeight: 40,
  overflow: "auto",
};

const sendButton: React.CSSProperties = {
  flexShrink: 0,
  width: 40,
  height: 40,
  borderRadius: 10,
  border: "none",
  background: "#C62828",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 140ms ease, opacity 140ms ease",
};

const errorBar: React.CSSProperties = {
  padding: "8px 14px",
  background: "#FFF1F0",
  borderTop: "1px solid #FCA5A5",
  color: "#7F1D1D",
  fontSize: 12,
};
