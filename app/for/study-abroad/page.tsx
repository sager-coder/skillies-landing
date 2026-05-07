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
import HeroBlockEditorial from "@/components/skillies/HeroBlockEditorial";
import HeroChatPreview from "@/components/design/HeroChatPreview";
import PainCard from "@/components/skillies/PainCard";
import CapabilityHighlight from "@/components/skillies/CapabilityHighlight";
import DemoCTA from "@/components/skillies/DemoCTA";
import PricingSnapshot from "@/components/skillies/PricingSnapshot";
import CaseStudyCard from "@/components/skillies/CaseStudyCard";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
import { studyAbroadCopy as copy } from "@/content/verticals/studyabroad";

export const metadata: Metadata = {
  title: "Skillies for Study Abroad · AI sales worker for consultants",
  description:
    "Reply to every UK, Canada, Germany enquiry before they ghost. 12-18 month memory across the application cycle. Parent + student dual-thread in Malayalam, Hindi, English. ICEF-aware.",
};

export default function StudyAbroadPage() {
  return (
    <main className="relative">
      <TopNav />

      <HeroBlockEditorial
        vertical="studyabroad"
        eyebrow="SKILLIES FOR · STUDY ABROAD"
        headlineLead="Reply to every"
        headlineEmphasis="UK, Canada, Germany"
        headlineTail="enquiry before they ghost."
        subhead="Skillies' WhatsApp agent qualifies students by IELTS band, country, budget and intake, sends the right brochure in Manglish or English, and only escalates serious enquiries to your counsellors. Mone, naale call cheyyam — but only if they're real."
        trustLine="Used by counsellors placing students in UK, Canada, Germany, Australia · ICEF-aware"
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
            <HeroChatPreview lockTo="study-abroad" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain}
          variant="stat-bordered"
          accent="var(--sk-studyabroad-navy)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
          cardBg="var(--sk-studyabroad-parchment)"
          cardHairline="var(--sk-studyabroad-navy)"
          hairlinePosition="bottom"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/study-abroad"
          heading={copy.demoCTA.heading}
          body={copy.demoCTA.body}
          mockChat={copy.demoCTA.mockChat}
          ctaLabel="Talk to the demo agent"
        />
      </RevealOnScroll>

      <RevealOnScroll>
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
      </RevealOnScroll>

      <RevealOnScroll>
        <CaseStudyCard
          quote={copy.caseStudy.quote}
          author={copy.caseStudy.author}
          role={copy.caseStudy.role}
          metrics={copy.caseStudy.metrics}
          verified={copy.caseStudy.verified}
          sectionBg="var(--sk-studyabroad-parchment)"
        />
      </RevealOnScroll>

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        manglishLine="From one Malappuram founder to another."
      />

      <FooterEditorial />
    </main>
  );
}
