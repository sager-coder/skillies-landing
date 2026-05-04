# Pattern — Editorial Hero

The hero sets the tone for the whole page. Three parts:

1. **Masthead strip** — `§ Vol · Name` dateline across the top.
2. **Asymmetric grid** — big bold headline on the left, portrait /
   polaroid / receipt on the right.
3. **Ledger card** — stats ledger sits below the CTAs, not as a
   footer row.

## Minimal HTML

```html
<section class="hero">
  <!-- 1. Masthead dateline -->
  <div class="t-dateline masthead">
    <span class="rule rule-red"></span>
    Vol. 01 · The Skillies Manifesto
    <span class="rule rule-fade"></span>
    <span>Kerala · India · 2026</span>
  </div>

  <!-- 2. Two-column grid -->
  <div class="hero-grid">
    <div class="hero-left">
      <p class="kicker-pill green">
        <span class="dot"></span>AI skills that generate real income
      </p>

      <h1 class="t-hero">
        Human&nbsp;brain.<br>
        <em class="t-serif-italic red">AI&nbsp;skills.</em><br>
        Real&nbsp;income.
      </h1>

      <p class="hero-tag t-serif-italic">Earn while you sleep.</p>

      <p class="t-lead">
        Skillies.AI is a research-and-teach school for the age of
        AI. Last month, 63 books I published on Amazon KDP paid
        me ₹1,16,000.
      </p>

      <div class="hero-ctas">
        <a class="btn-primary" href="/workshop">Join the Calicut workshop · ₹1,999</a>
        <a class="btn-secondary" href="#program">See the 50-day program</a>
      </div>

      <!-- Ledger card → see stats-ledger.md -->
    </div>

    <aside class="hero-right">
      <!-- portrait polaroid + receipt card → see receipts-proof.md -->
    </aside>
  </div>
</section>
```

## Rules

1. **One hero per page.** If you think you need two, you need one
   hero and a second section.
2. **Italic pullout on line 2.** The bold sans headline uses
   Instrument Serif italic on exactly one line (usually the middle
   of three). Red color. Never italic the whole headline.
3. **Tagline under the headline** — serif italic green, small caps
   is wrong. Sentence case only. Use the brand line:
   *"Earn while you sleep."*
4. **Two CTAs max.** Primary red, secondary outline. Never three.
5. **Grain overlay** on the section background (opacity 0.09).
6. **Radial gradients**, not flat cream, for hero backgrounds:
   ```css
   background:
     radial-gradient(ellipse at 85% 10%, rgba(198,40,40,0.18), transparent 55%),
     radial-gradient(ellipse at 10% 90%, rgba(201,162,78,0.16), transparent 60%),
     #FAF5EB;
   ```

## Variants

- **Workshop hero** — same masthead, but the right column shows a
  ticket stub + seat meter instead of a portrait. See
  `skillies-landing/components/workshop/WorkshopHero.tsx`.
- **Dashboard header** — no hero; use `<ViewHeader>` from
  `components/dashboard/Views.tsx` instead.

## Don't

- Center the headline. Editorial heroes are left-aligned.
- Use drop shadows on headings.
- Animate the hero headline on entrance. The page reads like a
  magazine — magazines don't fade in.
