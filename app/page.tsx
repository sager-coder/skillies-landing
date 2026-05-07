/**
 * Homepage · post-pivot (May 2026) · v3 visual uplift.
 *
 * The B2B AI Sales Worker is the front door. The consumer Workshop +
 * Batch + Amazon KDP content lives at /skillies-school as a single
 * destination page (not in primary nav).
 *
 * Section flow (after May 2026 simplification):
 *   TopNav · HeroBlockV2 · WhySkilliesIsDifferent · VerticalGrid ·
 *   BookCallCTA · Footer
 *
 * Sections temporarily removed for a shorter, cleaner landing page —
 * code preserved (commented) so it can be restored without rewriting:
 *   - AgentInAction       (mapped to "Agent in Action")
 *   - HumansVsAgent       (mapped to "Economics" — heading "The Economics")
 *   - B2BHowItWorks       (mapped to "The Process" — heading "THE PROCESS")
 *   - "Rules"             (no matching section currently on this page)
 */
import TopNav from "@/components/design/TopNav";
import HeroBlockV2 from "@/components/skillies/HeroBlockV2";
// ===== Removed Section: Agent in Action =====
// import AgentInAction from "@/components/skillies/AgentInAction";
// ===== Removed Section: Economics =====
// import HumansVsAgent from "@/components/skillies/HumansVsAgent";
import WhySkilliesIsDifferent from "@/components/design/WhySkilliesIsDifferent";
import VerticalGrid from "@/components/design/VerticalGrid";
// ===== Removed Section: The Process =====
import B2BHowItWorks from "@/components/design/B2BHowItWorks";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="relative">
      <TopNav />
      <HeroBlockV2 />

      {/* ===== Removed Section: Agent in Action ===== */}
      {/* <AgentInAction /> */}

      {/* ===== Removed Section: Economics ===== */}
      {/* <HumansVsAgent /> */}

      <WhySkilliesIsDifferent />
      <VerticalGrid />

      {/* <RevealOnScroll>
        <B2BHowItWorks />
      </RevealOnScroll> */}

      {/* ===== Removed Section: Rules =====
          No "Rules" section is currently mounted on this page; placeholder
          left here so the intent is documented if/when one is added. */}

      <BookCallCTA
        heading="One conversation. We'll know if it's a fit."
        note="30 minutes with Ehsan, founder of Skillies. We scope your vertical, your volumes, the integrations that matter, and you leave with a clear quote — not a brochure."
      />
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
