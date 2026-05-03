/**
 * /for/interiors · Modular Kitchen / Interior Design vertical landing page.
 * Visual identity · burnt terracotta + warm putty · italic accent on keyword.
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.5
 * Copy: content/verticals/interiors.ts
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
import { interiorsCopy as copy } from "@/content/verticals/interiors";

export const metadata: Metadata = {
  title: "Skillies for Modular Kitchen &amp; Interiors · AI sales worker for design studios",
  description:
    "Photo of empty kitchen + Pinterest reference → quote range, design suggestion, booked site visit in 60 seconds. Built for studios doing ₹5L–₹50L jobs. Beat HomeLane's reply speed.",
};

export default function InteriorsPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlock
        layout="fullbleed"
        variant="interiors"
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
        accent="var(--sk-interiors-terracotta)"
      />

      <CapabilityHighlight
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        items={copy.capabilities.items}
        columns={2}
        cardBg="var(--sk-interiors-putty)"
        cardHairline="var(--sk-interiors-terracotta)"
        hairlinePosition="top"
      />

      <DemoCTA
        demoHref="/demo/interiors"
        heading={copy.demoCTA.heading}
        body={copy.demoCTA.body}
        mockChat={copy.demoCTA.mockChat}
        ctaLabel="Try the demo agent"
      />

      <PricingSnapshot
        layout="single"
        eyebrow="INVESTMENT"
        tiers={[
          {
            name: "Interiors · Growth",
            setup: copy.pricing.setup,
            monthly: copy.pricing.monthly,
            bullets: copy.pricing.bullets,
            ctaLabel: "Get a custom quote",
            ctaHref: "/pricing?vertical=interiors",
          },
        ]}
      />

      <CaseStudyCard
        quote={copy.caseStudy.quote}
        author={copy.caseStudy.author}
        role={copy.caseStudy.role}
        metrics={copy.caseStudy.metrics}
        verified={copy.caseStudy.verified}
        sectionBg="var(--sk-interiors-putty)"
      />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
      />

      <FooterEditorial />
    </main>
  );
}
