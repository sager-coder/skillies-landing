/**
 * /for/ecommerce · Ecommerce / D2C vertical landing page.
 * Visual identity · electric + ink · LIGHTEST tier · plain bullets · no chrome.
 * Smaller hero typography (signals practical / lower-priced).
 *
 * Copy: content/verticals/ecommerce.ts
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
import { ecommerceCopy as copy } from "@/content/verticals/ecommerce";

const DESCRIPTION =
  "Recovers 22-31% of abandoned carts, flips COD to prepaid, auto-replies to 'where's my order?' DMs. Shopify, WooCommerce, Razorpay, Shiprocket compatible. ₹25,000 founding setup, from ₹9,999/month. Live in 7 days.";

export const metadata = verticalMetadata({
  slug: "ecommerce",
  title: "Skillies for Ecommerce · WhatsApp Cart Recovery & Orders",
  description: DESCRIPTION,
});

export default function EcommercePage() {
  return (
    <main className="relative">
      <JsonLd
        variant="vertical"
        verticalLabel="Ecommerce & D2C"
        description={DESCRIPTION}
        url="https://skillies.ai/for/ecommerce"
      />
      <TopNav />

      <HeroBlockEditorial
        vertical="ecommerce"
        eyebrow="SKILLIES FOR · ECOMMERCE / D2C"
        headlineLead="Your store, replying in 9 seconds."
        headlineEmphasis="At 2 a.m."
        headlineTail=""
        subhead={copy.hero.subhead}
        trustLine={copy.hero.trust}
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
            <HeroChatPreview lockTo="ecommerce" />
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
          cardBg="var(--sk-ecommerce-mist)"
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <AgentWorkflow slug="ecommerce" />
      </RevealOnScroll>

      <RevealOnScroll>
        <DemoCTA
          demoHref="/demo/ecommerce"
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
              name: "Ecommerce · Light",
              setup: copy.pricing.setup,
              monthly: copy.pricing.monthly,
              bullets: copy.pricing.bullets,
              ctaLabel: "Sign up",
              ctaHref: "/pricing?vertical=ecommerce",
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

      <AgentFAQ slug="ecommerce" />

      <BookCallCTA startFreeHref={AGENTS_SIGNUP_URL} heading={copy.bookCall.heading} note={copy.bookCall.note} />

      <RelatedAgents slug="ecommerce" />

      <FooterEditorial />
    </main>
  );
}
