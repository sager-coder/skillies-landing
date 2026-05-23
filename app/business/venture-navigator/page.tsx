/**
 * /business/venture-navigator — public WhatsApp-style demo chat for the
 * Venture Navigator founder-intake agent. Lets a founder (or Vivek's
 * team) try the AI screener before the real WhatsApp integration is set
 * up: pitch the startup, get a fast read, and see how hot leads get
 * routed to Vivek.
 *
 * Standalone full-screen experience (no site TopNav) so it reads like an
 * actual WhatsApp thread. `noindex` — private demo surface.
 */
import type { Metadata } from "next";
import VentureNavigatorChatClient from "./VentureNavigatorChatClient";

export const metadata: Metadata = {
  title: "Venture Navigator · Founder Intake Demo",
  description:
    "Try the Venture Navigator AI — pitch your startup and see how the founder-intake agent screens and routes you to Vivek.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function VentureNavigatorDemoPage() {
  return <VentureNavigatorChatClient />;
}
