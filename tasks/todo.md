# TODO — SEO + per-vertical landing pages

> Branch `pricing/v3-founding-tiers`. Not deployed without explicit OK.

## Phase 0 — Foundations ✅
- [x] 0.1 `--sk-ecommerce-*` tokens in `app/globals.css`
- [x] 0.2 Demo pages noindex (`app/demo/layout.tsx`) + dropped `/demo/*` from sitemap
- [x] 0.3 `/for` hub canonical + OpenGraph
- [x] 0.4 SEO content kept in dedicated `lib/vertical-seo.ts` (cleaner than extending the verticals type)
- [x] 0.5 `FAQPage` variant in `components/JsonLd.tsx`
- [x] **C0:** `npm run build` GREEN (all /for/* static)

## Phase 1 — Content (Workflow) ✅
- [x] 1.1 Generated per-vertical SEO packs (8: 7 via workflow + study-abroad by hand)
- [x] 1.2 Adversarial verify (caught/fixed: "IRDAI-compliant"→aware, "kills RTO" overstated, case-study-as-fact, contradictory price)
- [~] 1.3 Cross-vertical critic — agent dropped on a connection error; verify stage already corrected packs (non-blocking)
- [x] **C1:** packs reviewed, claims grounded

## Phase 2 — FAQ + FAQPage ✅
- [x] 2.1 `lib/vertical-seo.ts` (8 verticals · 5 faqs each · related slugs)
- [x] 2.2 `components/skillies/AgentFAQ.tsx` (accessible accordion)
- [x] 2.3 `FAQPage` JSON-LD emitted (verified: 5 Q + 5 A on real-estate)
- [x] 2.4 Wired `<AgentFAQ/>` into all 8 pages
- [x] 2.5 Meta descriptions auto-upgraded to verified copy via `verticalMetadata()`
- [x] **C2:** rendered FAQ + valid JSON-LD confirmed via curl

## Phase 3 — OG images ✅
- [x] 3.1 `lib/og.tsx` shared renderer + 8 `app/for/<slug>/opengraph-image.tsx` (next/og); removed static images from `verticalMetadata` (no dup og:image)
- [x] **C3:** all 8 generate 1200×630 PNG; og:image points to the generated route (verified on dev). Final build check folded into C5.

## Phase 4 — Internal linking + depth ✅
- [x] 4.1 `RelatedAgents` cross-link row wired into all 8 (≥2 sibling links/page)
- [x] 4.2 SCALING: de-duped homepage `VerticalGrid` + `sitemap.ts` onto `lib/verticals.ts`; extracted icons to `components/skillies/vertical-icons.tsx`; added `cardDesc` to the registry. Now ONE place to add a vertical. Build green, homepage visually identical. CLAUDE.md playbook updated.

## Phase 5 — Audit ✅
- [x] 5.1 Per-vertical SEO audit (Workflow, 8 parallel agents)
- [x] 5.2 Fixed findings: trimmed all 8 titles ≤56 chars; trimmed 5 descriptions ≤158; fixed H1 word-spacing bug in HeroBlockEditorial (display:block spans were concatenating → "losing₹14,000/leadto"); audit's "ecommerce soft-404" was a dev-server compile race (confirmed false — serves correct content + static build per-page). Skipped: aggregateRating (would be fabricated reviews), favicon-anchor (cosmetic).
- [x] **C5:** `npm run build` GREEN; all 8 OG images prerender static; verified titles/H1/desc/og:image in prerendered HTML

## ✅ PLAN COMPLETE (Phases 0–5)
Remaining optional: 4.2 de-dup homepage VerticalGrid onto lib/verticals.ts.
Standing user decisions: deploy (not done — `vercel --prod`), true agents.skillies.ai subdomains.
⚠️ Machine disk was ~100% full — freed .next (862M); flag to user.
