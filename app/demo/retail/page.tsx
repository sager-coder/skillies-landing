import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Retail & Kirana",
  description:
    "Try the Skillies retail AI shop assistant live. Voice + photo + text orders, UPI link, restock reminders. ₹14,999/month.",
};

export default function RetailDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_6101kqnv0cxge9va16b9k236cm7m",
        vertical: "Skillies for Retail",
        accent: "#E0A656",
        avatar: "RT",
        chatFooter: "Skillies.AI · light tier · ₹14,999/month · cancel any time",
        marketingHref: "/for/retail",
      }}
    />
  );
}
