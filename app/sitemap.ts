import type { MetadataRoute } from "next";
import { VERTICALS } from "@/lib/verticals";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://skillies.ai";
  const now = new Date();
  return [
    { url: `${base}/`, priority: 1.0, lastModified: now },
    { url: `${base}/pricing`, priority: 0.9, lastModified: now },
    { url: `${base}/for`, priority: 0.8, lastModified: now },
    ...VERTICALS.map((v) => ({
      url: `${base}/for/${v.slug}`,
      priority: 0.85,
      lastModified: now,
    })),
    // /demo/* are interactive sandboxes, intentionally noindex (see app/demo/layout.tsx)
    // and therefore excluded from the sitemap.
    { url: `${base}/skillies-school`, priority: 0.6, lastModified: now },
    { url: `${base}/guides`, priority: 0.7, lastModified: now },
    { url: `${base}/privacy`, priority: 0.2 },
    { url: `${base}/terms`, priority: 0.2 },
    { url: `${base}/refund`, priority: 0.2 },
    { url: `${base}/data-deletion`, priority: 0.2 },
  ];
}
