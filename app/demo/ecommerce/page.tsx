import type { Metadata } from "next";
import VerticalDemoLayout from "../_components/VerticalDemoLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Demo · Skillies for Ecommerce & D2C",
  description:
    "Try the Skillies ecommerce AI agent live. Cart recovery, COD-to-prepaid conversion, order-status auto-replies, Shopify/WooCommerce/Shiprocket integrated. ₹14,999/month.",
};

export default function EcommerceDemoPage() {
  return (
    <VerticalDemoLayout
      config={{
        agentId: "agent_6101kqnv0cxge9va16b9k236cm7m",
        vertical: "Skillies for Ecommerce",
        accent: "#7C3AED",
        avatar: "EC",
        chatFooter: "Skillies.AI · light tier · ₹14,999/month · cancel any time",
        marketingHref: "/for/ecommerce",
      }}
    />
  );
}
