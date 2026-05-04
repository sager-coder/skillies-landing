# Pattern — Under Construction (Zine-style)

When a surface isn't ready, don't hide it behind a generic "Coming
Soon" splash. Show an editorial zine-in-production instead —
construction tape, blueprint grid, draft stamp, and an honest build
log.

## Structure

```
┌ black-and-gold hazard tape stripe ───────────────────────┐
│ ▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓░░░▓▓▓    │
└──────────────────────────────────────────────────────────┘

  [blueprint grid pattern · subtle background]

  § Courses · Skillies.AI Press · Draft 0.3 · Apr 19, 2026

  The campus is being built.           [DRAFT 0.3 red stamp,
                                        rotated -8°, 35% opacity]

  Every course on this page is in some stage of research,
  drafting, or recording.

  ⚠ Under construction · First drops land between April and July 2026.

  ┌── Currently live · for the founding batch ──────────────┐
  │ The 50-day KDP Mastery program is live for the six-     │
  │ student cohort …                                         │
  └──────────────────────────────────────────────────────────┘

  ── The build log ──────  Updated weekly · honest status.

  Nine courses, in various states of being ready.

  ────────────────────────── 2px black rule ─────────────
  01 · KDP Mastery · 50-Day Program    LIVE      100%   Cohort 001
  02 · Cover Design module             DRAFTING   60%   May 15
  03 · Amazon Listings                 RECORDING  35%   June
  ...
  ──────────────────────────────────────────────────────

  "Dates slip. Scope changes. I'd rather show you the log
  honestly than promise launches I can't keep." — E.

  Last log update · 2026-04-19 14:00 IST

┌ black-and-gold hazard tape stripe ───────────────────────┐
└──────────────────────────────────────────────────────────┘
```

## Components

### Construction tape

Horizontal hazard stripes, 18px high, top and bottom of the page.

```css
.construction-tape {
  height: 18px;
  background: repeating-linear-gradient(
    45deg,
    #1A1A1A 0 14px,
    #E6C178 14px 28px
  );
}
```

### Blueprint grid

Subtle architectural grid pattern as a section background.

```html
<svg aria-hidden class="blueprint">
  <defs>
    <pattern id="bp" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none"
            stroke="#1A1A1A" stroke-width="0.4"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bp)"/>
</svg>
<style>
  .blueprint {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.12;
    pointer-events: none;
  }
</style>
```

### DRAFT stamp

```html
<div class="draft-stamp">
  DRAFT 0.3
  <small>APR 19 · 2026</small>
</div>
<style>
  .draft-stamp {
    position: absolute;
    top: 48px;
    right: 5%;
    transform: rotate(-8deg);
    padding: 14px 28px;
    border: 3px solid var(--red);
    border-radius: 6px;
    color: var(--red);
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: 0.3em;
    opacity: 0.35;
    line-height: 1;
    pointer-events: none;
    text-shadow: 0 2px 0 rgba(255,255,255,0.3);
  }
  .draft-stamp small {
    display: block;
    font-family: var(--font-sans);
    font-style: normal;
    font-size: 9px;
    letter-spacing: 0.22em;
    font-weight: 700;
    margin-top: 6px;
  }
</style>
```

### Build-log table

Newspaper-style table, 2px black rules top and bottom. Each row:
numbered serif kicker, course title + italic-serif tagline, status
badge, progress bar, ETA in mono.

Status colours:

| Status         | bg                        | fg         |
|----------------|---------------------------|------------|
| `LIVE`         | rgba(91,123,91,0.14)      | #3D5A3D    |
| `DRAFTING`     | rgba(201,162,78,0.18)     | #8A6A1F    |
| `RECORDING`    | rgba(201,162,78,0.14)     | #8A6A1F    |
| `IN RESEARCH`  | rgba(198,40,40,0.10)      | #C62828    |
| `PLANNED`      | rgba(26,26,26,0.08)       | #6B7280    |

### Pencil marginalia

Italic serif grey line, low contrast, with a monospace timestamp
opposite.

```html
<div class="marginalia">
  <p class="t-serif-italic muted">
    "Dates slip. Scope changes. I'd rather show you the log
    honestly than promise launches I can't keep." — E.
  </p>
  <span class="mono small">
    Last log update · 2026-04-19 14:00 IST
  </span>
</div>
```

## Rules

1. **Be honest about status.** If a course is in `PLANNED` with 0%
   progress, say so. Fake progress bars are worse than admitting
   nothing's built.
2. **Give ETAs as ranges, not dates.** "Q3 2026", "~ July", "May 15"
   — always with a `~` unless it's actually locked.
3. **Include the "what IS live" callout** near the top. The reader
   has to know what they can actually buy today.
4. **Notify CTA.** Every construction page has a WhatsApp deep-link:
   "Notify me on WhatsApp →". Do not build an email capture form.

## Where it's used

- `/courses` — the whole page

Source: `skillies-landing/components/courses/Construction.tsx`.
