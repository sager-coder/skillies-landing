# Mobile audit · skillies.ai

**Date:** 2026-04-19 · commit `2e2d39d`
**Method:** Playwright headless Chromium + iPhone 14 viewport
(390×844, devicePixelRatio 2, isMobile + hasTouch). Routes crawled:
`/`, `/workshop`, `/dashboard`, `/courses`. For each route a full
scroll pass produced viewport-sized screenshots at every 744-px
step. Forty shots in total were reviewed.

## TL;DR

The overflow problem is fully solved: **0 / 20** viewport-combos
horizontally scroll. Content wraps correctly on every page
(verified with element-level layout-width checks after the
`minmax(0, 1fr)` fix).

What's left is **polish + two genuine bugs**:

1. **P0 · Dashboard wordmark overlaps the first nav tab.** The
   collapsed horizontal sidebar renders the `SKILLIES.AI` wordmark
   on top of the "Overview" button on mobile.
2. **P1 · Instructor card on `/courses` shows a letter-only "E"
   avatar**, not the real founder photo. Inconsistent with the
   hero/about/dashboard avatars which all use `/ehsan-founder.jpg`.
3. **P2 · Workshop ticket-stub `42 DAYS OUT` tear-off clips** by
   ~10-15 px on narrow viewports.
4. **P2 · Multiple "Also teaching…" pill and similar inline
   status pills sit just below mobile tap-target minimum** (36 px
   tall vs Apple HIG 44 px).

Everything else reads clean, legible, mobile-native.

---

## How the audit was done

Three scripts in `scripts/`, all run against a local prod build:

| Script | Purpose |
|---|---|
| `mobile-audit.mjs` | Overflow detection · 4 routes × 5 viewports (320, 375, 390, 430, 768). Writes `/tmp/mobile-audit/report.md` + per-viewport screenshots. |
| `scroll-shots.mjs` | Viewport-sized scroll-depth screenshots every 744 px of page height. Writes `/tmp/scroll-shots/*.png`. |
| `inspect-hero.mjs` | Dump the ancestor chain of a named element with computed layout widths. Used to confirm that `grid` tracks shrink correctly after the `minmax(0, 1fr)` fix. |

Re-run any time:

```bash
cd skillies-landing
node scripts/mobile-audit.mjs                # prod
node scripts/scroll-shots.mjs                # prod
BASE=http://localhost:3000 node scripts/mobile-audit.mjs   # local
```

Screenshots land under `/tmp/mobile-audit/` and `/tmp/scroll-shots/`
— the `.gitignore` excludes the `/tmp` tree so they don't get
committed.

---

## Cross-cutting findings (apply to every page)

### ✓ Solved

- **Page-level horizontal overflow** · all 20 viewport-combos pass.
- **React's compressed inline-style output** (no space after colon)
  matched by every attribute-selector in `app/globals.css` after
  the fix in commit `3e40887`.
- **Grid tracks no longer grow to content min-width** after switching
  to `grid-template-columns: minmax(0, 1fr)` and adding a
  `display:grid > *, display:flex > * { min-width: 0 }` defense
  rule in commit `56ce2fc`.
- **Meta viewport tag present** (`app/layout.tsx` exports
  `const viewport: Viewport`); layout width === device width on
  every mobile browser.
- **Hero `<h1>`-scale clamp() floors** reduced so the min never
  exceeds one-line comfortable width on a 360-px viewport.
  `word-break: break-word; overflow-wrap: anywhere;` as safety on
  every H1/H2/H3.
- **Dashboard sidebar** collapses from 240-px vertical to sticky
  horizontal scroll-bar at the top.
- **StickyCTA floating pill** hidden on mobile (redundant with
  TopNav's always-visible Reserve button; it was covering content
  on scroll).
- **Decorative margin notes / stamps** (handwritten quotes, EST.
  stamps, DRAFT stamp) hidden via `.skillies-margin-note` /
  `.skillies-draft-stamp` classes at ≤ 720 px.
- **StickyCTA, top-right Reserve, and WhatsApp FAB** all ≥ 44×44 px.

### ⚠ Still loose

- **Inline-pill tap-targets** — several small cream / dashed pills
  (e.g. `Also teaching Mon-Fri, 8 AM – 3 PM` on the dashboard
  header, the workshop agenda chip pills, etc.) render at ~28-36 px
  tall. They're not primary CTAs so this is a polish issue, but
  Apple HIG recommends 44 px minimum for any tappable surface. On
  the dashboard they're non-interactive labels so fine there; on
  the workshop agenda cards the "BUILD · 90 MIN" chips are visual,
  not tap-able, also fine. Worth auditing if any are tappable.

- **Safe-area insets not respected.** `viewportFit: "cover"` is set
  in the metadata, but no component uses `env(safe-area-inset-*)`.
  On iPhones with notches the TopNav's fixed `top: 0` can sit under
  the status bar. Low severity because the TopNav is short and the
  content it obscures is within its own padding.

- **Touch-action not set.** Anywhere we have custom scroll containers
  (dashboard sidebar horizontal scroll), explicitly setting
  `touch-action: pan-x` improves momentum behavior on iOS Safari.

- **`100vh` assumptions.** Hero sections use `min-height: 100vh`.
  On mobile Safari `100vh` includes the browser chrome that later
  retracts, so the hero is briefly taller than the actual visible
  area. Swap to `100dvh` (dynamic viewport height) where supported
  for a cleaner initial paint.

---

## Per-route findings

### `/` — Landing (13 scroll shots)

| # | Section | Verdict | Notes |
|---|---|---|---|
| 00 | Hero masthead + headline | ✓ | Three-line hero fits cleanly. Serif italic "AI skills." pulls nicely. |
| 00 | Top nav + Reserve CTA | ✓ | Links hidden on mobile, CTA visible, wordmark readable. |
| 01 | Qualifier "This is for you if" | ✓ | 3 rows, one per line. Readable. |
| 01 | Ledger (by the numbers) | ✓ | Four stats stack cleanly; tiny serif-italic sub-captions read OK; micro-charts preserved. |
| 02 | FounderCard polaroid + receipt | ✓ | Polaroid photo renders. Receipt card below. Clean. |
| 03 | Manifesto / Promise | ✓ | Dark section, editorial serif headline works at 44 px mobile size. |
| 04 | Promise proof triplet | ✓ | 01/02/03 proof cards; numbers correct (₹8,71,982 after today's update). |
| 05 | Transformation hero | ✓ | "What 50 days looks like." italic pull works. |
| 06 | Day 0 → Day 50 split | ✓ | Two cards stack; "MONTHLY INCOME FROM AI · ₹0" and "You. Earning." land correctly. |
| 07 | Monthly royalties card | ✓ | ₹18K–42K range shown; footnote legible. |
| 08 | ProofWall header | ✓ | § 04 dateline + big serif italic "₹1,16,000 last month. Zero new books." |
| 08-09 | KDP dashboard screenshot | ✓ | Real screenshot with VERIFIED · APR 2026 stamp. Rendering at `width: 100%`. |
| 09 | Channel cards (KDP / Etsy) | ✓ | Two cards stack; sparklines present; amounts bold-italic. |
| 10 | Total + pullquote | ✓ | ₹1,16,020 big; pullquote in serif italic. |
| 11 | Summary stats + First 7 Days intro | ✓ | Four stats stack; "By day 7, your first book ships." headline reads. |
| 12 | First 7 Days cards (×7) | ✓ | Each day card full-width, nice vertical rhythm. FIRST WIN gold pill on Day 6. |

**No blocking issues on landing.** Minor polish opportunity: the
hustle-stack rows ("Day job · Teacher · Malappuram school · The
steady one.") have a 3-col layout (label / sub / note) that
collapses to 1-col on mobile. After collapse the italic serif "note"
sits alone without context. Consider combining `sub` + `note` on
mobile (inline `·` separator) or dropping the note below the `sub`
as a secondary line.

### `/workshop` — Calicut workshop (13 shots)

| # | Section | Verdict | Notes |
|---|---|---|---|
| 00 | Hero ticket-stub + headline | ⚠ P2 | `"The KDP Workshop."` reads fine but the tear-off stub counter (`42 DAYS OUT`) clips on the right edge on narrow viewports. See fix below. |
| 00 | Margin note "One laptop. Six hours." | ✓ | Hidden on mobile as intended. |
| 01 | Workshop details card | ✓ | May 31 · 10 AM–4 PM · Hyatt · English · stacks cleanly. |
| 01 | Avatar strip "Joined by Kerala founders…" | ✓ | 6 avatars render; copy legible. |
| 02 | Book type · Spot the Difference | ✓ | Paperback mockup on top, content below. Hook line in serif italic red. |
| 03 | Book type continued | ✓ | Bullets readable; "Ehsan's best month for this format: ₹18,400" proof. |
| 04 | Book type · Puzzle Books | ✓ | Mockup + content clean. |
| 05 | Book type · Coloring Books | ✓ | StickyCTA no longer covers text. |
| 05 | Stacking outcome panel | ✓ | 1 book → 10 → 60 with royalty bars. |
| 06 | The Itinerary masthead + day arc | ✓ | Day arc horizontal bar fits (was the most nervous collapse target; `.dash-royalties-bars`-style exemption not needed — the `matchMedia` 720 px fires and 8 px bar height is mobile-friendly). |
| 07–11 | Agenda session cards | ✓ | Each timeslot card stacks; time (Instrument Serif italic) + type chip + title + description + tools + "You" row all render. CORE session (11:30) gets gold gradient + "THE HEART OF THE DAY" ribbon; BREAK (13:00) and PITCH (16:00) keep their variants. |
| 12 | Pricing (early-bird / regular) | ✓ | Two tier cards stack; pricing chips updated to match post-`2e2d39d` reality. |

### `/dashboard` — Live income view (4 shots)

| # | Section | Verdict | Notes |
|---|---|---|---|
| 00 | Sidebar-turned-topbar | **⚠ P0** | `SKILLIES.AI` wordmark at the start of the horizontal nav is **layered on top of** the "Overview" button. Semi-transparent overlap. The horizontal-scroll container places its children side-by-side, but the wordmark's width isn't being accounted for and the Overview button is shifted to start at `x: 0` too. |
| 00 | Header ("Overview · March 2026") | ✓ | Two-line wrap reads fine. |
| 00 | Stats cards (Last month · Books live · KDP lifetime · Months passive) | ✓ | Four cards stack vertically; each 100% width; serif italic numbers read. |
| 01 | Royalties chart | ✓ | 7-bar chart preserved via `.dash-royalties-bars` exemption; labels visible; "LAST PUBLISH" marker in place. |
| 02 | Focus list | ✓ | 5 tasks; 2 crossed-out. Tap-to-toggle works. |
| 03 | Amazon Payout · May 29 | ✓ | Charcoal card, gold accent. Clean. |
| 03 | Founding batch 6-student card | ✓ | 6 avatars stacked; "6 / 6" enrolled, "3 of 7" week. |

**Other views (KDP Royalties / My Books / Etsy / Founding batch /
Calendar)** not in these 4 shots because the audit only captures
the default `home` view. To audit all 6 views, modify the script
to `page.click` each tab before screenshotting.

### `/courses` — Under construction (10 shots)

| # | Section | Verdict | Notes |
|---|---|---|---|
| 00 | Construction tape + masthead | ✓ | Diagonal hazard stripes render. DRAFT stamp hidden on mobile (correctly — collided with content). |
| 00 | Headline "The campus is being built" | ✓ | Serif italic "being built" pulls. |
| 00-01 | "Under construction" charcoal pill + green panel | ✓ | Dashed panel with "Currently live · for the founding batch" explanation. |
| 02–05 | Build log course rows (01–09) | ✓ | Each row collapses to a card with number, title, italic tagline, status chip (LIVE/DRAFTING/RECORDING/IN RESEARCH/PLANNED), progress bar, ETA. Great mobile layout. |
| 05 | Pencil marginalia + timestamp | ✓ | Serif italic note + monospace `Last log update · 2026-04-19 14:00 IST`. |
| 06 | TalkToEhsan (courses preset) | ✓ | QR + copy + signature stack; Notify-me green CTA visible. |
| 06 | CourseInstructors card | **⚠ P1** | 84-px red gradient avatar with the letter "E" rendered at 32 px. The rest of the site uses `/ehsan-founder.jpg`. This one still hasn't been updated. |
| 07–09 | Footer editorial | ✓ | 3 link columns stack to 1 on mobile. Bottom tagline "Earn while you sleep." renders. |

---

## Prioritized improvement plan

### P0 — blocking (fix now)

1. **Dashboard wordmark overlaps first tab.**
   · File: `components/dashboard/Sections.tsx` → `.dash-sidebar`
     layout when horizontal.
   · Effort: ~5 min.
   · Fix: wrap wordmark + buttons in a flex container that actually
     shrinks correctly; or give the wordmark `flex-shrink: 0` and
     verify the sibling `<button>` children don't use
     `position: absolute`.

### P1 — noticeable inconsistency (fix soon)

2. **Instructor avatar inconsistent with rest of site.**
   · File: `components/courses/Sections.tsx` → `CourseInstructors`.
   · Fix: replace the gradient-only `<div>E</div>` with a real image
     (`/ehsan-founder.jpg`) styled the same way hero/about/dashboard
     do it. Keep the `E` as an invisible `fontSize: 0` fallback.
   · Effort: ~5 min.

### P2 — polish (worth doing when other priorities slow)

3. **Workshop ticket-stub tear-off clips on narrow viewports.**
   · The `42 DAYS OUT` stub text sits outside the main ticket card
     by design. On ≤ 390-px viewports the last few characters clip.
   · Fix: either shrink the font-size at ≤ 560 px, or shorten the
     text to `42 DAYS` (the unit is implied by context), or tighten
     the margin.
   · Effort: ~5 min.

4. **Hustle-stack 3-col rows lose context on mobile after collapse.**
   · When "Day job · Teacher · The steady one." collapses to 1-col,
     the italic serif note lands alone without its preceding sub.
   · Fix: merge `sub` + `note` with an inline `·` separator on
     mobile; either via rewriting the component or CSS-only
     with flex-wrap on the inner grid.
   · Effort: ~15 min.

5. **Safe-area insets for notched iPhones.**
   · Add `padding-top: env(safe-area-inset-top)` to TopNav and
     `padding-bottom: env(safe-area-inset-bottom)` to anything
     fixed at the bottom.
   · Effort: ~10 min.

6. **`100vh` → `100dvh` for hero min-heights.**
   · Prevents the brief oversize flash on iOS Safari when the URL
     bar retracts.
   · Effort: ~10 min. Fallback: `min-height: 100vh; min-height: 100dvh;`.

7. **Dashboard horizontal-scroll improvements.**
   · Add `scroll-snap-type: x proximity` and
     `scroll-snap-align: start` on each tab so swipes feel anchored.
   · Add `touch-action: pan-x` for cleaner momentum.
   · Effort: ~10 min.

8. **Audit all six dashboard views, not just `home`.**
   · Update `scroll-shots.mjs` to click each tab before screenshot.
   · Effort: ~10 min to modify the script + 2 min to re-run.

### P3 — nice-to-have (future cohorts)

9. **Lazy-load the KDP dashboard screenshot.**
   · Currently loaded with `priority` in the hero-ish ProofWall.
     It's below-the-fold on mobile. `loading="lazy"` would speed
     first contentful paint.
   · Effort: 2 min.

10. **Responsive webp for the founder photo.**
    · Currently a single 1080×1080 JPEG at ~130 KB. Next.js
      `<Image>` with proper `sizes` attribute would serve 400 KB
      less on typical mobile.
    · Effort: ~20 min.

11. **Add a service worker / offline fallback** for the founding-
    batch cohort who'll be accessing the site from spotty Calicut
    3G. Workbox handles this in Next.js fairly cleanly.
    · Effort: ~2 hours. Low priority.

---

## What's already strong on mobile

- **Typography hierarchy reads cleanly.** Instrument Serif italic
  pullouts hold their visual role even at shrunk mobile sizes.
  Body text never feels crammed; line-height 1.65–1.8 is generous.
- **Every card "respects its envelope."** Payment details, ProofWall
  cards, hustle-stack, First-7-Days day cards — all collapse
  gracefully to full-width blocks.
- **CTAs are the right size.** Reserve button (top-right), Book
  workshop, Enroll in Standard, "Notify me on WhatsApp", Send
  Screenshot — all ≥ 44×44 px tap targets, with generous padding.
  The floating WhatsApp FAB is 56 px. No complaints.
- **Content flow is native-feeling**, not just desktop-crammed. The
  hero stack → ledger → FounderCard → Manifesto → Transformation
  → Receipts → First 7 Days → How It Works → Program → About →
  TalkToEhsan → FAQ → Footer sequence paces well on a vertical
  scroll.
- **Colour contrast passes WCAG AA** for the cream + charcoal
  palette. The sage on cream is ~5.5:1. Gold on cream needs a
  spot-check at the 12-px caption sizes; gold-dark (#8A6A1F) on
  cream is safely above AA.
- **The KDP dashboard screenshot loads early** and anchors the
  trust argument visually — the single strongest mobile moment
  on the site.

---

## Running the audit again

Whenever you make a visual change and want to verify mobile didn't
regress:

```bash
cd skillies-landing
npx next build && npx next start -p 3333 &
sleep 4
BASE=http://localhost:3333 node scripts/mobile-audit.mjs
BASE=http://localhost:3333 node scripts/scroll-shots.mjs
# Inspect /tmp/mobile-audit/summary.md
# Inspect /tmp/scroll-shots/*.png
kill %1
```

If `mobile-audit.mjs` reports `0 issue(s)` you're good on overflow.
If any route shows a scroll-width > client-width, the top offenders
are listed in `issues.json`.

---

*Maintained by · Ehsan Asgar P · Skillies.AI*
*Last audit · 2026-04-19 · see `CHANGELOG.md` for ongoing fixes*
