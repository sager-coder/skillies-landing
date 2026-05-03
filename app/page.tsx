/**
 * Homepage · post-pivot (May 2026).
 *
 * The B2B AI Sales Worker is now the front door. The consumer Workshop
 * + Batch + Amazon KDP content lives at /skillies-school as a single
 * destination page (not in primary nav).
 *
 * Section flow:
 *   TopNav · HeroB2B · VerticalGrid · B2BHowItWorks · BookCallCTA · Footer
 */
import TopNav from "@/components/design/TopNav";
import HeroB2B from "@/components/design/HeroB2B";
import ToolsVsWorkers from "@/components/design/ToolsVsWorkers";
import VerticalGrid from "@/components/design/VerticalGrid";
import B2BHowItWorks from "@/components/design/B2BHowItWorks";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <TopNav />
      <HeroB2B />
      <ToolsVsWorkers />
      <VerticalGrid />
      <B2BHowItWorks />
      <BookCallCTA
        heading="One conversation. We'll know if it's a fit."
        note="30 minutes with Ehsan, founder of Skillies. We scope your vertical, your volumes, the integrations that matter, and you leave with a clear quote — not a brochure."
        manglishLine="Malappuram-il ninnu thanne build cheyyunnu. Direct call cheyyam."
      />
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
