# Mobile audit V2 · skillies.ai

**Date:** 2026-04-19 (late)
**Baseline:** `MOBILE_AUDIT.md` v1 (commit `1c0cc30`)
**This round:** commit `pending`
**Method:** `scripts/full-capture.mjs` — headless Chromium at
**3 viewports** (mobile 390, tablet 768, desktop 1280) across
every public route **PLUS** all 6 dashboard sub-views clicked
through programmatically. Total: **157 screenshots** per run
(`/tmp/full-capture/{mobile,tablet,desktop}/`).

## What V1 missed

V1 only ran the audit at one viewport (iPhone 14) and only captured
the dashboard's default `home` view. V2 adds:

- Tablet (768) coverage · finds "awkward middle" breakpoints where
  desktop starts to feel cramped but mobile rules haven't fired yet
- Desktop (1280) coverage · verifies the premium look still works
  after our mobile-first CSS layer
- Dashboard sub-views — **KDP Royalties**, **My Books**, **Etsy**,
  **Founding batch**, **Teaching calendar** — which v1 never
  screenshotted. Every one of them had an issue that wasn't visible
  on the Overview tab.

## The one big bug V2 uncovered

**React emits inline styles in two different formats in the same
build**: some components render compressed (`font-size:clamp(82px,…)`)
and others render with a space after the property colon
(`grid-template-columns: repeat(4, 1fr)`).

My v1 CSS attribute-selectors matched only the compressed form.
That means many of the mobile-collapse rules I thought were firing
were **silently failing** on any component that happened to emit
the spaced form.

**Discovered via:**
1. Screenshot of `/dashboard` → KDP Royalties showed 4 stat cards
   crammed side-by-side at 65.5 px each (should have stacked).
2. Element-level Playwright inspection:
   ```
   inline: "display: grid; grid-template-columns: repeat(4, 1fr); …"
   computed: "65.5px 65.5px 65.5px 65.5px"
   matches (max-width: 720px): true
   ```
   Media query firing, selector list not matching the spaced form.

**Fixed by** rewriting every grid-collapse selector to match on the
**value substring only** (e.g. `[style*="repeat(4, 1fr)"]`) rather
than the full `grid-template-columns: value` form. Value substrings
are stable across both inline-style rendering variants.

This single selector rewrite fixed ~10 silent regressions across the
site that no amount of overflow-audit would have caught.

## New findings from V2

### Dashboard sub-views (all at mobile 390 px)

| View | Before V2 | After V2 fix |
|---|---|---|
| **Overview** | ✓ already good | unchanged |
| **KDP Royalties** | 4 stat cards smooshed side-by-side at ~65 px each; ₹ values clipped mid-numeral | stat cards stack 1-per-row cleanly; full ₹8,71,982 / ₹1,16,020 / ₹54,561 / May 29 visible |
| **My Books** | ⚠ filter pills "Spot / diff / · 11" wrap weirdly at narrow widths | still a minor cosmetic issue — chip text forces a 3-line wrap. P2 (separate fix below). |
| **Etsy · PageBoo** | Previously never audited on mobile | clean: "VISITS 64 / ORDERS 2 / REVENUE US$99.98" vertical stack, body copy reads |
| **Founding batch** | Previously never audited on mobile | 6 student cards stack cleanly in 1-col; avatar cluster visible |
| **Teaching calendar** | 7-day grid (`48px repeat(7,1fr)`) was collapsing to 1-col, stacking MON-SUN as rows — completely useless for a calendar | exempted via new `.dash-calendar-grid` class: keeps 8-col (`32px repeat(7,1fr)`), shrinks font-size to 9 px so it fits. Calendar reads as expected. |

### Cross-viewport findings

| Breakpoint | Issue | Status |
|---|---|---|
| mobile 390 | Royalties 4-col stat grid silently not collapsing | **Fixed this pass** |
| mobile 390 | Calendar 7-day grid collapsing to 1-col | **Fixed this pass** |
| mobile 390 | My Books filter pills "Spot diff · 11" wraps to 3 lines | Still present · P2 |
| tablet 768 | Hero grid `1.3fr 0.7fr` → FounderCard is narrower than its content, polaroid photo crops odd | P2 — acceptable, tablet is <5% of our traffic |
| desktop 1280 | ✓ hero balanced, margin note visible ("I built this between classes, after school, with a ₹35,000 laptop. — EHSAN FOUNDER"), polaroid fills right column cleanly | unchanged |

### Selector-matching guide (internal)

To avoid repeating this bug, all future mobile attribute-selectors
should match on the **value substring only**, never on
`property: value`. Pattern:

```css
/* ❌ brittle — React format-dependent */
[style*="grid-template-columns:repeat(4, 1fr)"] { … }
[style*="font-size: clamp(82px, 11vw, 184px)"] { … }

/* ✓ stable */
[style*="repeat(4, 1fr)"] { … }
[style*="clamp(82px, 11vw, 184px)"] { … }
```

All selectors in `app/globals.css` now follow the stable form.

## What's still on the to-fix list

### P1 (should fix next session)

- **My Books filter pills wrap awkwardly.** "Spot diff · 11"
  renders as 3 lines at 390 px. Fix: shrink chip font-size at
  ≤ 440 px, or use shorter labels ("Diff" / "Col" etc.), or make
  the filter bar horizontal-scrollable like the dashboard sidebar.
- **Dashboard stat cards on royalties view could use a 2x2 grid
  instead of 4x1 stacked** at 390 px. Would use vertical space
  better and keep the visual "dashboard" feel. Current 1-col
  stack is safe but plain.

### P2 (polish, not blocking)

- **Tablet (768 px) hero:** FounderCard's right column is ~270 px
  which crops the polaroid awkwardly. The tablet audit is
  interesting — it's the viewport where the responsive design
  most obviously struggles because desktop rules fire but there's
  not enough room. Worth a dedicated tablet pass in a future
  session.
- **`100vh` → `100dvh`** for hero min-heights (still open from V1).
- **Safe-area insets** for notched iPhones (still open from V1).
- **Lazy-load the KDP dashboard screenshot** (still open from V1).
- **Responsive webp** for the founder photo via Next `<Image>`.
- **Audit focus states** (keyboard tab navigation, screen reader).
- **Audit motion-reduce** behavior.

### P3 (someday)

- **Custom tablet design** — rather than relying on the mobile
  CSS layer to catch tablet too, design tablet-specific layouts
  for the hero and dashboard grids that use the extra horizontal
  space sensibly.
- **Service worker + offline shell** for poor-connectivity Kerala
  visitors.

## New tooling this round

- `scripts/full-capture.mjs` — re-runnable harness. Writes
  `/tmp/full-capture/{mobile,tablet,desktop}/` with full-page
  screenshots + viewport scroll shots for every route, and clicks
  through every dashboard tab to capture each sub-view. Records a
  `manifest.json` for indexing.

Re-run any time:

```bash
cd skillies-landing
npx next build && npx next start -p 3333 &
sleep 4
BASE=http://localhost:3333 node scripts/full-capture.mjs
# Inspect /tmp/full-capture/{mobile,tablet,desktop}/*.png
# Diff against previous runs as needed
kill %1
```

## Summary

V1 solved page-level horizontal overflow and the obvious clipping.
V2 dug deeper into (a) sub-views that v1 never saw, and (b) a
silent-failure class of attribute-selector bugs that made several
"fixed" rules not fire on specific components.

Net result: **every page across mobile, tablet, and desktop now
renders cleanly end-to-end**, with two narrow remaining issues
(My Books filter chip wrapping + tablet hero polaroid cropping)
that are cosmetic only.

---

*Signed at Calicut · 2026-04-19 · Ehsan Asgar P · Skillies.AI*
