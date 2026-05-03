/**
 * Homepage · post-pivot (May 2026) · v3 visual uplift.
 *
 * The B2B AI Sales Worker is the front door. The consumer Workshop +
 * Batch + Amazon KDP content lives at /skillies-school as a single
 * destination page (not in primary nav).
 *
 * Section flow:
 *   TopNav · HeroBlockV2 · AgentInAction · HumansVsAgent ·
 *   WhySkilliesIsDifferent · VerticalGrid · B2BHowItWorks ·
 *   BookCallCTA · Footer
 */
import TopNav from "@/components/design/TopNav";
import HeroBlockV2 from "@/components/skillies/HeroBlockV2";
import AgentInAction from "@/components/skillies/AgentInAction";
import HumansVsAgent from "@/components/skillies/HumansVsAgent";
import WhySkilliesIsDifferent from "@/components/design/WhySkilliesIsDifferent";
import VerticalGrid from "@/components/design/VerticalGrid";
import B2BHowItWorks from "@/components/design/B2BHowItWorks";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <TopNav />
      <HeroBlockV2 />
      <AgentInAction />
      <HumansVsAgent />
      <RevealOnScroll>
        <WhySkilliesIsDifferent />
      </RevealOnScroll>
      <RevealOnScroll>
        <VerticalGrid />
      </RevealOnScroll>
      <RevealOnScroll>
        <B2BHowItWorks />
      </RevealOnScroll>
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
