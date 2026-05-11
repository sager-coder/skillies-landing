/**
 * /tools/dropshipping-products-finder · marketing landing for the
 * Dropshipping Products Finder. The FastAPI backend is still being built
 * (separate repo: sager-coder/skillies-dropshipping-products-finder), so
 * this page acts as a "what it does + join the waitlist" preview. Once the
 * backend is live, swap the CTA to point at the app URL the same way the
 * KDP landing does.
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";

export const metadata: Metadata = {
  title:
    "Dropshipping Products Finder · Brand-less Amazon winners · Skillies",
  description:
    "Find Amazon products already selling without a brand moat — bad reviews still moving units, or low-review listings with strong sales velocity. Across eight physical-product categories. Built for branded-dropshipping operators who need real, beatable competitors.",
};

const PATTERNS: Array<{
  num: string;
  eyebrow: string;
  title: string;
  blurb: string;
  blurbItalic: string;
  blurbTail?: string;
  stat: string;
}> = [
  {
    num: "01",
    eyebrow: "Hated · still bought",
    title: "Bad reviews — still selling",
    blurb:
      "Under 3.5★ but still moving units. Buyers are settling for trash because nothing better is on page one.",
    blurbItalic: "You private-label better.",
    stat: "Under 3.5★ · BSR ≤ 50,000 · 10–2,000 reviews",
  },
  {
    num: "02",
    eyebrow: "No moat · fast climbing",
    title: "Low reviews · strong sales velocity",
    blurb:
      "Top 10,000 BSR with under 50 reviews — and a low review-rate (reviews ÷ estimated units sold). Pure momentum, no incumbent has compounded reviews yet.",
    blurbItalic: "Beatable on day one.",
    stat: "BSR ≤ 10,000 · ≤ 50 reviews · review-rate ≤ 0.5%",
  },
];

const CATEGORIES = [
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Toys & Games",
  "Sports & Outdoors",
  "Tools & Home Improvement",
  "Office Products",
  "Pet Supplies",
  "Kitchen & Dining",
];

export default function DropshippingProductsFinderPage() {
  return (
    <main className="relative">
      <TopNav />

      {/* ─── Hero ─── */}
      <section className="sk-section pt-32 md:pt-40 text-center">
        <div className="sk-container max-w-[920px]">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{
              color: "#9a7822",
              borderColor: "rgba(201, 162, 78, 0.5)",
              background: "rgba(201, 162, 78, 0.08)",
            }}
          >
            <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
              ● EARLY PREVIEW · NOT YET LIVE
            </span>
          </span>

          <h1
            className="sk-font-display mx-auto max-w-[22ch]"
            style={{
              fontSize: "var(--sk-text-display)",
              color: "var(--sk-ink)",
            }}
          >
            Brand-less{" "}
            <span style={{ color: "var(--sk-red)" }}>.</span>{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              Selling
            </span>
            <span style={{ color: "var(--sk-red)" }}>.</span>{" "}
            Beatable.
          </h1>

          <p
            className="sk-font-body mt-6 mx-auto max-w-[62ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            A live-data finder for branded-dropshipping operators. We surface
            Amazon products that are{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              already moving units
            </span>{" "}
            without a brand moat — so the listing you private-label against
            isn&apos;t a Fortune-500 incumbent with 50,000 reviews. It&apos;s
            someone you can outship, outphoto, and outrank.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:hi@skillies.ai?subject=Dropshipping%20Finder%20waitlist"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-bold tracking-tight transition-all duration-200 shadow-[0_10px_28px_rgba(217,52,43,0.22)] hover:shadow-[0_14px_36px_rgba(217,52,43,0.32)] hover:-translate-y-0.5"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Join the early-access list →
            </a>
            <a
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-bold tracking-tight border transition-all duration-150 hover:-translate-y-0.5"
              style={{
                borderColor: "var(--sk-hairline)",
                color: "var(--sk-ink)",
              }}
            >
              ← Back to all tools
            </a>
          </div>
        </div>
      </section>

      {/* ─── What it does (2 starter signals) ─── */}
      <section className="sk-section">
        <div className="sk-container max-w-[1080px]">
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sk-red/40"
              style={{ color: "var(--sk-red)" }}
            >
              <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
                ✕ TWO STARTER SIGNALS
              </span>
            </span>
            <h2
              className="sk-font-display mt-6 mx-auto max-w-[24ch]"
              style={{
                fontSize: "clamp(34px, 4.6vw, 56px)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "var(--sk-ink)",
              }}
            >
              The two patterns we ship with
              <span style={{ color: "var(--sk-red)" }}>.</span>
            </h2>
            <p
              className="sk-font-body mt-5 mx-auto max-w-[58ch]"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
              }}
            >
              Both filter out anything with a brand-moat (we reject any
              product whose brand owns another listing with 200+ reviews in
              the same category). What&apos;s left is opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PATTERNS.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-2xl p-8 md:p-10 border flex flex-col gap-3"
                style={{ borderColor: "var(--sk-hairline)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="sk-font-display-italic"
                    style={{
                      fontSize: "44px",
                      lineHeight: 1,
                      color: "var(--sk-red)",
                    }}
                  >
                    {p.num}
                  </span>
                  <span
                    className="sk-font-meta text-[11px] font-bold tracking-[0.14em] uppercase"
                    style={{ color: "var(--sk-ink40)" }}
                  >
                    {p.eyebrow}
                  </span>
                </div>
                <h3
                  className="sk-font-display"
                  style={{
                    fontSize: "26px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "var(--sk-ink)",
                    margin: "2px 0",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="sk-font-body"
                  style={{
                    fontSize: "15.5px",
                    color: "var(--sk-ink60)",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {p.blurb}{" "}
                  <span
                    className="sk-font-display-italic"
                    style={{ color: "var(--sk-red)" }}
                  >
                    {p.blurbItalic}
                  </span>
                  {p.blurbTail}
                </p>
                <span
                  className="mt-2 text-[12px] font-medium px-3 py-2 rounded-md self-start"
                  style={{
                    background: "var(--sk-cream)",
                    color: "var(--sk-ink60)",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {p.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories strip ─── */}
      <section className="sk-section">
        <div className="sk-container max-w-[1080px]">
          <div className="text-center mb-8">
            <span
              className="sk-font-meta text-[11px] font-bold tracking-[0.16em]"
              style={{ color: "var(--sk-ink40)" }}
            >
              EIGHT CATEGORIES AT LAUNCH
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="text-[13px] font-semibold px-4 py-2 rounded-full border"
                style={{
                  background: "var(--sk-cream)",
                  color: "var(--sk-forest, #1f3a2e)",
                  borderColor: "var(--sk-hairline)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it's different from the KDP one ─── */}
      <section className="sk-section">
        <div className="sk-container max-w-[940px]">
          <div
            className="rounded-2xl p-10 md:p-14 border"
            style={{
              borderColor: "var(--sk-hairline)",
              background: "white",
            }}
          >
            <span
              className="sk-font-meta text-[11px] font-bold tracking-[0.16em]"
              style={{ color: "var(--sk-red)" }}
            >
              ✕ WHAT MAKES IT WORK
            </span>
            <h2
              className="sk-font-display mt-5"
              style={{
                fontSize: "clamp(28px, 3.6vw, 40px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: "var(--sk-ink)",
              }}
            >
              Two filters every other tool skips
              <span style={{ color: "var(--sk-red)" }}>.</span>
            </h2>
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  className="sk-font-display-italic"
                  style={{
                    fontSize: "22px",
                    color: "var(--sk-red)",
                    margin: "0 0 8px",
                  }}
                >
                  Brand-moat reject
                </h3>
                <p
                  className="sk-font-body"
                  style={{
                    color: "var(--sk-ink60)",
                    fontSize: "15px",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  For every candidate, we check the brand&apos;s other
                  listings in the same root category. If any one of them has
                  200+ reviews, the product gets dropped. You only see
                  unranked or unbranded sellers — the ones you can actually
                  outcompete.
                </p>
              </div>
              <div>
                <h3
                  className="sk-font-display-italic"
                  style={{
                    fontSize: "22px",
                    color: "var(--sk-red)",
                    margin: "0 0 8px",
                  }}
                >
                  Review-rate score
                </h3>
                <p
                  className="sk-font-body"
                  style={{
                    color: "var(--sk-ink60)",
                    fontSize: "15px",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  We translate BSR → estimated monthly units sold (per
                  category), then divide review-count by total estimated
                  units sold. A low ratio means lots of sales, few reviews —
                  the listing is a momentum play, not a trust play. That
                  gap is your window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="sk-section pb-24">
        <div className="sk-container max-w-[920px]">
          <div
            className="rounded-2xl p-10 md:p-16 text-center"
            style={{
              background: "var(--sk-forest, #1f3a2e)",
              color: "var(--sk-cream)",
            }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                color: "var(--sk-gold, #c9a24e)",
                borderColor: "var(--sk-gold, #c9a24e)",
                background: "transparent",
              }}
            >
              <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
                ✕ JOIN THE EARLY-ACCESS LIST
              </span>
            </span>

            <h2
              className="sk-font-display mx-auto max-w-[20ch]"
              style={{
                fontSize: "clamp(36px, 4.8vw, 60px)",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--sk-cream)",
                margin: 0,
              }}
            >
              Get notified when it ships
              <span style={{ color: "var(--sk-gold, #c9a24e)" }}>.</span>
            </h2>

            <p
              className="sk-font-body mt-5 mx-auto max-w-[56ch]"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "rgba(250, 245, 235, 0.72)",
              }}
            >
              Email us with the categories you sell in. First batch of early
              testers gets free credits + direct feedback to shape what
              ships in v1.
            </p>

            <a
              href="mailto:hi@skillies.ai?subject=Dropshipping%20Finder%20waitlist"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-bold text-[16px] tracking-tight transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:scale-[1.03]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              hi@skillies.ai
            </a>
          </div>
        </div>
      </section>

      <FooterEditorial />
    </main>
  );
}
