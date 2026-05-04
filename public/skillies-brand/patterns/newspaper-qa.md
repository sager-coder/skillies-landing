# Pattern — The Newspaper Q&A Column

Used for FAQs. Replace accordion-with-plus-icons with a proper
editorial column where every answer is visible.

## Structure

```
§ Q & A · The Honest Column  ─────────────  Six questions, straight answers.

                What people actually ask, answered straight.

                Every answer here comes from a real WhatsApp
                message I've already replied to.

────────────────────────  ▲ 2px black rule  ────────────────────────

 Q · 01                       ▌ Yes — that's the entire point.
 "I've never written a        ▌ No-content books don't need writing.
  book. Can I still do this?" ▌ You're designing and curating.
 Yes. That's the whole point. ▌
                              ▌ ┃ If you can use a browser,
                              ▌ ┃ you can publish.

────────────────────────

 Q · 02
 …
────────────────────────  ▲ 2px black rule  ────────────────────────

— Ehsan
Founder · Replies personally                 Ask your own question →
```

## Structure in HTML

```html
<section class="qa">
  <div class="t-dateline masthead">
    <span class="rule rule-red"></span>
    § Q & A · The Honest Column
    <span class="rule rule-fade"></span>
    Six questions, straight answers.
  </div>

  <div class="qa-header">
    <h2 class="t-h1">
      What people actually ask,
      <em class="t-serif-italic red">answered straight.</em>
    </h2>
    <p class="t-lead">
      Every answer here comes from a real WhatsApp message I've
      already replied to.
    </p>
  </div>

  <div class="qa-column">     <!-- 2px black rules top + bottom -->
    <article class="qa-row">
      <div class="qa-left">
        <div class="t-dateline red">Q · 01</div>
        <h3 class="qa-question">"I've never written a book. Can I still do this?"</h3>
        <p class="qa-short">Yes. That's the whole point.</p>
      </div>

      <div class="qa-right">
        <p class="qa-answer">
          No-content books don't require writing. You're designing
          and curating, not authoring. If you can use a browser and
          click Upload, you can publish.
        </p>
        <blockquote class="qa-pullquote">
          If you can use a browser, you can publish.
        </blockquote>
      </div>
    </article>

    <!-- more articles … separated by 1px rule via border-top on :not(:first-child) -->
  </div>

  <div class="qa-signature">
    <div>
      <span class="t-serif-italic big">— Ehsan</span>
      <span class="t-dateline muted">Founder · Replies personally</span>
    </div>
    <a class="btn-dark" href="https://wa.me/918089941131">Ask your own question →</a>
  </div>
</section>
```

## Rules

1. **Two columns.** Question on the left (`minmax(220px, 0.9fr)`),
   answer on the right (`1.4fr`). Gap: 56px.
2. **Q · 01 / Q · 02** numbered kickers in red.
3. **Question** in Instrument Serif italic, wrapped in smart quotes
   (`"…"`), 26-36px.
4. **Short answer** directly below the question, one line, italic
   serif gray.
5. **Long answer** on the right in 16px body, line-height 1.8,
   max-width 580px.
6. **Pullquote** embedded inside some answers (not all) — gold
   `border-left`, italic serif 18px.
7. **No accordion.** All answers are open by default. This is a
   reading surface, not a dashboard.
8. **Frame the whole column** with 2px black rules top and bottom —
   not a white card, not a cream card, just horizontal rules.
9. **Signature block** at the bottom: "— Ehsan" in serif italic +
   small-caps byline + a charcoal pill CTA to ask on WhatsApp.

## Where it's used

- `/workshop` FAQ section

Source: `skillies-landing/components/workshop/Sections.tsx` —
`FaqRow` and `WorkshopFAQ`.

## Don't

- Use pagination. It fragments the column.
- Put FAQs in accordions. That's dashboard pattern, not editorial.
- Use bullet points inside answers. If the answer is a list, break
  it into a new Q.
