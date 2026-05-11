"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import BookCallCTA from "@/components/skillies/BookCallCTA";
import SkilliesChatWidget from "@/components/SkilliesChatWidget";

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

export default function SkilliesSchoolContent({
  coursesSlot,
}: {
  /**
   * Pre-rendered courses catalog section (server-fetched in the parent
   * page). Slotted between the financial-proof block and the
   * "What you actually learn" modules so visitors see the actual
   * products right after the proof.
   */
  coursesSlot?: ReactNode;
} = {}) {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--sk-cream)" }}>
      {/* ── Ambient Background Motion (Home Vibe) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vibrant fluid red glows */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 120, 0],
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[90%] h-[90%] rounded-full bg-sk-red/8 blur-[140px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 60, -100, 0],
            scale: [1, 0.9, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-sk-ochre/5 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-sk-red/5 blur-[100px]"
        />
      </div>

      <TopNav />

      {/* Hero */}
      <section className="relative sk-section pt-32 md:pt-40">
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
      <section className="sk-section relative">
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

      {/* Courses catalog — slotted in by the page server component */}
      {coursesSlot}

      {/* What's inside */}
      <section className="sk-section relative">
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
      <section className="sk-section relative">
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
