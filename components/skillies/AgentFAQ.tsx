"use client";

/**
 * AgentFAQ — buyer-intent FAQ for a vertical landing page.
 * Renders an accessible accordion from the verified lib/vertical-seo packs and
 * emits FAQPage JSON-LD (via JsonLd) so the questions are rich-result eligible.
 * Returns null when a vertical has no FAQ yet.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { seoFor } from "@/lib/vertical-seo";
import { getVertical } from "@/lib/verticals";
import JsonLd from "@/components/JsonLd";

export default function AgentFAQ({ slug }: { slug: string }) {
  const pack = seoFor(slug);
  const vertical = getVertical(slug);
  const [open, setOpen] = useState<number | null>(0);

  if (!pack?.faqs?.length) return null;
  const accent = vertical?.accent ?? "var(--sk-red)";

  return (
    <section id="faq" className="sk-section border-t border-sk-hairline" aria-label="Frequently asked questions">
      <JsonLd variant="faq" faqs={pack.faqs} />
      <div className="sk-container">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Heading */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border shadow-sm mb-6"
              style={{ borderColor: `${accent}22` }}
            >
              <span className="text-[10px]" style={{ color: accent }}>✦</span>
              <span className="sk-font-meta text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>
                Before you ask
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="sk-font-section text-sk-ink sk-text-balance"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.04, fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              Questions, <span className="italic" style={{ color: accent }}>answered.</span>
            </motion.h2>
            <p className="sk-font-body mt-5 text-sk-ink60" style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}>
              The things {vertical?.label ?? "every"} owners ask us before they start.
            </p>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-sk-ink/[0.08] border-t border-sk-ink/[0.08]">
            {pack.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="sk-font-section text-[16px] md:text-[19px] font-bold text-sk-ink leading-snug transition-colors group-hover:opacity-80">
                        {f.q}
                      </span>
                      <span
                        className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300"
                        style={{
                          borderColor: isOpen ? accent : "rgba(20,20,20,0.12)",
                          background: isOpen ? accent : "transparent",
                          color: isOpen ? "#fff" : "var(--sk-ink)",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="sk-font-body pb-7 pr-12 text-[14px] md:text-[15.5px] text-sk-ink60 leading-relaxed">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
