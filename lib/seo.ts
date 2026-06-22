/**
 * Per-vertical SEO helpers.
 *
 * Every /for/<vertical> page is a standalone, indexable landing page for one
 * Skillies agent. This builds its <title>, description, canonical URL, and
 * OpenGraph/Twitter cards in one place so all eight verticals stay consistent
 * and free of duplicate-content ambiguity.
 *
 * Site-wide defaults (metadataBase, icons, themeColor, viewport) come from the
 * root app/layout.tsx and are inherited — only the per-page overrides live here.
 */
import type { Metadata } from "next";
import { seoFor } from "@/lib/vertical-seo";

/** Canonical production origin. Matches metadataBase in app/layout.tsx. */
export const SITE_URL = "https://skillies.ai";

export type VerticalSeo = {
  /** Route slug under /for, e.g. "real-estate". */
  slug: string;
  /** Full document <title>. */
  title: string;
  /** Meta description — keep ~150–160 chars, lead with the outcome. */
  description: string;
  /** Optional focused keyword set for this vertical. */
  keywords?: string[];
};

/**
 * Build Next.js Metadata for a /for/<slug> vertical page: canonical URL +
 * OpenGraph + Twitter card. The og:image / twitter:image come from the
 * per-segment app/for/<slug>/opengraph-image.tsx (generated 1200×630), so we
 * deliberately omit `images` here to avoid duplicate og:image tags.
 * Pair with <JsonLd variant="vertical" …/> on the page for structured data.
 */
export function verticalMetadata({
  slug,
  title,
  description,
  keywords,
}: VerticalSeo): Metadata {
  const url = `${SITE_URL}/for/${slug}`;
  // Prefer the verified, outcome-led SEO copy when we have it for this vertical.
  const pack = seoFor(slug);
  const desc = pack?.seoDescription ?? description;
  const kw = keywords ?? pack?.keywords;
  return {
    title,
    description: desc,
    keywords: kw,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: "Skillies.AI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}
