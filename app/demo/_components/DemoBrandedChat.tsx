"use client";

/**
 * DemoBrandedChat — shared inline chat used on every prospect-specific
 * demo route under /demo/<slug>. Same UI everywhere; brand identity (the
 * avatar initials, the header label, and the footer line) is passed as
 * props so adding a new prospect doesn't fork this whole component.
 *
 * Mirrors the production SkilliesChatWidget design (dark-green header,
 * red user bubbles, cream agent bubbles, mic + image-upload + text input).
 *
 * Modes:
 *   - text  (default · websocket + textOnly:true · no mic permission)
 *   - voice (mic via WebRTC · uses the agent's configured voice)
 *
 * Image upload via uploadFile() → sendMultimodalMessage({fileId, text})
 * works in both modes. Auto-starts the session in text mode on mount so
 * the visitor sees the agent's first_message immediately. Switching to
 * voice ends the websocket session and opens a fresh WebRTC one.
 */

import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "agent" | "system";
  text?: string;
  imagePreviewUrl?: string;
  /** Voice-note metadata · the blobUrl is in-memory only (won't survive
   * a reload), but durationSec + transcript are persisted to sessionStorage
   * so the bubble still reads sensibly after refresh. */
  audio?: {
    blobUrl?: string;
    durationSec: number;
    transcript?: string;
  };
  ts: number;
};

export type DemoBrandedChatProps = {
  agentId: string;
  /** 2–3 character monogram in the header avatar, e.g. "VN", "AG". */
  avatar: string;
  /** Header label, e.g. "Venture Navigator · Founder Screener". */
  label: string;
  /** Footer line shown below the input bar. */
  footer: string;
};

export default function DemoBrandedChat(props: DemoBrandedChatProps) {
  return (
    <ConversationProvider>
      <ChatUI {...props} />
    </ConversationProvider>
  );
}

// SessionStorage key per agent · scoped per prospect demo. Cleared when
// the user closes the tab (better privacy default than localStorage),
// preserved across reloads in the same tab.
function storageKeyFor(agentId: string): string {
  return `demo_chat_${agentId}_v1`;
}

function ChatUI({ agentId, avatar, label, footer }: DemoBrandedChatProps) {
  // Hydrate messages from sessionStorage on first render (lazy initializer
  // so we don't pay the cost on every re-render).
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.sessionStorage.getItem(storageKeyFor(agentId));
      if (!saved) return [];
      const parsed = JSON.parse(saved) as ChatMessage[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState("");
  // Single transport · always websocket + textOnly. Voice-notes are
  // recorded on the device and uploaded as an audio attachment, so the
  // agent's session never needs a mic stream or WebRTC.
  const [connected, setConnected] = useState(false);
  // True after a user message is sent, until the next agent message arrives.
  // Drives the typing indicator below the messages list.
  const [expectingResponse, setExpectingResponse] = useState(false);
  // Voice-note recording state · isRecording flips on while the user
  // holds the mic; durationSec is updated by an interval so the UI
  // shows a live counter.
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState(0);
  // Set to true while we're uploading + transcribing the just-finished
  // recording, so the input shows a "Sending voice note…" pill instead
  // of the recording controls or the bare textarea.
  const [sendingVoiceNote, setSendingVoiceNote] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    fileId: string;
    previewUrl: string;
  } | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const startedRef = useRef(false);
  const pendingSendsRef = useRef<Array<{ text?: string; fileId?: string }>>([]);
  // Recording-session refs · MediaRecorder, the captured chunks, the
  // mic MediaStream we need to release on stop, and the start timestamp.
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartMsRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);
  // Reset to false every time we kick off a new session; flipped to true
  // once we've sent the prior-transcript bootstrap into the new session.
  // That way mode switches and reloads don't lose context.
  const bootstrappedSessionRef = useRef(false);

  const appendMessage = useCallback(
    (m: Omit<ChatMessage, "id" | "ts">) => {
      setMessages((prev) => [
        ...prev,
        {
          ...m,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ts: Date.now(),
        },
      ]);
    },
    [],
  );

  const conversation = useConversation({
    onConnect: () => setConnected(true),
    onDisconnect: () => setConnected(false),
    onError: (msg) => {
      appendMessage({
        role: "system",
        text: `Connection error: ${typeof msg === "string" ? msg : "unknown"}`,
      });
      setExpectingResponse(false);
    },
    onMessage: ({ message, role }) => {
      if (!message) return;
      if (role === "user") {
        // The agent echoes user text back via onMessage in some configs;
        // skip if the last local message already matches.
        const last = messagesRef.current[messagesRef.current.length - 1];
        if (last?.role === "user" && last.text === message) return;
        appendMessage({ role: "user", text: message });
      } else {
        appendMessage({ role: "agent", text: message });
        setExpectingResponse(false);
      }
    },
  });

  // Persist messages to sessionStorage so a tab reload (or mode switch
  // tearing down React state) doesn't lose what the user already saw.
  // We strip the in-memory blob URLs from audio messages before persisting
  // (URLs reference runtime Blob refs that won't survive); the transcript
  // and durationSec stay so the bubble still reads sensibly after refresh.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const persistable = messages.map((m) =>
        m.audio
          ? {
              ...m,
              audio: {
                durationSec: m.audio.durationSec,
                transcript: m.audio.transcript,
              },
            }
          : m,
      );
      window.sessionStorage.setItem(
        storageKeyFor(agentId),
        JSON.stringify(persistable),
      );
    } catch {
      /* sessionStorage may be full or disabled · ignore */
    }
  }, [agentId, messages]);

  // Bootstrap each new session with the prior transcript so the agent
  // remembers the conversation across reloads. Voice notes are
  // represented in the transcript by their text transcription.
  useEffect(() => {
    if (conversation.status !== "connected") return;
    if (bootstrappedSessionRef.current) return;
    bootstrappedSessionRef.current = true;

    const real = messagesRef.current.filter((m) => {
      if (m.role === "system") return false;
      const hasText = (m.text ?? "").trim().length > 0;
      const hasAudioTranscript =
        (m.audio?.transcript ?? "").trim().length > 0;
      return hasText || hasAudioTranscript;
    });
    if (real.length === 0) return;

    const transcript = real
      .map((m) => {
        const speaker = m.role === "user" ? "User" : "Agent";
        const body =
          m.text ?? m.audio?.transcript ?? "(voice note · empty transcript)";
        return `${speaker}: ${body}`;
      })
      .join("\n");

    try {
      conversation.sendContextualUpdate(
        `[Resuming an in-progress conversation in this session. Use this transcript as your memory of what's already been said. Do NOT greet again or restart the screener · pick up exactly where the conversation left off.]\n\n${transcript}`,
      );
    } catch {
      /* SDK may not support contextual updates in some session types */
    }
  }, [conversation, conversation.status]);

  // Single transport · always websocket + textOnly. Voice notes are
  // recorded on-device and uploaded as attachments, so the live session
  // never needs WebRTC or a mic stream.
  const startSession = useCallback(() => {
    bootstrappedSessionRef.current = false;
    try {
      conversation.startSession({
        agentId,
        connectionType: "websocket",
        overrides: { conversation: { textOnly: true } },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "couldn't start session";
      appendMessage({ role: "system", text: msg });
    }
  }, [agentId, appendMessage, conversation]);

  // Auto-start the session on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startSession();
    return () => {
      try {
        conversation.endSession();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flush queued sends once the session is connected.
  useEffect(() => {
    if (conversation.status !== "connected") return;
    if (pendingSendsRef.current.length === 0) return;
    const queue = pendingSendsRef.current.splice(0);
    for (const item of queue) {
      try {
        if (item.fileId) {
          conversation.sendMultimodalMessage({
            text: item.text,
            fileId: item.fileId,
          });
        } else if (item.text) {
          conversation.sendUserMessage(item.text);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "send failed";
        appendMessage({ role: "system", text: msg });
      }
    }
  }, [appendMessage, conversation, conversation.status]);

  // Auto-scroll on new messages or when the typing indicator appears.
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, expectingResponse]);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text && !pendingImage) return;
    setDraft("");

    appendMessage({
      role: "user",
      text: text || undefined,
      imagePreviewUrl: pendingImage?.previewUrl,
    });

    const payload: { text?: string; fileId?: string } = {};
    if (text) payload.text = text;
    if (pendingImage) payload.fileId = pendingImage.fileId;

    if (conversation.status === "connected") {
      try {
        if (payload.fileId) {
          conversation.sendMultimodalMessage(payload);
        } else if (payload.text) {
          conversation.sendUserMessage(payload.text);
        }
        setExpectingResponse(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "send failed";
        appendMessage({ role: "system", text: msg });
      }
      setPendingImage(null);
      return;
    }

    pendingSendsRef.current.push(payload);
    setExpectingResponse(true);
    setPendingImage(null);
  }, [appendMessage, conversation, draft, pendingImage]);

  const handleImagePick = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        appendMessage({
          role: "system",
          text: "Only images are supported here.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        appendMessage({ role: "system", text: "Image too large (max 10 MB)." });
        return;
      }
      setUploadingImage(true);
      try {
        // The SDK uploadFile awaits; if status isn't connected yet, it
        // returns a promise that the SDK queues internally.
        const result = await conversation.uploadFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPendingImage({ fileId: result.fileId, previewUrl });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "upload failed";
        appendMessage({ role: "system", text: `Image upload failed: ${msg}` });
      } finally {
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [appendMessage, conversation],
  );

  // ─── Voice notes (WhatsApp-style) ───────────────────────────────────
  // Tap mic → start recording (request mic perm if not granted yet) →
  // tick the duration counter → user taps cancel or send.
  // On send · stop the recorder, get the Blob, POST to /api/demo/transcribe
  // for a transcript, render an audio bubble locally with playback +
  // transcript, send the transcript to the agent so it can respond.
  // Why local transcription rather than uploading audio to Convai:
  // Convai's text-only websocket session reliably handles text input but
  // multimodal-audio in textOnly mode is poorly documented. Transcribing
  // ourselves is the safer path · we get a guaranteed text input the
  // agent can reason over, and the visual audio bubble is just UX polish.

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
    if (isRecording || sendingVoiceNote) return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      appendMessage({
        role: "system",
        text: "Mic permission was denied. You can still type.",
      });
      return;
    }
    let recorder: MediaRecorder;
    try {
      // Prefer opus-in-webm (broad browser support, small files); the
      // default mime works on iOS Safari which doesn't support webm.
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
    } catch (e) {
      stream.getTracks().forEach((t) => t.stop());
      const msg = e instanceof Error ? e.message : "recorder unavailable";
      appendMessage({ role: "system", text: `Couldn't record: ${msg}` });
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

    // Live duration counter · also enforces a 90s safety cap.
    durationIntervalRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - recordingStartMsRef.current) / 1000);
      setRecordingDurationSec(sec);
      if (sec >= 90) {
        // Auto-stop and prompt to send.
        recorder.stop();
      }
    }, 250);
  }, [appendMessage, isRecording, sendingVoiceNote]);

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

    // Stop the recorder and wait for the final dataavailable event.
    const finalBlob: Blob = await new Promise((resolve) => {
      recorder.addEventListener(
        "stop",
        () => {
          const mime = recorder.mimeType || "audio/webm";
          const blob = new Blob(audioChunksRef.current, { type: mime });
          resolve(blob);
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
      appendMessage({ role: "system", text: "Voice note was empty." });
      return;
    }

    setSendingVoiceNote(true);
    const blobUrl = URL.createObjectURL(finalBlob);

    // Optimistically render the audio bubble immediately.
    const placeholderId = `pending-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: placeholderId,
        role: "user",
        ts: Date.now(),
        audio: { blobUrl, durationSec, transcript: undefined },
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
        };
        appendMessage({
          role: "system",
          text:
            data.error === "stt_not_configured"
              ? "Voice transcription isn't configured on the server yet."
              : `Voice transcription failed (${res.status}).`,
        });
      }
    } catch {
      appendMessage({
        role: "system",
        text: "Couldn't reach the transcription service.",
      });
    }

    // Patch the audio bubble with the transcript (if any).
    setMessages((prev) =>
      prev.map((m) =>
        m.id === placeholderId && m.audio
          ? {
              ...m,
              audio: { ...m.audio, transcript: transcript || undefined },
            }
          : m,
      ),
    );

    if (transcript) {
      // Send to the agent. Wrapped in a marker so the agent knows it
      // came from a voice note (helps the agent acknowledge medium).
      const payload = `[Voice note · ${durationSec}s] ${transcript}`;
      if (conversation.status === "connected") {
        try {
          conversation.sendUserMessage(payload);
          setExpectingResponse(true);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "send failed";
          appendMessage({ role: "system", text: msg });
        }
      } else {
        pendingSendsRef.current.push({ text: payload });
        setExpectingResponse(true);
      }
    }
    setSendingVoiceNote(false);
  }, [
    appendMessage,
    cancelRecording,
    conversation,
    isRecording,
    stopMediaTracks,
  ]);

  // Cleanup on unmount · stop recorder + release mic if user navigates away.
  useEffect(() => {
    return () => {
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        /* noop */
      }
      stopMediaTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset · clears messages and storage, ends the live session, restarts
  // a fresh one in text mode. Useful for re-testing the demo flow without
  // closing the tab. Confirms before wiping in case it was an accidental
  // click.
  const resetConversation = useCallback(() => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Reset the demo? This clears the conversation and starts fresh.",
      );
      if (!ok) return;
      try {
        window.sessionStorage.removeItem(storageKeyFor(agentId));
      } catch {
        /* ignore */
      }
    }
    setMessages([]);
    setExpectingResponse(false);
    setPendingImage(null);
    setDraft("");
    try {
      conversation.endSession();
    } catch {
      /* noop */
    }
    startSession();
  }, [agentId, conversation, startSession]);

  const status = conversation.status;

  const headerStatus = useMemo(() => {
    if (isRecording) return "Recording voice note…";
    if (sendingVoiceNote) return "Sending voice note…";
    if (status === "connected" || connected) return "Online";
    if (status === "connecting") return "Connecting…";
    return "Ready when you are";
  }, [connected, isRecording, sendingVoiceNote, status]);

  return (
    <div
      style={{
        background: "#FAF5EB",
        border: "1px solid #F0E8D8",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 24px 48px rgba(31,58,46,.10),0 4px 12px rgba(31,58,46,.05)",
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        // Center + cap width so the panel reads like a real WhatsApp/iMessage
        // view rather than spanning the full container on desktop.
        width: "100%",
        maxWidth: 560,
        marginLeft: "auto",
        marginRight: "auto",
        // Min keeps the panel useful before any messages exist; max prevents
        // it from dominating the page when the conversation grows.
        minHeight: 460,
        maxHeight: "min(640px, 78vh)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          background: "linear-gradient(135deg,#1F3A2E 0%,#142821 100%)",
          color: "#FAF5EB",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
            boxShadow: "0 0 0 2px rgba(250,245,235,.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FAF5EB",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.04em",
          }}
        >
          {avatar}
          {isRecording ? (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid #C9A24E",
                animation:
                  "demo-chat-pulse 1.4s cubic-bezier(0,0,.2,1) infinite",
              }}
            />
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
            {label}
          </div>
          <div
            style={{
              fontSize: 11,
              marginTop: 2,
              color: "rgba(250,245,235,.7)",
            }}
          >
            {headerStatus}
          </div>
        </div>
        {/* Reset · clears conversation + starts fresh. Only meaningful
            once the user has actually sent something. */}
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={resetConversation}
            aria-label="Reset conversation"
            title="Reset conversation"
            style={{
              padding: "6px 10px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              background: "rgba(250,245,235,0.10)",
              color: "#FAF5EB",
              border: "1px solid rgba(250,245,235,0.18)",
              borderRadius: 999,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Reset
          </button>
        ) : null}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "#FAF5EB",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              color: "#9CA3AF",
              fontSize: 13,
              fontStyle: "italic",
              textAlign: "center",
              margin: "auto",
              padding: 20,
            }}
          >
            Connecting…
          </div>
        ) : (
          messages.map((m) => <MessageRow key={m.id} message={m} />)
        )}
        {expectingResponse ? <TypingDots /> : null}
      </div>

      {/* Pending-image preview */}
      {pendingImage ? (
        <div
          style={{
            padding: "10px 16px",
            background: "#FFFFFF",
            borderTop: "1px solid #F0E8D8",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src={pendingImage.previewUrl}
            alt="Pending attachment"
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #F0E8D8",
            }}
          />
          <div style={{ flex: 1, fontSize: 12, color: "#6B7280" }}>
            Attached image · sends with your next message
          </div>
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(pendingImage.previewUrl);
              setPendingImage(null);
            }}
            style={{
              padding: "4px 10px",
              fontSize: 11,
              border: "1px solid #E5E7EB",
              borderRadius: 999,
              background: "white",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            Remove
          </button>
        </div>
      ) : null}

      {/* Input bar · either the recording UI or the normal text+buttons row. */}
      <div
        style={{
          padding: "12px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: "1px solid #F0E8D8",
          background: "#FFFFFF",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleImagePick(f);
          }}
        />
        {isRecording ? (
          <>
            {/* Cancel · discards the recording. */}
            <IconButton
              ariaLabel="Cancel voice note"
              onClick={cancelRecording}
              variant="ghost"
            >
              <CrossIcon />
            </IconButton>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: "#FBE9EA",
                borderRadius: 12,
                border: "1px solid #F2C4C7",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#C62828",
                  animation:
                    "demo-recording-pulse 1.2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#8B1A1A",
                  letterSpacing: "0.02em",
                }}
              >
                Recording · {formatDuration(recordingDurationSec)}
              </span>
            </div>
            <IconButton
              ariaLabel="Send voice note"
              onClick={sendRecording}
              variant="primary"
            >
              <SendIcon />
            </IconButton>
          </>
        ) : sendingVoiceNote ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "10px 14px",
              background: "#FAF5EB",
              borderRadius: 12,
              border: "1px solid #F0E8D8",
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            <Spinner />
            Sending voice note…
          </div>
        ) : (
          <>
            <IconButton
              ariaLabel="Upload an image"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              variant="ghost"
            >
              {uploadingImage ? <Spinner /> : <ImageIcon />}
            </IconButton>
            <IconButton
              ariaLabel="Record a voice note"
              onClick={startRecording}
              variant="ghost"
            >
              <MicIcon active={false} />
            </IconButton>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                pendingImage
                  ? "Add a caption (optional) and press Enter…"
                  : "Type a message or record a voice note…"
              }
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                outline: "none",
                fontSize: 14,
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAF5EB",
                color: "#1A1A1A",
                border: "1px solid #F0E8D8",
                fontFamily: "inherit",
                maxHeight: 120,
                lineHeight: 1.4,
              }}
            />
            <IconButton
              ariaLabel="Send"
              onClick={handleSend}
              disabled={!draft.trim() && !pendingImage}
              variant="primary"
            >
              <SendIcon />
            </IconButton>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 16px",
          textAlign: "center",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#9CA3AF",
          borderTop: "1px solid #F0E8D8",
          background: "#FAF5EB",
        }}
      >
        {footer}
      </div>

      <style>{`
        @keyframes demo-chat-pulse {
          0%   { transform: scale(1);   opacity: .65; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes demo-recording-pulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: .5;  transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────
// ─── Typing indicator ─────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          padding: "10px 14px",
          background: "#FFFFFF",
          color: "#1A1A1A",
          borderRadius: 18,
          borderTopLeftRadius: 4,
          border: "1px solid #F0E8D8",
          boxShadow: "0 1px 2px rgba(31,58,46,.04)",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          height: 20,
        }}
        aria-label="Agent is typing"
      >
        <span className="demo-chat-dot" style={{ animationDelay: "0ms" }} />
        <span className="demo-chat-dot" style={{ animationDelay: "150ms" }} />
        <span className="demo-chat-dot" style={{ animationDelay: "300ms" }} />
        <style>{`
          .demo-chat-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: #C7C4BD;
            animation: demo-chat-dot-bounce 1.1s ease-in-out infinite;
          }
          @keyframes demo-chat-dot-bounce {
            0%, 80%, 100% { transform: translateY(0);    opacity: .4; }
            40%           { transform: translateY(-3px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "6px 12px",
            fontSize: 11,
            background: "#F0E8D8",
            color: "#6B7280",
            borderRadius: 999,
          }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={
          isUser
            ? {
                maxWidth: "82%",
                padding: "10px 14px",
                fontSize: 14,
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
                background:
                  "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
                color: "#FAF5EB",
                borderRadius: 18,
                borderBottomRightRadius: 4,
                boxShadow: "0 1px 2px rgba(31,58,46,.06)",
              }
            : {
                maxWidth: "82%",
                padding: "10px 14px",
                fontSize: 14,
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
                background: "#FFFFFF",
                color: "#1A1A1A",
                borderRadius: 18,
                borderTopLeftRadius: 4,
                border: "1px solid #F0E8D8",
                boxShadow: "0 1px 2px rgba(31,58,46,.04)",
              }
        }
      >
        {message.imagePreviewUrl ? (
          <img
            src={message.imagePreviewUrl}
            alt="Attached"
            style={{
              display: "block",
              maxWidth: 220,
              maxHeight: 220,
              borderRadius: 10,
              marginBottom: message.text ? 8 : 0,
            }}
          />
        ) : null}
        {message.audio ? <AudioBubble audio={message.audio} isUser={isUser} /> : null}
        {message.text}
      </div>
    </div>
  );
}

// ─── Voice-note bubble ─────────────────────────────────────────────────────
function AudioBubble({
  audio,
  isUser,
}: {
  audio: NonNullable<ChatMessage["audio"]>;
  isUser: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 8px",
          background: isUser ? "rgba(250,245,235,0.14)" : "#FAF5EB",
          borderRadius: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isUser ? "rgba(250,245,235,0.20)" : "#C62828",
            color: isUser ? "#FAF5EB" : "#FAF5EB",
            flexShrink: 0,
          }}
        >
          <MicIcon active />
        </span>
        {audio.blobUrl ? (
          // Real Blob URL (current session) · render an audio control.
          // We force a small audio player so the bubble isn't huge.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio
            src={audio.blobUrl}
            controls
            style={{
              flex: 1,
              minWidth: 180,
              maxWidth: 280,
              height: 30,
            }}
          />
        ) : (
          // Reload-restored audio · we don't have the blob anymore (it
          // lived in memory only). Show a placeholder pill with duration.
          <span
            style={{
              flex: 1,
              fontSize: 12,
              color: isUser ? "rgba(250,245,235,0.85)" : "#6B7280",
              fontStyle: "italic",
            }}
          >
            Voice note · {formatDuration(audio.durationSec)} · audio expired with this tab
          </span>
        )}
      </div>
      {audio.transcript ? (
        <div
          style={{
            fontSize: 12,
            color: isUser ? "rgba(250,245,235,0.92)" : "#6B7280",
            fontStyle: "italic",
            lineHeight: 1.4,
            paddingLeft: 4,
          }}
        >
          {audio.transcript}
        </div>
      ) : null}
    </div>
  );
}

function formatDuration(sec: number): string {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Reusable icon button ──────────────────────────────────────────────────
function IconButton({
  children,
  onClick,
  ariaLabel,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
  variant: "primary" | "active" | "ghost";
}) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
      color: "#FAF5EB",
      boxShadow: "0 4px 12px rgba(196,30,58,.28)",
    },
    active: {
      background: "#C62828",
      color: "#FAF5EB",
      boxShadow:
        "0 4px 12px rgba(196,30,58,.32),inset 0 1px 0 rgba(255,255,255,.12)",
    },
    ghost: {
      background: "#F5E6E6",
      color: "#C62828",
      boxShadow: "0 1px 2px rgba(31,58,46,.05)",
    },
  } as const;
  const s = styles[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: 999,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...s,
      }}
    >
      {children}
    </button>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────
function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l14-7-7 14-2-5-5-2Z" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      {!active ? <path d="M3 3l18 18" /> : null}
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
