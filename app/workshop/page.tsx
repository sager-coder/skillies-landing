import WorkshopHero from "@/components/workshop/WorkshopHero";
import BookReveal from "@/components/workshop/BookReveal";
import PaymentDetails from "@/components/workshop/PaymentDetails";
import {
  WorkshopAgenda,
  WorkshopNextStep,
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
  title: "The KDP Workshop · Kerala Tour · 4 Sundays · Skillies.AI",
  description:
    "A one-day, in-person workshop across Kerala. Malappuram May 10, Malappuram Jun 7, Calicut Jun 14, Kochi Jun 21. Walk in with a laptop; walk out with your first book live on Amazon KDP. ₹999 early bird.",
};

export default function WorkshopPage() {
  return (
    <main>
      <TopNav cta={{ href: "#pricing", label: "Reserve · ₹999" }} />
      <WorkshopHero />
      <BookReveal />
      <WorkshopAgenda />
      <WorkshopNextStep />
      <WorkshopPricing />
      <PaymentDetails />
      <WorkshopLocation />
      <WorkshopFAQ />
      <TalkToEhsan context="workshop" tone="cream" />
      <FooterEditorial />
      <StickyCTA />
      <WhatsAppButton />
    </main>
  );
}
