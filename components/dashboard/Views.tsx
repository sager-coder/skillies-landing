"use client";

import React, { useState } from "react";
import { Kicker, Grain } from "../design/Primitives";
import {
  DashHeader,
  StatsRow,
  RoyaltiesChart,
  FocusList,
  NextPayoutCard,
  FoundingBatch,
} from "./Sections";

/* =========================================================================
   View 1 — OVERVIEW (the default home)
   ========================================================================= */

export function OverviewView() {
  return (
    <>
      <DashHeader />
      <div style={{ padding: "32px 40px 80px" }}>
        <StatsRow />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
          }}
        >
          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <RoyaltiesChart />
            <FocusList />
          </div>
          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <NextPayoutCard />
            <FoundingBatch />
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   Shared helpers
   ========================================================================= */

function ViewHeader({
  kicker,
  title,
  sub,
  note,
}: {
  kicker: string;
  title: string;
  sub?: string;
  note?: string;
}) {
  return (
    <div
      style={{
        padding: "32px 40px 24px",
        borderBottom: "1px solid #F0E8D8",
      }}
    >
      <Kicker tone="red">{kicker}</Kicker>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#1A1A1A",
          margin: "10px 0 0",
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            fontSize: 15,
            color: "#6B7280",
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
      {note && (
        <div
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            background: "#FAF5EB",
            borderRadius: 999,
            border: "1px solid #F0E8D8",
            fontSize: 12,
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#5B7B5B",
              boxShadow: "0 0 0 3px rgba(91,123,91,0.2)",
            }}
          />
          {note}
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  sub,
  children,
  padded = true,
}: {
  title?: string;
  sub?: string;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      style={{
        padding: padded ? 28 : 0,
        background: "white",
        borderRadius: 20,
        border: "1px solid #F0E8D8",
      }}
    >
      {title && (
        <div style={{ padding: padded ? 0 : "24px 24px 0", marginBottom: 16 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A1A",
              margin: "0 0 4px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          {sub && (
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{sub}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/* =========================================================================
   View 2 — KDP ROYALTIES
   ========================================================================= */

const MONTHLY_ROYALTIES: Array<{ m: string; amount: number; published: boolean }> =
  [
    { m: "Apr '25", amount: 18200, published: true },
    { m: "May '25", amount: 22400, published: true },
    { m: "Jun '25", amount: 28800, published: true },
    { m: "Jul '25", amount: 34200, published: true },
    { m: "Aug '25", amount: 41500, published: true },
    { m: "Sep '25", amount: 52900, published: true },
    { m: "Oct '25", amount: 61800, published: true },
    { m: "Nov '25", amount: 64400, published: false },
    { m: "Dec '25", amount: 84100, published: false },
    { m: "Jan '26", amount: 71300, published: false },
    { m: "Feb '26", amount: 82500, published: false },
    { m: "Mar '26", amount: 116020, published: false },
  ];

function fmtINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function RoyaltiesTable() {
  return (
    <Panel title="Monthly royalties · last 12 months" sub="Red = months I published · Gold = passive-only">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#9CA3AF" }}>
            {["Month", "Royalties", "Mode", "Trend"].map((h) => (
              <th
                key={h}
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "10px 0",
                  borderBottom: "1px solid #F0E8D8",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTHLY_ROYALTIES.map((r, i) => {
            const prev = i === 0 ? r.amount : MONTHLY_ROYALTIES[i - 1].amount;
            const pct = Math.round(((r.amount - prev) / prev) * 100);
            const up = pct >= 0;
            return (
              <tr key={r.m}>
                <td
                  style={{
                    padding: "14px 0",
                    color: "#1A1A1A",
                    fontWeight: 600,
                    borderBottom: "1px solid #F0E8D8",
                  }}
                >
                  {r.m}
                </td>
                <td
                  style={{
                    padding: "14px 0",
                    color: "#1A1A1A",
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 20,
                    fontStyle: "italic",
                    fontVariantNumeric: "tabular-nums",
                    borderBottom: "1px solid #F0E8D8",
                  }}
                >
                  {fmtINR(r.amount)}
                </td>
                <td
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #F0E8D8",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: r.published
                        ? "rgba(198,40,40,0.10)"
                        : "rgba(201,162,78,0.14)",
                      color: r.published ? "#C62828" : "#8a6a1f",
                    }}
                  >
                    {r.published ? "Active" : "Passive"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 0",
                    fontSize: 13,
                    color: up ? "#3D5A3D" : "#C62828",
                    fontWeight: 600,
                    borderBottom: "1px solid #F0E8D8",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {i === 0 ? "—" : `${up ? "▲" : "▼"} ${Math.abs(pct)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}

const CATEGORY_SPLIT = [
  { name: "Coloring books", share: 42, color: "#C62828" },
  { name: "Puzzle books", share: 31, color: "#C9A24E" },
  { name: "Spot the difference", share: 18, color: "#5B7B5B" },
  { name: "Other / misc", share: 9, color: "#6B7280" },
];

function CategorySplit() {
  return (
    <Panel title="By category" sub="Share of total lifetime royalties">
      <div style={{ display: "grid", gap: 14 }}>
        {CATEGORY_SPLIT.map((c) => (
          <div key={c.name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: 13,
                color: "#1A1A1A",
                fontWeight: 500,
              }}
            >
              <span>{c.name}</span>
              <span style={{ fontWeight: 700, color: c.color }}>{c.share}%</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: "#F0E8D8",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${c.share}%`,
                  height: "100%",
                  background: c.color,
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RoyaltyStatsRow() {
  const stats: Array<[string, string, string]> = [
    ["Lifetime", "₹8,71,982", "All 63 books · 2024–26"],
    ["Best month", "₹1,16,020", "March 2026"],
    ["Avg / month", "₹54,561", "over 16 months"],
    ["Next payout", "May 29", "estimated ₹1.08L"],
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 20,
      }}
    >
      {stats.map(([label, val, sub]) => (
        <div
          key={label}
          style={{
            padding: 20,
            background: "white",
            borderRadius: 20,
            border: "1px solid #F0E8D8",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 32,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              margin: "10px 0 2px",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {val}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{sub}</div>
        </div>
      ))}
    </div>
  );
}

export function RoyaltiesView() {
  return (
    <>
      <ViewHeader
        kicker="KDP Royalties · live"
        title="Every rupee Amazon paid me."
        sub="Last updated: today, 4 hours ago. KDP Reports · Estimated INR."
        note="Source: kdpreports.amazon.com/royalties"
      />
      <div style={{ padding: "32px 40px 80px" }}>
        <RoyaltyStatsRow />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <RoyaltiesTable />
          <div style={{ display: "grid", gap: 20 }}>
            <CategorySplit />
            <Panel title="Top 3 earners · lifetime">
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { t: "100 Mandalas Vol. 1", cat: "Coloring", amt: "₹64,200" },
                  { t: "Crossword Classics · 100 Puzzles", cat: "Puzzles", amt: "₹51,400" },
                  { t: "Farm Friends · Spot the Diff Book 1", cat: "Spot the diff", amt: "₹42,800" },
                ].map((b, i) => (
                  <div
                    key={b.t}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr auto",
                      gap: 12,
                      padding: "10px 0",
                      borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: "italic",
                        fontSize: 22,
                        color: "#C9A24E",
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1A1A1A",
                          lineHeight: 1.3,
                        }}
                      >
                        {b.t}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                        {b.cat}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: "italic",
                        fontSize: 18,
                        color: "#1A1A1A",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {b.amt}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   View 3 — MY BOOKS · 63
   ========================================================================= */

type BookRecord = {
  title: string;
  category: "coloring" | "puzzle" | "spotdiff" | "other";
  earnings: number;
  pubMonth: string;
};

// 63 realistic titles
function generateBooks(): BookRecord[] {
  const coloring = [
    "100 Mandalas Vol. 1",
    "100 Mandalas Vol. 2",
    "Flower Mandalas",
    "Animal Kingdom Coloring",
    "Ocean Creatures Coloring",
    "Kids' First Coloring Book",
    "Coloring for Grown-Ups",
    "Holiday Mandalas",
    "Christmas Coloring",
    "Halloween Patterns",
    "Geometric Mandalas",
    "Floral Patterns Vol. 1",
    "Floral Patterns Vol. 2",
    "Zen Garden Coloring",
    "Moon & Stars Patterns",
    "Dragon Coloring Book",
    "Safari Animals",
    "Butterflies & Flowers",
    "Stained Glass Mandalas",
    "Mindful Mandalas",
    "Kids Farm Coloring",
    "Space & Planets Coloring",
    "Cat Mandalas",
    "Bird Patterns",
    "Autumn Mandalas",
    "Tropical Coloring",
    "Ornament Coloring",
  ];
  const puzzle = [
    "Crossword Classics · 100 Puzzles",
    "Word Search Vol. 1",
    "Word Search Vol. 2",
    "Sudoku Easy Starters",
    "Sudoku Evil Edition",
    "Logic Grid Puzzles",
    "100 Crosswords · Medium",
    "Holiday Word Search",
    "Kids Puzzle Pack",
    "Sunday Crosswords",
    "Travel Puzzles",
    "Spring Puzzles",
    "Office Break Puzzles",
    "Cryptogram Collection",
    "Number Puzzles",
    "100 Crosswords · Hard",
  ];
  const spot = [
    "Farm Friends · Spot the Diff Book 1",
    "Farm Friends · Book 2",
    "Ocean · Spot the Diff",
    "Zoo Spot the Difference",
    "City Streets · Find It",
    "Winter Spot the Diff",
    "Beach Day · Spot It",
    "Kids Adventure · Spot the Diff",
    "Space Spot the Difference",
    "Garden · Find It",
    "Dinosaur Spot the Diff",
  ];
  const other = [
    "Gratitude Journal",
    "Book of Affirmations",
    "Daily Planner 2026",
    "Meal Planning Pad",
    "Recipe Notebook",
    "Birthday Lists Book",
    "Wellness Tracker",
    "Sketch Pad",
    "Lined Notebook",
  ];
  const all: BookRecord[] = [];
  coloring.forEach((t, i) =>
    all.push({
      title: t,
      category: "coloring",
      earnings: 22000 - i * 700 + (i % 3) * 2400,
      pubMonth: `2025-${String(3 + (i % 7)).padStart(2, "0")}`,
    }),
  );
  puzzle.forEach((t, i) =>
    all.push({
      title: t,
      category: "puzzle",
      earnings: 18000 - i * 600 + (i % 4) * 3000,
      pubMonth: `2025-${String(5 + (i % 6)).padStart(2, "0")}`,
    }),
  );
  spot.forEach((t, i) =>
    all.push({
      title: t,
      category: "spotdiff",
      earnings: 14000 - i * 500 + (i % 3) * 2000,
      pubMonth: `2025-${String(4 + (i % 6)).padStart(2, "0")}`,
    }),
  );
  other.forEach((t, i) =>
    all.push({
      title: t,
      category: "other",
      earnings: 6000 - i * 300 + (i % 3) * 1200,
      pubMonth: `2025-${String(8 + (i % 3)).padStart(2, "0")}`,
    }),
  );
  return all;
}

const BOOKS = generateBooks();

const CAT_META: Record<
  BookRecord["category"],
  { label: string; color: string; bg: string }
> = {
  coloring: { label: "Coloring", color: "#C62828", bg: "linear-gradient(135deg, #C62828, #8B1A1A)" },
  puzzle: { label: "Puzzle", color: "#C9A24E", bg: "linear-gradient(135deg, #C9A24E, #8a6a1f)" },
  spotdiff: { label: "Spot diff", color: "#5B7B5B", bg: "linear-gradient(135deg, #5B7B5B, #3D5A3D)" },
  other: { label: "Other", color: "#6B7280", bg: "linear-gradient(135deg, #3f3f46, #1A1A1A)" },
};

function BookTile({ b }: { b: BookRecord }) {
  const meta = CAT_META[b.category];
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid #F0E8D8",
        overflow: "hidden",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* spine */}
      <div
        style={{
          aspectRatio: "3/4",
          background: meta.bg,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px 10px 8px",
          color: "#FAF5EB",
        }}
      >
        <div
          style={{
            fontSize: 7,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: 0.7,
          }}
        >
          KDP · Skillies
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 11,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {b.title}
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "#1A1A1A",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmtINR(b.earnings)}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: meta.color,
            marginTop: 3,
          }}
        >
          {meta.label}
        </div>
      </div>
    </div>
  );
}

export function BooksView() {
  const [filter, setFilter] = useState<"all" | BookRecord["category"]>("all");
  const [sort, setSort] = useState<"earnings" | "title">("earnings");

  const filtered = BOOKS.filter(
    (b) => filter === "all" || b.category === filter,
  ).sort((a, b) =>
    sort === "earnings" ? b.earnings - a.earnings : a.title.localeCompare(b.title),
  );

  const totalEarn = BOOKS.reduce((s, b) => s + b.earnings, 0);
  const counts = {
    all: BOOKS.length,
    coloring: BOOKS.filter((b) => b.category === "coloring").length,
    puzzle: BOOKS.filter((b) => b.category === "puzzle").length,
    spotdiff: BOOKS.filter((b) => b.category === "spotdiff").length,
    other: BOOKS.filter((b) => b.category === "other").length,
  };

  return (
    <>
      <ViewHeader
        kicker="The Catalog · 63 books"
        title="Everything I've published."
        sub={`${counts.coloring} coloring · ${counts.puzzle} puzzle · ${counts.spotdiff} spot-the-diff · ${counts.other} other.`}
        note={`Lifetime earnings across the catalog: ${fmtINR(totalEarn)}`}
      />
      <div style={{ padding: "24px 40px 80px" }}>
        {/* Filter + sort toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              background: "white",
              borderRadius: 999,
              border: "1px solid #F0E8D8",
            }}
          >
            {(
              [
                ["all", `All · ${counts.all}`],
                ["coloring", `Coloring · ${counts.coloring}`],
                ["puzzle", `Puzzle · ${counts.puzzle}`],
                ["spotdiff", `Spot diff · ${counts.spotdiff}`],
                ["other", `Other · ${counts.other}`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: filter === k ? "#1A1A1A" : "transparent",
                  color: filter === k ? "white" : "#6B7280",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Sort
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              background: "white",
              borderRadius: 999,
              border: "1px solid #F0E8D8",
            }}
          >
            {(
              [
                ["earnings", "Earnings"],
                ["title", "Title"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: sort === k ? "#1A1A1A" : "transparent",
                  color: sort === k ? "white" : "#6B7280",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((b) => (
            <BookTile key={b.title} b={b} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
            No titles in this filter.
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================================
   View 4 — ETSY · PAGEBOO
   ========================================================================= */

const ETSY_DAYS = [2, 6, 15, 0, 2, 2, 2, 0, 2, 2, 2, 1, 2, 2, 1, 3, 6, 4, 0, 1, 1, 1, 0, 1, 1, 2, 2, 1, 5, 0];

function EtsySparkline() {
  const w = 680;
  const h = 140;
  const max = Math.max(...ETSY_DAYS);
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {[0, 5, 10, 15, 20].map((y) => (
        <line
          key={y}
          x1="0"
          y1={h - (y / max) * (h - 20) - 10}
          x2={w}
          y2={h - (y / max) * (h - 20) - 10}
          stroke="rgba(26,26,26,0.06)"
          strokeWidth="1"
        />
      ))}
      <polyline
        points={ETSY_DAYS.map((v, i) => {
          const x = (i / (ETSY_DAYS.length - 1)) * w;
          const y = h - (v / max) * (h - 20) - 10;
          return `${x},${y}`;
        }).join(" ")}
        fill="none"
        stroke="#1F3A2E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {ETSY_DAYS.map((v, i) => {
        const x = (i / (ETSY_DAYS.length - 1)) * w;
        const y = h - (v / max) * (h - 20) - 10;
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#1F3A2E" />;
      })}
    </svg>
  );
}

export function EtsyView() {
  const stats: Array<[string, string, string]> = [
    ["Visits", "64", "last 30 days"],
    ["Orders", "2", "3.1% conversion"],
    ["Revenue", "US$ 99.98", "~₹8,340"],
    ["Favourites", "4", "shop listings"],
  ];
  return (
    <>
      <ViewHeader
        kicker="Etsy · PageBoo shop"
        title="Weekend engine."
        sub="Listings made on Sundays. Buyers mostly from the US + UK. Never the focus, but proves one laptop can run two income streams."
        note="Source: etsy.com/your/shops/me/stats"
      />
      <div style={{ padding: "32px 40px 80px" }}>
        {/* top stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {stats.map(([label, val, sub]) => (
            <div
              key={label}
              style={{
                padding: 20,
                background: "white",
                borderRadius: 20,
                border: "1px solid #F0E8D8",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  color: "#1F3A2E",
                  letterSpacing: "-0.02em",
                  margin: "10px 0 2px",
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* traffic chart */}
        <Panel
          title="Daily visits · last 30 days"
          sub="Forest-green PageBoo line. Two notable spikes match my Sunday posting days."
        >
          <EtsySparkline />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#9CA3AF",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            <span>Mar 12</span>
            <span>Mar 19</span>
            <span>Mar 26</span>
            <span>Apr 03</span>
            <span>Apr 10</span>
          </div>
        </Panel>

        {/* listings + notes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            marginTop: 20,
            alignItems: "start",
          }}
        >
          <Panel title="Recent listings" sub="8 live on Etsy now">
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { t: "Autumn forest printable puzzles", price: "$5.99", sold: 1 },
                { t: "Spot the difference · Nature edition", price: "$4.49", sold: 1 },
                { t: "30-page mandala printable", price: "$3.99", sold: 0 },
                { t: "Kids' colouring · Farm animals", price: "$4.99", sold: 0 },
              ].map((item, i) => (
                <div
                  key={item.t}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 12,
                    padding: "10px 0",
                    alignItems: "baseline",
                    borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
                  }}
                >
                  <div style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 500 }}>
                    {item.t}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 18,
                      color: "#1F3A2E",
                    }}
                  >
                    {item.price}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: item.sold ? "#5B7B5B" : "#9CA3AF",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.sold ? `${item.sold} sold` : "No sales yet"}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#1F3A2E",
                marginBottom: 8,
              }}
            >
              Honest note
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#1A1A1A",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Etsy is small. Two sales last month. ~₹8K. I keep it running because it&apos;s different traffic, and it teaches me printable design — which becomes its own course later.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   View 5 — FOUNDING BATCH
   ========================================================================= */

type Student = {
  initials: string;
  name: string;
  where: string;
  niche: string;
  week: number;
  booksLive: number;
  status: "On track" | "Ahead" | "Behind" | "Inactive";
  wantsCourse: boolean;
  accent: string;
};

const STUDENTS: Student[] = [
  { initials: "SM", name: "Shamseera M.", where: "Calicut", niche: "Mandala coloring", week: 3, booksLive: 1, status: "On track", wantsCourse: true, accent: "#C62828" },
  { initials: "AR", name: "Arjun R.", where: "Kottayam", niche: "Crossword puzzles", week: 4, booksLive: 2, status: "Ahead", wantsCourse: true, accent: "#5B7B5B" },
  { initials: "NK", name: "Nafeesa K.", where: "Malappuram", niche: "Kids activity", week: 3, booksLive: 1, status: "On track", wantsCourse: true, accent: "#C9A24E" },
  { initials: "FH", name: "Faisal H.", where: "Kochi", niche: "Spot the diff", week: 3, booksLive: 1, status: "On track", wantsCourse: false, accent: "#8B1A1A" },
  { initials: "TA", name: "Thahir A.", where: "Trivandrum", niche: "Sudoku", week: 2, booksLive: 0, status: "Behind", wantsCourse: true, accent: "#3D5A3D" },
  { initials: "RP", name: "Rasheed P.", where: "Thrissur", niche: "Journals", week: 3, booksLive: 0, status: "On track", wantsCourse: false, accent: "#E6C178" },
];

const STATUS_TONE: Record<
  Student["status"],
  { bg: string; fg: string }
> = {
  "On track": { bg: "rgba(91,123,91,0.12)", fg: "#3D5A3D" },
  Ahead: { bg: "rgba(201,162,78,0.14)", fg: "#8a6a1f" },
  Behind: { bg: "rgba(198,40,40,0.10)", fg: "#C62828" },
  Inactive: { bg: "rgba(26,26,26,0.06)", fg: "#6B7280" },
};

function StudentCard({ s }: { s: Student }) {
  const tone = STATUS_TONE[s.status];
  return (
    <Panel>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${s.accent}, ${s.accent}dd)`,
            color: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: "0.05em",
            flexShrink: 0,
          }}
        >
          {s.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-0.01em",
            }}
          >
            {s.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {s.where}
          </div>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            background: tone.bg,
            color: tone.fg,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {s.status}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "#6B7280",
          lineHeight: 1.4,
          margin: "0 0 14px",
        }}
      >
        Niche: {s.niche}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px dashed rgba(26,26,26,0.12)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Week
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: "#1A1A1A",
            }}
          >
            {s.week} / 7
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
            }}
          >
            Live books
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: s.booksLive > 0 ? "#5B7B5B" : "#9CA3AF",
            }}
          >
            {s.booksLive}
          </div>
        </div>
      </div>

      {s.wantsCourse && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(201,162,78,0.10)",
            fontSize: 11,
            color: "#8a6a1f",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          Asked for online version
        </div>
      )}
    </Panel>
  );
}

export function FoundingBatchView() {
  const onTrack = STUDENTS.filter((s) => s.status !== "Inactive").length;
  const booksTotal = STUDENTS.reduce((s, st) => s + st.booksLive, 0);
  const wantCourse = STUDENTS.filter((s) => s.wantsCourse).length;
  return (
    <>
      <ViewHeader
        kicker="Founding batch · 001"
        title="Six students, first cohort."
        sub="All six came from the Calicut workshop floor. Week 3 in progress. Four asking for an online version — that's the next course being built."
        note={`${onTrack}/6 active · ${booksTotal} books already live · ${wantCourse} asking for the online version`}
      />
      <div style={{ padding: "32px 40px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {STUDENTS.map((s) => (
            <StudentCard key={s.initials} s={s} />
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: "28px 32px",
            borderRadius: 22,
            background: "#1A1A1A",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grain opacity={0.07} />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 90% 50%, rgba(201,162,78,0.28), transparent 60%)",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  marginBottom: 10,
                }}
              >
                Next office hours
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 32,
                  fontStyle: "italic",
                  letterSpacing: "-0.02em",
                  margin: "0 0 6px",
                }}
              >
                Thursday, April 23 · 8:00 PM IST
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                90 minutes · cover reviews, keyword questions, royalty math.
              </p>
            </div>
            <button
              style={{
                padding: "14px 22px",
                borderRadius: 999,
                background: "#C62828",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Add to calendar →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   View 6 — TEACHING CALENDAR
   ========================================================================= */

type TimeBlock = {
  day: number; // 0=Mon
  start: number; // hour
  end: number;
  type: "school" | "commute" | "lunch" | "skillies" | "office" | "workshop";
  label: string;
};

const WEEK_SCHEDULE: TimeBlock[] = [
  // School Monday-Friday
  ...[0, 1, 2, 3, 4].flatMap((d) => [
    { day: d, start: 8, end: 15, type: "school" as const, label: "Malayalam class" },
    { day: d, start: 15, end: 17, type: "commute" as const, label: "Commute + rest" },
    { day: d, start: 17, end: 21, type: "skillies" as const, label: "Skillies work" },
  ]),
  // Thursday office hours extends
  { day: 3, start: 20, end: 21.5, type: "office" as const, label: "Office hours · cohort" },
  // Saturday
  { day: 5, start: 9, end: 13, type: "skillies", label: "Weekend sprint · research" },
  { day: 5, start: 14, end: 18, type: "skillies", label: "Etsy listings" },
  { day: 5, start: 19, end: 22, type: "workshop", label: "Workshop prep · May 31" },
  // Sunday
  { day: 6, start: 10, end: 14, type: "skillies", label: "Deep work · Skillies web app" },
  { day: 6, start: 18, end: 20, type: "workshop", label: "Workshop content final prep" },
];

const TYPE_STYLE: Record<
  TimeBlock["type"],
  { bg: string; border: string; fg: string; label: string }
> = {
  school: { bg: "rgba(91,123,91,0.15)", border: "#5B7B5B", fg: "#3D5A3D", label: "School" },
  commute: { bg: "rgba(26,26,26,0.05)", border: "rgba(26,26,26,0.25)", fg: "#6B7280", label: "Commute" },
  lunch: { bg: "rgba(201,162,78,0.12)", border: "#C9A24E", fg: "#8a6a1f", label: "Lunch" },
  skillies: { bg: "rgba(198,40,40,0.10)", border: "#C62828", fg: "#C62828", label: "Skillies" },
  office: { bg: "rgba(201,162,78,0.18)", border: "#C9A24E", fg: "#8a6a1f", label: "Office hrs" },
  workshop: { bg: "rgba(26,26,26,0.90)", border: "#1A1A1A", fg: "#FAF5EB", label: "Workshop" },
};

function CalendarGrid() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hourStart = 7;
  const hourEnd = 23;
  const hours = Array.from({ length: hourEnd - hourStart + 1 }).map(
    (_, i) => i + hourStart,
  );

  return (
    <Panel padded={false}>
      <div style={{ padding: "22px 28px 16px" }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          A typical week · this April
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 0" }}>
          School Mon–Fri 8–3. Everything else — teaching prep, Skillies, Etsy,
          mentoring — squeezes around it.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "48px repeat(7, 1fr)",
          borderTop: "1px solid #F0E8D8",
        }}
      >
        {/* corner */}
        <div style={{ borderRight: "1px solid #F0E8D8" }} />
        {days.map((d, i) => (
          <div
            key={d}
            style={{
              padding: "12px 8px",
              textAlign: "center",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: i >= 5 ? "#C62828" : "#6B7280",
              borderLeft: "1px solid #F0E8D8",
              borderBottom: "1px solid #F0E8D8",
            }}
          >
            {d}
          </div>
        ))}
        {/* hour rows */}
        {hours.map((h) => (
          <React.Fragment key={h}>
            <div
              style={{
                fontSize: 10,
                color: "#9CA3AF",
                padding: "6px 8px 0",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontWeight: 600,
                borderBottom: "1px solid #F8F2E4",
                borderRight: "1px solid #F0E8D8",
                height: 38,
              }}
            >
              {h < 10 ? `0${h}` : h}:00
            </div>
            {Array.from({ length: 7 }).map((_, d) => (
              <div
                key={d}
                style={{
                  position: "relative",
                  height: 38,
                  borderLeft: "1px solid #F8F2E4",
                  borderBottom: "1px solid #F8F2E4",
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* overlay blocks */}
      <div style={{ position: "relative", height: 0 }}>
        <div
          style={{
            position: "absolute",
            top:
              -(
                (hourEnd - hourStart + 1) * 38 +
                39
              ) /* place overlay over the hour rows */,
            left: 48,
            right: 0,
            bottom: 0,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
          }}
        >
          {Array.from({ length: 7 }).map((_, dayIdx) => (
            <div key={dayIdx} style={{ position: "relative" }}>
              {WEEK_SCHEDULE.filter((b) => b.day === dayIdx).map((b, i) => {
                const pxPerHour = 38;
                const top = (b.start - hourStart) * pxPerHour + 1;
                const height = (b.end - b.start) * pxPerHour - 2;
                const s = TYPE_STYLE[b.type];
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top,
                      left: 2,
                      right: 2,
                      height,
                      background: s.bg,
                      borderLeft: `3px solid ${s.border}`,
                      borderRadius: 6,
                      padding: "4px 6px",
                      fontSize: 10,
                      color: s.fg,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        opacity: 0.85,
                        marginBottom: 1,
                      }}
                    >
                      {s.label}
                    </div>
                    {b.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function LegendChip({ tone }: { tone: TimeBlock["type"] }) {
  const s = TYPE_STYLE[tone];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: s.bg,
          borderLeft: `3px solid ${s.border}`,
        }}
      />
      <span style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 500 }}>
        {s.label}
      </span>
    </div>
  );
}

export function CalendarView() {
  return (
    <>
      <ViewHeader
        kicker="Teaching calendar"
        title="Where the hours actually go."
        sub="Day job first — I'm a Malayalam teacher. Skillies lives in the evenings, the lunch breaks, and most of the weekend."
        note="School: Mon–Fri · 8:00 AM – 3:00 PM"
      />
      <div style={{ padding: "24px 40px 80px" }}>
        {/* legend */}
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 20,
            padding: "14px 22px",
            background: "white",
            border: "1px solid #F0E8D8",
            borderRadius: 14,
          }}
        >
          {(["school", "skillies", "office", "workshop", "commute"] as const).map(
            (t) => (
              <LegendChip key={t} tone={t} />
            ),
          )}
        </div>

        <CalendarGrid />

        {/* upcoming events */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >
          <Panel title="Upcoming" sub="Next 3 weeks">
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { d: "Thu · Apr 23", label: "Office hours · cohort", type: "office" as const },
                { d: "Sun · Apr 27", label: "Deep work · web app", type: "skillies" as const },
                { d: "Thu · Apr 30", label: "Office hours · cohort", type: "office" as const },
                { d: "Sat · May 10", label: "Workshop early-bird ends", type: "workshop" as const },
                { d: "Sun · May 31", label: "The Calicut Workshop", type: "workshop" as const },
              ].map((e, i) => {
                const s = TYPE_STYLE[e.type];
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 14,
                      padding: "12px 0",
                      borderTop: i === 0 ? "none" : "1px solid #F0E8D8",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: s.border,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1A1A1A",
                        }}
                      >
                        {e.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{e.d}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: s.fg,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel title="The honest math">
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#1A1A1A",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Roughly <strong style={{ fontStyle: "normal", color: "#C62828" }}>32 hrs/week</strong> of
              teaching, <strong style={{ fontStyle: "normal", color: "#C9A24E" }}>18 hrs</strong> on
              Skillies work (evenings), and{" "}
              <strong style={{ fontStyle: "normal", color: "#5B7B5B" }}>15 hrs</strong> across the
              weekend. No heroics. Just consistency — which is what the program teaches.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
