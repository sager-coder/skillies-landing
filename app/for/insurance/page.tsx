/**
 * /for/insurance · Insurance vertical landing page (v3 visual uplift).
 * Visual identity · navy + warm gold · trustworthy elder-brother voice.
 *
 * Editorial asymmetric hero (HeroBlockEditorial) replaces old split.
 *
 * Spec · 7th vertical, founder-added 2026-05-03.
 * Copy · content/verticals/insurance.ts
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
import { insuranceCopy as copy } from "@/content/verticals/insurance";

export const metadata: Metadata = {
  title: "Skillies for Insurance · AI sales worker for brokers + agencies",
  description:
    "Calm anxious insurance buyers, qualify without pressure, handle pre-existing-disease conversations in 5 Indian languages. IRDAI-aware. Built for brokers and agencies.",
};

export default function InsurancePage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlockEditorial
        vertical="insurance"
        eyebrow="SKILLIES FOR · INSURANCE"
        headlineLead="Answer the"
        headlineEmphasis="diabetic father's question"
        headlineTail="at 11 PM, in Malayalam."
        subhead="Calm anxious buyers, qualify without pressure tactics, handle pre-existing-disease and family-history questions in 5 Indian languages. IRDAI-aware language baked in. Built for brokers and agencies who want to keep every commission rupee."
        trustLine="IRDAI-compliant disclaimers · Mal + Hin + Eng + Tam · Lifelong per-customer memory · Razorpay first-premium collection"
        primaryCTA={copy.hero.ctaPrimary}
        secondaryCTA={copy.hero.ctaSecondary}
        imageSrc={copy.hero.image.src}
        imageAlt={copy.hero.image.alt}
      />

      <RevealOnScroll>
        <section className="sk-section" style={{ paddingTop: 0 }}>
          <div className="sk-container max-w-[820px]">
            <p
              className="sk-font-meta mb-4"
              style={{ color: "var(--sk-ink60)" }}
            >
              SEE IT WORK · LIVE THREAD
            </p>
            <HeroChatPreview lockTo="insurance" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain}
          variant="stat-bordered"
          accent="var(--sk-insurance-navy)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
          cardHairline="var(--sk-insurance-gold)"
          hairlinePosition="top"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/insurance"
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
          sectionBg={`color-mix(in srgb, var(--sk-insurance-gold) 20%, var(--sk-cream) 80%)`}
          tiers={[
            {
              name: "Insurance · Standard",
              setup: copy.pricing.setup,
              monthly: copy.pricing.monthly,
              bullets: copy.pricing.bullets,
              ctaLabel: "Get a custom quote",
              ctaHref: "/pricing?vertical=insurance",
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
        />
      </RevealOnScroll>

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        verticalLabel="Insurance"
      />

      <FooterEditorial />
    </main>
  );
}
