/**
 * /business/insurance-consultant — public WhatsApp-style demo chat for the
 * Insurance Consultant (Kerala life-insurance advisory) agent. Lets a
 * prospect (or the team) try the AI before the real WhatsApp integration
 * is set up.
 *
 * Standalone full-screen experience (no site TopNav) so it reads like an
 * actual WhatsApp thread. `noindex` — it's a private demo surface, not
 * something we want in search results.
 */
import type { Metadata } from "next";
import InsuranceConsultantChatClient from "./InsuranceConsultantChatClient";

export const metadata: Metadata = {
  title: "Insurance Consultant · WhatsApp Demo",
  description:
    "Try the Insurance Consultant AI assistant — a live demo of the WhatsApp agent.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function InsuranceConsultantDemoPage() {
  return <InsuranceConsultantChatClient />;
}
