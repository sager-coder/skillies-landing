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
import HeroBlockEditorial from "@/components/skillies/HeroBlockEditorial";
import HeroChatPreview from "@/components/design/HeroChatPreview";
import PainCard from "@/components/skillies/PainCard";
import CapabilityHighlight from "@/components/skillies/CapabilityHighlight";
import DemoCTA from "@/components/skillies/DemoCTA";
import PricingSnapshot from "@/components/skillies/PricingSnapshot";
import CaseStudyCard from "@/components/skillies/CaseStudyCard";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
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

      <HeroBlockEditorial
        vertical="interiors"
        eyebrow="SKILLIES FOR · MODULAR KITCHEN / INTERIORS"
        headlineLead="Convert your"
        headlineEmphasis="Sunday-morning Instagram leads"
        headlineTail="before they call HomeLane."
        subhead="Skillies' WhatsApp agent qualifies modular kitchen and full-home interior leads, sends a personalized quote range from a customer's empty-room photo, books a designer site visit, and follows up for 30 days. Built for studios doing ₹5L–₹50L jobs."
        trustLine="Used by interior studios in Kerala, Bangalore, Mumbai · Salesforce / Zoho / LeadSquared integrations"
        primaryCTA={copy.hero.ctaPrimary}
        secondaryCTA={copy.hero.ctaSecondary}
        imageSrc={copy.hero.image.src}
        imageAlt={copy.hero.image.alt}
      />

      <RevealOnScroll>
        <section className="sk-section" style={{ paddingTop: 0 }}>
          <div className="sk-container max-w-[820px]">
            <p className="sk-font-meta mb-4" style={{ color: "var(--sk-ink60)" }}>
              SEE IT WORK · LIVE THREAD
            </p>
            <HeroChatPreview lockTo="interiors" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain}
          variant="stat-large"
          accent="var(--sk-interiors-terracotta)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
          cardBg="var(--sk-interiors-putty)"
          cardHairline="var(--sk-interiors-terracotta)"
          hairlinePosition="top"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/interiors"
          heading={copy.demoCTA.heading}
          body={copy.demoCTA.body}
          mockChat={copy.demoCTA.mockChat}
          ctaLabel="Try the demo agent"
        />
      </RevealOnScroll>

      <RevealOnScroll>
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
      </RevealOnScroll>

      <RevealOnScroll>
        <CaseStudyCard
          quote={copy.caseStudy.quote}
          author={copy.caseStudy.author}
          role={copy.caseStudy.role}
          metrics={copy.caseStudy.metrics}
          verified={copy.caseStudy.verified}
          sectionBg="var(--sk-interiors-putty)"
        />
      </RevealOnScroll>

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
      />

      <FooterEditorial />
    </main>
  );
}
