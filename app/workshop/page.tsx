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
      <TopNav
        cta={{
          href:
            "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20ready%20to%20reserve%20my%20seat%20at%20the%20Calicut%20workshop%20on%20May%2031%20%E2%80%94%20%E2%82%B91%2C999%20early%20bird.%20Please%20share%20the%20payment%20details.%20My%20name%20is%20",
          label: "Reserve · ₹1,999",
        }}
      />
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
