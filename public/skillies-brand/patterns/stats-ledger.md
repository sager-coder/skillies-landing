# Pattern — The Stats Ledger

A proper editorial stats card. Cream paper card with a masthead
header, four numbered columns, micro-charts per stat, and a dashed
footnote strip. Replaces the "flat 4-column dashboard row" you see
on 90% of landing pages.

## Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ── BY THE NUMBERS · AS OF MARCH 2026 ─── Receipts, not promises │
│                                                              │
│  63           ₹1.16L        6           0                    │
│  books        paid in       months      new books            │
│  written      March          untouched   since               │
│  ▂▂▃▄▅▆▇█   ▂▃▄▅▆▇▉↑     ○ ○ ○ ○ ○ ○   ────────            │
│                                                              │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │
│ A full ledger — screenshots on request.   Ask on WhatsApp → │
└─────────────────────────────────────────────────────────────┘
```

## Parts

### Ledger header strip

```html
<div class="ledger-head">
  <span class="rule rule-red"></span>
  <span class="t-dateline">By the numbers · as of March 2026</span>
  <span class="rule rule-fade"></span>
  <span class="t-serif-italic">Receipts, not promises</span>
</div>
```

### Each column

```html
<div class="ledger-col">
  <div class="t-serif-number" style="color: var(--red)">63</div>
  <div class="t-dateline">books written</div>
  <div class="t-serif-italic muted">All of 2025 · KDP paperbacks</div>
  <svg class="ledger-visual">…</svg>
</div>
```

### Micro-visual patterns

Pick one per column — never duplicate:

| Visual    | When to use |
|-----------|-------------|
| book-spines | counting books / catalog size |
| sparkline | revenue trend over time |
| dots      | duration (months, weeks, days) |
| em-dash   | explicit zero / absence |

Render them as inline SVGs at ~180×26px, in the column's accent color.

### Footer

Dashed top border, italic serif caption on the left, WhatsApp CTA
on the right.

## Rules

1. **Use serif italic for numbers.** Instrument Serif italic, tabular
   numerals, 44-52px, colored in the column accent (red / sage /
   gold / charcoal cycling).
2. **Uppercase label** under each number — tracked-out `t-dateline`.
3. **Italic serif sub-caption** under the label for context. One
   short line: "All of 2025 · KDP paperbacks", "Since Oct 2025 · no
   new uploads."
4. **Gradient dividers** between columns, not hard 1px rules:
   `background: linear-gradient(to bottom, transparent, rgba(26,26,26,0.12), transparent);`
5. **Cream paper surface.** `background: rgba(250,245,235,0.7)` with
   a subtle grain overlay and `box-shadow: inset 0 1px 0 rgba(255,255,255,0.6)` for the highlight.
6. **Include a CTA.** Skeptics need to be invited to verify:
   "Ask for screenshots →" on a WhatsApp deep-link.

## Where it's used

- Landing hero — below the main CTAs
- Dashboard StatsRow — four tiles with the same shape at smaller size
- ProofWall summary — row of four stats in a cream card

Source: `skillies-landing/components/design/HeroV2.tsx`
(`<LedgerVisual>` and the `LEDGER` config).
