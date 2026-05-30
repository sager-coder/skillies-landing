/**
 * /talk — live voice call with the Skillies AI.
 *
 * Visitor clicks "Start", browser asks for mic permission, opens a WebRTC
 * connection to the LiveKit server. The agent worker (Python, on the GPU pod)
 * joins the same room and starts speaking with the founder's voice.
 *
 * No reliance on ElevenLabs Convai. End-to-end on Skillies' own brain + voice.
 *
 * Server pieces this page assumes are live before it can work:
 *   1. LiveKit server reachable at NEXT_PUBLIC_LIVEKIT_URL
 *   2. /api/livekit/token mints a join token
 *   3. agent.py worker is registered against the same LiveKit server
 */
"use client";

import { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react";
import "@livekit/components-styles";

type Connection = {
  token: string;
  url: string;
  room: string;
};

export default function TalkPage() {
  const [conn, setConn] = useState<Connection | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/livekit/token", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as Connection;
      setConn(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start call");
    } finally {
      setBusy(false);
    }
  }

  if (!conn) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--sk-cream)] text-[var(--sk-ink)] px-6">
        <h1 className="sk-font-display text-[var(--sk-text-h2)] mb-4 text-center">
          Talk to the Skillies AI
        </h1>
        <p className="text-[var(--sk-text-lead)] text-[var(--sk-ink60)] max-w-md text-center mb-8">
          Real conversation. Real voice. Trained on Skillies, speaks the way
          Ehsan speaks. Allow your mic to start.
        </p>
        <button
          onClick={start}
          disabled={busy}
          className="px-8 py-4 bg-[var(--sk-red)] text-[var(--sk-cream)] rounded-full text-lg font-medium disabled:opacity-50 transition"
        >
          {busy ? "Connecting…" : "Start call"}
        </button>
        {error && (
          <p className="mt-6 text-sm text-[var(--sk-red)]">{error}</p>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--sk-cream)] text-[var(--sk-ink)]">
      <LiveKitRoom
        token={conn.token}
        serverUrl={conn.url}
        connect
        audio
        video={false}
        onDisconnected={() => setConn(null)}
        className="min-h-screen flex flex-col items-center justify-center px-6"
      >
        <CallView roomName={conn.room} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </main>
  );
}

function CallView({ roomName }: { roomName: string }) {
  const { state, audioTrack } = useVoiceAssistant();
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-[var(--sk-text-meta)] uppercase tracking-widest text-[var(--sk-ink40)]">
        Room {roomName}
      </p>
      <div className="w-full max-w-md h-48">
        <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
      </div>
      <p className="text-[var(--sk-text-lead)] text-[var(--sk-ink60)]">
        {labelFor(state)}
      </p>
    </div>
  );
}

function labelFor(state: string): string {
  switch (state) {
    case "listening":
      return "Go ahead, I'm listening.";
    case "thinking":
      return "Thinking…";
    case "speaking":
      return "Speaking.";
    case "connecting":
      return "Connecting…";
    default:
      return "";
  }
}
