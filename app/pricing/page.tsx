/**
 * /pricing · interactive calculator + transparent module breakdown.
 *
 * The same calculate_quote() server function powers both this page and the
 * WhatsApp scoping agent's tool call. Single source of truth.
 *
 * URL params · ?vertical=real-estate seeds the initial state (vertical pages
 * link here with their key prefilled).
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import HumansVsAgent from "@/components/skillies/HumansVsAgent";
import type { VerticalKey } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing · Skillies AI Sales Worker · interactive calculator",
  description:
    "Pick your vertical, set your monthly conversation volume, choose capabilities, see your live quote. We charge only for what you switch on. No hidden fees.",
};

const VALID_VERTICALS: VerticalKey[] = [
  "retail",
  "hajj",
  "coaching",
  "study-abroad",
  "interiors",
  "real-estate",
  "insurance",
];

type SearchParams = Promise<{ vertical?: string }>;

export default async function PricingPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const verticalParam = params?.vertical;
  const initialVertical = (
    verticalParam &&
    VALID_VERTICALS.includes(verticalParam as VerticalKey)
      ? verticalParam
      : "real-estate"
  ) as VerticalKey;

  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      {/* Hero */}
      <section className="sk-section pt-32 md:pt-40">
        <div className="sk-container">
          <p
            className="sk-font-meta mb-6"
            style={{ color: "var(--sk-ink60)" }}
          >
            PRICING · TRANSPARENT &amp; INTERACTIVE
          </p>
          <h1
            className="sk-font-display max-w-[24ch]"
            style={{
              fontSize: "var(--sk-text-display)",
              color: "var(--sk-ink)",
            }}
          >
            We charge only for what{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              you switch on
            </span>
            .
          </h1>
          <p
            className="sk-font-body mt-6 max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            Most WhatsApp tools sell flat tiers based on message count. We
            don&rsquo;t — your kirana doesn&rsquo;t need vision and your
            real-estate developer doesn&rsquo;t need RERA disabled. Pick your
            vertical, set your volume, choose capabilities. Quote updates
            live.
          </p>
        </div>
      </section>

      <PricingCalculator initialVertical={initialVertical} />

      <HumansVsAgent
        headline="Same job. Different physics."
        subhead="Hire 10 callers + 2 managers in Kerala for ~₹2.5 L/month. Or ship one agent that doesn't take leaves, doesn't make data-entry errors, and remembers every customer for life."
      />

      {/* Why QC, not per-message */}
      <section
        className="sk-section"
        style={{ background: "var(--sk-cream-dark)" }}
      >
        <div className="sk-container">
          <div className="mx-auto max-w-[760px]">
            <p
              className="sk-font-meta mb-4"
              style={{ color: "var(--sk-ink60)" }}
            >
              WHY QC, NOT PER-MESSAGE
            </p>
            <h2
              className="sk-font-section"
              style={{
                fontSize: "var(--sk-text-h2)",
                color: "var(--sk-ink)",
              }}
            >
              Meta charges per message. We don&rsquo;t.
            </h2>
            <p
              className="sk-font-body mt-6"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
              }}
            >
              That punishes you for engagement. One serious buyer asks 50
              questions before signing. We want your agent to{" "}
              <strong>handle that buyer to closure</strong>, not nickel-and-dime
              you per reply.
            </p>
            <p
              className="sk-font-body mt-4"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
              }}
            >
              A Qualified Conversation (QC) = a complete sales conversation,
              not a tap on the screen. ≥5 inbound user messages OR a sales
              action (booking, payment link, hot-lead handoff). Window-shoppers
              with one question don&rsquo;t count against your bill.
            </p>
          </div>
        </div>
      </section>

      <BookCallCTA
        heading="Lock the quote in a 30-min call."
        note="The calculator gives you a live snapshot. The actual quote, signed SOW, and Razorpay link come after a quick discovery call. We never spring fees later."
      />

      <FooterEditorial />
    </main>
  );
}
