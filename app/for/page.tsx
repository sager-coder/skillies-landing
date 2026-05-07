/**
 * /for · the vertical chooser. Was a thin hero + static grid; now a
 * motion-rich, code-flavored landing page that reads as "AI sales workers,
 * alive". Routing intent is unchanged — each card still links to
 * `/for/<vertical>`.
 *
 * The new pieces:
 *   - Hero with a pulsing terminal cursor in the eyebrow
 *   - A typed-on-mount code line under the headline
 *   - A live-stat ticker (verticals · agents online · conversations / hour)
 *   - <VerticalAgentGrid /> replacing the legacy <VerticalGrid />
 *   - A dark editor-style "Don't see your vertical?" callout with a
 *     "Run" button that books a 30-min call
 *
 * The legacy <VerticalGrid /> is intentionally NOT removed — the homepage
 * still uses it.
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import VerticalAgentGrid from "@/components/skillies/VerticalAgentGrid";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import ForHeroV2 from "./ForHeroV2";
import { BusinessFeatureRow, BusinessProcess, BusinessResults } from "@/components/skillies/BusinessSections";
import ScopeCallout from "./ScopeCallout";

import HumansVsAgent from "@/components/skillies/HumansVsAgent";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";

export const metadata: Metadata = {
  title: "Your sales team should close deals — Skillies handles the conversations. · Skillies AI",
  description:
    "Skillies AI automates conversations, qualifies leads, and closes sales on autopilot. Explore how our per-vertical AI workers deliver 3X more qualified sales and 70% time savings.",
};

export default function ForIndexPage() {
  return (
    <main className="relative">
      <TopNav />

      <ForHeroV2 />

      <BusinessFeatureRow />

      <BusinessProcess />

      <BusinessResults />

      {/* <VerticalAgentGrid /> */}

      {/* 
      <RevealOnScroll>
        <HumansVsAgent 
          headline="The Economics of Growth."
          subhead="Traditional sales teams scale linearly with cost. Skillies scales exponentially with volume. Capture every lead, qualify every intent, and close every sale without the overhead."
        />
      </RevealOnScroll>

      <ScopeCallout /> 
      */}

      <BookCallCTA
        heading="Not sure which vertical fits?"
        note="30 min with Ehsan — we'll figure it out together. Even if it's a vertical we don't have a page for yet, we can build."
      />

      <FooterEditorial />
    </main>
  );
}
