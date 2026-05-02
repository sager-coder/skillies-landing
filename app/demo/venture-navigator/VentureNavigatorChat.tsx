"use client";

/**
 * VentureNavigatorChat — Skillies-styled inline chat for Vivek's demo.
 *
 * Mirrors the production SkilliesChatWidget design (dark-green header,
 * red user bubbles, cream agent bubbles, mic + image-upload + text input)
 * but rendered inline on the demo page, not as a floating launcher.
 *
 * Modes:
 *   - text  (default · websocket + textOnly:true · no mic permission)
 *   - voice (mic via WebRTC · uses Ehsan's IVC voice clone, set on the
 *            agent itself, so it sounds like the founder)
 *
 * Image upload:
 *   The user can attach an image (e.g. a deck slide, screenshot of their
 *   metrics) via uploadFile() → sendMultimodalMessage({fileId, text}).
 *   Works in both text and voice modes.
 *
 * Auto-starts the session on mount in text mode so the visitor sees the
 * agent's first_message immediately. Switching to voice ends the current
 * websocket session and opens a fresh WebRTC one.
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
  ts: number;
};

export default function VentureNavigatorChat({ agentId }: { agentId: string }) {
  return (
    <ConversationProvider>
      <ChatUI agentId={agentId} />
    </ConversationProvider>
  );
}

function ChatUI({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [activeMode, setActiveMode] = useState<"text" | "voice" | null>(null);
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
    onConnect: () => {},
    onDisconnect: () => {
      setActiveMode(null);
    },
    onError: (msg) => {
      appendMessage({
        role: "system",
        text: `Connection error: ${typeof msg === "string" ? msg : "unknown"}`,
      });
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
      }
    },
  });

  // Memoised so the conversation hook keeps a stable reference.
  const startSessionInMode = useCallback(
    (mode: "text" | "voice") => {
      try {
        if (mode === "text") {
          conversation.startSession({
            agentId,
            connectionType: "websocket",
            overrides: { conversation: { textOnly: true } },
          });
        } else {
          conversation.startSession({
            agentId,
            connectionType: "webrtc",
          });
        }
        setActiveMode(mode);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "couldn't start session";
        appendMessage({ role: "system", text: msg });
      }
    },
    [agentId, appendMessage, conversation],
  );

  // Auto-start in text mode on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startSessionInMode("text");
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

  // Auto-scroll on new messages.
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

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

    if (
      activeMode &&
      conversation.status === "connected"
    ) {
      try {
        if (payload.fileId) {
          conversation.sendMultimodalMessage(payload);
        } else if (payload.text) {
          conversation.sendUserMessage(payload.text);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "send failed";
        appendMessage({ role: "system", text: msg });
      }
      setPendingImage(null);
      return;
    }

    pendingSendsRef.current.push(payload);
    setPendingImage(null);
    if (!activeMode) {
      startSessionInMode("text");
    }
  }, [
    activeMode,
    appendMessage,
    conversation,
    draft,
    pendingImage,
    startSessionInMode,
  ]);

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
        // Need an active session to upload. Start text session if none.
        if (!activeMode) startSessionInMode("text");

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
    [activeMode, appendMessage, conversation, startSessionInMode],
  );

  const toggleVoice = useCallback(async () => {
    if (activeMode === "voice") {
      try {
        conversation.endSession();
      } catch {
        /* noop */
      }
      setActiveMode(null);
      // Restart in text mode so typing keeps working.
      startSessionInMode("text");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      appendMessage({
        role: "system",
        text: "Mic permission was denied. Typing still works.",
      });
      return;
    }
    if (activeMode) {
      try {
        conversation.endSession();
      } catch {
        /* noop */
      }
    }
    startSessionInMode("voice");
  }, [activeMode, appendMessage, conversation, startSessionInMode]);

  const status = conversation.status;
  const isAgentSpeaking = activeMode === "voice" && conversation.isSpeaking;

  const headerStatus = useMemo(() => {
    if (activeMode === "voice") {
      if (status === "connected") {
        return isAgentSpeaking ? "Speaking…" : "Listening…";
      }
      return "Connecting voice…";
    }
    if (status === "connected") return "Online";
    if (status === "connecting") return "Connecting…";
    return "Ready when you are";
  }, [activeMode, isAgentSpeaking, status]);

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
        height: "min(640px, 78vh)",
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
          VN
          {isAgentSpeaking ? (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid #C9A24E",
                animation:
                  "vn-pulse 1.4s cubic-bezier(0,0,.2,1) infinite",
              }}
            />
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
            Venture Navigator · Founder Screener
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

      {/* Input bar */}
      <div
        style={{
          padding: "12px 12px",
          display: "flex",
          alignItems: "flex-end",
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
        <IconButton
          ariaLabel="Upload an image"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          variant="ghost"
        >
          {uploadingImage ? <Spinner /> : <ImageIcon />}
        </IconButton>
        <IconButton
          ariaLabel={activeMode === "voice" ? "End voice" : "Start voice"}
          onClick={toggleVoice}
          variant={activeMode === "voice" ? "active" : "ghost"}
        >
          <MicIcon active={activeMode === "voice"} />
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
              : "Type a message…"
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
        Powered by Skillies.AI · For Vivek M V
      </div>

      <style>{`
        @keyframes vn-pulse {
          0%   { transform: scale(1);   opacity: .65; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────
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
        {message.text}
      </div>
    </div>
  );
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
