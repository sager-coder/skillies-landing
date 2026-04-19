import WorkshopHero from "@/components/workshop/WorkshopHero";
import BookReveal from "@/components/workshop/BookReveal";
import {
  WorkshopAgenda,
  WorkshopPricing,
  WorkshopLocation,
  WorkshopFAQ,
  StickyCTA,
} from "@/components/workshop/Sections";
import TalkToEhsan from "@/components/design/TalkToEhsan";
import FooterEditorial from "@/components/design/FooterEditorial";
import TopNav from "@/components/design/TopNav";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "The KDP Workshop · Calicut · May 31, 2026 · Skillies.AI",
  description:
    "A one-day, in-person workshop in Calicut. Walk in with a laptop; walk out with your first book live on Amazon KDP. ₹1,999 early bird. 150 seats.",
};

export default function WorkshopPage() {
  return (
    <main>
      <TopNav cta={{ href: "#pricing", label: "Reserve · ₹1,999" }} />
      <WorkshopHero />
      <BookReveal />
      <WorkshopAgenda />
      <WorkshopPricing />
      <WorkshopLocation />
      <WorkshopFAQ />
      <TalkToEhsan context="workshop" tone="cream" />
      <FooterEditorial />
      <StickyCTA />
      <WhatsAppButton />
    </main>
  );
}
