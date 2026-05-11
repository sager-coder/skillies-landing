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
import KdpHeroScene from "@/components/tools/KdpHeroScene";

export const metadata: Metadata = {
  title: "Tools · Skillies AI",
  description:
    "Tools that close the gap between guess and data. Skillies builds live-data tools for self-publishers, founders, and operators — starting with the KDP Niche Finder.",
};

const NICHE_FINDER_URL = "/tools/amazon-kdp-niche-finder";
const DROPSHIPPING_FINDER_URL = "/tools/dropshipping-products-finder";

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

      {/* ─── Tool cards ─── */}
      <section className="sk-section">
        <div className="sk-container max-w-[1180px] flex flex-col gap-10">
          {/* KDP Niche Finder */}
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
                <div
                  className="w-full max-w-[560px]"
                  style={{ aspectRatio: "1600 / 900" }}
                >
                  <KdpHeroScene />
                </div>

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

          {/* Dropshipping Products Finder */}
          <a
            href={DROPSHIPPING_FINDER_URL}
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
                  skillies.ai/tools/dropshipping-products-finder
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
                <div
                  className="w-full max-w-[520px]"
                  style={{ aspectRatio: "1600 / 900" }}
                >
                  <svg
                    viewBox="0 0 1600 900"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {/* Backdrop grid hint */}
                    <defs>
                      <linearGradient id="ds-card-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#fff7ee" />
                      </linearGradient>
                      <linearGradient id="ds-accent" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d9342b" />
                        <stop offset="100%" stopColor="#e87b3f" />
                      </linearGradient>
                    </defs>

                    {/* 3 product tiles with rising sales bars */}
                    {[0, 1, 2].map((i) => {
                      const x = 120 + i * 460;
                      const y = 180;
                      return (
                        <g key={i}>
                          <rect
                            x={x}
                            y={y}
                            width={400}
                            height={540}
                            rx={24}
                            fill="url(#ds-card-grad)"
                            stroke="#e8dcc8"
                            strokeWidth={1.5}
                          />
                          {/* Mock product photo box */}
                          <rect
                            x={x + 28}
                            y={y + 28}
                            width={344}
                            height={220}
                            rx={12}
                            fill="#f4ebd9"
                          />
                          {/* Product icon */}
                          <circle
                            cx={x + 200}
                            cy={y + 138}
                            r={48}
                            fill="url(#ds-accent)"
                            opacity={0.85}
                          />
                          {/* Title lines */}
                          <rect x={x + 28} y={y + 272} width={300} height={14} rx={4} fill="#1f1a14" opacity={0.78} />
                          <rect x={x + 28} y={y + 296} width={220} height={12} rx={4} fill="#1f1a14" opacity={0.42} />
                          {/* Price + meta row */}
                          <text
                            x={x + 28}
                            y={y + 350}
                            fill="#d9342b"
                            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                            fontSize={22}
                            fontWeight={700}
                          >
                            {["$24.99", "$39.50", "$18.75"][i]}
                          </text>
                          <text
                            x={x + 120}
                            y={y + 350}
                            fill="#5a4d3a"
                            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                            fontSize={14}
                          >
                            {[
                              "BSR 4,210",
                              "BSR 8,790",
                              "BSR 2,140",
                            ][i]}
                          </text>
                          <text
                            x={x + 240}
                            y={y + 350}
                            fill="#5a4d3a"
                            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                            fontSize={14}
                          >
                            {["★ 3.2", "★ 4.0", "★ 3.5"][i]}
                          </text>

                          {/* Mini sales-velocity bars */}
                          {[40, 64, 52, 88, 76, 110, 96].map((h, j) => (
                            <rect
                              key={j}
                              x={x + 32 + j * 50}
                              y={y + 500 - h}
                              width={32}
                              height={h}
                              rx={4}
                              fill="url(#ds-accent)"
                              opacity={0.55 + j * 0.06}
                            />
                          ))}
                        </g>
                      );
                    })}

                    {/* Bottom label */}
                    <text
                      x={800}
                      y={830}
                      textAnchor="middle"
                      fill="#1f1a14"
                      fontFamily="Cormorant Garamond, Georgia, serif"
                      fontStyle="italic"
                      fontSize={42}
                      opacity={0.7}
                    >
                      Brand-less. Selling. Beatable.
                    </text>
                  </svg>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-sk-cream/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                  <span
                    className="px-6 py-3 rounded-full sk-font-meta font-bold text-[13px] tracking-[0.04em] shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                    style={{
                      background: "var(--sk-ink)",
                      color: "var(--sk-cream)",
                    }}
                  >
                    ▶ Open the early preview
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
                    background: "rgba(201, 162, 78, 0.16)",
                    color: "#9a7822",
                  }}
                >
                  ● SOON
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--sk-ink40)" }}
                >
                  early preview · joining the waitlist
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
                Dropshipping Products Finder
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
                Find Amazon products{" "}
                <span className="sk-font-display-italic" style={{ color: "var(--sk-red)" }}>
                  already selling
                </span>{" "}
                without a brand moat — bad reviews still moving units, or
                low-review listings with strong sales velocity. Across eight
                physical-product categories. Built for branded-dropshipping
                operators who need real, beatable competitors.
              </p>

              <div className="flex flex-wrap gap-2 my-2">
                {[
                  "Brand-moat filter",
                  "Review-rate score",
                  "8 categories",
                  "BSR velocity",
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
                See what it does →
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
