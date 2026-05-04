# Skillies.AI — Brand System

**Version 1.0 · April 2026 · Built in Malappuram, Kerala**

> A research-and-teach school for the age of AI. We find what pays in
> 2026, teach it plainly, and build tools for Kerala businesses.
> Proof-backed. Editorial. Honest.

This folder is the portable brand template — **colors, typography,
components, patterns, voice, and assets** — for anyone (human or
agent) designing anything under the Skillies.AI name.

---

## What's in this folder

```
skillies-brand/
├── README.md                  ← you are here (start with this)
├── tokens/                    ← drop-in CSS variables
│   ├── colors.css               colors, borders, shadows
│   ├── typography.css           fonts, type scale
│   ├── spacing.css              spacing + radii
│   ├── motion.css               easings + durations
│   └── index.css                all of the above in one import
├── fonts/
│   └── README.md                font sources (Google Fonts for now)
├── assets/
│   ├── logo-skillies.svg        light wordmark
│   ├── logo-skillies-dark.svg   dark wordmark
│   ├── ehsan-founder.jpg        founder portrait
│   └── kdp-dashboard.png        royalties proof screenshot
├── components/
│   ├── primitives.tsx           Kicker · KickerPill · Buttons · Wordmark · Grain
│   ├── editorial-masthead.tsx   § dateline pattern
│   ├── newspaper-column.tsx     two-column Q&A layout
│   ├── ledger-card.tsx          stats strip with micro-charts
│   └── construction-tape.tsx    under-construction visual
├── patterns/                  ← ways to compose the system
│   ├── hero.md
│   ├── stats-ledger.md
│   ├── newspaper-qa.md
│   ├── timeline-agenda.md
│   ├── receipts-proof.md
│   └── under-construction.md
├── voice/
│   └── VOICE.md                 writing + tone guide
├── examples/                   ← open these in a browser
│   ├── index.html               brand overview
│   ├── colors.html              palette specimen
│   ├── typography.html          type specimen
│   ├── components.html          primitives demo
│   └── masthead.html            editorial masthead demo
└── CHANGELOG.md
```

All HTML examples are standalone — no build step, no framework.
Open them in a browser, right-click inspect, steal the parts you
need.

---

## The 60-second brand read

**What we are.** A research-and-teach school, not a course factory.
Ehsan Asgar P. — teacher by day, AI publisher by night — is the
one-person studio behind Skillies.AI. We publish honest numbers,
teach in plain language, and build tools alongside students.

**What we look like.** Warm-editorial, not SaaS-slick. Cream
backgrounds instead of white. Instrument Serif italic for display
moments, Inter for everything else. Red for CTA + brand, sage green
for steady/secondary, gold for premium/proof, charcoal for dramatic
dark sections, and a deep forest green reserved for Paisa-style
storytelling pieces. Grain texture on every dark surface. Typography
that reads like a newspaper, not a landing page.

**How we write.** Calm, confident, proof-first. Never guru, never
hype. Numbers up front. Specific over generic. If we can't back it
with a screenshot, we don't say it.

**What we avoid.** Neon gradients. Purple/blue SaaS accents. Stock
photo emoji. Tailwind pastels with identical radii. Centered-and-
watered-down marketing pages. "Unlock your potential" copy.

---

## How to use this

### If you're a human designer

1. Open `examples/index.html` in a browser to see the brand in
   action.
2. Read `voice/VOICE.md` before you write any copy.
3. Copy `tokens/index.css` into your project as a starting point.
4. Pick the patterns you need from `patterns/` — they're
   framework-agnostic HTML/CSS + brief notes.
5. Lift the React primitives from `components/` if you're in a
   React-based stack.

### If you're an AI coding agent

1. Read this README and `voice/VOICE.md` first.
2. Default to the tokens in `tokens/index.css` — don't introduce new
   colours, new fonts, new radii.
3. When asked to build a new surface, find the closest pattern in
   `patterns/` and adapt it. Do not invent a new visual grammar.
4. Match the tone in `voice/VOICE.md` word-for-word — editorial,
   direct, numerical. Do not write marketing fluff.
5. Every claim must be grounded in a real number (₹1,16,000 last
   month, 63 books, 6 students, etc.). If you don't have a source,
   ask.

### If you're Ehsan

- Edit any of these files. Update `CHANGELOG.md` when the brand
  shifts (new tagline, new font, new core colour).
- Keep `assets/ehsan-founder.jpg` refreshed when you have a new
  portrait. Any place the site references `/ehsan-founder.jpg`
  should pick up the new file automatically.

---

## Brand pillars — the one-page summary

| | |
|---|---|
| **Voice** | Editorial · researcher-first · proof-backed · never guru |
| **Type** | Inter (sans) + Instrument Serif (display italic) |
| **Colour** | Cream default, red for CTA, gold for premium, sage for steady, forest for storytelling, charcoal for drama |
| **Texture** | Grain on every dark surface. Paper feel on cards. |
| **Layout** | Newspaper-column editorial. § numbered section datelines. Asymmetric grids. |
| **Motion** | Slow reveals (0.4-0.7s), ease-out cubic, subtle only |
| **Imagery** | Real photos > illustrations. Book-cover mockups > abstract. No stock. |
| **Claims** | Always backed by a number. Screenshots on request. |

---

## Where it's used (April 2026)

- **skillies.ai** — the marketing site (Next.js, hosted on Vercel,
  source at `github.com/sager-coder/skillies-landing`)
- **Calicut Workshop · May 31** — `/workshop` route on the same site
- **Student dashboard** — `/dashboard` route, honest live view of
  Ehsan's KDP + Etsy income
- **Courses page** — `/courses`, currently "under construction" with
  honest build log of 9 planned courses

Anything new that uses the Skillies.AI name should pull from this
template.

---

## Licence / ownership

Brand and content owned by **Ehsan Asgar P. / Skillies.AI**,
Malappuram, Kerala, India.

Internal use only. Do not redistribute the founder photo, KDP
dashboard screenshot, or income numbers without written permission.

The fonts (Inter, Instrument Serif, Baloo Chettan 2, Noto Sans
Malayalam, Anek Malayalam) are Open Font License — free to use.

---

_Last updated 2026-04-19 — see `CHANGELOG.md` for the edit history._
