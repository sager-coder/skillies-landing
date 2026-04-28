"use client";

import Script from "next/script";
import { useEffect } from "react";

// The synchronous attachShadow patch that hides the `_poweredBy_*`
// watermark + injects Skillies brand styling (red ambient glow around the
// avatar, refined widget shadow, no-flash logo background) runs from
// app/layout.tsx · placed in <head> so it executes before the widget
// script can create its shadow root. See SKILLIES_WIDGET_STYLES there.
// This component only handles the async text-replacement fallback below,
// in case the CSS hide ever stops matching (e.g. ElevenLabs renames
// `_poweredBy_*` classes).

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

// Migrated to English-mode on eleven_turbo_v2 · 28 Apr 2026 (after the
// Malayalam Convai pipeline hit a quality ceiling on v3_conversational
// and the newer v2_5 family is platform-blocked for ml language). The
// old Malayalam agent (agent_6001kq868kj1f6vbeekyttgy5bf6) is kept in
// the workspace as a fallback. To roll back, swap this constant +
// redeploy.
const FALLBACK_AGENT_ID = "agent_4301kqagd3g1e0p8hev9y4yasfpy";

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

  // Replace the "Powered by ElevenLabs Agents" watermark with Skillies
  // branding. Setting `disable_banner: true` via the ElevenLabs API is
  // gated on the Business plan; we're on Pro. Workaround: walk into the
  // widget's open shadow DOM, find the text node containing the branding,
  // swap it for "Skillies.AI" so the footer stays visually balanced rather
  // than collapsing into empty space. Re-runs on shadow-DOM mutations
  // because the widget renders async and may re-paint the footer.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const REPLACEMENT_TEXT = "Skillies.AI";

    const containsBranding = (text: string) => {
      const t = text.toLowerCase();
      return t.includes("powered by") || t.includes("elevenlabs");
    };

    const replaceBanner = (root: ParentNode | ShadowRoot): boolean => {
      // Walk every text node descendant. When we find branding text, find
      // the smallest reasonable ancestor (footer/banner/contentinfo/link),
      // strip its existing children, and write the Skillies wordmark in
      // their place. Inherit whatever font/colour the widget had so the
      // swap feels native.
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let replaced = false;
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const value = node.nodeValue ?? "";
        if (!containsBranding(value)) continue;
        let el: HTMLElement | null = node.parentElement;
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
        if (target && target.textContent !== REPLACEMENT_TEXT) {
          target.textContent = REPLACEMENT_TEXT;
          // If it's a link, kill the click destination (we don't want it
          // sending visitors to elevenlabs.io anymore).
          if (target.tagName === "A") {
            (target as HTMLAnchorElement).removeAttribute("href");
            target.style.cursor = "default";
            target.style.pointerEvents = "none";
          }
          replaced = true;
        }
      }
      return replaced;
    };

    const tryReplace = (): boolean => {
      const widget = document.querySelector(
        "elevenlabs-convai",
      ) as HTMLElement & { shadowRoot?: ShadowRoot | null };
      if (!widget?.shadowRoot) return false;
      return replaceBanner(widget.shadowRoot);
    };

    // Try immediately · the widget script may already be loaded.
    if (tryReplace()) return;

    // Otherwise watch the document until the widget mounts. Once it does,
    // also watch INSIDE the shadow DOM for re-renders that re-add the
    // original branding.
    const docObserver = new MutationObserver(() => {
      const widget = document.querySelector("elevenlabs-convai") as
        | (HTMLElement & { shadowRoot?: ShadowRoot | null })
        | null;
      if (!widget?.shadowRoot) return;
      tryReplace();
      const shadowObserver = new MutationObserver(() => {
        if (widget.shadowRoot) replaceBanner(widget.shadowRoot);
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
