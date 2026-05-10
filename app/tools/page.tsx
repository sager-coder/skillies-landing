/**
 * /tools · the Skillies tools hub.
 *
 * One live tool today (KDP Niche Finder). The card opens the live FastAPI
 * app at https://niche.skillies.ai (set NICHE_FINDER_URL env to override —
 * defaults to the canonical subdomain).
 *
 * Future tools land here as additional cards. The shape is fixed: a
 * browser-chrome mockup on one side, a meta column on the other (eyebrow,
 * title, blurb, capability tags, CTA).
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";

export const metadata: Metadata = {
  title: "Tools · Skillies AI",
  description:
    "Tools that close the gap between guess and data. Skillies builds live-data tools for self-publishers, founders, and operators — starting with the KDP Niche Finder.",
};

const NICHE_FINDER_URL = "/tools/amazon-kdp-niche-finder";

export default function ToolsPage() {
  return (
    <main className="relative">
      <TopNav />

      {/* ─── Hero ─── */}
      <section className="sk-section pt-32 md:pt-40 text-center">
        <div className="sk-container">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sk-red/40 bg-white/40 mb-8"
            style={{ color: "var(--sk-red)" }}
          >
            <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
              ✕ SKILLIES TOOLS
            </span>
          </span>

          <h1
            className="sk-font-display mx-auto max-w-[18ch]"
            style={{
              fontSize: "var(--sk-text-display)",
              color: "var(--sk-ink)",
            }}
          >
            Guesswork doesn&apos;t sell
            <span style={{ color: "var(--sk-red)" }}>.</span>{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              Tools do
            </span>
            <span style={{ color: "var(--sk-red)" }}>.</span>
          </h1>

          <p
            className="sk-font-body mt-6 mx-auto max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            Each Skillies tool turns a question every operator already asks
            into a{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              live-data answer
            </span>{" "}
            they can trust. No subscriptions. No tutorials. Click a tool, get
            the answer.
          </p>
        </div>
      </section>

      {/* ─── KDP Niche Finder card ─── */}
      <section className="sk-section">
        <div className="sk-container max-w-[1180px]">
          <a
            href={NICHE_FINDER_URL}
            className="group grid md:grid-cols-[1.2fr_1fr] gap-0 bg-white rounded-2xl overflow-hidden border border-sk-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(40,25,10,0.12)] hover:border-sk-red"
            style={{ borderColor: "var(--sk-hairline)" }}
          >
            {/* Browser-chrome mockup */}
            <div
              className="relative flex flex-col min-h-[360px] border-r"
              style={{
                background: "var(--sk-cream)",
                borderColor: "var(--sk-hairline)",
              }}
              aria-hidden="true"
            >
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{
                  background: "rgba(0,0,0,0.04)",
                  borderColor: "var(--sk-hairline)",
                }}
              >
                <span className="block w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="block w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="block w-3 h-3 rounded-full bg-[#28c840]" />
                <span
                  className="ml-3 px-3 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    color: "var(--sk-ink60)",
                  }}
                >
                  <span className="text-[9px]">🔒</span>
                  skillies.ai/tools/amazon-kdp-niche-finder
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
                <img
                  src="/tools/kdp-niche-finder.webp"
                  alt="Skillies AI filtering Amazon books to surface profitable KDP niches"
                  width={1672}
                  height={941}
                  className="w-full max-w-[540px] h-auto"
                  style={{
                    filter:
                      "drop-shadow(0 14px 38px rgba(40, 25, 10, 0.10))",
                  }}
                  loading="lazy"
                  decoding="async"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-sk-cream/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                  <span
                    className="px-6 py-3 rounded-full sk-font-meta font-bold text-[13px] tracking-[0.04em] shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                    style={{
                      background: "var(--sk-ink)",
                      color: "var(--sk-cream)",
                    }}
                  >
                    ▶ Click to open the live tool
                  </span>
                </div>
              </div>
            </div>

            {/* Meta column */}
            <div className="p-8 md:p-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="sk-font-meta text-[10px] font-extrabold tracking-[0.18em] px-2.5 py-1 rounded"
                  style={{
                    background: "rgba(0, 199, 88, 0.12)",
                    color: "#00a544",
                  }}
                >
                  ● LIVE
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--sk-ink40)" }}
                >
                  free first search · pay-per-pack
                </span>
              </div>

              <h3
                className="sk-font-display-italic"
                style={{
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "var(--sk-ink)",
                  margin: "4px 0 6px",
                }}
              >
                KDP Niche Finder
              </h3>

              <p
                className="sk-font-body"
                style={{
                  fontSize: "15.5px",
                  color: "var(--sk-ink60)",
                  lineHeight: 1.55,
                  maxWidth: "460px",
                  margin: 0,
                }}
              >
                Eight tested high-probability signals for KDP self-publishers
                — bad reviews still selling, premium niches with no
                competition, top-10k BSR sleepers, year-stamped annuals, and
                more. Pick a signal, describe your topic, get 20 real Amazon
                listings <span className="sk-font-display-italic" style={{ color: "var(--sk-red)" }}>already selling</span> against it.
              </p>

              <div className="flex flex-wrap gap-2 my-2">
                {[
                  "8 signal patterns",
                  "Live Amazon data",
                  "Author-moat filter",
                  "No subscription",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-full border"
                    style={{
                      background: "var(--sk-cream)",
                      color: "var(--sk-forest, #1f3a2e)",
                      borderColor: "var(--sk-hairline)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span
                className="mt-auto self-start inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-bold tracking-tight transition-all duration-150 shadow-[0_6px_18px_rgba(217,52,43,0.18)] group-hover:shadow-[0_10px_24px_rgba(217,52,43,0.30)]"
                style={{
                  background: "var(--sk-red)",
                  color: "var(--sk-cream)",
                }}
              >
                Open the tool →
              </span>
            </div>
          </a>
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
                ✕ GOT A TOOL YOU WISH EXISTED?
              </span>
            </span>

            <h2
              className="sk-font-display mx-auto max-w-[18ch]"
              style={{
                fontSize: "clamp(36px, 4.8vw, 60px)",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--sk-cream)",
                margin: 0,
              }}
            >
              Tell us the question
              <span style={{ color: "var(--sk-gold, #c9a24e)" }}>.</span>{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-gold, #c9a24e)" }}
              >
                We&apos;ll ship the answer
              </span>
              <span style={{ color: "var(--sk-gold, #c9a24e)" }}>.</span>
            </h2>

            <p
              className="sk-font-body mt-5 mx-auto max-w-[56ch]"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "rgba(250, 245, 235, 0.72)",
              }}
            >
              Most Skillies tools start as a customer&apos;s recurring
              spreadsheet headache. If you have one, send it over.
            </p>

            <a
              href="mailto:hi@skillies.ai"
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
