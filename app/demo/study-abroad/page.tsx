import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Study Abroad",
  description:
    "Try the Skillies study-abroad AI counsellor live. 12-18 month memory, parent + student dual-thread, IELTS-aware, Manglish + English.",
};

export default function StudyAbroadDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_4301kqntzzk4fkcvm7mfhdz4m3n5",
        vertical: "Skillies for Study Abroad",
        accent: "#1E2A44",
        avatar: "SA",
        chatFooter: "Skillies.AI · live demo · ICEF-aware language guardrails",
        marketingHref: "/for/study-abroad",
      }}
    />
  );
}
