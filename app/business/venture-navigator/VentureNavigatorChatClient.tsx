"use client";

/**
 * VentureNavigatorChatClient — WhatsApp-styled demo chat for the Venture
 * Navigator founder-intake agent, with text AND voice.
 *
 * Text: type → /api/business/venture-navigator streams a reply (model
 *   fallback).
 * Voice: hold the mic → record → /api/.../transcribe (Gemini,
 *   auto-detects English vs Malayalam + correct script) →
 *   /api/business/venture-navigator in voice mode (agent replies in the
 *   matching language, TTS-friendly script) → /api/.../tts speaks it
 *   back → the reply auto-plays as a voice note.
 *
 * So a founder can pitch by typing or by speaking English/Malayalam and
 * hear the answer back in the same language — like a real WhatsApp
 * exchange with an investor's desk.
 *
 * Session memory: transcript persists in sessionStorage and is sent to
 * the API each turn. (Audio blob URLs are in-memory only — after a
 * reload a voice bubble degrades gracefully to its text.)
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
  // Voice-note metadata. `audioUrl` is an in-memory blob URL (gone after
  // reload); `voice.durationSec` drives the player label.
  voice?: { durationSec: number };
  audioUrl?: string;
  transcribing?: boolean;
  // Multi-note voice replies: a turn can be several short voice notes that
  // auto-play in sequence. `noteGroup` ties them together; `noteIndex` is
  // the play order within the group.
  noteGroup?: string;
  noteIndex?: number;
  ts: number;
};

// Split an agent reply into separate short voice notes (one per line). Most
// replies are a single line → one note.
function splitNotes(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const STORAGE_KEY = "vn.demo.v1";

const INTRO: Msg = {
  id: "intro",
  role: "assistant",
  content:
    "Hey 👋 You've reached Venture Navigator. I'm the intake assistant for Vivek M V — I take the first read on every founder so the strong ones reach him fast. So tell me: what are you building, and where are you right now? (Type it, or hold the mic and just pitch me.)",
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

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Read our minimal SSE protocol from a chat response; calls onDelta for
// each text chunk, resolves with the full text or an error code.
async function consumeChatStream(
  res: Response,
  onDelta: (chunk: string, full: string) => void,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!res.body) return { ok: false, error: "no_body" };
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
        // SSE: strip "data:" + exactly one delimiter space (not all
        // leading whitespace — that would eat real word-leading spaces).
        else if (line.startsWith("data:"))
          dataLines.push(line.slice(5).replace(/^ /, ""));
      }
      if (dataLines.length === 0) continue;
      const data = dataLines.join("\n");
      if (ev === "error") return { ok: false, error: data.trim() || "stream_error" };
      if (ev === "done") return { ok: true, text: acc };
      acc += data;
      onDelta(data, acc);
    }
  }
  return { ok: true, text: acc };
}

export default function VentureNavigatorChatClient() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voice recording state.
  const [isRecording, setIsRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [aiStatus, setAiStatus] = useState<"" | "typing…" | "recording audio…">(
    "",
  );
  // Which voice note should be playing right now (drives sequential
  // auto-play of a multi-note reply). Cleared when nothing is queued.
  const [playNote, setPlayNote] = useState<{ group: string; index: number } | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recStartRef = useRef<number>(0);
  const recTimerRef = useRef<number | null>(null);

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
    // Never persist the bare default (just the intro) — otherwise the
    // mount-time run of this effect (doubled by React Strict Mode in
    // dev) would clobber saved history before the hydration effect
    // loads it, losing the conversation on refresh.
    if (messages.length <= 1) return;
    // Don't persist live blob URLs (dead after reload) or pending flags.
    const safe = messages.map((m) => {
      const { audioUrl: _audioUrl, ...rest } = m;
      void _audioUrl;
      return { ...rest, pending: false, transcribing: false };
    });
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

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (recTimerRef.current) window.clearInterval(recTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  // ── Text send ──────────────────────────────────────────────────────
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
    const history = [...messages.filter((m) => m.id !== "intro" && m.content), userMsg].map(
      (m) => ({ role: m.role, content: m.content }),
    );
    setMessages((prev) => [...prev, userMsg, placeholder]);
    setSending(true);
    setAiStatus("typing…");

    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/business/venture-navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ac.signal,
      });
      if (!res.ok) {
        const nice = await niceHttpError(res);
        finalizeError(setMessages, setError, assistantId, nice);
        return;
      }
      const out = await consumeChatStream(res, (_chunk, full) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m)),
        );
      });
      if (out.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, pending: false, content: out.text } : m,
          ),
        );
      } else {
        finalizeError(
          setMessages,
          setError,
          assistantId,
          out.error === "overloaded_error"
            ? "The assistant is busy — tap send to retry."
            : "The reply got cut off — try again.",
          true,
        );
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      finalizeError(setMessages, setError, assistantId, "Network error — try again.");
    } finally {
      setSending(false);
      setAiStatus("");
      abortRef.current = null;
    }
  }, [draft, messages, sending]);

  // ── Voice recording ────────────────────────────────────────────────
  const stopTracks = useCallback(() => {
    if (recTimerRef.current) {
      window.clearInterval(recTimerRef.current);
      recTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || sending) return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Mic permission denied — you can still type.");
      return;
    }
    let rec: MediaRecorder;
    try {
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      rec = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      setError("Couldn't start recording on this browser.");
      return;
    }
    chunksRef.current = [];
    rec.addEventListener("dataavailable", (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    });
    rec.start();
    // Pre-warm Vivek's voice GPU now, while the founder speaks, so the
    // spoken reply comes back warm instead of cold-starting into text.
    void fetch("/api/business/venture-navigator/tts").catch(() => {});
    streamRef.current = stream;
    recorderRef.current = rec;
    recStartRef.current = Date.now();
    setRecSec(0);
    setIsRecording(true);
    setError(null);
    recTimerRef.current = window.setInterval(() => {
      const s = Math.floor((Date.now() - recStartRef.current) / 1000);
      setRecSec(s);
      if (s >= 90) {
        try {
          rec.stop();
        } catch {
          /* already stopped */
        }
      }
    }, 250);
  }, [isRecording, sending]);

  const cancelRecording = useCallback(() => {
    if (!isRecording) return;
    try {
      recorderRef.current?.stop();
    } catch {
      /* noop */
    }
    chunksRef.current = [];
    stopTracks();
    setIsRecording(false);
    setRecSec(0);
  }, [isRecording, stopTracks]);

  const sendRecording = useCallback(async () => {
    if (!isRecording) return;
    const rec = recorderRef.current;
    if (!rec) {
      cancelRecording();
      return;
    }
    const durationSec = Math.max(
      1,
      Math.floor((Date.now() - recStartRef.current) / 1000),
    );
    const blob: Blob = await new Promise((resolve) => {
      rec.addEventListener(
        "stop",
        () => resolve(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" })),
        { once: true },
      );
      try {
        rec.stop();
      } catch {
        resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      }
    });
    stopTracks();
    setIsRecording(false);
    setRecSec(0);
    if (blob.size === 0) {
      setError("Voice note was empty — try again.");
      return;
    }

    setError(null);
    setSending(true);

    // 1) User voice bubble (their own audio is playable immediately).
    const userId = `u-${Date.now()}`;
    const userBlobUrl = URL.createObjectURL(blob);
    setMessages((prev) => [
      ...prev,
      {
        id: userId,
        role: "user",
        content: "",
        voice: { durationSec },
        audioUrl: userBlobUrl,
        transcribing: true,
        ts: Date.now(),
      },
    ]);

    // 2) Transcribe via Gemini (reliable English/Malayalam detection +
    //    correct native script). Convert to 16kHz mono WAV first.
    let transcript = "";
    let lang = "";
    try {
      let uploadBlob = blob;
      try {
        uploadBlob = await blobToWav16k(blob);
      } catch {
        // Decode/resample failed — upload the original and let Gemini try.
      }
      const fd = new FormData();
      fd.append("file", uploadBlob, "voice.wav");
      const tr = await fetch("/api/business/venture-navigator/transcribe", {
        method: "POST",
        body: fd,
      });
      if (tr.ok) {
        const d = (await tr.json()) as { transcript?: string; language?: string };
        transcript = (d.transcript ?? "").trim();
        lang = d.language ?? "";
      } else {
        const d = (await tr.json().catch(() => ({}))) as { error?: string };
        const msg =
          d.error === "stt_not_configured"
            ? "Voice transcription isn't configured yet."
            : `Couldn't transcribe the audio (${tr.status}).`;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userId ? { ...m, transcribing: false, error: msg } : m,
          ),
        );
        setError(msg);
        setSending(false);
        return;
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userId
            ? { ...m, transcribing: false, error: "Couldn't reach transcription." }
            : m,
        ),
      );
      setSending(false);
      return;
    }

    if (!transcript) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userId
            ? { ...m, transcribing: false, error: "Couldn't make out the audio — try again." }
            : m,
        ),
      );
      setSending(false);
      return;
    }

    // 3) Show the transcript on the user bubble.
    setMessages((prev) =>
      prev.map((m) =>
        m.id === userId ? { ...m, transcribing: false, content: transcript } : m,
      ),
    );

    // 4) Ask the agent (voice mode) — header shows "recording audio…".
    const langShort = /^(ml|mal)/i.test(lang) || /[ഀ-ൿ]/.test(transcript) ? "ml" : "en";
    const history = [
      ...messages.filter((m) => m.id !== "intro" && m.content),
      { role: "user" as const, content: transcript },
    ].map((m) => ({ role: m.role, content: m.content }));

    const aiId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: "assistant", content: "", pending: true, ts: Date.now() },
    ]);
    setAiStatus("recording audio…");

    let replyText = "";
    try {
      const res = await fetch("/api/business/venture-navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, voice: true, lang: langShort }),
      });
      if (!res.ok) {
        finalizeError(setMessages, setError, aiId, await niceHttpError(res));
        setSending(false);
        setAiStatus("");
        return;
      }
      const out = await consumeChatStream(res, () => {});
      if (!out.ok) {
        finalizeError(
          setMessages,
          setError,
          aiId,
          "The assistant is busy — try again.",
          true,
        );
        setSending(false);
        setAiStatus("");
        return;
      }
      replyText = out.text.trim();
    } catch {
      finalizeError(setMessages, setError, aiId, "Network error — try again.");
      setSending(false);
      setAiStatus("");
      return;
    }

    // 5) Synthesize the reply as one or more short VOICE NOTES that auto-play
    //    in sequence. Notes are synthesized in PARALLEL, so the wait ≈ one
    //    note, not the sum. Voice turn → never fall back to text.
    setAiStatus("recording audio…");

    const parts = splitNotes(replyText);

    const synthOne = async (
      text: string,
    ): Promise<{ url: string; dur: number } | null> => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const tts = await fetch("/api/business/venture-navigator/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, lang: langShort }),
          });
          if (tts.ok) {
            const blob = await tts.blob();
            if (blob.size > 0) {
              const url = URL.createObjectURL(blob);
              const dur = await audioDuration(url).catch(() => 0);
              return { url, dur };
            }
          }
        } catch {
          /* retry — a failed cold-start attempt warms the GPU */
        }
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
      }
      return null;
    };

    const synthd = await Promise.all(parts.map((p) => synthOne(p)));
    const notes = parts
      .map((text, i) => ({ text, audio: synthd[i] }))
      .filter(
        (n): n is { text: string; audio: { url: string; dur: number } } =>
          !!n.audio,
      );

    // Voice turn: if nothing synthesized, surface it rather than silently
    // replying in text.
    if (notes.length === 0) {
      finalizeError(
        setMessages,
        setError,
        aiId,
        "Vivek's voice is warming up — record once more and it'll reply in his voice.",
        true,
      );
      setSending(false);
      setAiStatus("");
      return;
    }

    // Replace the single placeholder with one bubble per note. Note 0 carries
    // the full reply text (for chat history); the rest carry no text so they
    // stay out of history (the history builder filters on content).
    const noteMsgs: Msg[] = notes.map((n, i) => ({
      id: i === 0 ? aiId : `${aiId}-${i}`,
      role: "assistant" as const,
      content: i === 0 ? replyText : "",
      voice: { durationSec: n.audio.dur },
      audioUrl: n.audio.url,
      noteGroup: aiId,
      noteIndex: i,
      ts: Date.now() + i,
    }));
    setMessages((prev) => prev.flatMap((m) => (m.id === aiId ? noteMsgs : [m])));
    setPlayNote({ group: aiId, index: 0 }); // start sequential auto-play
    setSending(false);
    setAiStatus("");
  }, [cancelRecording, isRecording, messages, stopTracks]);

  // A voice note finished → advance to the next note in its group so the
  // reply plays as a sequence of short notes.
  const handleNoteEnded = useCallback((group?: string, index?: number) => {
    if (group && typeof index === "number") {
      setPlayNote({ group, index: index + 1 });
    }
  }, []);

  const headerStatus = isRecording ? "recording…" : aiStatus || "online";

  return (
    <div style={page}>
      <div style={frame}>
        <header style={header}>
          <div style={avatar}>VN</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={headerName}>Venture Navigator</div>
            <div style={headerStatusStyle}>{headerStatus}</div>
          </div>
          <span style={demoTag}>DEMO</span>
        </header>

        <div ref={scrollRef} style={chatArea}>
          <div style={dayChip}>
            <span style={dayChipInner}>Demo conversation</span>
          </div>
          {messages.map((m) => (
            <Bubble key={m.id} m={m} activeNote={playNote} onNoteEnded={handleNoteEnded} />
          ))}
        </div>

        {isRecording ? (
          <div style={composer} role="group" aria-label="Recording voice note">
            <button type="button" onClick={cancelRecording} aria-label="Cancel" style={recIconBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
            <div style={recBar}>
              <span style={recDot} aria-hidden />
              <span style={recTime}>{fmtDur(recSec)}</span>
              <span style={recHint}>Recording — tap ▶ to send</span>
            </div>
            <button type="button" onClick={() => void sendRecording()} aria-label="Send voice note" style={sendBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.6 22 12 3.4 3.4l-.5 7.1 13.8 1.5-13.8 1.5z" /></svg>
            </button>
          </div>
        ) : (
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
                placeholder={sending ? "Working…" : "Type a message"}
                disabled={sending}
                style={inputEl}
              />
            </div>
            {draft.trim() ? (
              <button type="submit" aria-label="Send" disabled={sending} style={{ ...sendBtn, opacity: sending ? 0.6 : 1 }}>
                {sending ? <Spinner /> : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.6 22 12 3.4 3.4l-.5 7.1 13.8 1.5-13.8 1.5z" /></svg>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startRecording()}
                aria-label="Record voice note"
                disabled={sending}
                style={{ ...sendBtn, opacity: sending ? 0.6 : 1 }}
              >
                {sending ? <Spinner /> : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                )}
              </button>
            )}
          </form>
        )}

        {error && <div style={errorBar}>{error}</div>}
      </div>
      <style>{`
        @keyframes vnspin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes vndot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes vnpulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        textarea::placeholder { color: #8696a0; }
      `}</style>
    </div>
  );
}

// Shared finalize-with-error helper for the assistant bubble.
function finalizeError(
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>,
  setError: (s: string | null) => void,
  id: string,
  msg: string,
  keepContent = false,
) {
  setMessages((prev) =>
    prev.map((m) =>
      m.id === id
        ? { ...m, pending: false, error: keepContent && m.content ? undefined : msg }
        : m,
    ),
  );
  setError(msg);
}

async function niceHttpError(res: Response): Promise<string> {
  let detail = "";
  try {
    detail = ((await res.json()) as { error?: string }).error ?? "";
  } catch {
    /* not json */
  }
  if (res.status === 429) return "You're going quickly — give it a few seconds.";
  if (detail === "demo_not_configured") return "The demo isn't configured yet.";
  if (detail === "all_models_overloaded")
    return "The assistant is busy right now — try again in a moment.";
  return "Something went wrong. Try again.";
}

// Convert a recorded blob (webm/opus on Chrome, mp4/aac on Safari) into
// 16kHz mono WAV — a format Gemini reliably accepts for transcription.
// We decode via the browser's native decoders, resample with an
// OfflineAudioContext, then write a PCM16 WAV by hand (no deps).
async function blobToWav16k(blob: Blob): Promise<Blob> {
  const arrayBuf = await blob.arrayBuffer();
  const AudioCtx: typeof AudioContext =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const decodeCtx = new AudioCtx();
  const decoded = await decodeCtx.decodeAudioData(arrayBuf);
  void decodeCtx.close();

  const targetRate = 16000;
  const frames = Math.max(1, Math.ceil(decoded.duration * targetRate));
  const offline = new OfflineAudioContext(1, frames, targetRate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start();
  const rendered = await offline.startRendering();
  const samples = rendered.getChannelData(0);

  const dataLen = samples.length * 2;
  const ab = new ArrayBuffer(44 + dataLen);
  const view = new DataView(ab);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataLen, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, "data");
  view.setUint32(40, dataLen, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([ab], { type: "audio/wav" });
}

function audioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const a = new Audio();
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      const d = a.duration;
      resolve(Number.isFinite(d) ? Math.max(1, Math.round(d)) : 0);
    };
    a.onerror = () => reject(new Error("audio meta failed"));
    a.src = url;
  });
}

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden style={{ animation: "vnspin 0.9s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ── Bubble ──────────────────────────────────────────────────────────
function Bubble({
  m,
  activeNote,
  onNoteEnded,
}: {
  m: Msg;
  activeNote?: { group: string; index: number } | null;
  onNoteEnded?: (group?: string, index?: number) => void;
}) {
  const isUser = m.role === "user";
  // A note bubble only auto-plays when it's the active note in its group;
  // a non-note voice bubble keeps the old "play when ready" behavior.
  const isActiveNote =
    !!m.noteGroup &&
    activeNote?.group === m.noteGroup &&
    activeNote?.index === m.noteIndex;

  if (m.error) {
    return (
      <div style={{ ...rowStyle, justifyContent: "center" }}>
        <div style={errBubble}>{m.error}</div>
      </div>
    );
  }

  // Plain typing dots (text reply waiting / voice being prepared).
  if (m.pending && !m.content && !m.voice) {
    return (
      <div style={{ ...rowStyle, justifyContent: "flex-start" }}>
        <div style={{ ...bubbleBase, ...inBubble, display: "inline-flex", gap: 4, alignItems: "center", padding: "12px 14px" }}>
          <Dot d="0s" /><Dot d="0.15s" /><Dot d="0.3s" />
        </div>
      </div>
    );
  }

  const isVoice = !!m.voice;

  return (
    <div style={{ ...rowStyle, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={{ ...bubbleBase, ...(isUser ? outBubble : inBubble) }}>
        {isVoice ? (
          // Authentic WhatsApp voice note — just the player, no transcript
          // text. (The transcript still lives in `content` for the chat
          // history sent to the API; it's simply not shown.)
          <VoicePlayer
            url={m.audioUrl}
            durationSec={m.voice!.durationSec}
            autoPlay={
              !isUser && !!m.audioUrl && (m.noteGroup ? isActiveNote : true)
            }
            onEnded={
              m.noteGroup
                ? () => onNoteEnded?.(m.noteGroup, m.noteIndex)
                : undefined
            }
            tint={isUser ? "#1fa855" : "#54656f"}
            transcribing={m.transcribing}
          />
        ) : m.content ? (
          <span style={bubbleText}>{m.content}</span>
        ) : null}
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

// Fixed decorative waveform heights (percent of track height).
const WAVE = [30, 55, 80, 45, 65, 90, 40, 70, 50, 85, 35, 60, 75, 45, 95, 55, 40, 70, 50, 30, 65, 45, 80, 35];

function VoicePlayer({
  url,
  durationSec,
  autoPlay,
  onEnded,
  tint,
  transcribing,
}: {
  url?: string;
  durationSec: number;
  autoPlay?: boolean;
  onEnded?: () => void;
  tint: string;
  transcribing?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [elapsed, setElapsed] = useState(0);
  const autoPlayedRef = useRef(false);

  useEffect(() => {
    if (!url || !autoPlay || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const a = audioRef.current;
    if (a) a.play().catch(() => { /* autoplay blocked — user can tap */ });
  }, [url, autoPlay]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 200 }}>
      <button
        type="button"
        onClick={toggle}
        disabled={!url}
        aria-label={playing ? "Pause" : "Play"}
        style={{
          width: 34, height: 34, borderRadius: "50%", border: "none",
          background: tint, color: "#fff", flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: url ? "pointer" : "default", opacity: url ? 1 : 0.5,
        }}
      >
        {transcribing ? (
          <Spinner />
        ) : playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, height: 26 }}>
        {WAVE.map((h, i) => {
          const played = i / WAVE.length <= progress;
          return (
            <span key={i} style={{ flex: 1, height: `${h}%`, minWidth: 2, borderRadius: 2, background: played ? tint : "rgba(0,0,0,0.18)" }} />
          );
        })}
      </div>
      <span style={{ fontSize: 11, color: "#667781", flexShrink: 0, minWidth: 30, textAlign: "right" }}>
        {fmtDur(playing ? elapsed : durationSec || 0)}
      </span>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0); setElapsed(0); onEnded?.(); }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            if (a.duration && Number.isFinite(a.duration)) {
              setProgress(a.currentTime / a.duration);
              setElapsed(a.currentTime);
            }
          }}
        />
      )}
    </div>
  );
}

function Dot({ d }: { d: string }) {
  return (
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#90a4ae", display: "inline-block", animation: `vndot 1.2s ${d} infinite ease-in-out` }} />
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
  fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};
const frame: React.CSSProperties = {
  width: "100%", maxWidth: 480, display: "flex", flexDirection: "column",
  height: "100dvh", background: WA_BG, position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.4)",
};
const header: React.CSSProperties = {
  flexShrink: 0, display: "flex", alignItems: "center", gap: 12,
  padding: "10px 14px", background: WA_HEADER, color: "#fff",
};
const avatar: React.CSSProperties = {
  width: 40, height: 40, borderRadius: "50%", background: "#128C7E",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", flexShrink: 0,
};
const headerName: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
};
const headerStatusStyle: React.CSSProperties = { fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 1 };
const demoTag: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 7px",
  borderRadius: 6, background: "rgba(255,255,255,0.18)", color: "#fff",
};
const chatArea: React.CSSProperties = {
  flex: 1, overflowY: "auto", padding: "14px 12px 16px", display: "flex", flexDirection: "column", gap: 4,
  backgroundColor: WA_BG,
  backgroundImage: "radial-gradient(rgba(0,0,0,0.022) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.018) 1px, transparent 1px)",
  backgroundSize: "26px 26px, 26px 26px", backgroundPosition: "0 0, 13px 13px",
};
const dayChip: React.CSSProperties = { display: "flex", justifyContent: "center", margin: "2px 0 10px" };
const dayChipInner: React.CSSProperties = {
  fontSize: 12, color: "#54656f", background: "#ffffffcc", padding: "5px 12px", borderRadius: 8, boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
};
const rowStyle: React.CSSProperties = { display: "flex", width: "100%", margin: "1px 0" };
const bubbleBase: React.CSSProperties = {
  position: "relative", maxWidth: "85%", padding: "6px 9px 8px 10px", borderRadius: 8,
  fontSize: 14.5, lineHeight: 1.4, color: "#111b21", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
  wordBreak: "break-word", whiteSpace: "pre-wrap",
};
const inBubble: React.CSSProperties = { background: "#ffffff", borderTopLeftRadius: 0 };
const outBubble: React.CSSProperties = { background: WA_OUT, borderTopRightRadius: 0 };
const tailIn: React.CSSProperties = { position: "absolute", top: 0, left: -8, width: 0, height: 0, borderTop: "8px solid #ffffff", borderLeft: "8px solid transparent" };
const tailOut: React.CSSProperties = { position: "absolute", top: 0, right: -8, width: 0, height: 0, borderTop: `8px solid ${WA_OUT}`, borderRight: "8px solid transparent" };
const bubbleText: React.CSSProperties = { display: "inline" };
const metaRow: React.CSSProperties = { float: "right", display: "inline-flex", alignItems: "center", marginLeft: 8, marginTop: 4, transform: "translateY(3px)" };
const timeText: React.CSSProperties = { fontSize: 11, color: "#667781" };
const errBubble: React.CSSProperties = {
  fontSize: 12.5, color: "#7f1d1d", background: "#fff1f0", border: "1px solid #fca5a5",
  padding: "7px 12px", borderRadius: 8, maxWidth: "85%", textAlign: "center",
};
const composer: React.CSSProperties = {
  flexShrink: 0, display: "flex", alignItems: "flex-end", gap: 8, padding: "8px 10px", background: "#f0f2f5",
};
const inputPill: React.CSSProperties = {
  flex: 1, background: "#fff", borderRadius: 22, padding: "8px 14px", display: "flex", alignItems: "center", boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
};
const inputEl: React.CSSProperties = {
  flex: 1, border: "none", outline: "none", resize: "none", fontSize: 15, lineHeight: 1.4,
  fontFamily: "inherit", color: "#111b21", maxHeight: 110, background: "transparent",
};
const sendBtn: React.CSSProperties = {
  flexShrink: 0, width: 46, height: 46, borderRadius: "50%", border: "none", background: WA_HEADER, color: "#fff",
  display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "opacity 140ms ease", cursor: "pointer",
};
const recIconBtn: React.CSSProperties = {
  flexShrink: 0, width: 46, height: 46, borderRadius: "50%", border: "none", background: "transparent",
  display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};
const recBar: React.CSSProperties = {
  flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 22,
  background: "#fff", color: "#d32f2f", boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
};
const recDot: React.CSSProperties = { width: 10, height: 10, borderRadius: "50%", background: "#d32f2f", animation: "vnpulse 1.1s ease-in-out infinite", flexShrink: 0 };
const recTime: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "#111b21", fontVariantNumeric: "tabular-nums", flexShrink: 0 };
const recHint: React.CSSProperties = { fontSize: 12.5, color: "#667781", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
const errorBar: React.CSSProperties = {
  position: "absolute", bottom: 70, left: 12, right: 12, textAlign: "center", fontSize: 12, color: "#7f1d1d",
  background: "#fff1f0", border: "1px solid #fca5a5", borderRadius: 8, padding: "6px 10px", pointerEvents: "none",
};
