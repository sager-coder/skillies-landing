/**
 * /demo/real-estate · public live demo of the Skillies real-estate agent.
 * Linked from /for/real-estate's "See it qualify a lead live" CTA.
 */
import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Real Estate",
  description:
    "Try the Skillies real-estate AI sales worker live. Qualifies budget + intent, sends floor plans, books site visits, RERA-aware.",
};

export default function RealEstateDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_9101kqntznkteqktvpsbh2h9182k",
        vertical: "Skillies for Real Estate",
        accent: "#5C6670",
        avatar: "RE",
        chatFooter: "Skillies.AI · live demo · vertical-tuned · not a real project",
        marketingHref: "/for/real-estate",
      }}
    />
  );
}
