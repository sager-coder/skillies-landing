# Plan — Best-in-class SEO + per-vertical landing pages

**Goal (user's north star):** "good SEO and per-vertical landing page."
Make every Skillies vertical a standalone, high-ranking, conversion-grade landing
page, and make the whole `/for/*` surface maximally crawlable and rich-result eligible.

**Scope:** `skillies-landing` (live `skillies.ai`). Path-based per-vertical pages at
`/for/<slug>` are the canonical SEO home (decided: cleaner than subdomains, no
duplicate-content risk). 8 verticals: real-estate, ecommerce, retail, study-abroad,
coaching, interiors, hajj, insurance.

---

## Current state (done in prior iterations)

- ✅ Each `/for/<slug>` page: unique `<title>`, meta description, **canonical**,
  **OpenGraph + Twitter**, **JSON-LD** (`SoftwareApplication` + `BreadcrumbList`),
  semantic single `<h1>`.
- ✅ `sitemap.ts` includes all 8 verticals (ecommerce bug fixed); `robots.ts` set.
- ✅ New per-vertical **AgentWorkflow** section; **For-Business hub** lists all 8.
- ✅ `lib/verticals.ts` = single source of truth (slug/title/label/capability/accent/pain/workflow).

## Gaps this plan closes

| # | Gap | SEO value | Notes |
|---|-----|-----------|-------|
| A | No **FAQ section + `FAQPage` JSON-LD** per vertical | HIGH | `components/FAQ.tsx` exists but is wired nowhere; FAQ rich results win SERP real estate |
| B | All pages share the **generic OG image** | MED-HIGH | Per-vertical branded OG via `next/og` route |
| C | **Demo pages indexed** (`/demo/*` in sitemap, no noindex) | MED | Thin/interactive → noindex + drop from sitemap to concentrate authority on `/for/*` |
| D | `/for` **hub lacks canonical + OG** | MED | Add via the seo helper |
| E | `--sk-ecommerce-*` **tokens missing** | LOW (bug) | ecommerce page references `var(--sk-ecommerce-mist)` → undefined |
| F | **Internal linking** between related verticals thin | MED | Cross-links boost crawl depth + topical authority |
| G | Homepage grid still has its **own vertical list** | LOW | De-dup onto `lib/verticals.ts` to stop future drift |
| H | Per-vertical **meta descriptions** can be sharper | MED | Outcome-led, ~155 chars, keyword-front-loaded |

---

## Dependency graph

```
lib/verticals.ts  (add: faqs[], relatedSlugs[], seoDescription?, ogHeadline/ogSub)
        │
        ├──> components/JsonLd.tsx   (add FAQPage variant)
        ├──> components/skillies/AgentFAQ.tsx  (renders FAQ + emits FAQPage JSON-LD)   ──> 8x app/for/<slug>/page.tsx
        ├──> app/for/<slug>/opengraph-image.tsx (per-vertical OG via next/og)
        └──> components/design/VerticalGrid.tsx (de-dup, optional)

content (workflow-generated, verified) ──> fills lib/verticals.ts faqs/seo fields

app/globals.css        (--sk-ecommerce-* tokens)           [independent]
app/sitemap.ts         (drop /demo entries)                [independent]
app/demo/<slug>/page.tsx + VerticalDemoLayout (noindex)    [independent]
app/for/page.tsx       (hub canonical+OG)                  [independent]
```

---

## Phases (vertically sliced)

### Phase 0 — Foundations & quick wins  *(no content dependency)*
0.1 Add `--sk-ecommerce-*` tokens to `globals.css` (fixes undefined var). [E]
0.2 Demo pages → `robots: { index:false, follow:true }` (noindex) + remove `/demo/*` from `sitemap.ts`. [C]
0.3 `/for` hub: add canonical + OpenGraph to its metadata. [D]
0.4 Extend `lib/verticals.ts` `Vertical` type with optional `faqs`, `relatedSlugs`, `seoDescription`, `ogHeadline`, `ogSub` (empty for now).
0.5 Add `FAQPage` variant to `components/JsonLd.tsx`.
**Checkpoint C0:** `npx tsc --noEmit` clean + `npm run build` green.

### Phase 1 — Per-vertical SEO content  *(Workflow, parallel + adversarial verify)*
For each of 8 verticals: read its `content/verticals/*.ts` + page, generate
`{ seoDescription, keywords, faqs[4-5], ogHeadline, ogSub, relatedSlugs }` strictly
grounded in existing copy (NO fabricated stats). Then a skeptic verifies each FAQ
answer against the source; a critic checks cross-vertical tone/keyword spread.
**Checkpoint C1:** content packs reviewed; no fabricated claims.

### Phase 2 — FAQ section + FAQPage rich results
2.1 Fill `lib/verticals.ts` with the verified faqs/seo fields.
2.2 Build `components/skillies/AgentFAQ.tsx` (accessible accordion; returns null if no faqs).
2.3 Emit `FAQPage` JSON-LD (via JsonLd) per page.
2.4 Wire `<AgentFAQ slug=…/>` into all 8 `/for/<slug>` pages.
2.5 Swap each page's meta `description` to the sharper `seoDescription`.
**Checkpoint C2:** rendered HTML shows FAQ + valid `FAQPage` JSON-LD on all 8; tsc/build green.

### Phase 3 — Per-vertical OG images
3.1 `app/for/<slug>/opengraph-image.tsx` via `next/og` (brand bg + vertical title/accent).
   *(Verify against `node_modules/next/dist/docs` — Next 16 API.)*
**Checkpoint C3:** `/for/<slug>/opengraph-image` returns a 1200×630 PNG; `og:image` points to it.

### Phase 4 — Internal linking + content depth
4.1 Render `relatedSlugs` as a "Related agents" cross-link row on each page.
4.2 (Optional) De-dup homepage `VerticalGrid` onto `lib/verticals.ts`.
**Checkpoint C4:** every page links ≥2 siblings; build green.

### Phase 5 — Audit & verify  *(Workflow: SEO audit + adversarial check)*
5.1 Per-vertical SEO audit (title len, desc len, H1 count, canonical, JSON-LD validity, alt text, internal links).
5.2 Fix findings.
**Checkpoint C5:** all 8 pass the audit; `npm run build` green; spot-check rendered `<head>` + JSON-LD.

---

## Global acceptance criteria
- Every `/for/<slug>`: exactly one `<h1>`; title ≤ 60 chars where feasible; description 140–160 chars;
  canonical present; OG (with per-vertical image); `SoftwareApplication` + `BreadcrumbList` + `FAQPage` JSON-LD valid.
- `/demo/*` noindex and absent from sitemap; sitemap lists all 8 `/for/*`.
- `npm run build` passes (Vercel parity). No fabricated metrics in any new copy.
- Not deployed without explicit user OK.

## Verification toolkit
- `npx tsc --noEmit` ; `npm run build`
- `curl -s localhost:3001/for/<slug>` → grep title/canonical/og/ld+json
- `curl -s localhost:3001/sitemap.xml` ; `curl -s localhost:3001/robots.txt`
- JSON-LD sanity: paste into schema validator mentally / structure check.
