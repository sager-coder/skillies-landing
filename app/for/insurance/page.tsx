/**
 * /for/insurance · Insurance vertical landing page (v3 visual uplift).
 * Visual identity · navy + warm gold · trustworthy elder-brother voice.
 *
 * Bespoke interactive hero (InsuranceInteractiveHero) — five
 * scenario tabs the visitor can click through, replacing the
 * editorial hero + standalone HeroChatPreview block.
 *
 * Spec · 7th vertical, founder-added 2026-05-03.
 * Copy · content/verticals/insurance.ts
 */
import { verticalMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import InsuranceInteractiveHero from "@/components/skillies/InsuranceInteractiveHero";
import PainCard from "@/components/skillies/PainCard";
import CapabilityHighlight from "@/components/skillies/CapabilityHighlight";
import DemoCTA from "@/components/skillies/DemoCTA";
import PricingSnapshot from "@/components/skillies/PricingSnapshot";
import CaseStudyCard from "@/components/skillies/CaseStudyCard";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
import AgentWorkflow from "@/components/skillies/AgentWorkflow";
import AgentFAQ from "@/components/skillies/AgentFAQ";
import RelatedAgents from "@/components/skillies/RelatedAgents";
import { insuranceCopy as copy } from "@/content/verticals/insurance";

const DESCRIPTION =
  "Calm anxious insurance buyers, qualify without pressure, handle pre-existing-disease conversations in 5 Indian languages. IRDAI-aware. Built for brokers and agencies.";

export const metadata = verticalMetadata({
  slug: "insurance",
  title: "Skillies for Insurance · AI WhatsApp Sales Agent",
  description: DESCRIPTION,
});

export default function InsurancePage() {
  return (
    <main className="relative">
      <JsonLd
        variant="vertical"
        verticalLabel="Insurance"
        description={DESCRIPTION}
        url="https://skillies.ai/for/insurance"
      />
      <TopNav />

      <InsuranceInteractiveHero />

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
        <AgentWorkflow slug="insurance" />
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

      <AgentFAQ slug="insurance" />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        verticalLabel="Insurance"
      />

      <RelatedAgents slug="insurance" />

      <FooterEditorial />
    </main>
  );
}
