/**
 * /tools/amazon-kdp-niche-finder · marketing landing for the KDP Niche
 * Finder, hosted on skillies.ai itself. The actual search/license/PayPal
 * app runs as a separate FastAPI service; this page leads visitors there
 * via the "Run a search" CTA.
 *
 * Set NEXT_PUBLIC_NICHE_APP_URL in Vercel env to wherever the FastAPI app
 * is deployed (Render / Railway / Fly). Until then, the CTA points to
 * the local dev URL so the page is functional in development.
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import KdpHeroScene from "@/components/tools/KdpHeroScene";
import KdpNicheFinder from "@/components/tools/KdpNicheFinder";

export const metadata: Metadata = {
  title:
    "Amazon KDP Niche Finder · 8 high-probability sales signals · Skillies",
  description:
    "Eight tested high-probability signals for KDP self-publishers — bad reviews still selling, premium niches with no competition, top-10k BSR sleepers, year-stamped annuals, and more. Pick a signal, describe your topic, get 20 real Amazon listings already selling against it.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_NICHE_APP_URL || "http://127.0.0.1:8765/";

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
    blurb: "Under 3.5★ but still moving units. The market wants better and is paying for trash.",
    blurbItalic: "You ship better.",
    stat: "Under 3.5★ · BSR ≤ 200,000 · 5+ reviews",
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
    stat: '"Complete Guide" · ≤ 3.5★ · ≤ 100 reviews',
  },
];

export default function AmazonKdpNicheFinderPage() {
  return (
    <main className="relative">
      {/* Hero-art sizing: enlarged, slightly lifted (no horizontal shift —
          pulled in to keep the text column legible). Mobile rules reset
          all of it so the illustration centres cleanly. */}
      <style>{`
        .kdp-hero-art-inner { max-width: 880px; }
        .kdp-hero-section { padding-bottom: 0; }
        .kdp-after-hero { padding-top: 28px; }
        .kdp-section-tight { padding-top: 12px; padding-bottom: 24px; }
        .kdp-section-pull-up { padding-top: 0; }

        /* Feature strip wrapper — pulled up tight under the illustration so
           it visually anchors the bottom of the hero composition. */
        .kdp-features-wrap {
          margin-top: 24px;
        }
        @media (min-width: 768px) {
          .kdp-features-wrap { margin-top: -8px; }
        }
        @media (min-width: 1280px) {
          .kdp-features-wrap { margin-top: -32px; }
        }

        /* ── Feature strip — 5 mini-cards beneath the hero ──
           Same aesthetic as the signal cards (white, tan border, soft
           shadow, hover lift). Each card pairs a Fraunces glyph with a
           bold title + muted description. */
        .kdp-features-strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .kdp-feature {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #e7dcc4;
          border-radius: 18px;
          padding: 26px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 8px 28px rgba(40, 25, 10, 0.06);
          transition: transform 0.20s ease, box-shadow 0.20s ease, border-color 0.20s ease;
          overflow: hidden;
        }
        .kdp-feature::before {
          /* Soft red corner glow on hover — same trick as signal cards */
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 240px 160px at 100% 0%, rgba(217, 52, 43, 0.08), transparent 60%);
          opacity: 0;
          transition: opacity 0.20s ease;
          pointer-events: none;
        }
        .kdp-feature:hover {
          transform: translateY(-4px);
          border-color: #d9342b;
          box-shadow: 0 18px 42px rgba(40, 25, 10, 0.12);
        }
        .kdp-feature:hover::before { opacity: 1; }
        .kdp-feature-num {
          font-family: var(--font-fraunces, "Fraunces", Georgia, serif);
          font-weight: 600;
          font-size: 38px;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #d9342b;
          margin-bottom: 10px;
        }
        .kdp-feature-title {
          font-weight: 800;
          font-size: 16px;
          line-height: 1.2;
          letter-spacing: -0.012em;
          color: #141414;
        }
        .kdp-feature-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #14141499;
          margin-top: 2px;
        }

        @media (max-width: 1100px) {
          .kdp-features-strip {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 720px) {
          .kdp-features-strip {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .kdp-feature {
            padding: 20px 16px 18px;
            border-radius: 16px;
          }
          .kdp-feature-num { font-size: 30px; margin-bottom: 6px; }
          .kdp-feature-title { font-size: 14px; }
          .kdp-feature-desc { font-size: 12px; }
        }

        @media (min-width: 768px) {
          .kdp-hero-art {
            transform: translateY(-60px);
            margin-bottom: -50px;
          }
          .kdp-hero-art-inner { max-width: 1080px; }
          .kdp-section-tight { padding-top: 16px; padding-bottom: 32px; }
        }
        @media (min-width: 1280px) {
          .kdp-hero-art {
            transform: translateY(-90px);
            margin-bottom: -80px;
          }
          .kdp-hero-art-inner { max-width: 1200px; }
          .kdp-after-hero { padding-top: 16px; }
        }
      `}</style>
      <TopNav />

      {/* ─── Hero ─── */}
      <section className="sk-section pt-32 md:pt-32 kdp-hero-section">
        <div className="sk-container grid md:grid-cols-[1fr_1.25fr] gap-10 items-center max-w-[1340px]">
          <div>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-7"
              style={{
                color: "var(--sk-red)",
                borderColor: "var(--sk-red)",
                background: "rgba(255, 255, 255, 0.55)",
              }}
            >
              <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
                ✕ HIGH-PROBABILITY KDP NICHE SIGNALS
              </span>
            </span>

            <h1
              className="sk-font-display"
              style={{
                fontSize: "var(--sk-text-display)",
                color: "var(--sk-ink)",
                lineHeight: 0.95,
                letterSpacing: "-0.045em",
              }}
            >
              Hunches don&apos;t sell
              <span style={{ color: "var(--sk-red)" }}>.</span>
              <br />
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                Signals do
              </span>
              <span style={{ color: "var(--sk-red)" }}>.</span>
            </h1>

            <p
              className="sk-font-body mt-6"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink)",
                fontWeight: 500,
                maxWidth: "60ch",
                lineHeight: 1.5,
              }}
            >
              Eight tested patterns that surface Amazon books with{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                proven sales momentum
              </span>{" "}
              — bad reviews still selling, premium niches with no competition,
              top-10k-BSR sleepers with almost no reviews. We don&apos;t find
              you any books. We find you the ones a smart self-publisher
              would actually bet on.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-bold tracking-tight transition-all duration-200 shadow-[0_10px_28px_rgba(217,52,43,0.28)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(217,52,43,0.36)]"
                style={{
                  background: "var(--sk-red)",
                  color: "var(--sk-cream)",
                }}
              >
                Try one search free →
              </a>
              <a
                href="#signals"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-[14px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "transparent",
                  color: "var(--sk-ink)",
                  borderBottom: "2px solid transparent",
                }}
              >
                See the 8 signals ↓
              </a>
            </div>
          </div>

          {/* Hero illustration — live React/SVG scene.
              Enlarged + dragged up + bled past the column gutter so it
              has the same cinematic presence as the standalone tool. */}
          <div className="flex flex-col items-center md:items-end kdp-hero-art">
            <div
              className="w-full kdp-hero-art-inner"
              style={{ aspectRatio: "1600 / 900" }}
            >
              <KdpHeroScene />
            </div>
          </div>
        </div>

        {/* ── Feature strip — 5 mini-cards in the signal-card aesthetic.
            Pulled tight under the illustration via .kdp-features-wrap so
            the strip visually anchors the bottom of the hero composition. */}
        <div className="sk-container max-w-[1240px] kdp-features-wrap">
          <div className="kdp-features-strip">
            <article className="kdp-feature">
              <div className="kdp-feature-num">●</div>
              <div className="kdp-feature-title">1 free search</div>
              <div className="kdp-feature-desc">No email, no card. Hit the button and hunt.</div>
            </article>

            <article className="kdp-feature">
              <div className="kdp-feature-num">★</div>
              <div className="kdp-feature-title">Live Amazon data</div>
              <div className="kdp-feature-desc">Every search hits the actual market — not estimates.</div>
            </article>

            <article className="kdp-feature">
              <div className="kdp-feature-num">✕</div>
              <div className="kdp-feature-title">Author-moat filter</div>
              <div className="kdp-feature-desc">Drops famous-author halos. You see slots an indie can win.</div>
            </article>

            <article className="kdp-feature">
              <div className="kdp-feature-num">↑</div>
              <div className="kdp-feature-title">10 ranked results</div>
              <div className="kdp-feature-desc">Top opportunities only · ~50 seconds end to end.</div>
            </article>

            <article className="kdp-feature">
              <div className="kdp-feature-num">$</div>
              <div className="kdp-feature-title">No subscription</div>
              <div className="kdp-feature-desc">Pay per pack — $3.95 / search at scale. Credits never expire.</div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 8 signals ─── */}
      <section id="signals" className="sk-section kdp-after-hero kdp-section-tight">
        <div className="sk-container">
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

          <div className="flex flex-col items-center gap-3 mt-8">
            <a
              href="#kdp-tool"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-bold tracking-tight transition-all duration-200 shadow-[0_8px_24px_rgba(217,52,43,0.22)] hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Run a hunt below ↓
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

      {/* ─── The actual functional tool ─── */}
      <section id="kdp-tool" className="sk-section kdp-section-pull-up">
        <div className="sk-container max-w-[1100px]">
          <KdpNicheFinder />
        </div>
      </section>

      <FooterEditorial />
    </main>
  );
}
