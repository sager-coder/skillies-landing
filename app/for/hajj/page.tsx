/**
 * /for/hajj · Hajj/Umrah vertical landing page.
 * Visual identity · forest green + aged ivory · italic display type.
 * SOFT variant on book-call CTA · "a conversation, not a sales call".
 * Layout · asymmetric hero (more whitespace, slow fade).
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.6
 * Copy: content/verticals/hajj.ts
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
import { hajjCopy as copy } from "@/content/verticals/hajj";

export const metadata: Metadata = {
  title: "Skillies for Hajj &amp; Umrah · AI sales worker for pilgrimage operators",
  description:
    "An always-on assistant for Hajj and Umrah operators. Speaks Malayalam, Urdu, Hindi, English. Voice notes from older pilgrims. Family group routing. Document checklist without nagging. Built in Malappuram.",
};

export default function HajjPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlock
        layout="asymmetric"
        variant="hajj"
        headline={copy.hero.headline}
        subhead={copy.hero.subhead}
        ctaPrimary={copy.hero.ctaPrimary}
        ctaSecondary={copy.hero.ctaSecondary}
        trustStrip={copy.hero.trust}
        image={copy.hero.image}
      />

      <PainCard
        items={copy.pain.map((p) => ({
          label: p.quote,
          quote: p.quote,
          attribution: p.attribution,
        }))}
        variant="quote"
        accent="var(--sk-hajj-forest)"
      />

      <CapabilityHighlight
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        items={copy.capabilities.items}
        columns={2}
      />

      <DemoCTA
        demoHref="/demo/hajj"
        heading={copy.demoCTA.heading}
        body={copy.demoCTA.body}
        mockChat={copy.demoCTA.mockChat}
        ctaLabel="WhatsApp the demo agent"
      />

      <PricingSnapshot
        layout="single"
        eyebrow="INVESTMENT"
        sectionBg="var(--sk-hajj-ivory)"
        tiers={[
          {
            name: "Hajj/Umrah · Standard",
            setup: copy.pricing.setup,
            monthly: copy.pricing.monthly,
            bullets: copy.pricing.bullets,
            ctaLabel: "Get a custom quote",
            ctaHref: "/pricing?vertical=hajj",
          },
        ]}
      />

      <CaseStudyCard
        quote={copy.caseStudy.quote}
        author={copy.caseStudy.author}
        role={copy.caseStudy.role}
        metrics={copy.caseStudy.metrics}
        verified={copy.caseStudy.verified}
        sectionBg="var(--sk-hajj-ivory)"
      />

      <BookCallCTA
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        variant="soft"
      />

      <FooterEditorial />
    </main>
  );
}
