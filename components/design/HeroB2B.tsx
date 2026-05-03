/**
 * HeroB2B · the new homepage hero, post-pivot.
 *
 * Positions Skillies as a B2B AI sales worker — not a tool.
 * Drives click-through to either the vertical chooser (/for) or
 * the public Cal.com booking page.
 *
 * Brand mnemonic: "Tools don't sell. Workers do."
 */
"use client";

import Link from "next/link";

export default function HeroB2B() {
  return (
    <section className="relative isolate pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="sk-container">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,520px)] md:items-end">
          <div>
            <p
              className="sk-font-meta mb-6"
              style={{ color: "var(--sk-ink60)" }}
            >
              SKILLIES.AI · BUILT IN MALAPPURAM, KERALA
            </p>

            <h1
              className="sk-font-display"
              style={{
                fontSize: "var(--sk-text-display)",
                color: "var(--sk-ink)",
              }}
            >
              Tools don&rsquo;t sell.
              <br />
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                Workers do.
              </span>
            </h1>

            <p
              className="sk-font-body mt-6 max-w-[58ch]"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
              }}
            >
              Skillies builds AI sales workers for Indian businesses.
              Vertical-trained, in 5 Indic languages, on WhatsApp + Instagram —
              the worker handles your inbound leads end-to-end. Not a chatbot.
              Not a template. A worker.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/for/real-estate"
                className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--sk-red)",
                  color: "var(--sk-cream)",
                }}
              >
                See it for your business →
              </Link>
              <Link
                href="https://cal.com/sager-zmd4kl/30min"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
                style={{
                  border: "1px solid var(--sk-ink20)",
                  color: "var(--sk-ink)",
                }}
              >
                Book Ehsan · 30 min
              </Link>
            </div>

            <p
              className="sk-font-meta mt-8"
              style={{ color: "var(--sk-ink60)" }}
            >
              Real Estate · Hajj &amp; Umrah · Study Abroad · Coaching ·
              Modular Kitchen · Retail
            </p>
          </div>

          <div className="hidden md:block">
            <FounderQuote />
          </div>
        </div>
      </div>

      <div className="sk-container mt-12 md:hidden">
        <FounderQuote />
      </div>
    </section>
  );
}

function FounderQuote() {
  return (
    <aside
      className="rounded-2xl p-7 md:p-8"
      style={{
        background: "var(--sk-cream-dark)",
        border: "1px solid var(--sk-hairline)",
      }}
    >
      <p
        className="sk-font-display-italic"
        style={{
          fontSize: "1.25rem",
          lineHeight: 1.45,
          color: "var(--sk-ink)",
        }}
      >
        &ldquo;Most WhatsApp tools route messages. We built workers that
        actually close deals — in Malayalam, Hindi, English, and the dialect
        your customer types in.&rdquo;
      </p>
      <p
        className="sk-font-body mt-5"
        style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
      >
        <strong style={{ color: "var(--sk-ink)" }}>Ehsan</strong> · founder, Skillies.AI
      </p>
    </aside>
  );
}
