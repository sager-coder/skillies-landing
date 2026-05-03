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
import ForHero from "./ForHero";
import ScopeCallout from "./ScopeCallout";

export const metadata: Metadata = {
  title: "Skillies — pick your vertical · AI sales workers for Indian businesses",
  description:
    "Skillies builds AI sales workers per vertical. Pick yours: Real Estate, Hajj/Umrah, Study Abroad, Coaching, Modular Kitchen, Retail, Insurance.",
};

export default function ForIndexPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <ForHero />

      <VerticalAgentGrid />

      <ScopeCallout />

      <BookCallCTA
        heading="Not sure which vertical fits?"
        note="30 min with Ehsan — we'll figure it out together. Even if it's a vertical we don't have a page for yet, we can build."
      />

      <FooterEditorial />
    </main>
  );
}
