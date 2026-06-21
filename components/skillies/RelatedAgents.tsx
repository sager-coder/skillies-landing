"use client";

/**
 * RelatedAgents — internal-linking row to 2 sibling verticals.
 * Boosts crawl depth + topical authority, and keeps a browsing buyer moving
 * across the /for/* cluster. Driven by the verified relatedSlugs in vertical-seo.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { seoFor } from "@/lib/vertical-seo";
import { getVertical } from "@/lib/verticals";

export default function RelatedAgents({ slug }: { slug: string }) {
  const related = (seoFor(slug)?.relatedSlugs ?? [])
    .map((s) => getVertical(s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  if (!related.length) return null;

  return (
    <section className="sk-section border-t border-sk-hairline" aria-label="Other Skillies agents">
      <div className="sk-container">
        <p className="sk-font-meta text-sk-ink40 text-[11px] font-black tracking-[0.2em] uppercase mb-8">
          Explore other agents
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {related.map((v, i) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/for/${v.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-sk-hairline bg-white p-6 transition-all duration-300 hover:shadow-[0_30px_60px_-25px_rgba(20,20,20,0.18)] hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <span className="sk-font-meta text-[9px] font-black uppercase tracking-widest" style={{ color: v.accent }}>
                    {v.eyebrow}
                  </span>
                  <h3 className="sk-font-section text-[18px] md:text-[20px] font-bold text-sk-ink leading-tight mt-1">
                    {v.title}
                  </h3>
                </div>
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-sk-ink/5 text-sk-ink transition-all duration-300 group-hover:translate-x-1 group-hover:bg-sk-red group-hover:border-sk-red group-hover:text-white"
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
