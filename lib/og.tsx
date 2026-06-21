import { ImageResponse } from "next/og";
import { getVertical } from "@/lib/verticals";
import { seoFor } from "@/lib/vertical-seo";

/**
 * Per-vertical Open Graph image (1200×630), generated at build time.
 * Shared by every app/for/<slug>/opengraph-image.tsx. Brand editorial layout:
 * cream field, accent bar, big headline + sub, wordmark + vertical eyebrow.
 * Uses ImageResponse's default font (no custom font load) for build safety.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogImageFor(slug: string) {
  const v = getVertical(slug);
  const pack = seoFor(slug);
  const accent = v?.accent ?? "#D9342B";
  const eyebrow = (v?.label ?? "Skillies").toUpperCase();
  const headline = pack?.ogHeadline ?? v?.title ?? "AI sales workers for your business";
  const sub = pack?.ogSub ?? "An AI sales agent that captures the lead, takes the order, and closes the sale.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF5EB",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: wordmark + vertical eyebrow */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, color: "#141414", letterSpacing: -1 }}>
            SKILLIES<span style={{ color: "#D9342B" }}>.AI</span>
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 4, color: accent }}>
            {eyebrow}
          </div>
        </div>

        {/* Middle: accent bar + headline + sub */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 132, height: 8, backgroundColor: accent, borderRadius: 99, marginBottom: 40 }} />
          <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: "#141414", lineHeight: 1.04, letterSpacing: -2, maxWidth: 1020 }}>
            {headline}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "rgba(20,20,20,0.62)", lineHeight: 1.3, marginTop: 30, maxWidth: 940 }}>
            {sub}
          </div>
        </div>

        {/* Bottom: canonical address */}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "rgba(20,20,20,0.45)" }}>
          skillies.ai/for/{slug}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
