/**
 * /business/jomin — public WhatsApp-style demo chat for the Jomi
 * Insurance agent. Lets a prospect (or Jomi's sales team) try the AI
 * before the real WhatsApp integration is set up.
 *
 * Standalone full-screen experience (no site TopNav) so it reads like an
 * actual WhatsApp thread. `noindex` — it's a private demo surface, not
 * something we want in search results.
 */
import type { Metadata } from "next";
import JominChatClient from "./JominChatClient";

export const metadata: Metadata = {
  title: "Jomi Insurance · WhatsApp Demo",
  description:
    "Try the Jomi Insurance AI assistant — a live demo of the WhatsApp agent.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function JominDemoPage() {
  return <JominChatClient />;
}
