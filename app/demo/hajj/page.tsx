import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Hajj & Umrah",
  description:
    "Try the Skillies Hajj/Umrah AI assistant live. Speaks Malayalam + Urdu + Hindi + English, handles voice notes, family group bookings.",
};

export default function HajjDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_0701kqntztpje1et1whg1zt6sf3j",
        vertical: "Skillies for Hajj & Umrah",
        accent: "#1F3A2E",
        avatar: "HJ",
        chatFooter: "Skillies.AI · live demo · respectful Hajj/Umrah intake voice",
        marketingHref: "/for/hajj",
      }}
    />
  );
}
