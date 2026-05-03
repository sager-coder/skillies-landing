/**
 * /skillies-school · the consumer page (Amazon KDP only, post-pivot).
 *
 * Skillies pivoted to B2B AI sales workers in May 2026. The KDP
 * income-skill content used to be the front door (/workshop, /the-batch,
 * /program). It's now this single destination page, accessible only via
 * the nav and footer links.
 *
 * Founder still cares about this — he earned ₹8.7L from 63 books on
 * Amazon KDP using the same methodology — but it's no longer the
 * primary product.
 */
import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import SkilliesChatWidget from "@/components/SkilliesChatWidget";

export const metadata: Metadata = {
  title: "Skillies School · Amazon KDP income skill",
  description:
    "The Amazon KDP methodology that generated ₹8,71,982 from 63 books. Self-paced, founder-taught, Kerala-context. The original Skillies product, still here.",
};

export default function SkilliesSchoolPage() {
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
            SKILLIES SCHOOL · AMAZON KDP
          </p>
          <h1
            className="sk-font-display max-w-[18ch]"
            style={{
              fontSize: "var(--sk-text-display)",
              color: "var(--sk-ink)",
            }}
          >
            ₹8,71,982 from{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              63 books
            </span>
            . The methodology, taught directly.
          </h1>
          <p
            className="sk-font-body mt-6 max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            Skillies started here. Before we built AI sales workers for
            businesses, we built an income skill — Amazon KDP publishing —
            and ran the system long enough to prove it works for someone
            without a US passport, fancy software, or a marketing budget.
          </p>
        </div>
      </section>

      {/* Proof block */}
      <section className="sk-section">
        <div className="sk-container">
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: "var(--sk-cream-dark)",
              border: "1px solid var(--sk-hairline)",
            }}
          >
            <div className="grid gap-10 md:grid-cols-3">
              <Stat value="₹8,71,982" label="Earned · 36 months" />
              <Stat value="63" label="Books published on Amazon KDP" />
              <Stat value="1" label="Person · ₹35,000 laptop · Malappuram" />
            </div>
            <p
              className="sk-font-body mt-10 max-w-[60ch]"
              style={{
                fontSize: "1rem",
                color: "var(--sk-ink60)",
              }}
            >
              The same methodology — keyword research, book structure,
              cover decisions, royalty pricing, Amazon ads — distilled into
              a self-paced curriculum. No upsell, no recurring fee.
            </p>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="sk-section">
        <div className="sk-container">
          <h2
            className="sk-font-section mb-8 max-w-[24ch]"
            style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)" }}
          >
            What you actually learn.
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {MODULES.map((m, i) => (
              <article
                key={i}
                className="rounded-2xl p-7"
                style={{
                  background: "var(--sk-cream)",
                  border: "1px solid var(--sk-hairline)",
                }}
              >
                <p
                  className="sk-font-meta"
                  style={{ color: "var(--sk-red)" }}
                >
                  MODULE {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="sk-font-section mt-3"
                  style={{ fontSize: "1.375rem", color: "var(--sk-ink)" }}
                >
                  {m.title}
                </h3>
                <p
                  className="sk-font-body mt-3"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink60)",
                  }}
                >
                  {m.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty note */}
      <section className="sk-section">
        <div className="sk-container">
          <div className="mx-auto max-w-[700px]">
            <p
              className="sk-font-meta mb-6"
              style={{ color: "var(--sk-ink60)" }}
            >
              ONE HONEST NOTE
            </p>
            <p
              className="sk-font-display-italic"
              style={{
                fontSize: "1.5rem",
                color: "var(--sk-ink)",
                lineHeight: 1.4,
              }}
            >
              &ldquo;This isn&rsquo;t passive income. It&rsquo;s real income,
              from real work. If you want passive, buy an index fund.
              Skillies School teaches a publishing skill — not a get-rich
              shortcut.&rdquo;
            </p>
            <p
              className="sk-font-body mt-6"
              style={{ fontSize: "1rem", color: "var(--sk-ink)" }}
            >
              <strong>Ehsan</strong>
              <span style={{ color: "var(--sk-ink60)" }}>
                {" "}· founder
              </span>
            </p>
          </div>
        </div>
      </section>

      <BookCallCTA
        heading="Want the curriculum details?"
        note="Send a WhatsApp or email — I'll share the syllabus + price + sample lesson. No funnel, no countdown timer."
      />

      <FooterEditorial />
      <SkilliesChatWidget />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="sk-font-display"
        style={{
          fontSize: "clamp(2rem, 3vw + 1rem, 3rem)",
          color: "var(--sk-ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <p
        className="sk-font-meta mt-3"
        style={{ color: "var(--sk-ink60)" }}
      >
        {label}
      </p>
    </div>
  );
}

const MODULES = [
  {
    title: "Niche + keyword research",
    body: "How to find low-competition KDP niches that actually have buying demand — the spreadsheet, the tools, the trade-off between bestseller chasing and steady earners.",
  },
  {
    title: "Book structure + outline",
    body: "Why 80-page books outsell 200-page books in non-fiction. The chapter framework. Avoiding the Indian-author voice that doesn't sell to US/UK markets.",
  },
  {
    title: "Cover + title decisions",
    body: "The 7-second cover test. Title formulas that work in 2026. Hiring covers vs DIY in Canva (and when each makes sense).",
  },
  {
    title: "Royalty pricing + ad math",
    body: "70% vs 35% royalty bracket math. Setting price to maximise margin without killing volume. Amazon Ads — the bid strategy that returns ROAS, not vanity clicks.",
  },
  {
    title: "Scaling beyond one book",
    body: "How to publish 12 books without burning out. Series strategy. Pen names. When to translate vs when not to.",
  },
  {
    title: "Founder office hours",
    body: "Direct WhatsApp access during the program — Ehsan answers your questions on niche, cover, pricing, ads. Not a community forum. Just you and the founder.",
  },
];
