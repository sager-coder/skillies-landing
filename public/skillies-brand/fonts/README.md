# Fonts

The Skillies.AI system uses five typefaces — all **Open Font
Licence**, free to use commercially, no attribution required. They're
loaded from Google Fonts by default (see `tokens/typography.css`).

## The roster

| Family              | Role                              | Weights used      |
|---------------------|-----------------------------------|-------------------|
| **Inter**           | Sans — body, UI, headings        | 300 · 400 · 500 · 600 · 700 · 800 · 900 |
| **Instrument Serif**| Serif display — italic pullouts  | 400 roman · 400 italic |
| **Baloo Chettan 2** | Malayalam display (de-emphasised)| 400 · 500 · 600 · 700 · 800 |
| **Anek Malayalam**  | Malayalam editorial fallback     | 400 · 500 · 600 · 700 · 800 |
| **Noto Sans Malayalam** | Malayalam safety fallback     | 400 · 500 · 700 · 900 |

## Why these

- **Inter** — the most honest, neutral sans in wide use. Reads clean at
  every weight. 900 is bold enough to carry the hero headlines.
- **Instrument Serif** — an elegant Italian-inspired serif with a
  beautiful italic. Used *only* for display italic accents inside
  bold sans headings, and for long-form italic display moments.
- **Malayalam family** — we keep these loaded because this is a
  Kerala brand, but **English is the primary voice** now. Don't
  reach for Malayalam type unless you're setting actual Malayalam
  script.

## If you want offline fidelity

1. Download the `.woff2` files for the weights above from
   [fonts.google.com](https://fonts.google.com).
2. Drop them next to this README (in `skillies-brand/fonts/`).
3. In `tokens/typography.css`, replace the top `@import url('…')`
   block with `@font-face` declarations pointing at the local files.

Example:

```css
@font-face {
  font-family: 'Inter';
  src: url('./Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('./InstrumentSerif-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('./InstrumentSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

## Rules of use

1. **Never more than two families in one page.** Inter + Instrument
   Serif. That's the pairing.
2. **Italic = Instrument Serif.** Do not italicise Inter for emphasis
   — italicise by switching to the serif.
3. **Malayalam** only when the text is actually Malayalam. Don't
   apply the Malayalam font to English text for "Kerala flavour."
4. **Monospace** is reserved for: time stamps, URL bars, meta
   captions, technical status labels. Not for body copy.
