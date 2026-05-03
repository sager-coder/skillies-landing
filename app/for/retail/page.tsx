/**
 * /for/retail · Retail / Kirana vertical landing page.
 * Visual identity · saffron + clay · LIGHTEST tier · plain bullets · no chrome.
 * Smaller hero typography (signals practical / lower-priced).
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.7
 * Copy: content/verticals/retail.ts
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
import { retailCopy as copy } from "@/content/verticals/retail";

export const metadata: Metadata = {
  title: "Skillies for Retail &amp; Kirana · WhatsApp orders for shops, salons, gyms",
  description:
    "Voice + photo + text orders, UPI link auto-generated, restock reminders, push to Marg/Vyapar/Khatabook. ₹35k setup, ₹14,999/month. Live in 7 days.",
};

export default function RetailPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <HeroBlockEditorial
        vertical="retail"
        eyebrow="SKILLIES FOR · RETAIL / KIRANA"
        headlineLead="Your kirana on"
        headlineEmphasis="WhatsApp,"
        headlineTail="working at 11 p.m."
        subhead="Skillies' WhatsApp agent takes orders, suggests offers, handles re-stock reminders, and pushes orders to your existing billing app. For general stores, supermarkets, salons, gyms, and pet shops doing ₹5L–₹50L/month."
        trustLine="Live in 23 retail outlets across Kerala and Tamil Nadu · Marg, Vyapar, Khatabook compatible"
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
            <HeroChatPreview lockTo="retail" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard items={copy.pain} variant="bullet" />
      </RevealOnScroll>

      <RevealOnScroll>
        <CapabilityHighlight
          eyebrow={copy.capabilities.eyebrow}
          title={copy.capabilities.title}
          items={copy.capabilities.items}
          columns={2}
          cardBg="var(--sk-retail-clay)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/retail"
          heading={copy.demoCTA.heading}
          body={copy.demoCTA.body}
          mockChat={copy.demoCTA.mockChat}
          ctaLabel="Try the demo store"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <PricingSnapshot
          layout="single"
          eyebrow="STARTER"
          tiers={[
            {
              name: "Retail · Light",
              setup: copy.pricing.setup,
              monthly: copy.pricing.monthly,
              bullets: copy.pricing.bullets,
              ctaLabel: "Sign up",
              ctaHref: "/pricing?vertical=retail",
            },
          ]}
          footnote="No long-term contract. Cancel any month."
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
