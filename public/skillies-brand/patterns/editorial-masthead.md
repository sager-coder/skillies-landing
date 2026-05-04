# Pattern — The Editorial Masthead

Every major section on a Skillies.AI surface begins with the same
header pattern — a dateline strip — giving the whole site the feel
of a numbered magazine or journal.

## Anatomy

```
── § 04 · The Receipts ────────────────────── Screenshots on request.
 ↑  ↑                ↑                        ↑
 ↑  section number   ↑                        caption / sub-kicker
 ↑                   tracked-out label
 red 44px rule
```

Four parts, left to right:

1. **Red rule** — 44px wide, 1px, hard color `var(--red)`.
2. **Tracked-out label** — `§ 04 · The Receipts`, uppercase,
   `letter-spacing: 0.32em`, `var(--fg-muted)`, `font-weight: 700`.
3. **Fading spacer rule** — `flex: 1`, 1px high, `rgba(26,26,26,0.08)`.
4. **Caption / sub-kicker** — same size as the label, tracked-out,
   muted grey. Never more than ~40 characters.

## Minimal HTML

```html
<div class="masthead">
  <span class="rule-red"></span>
  <span class="label">§ 04 · The Receipts</span>
  <span class="rule-fade"></span>
  <span class="caption">Screenshots on request.</span>
</div>

<style>
  .masthead {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    font-size: 11px;
    color: var(--fg-muted);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .rule-red  { width: 44px; height: 1px; background: var(--red); }
  .rule-fade { flex: 1; height: 1px; background: rgba(26,26,26,0.08); }
</style>
```

## Section numbering

Numbers across the landing flow in source order:

| §     | Section                         |
|-------|---------------------------------|
| Vol. 01 | Hero masthead                 |
| § 02  | The Manifesto (Promise)         |
| § 03  | The Transformation              |
| § 04  | The Receipts                    |
| § 05  | Your first 7 days               |
| § 06  | The Loop (How it works)         |
| § 07  | KDP Mastery Program             |
| § 08  | About the Founder               |
| § 09  | Q & A · The Honest Column       |
| § Final | Ready? (Footer CTA)           |

When you add a new section, pick the next number. Re-number if
order changes.

## Variants

- **With date** on the right: `Sunday · May 31 · 2026`.
- **With status** on the right: `Small cohort · mentor-led`.
- **Dated + volumed** at the very top: `Vol. 01 · The Skillies Manifesto` + `Kerala · India · 2026`.

## Rules

1. **Always red + label + spacer + caption.** Never drop the caption.
2. **Caption is never a sentence.** It's a clause or tagline.
   Periods stay off unless it actually reads like a sentence
   ("Screenshots on request." is fine because it is one).
3. **Tracking is 0.32em.** Less reads sloppy, more reads affected.
4. **No emoji. No icons.** The § is the only glyph.

## Don't

- Put the masthead on top of a hero with no bottom border below —
  the red rule is already the "anchor", don't double it.
- Use the masthead for decoration inside cards. It's a section-level
  header only.
- Animate the masthead on scroll. It's set type, not motion.
