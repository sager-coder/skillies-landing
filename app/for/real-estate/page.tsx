/**
 * /for/real-estate · template vertical landing page.
 *
 * Visual identity: slate `#5C6670` for secondary headings + sandstone
 * `#D4B896` background tint for the Pricing section. Full-bleed hero
 * with text overlay bottom-left. Architectural-editorial photography.
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.2
 * Copy: content/verticals/realestate.ts
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import HeroBlock from "@/components/skillies/HeroBlock";
import PainCard from "@/components/skillies/PainCard";
import CapabilityHighlight from "@/components/skillies/CapabilityHighlight";
import DemoCTA from "@/components/skillies/DemoCTA";
import PricingSnapshot from "@/components/skillies/PricingSnapshot";
import CaseStudyCard from "@/components/skillies/CaseStudyCard";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import { realEstateCopy as copy } from "@/content/verticals/realestate";

export const metadata: Metadata = {
  title: "Skillies for Real Estate · AI sales worker for developers + brokers",
  description:
    "78% of property buyers go with whoever replies first. Skillies replies in 15 seconds, in 5 Indic languages, books site visits in your CRM, and keeps the lead alive for 30 days. RERA-aware.",
};

export default function RealEstatePage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlock
        layout="fullbleed"
        variant="realestate"
        headline={copy.hero.headline}
        subhead={copy.hero.subhead}
        ctaPrimary={copy.hero.ctaPrimary}
        ctaSecondary={copy.hero.ctaSecondary}
        trustStrip={copy.hero.trust}
        image={copy.hero.image}
      />

      <PainCard
        items={copy.pain}
        variant="stat-large"
        accent="var(--sk-realestate-slate)"
      />

      <CapabilityHighlight
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        items={copy.capabilities.items}
        columns={2}
      />

      <DemoCTA
        demoHref="/demo/real-estate"
        heading={copy.demoCTA.heading}
        body={copy.demoCTA.body}
        mockChat={copy.demoCTA.mockChat}
        ctaLabel="WhatsApp the demo agent"
      />

      <PricingSnapshot
        layout="single"
        eyebrow="INVESTMENT"
        sectionBg={`color-mix(in srgb, var(--sk-realestate-sandstone) 30%, var(--sk-cream) 70%)`}
        tiers={[
          {
            name: "Real Estate · Scale",
            setup: copy.pricing.setup,
            monthly: copy.pricing.monthly,
            bullets: copy.pricing.bullets,
            ctaLabel: "Get a custom quote",
            ctaHref: "/pricing?vertical=real-estate",
          },
        ]}
        footnote="Public pricing calculator · /pricing"
      />

      <CaseStudyCard
        quote={copy.caseStudy.quote}
        author={copy.caseStudy.author}
        role={copy.caseStudy.role}
        metrics={copy.caseStudy.metrics}
        verified={copy.caseStudy.verified}
      />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
      />

      <FooterEditorial />
    </main>
  );
}
