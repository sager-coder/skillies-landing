"use client";

import Script from "next/script";
import { useEffect } from "react";

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

  // Hide the "Powered by ElevenLabs Agents" watermark inside the widget's
  // shadow DOM. Removing it via the proper config (`disable_banner: true`)
  // is gated on the ElevenLabs Business plan; this is the workaround at
  // our Pro tier. Walks every text node in the widget's open shadow root,
  // hides the ancestor element that contains the branding text. Re-runs
  // on shadow-DOM mutations because the widget renders async.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const containsBranding = (text: string) => {
      const t = text.toLowerCase();
      return t.includes("powered by") || t.includes("elevenlabs");
    };

    const hideBanner = (root: ParentNode | ShadowRoot): boolean => {
      // Walk every text node descendant. When we find branding text, hide
      // the smallest reasonable ancestor (footer/banner/contentinfo/link).
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let hidden = false;
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const value = node.nodeValue ?? "";
        if (!containsBranding(value)) continue;
        let el: HTMLElement | null = node.parentElement;
        // Walk up to the strongest container · footer/banner/link/contentinfo
        let target: HTMLElement | null = el;
        while (el && el !== root) {
          const role = el.getAttribute("role");
          const tag = el.tagName;
          if (
            role === "contentinfo" ||
            tag === "FOOTER" ||
            tag === "A" ||
            (el.className && /banner|powered|footer/i.test(el.className))
          ) {
            target = el;
            break;
          }
          el = el.parentElement;
        }
        if (target) {
          target.style.display = "none";
          hidden = true;
        }
      }
      return hidden;
    };

    const tryHide = (): boolean => {
      const widget = document.querySelector(
        "elevenlabs-convai",
      ) as HTMLElement & { shadowRoot?: ShadowRoot | null };
      if (!widget?.shadowRoot) return false;
      return hideBanner(widget.shadowRoot);
    };

    // Try immediately · the widget script may already be loaded.
    if (tryHide()) return;

    // Otherwise watch the document until the widget mounts. Once it does,
    // also watch INSIDE the shadow DOM for re-renders.
    const docObserver = new MutationObserver(() => {
      const widget = document.querySelector("elevenlabs-convai") as
        | (HTMLElement & { shadowRoot?: ShadowRoot | null })
        | null;
      if (!widget?.shadowRoot) return;
      tryHide();
      // Wire a deeper observer on the shadow root for subsequent re-renders.
      const shadowObserver = new MutationObserver(() => {
        if (widget.shadowRoot) hideBanner(widget.shadowRoot);
      });
      shadowObserver.observe(widget.shadowRoot, {
        childList: true,
        subtree: true,
      });
      docObserver.disconnect();
    });
    docObserver.observe(document.body, { childList: true, subtree: true });

    return () => docObserver.disconnect();
  }, []);

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
