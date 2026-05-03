/**
 * /for/coaching · Coaching/Edtech vertical landing page.
 * Visual identity · disciplined indigo + warm chalk · NEET-default tone.
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.4
 * Copy: content/verticals/coaching.ts
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import HeroBlock from "@/components/skillies/HeroBlock";
import HeroChatPreview from "@/components/design/HeroChatPreview";
import PainCard from "@/components/skillies/PainCard";
import CapabilityHighlight from "@/components/skillies/CapabilityHighlight";
import DemoCTA from "@/components/skillies/DemoCTA";
import PricingSnapshot from "@/components/skillies/PricingSnapshot";
import CaseStudyCard from "@/components/skillies/CaseStudyCard";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import { coachingCopy as copy } from "@/content/verticals/coaching";

export const metadata: Metadata = {
  title: "Skillies for Coaching Institutes · AI sales worker for NEET, JEE, UPSC, IELTS",
  description:
    "Result-day surge — 5,000 messages in 48 hours, in 4 Indian languages. Skillies books every demo class without your counsellors burning out. Dual-persona handling for parent + student.",
};

export default function CoachingPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlock
        layout="split"
        variant="coaching"
        headline={copy.hero.headline}
        subhead={copy.hero.subhead}
        ctaPrimary={copy.hero.ctaPrimary}
        ctaSecondary={copy.hero.ctaSecondary}
        trustStrip={copy.hero.trust}
        image={copy.hero.image}
      />
      <section className="sk-section" style={{ paddingTop: 0 }}>
        <div className="sk-container max-w-[820px]">
          <p
            className="sk-font-meta mb-4"
            style={{ color: "var(--sk-ink60)" }}
          >
            SEE IT WORK · LIVE THREAD
          </p>
          <HeroChatPreview lockTo="coaching" />
        </div>
      </section>

      <PainCard
        items={copy.pain}
        variant="stat-bordered"
        accent="var(--sk-coaching-indigo)"
      />

      <CapabilityHighlight
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        items={copy.capabilities.items}
        columns={2}
        sectionBg="var(--sk-coaching-chalk)"
        cardHairline="var(--sk-coaching-indigo)"
        hairlinePosition="top"
      />

      <DemoCTA
        demoHref="/demo/coaching"
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
            name: "Coaching · Standard",
            setup: copy.pricing.setup,
            monthly: copy.pricing.monthly,
            bullets: copy.pricing.bullets,
            ctaLabel: "Get a custom quote",
            ctaHref: "/pricing?vertical=coaching",
          },
        ]}
      />

      <CaseStudyCard
        quote={copy.caseStudy.quote}
        author={copy.caseStudy.author}
        role={copy.caseStudy.role}
        metrics={copy.caseStudy.metrics}
        verified={copy.caseStudy.verified}
        sectionBg="var(--sk-coaching-chalk)"
      />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
      />

      <FooterEditorial />
    </main>
  );
}
