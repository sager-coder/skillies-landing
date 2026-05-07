/**
 * /for/coaching · Coaching/Edtech vertical landing page (v3 visual uplift).
 * Visual identity · disciplined indigo + warm chalk · NEET-default tone.
 *
 * Editorial asymmetric hero (HeroBlockEditorial) replaces old split.
 *
 * Copy: content/verticals/coaching.ts
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
import { coachingCopy as copy } from "@/content/verticals/coaching";

export const metadata: Metadata = {
  title: "Skillies for Coaching Institutes · AI sales worker for NEET, JEE, UPSC, IELTS",
  description:
    "Result-day surge — 5,000 messages in 48 hours, in 4 Indian languages. Skillies books every demo class without your counsellors burning out. Dual-persona handling for parent + student.",
};

export default function CoachingPage() {
  return (
    <main className="relative">
      <TopNav />

      <HeroBlockEditorial
        vertical="coaching"
        eyebrow="SKILLIES FOR · COACHING / EDTECH"
        headlineLead="Don't lose a"
        headlineEmphasis="NEET aspirant"
        headlineTail="to a 4-hour reply lag."
        subhead="Skillies replies to every coaching enquiry in under 15 seconds, qualifies the student by exam, score and city, and handles parent objections about fees, hostel and demo class — all on WhatsApp, in the language they enquired in."
        trustLine="Built for NEET, JEE, IELTS, UPSC, CA institutes · LeadSquared + Tagmango integrations"
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
            <HeroChatPreview lockTo="coaching" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain}
          variant="stat-bordered"
          accent="var(--sk-coaching-indigo)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
          sectionBg="var(--sk-coaching-chalk)"
          cardHairline="var(--sk-coaching-indigo)"
          hairlinePosition="top"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/coaching"
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
              name: "Coaching · Standard",
              setup: copy.pricing.setup,
              monthly: copy.pricing.monthly,
              bullets: copy.pricing.bullets,
              ctaLabel: "Get a custom quote",
              ctaHref: "/pricing?vertical=coaching",
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
          sectionBg="var(--sk-coaching-chalk)"
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
