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
import KdpDiscoveryDiagram from "@/components/tools/KdpDiscoveryDiagram";
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

export default function AmazonKdpNicheFinderPage() {
  return (
    <main className="relative">
      {/* Hero-art sizing: enlarged, slightly lifted (no horizontal shift —
          pulled in to keep the text column legible). Mobile rules reset
          all of it so the illustration centres cleanly. */}
      <style>{`
        .kdp-hero-section { padding-bottom: 28px; }
        .kdp-after-hero { padding-top: 32px; }
        .kdp-section-tight { padding-top: 12px; padding-bottom: 24px; }
        .kdp-section-pull-up { padding-top: 0; }

        /* ═══════════════════════════════════════════════════════════
           HERO COPY (left column)
           ═══════════════════════════════════════════════════════════ */
        .kdp-hero-copy { padding-top: 8px; }

        .kdp-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px 7px 12px;
          border-radius: 999px;
          background: rgba(217, 52, 43, 0.08);
          color: #d9342b;
          font-family: var(--font-inter, Inter, sans-serif);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.10em;
          margin-bottom: 24px;
        }
        .kdp-hero-kicker-bolt {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #d9342b;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
        }

        .kdp-hero-h1 {
          font-family: var(--font-inter, Inter, sans-serif);
          font-weight: 900;
          font-size: clamp(40px, 4.4vw, 64px);
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #141414;
          margin: 0;
        }
        .kdp-hero-h1-red { color: #d9342b; }

        .kdp-hero-lede {
          font-family: var(--font-inter, Inter, sans-serif);
          font-size: 16px;
          font-weight: 500;
          color: #14141499;
          line-height: 1.55;
          margin: 22px 0 0;
          max-width: 460px;
        }
        .kdp-hero-lede em {
          font-style: normal;
          color: #141414;
          font-weight: 600;
        }

        .kdp-hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .kdp-hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 26px;
          border-radius: 12px;
          background: #d9342b;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.005em;
          box-shadow: 0 10px 26px rgba(217,52,43,0.30);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .kdp-hero-cta-primary:hover {
          background: #b8291f;
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(217,52,43,0.38);
          color: #fff;
          text-decoration: none;
        }
        .kdp-hero-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 22px;
          border-radius: 12px;
          background: #ffffff;
          border: 1.5px solid #e7dcc4;
          color: #141414;
          font-weight: 700;
          font-size: 15px;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .kdp-hero-cta-ghost:hover {
          border-color: #d9342b;
          transform: translateY(-2px);
          color: #141414;
          text-decoration: none;
        }
        .kdp-hero-cta-play {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #d9342b;
          color: #fff;
          font-size: 9px;
          padding-left: 2px;
        }

        .kdp-hero-social {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 32px;
        }
        .kdp-hero-avatars {
          display: flex;
        }
        .kdp-hero-avatars > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
        .kdp-hero-avatars > span + span { margin-left: -10px; }
        .kdp-hero-social-text {
          font-size: 14px;
          color: #14141499;
        }
        .kdp-hero-social-text strong {
          color: #141414;
          font-weight: 800;
        }

        /* ═══════════════════════════════════════════════════════════
           DIAGRAM (right column)
           ═══════════════════════════════════════════════════════════ */
        .kdp-hero-diagram-wrap {
          position: relative;
          width: 100%;
        }
        .kdp-diagram {
          position: relative;
          width: 100%;
          max-width: 1000px;
          margin-inline: auto;
          aspect-ratio: 1000 / 780;     /* taller than original 720 — clears AI card under niches */
        }
        .kdp-diagram-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .kdp-diagram-col {
          /* Columns + their cards are percentage-sized so the whole
             layout scales smoothly from 1000 px down to phone widths
             — same visual at every scale, just smaller text and
             padding via the compact-mobile @media block below. */
          position: absolute;
          top: 0;
          width: 24%;           /* 240/1000 — anchors the line endpoints in the SVG (SRC_X=240) */
          height: 100%;
          z-index: 2;
        }
        .kdp-diagram-col-left { left: 0; }
        .kdp-diagram-col-right { right: 0; width: 29%; /* 290/1000 — NCH_X=760 */ }

        .kdp-col-header {
          position: absolute;
          top: 0;
          left: 0;
          font-family: var(--font-inter, Inter, sans-serif);
        }
        .kdp-col-header-right { right: 0; left: auto; text-align: right; }
        .kdp-col-step {
          font-size: 11.5px;
          font-weight: 800;
          color: #d9342b;
          letter-spacing: 0.10em;
        }
        .kdp-col-header p {
          font-size: 13px;
          color: #14141499;
          margin: 4px 0 0;
          line-height: 1.4;
        }

        .kdp-source-card {
          position: absolute;
          right: 0;
          /* Slightly inset from the column right edge so the source-→-bot
             path (which anchors at SRC_X=240 in viewBox units, i.e. the
             column's right edge) emerges from a visible card edge. */
          width: 92%;            /* 220/240 of column */
          background: #ffffff;
          border: 1px solid #efe5d2;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(40,25,10,0.06);
          opacity: 0;
          animation: kdp-fade-in 0.6s ease forwards;
          font-family: var(--font-inter, Inter, sans-serif);
        }
        .kdp-source-icon {
          flex-shrink: 0;
          width: 34px; height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #faf5eb;
          font-size: 16px;
        }
        .kdp-source-title {
          font-size: 13px;
          font-weight: 700;
          color: #141414;
          line-height: 1.2;
        }
        .kdp-source-sub {
          font-size: 11.5px;
          color: #14141499;
          margin-top: 1px;
        }

        .kdp-niche-card {
          position: absolute;
          left: 0;
          /* Fills the right column (NCH_X=760 → column at right: 0,
             width: 29% (=290 in viewBox units)). Path endpoint aligns
             with the card's left edge. */
          width: 100%;
          background: #ffffff;
          border: 1px solid #efe5d2;
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(40,25,10,0.06);
          opacity: 0;
          animation: kdp-fade-in 0.6s ease forwards;
          font-family: var(--font-inter, Inter, sans-serif);
        }
        .kdp-niche-thumb {
          flex-shrink: 0;
          width: 50px; height: 60px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: rgba(40,25,10,0.45);
        }
        .kdp-niche-meta { flex: 1; min-width: 0; }
        .kdp-niche-title {
          font-size: 13px;
          font-weight: 700;
          color: #141414;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kdp-niche-meta-line {
          /* Concrete data row: $price · BSR · rating */
          font-family: "SF Mono", ui-monospace, Menlo, monospace;
          font-size: 10.5px;
          color: #141414;
          font-weight: 600;
          margin-top: 3px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kdp-niche-niche {
          /* Niche breadcrumb beneath the data row */
          font-size: 10.5px;
          color: #d9342b;
          font-weight: 700;
          margin-top: 3px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0.85;
        }
        .kdp-niche-score {
          flex-shrink: 0;
          text-align: center;
        }
        .kdp-niche-score-num {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2px solid #00a754;
          color: #00a754;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .kdp-niche-score-label {
          font-size: 10px;
          font-weight: 600;
          color: #00a754;
          margin-top: 2px;
        }

        .kdp-view-all {
          position: absolute;
          /* Sits ~24 px below the last niche card. 552/780 ≈ 70.77% —
             percentage so the link tracks the cards through every scale. */
          top: 70.77%;
          right: 0;
          left: 0;
          text-align: center;
          color: #d9342b;
          font-weight: 700;
          font-size: 13px;
        }
        .kdp-view-all:hover { text-decoration: underline; }

        .kdp-bot-rings {
          animation: kdp-bot-rings 4s ease-in-out infinite;
          transform-origin: 500px 380px;   /* match new BOT_Y */
        }

        .kdp-ai-card {
          position: absolute;
          left: 50%;
          bottom: 6%;
          transform: translateX(-50%);
          /* Centre band only — diagram is 100%, columns claim 24% + 29% =
             53%, leaving 47% in the middle. The AI card takes 38% which
             slots in with ~4–5% breathing room either side. Percentage
             keeps it the same proportion at every diagram scale. */
          width: 38%;
          max-width: 340px;
          background: #ffffff;
          border: 1px solid #efe5d2;
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 6px 18px rgba(40,25,10,0.08);
          z-index: 3;
          font-family: var(--font-inter, Inter, sans-serif);
        }
        .kdp-ai-icon {
          width: 34px; height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(217,52,43,0.10);
          color: #d9342b;
          border-radius: 9px;
          font-size: 16px;
        }
        .kdp-ai-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #d9342b;
        }
        .kdp-ai-sub {
          font-size: 12px;
          color: #14141499;
          margin-top: 1px;
          line-height: 1.35;
        }

        @keyframes kdp-fade-in {
          to { opacity: 1; }
        }
        @keyframes kdp-bot-rings {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }

        /* ── Bot eye blink ──────────────────────────────────────────
           Both eyes close together briefly every 1 s. transform-box:
           fill-box keeps the squeeze centred regardless of the parent
           bot's dynamic breathing scale. */
        .kdp-bot-eyes {
          transform-box: fill-box;
          transform-origin: center;
          animation: kdp-blink 1s ease-in-out infinite;
        }
        @keyframes kdp-blink {
          0%, 82%, 100% { transform: scaleY(1); }
          90%, 94%      { transform: scaleY(0.08); }
        }

        /* ═══════════════════════════════════════════════════════════
           BOTTOM 4-FEATURE STRIP
           ═══════════════════════════════════════════════════════════ */
        .kdp-hero-bottomstrip {
          margin-top: 56px;
          background: #ffffff;
          border: 1.5px solid #efe5d2;
          border-radius: 22px;
          padding: 26px 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          box-shadow: 0 10px 32px rgba(40,25,10,0.05);
        }
        .kdp-hero-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 6px 0;
        }
        .kdp-hero-feature-icon {
          flex-shrink: 0;
          width: 48px; height: 48px;
          background: rgba(217,52,43,0.08);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .kdp-hero-feature-title {
          font-family: var(--font-inter, Inter, sans-serif);
          font-weight: 800;
          font-size: 15px;
          line-height: 1.18;
          color: #141414;
          letter-spacing: -0.01em;
        }
        .kdp-hero-feature-sub {
          font-size: 12.5px;
          color: #14141499;
          margin-top: 4px;
          font-weight: 500;
        }

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════════════════ */
        @media (max-width: 1100px) {
          .kdp-hero-bottomstrip {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 24px;
          }
        }
        @media (max-width: 720px) {
          .kdp-hero-h1 { font-size: clamp(36px, 9vw, 52px); }
          .kdp-hero-bottomstrip {
            grid-template-columns: 1fr;
            padding: 22px 22px;
            gap: 14px 0;
          }
          .kdp-hero-feature-icon { width: 40px; height: 40px; }

          /* ───────────────────────────────────────────────────────────
             Mobile diagram — same desktop side-by-side layout, just
             scaled down. All positions + widths are percentage-based
             already (see the base rules above), so this block only
             needs to shrink the *content* of each card so it fits the
             narrow columns:
               - Source column ≈ 24 % of viewport (~86 px on a 360 px
                 phone) → icon shrinks 34→22, padding 12→6, title 13→9.
               - Niche column ≈ 29 % (~104 px) → thumb 50×60 → 28×34,
                 score 36 → 24, title 13 → 9, padding 12 → 6.
             We deliberately HIDE the subtitle/sub rows and the niche
             breadcrumb at the smallest size — the desktop narrative
             ("Millions of Books", "Real-time data", "Mindfulness
             Journals", etc.) doesn't fit at 86 px wide, and trying to
             squeeze them in becomes microcopy soup. The titles + score
             are what carry the message.
             ─────────────────────────────────────────────────────────── */

          /* Column headers — keep just the step label ("1. ANALYZE",
             "2. SORT & DELIVER") on mobile. The narrative subtitle
             ("We scan & analyze all Amazon books", etc.) wraps onto
             3-4 lines in an 86 px column and gets visually swallowed
             by the first card at top:12.82 %, so we hide it.
             Step label is forced single-line so "SORT & DELIVER"
             doesn't break to two rows. */
          .kdp-col-step {
            font-size: 9px;
            letter-spacing: 0.04em;
            white-space: nowrap;
          }
          .kdp-col-header p { display: none; }

          .kdp-source-card {
            width: 96%;
            padding: 6px 7px;
            gap: 6px;
            border-radius: 8px;
          }
          .kdp-source-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
          }
          .kdp-source-icon svg { width: 14px; height: 14px; }
          .kdp-source-title {
            font-size: 9.5px;
            line-height: 1.15;
          }
          .kdp-source-sub {
            font-size: 7.5px;
            line-height: 1.2;
            /* Subtitle is the first thing to go at really narrow widths
               (see < 380 px below) — keeps the card readable. */
          }

          .kdp-niche-card {
            padding: 6px;
            gap: 6px;
            border-radius: 8px;
          }
          .kdp-niche-thumb {
            width: 28px;
            height: 34px;
            font-size: 14px;
            border-radius: 3px;
          }
          .kdp-niche-title {
            font-size: 9px;
            line-height: 1.15;
            /* Leave the desktop nowrap/ellipsis intact — at 9 px the
               title stays on a single truncated line which reads
               better than wrap-soup in a 60 px content column. */
          }
          .kdp-niche-meta-line {
            font-size: 7.5px;
            margin-top: 1px;
          }
          .kdp-niche-niche {
            font-size: 7.5px;
            margin-top: 1px;
          }
          .kdp-niche-score-num {
            width: 24px;
            height: 24px;
            font-size: 10px;
            border-width: 1.5px;
          }
          .kdp-niche-score-label { font-size: 8px; }

          .kdp-ai-card {
            width: 36%;
            max-width: 220px;
            padding: 7px 9px;
            gap: 6px;
            border-radius: 9px;
          }
          .kdp-ai-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
          }
          .kdp-ai-icon svg { width: 14px; height: 14px; }
          .kdp-ai-title { font-size: 8px; letter-spacing: 0.05em; }
          .kdp-ai-sub   { font-size: 8.5px; line-height: 1.25; }

          /* View-all link — slightly lower so it clears the compressed
             last niche card. Allow wrapping at this width: "View all
             proven niches →" is wider than the ~95 px niche column,
             so we let it break to 2 lines rather than clip off-screen. */
          .kdp-view-all {
            top: 80%;
            font-size: 9px;
            line-height: 1.25;
          }
        }

        /* Very narrow phones (< 380 px) — drop subtitle + niche
           breadcrumb. The card body is so thin at this width that
           keeping them just produces unreadable smear. Title + score
           still carry the meaning. */
        @media (max-width: 379px) {
          .kdp-source-sub,
          .kdp-niche-niche { display: none; }
          .kdp-source-card { padding: 5px 6px; }
          .kdp-niche-card  { padding: 5px; }
          .kdp-niche-thumb { width: 24px; height: 30px; font-size: 12px; }
        }
      `}</style>
      <TopNav />

      {/* ─── Hero ─── */}
      <section className="sk-section pt-32 md:pt-28 kdp-hero-section">
        <div className="sk-container grid lg:grid-cols-[minmax(360px,1fr)_minmax(0,1.6fr)] gap-8 items-start max-w-[1480px]">
          {/* ── LEFT: copy column ── */}
          <div className="kdp-hero-copy">
            <span
              className="kdp-hero-kicker"
            >
              <span className="kdp-hero-kicker-bolt">⚡</span>
              AI BOOK NICHE DISCOVERY ENGINE
            </span>

            <h1 className="kdp-hero-h1">
              We analyze all<br />Amazon books.
              <br />
              <span className="kdp-hero-h1-red">
                You publish<br />proven winners.
              </span>
            </h1>

            <p className="kdp-hero-lede">
              Skillies AI scans millions of Amazon books, analyzes real sales
              signals, reviews, BSR, competition and more to surface{" "}
              <em>the specific books winning their niches right now</em>—so
              you know exactly what to model before you write a word.
            </p>

            <div className="kdp-hero-ctas">
              <a href="#kdp-tool" className="kdp-hero-cta-primary">
                Find winning niches now →
              </a>
              <a href="#signals" className="kdp-hero-cta-ghost">
                <span className="kdp-hero-cta-play">▶</span>
                See how it works
              </a>
            </div>

            <div className="kdp-hero-social">
              <div className="kdp-hero-avatars" aria-hidden>
                <span style={{ background: "linear-gradient(135deg,#f6c8a8,#d9847c)" }}>K</span>
                <span style={{ background: "linear-gradient(135deg,#cda6e0,#8e76b8)" }}>P</span>
                <span style={{ background: "linear-gradient(135deg,#e6b96a,#b58840)" }}>S</span>
              </div>
              <span className="kdp-hero-social-text">
                Join <strong>12,847+</strong> smart publishers
              </span>
            </div>
          </div>

          {/* ── RIGHT: discovery diagram ── */}
          <div className="kdp-hero-diagram-wrap">
            <KdpDiscoveryDiagram />
          </div>
        </div>

        {/* ── BOTTOM: 4-feature strip ── */}
        <div className="sk-container max-w-[1480px]">
          <div className="kdp-hero-bottomstrip">
            <div className="kdp-hero-feature">
              <div className="kdp-hero-feature-icon" style={{ color: "#d9342b" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
                </svg>
              </div>
              <div>
                <div className="kdp-hero-feature-title">AI Analyzes</div>
                <div className="kdp-hero-feature-title">50M+ Books</div>
                <div className="kdp-hero-feature-sub">On Amazon.com</div>
              </div>
            </div>
            <div className="kdp-hero-feature">
              <div className="kdp-hero-feature-icon" style={{ color: "#d9342b" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.5-2 4.5-2 4.5s3-.5 4.5-2c.85-.85.92-2.15.34-3.06" />
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                </svg>
              </div>
              <div>
                <div className="kdp-hero-feature-title">Find High-Profit</div>
                <div className="kdp-hero-feature-title">Niches 10x Faster</div>
                <div className="kdp-hero-feature-sub">Than Manual Research</div>
              </div>
            </div>
            <div className="kdp-hero-feature">
              <div className="kdp-hero-feature-icon" style={{ color: "#d9342b" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="kdp-hero-feature-title">Proven Data.</div>
                <div className="kdp-hero-feature-title">Real Results.</div>
                <div className="kdp-hero-feature-sub">No Guesswork</div>
              </div>
            </div>
            <div className="kdp-hero-feature">
              <div className="kdp-hero-feature-icon" style={{ color: "#d9342b" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l6-6 4 4 8-8" />
                  <path d="M14 7h7v7" />
                </svg>
              </div>
              <div>
                <div className="kdp-hero-feature-title">Higher Rankings.</div>
                <div className="kdp-hero-feature-title">More Sales.</div>
                <div className="kdp-hero-feature-sub">Built on Proven Niches</div>
              </div>
            </div>
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
