# Brand Changelog

Record any material change to the Skillies.AI brand system here.
Small tweaks (a tagline edit, a copy rephrase) don't need an entry.
Anything that changes tokens, typography, voice rules, or core
components does.

Entries newest first. Use one bullet per change. Keep it terse —
"what changed · why" — not a full narrative.

---

## v1.0 — 2026-04-19 · First formal cut

The system as it stands after the site-wide editorial rewrite of
April 2026. Extracted from `skillies-landing` into this portable
template.

### Tokens

- Added: `tokens/colors.css` · full palette (cream, red, sage,
  forest, gold, charcoal + text tokens + borders + shadows).
- Added: `tokens/typography.css` · Inter + Instrument Serif italic
  + Malayalam fallback family. Full type scale.
- Added: `tokens/spacing.css` · 4px scale, 6 radii, 4 max-widths,
  3 section-padding presets.
- Added: `tokens/motion.css` · easings, durations, shared keyframes,
  `prefers-reduced-motion` opt-out.
- Added: `tokens/index.css` · single-import entry point.

### Components

- Added: `components/primitives.tsx` · `Kicker`, `KickerPill`,
  `PrimaryButton`, `SecondaryButton`, `Wordmark`, `Grain`.
  React + inline styles, no framework dependency.

### Patterns (docs)

- `patterns/hero.md` · editorial hero with masthead + two-column
  grid + ledger card.
- `patterns/stats-ledger.md` · cream paper card with micro-charts.
- `patterns/newspaper-qa.md` · open Q&A column, no accordion.
- `patterns/timeline-agenda.md` · day-arc + vertical timeline +
  three-act narrative.
- `patterns/receipts-proof.md` · four proof patterns (browser
  chrome, polaroid+receipt, channels sparkline, total+quote).
- `patterns/under-construction.md` · zine-style construction state.
- `patterns/editorial-masthead.md` · § dateline strip, section
  numbering table, variants.

### Voice

- Added: `voice/VOICE.md` · the 5-word voice, hard rules, banned
  phrases, preferred phrases, three worked examples.

### Assets

- `assets/logo-skillies.svg` · light wordmark
- `assets/logo-skillies-dark.svg` · dark wordmark
- `assets/ehsan-founder.jpg` · founder portrait (used in hero /
  about / dashboard avatars)
- `assets/kdp-dashboard.png` · real KDP Royalties Estimator
  screenshot (₹8,71,982 lifetime · 63 books · Mar 2024 – Apr 2026)

### HTML specimens

- `examples/index.html` · brand overview + links to all specimens
- `examples/colors.html` · every swatch + hex + usage note
- `examples/typography.html` · full scale, Inter weight ladder,
  italic pullout demo, number treatments
- `examples/components.html` · six primitives in every variant
- `examples/masthead.html` · § dateline in every background / variant

### Voice decisions baked in at v1.0

- Tagline: **"Earn while you sleep."** (was: "Human Brain + AI
  Skills = Real Income" formula — now used as hero headline, not
  tagline)
- Hero title: **"Human brain. AI skills. Real income."**
- Malayalam **de-emphasised** — brand voice is English-first. Font
  family still in system for actual Malayalam script only.
- Lifetime KDP royalties claim corrected from ₹15.5L (which bundled
  uHRS) to **₹8,71,982** (KDP dashboard only, auditable).
- Student proof removed from site (was 6 fabricated student
  testimonials) — replaced with Ehsan's own receipts + KDP
  screenshot as the single verifiable source.
- 6 founding students (honestly named in dashboard) is the max
  cohort claim we make.
- "Researcher-first, teacher-second" established as Ehsan's
  personal positioning — drives the three-act About story.

### Surfaces using v1.0

- `skillies-landing` (Next.js · github.com/sager-coder/skillies-landing)
  - `/` landing
  - `/workshop` Calicut May 31
  - `/dashboard` Ehsan's live ops view (6 tab views)
  - `/courses` under-construction editorial state

---

## Next planned

Not a promise — just a parking lot.

- `patterns/forms.md` · enrollment form treatment (once the web
  app ships its first form surface).
- `patterns/reel-assets.md` · the Paisa-style forest-green reel
  covers, if that product returns.
- `examples/patterns.html` · a single HTML demo file showing all
  six patterns side by side with code snippets.
- Offline `.woff2` files added to `fonts/` for true self-hosted
  setup.
- A short `patterns/micro-interactions.md` · hover lifts, focus
  rings, scroll reveals — the motion grammar, code-level.
