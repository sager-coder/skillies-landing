/**
 * /for/study-abroad · Study Abroad vertical landing page.
 * Visual identity · library navy + warm parchment · mentoring tone.
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.3
 * Copy: content/verticals/studyabroad.ts
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
import { studyAbroadCopy as copy } from "@/content/verticals/studyabroad";

export const metadata: Metadata = {
  title: "Skillies for Study Abroad · AI sales worker for consultants",
  description:
    "Reply to every UK, Canada, Germany enquiry before they ghost. 12-18 month memory across the application cycle. Parent + student dual-thread in Malayalam, Hindi, English. ICEF-aware.",
};

export default function StudyAbroadPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlock
        layout="split"
        variant="studyabroad"
        headline={copy.hero.headline}
        subhead={copy.hero.subhead}
        ctaPrimary={copy.hero.ctaPrimary}
        ctaSecondary={copy.hero.ctaSecondary}
        trustStrip={copy.hero.trust}
        image={copy.hero.image}
      />

      <PainCard
        items={copy.pain}
        variant="stat-bordered"
        accent="var(--sk-studyabroad-navy)"
      />

      <CapabilityHighlight
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        items={copy.capabilities.items}
        columns={2}
        cardBg="var(--sk-studyabroad-parchment)"
        cardHairline="var(--sk-studyabroad-navy)"
        hairlinePosition="bottom"
      />

      <DemoCTA
        demoHref="/demo/study-abroad"
        heading={copy.demoCTA.heading}
        body={copy.demoCTA.body}
        mockChat={copy.demoCTA.mockChat}
        ctaLabel="Talk to the demo agent"
      />

      <PricingSnapshot
        layout="single"
        eyebrow="INVESTMENT"
        tiers={[
          {
            name: "Study Abroad · Growth",
            setup: copy.pricing.setup,
            monthly: copy.pricing.monthly,
            bullets: copy.pricing.bullets,
            ctaLabel: "Get a custom quote",
            ctaHref: "/pricing?vertical=study-abroad",
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
        sectionBg="var(--sk-studyabroad-parchment)"
      />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        manglishLine="From one Malappuram founder to another."
      />

      <FooterEditorial />
    </main>
  );
}
