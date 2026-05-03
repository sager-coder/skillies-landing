import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Insurance",
  description:
    "Try the Skillies insurance AI counsellor live. IRDAI-aware, multi-language, handles pre-existing-disease conversations without pressure.",
};

export default function InsuranceDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_0901kqp3d66vf0q8y7a34j51625p",
        vertical: "Skillies for Insurance",
        accent: "#1B2E4B",
        avatar: "IN",
        chatFooter: "Skillies.AI · live demo · IRDAI-aware language guardrails",
        marketingHref: "/for/insurance",
      }}
    />
  );
}
