# Components — reference primitives

These are reference React + TypeScript components copied from the
live `skillies-landing` site. They're here so anyone rebuilding the
brand in React can lift them directly.

## primitives.tsx

Exports the core atoms every Skillies.AI surface uses:

| Component        | Purpose |
|------------------|---------|
| `<Kicker>`       | Small uppercase tracked-out label in red/green/gold |
| `<KickerPill>`   | Pill-shaped kicker with a colored dot |
| `<PrimaryButton>`| Red CTA button with arrow icon |
| `<SecondaryButton>` | Neutral outline CTA |
| `<Wordmark>`     | "SKILLIES.AI" wordmark with red `.AI` |
| `<Grain>`        | Absolute-positioned SVG noise overlay |

They depend only on `React`. No Tailwind, no external UI library.
Styles are inline.

## Other patterns

Larger composed patterns (editorial masthead, newspaper Q&A column,
ledger card, construction tape, etc.) are documented in
`../patterns/*.md` with HTML snippets you can adapt to any stack —
not just React. Build them using the tokens in `../tokens/`.

## If you're not in React

Open `../examples/components.html` to see these same primitives
rendered as vanilla HTML + CSS. Copy the markup and you're done —
no framework required.
