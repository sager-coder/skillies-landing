"use client";

/**
 * InteractiveDemo · two-mode demo surface.
 *
 *   Mode picker (default)      → big "Text" / "Voice" cards
 *   Text mode                  → custom chat UI built on @elevenlabs/react's
 *                                useConversation hook with `textOnly: true`.
 *                                Each user submit calls sendUserMessage();
 *                                onMessage callback feeds both sides into a
 *                                local message list rendered as bubbles.
 *   Voice mode                 → official <elevenlabs-convai> launcher
 *                                (text input is still available inside it,
 *                                but voice is the affordance).
 *
 * Why the split · the official widget UX feels voice-first when prospects
 * just want to type. Building our own text chat removes the launcher click
 * and makes typing the obvious path. Voice mode keeps the official widget
 * because rebuilding the mic UI well is a bigger project than this demo
 * justifies.
 */

import { useEffect, useRef, useState } from "react";
import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id": string;
          "dynamic-variables"?: string;
          variant?: string;
          "avatar-image-url"?: string;
        },
        HTMLElement
      >;
    }
  }
}

const ACCENT = "#0F766E";
const INK = "#1A1A1A";
const MUTED = "#595959";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";

type Mode = "picker" | "text" | "voice";

export default function InteractiveDemo({ agentId }: { agentId: string }) {
  const [mode, setMode] = useState<Mode>("picker");

  return (
    <ConversationProvider>
      {mode === "picker" ? (
        <ModePicker onPick={setMode} />
      ) : mode === "text" ? (
        <TextChat agentId={agentId} onSwitch={() => setMode("voice")} onExit={() => setMode("picker")} />
      ) : (
        <VoiceMode agentId={agentId} onSwitch={() => setMode("text")} onExit={() => setMode("picker")} />
      )}
    </ConversationProvider>
  );
}

// ─── Mode picker ───────────────────────────────────────────────────────────

function ModePicker({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 18,
      }}
    >
      <PickCard
        emoji="💬"
        title="Text chat"
        body="Type messages. Best for testing professionalism and the language switching. Default."
        accent={ACCENT}
        onClick={() => onPick("text")}
      />
      <PickCard
        emoji="🎙️"
        title="Voice"
        body="Talk hands-free. Allow mic access when prompted."
        accent={GOLD}
        onClick={() => onPick("voice")}
      />
    </div>
  );
}

function PickCard({
  emoji,
  title,
  body,
  accent,
  onClick,
}: {
  emoji: string;
  title: string;
  body: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        background: "white",
        border: `1px solid ${accent}40`,
        borderRadius: 14,
        padding: "22px 22px",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        boxShadow: "0 4px 14px rgba(15, 118, 110, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(15, 118, 110, 0.12)";
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(15, 118, 110, 0.05)";
        e.currentTarget.style.borderColor = `${accent}40`;
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: INK, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{body}</div>
      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          fontWeight: 600,
          color: accent,
          letterSpacing: "0.05em",
        }}
      >
        Open →
      </div>
    </button>
  );
}

// ─── Text mode ─────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
};

function TextChat({
  agentId,
  onSwitch,
  onExit,
}: {
  agentId: string;
  onSwitch: () => void;
  onExit: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false); // guard against double-start in StrictMode

  const conversation = useConversation({
    onMessage: ({ message, source }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          role: source === "user" ? "user" : "agent",
          text: message,
        },
      ]);
    },
    onError: (err) => {
      setSessionError(typeof err === "string" ? err : "Could not connect.");
    },
    onConnect: () => {
      setSessionStarted(true);
      setSessionError(null);
    },
  });

  // Start a text-only session on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      conversation.startSession({
        agentId,
        textOnly: true,
      });
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : String(err));
    }
    return () => {
      try {
        conversation.endSession();
      } catch {
        // ignore disconnect errors on unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // Auto-scroll to latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !sessionStarted) return;
    conversation.sendUserMessage(trimmed);
    setDraft("");
  }

  return (
    <div>
      <ModeBar
        label="Text chat"
        switchLabel="Switch to voice"
        onSwitch={onSwitch}
        onExit={onExit}
        status={
          sessionError
            ? `Error · ${sessionError}`
            : sessionStarted
              ? "Connected"
              : "Connecting…"
        }
        statusColor={sessionError ? RED : sessionStarted ? "#10B981" : MUTED}
      />

      <div
        style={{
          background: "#FAF5EB",
          border: `1px solid ${ACCENT}22`,
          borderRadius: 14,
          padding: "20px 18px",
          minHeight: 320,
          maxHeight: 480,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              color: MUTED,
              fontStyle: "italic",
              fontSize: 14,
              textAlign: "center",
              margin: "auto",
              padding: 20,
            }}
          >
            {sessionStarted
              ? "Agent is thinking of an opener…"
              : "Connecting to the agent…"}
          </div>
        ) : (
          messages.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 10, marginTop: 14 }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            sessionStarted
              ? "Type your message…"
              : "Waiting for the agent to connect…"
          }
          disabled={!sessionStarted}
          autoFocus
          style={{
            flex: 1,
            padding: "12px 14px",
            fontSize: 15,
            border: `1px solid ${ACCENT}33`,
            borderRadius: 10,
            background: "white",
            color: INK,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!sessionStarted || draft.trim().length === 0}
          style={{
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 600,
            background: !sessionStarted || draft.trim().length === 0
              ? "#9CA3AF"
              : ACCENT,
            color: CREAM,
            border: "none",
            borderRadius: 10,
            cursor:
              !sessionStarted || draft.trim().length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "agent"; text: string }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "11px 14px",
          borderRadius: 14,
          fontSize: 15,
          lineHeight: 1.45,
          background: isUser ? ACCENT : "white",
          color: isUser ? CREAM : INK,
          border: isUser ? "none" : "1px solid rgba(15, 118, 110, 0.18)",
          boxShadow: isUser
            ? "none"
            : "0 2px 6px rgba(15, 118, 110, 0.06)",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Voice mode ────────────────────────────────────────────────────────────

function VoiceMode({
  agentId,
  onSwitch,
  onExit,
}: {
  agentId: string;
  onSwitch: () => void;
  onExit: () => void;
}) {
  // Inject the official ElevenLabs Convai widget script once.
  useEffect(() => {
    const SRC = "https://elevenlabs.io/convai-widget/index.js";
    const ID = "elevenlabs-convai-script";
    if (document.getElementById(ID)) return;
    const script = document.createElement("script");
    script.id = ID;
    script.src = SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <ModeBar
        label="Voice"
        switchLabel="Switch to text"
        onSwitch={onSwitch}
        onExit={onExit}
        status="Click the launcher to start"
        statusColor={MUTED}
      />
      <div
        style={{
          background: "#FAF5EB",
          border: `1px solid ${ACCENT}22`,
          borderRadius: 14,
          padding: "32px 22px",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 14,
        }}
      >
        <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>
          Click the launcher button below to start a voice session. Allow mic
          access when prompted. The same agent — text input is also available
          inside the voice panel if you'd rather type.
        </p>
        <elevenlabs-convai agent-id={agentId} />
      </div>
    </div>
  );
}

// ─── Mode bar (shared chrome above text + voice) ───────────────────────────

function ModeBar({
  label,
  switchLabel,
  onSwitch,
  onExit,
  status,
  statusColor,
}: {
  label: string;
  switchLabel: string;
  onSwitch: () => void;
  onExit: () => void;
  status: string;
  statusColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: statusColor,
            boxShadow: `0 0 0 4px ${statusColor}33`,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {label} · {status}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onSwitch}
          style={{
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
            background: "white",
            color: ACCENT,
            border: `1px solid ${ACCENT}55`,
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          {switchLabel}
        </button>
        <button
          type="button"
          onClick={onExit}
          style={{
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
            background: "transparent",
            color: MUTED,
            border: `1px solid ${MUTED}55`,
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
