/**
 * /for/hajj · Hajj/Umrah vertical landing page.
 * Visual identity · forest green + aged ivory · italic display type.
 * SOFT variant on book-call CTA · "a conversation, not a sales call".
 * Layout · asymmetric hero (more whitespace, slow fade).
 *
 * Spec: skillies-visual-design-system-DRAFT.md Part 3.6
 * Copy: content/verticals/hajj.ts
 */
import { verticalMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
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
import { AGENTS_SIGNUP_URL } from "@/lib/links";
import RevealOnScroll from "@/components/skillies/RevealOnScroll";
import AgentWorkflow from "@/components/skillies/AgentWorkflow";
import AgentFAQ from "@/components/skillies/AgentFAQ";
import RelatedAgents from "@/components/skillies/RelatedAgents";
import { hajjCopy as copy } from "@/content/verticals/hajj";

const DESCRIPTION =
  "An always-on assistant for Hajj and Umrah operators. Speaks Malayalam, Urdu, Hindi, English. Voice notes from older pilgrims. Family group routing. Document checklist without nagging. Built in Malappuram.";

export const metadata = verticalMetadata({
  slug: "hajj",
  title: "Skillies for Hajj & Umrah · AI WhatsApp Sales Agent",
  description: DESCRIPTION,
});

export default function HajjPage() {
  return (
    <main className="relative">
      <JsonLd
        variant="vertical"
        verticalLabel="Hajj & Umrah"
        description={DESCRIPTION}
        url="https://skillies.ai/for/hajj"
      />
      <TopNav />

      <HeroBlockEditorial
        vertical="hajj"
        eyebrow="SKILLIES FOR · HAJJ &amp; UMRAH"
        headlineLead="Answer every"
        headlineEmphasis="pilgrim's question"
        headlineTail="in their language, at 2 a.m."
        subhead="An always-on assistant trained on your packages, document checklists, and group schedules. Built carefully, by a Malappuram founder. We do not promise Nusuk integration — only honest, manual, Hajj Committee India-aware workflows."
        trustLine="For licensed Hajj and Umrah operators serving Kerala and the Gulf"
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
            <HeroChatPreview lockTo="hajj" />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <PainCard
          items={copy.pain.map((p) => ({
            label: p.quote,
            quote: p.quote,
            attribution: p.attribution,
          }))}
          variant="quote"
          accent="var(--sk-hajj-forest)"
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
        <AgentWorkflow slug="hajj" />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/hajj"
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

      <AgentFAQ slug="hajj" />

      <BookCallCTA startFreeHref={AGENTS_SIGNUP_URL}
        heading={copy.bookCall.heading}
        note={copy.bookCall.note}
        variant="soft"
      />

      <RelatedAgents slug="hajj" />

      <FooterEditorial />
    </main>
  );
}
