# Pattern — Timeline / Itinerary

Used for agendas, 50-day syllabi, three-act origin stories, and any
sequence of time-bound events. Three sub-patterns share the same
DNA:

## 1. The horizontal Day Arc

A single bar showing time segments across a day or period. Used at
the top of the Workshop agenda.

```
10 AM ━━━━┳━━━━┳━━━━━━━━━┳━━━━┳━━━━┳━━━━ 4:30 PM
        Intro Teach    Build       Lunch Teach Teach Close
```

Each segment: colored according to session type, height 8px, with
`border-right: 1.5px solid rgba(255,255,255,0.7)` as separators.

Hour labels sit under the bar in monospace, tracked-out grey.

Source: `skillies-landing/components/workshop/Sections.tsx` —
`DayArc` function.

## 2. The vertical timeline of cards

Below the arc, each session expands into a full card on a vertical
timeline. Cards offset from a left-aligned connector line with a
colored dot marker per session.

```
  │
  ●  ┌───────────────────────────────────────┐
  │  │ 10:00  →  10:30         INTRO · 30 min│
  │  │ Doors, chai, introductions             │
  │  │ ────                                   │
  │  │ You: arrive, settle, meet three people │
  │  └───────────────────────────────────────┘
  │
  ●  ┌── CORE session (gold, larger) ────────┐
  │  │ 11:30  →  13:00         BUILD · 90 min│
  │  │ Your first book — cover to upload      │
  │  │ ────                                   │
  │  │ Tools: Claude · Canva · KDP Create     │
  │  │ You: walk out with a live Amazon URL.  │
  │  └───────────────────────────────────────┘
```

### Per-card structure

- **Left:** large Instrument Serif italic time (42px) → `→` end-time
- **Right:** pill chip with session type + duration
- **Body:** bold sans title, description, optional "Tools" row and
  "You" row (italic serif)
- **Variants:**
  - *Core* — gold gradient background, gold pulse-ring on the dot,
    "The heart of the day" ribbon on the top-right
  - *Break* — warm brown gradient, dashed border
  - *Close / Pitch* — inverted charcoal with gold accents

### Type palette per session

| Type   | Accent  | Soft bg             |
|--------|---------|---------------------|
| Intro  | #5B7B5B | rgba(91,123,91,0.10)|
| Teach  | #C62828 | rgba(198,40,40,0.08)|
| Build  | #C9A24E | rgba(201,162,78,0.14)|
| Break  | #8B5A2B | rgba(139,90,43,0.10)|
| Pitch  | #1A1A1A | —                   |

## 3. The three-act narrative

For origin stories / multi-year timelines. Three columns, big serif
italic year numbers as the visual anchor.

```
2020                2025               2026
Act I               Act II             Act III

uHRS · First signal KDP · The loop     Skillies.AI · Answer
I found Microsoft's …  63 books later …  Research, teach, serve …
```

Each column: 200px+ wide, with the year rendered at 72px Instrument
Serif italic in a distinct color (red → gold → sage), "Act I/II/III"
as a small uppercase kicker, then a short paragraph underneath.

Source: `skillies-landing/components/design/AboutEditorial.tsx` —
the `STORY` section.

## Rules across all three sub-patterns

1. **Time uses Instrument Serif italic.** Always. Tabular nums.
2. **Section types are color-coded consistently** across Day Arc,
   timeline cards, and legend.
3. **Newspaper hierarchy** — kicker → big serif year/title → body.
4. **Connectors between events** — 2px dashed or gradient lines on
   the left of timeline cards, hour ticks under the arc.

## Don't

- Use circular progress rings for timelines. That's UI-dashboard.
- Use illustrated icons per session. Typography is enough.
- Make the Day Arc interactive (draggable / zoomable) — it's a
  summary, not a tool.
