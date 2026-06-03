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
import type { CoachBudget } from "@/lib/coach-budget";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True while we're still streaming this message's text. */
  pending?: boolean;
  /** Set when the request failed for this message. */
  error?: string;
  /** Marks a user bubble as having come from a voice recording (so we
   *  can show the mic icon + duration label instead of plain text). */
  voice?: { durationSec: number; transcribing?: boolean };
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

export default function KdpCoachWidget({
  userId,
  initialBudget,
}: {
  userId: string;
  initialBudget: CoachBudget;
}) {
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-student monthly token budget, seeded from the server and
  // refreshed after every reply. When it hits zero the composer locks
  // until the monthly reset.
  const [budget, setBudget] = useState<CoachBudget>(initialBudget);
  const blocked = !budget.unlimited && budget.remaining <= 0;

  const refreshBudget = useCallback(async () => {
    try {
      const res = await fetch("/api/student/coach/usage", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const next = (await res.json()) as CoachBudget;
      setBudget(next);
    } catch {
      /* transient — keep the last known figure */
    }
  }, []);

  // Voice-note recording state — mirrors the SkilliesChatWidget pattern
  // (MediaRecorder on the device, transcript via /api/transcribe). The
  // ref chunks are kept off-state so a re-render doesn't reset them
  // mid-recording.
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartMsRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);

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

  // `send` accepts an optional explicit body so voice notes (which
  // resolve their text asynchronously after transcription) can hand off
  // their transcript directly without round-tripping through the draft
  // state. A `voice` option marks the user bubble for voice styling.
  const send = useCallback(async (
    explicit?: { text: string; voice?: { durationSec: number } },
  ) => {
    const text = (explicit?.text ?? draft).trim();
    if (!text || sending || blocked) return;

    setError(null);
    if (!explicit) setDraft("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      voice: explicit?.voice,
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
        let payload: {
          error?: string;
          used?: number;
          limit?: number;
          resetAt?: string;
        } = {};
        try {
          payload = (await res.json()) as typeof payload;
          detail = payload.error ?? "";
        } catch {
          /* not JSON */
        }
        const isBudget = res.status === 402 || detail === "budget_exceeded";
        if (isBudget) {
          // Reflect the exhausted allowance locally so the composer locks
          // immediately without waiting for the next refresh.
          setBudget((b) => ({
            ...b,
            used: payload.used ?? b.limit,
            limit: payload.limit ?? b.limit,
            remaining: 0,
            resetAt: payload.resetAt ?? b.resetAt,
            exceeded: true,
          }));
        }
        const niceError =
          res.status === 429
            ? "You're sending messages too fast — try again in a minute."
            : res.status === 403
              ? "The coach is only available for enrolled students."
              : isBudget
                ? `You've used all your AI tokens for this month. Resets ${formatResetDate(
                    payload.resetAt ?? budget.resetAt,
                  )}.`
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
            // SSE: strip "data:" then exactly ONE optional delimiter
            // space. Trimming all leading whitespace would eat real
            // leading spaces in streamed word-deltas (→ "generatingyour").
            else if (line.startsWith("data:"))
              dataLines.push(line.slice(5).replace(/^ /, ""));
          }
          if (dataLines.length === 0) continue;
          const data = dataLines.join("\n");

          if (eventName === "error") {
            // The server forwards the Anthropic error type as the data
            // payload (e.g. "overloaded_error", "rate_limit_error").
            const errType = data.trim();
            console.warn("[coach] stream error:", errType);
            const friendly =
              errType === "overloaded_error"
                ? "The coach is briefly overloaded. Tap send to try again."
                : errType === "rate_limit_error"
                  ? "Too many requests right now — wait a few seconds and retry."
                  : "The reply got cut off. Tap send to try again.";
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      pending: false,
                      content: assistantText,
                      error: assistantText ? undefined : friendly,
                    }
                  : m,
              ),
            );
            setError(friendly);
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
      // The reply's tokens are logged server-side as the stream closes;
      // pull the fresh figure so the meter reflects this turn.
      void refreshBudget();
    }
  }, [draft, messages, sending, blocked, budget.resetAt, refreshBudget]);

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

  // ── Voice notes ──────────────────────────────────────────────────
  // Tap mic → MediaRecorder starts, the composer swaps to a recording
  // bar. The student either taps cancel (discard) or tap-to-send. On
  // send we stop the recorder, optimistically render a "transcribing…"
  // user bubble, upload the audio blob to /api/transcribe, then patch
  // the bubble with the transcript and hand off to the normal coach
  // send() so Claude sees plain text exactly like a typed message.

  const stopMediaTracks = useCallback(() => {
    if (durationIntervalRef.current !== null) {
      window.clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || sending || transcribing) return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "Microphone permission was denied. You can still type your question.",
      );
      return;
    }
    let recorder: MediaRecorder;
    try {
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
    } catch (e) {
      stream.getTracks().forEach((t) => t.stop());
      const msg = e instanceof Error ? e.message : "recorder unavailable";
      setError(`Couldn't start recording: ${msg}`);
      return;
    }
    audioChunksRef.current = [];
    recorder.addEventListener("dataavailable", (e) => {
      if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
    });
    recorder.start();

    mediaStreamRef.current = stream;
    mediaRecorderRef.current = recorder;
    recordingStartMsRef.current = Date.now();
    setRecordingDurationSec(0);
    setIsRecording(true);
    setError(null);

    // 90s hard cap — matches WhatsApp voice-note behaviour, and keeps
    // transcripts short enough that latency stays acceptable.
    durationIntervalRef.current = window.setInterval(() => {
      const sec = Math.floor(
        (Date.now() - recordingStartMsRef.current) / 1000,
      );
      setRecordingDurationSec(sec);
      if (sec >= 90) {
        try {
          recorder.stop();
        } catch {
          /* recorder already stopped — fine */
        }
      }
    }, 250);
  }, [isRecording, sending, transcribing]);

  const cancelRecording = useCallback(() => {
    if (!isRecording) return;
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      /* noop */
    }
    audioChunksRef.current = [];
    stopMediaTracks();
    setIsRecording(false);
    setRecordingDurationSec(0);
  }, [isRecording, stopMediaTracks]);

  const sendRecording = useCallback(async () => {
    if (!isRecording) return;
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      cancelRecording();
      return;
    }
    const durationSec = Math.max(
      1,
      Math.floor((Date.now() - recordingStartMsRef.current) / 1000),
    );

    // Wait for the recorder to flush its final chunk, then bundle the
    // chunks into one Blob with the recorder's negotiated mime type.
    const finalBlob: Blob = await new Promise((resolve) => {
      recorder.addEventListener(
        "stop",
        () => {
          const mime = recorder.mimeType || "audio/webm";
          resolve(new Blob(audioChunksRef.current, { type: mime }));
        },
        { once: true },
      );
      try {
        recorder.stop();
      } catch {
        resolve(new Blob(audioChunksRef.current, { type: "audio/webm" }));
      }
    });
    stopMediaTracks();
    setIsRecording(false);
    setRecordingDurationSec(0);

    if (finalBlob.size === 0) {
      setError("Voice note was empty — try again.");
      return;
    }

    setTranscribing(true);

    // Optimistically render a "transcribing…" voice bubble so the
    // student sees their action registered immediately.
    const pendingId = `v-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: pendingId,
        role: "user",
        content: "",
        voice: { durationSec, transcribing: true },
        ts: Date.now(),
      },
    ]);

    let transcript = "";
    try {
      const fd = new FormData();
      const ext = finalBlob.type.includes("mp4") ? "m4a" : "webm";
      fd.append("file", finalBlob, `voice-note.${ext}`);
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = (await res.json()) as { transcript?: string };
        transcript = (data.transcript ?? "").trim();
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          upstream_code?: string;
          upstream_status?: number;
          message?: string;
        };
        console.warn("[coach] transcribe failed", res.status, data);
        const niceError =
          data.error === "rate_limited" || data.error === "stt_rate_limited"
            ? "Too many voice notes recently — try again in a bit."
            : data.error === "stt_not_configured"
              ? "Voice transcription isn't set up here yet."
              : data.error === "stt_billing_issue"
                ? "Voice transcription is temporarily disabled — billing issue with the speech provider. Type your question instead, or tell Ehsan."
                : data.error === "stt_unauthorized"
                  ? "Voice transcription isn't authorised right now. Type your question instead, or tell Ehsan."
                  : data.message
                    ? `Voice transcription failed: ${data.message.slice(0, 140)}`
                    : `Voice transcription failed (${res.status}).`;
        setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        setError(niceError);
        setTranscribing(false);
        return;
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setError("Couldn't reach the transcription service.");
      setTranscribing(false);
      return;
    }

    setTranscribing(false);

    if (!transcript) {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setError("Couldn't make out the audio — try recording again.");
      return;
    }

    // Drop the optimistic placeholder; send() appends its own bubble
    // with the transcript text (single source of truth in localStorage).
    setMessages((prev) => prev.filter((m) => m.id !== pendingId));
    void send({ text: transcript, voice: { durationSec } });
  }, [cancelRecording, isRecording, send, stopMediaTracks]);

  // End any in-progress recording when the widget unmounts so we don't
  // leak the mic stream into the background.
  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

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
                <div style={headerSubtitle}>Your daily-use tutor · powered by MiniMax</div>
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

          {/* Monthly token meter — hidden for admins (unlimited). */}
          {!budget.unlimited && <TokenMeter budget={budget} />}

          {/* Messages */}
          <div ref={scrollRef} style={messagesScroll}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>

          {/* Composer — locks when the monthly budget is spent, otherwise
              swaps between idle (textarea + mic + send) and recording
              (cancel + timer + send-voice). */}
          {blocked ? (
            <div style={blockedNotice} role="status">
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
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>
                You&rsquo;ve used all your AI tokens this month. Resets{" "}
                {formatResetDate(budget.resetAt)}.
              </span>
            </div>
          ) : isRecording ? (
            <div style={composerWrap} role="group" aria-label="Recording voice note">
              <button
                type="button"
                onClick={cancelRecording}
                aria-label="Cancel recording"
                title="Discard"
                style={{ ...iconBtn, width: 40, height: 40, color: "#7F1D1D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(127,29,29,0.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
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
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
              <div style={recordingBar} aria-live="polite">
                <span style={recordingDot} aria-hidden />
                <span style={recordingTimer}>
                  {formatDuration(recordingDurationSec)}
                </span>
                <span style={recordingHint}>Recording — tap send when ready</span>
              </div>
              <button
                type="button"
                onClick={() => void sendRecording()}
                aria-label="Send voice note"
                style={sendButton}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#B22020")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C62828")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M3.4 20.6 22 12 3.4 3.4l-.5 7.1 13.8 1.5-13.8 1.5z" />
                </svg>
              </button>
            </div>
          ) : (
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
                placeholder={
                  transcribing
                    ? "Transcribing voice note…"
                    : "Ask about niches, BSR, covers, the workflow…"
                }
                rows={1}
                disabled={sending || transcribing}
                style={textarea}
              />
              {/* Mic button — only show when the textarea is empty so the
                  "send what I typed" button stays the obvious primary
                  action when there's typed text waiting. */}
              {!draft.trim() && (
                <button
                  type="button"
                  onClick={() => void startRecording()}
                  aria-label="Record voice note"
                  title="Record voice note"
                  disabled={sending || transcribing}
                  style={{
                    ...iconBtn,
                    width: 40,
                    height: 40,
                    color: "#525252",
                    opacity: sending || transcribing ? 0.4 : 1,
                    cursor: sending || transcribing ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (sending || transcribing) return;
                    e.currentTarget.style.background = "rgba(17,24,39,0.06)";
                    e.currentTarget.style.color = "#0A0A0A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#525252";
                  }}
                >
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
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>
              )}
              {draft.trim() && (
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={sending || transcribing}
                  style={{
                    ...sendButton,
                    opacity: sending || transcribing ? 0.5 : 1,
                    cursor: sending || transcribing ? "not-allowed" : "pointer",
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
              )}
            </form>
          )}

          {error && (
            <div style={errorBar} role="status">
              {error}
            </div>
          )}
          <style>{`
            @keyframes kdp-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
            @keyframes kdp-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.55; transform: scale(0.8); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 1_000_000 → "1M", 847_000 → "847K", 950 → "950". */
function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : Number(m.toFixed(2))}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.max(0, Math.round(n))}`;
}

/** ISO reset timestamp → "Jul 1" (UTC, matches the server's month math). */
function formatResetDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "next month";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// ── Token meter ─────────────────────────────────────────────────────
// Slim strip under the header: remaining tokens for the month + a fill
// bar that reddens as the student approaches the cap.
function TokenMeter({ budget }: { budget: CoachBudget }) {
  const pctUsed =
    budget.limit > 0 ? Math.min(100, (budget.used / budget.limit) * 100) : 0;
  const low = budget.remaining <= budget.limit * 0.1;
  const out = budget.remaining <= 0;
  const accent = out ? "#B91C1C" : low ? "#B45309" : "#C62828";
  const track = out || low ? "#FEE2E2" : "rgba(17,24,39,0.08)";
  return (
    <div style={meterWrap} aria-label="Monthly AI token budget">
      <div style={meterTopRow}>
        <span style={meterLabel}>AI tokens · this month</span>
        <span style={{ ...meterValue, color: accent }}>
          {out
            ? `0 left · resets ${formatResetDate(budget.resetAt)}`
            : `${formatTokens(budget.remaining)} / ${formatTokens(
                budget.limit,
              )} left`}
        </span>
      </div>
      <div style={{ ...meterTrack, background: track }}>
        <div style={{ ...meterFill, width: `${pctUsed}%`, background: accent }} />
      </div>
    </div>
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

  // Voice bubble — show a small mic icon + duration label above the
  // transcript. Mid-transcription, replace the text with a hint.
  if (message.voice) {
    return (
      <div style={wrap}>
        <div style={bubble}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: 0.85,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: message.content || message.voice.transcribing ? 4 : 0,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            <span>Voice · {formatDuration(message.voice.durationSec)}</span>
          </div>
          {message.voice.transcribing ? (
            <span style={{ opacity: 0.85, fontStyle: "italic" }}>
              Transcribing…
            </span>
          ) : (
            message.content
          )}
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

const meterWrap: React.CSSProperties = {
  padding: "8px 14px 10px",
  borderBottom: "1px solid rgba(17,24,39,0.06)",
  background: "#FFFDF8",
};

const meterTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
  marginBottom: 6,
};

const meterLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#6B7280",
};

const meterValue: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  fontFamily:
    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
};

const meterTrack: React.CSSProperties = {
  height: 4,
  borderRadius: 999,
  overflow: "hidden",
};

const meterFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  transition: "width 320ms ease, background 200ms ease",
};

const blockedNotice: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "14px 16px",
  borderTop: "1px solid #FCA5A5",
  background: "#FFF1F0",
  color: "#7F1D1D",
  fontSize: 13,
  lineHeight: 1.45,
};

const recordingBar: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  borderRadius: 10,
  background: "#FFF1F0",
  border: "1px solid #FCA5A5",
  color: "#7F1D1D",
  minHeight: 40,
};

const recordingDot: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#C62828",
  animation: "kdp-pulse 1.1s ease-in-out infinite",
  flexShrink: 0,
};

const recordingTimer: React.CSSProperties = {
  fontFamily:
    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "-0.01em",
  fontVariantNumeric: "tabular-nums",
  color: "#0A0A0A",
  flexShrink: 0,
};

const recordingHint: React.CSSProperties = {
  fontSize: 12,
  color: "#7F1D1D",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
