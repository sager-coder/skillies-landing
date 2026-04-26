# Services Page · Visual Research Report

**Date:** 2026-04-26
**Pages audited:** https://skillies.ai/services (desktop 1440×900 + mobile 375×812)
**Goal:** Identify visual improvements that **do not add or change content**.
**Output:** Findings + ranked fix list.

---

## Method

Captured 14 desktop scroll-positioned screenshots + 8 mobile screenshots after the most recent push (commit `dcb4c72` — pricing-removed bot-routed page). Reviewed each screenshot for hierarchy, rhythm, contrast, alignment, and reading flow. Findings are ranked **High/Medium/Low** based on impact on a first-time boardroom-TV viewer.

---

## What's already working

These don't need change. Calling them out so we don't break them:

1. **Brand palette + typography choice** — the cream/charcoal/red/gold + Instrument Serif italic accents create instant recognition. Consistent across 11 of 11 sections.
2. **Italic-accent display headlines** — *"Built for Kerala"*, *"It has one Skillies"*, *"isn't a checkbox"*, *"actually ask on the call"* — these are the page's signature move and they all land well visually.
3. **Section eyebrow rule pattern** — `§ THE WEDGE` with the thin gold line + right-side meta — works as a visual signature.
4. **Hero red CTA** — strong, on-brand, primary action is clear.
5. **Proof section** — the two portrait video cards are the page's strongest visual moment after the Hero. Good cream background break.
6. **WhySkillies 5 differentiator cards** — premium feel on mobile (well-spaced individual cards).

---

## High-priority issues

### H1. Vertical rhythm is inconsistent across sections
**Observation:** Sections use different `padding` values without a system. Hero `140px 24px 100px`, Wedge looks like ~120px, FrontDesk ~120px, ContentEngine ~120px, Proof `120px 24px`, WhySkillies appears looser. The result is the page **breathes unevenly** on a long scroll — boardroom-TV viewers feel a slight "bumpy" cadence.

**Fix (no content):** Standardize all sections to a single `120px 24px` desktop / `80px 20px` mobile rhythm. Where a section feels too tight (Hero), bump to `150px` top/bottom for a deliberate breath at the start.

---

### H2. WhySkillies 5-card row crops text at 1440
**Observation:** Five cards in a single row on desktop forces each card down to ~250px wide — body text wraps to 5–6 lines, the bottom of card 5 crops the closing word. On mobile, cards stack one-per-row and look great.

**Fix (no content):** Switch desktop layout from `repeat(5, 1fr)` to `repeat(auto-fit, minmax(260px, 1fr))` with a `max 3-per-row` cap, so it becomes 3 + 2 grid. Keeps all 5 cards, no copy change, more breathing room per card. Mobile unchanged.

---

### H3. Proof headline "other end" orphans on its own line
**Observation:** *"What ships out the other end."* — at desktop width the italic "other end." wraps to a second line with just "end." sitting alone. Looks like a rendering bug.

**Fix (no content):** Set `maxWidth: 920px` on the H2 container (currently unconstrained) so the line break happens between *"the"* and *"other end."* — which is the intended pause. Tighten letter-spacing on the italic word to `-0.01em`.

---

### H4. Talk-to-the-Bot card lacks visual presence on desktop
**Observation:** The new bot CTA section is the **single most important conversion moment** on the page (this is where every CTA points). At desktop, the +91 80899 41131 number card sits in the middle of the dark section but the card itself is undefined — unclear borders, the gold rule above is so subtle it competes with the surrounding charcoal. The "Open chat on WhatsApp" red button is good but the number above it isn't framed.

**Fix (no content):** Add a defined gold-bordered card around the entire phone-number block (1px gold border, slight inset shadow, cream-tinted background at 4% opacity to lift it from the charcoal). Treat the number as a museum object, not a body element. Increase the number's font size by ~20%.

---

### H5. FAQ feels like a generic accordion
**Observation:** Currently a plain list of `Question + (+)` rows on a flat cream background. Compared to the editorial moments above (italic accent headlines, video grids, premium cards), the FAQ section reads as institutional / template-y. This is the section where buyers in a boardroom will linger.

**Fix (no content):**
- Add subtle hover state: row background shifts to `rgba(0,0,0,0.02)` + the (+) icon rotates to (×) on hover.
- Add a thin gold rule between rows instead of black-rgba lines (matches the brand).
- Ornament: small `§` symbol at left of each question (mirrors the brand's section eyebrow signature).
- Number the questions `01–09` in italic Instrument Serif (mirrors WhySkillies cards).

These are pure CSS / decoration changes — no FAQ content edits.

---

## Medium-priority issues

### M1. Hero feels visually crowded
**Observation:** Headline + sub + two CTAs + 4 chip-row meta items + section above the meta-row arrow. On desktop the headline bumps the meta row, then chips, then the WhatsApp floating button overlaps. Slight tension at the top of the page.

**Fix (no content):**
- Increase Hero top padding from 140px → 160px.
- Add 12px more space between sub-paragraph and CTA row.
- Reduce the "Malayalam-first · Malappuram" right-side eyebrow font from 11px to 10px so it doesn't compete with main headline.

---

### M2. FrontDesk feature grid uses small fonts on dark
**Observation:** "What's inside · 8 systems / install" lists in small 12-13px text on dark charcoal. Readable on a laptop, **borderline on a 65" boardroom TV from 8 feet away**. The right-rail "Best for" industry chips feel like detail rather than design.

**Fix (no content):**
- Bump body text in feature lists from current size to 14-15px.
- Increase line-height to 1.6 (from current ~1.5).
- Style industry chips with stronger borders (gold at 50% opacity) rather than fill.

---

### M3. ContentEngine "the unfair part" callout competes with main feature card
**Observation:** The 5-bullet feature card on the left and the red-tinted "90 reels a month" callout on the right are roughly equal visual weight, which dilutes the punchline. On a boardroom TV, the eye doesn't know which to read first.

**Fix (no content):**
- Demote the callout to a smaller treatment (thinner border, slightly muted text) so it reads as a *consequence* of the bullets, not a sibling card.

---

### M4. Wedge two-column lists look like raw HTML
**Observation:** "What agencies sell" / "What the owner actually needs" — the columns are functional but feel like two `<ul>` elements next to each other. The italic *"It needs an AI front desk"* in the headline above is gorgeous; the columns underneath don't carry that energy.

**Fix (no content):**
- Add a vertical gold hairline between the two columns.
- Italicize the column headers ("WHAT AGENCIES SELL" / "WHAT THE OWNER ACTUALLY NEEDS") in the brand eyebrow style with proper letterspacing.
- Slightly larger gap between bullet lines.

---

### M5. TopNav primary button is heavy at the corner
**Observation:** The red "Talk to the bot →" button at the top right is the brightest pixel in the navigation row, which is appropriate, but it's currently solid red the same hue as the Hero's primary CTA — so the eye sees TWO red beacons at the same horizontal eye-line as the page loads.

**Fix (no content):**
- Switch the TopNav button to a **darker red outline** (1px red border + transparent fill + red text). On hover, fill solid red. Keeps the brand color but softens the hit at first glance, so the Hero CTA can be the obvious primary action.

---

## Low-priority polish

### L1. Drop the floating green WhatsApp circle on dark sections
That bright green orb in the bottom-right floats over every dark section and breaks the brand palette (no green elsewhere on this page). On dark sections it screams. **Tint it to brand gold or charcoal-on-charcoal at 90% opacity** so it stays visible but doesn't fight the design.

### L2. Add subtle hairline between sections
Currently sections butt up against each other (dark→cream→dark). A 1px gold hairline at the seam would create a deliberate "chapter break" feel on a long scroll. Especially helps the boardroom TV reading.

### L3. Compliance "X" / "✓" markers
The compliance lists use simple "✓" and "✗" characters. On the cream side these are ok; could be upgraded to circled icons for premium feel — but this is **content adjacent** so we may skip.

### L4. FinalCTA needs more vertical drama
It's currently a centered stack: headline + sub + button. The composition is symmetric but flat. Adding more vertical breathing room (larger top/bottom padding) + a single gold ornament under the button would lift it.

### L5. Mobile WhatsApp button overlaps Proof video card
On mobile (375px), the green floating WhatsApp button covers the bottom-right corner of the second video card's controls. Moving the button up by 60px on mobile fixes it.

---

## Implementation plan (ordered by impact / effort)

| # | Fix | Section | Impact | Effort | Risk |
|---|---|---|---|---|---|
| 1 | Standardize section vertical padding to a 6-step rhythm | All | High | Low | Low |
| 2 | WhySkillies grid 5→3+2 layout at 1440px | WhySkillies | High | Low | Low |
| 3 | Proof headline max-width + tightened tracking | Proof | High | XS | None |
| 4 | TalkToTheBot phone-number card framing | TalkToTheBot | High | Med | Low |
| 5 | FAQ hover + numbering + § ornament | FAQ | High | Low | None |
| 6 | Hero top padding + chip row tightening | Hero | Med | XS | None |
| 7 | FrontDesk body text size bump + chip border refinement | FrontDesk | Med | Low | Low |
| 8 | ContentEngine callout demotion | ContentEngine | Med | XS | None |
| 9 | Wedge column rule + eyebrow styling | Wedge | Med | XS | None |
| 10 | TopNav red button → outline default | TopNav | Med | Low | Low |
| 11 | Floating WhatsApp button gold tint + mobile offset | Global | Low | XS | None |
| 12 | 1px gold hairline at section seams | Global | Low | XS | None |
| 13 | FinalCTA padding + gold ornament | FinalCTA | Low | XS | None |

Total surface area: **13 atomic CSS-only changes**. No JSX restructuring, no component creation, no copy edits.

---

## What we are deliberately NOT doing

(per founder directive: "don't add more content")

- ❌ No new sections
- ❌ No new copy lines
- ❌ No image swaps
- ❌ No animation libraries
- ❌ No icon library imports
- ❌ No font additions

Pure CSS / inline-style adjustments to the existing JSX.

---

## Risk assessment

All proposed fixes are inline-style edits to existing components. Build risk: zero (no new imports, no API surface change). TypeScript risk: zero. SEO risk: zero (no semantic HTML changes).

The only change with **any** risk is fix #4 (TalkToTheBot card framing), which adds nested `<div>` wrappers — could affect the centering of the existing layout. We'll verify with a screenshot diff after implementation.

---

## Next step

Implement fixes 1–13 in a single commit, take a fresh screenshot pass, compare against the before/after. Then push.
