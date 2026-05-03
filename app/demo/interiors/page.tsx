import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Modular Kitchen & Interiors",
  description:
    "Try the Skillies interiors AI sales worker live. Photo-of-empty-kitchen → 3 budget-banded options + booked site visit in 60 seconds.",
};

export default function InteriorsDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_5001kqnv08dyepjtdvkfs0v5s6d9",
        vertical: "Skillies for Modular Kitchen",
        accent: "#B5613D",
        avatar: "IN",
        chatFooter: "Skillies.AI · live demo · vision module + EMI calculator",
        marketingHref: "/for/interiors",
      }}
    />
  );
}
