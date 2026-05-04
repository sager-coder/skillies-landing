# Pattern — Receipts & Proof

Credibility is the product. Every Skillies.AI surface carries at
least one piece of auditable proof. These are the four proof
patterns that work.

## 1. The Browser-Chrome Screenshot

A real dashboard screenshot wrapped in a browser-chrome frame.
Used on ProofWall to show Ehsan's actual KDP Royalties Estimator.

```
┌─ browser chrome ────────────────────────────────────────┐
│ ● ● ●   kdpreports.amazon.com/royalties        APR 19   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│         [ real screenshot image fills here ]             │
│                                                          │
│  ┌── VERIFIED · APR 2026 sage stamp, rotated -3° ──┐    │
└──────────────────────────────────────────────────────────┘
│ Exhibit A · My actual KDP dashboard                      │
│ ₹8,71,982.06 total KDP royalties over two years.         │
│ All 63 books, all real, all auditable.                   │
│                                   Want it live? Ask →    │
└──────────────────────────────────────────────────────────┘
```

### Rules

1. **Real screenshot.** Not a recreation. Not a mock. The real file.
2. **Browser chrome is subtle** — cream bar, three dots, URL in
   monospace, date on the right.
3. **Verified stamp overlay** — sage green 1.5px border, rotated
   -3°, positioned top-right. "VERIFIED" + "MONTH YEAR" in tracked
   uppercase.
4. **Caption strip below.** Red kicker ("Exhibit A · …"), italic
   serif caption line, WhatsApp CTA ("Want it live? Ask →") on the
   right.

Source: `skillies-landing/components/design/KDPDashboardProof.tsx`.

---

## 2. The Polaroid + Receipt

For founder / student proof. A photo in a polaroid frame, tilted
-4°, with a floating "receipt" card at the bottom showing the key
number.

```
      ┌──────────────────┐
      │                  │  ← polaroid, rotated -4°
      │    [portrait]    │
      │                  │
      │  APR 2026         │
      │                  │
      ├──────────────────┤
      │  Ehsan — Malappuram│
      │  TEACHER · PUBLISHER│
      └──────────────────┘
                    ┌──────────────────────────────┐
                    │ R                          │
                    │ E   LAST MONTH · MARCH 2026│
                    │ C   ₹1,16,000               │
                    │ E   63 books · 0 new in 6mo │
                    │ I                  PASSIVE  │
                    │ P                          │
                    │ T                          │
                    └──────────────────────────────┘
```

### Rules

1. Polaroid is 290×~390px, tilted -4°, with generous bottom padding
   below the photo (~64px) for the caption strip inside the frame.
2. Receipt card floats at the bottom-right, overlapping the polaroid
   slightly. Vertical "RECEIPT" label on the left edge in red tracked
   letters.
3. Big number in Instrument Serif italic, tabular, ~42px.
4. Pill chip on the right: `PASSIVE` / `ACTIVE` / `VERIFIED`.
5. Handwritten caption in the corner: italic serif ~13px, grey,
   rotated 2°: *"Fig. 01 — not a stock photo."*

Source: `skillies-landing/components/design/HeroV2.tsx` →
`FounderCard`.

---

## 3. The Channels Sparkline Pair

Two income channels side by side, each a card with a sparkline
over 12 months. Used on ProofWall below the main screenshot.

```
┌──────────────────────────┐   ┌──────────────────────────┐
│ AMAZON KDP · ROYALTIES   │   │ ETSY · PAGEBOO SHOP      │
│ 63 books · zero new      │   │ Digital printables       │
│ publishes since Oct      │   │ 64 visits, 2 orders      │
│                          │   │                          │
│ ₹1,07,680                │   │ ₹8,340                   │
│ ▂▂▃▄▅▆▇█ ↑              │   │ ▁▂▁▁▁▂▂▁▂▂▁▂ ↑          │
│                          │   │                          │
│ Apr '25        Mar '26   │   │ Apr '25        Mar '26   │
└──────────────────────────┘   └──────────────────────────┘
```

### Rules

1. Cream card, 1px charcoal-10 border, 18px radius.
2. Top row: uppercase accent kicker + italic serif subtitle +
   `LAST 30D` pill on the right.
3. Big number in Instrument Serif italic, 48px, tabular.
4. Inline SVG sparkline (`<polyline>` over `<polygon>` filled at
   12% alpha, filled endpoint dot).
5. Month labels under the sparkline, small tracked caps.

Source: `skillies-landing/components/design/ProofWall.tsx` →
`ChannelCard` + `Sparkline`.

---

## 4. The Total + Quote Strip

A single wide card below the channel pair, summarising the total
and pairing it with a serif italic pullquote.

```
┌─ soft red/gold gradient card ────────────────────────────┐
│                                                          │
│ TOTAL · LAST 30 DAYS            ▌ "Build once.           │
│ ₹1,16,020                       ▌  Earn while you sleep, │
│ Roughly half my teaching salary ▌  teach, travel, breathe.│
│ — from assets I built in 2025.  ▌                         │
│                                 ▌ — That's the whole pitch.│
└──────────────────────────────────────────────────────────┘
```

### Rules

1. 2:1 grid, total on the left, pullquote on the right.
2. Background is a soft gradient of red/gold mixed at low alpha —
   never flat.
3. Total in big Instrument Serif italic (72px), tabular numerals.
4. Pullquote in serif italic 22px, grey-charcoal, followed by a
   small uppercase attribution line.

## Don't

- Use stock photos for proof. Ever. Either it's real or it's not
  shown.
- Use testimonial carousels. Show one real receipt, in depth.
- Use graph libraries that don't match the editorial aesthetic.
  Inline SVG is better — you control every pixel.
- Hide the proof behind a "Click to see more" accordion. Receipts
  should be on display.
