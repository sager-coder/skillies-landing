"use client";

import Script from "next/script";

/**
 * SkilliesVoiceWidget — embeds the ElevenLabs Agents conversational-voice
 * widget on every page of skillies.ai. Visitor clicks the floating button →
 * voice chat opens in their browser → real-time conversation with Ehsan's
 * cloned Malayalam voice via Sonnet 4.6.
 *
 * The agent itself is configured in ElevenLabs Agents · system prompt,
 * voice mapping, language presets, and TTS model live there. This component
 * is purely the embed surface.
 *
 * Architecture (per audits/SOUL-STRATEGY-REPORT.md and the
 * project_skillies_voice_architecture memory):
 *   · WhatsApp inbound text → "Skillies WhatsApp Front Desk" agent (chat-only)
 *   · Website voice chat (HERE) → "Skillies Voice Agent" (full voice mode)
 *   · Two specialised agents · two channels · cleanest routing.
 *
 * The agent ID is intentionally public — it's just a routing identifier,
 * not a secret. ElevenLabs enforces auth via the workspace API key (which
 * stays server-side). We expose the ID through NEXT_PUBLIC_ so prod and
 * preview can point at different agents if we ever want a staging variant.
 */

const FALLBACK_AGENT_ID = "agent_6001kq868kj1f6vbeekyttgy5bf6";

// The ElevenLabs widget ships as a custom element. TypeScript needs to
// know it's a valid intrinsic element so we can render it in JSX without
// an "unknown element" error. React 19 / Next 16 looks up custom elements
// on `React.JSX.IntrinsicElements`, not the bare global JSX namespace.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id"?: string },
        HTMLElement
      >;
    }
  }
}

export default function SkilliesVoiceWidget() {
  const agentId =
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? FALLBACK_AGENT_ID;

  if (!agentId) return null;

  return (
    <>
      <Script
        id="elevenlabs-convai-widget"
        src="https://elevenlabs.io/convai-widget/index.js"
        strategy="afterInteractive"
        async
      />
      <elevenlabs-convai agent-id={agentId} />
    </>
  );
}
