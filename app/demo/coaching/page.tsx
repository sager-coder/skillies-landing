import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Coaching Institutes",
  description:
    "Try the Skillies coaching AI counsellor live. Result-day spike absorption, dual-persona parent + student, exam-cycle memory.",
};

export default function CoachingDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_9801kqnv04acfntvdv63kg924259",
        vertical: "Skillies for Coaching",
        accent: "#3D4A6B",
        avatar: "CO",
        chatFooter: "Skillies.AI · live demo · NEET/JEE/UPSC/IELTS/CA-aware",
        marketingHref: "/for/coaching",
      }}
    />
  );
}
