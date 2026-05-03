/**
 * /for/real-estate · vertical landing page (v3 visual uplift).
 *
 * Asymmetric editorial hero (HeroBlockEditorial) replaces the old
 * full-bleed HeroBlock so the page feels neat + tidy with breathing
 * room instead of a wall of overlay text.
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.2
 * Copy: content/verticals/realestate.ts
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
import { realEstateCopy as copy } from "@/content/verticals/realestate";

export const metadata: Metadata = {
  title: "Skillies for Real Estate · AI sales worker for developers + brokers",
  description:
    "78% of property buyers go with whoever replies first. Skillies replies in 15 seconds, in 5 Indian languages, books site visits in your CRM, and keeps the lead alive for 30 days. RERA-aware.",
};

export default function RealEstatePage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlockEditorial
        vertical="realestate"
        eyebrow="SKILLIES FOR · REAL ESTATE"
        headlineLead="Stop losing"
        headlineEmphasis="₹14,000/lead"
        headlineTail="to a cold WhatsApp."
        subhead="Skillies replies to every Meta and 99acres lead in under 15 seconds, qualifies budget and intent, books site visits in your CRM, and keeps the conversation alive for 30 days. RERA-aware. Founder-built."
        trustLine="RERA-aware data handling · Push to LeadSquared / Sell.do / Zoho · Live in Kochi, Calicut, Hyderabad, Dubai"
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
            <HeroChatPreview lockTo="real-estate" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain}
          variant="stat-large"
          accent="var(--sk-realestate-slate)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/real-estate"
          heading={copy.demoCTA.heading}
          body={copy.demoCTA.body}
          mockChat={copy.demoCTA.mockChat}
          ctaLabel="WhatsApp the demo agent"
        />
      </RevealOnScroll>

      <RevealOnScroll>
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
      />

      <FooterEditorial />
    </main>
  );
}
