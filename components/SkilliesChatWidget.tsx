"use client";

/**
 * SkilliesChatWidget — Skillies-branded chat + optional voice for
 * skillies.ai. Replaces the prior <elevenlabs-convai> embed.
 *
 * Two session modes that swap on demand (a single connection only ever runs
 * one mode at a time, because the SDK can't switch transports mid-session):
 *   - "text" (default) — websocket + overrides.conversation.textOnly. No
 *     mic, no audio, no permission prompt. The mode the visitor lands in
 *     when they open the panel.
 *   - "voice" — WebRTC with mic, full audio playback. Activated by clicking
 *     the mic button. Switching modes ends the current session and starts
 *     a fresh one in the new mode.
 *
 * The agent can invoke `send_payment_link` regardless of mode — when it
 * does we hit /api/razorpay/payment-link and render a branded
 * "Pay ₹X · Razorpay" card inline in the chat. Name/phone are optional;
 * the visitor enters them on Razorpay's hosted page when they pay.
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Pinned to the English Voice Agent (turbo v2) which has the
// `send_payment_link` client tool wired up. The previous Vercel env var
// `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` pointed to the older Malayalam-mode
// "skillies website voice chat" agent (agent_6001…) which still
// referenced a dead webhook payment tool — left visitors with fabricated
// Razorpay URLs. Hardcoding here so the build is the source of truth;
// to switch agents, edit this constant and redeploy.
const AGENT_ID = "agent_4301kqagd3g1e0p8hev9y4yasfpy";

type PaymentLinkCard = {
  tier: string;
  description: string;
  amount_inr: number;
  short_url: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "agent" | "system";
  text?: string;
  paymentLink?: PaymentLinkCard;
  ts: number;
};

const TIER_LABELS: Record<string, string> = {
  "workshop-early": "Skillies Workshop · Early Bird (₹1,999)",
  "workshop-regular": "Skillies Workshop · Regular (₹2,499)",
  "workshop-vip": "Skillies Workshop · VIP (₹2,499)",
  "batch-enrolment": "Skillies Batch · Upfront Enrolment (₹50,000)",
};

const VALID_TIERS = Object.keys(TIER_LABELS);

// === Outer wrapper · provides the ConversationProvider context ============

export default function SkilliesChatWidget() {
  return (
    <ConversationProvider>
      <ChatWidgetUI />
    </ConversationProvider>
  );
}

// === Inner UI · uses useConversation + client tools =======================

function ChatWidgetUI() {
  const agentId = AGENT_ID;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "intro",
      role: "agent",
      text: "Hi, I'm the Skillies assistant. Ask me about the Workshop, the Batch, or how enrolment works — and I can send you a Razorpay payment link right here when you're ready. Tap the mic if you'd rather talk.",
      ts: Date.now(),
    },
  ]);
  const [pendingLink, setPendingLink] = useState(false);
  const [draft, setDraft] = useState("");
  // The session-mode the user has chosen. `null` = no session yet. Switching
  // requires ending the current session and starting a fresh one because the
  // SDK can't change transport (websocket vs WebRTC) mid-conversation.
  const [activeMode, setActiveMode] = useState<"text" | "voice" | null>(null);
  const [unread, setUnread] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const appendMessage = useCallback((m: Omit<ChatMessage, "id" | "ts">) => {
    setMessages((prev) => [
      ...prev,
      { ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: Date.now() },
    ]);
  }, []);

  // Pending text messages typed before the websocket is open. The SDK
  // throws "No active conversation" if sendUserMessage runs before
  // status === "connected", so we queue and flush via an effect below.
  const pendingSendsRef = useRef<string[]>([]);

  // The client-tool handler closes over `appendMessage` and `open`. We hold
  // the latest closure in a ref so the tool function passed to
  // `useConversation` can be stable (the SDK reads `clientTools` once at
  // session-start; if the function identity changes mid-session the tool
  // call would route to a stale closure).
  type SendPaymentLinkParams = {
    tier?: string;
    full_name?: string;
    phone?: string;
    email?: string;
  };
  const sendPaymentLinkRef = useRef<
    (raw: Record<string, unknown>) => Promise<string>
  >(async () => "error: not yet initialised");

  sendPaymentLinkRef.current = async (raw: Record<string, unknown>) => {
    const params = (raw ?? {}) as SendPaymentLinkParams;

    if (!params.tier || !VALID_TIERS.includes(params.tier)) {
      return `error: invalid tier. Must be one of ${VALID_TIERS.join(", ")}`;
    }

    // Name + phone are optional — the visitor enters them on Razorpay's
    // hosted page when they actually pay. Server fills the create-link
    // payload with placeholders if missing.
    setPendingLink(true);
    try {
      const res = await fetch("/api/razorpay/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: params.tier,
          full_name: params.full_name?.trim() || undefined,
          phone: params.phone?.trim() || undefined,
          email: params.email?.trim() || undefined,
          source: "voice-chat",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        appendMessage({
          role: "system",
          text: `Couldn't generate payment link: ${data?.error ?? "unknown error"}`,
        });
        return `error: ${data?.error ?? "failed to create link"}`;
      }
      appendMessage({
        role: "agent",
        paymentLink: {
          tier: data.tier,
          description: TIER_LABELS[data.tier] ?? data.description,
          amount_inr: data.amount_inr,
          short_url: data.short_url,
        },
      });
      if (!open) setUnread((u) => u + 1);
      return `payment_link_sent: ${data.short_url}`;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "network error";
      appendMessage({
        role: "system",
        text: `Couldn't generate payment link: ${msg}`,
      });
      return `error: ${msg}`;
    } finally {
      setPendingLink(false);
    }
  };

  // Pass clientTools directly to useConversation as a stable object — this
  // is the path the SDK reads at session-start (verified in
  // node_modules/@elevenlabs/client/dist/BaseConversation.js:154 — it
  // checks `this.options.clientTools[tool_name]` for matches).
  const clientTools = useMemo(
    () => ({
      send_payment_link: (params: Record<string, unknown>) =>
        sendPaymentLinkRef.current(params),
    }),
    [],
  );

  // === ElevenLabs conversation =============================================
  // Text-only mode (overrides.conversation.textOnly) — runs on websocket,
  // skips the LiveKit/WebRTC path entirely. That eliminates two prior
  // bugs: (a) the v1 RTC retry loop the LiveKit client kept hitting, and
  // (b) phantom "..." user bubbles that the ASR was emitting from the
  // muted-but-still-publishing mic track.
  const conversation = useConversation({
    clientTools,
    onDisconnect: () => {
      setActiveMode(null);
    },
    onError: (msg) => {
      appendMessage({ role: "system", text: `Connection error: ${msg}` });
    },
    onMessage: ({ message, role }) => {
      if (!message) return;
      if (role === "user") {
        // Skip echo of locally-rendered user-typed messages.
        const last = messagesRef.current[messagesRef.current.length - 1];
        if (last?.role === "user" && last.text === message) return;
        appendMessage({ role: "user", text: message });
      } else {
        appendMessage({ role: "agent", text: message });
        if (!open) setUnread((u) => u + 1);
      }
    },
    // If the agent ever calls a tool name we don't have registered, surface
    // it in the chat — this caught the dead `send_razorpay_link` webhook
    // during initial wiring and is cheap to keep.
    onUnhandledClientToolCall: (call) => {
      appendMessage({
        role: "system",
        text: `Agent tried to call unregistered tool: ${call?.tool_name}`,
      });
    },
  });

  // Flush queued user messages once the connection comes up.
  useEffect(() => {
    if (conversation.status !== "connected") return;
    if (pendingSendsRef.current.length === 0) return;
    const queue = pendingSendsRef.current.splice(0);
    for (const text of queue) {
      try {
        conversation.sendUserMessage(text);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "send failed";
        appendMessage({ role: "system", text: `Couldn't send: ${msg}` });
      }
    }
  }, [appendMessage, conversation, conversation.status]);

  // === Auto-scroll on new messages ========================================
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  // Clear unread badge when panel opens
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // === Session lifecycle ===================================================
  // Session is started lazily — on first user action — in the requested
  // mode. To switch modes (text↔voice) we end the existing session and
  // start a new one with the right transport because the SDK can't change
  // connectionType on an open conversation.
  const startSessionInMode = useCallback(
    (mode: "text" | "voice") => {
      try {
        // The agent reads `{{channel}}` from dynamicVariables and switches
        // its OUTPUT STYLE accordingly — text mode strips voice-only tags
        // ([pause], [warm]) and uses digits/₹ symbols instead of spelled
        // numbers; voice mode keeps the voice-first rules.
        const dynamicVariables = { channel: mode };
        if (mode === "text") {
          conversation.startSession({
            agentId,
            connectionType: "websocket",
            overrides: { conversation: { textOnly: true } },
            dynamicVariables,
          });
        } else {
          conversation.startSession({
            agentId,
            connectionType: "webrtc",
            dynamicVariables,
          });
        }
        setActiveMode(mode);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "failed to start session";
        appendMessage({ role: "system", text: `Couldn't start: ${msg}` });
        setActiveMode(null);
      }
    },
    [agentId, appendMessage, conversation],
  );

  const ensureSession = useCallback(
    (mode: "text" | "voice") => {
      if (activeMode === mode) return;
      if (activeMode !== null) {
        try {
          conversation.endSession();
        } catch {
          /* noop */
        }
      }
      startSessionInMode(mode);
    },
    [activeMode, conversation, startSessionInMode],
  );

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    appendMessage({ role: "user", text });

    // If the text connection is already live, send immediately. Otherwise
    // queue the message and let the status-change effect flush it once
    // the session reaches "connected".
    if (activeMode === "text" && conversation.status === "connected") {
      try {
        conversation.sendUserMessage(text);
        return;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "send failed";
        appendMessage({ role: "system", text: `Couldn't send: ${msg}` });
        return;
      }
    }
    pendingSendsRef.current.push(text);
    ensureSession("text");
  }, [activeMode, appendMessage, conversation, draft, ensureSession]);

  const toggleVoice = useCallback(async () => {
    if (activeMode === "voice") {
      // End the call → drop back to text mode so typing still works.
      try {
        conversation.endSession();
      } catch {
        /* noop */
      }
      setActiveMode(null);
      return;
    }
    // Request mic up front so the permission prompt is tied to this user
    // gesture (browsers block mid-flow getUserMedia calls).
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      appendMessage({
        role: "system",
        text: "Mic permission was denied. You can still chat by typing.",
      });
      return;
    }
    ensureSession("voice");
  }, [activeMode, appendMessage, conversation, ensureSession]);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  // End the session on unmount (route change). We don't end on close-panel
  // because the visitor may reopen and want to keep chatting without a
  // fresh handshake.
  useEffect(() => {
    return () => {
      if (activeMode !== null) {
        try {
          conversation.endSession();
        } catch {
          /* noop */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = conversation.status;
  const isAgentSpeaking = activeMode === "voice" && conversation.isSpeaking;

  // === UI =================================================================
  return (
    <>
      {/* Floating launcher · always visible, bottom-right */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Open Skillies chat"
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(196,30,58,.45)",
                animation: "skillies-launcher-ping 2.2s cubic-bezier(0,0,.2,1) infinite",
              }}
            />
            <span
              className="relative flex w-16 h-16 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
                boxShadow:
                  "0 10px 28px rgba(196,30,58,.35),0 1px 3px rgba(31,58,46,.18),inset 0 1px 0 rgba(255,255,255,.12)",
              }}
            >
              <ChatBubbleIcon />
            </span>
            {unread > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center"
                style={{ background: "#1F3A2E", color: "#FAF5EB" }}
              >
                {unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Skillies chat"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed z-50 bottom-6 right-6 left-6 sm:left-auto sm:w-[380px] flex flex-col"
            style={{
              maxHeight: "min(640px, calc(100vh - 48px))",
              borderRadius: 20,
              overflow: "hidden",
              background: "#FAF5EB",
              border: "1px solid #F0E8D8",
              boxShadow:
                "0 24px 48px rgba(31,58,46,.18),0 4px 12px rgba(31,58,46,.08),0 0 0 1px rgba(31,58,46,.04)",
              fontFamily:
                "Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: "linear-gradient(135deg,#1F3A2E 0%,#142821 100%)",
                color: "#FAF5EB",
              }}
            >
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
                  boxShadow: "0 0 0 2px rgba(250,245,235,.15)",
                }}
              >
                <span className="text-base font-bold tracking-tight" style={{ color: "#FAF5EB" }}>S</span>
                {isAgentSpeaking && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "2px solid #C9A24E",
                      animation: "skillies-launcher-ping 1.4s cubic-bezier(0,0,.2,1) infinite",
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight">Skillies Assistant</div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "rgba(250,245,235,.7)" }}
                >
                  {activeMode === "voice"
                    ? status === "connected"
                      ? isAgentSpeaking
                        ? "Speaking…"
                        : "Listening…"
                      : "Connecting voice…"
                    : status === "connected"
                    ? "Online"
                    : status === "connecting"
                    ? "Connecting…"
                    : "Ready when you are"}
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "#FAF5EB", background: "rgba(250,245,235,.08)" }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ background: "#FAF5EB" }}
            >
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
              {pendingLink && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-2xl text-xs"
                    style={{
                      background: "#F0E8D8",
                      color: "#6B7280",
                      borderTopLeftRadius: 4,
                    }}
                  >
                    Generating payment link…
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div
              className="px-3 py-3 flex items-end gap-2"
              style={{
                borderTop: "1px solid #F0E8D8",
                background: "#FFFFFF",
              }}
            >
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={activeMode === "voice"}
                aria-label={activeMode === "voice" ? "End voice call" : "Start voice call"}
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: activeMode === "voice" ? "#C62828" : "#F5E6E6",
                  color: activeMode === "voice" ? "#FAF5EB" : "#C62828",
                  boxShadow:
                    activeMode === "voice"
                      ? "0 4px 12px rgba(196,30,58,.32),inset 0 1px 0 rgba(255,255,255,.12)"
                      : "0 1px 2px rgba(31,58,46,.05)",
                }}
              >
                <MicIcon active={activeMode === "voice"} />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Type a message…"
                rows={1}
                className="flex-1 resize-none outline-none text-sm leading-snug py-2 px-3 rounded-xl"
                style={{
                  background: "#FAF5EB",
                  color: "#1A1A1A",
                  border: "1px solid #F0E8D8",
                  fontFamily: "inherit",
                  maxHeight: 120,
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
                  color: "#FAF5EB",
                  boxShadow: "0 4px 12px rgba(196,30,58,.28)",
                }}
              >
                <SendIcon />
              </button>
            </div>

            <div
              className="px-4 py-2 text-[10px] tracking-wide uppercase text-center"
              style={{
                background: "#FAF5EB",
                color: "#9CA3AF",
                borderTop: "1px solid #F0E8D8",
              }}
            >
              Skillies.AI · Secure payments via Razorpay
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes skillies-launcher-ping {
          0% { transform: scale(1); opacity: .65; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </>
  );
}

// === Message row ==========================================================

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <div
          className="text-[11px] px-3 py-1 rounded-full"
          style={{ background: "#F0E8D8", color: "#6B7280" }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  if (message.paymentLink) {
    return <PaymentLinkBubble link={message.paymentLink} />;
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[82%] px-3.5 py-2.5 text-[14px] leading-snug whitespace-pre-wrap break-words"
        style={
          isUser
            ? {
                background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
                color: "#FAF5EB",
                borderRadius: 18,
                borderBottomRightRadius: 4,
                boxShadow: "0 1px 2px rgba(31,58,46,.06)",
              }
            : {
                background: "#FFFFFF",
                color: "#1A1A1A",
                borderRadius: 18,
                borderTopLeftRadius: 4,
                border: "1px solid #F0E8D8",
                boxShadow: "0 1px 2px rgba(31,58,46,.04)",
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
}

// === Payment-link card ====================================================

function PaymentLinkBubble({ link }: { link: PaymentLinkCard }) {
  const amountStr = `₹${link.amount_inr.toLocaleString("en-IN")}`;
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[88%] w-full overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid #F0E8D8",
          borderRadius: 18,
          borderTopLeftRadius: 4,
          boxShadow: "0 4px 14px rgba(31,58,46,.08)",
        }}
      >
        <div
          className="px-4 py-3"
          style={{
            background: "linear-gradient(135deg,#1F3A2E 0%,#2D4A3A 100%)",
            color: "#FAF5EB",
          }}
        >
          <div className="text-[10px] uppercase tracking-widest" style={{ color: "#C9A24E" }}>
            Razorpay Payment Link
          </div>
          <div className="text-base font-semibold mt-1 leading-tight">
            {link.description}
          </div>
        </div>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>
              Amount
            </div>
            <div className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
              {amountStr}
            </div>
          </div>
          <a
            href={link.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#C62828 0%,#8B1A1A 100%)",
              color: "#FAF5EB",
              boxShadow: "0 4px 12px rgba(196,30,58,.3)",
            }}
          >
            Pay {amountStr} →
          </a>
        </div>
        <div
          className="px-4 py-2 text-[10px]"
          style={{
            color: "#9CA3AF",
            borderTop: "1px solid #F0E8D8",
            background: "#FAF5EB",
          }}
        >
          Opens Razorpay · UPI, cards, netbanking
        </div>
      </div>
    </div>
  );
}

// === Icons ================================================================

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#FAF5EB" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L3 21l1.5-5.5A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l14-7-7 14-2-5-5-2Z" />
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      {!active && <path d="M3 3l18 18" />}
    </svg>
  );
}


