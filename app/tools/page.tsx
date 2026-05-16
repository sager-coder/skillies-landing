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

const SIGNALS: Array<{
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
    eyebrow: "Starving niche",
    title: "Bad reviews — still selling",
    blurb: "Under 4★ but still moving units. The market wants better and is paying for mediocre.",
    blurbItalic: "You ship better.",
    stat: "Under 4★ · BSR ≤ 200,000 · 5+ reviews",
  },
  {
    num: "02",
    eyebrow: "High revenue",
    title: "Premium price · low competition",
    blurb: "Books at $20+ with under 10 reviews",
    blurbItalic: "still selling",
    blurbTail: ". High revenue per sale, weak incumbent.",
    stat: "≥ $20 · BSR ≤ 150,000 · ≤ 10 reviews",
  },
  {
    num: "03",
    eyebrow: "Viral sleeper",
    title: "Top 10k BSR · almost no reviews",
    blurb: "Sales rank under 10,000 with",
    blurbItalic: "under 10 reviews",
    blurbTail: ". Pure no-moat opportunity — the book is winning on cover and category alone.",
    stat: "BSR ≤ 10,000 · ≤ 10 reviews · ≥ $10",
  },
  {
    num: "04",
    eyebrow: "Evergreen",
    title: "Historical bestseller · few reviews",
    blurb: "Steady year-long sales, under 20 reviews.",
    blurbItalic: "Underserved evergreen markets",
    blurbTail: " with proven 365-day demand.",
    stat: "365-day BSR ≤ 100,000 · ≤ 20 reviews",
  },
  {
    num: "05",
    eyebrow: "Fast to ship",
    title: "Low-content book selling fast",
    blurb: "50–150 page paperbacks (journals, activity books, trackers)",
    blurbItalic: "moving real volume",
    blurbTail: ". Days to produce, weeks to publish.",
    stat: "Paperback · $5–$15 · BSR ≤ 100,000",
  },
  {
    num: "06",
    eyebrow: "Quality + obscurity",
    title: "Hidden 5-star gem",
    blurb: "Rated 4.5★+ with under 10 reviews. Readers",
    blurbItalic: "love it",
    blurbTail: " — discovery hasn't caught up yet.",
    stat: "≥ 4.5★ · 3–9 reviews · BSR ≤ 100,000",
  },
  {
    num: "07",
    eyebrow: "Yearly refresh",
    title: "Year-stamped annual",
    blurb: "Sports drafts, game guides, atlases, regulatory updates —",
    blurbItalic: "refreshes every year",
    blurbTail: ". Last year's incumbents are obsolete by January.",
    stat: '"2026" in title · BSR ≤ 200,000 · ≤ 50 reviews',
  },
  {
    num: "08",
    eyebrow: "Displaceable",
    title: '"Complete Guide" · low-rated',
    blurb: "Reference guides with bad reviews that still sell —",
    blurbItalic: "no better option exists",
    blurbTail: ". Build the better option.",
    stat: '"Complete Guide" · ≤ 4★ · ≤ 100 reviews',
  },
];

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
                    ▶ Open the tool
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
                  ● LIVE
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--sk-ink40)" }}
                >
                  3 free searches · ₹ packs via Razorpay
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

      {/* ─── 8 signals ─── */}
      <section id="signals" className="sk-section" style={{ background: "var(--sk-cream)" }}>
        <div className="sk-container pt-12 pb-16">
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                color: "var(--sk-red)",
                borderColor: "var(--sk-red)",
                background: "rgba(255, 255, 255, 0.55)",
              }}
            >
              <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
                ✕ THE 8 HIGH-PROBABILITY SIGNALS
              </span>
            </span>

            <h2
              className="sk-font-display mx-auto max-w-[20ch]"
              style={{
                fontSize: "clamp(36px, 4.6vw, 60px)",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--sk-ink)",
              }}
            >
              We don&apos;t find books
              <span style={{ color: "var(--sk-red)" }}>.</span>{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                We find bets that already work
              </span>
              <span style={{ color: "var(--sk-red)" }}>.</span>
            </h2>

            <p
              className="sk-font-body mt-5 mx-auto max-w-[70ch]"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink)",
                fontWeight: 500,
              }}
            >
              Every signal below is a pattern Amazon&apos;s data already proves
              works. Pick one, describe your topic, get back twenty real
              listings{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                already selling
              </span>{" "}
              against that exact pattern.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {SIGNALS.map((s) => (
              <article
                key={s.num}
                className="relative bg-white rounded-2xl border p-7 flex flex-col gap-2.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(40,25,10,0.10)]"
                style={{
                  borderColor: "var(--sk-hairline)",
                }}
              >
                <div
                  className="sk-font-display"
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    color: "var(--sk-red)",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>

                <div className="-mt-0.5">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase"
                    style={{
                      background: "rgba(217,52,43,0.08)",
                      color: "var(--sk-red)",
                    }}
                  >
                    {s.eyebrow}
                  </span>
                </div>

                <h3
                  className="sk-font-meta"
                  style={{
                    fontWeight: 800,
                    fontSize: 19,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "var(--sk-ink)",
                    margin: "4px 0 2px",
                  }}
                >
                  {s.title}
                </h3>

                <p
                  className="sk-font-body flex-grow"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--sk-ink60)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {s.blurb}{" "}
                  <span
                    className="sk-font-display-italic"
                    style={{
                      color: "var(--sk-ink)",
                      fontSize: "1.05em",
                    }}
                  >
                    {s.blurbItalic}
                  </span>
                  {s.blurbTail}
                </p>

                <div
                  className="mt-2.5 pt-3 border-t border-dashed font-mono text-[11.5px]"
                  style={{
                    borderColor: "var(--sk-hairline)",
                    color: "var(--sk-ink40)",
                  }}
                >
                  {s.stat}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-12">
            <a
              href={NICHE_FINDER_URL}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-bold tracking-tight transition-all duration-200 shadow-[0_8px_24px_rgba(217,52,43,0.22)] hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Run a hunt →
            </a>
            <span
              className="text-[13.5px] font-medium"
              style={{ color: "var(--sk-ink60)" }}
            >
              Pick a signal · describe your topic · get 10 real listings.
            </span>
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
