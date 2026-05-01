"use client";

/**
 * DemoConvaiWidget — embeds ElevenLabs's official <elevenlabs-convai>
 * web component for the public demo page at /demo. Unlike the global
 * SkilliesChatWidget which has full custom UI, payment-link tools, and
 * production-only wiring, this is the lean public-demo path:
 *
 *   - Uses ElevenLabs's official polished launcher
 *   - Voice + text both work out of the box
 *   - No payment-link tool wiring (it's a demo, not a sales surface)
 *   - Targets the demo agent (agent_1901…) not the production agent
 *
 * The component dynamically loads the ElevenLabs widget script on mount.
 * The web-component custom element (`<elevenlabs-convai>`) is registered
 * once the script loads.
 */

import { useEffect } from "react";

// Tell TypeScript about the custom element so JSX accepts it.
// React 19 moved IntrinsicElements into its own namespace — declare via
// module augmentation on "react".
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id": string;
          variant?: string;
          "avatar-image-url"?: string;
        },
        HTMLElement
      >;
    }
  }
}

const SCRIPT_SRC = "https://elevenlabs.io/convai-widget/index.js";
const SCRIPT_ID = "elevenlabs-convai-script";

export default function DemoConvaiWidget({ agentId }: { agentId: string }) {
  useEffect(() => {
    // Skip if script already injected (multiple demo widgets on same page,
    // or React Strict Mode double-mount during dev).
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    // We don't remove on unmount — the widget script registers a custom
    // element globally, and re-loading it on every navigation back to the
    // page would be expensive. The script is idempotent.
  }, []);

  return (
    <div
      style={{
        // Reserve a sensible space for the widget so the layout doesn't
        // jump while the ElevenLabs script is loading.
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {/* The official ElevenLabs Convai launcher. The widget renders its own
          UI (a circular launcher button, expanding panel with mic + text). */}
      <elevenlabs-convai agent-id={agentId} />
    </div>
  );
}
