"use client";

/**
 * WhatsApp-style manager chat. Ehsan sends a voice message (or types) →
 * we transcribe via /api/transcribe → send the conversation to
 * /api/admin/assistant, which can create/update tasks or summarize, and
 * replies in text.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { id: string; role: "user" | "assistant"; text: string; voice?: boolean; error?: boolean };

let _id = 0;
const nextId = () => `m${++_id}`;

export default function AssistantChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false); // waiting on AI reply
  const [transcribing, setTranscribing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("audio/webm");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, transcribing]);

  const send = useCallback(
    async (text: string, viaVoice: boolean) => {
      const clean = text.trim();
      if (!clean || busy) return;
      const userMsg: Msg = { id: nextId(), role: "user", text: clean, voice: viaVoice };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setBusy(true);
      try {
        const res = await fetch("/api/admin/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.text })) }),
        });
        const json = await res.json();
        if (!res.ok) {
          setMessages((p) => [...p, { id: nextId(), role: "assistant", text: json.error || "Something went wrong.", error: true }]);
        } else {
          setMessages((p) => [...p, { id: nextId(), role: "assistant", text: json.reply || "Done." }]);
        }
      } catch {
        setMessages((p) => [...p, { id: nextId(), role: "assistant", text: "Network error — try again.", error: true }]);
      } finally {
        setBusy(false);
      }
    },
    [messages, busy],
  );

  const handleAudio = useCallback(
    async (blob: Blob) => {
      setTranscribing(true);
      setHint(null);
      try {
        const ext = mimeRef.current.includes("mp4") ? "m4a" : "webm";
        const fd = new FormData();
        fd.append("file", blob, `voice-note.${ext}`);
        const res = await fetch("/api/transcribe", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          setHint(json.message || "Couldn't transcribe that. Try again or type instead.");
          return;
        }
        const transcript = (json.transcript || "").trim();
        if (!transcript) {
          setHint("Didn't catch that — try speaking again.");
          return;
        }
        await send(transcript, true);
      } catch {
        setHint("Couldn't process the recording.");
      } finally {
        setTranscribing(false);
      }
    },
    [send],
  );

  const startRecording = useCallback(async () => {
    setHint(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mime = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm")) mime = "audio/webm";
        else if (MediaRecorder.isTypeSupported("audio/mp4")) mime = "audio/mp4";
      }
      mimeRef.current = mime || "audio/webm";
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        if (blob.size > 0) handleAudio(blob);
      };
      mr.start();
      recorderRef.current = mr;
      setRecording(true);
    } catch {
      setHint("Microphone blocked. Allow mic access (or just type your message).");
    }
  }, [handleAudio]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }, []);

  const micDisabled = busy || transcribing;

  return (
    <div style={shell}>
      {/* Header */}
      <div style={header}>
        <div style={avatar}>🤖</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Manager Assistant</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            {recording ? "recording…" : transcribing ? "transcribing…" : busy ? "typing…" : "voice or text · manages your team"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={chatArea}>
        <div style={welcomeBubble}>
          👋 Send a <b>voice message</b> or type. Try:
          <div style={{ marginTop: 6, fontStyle: "italic", color: "#444" }}>
            “Create a task for Ramesh to call the supplier, urgent, due tomorrow.”<br />
            “Mark the Dubai order as done.”<br />
            “What did the team do today?”
          </div>
        </div>

        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={m.role === "user" ? userBubble : m.error ? errorBubble : aiBubble}>
              {m.voice && <span style={{ marginRight: 6, opacity: 0.7 }}>🎤</span>}
              {m.text}
            </div>
          </div>
        ))}

        {(busy || transcribing) && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ ...aiBubble, color: "#888" }}>…</div>
          </div>
        )}
      </div>

      {hint && <div style={hintBar}>{hint}</div>}

      {/* Input bar */}
      <div style={inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input, false);
          }}
          placeholder={recording ? "Recording… tap the mic to stop" : "Type a message"}
          disabled={recording || busy}
          style={textField}
        />
        {input.trim() ? (
          <button type="button" onClick={() => send(input, false)} disabled={busy} style={sendBtn} aria-label="Send">
            ➤
          </button>
        ) : (
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={micDisabled}
            style={recording ? micBtnRecording : micBtn}
            aria-label={recording ? "Stop recording" : "Record voice message"}
          >
            {recording ? "■" : "🎤"}
          </button>
        )}
      </div>
    </div>
  );
}

/* WhatsApp-ish styles */
const shell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "min(72vh, 720px)",
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid rgba(17,24,39,0.10)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  background: "#ECE5DD",
};
const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  background: "#075E54",
  color: "white",
};
const avatar: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 999,
  background: "rgba(255,255,255,0.18)",
  display: "grid",
  placeItems: "center",
  fontSize: 20,
};
const chatArea: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  backgroundImage: "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 0)",
  backgroundSize: "20px 20px",
};
const bubbleBase: React.CSSProperties = {
  maxWidth: "78%",
  padding: "9px 13px",
  borderRadius: 12,
  fontSize: 14.5,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
};
const userBubble: React.CSSProperties = { ...bubbleBase, background: "#D9FDD3", color: "#0A0A0A", borderTopRightRadius: 3 };
const aiBubble: React.CSSProperties = { ...bubbleBase, background: "white", color: "#0A0A0A", borderTopLeftRadius: 3 };
const errorBubble: React.CSSProperties = { ...bubbleBase, background: "#FDECEA", color: "#B91C1C", borderTopLeftRadius: 3 };
const welcomeBubble: React.CSSProperties = { ...bubbleBase, alignSelf: "center", maxWidth: "92%", background: "#FFF7D6", color: "#5b4b00", textAlign: "left" };
const hintBar: React.CSSProperties = { padding: "8px 16px", background: "#FDECEA", color: "#B91C1C", fontSize: 13 };
const inputBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 10,
  background: "#F0F0F0",
};
const textField: React.CSSProperties = {
  flex: 1,
  height: 42,
  padding: "0 16px",
  borderRadius: 999,
  border: "none",
  outline: "none",
  fontSize: 14.5,
  background: "white",
  color: "#0A0A0A",
};
const roundBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "none",
  color: "white",
  fontSize: 18,
  cursor: "pointer",
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
};
const sendBtn: React.CSSProperties = { ...roundBtn, background: "#075E54" };
const micBtn: React.CSSProperties = { ...roundBtn, background: "#128C7E" };
const micBtnRecording: React.CSSProperties = { ...roundBtn, background: "#DC2626", animation: "none" };
