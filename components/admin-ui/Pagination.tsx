// Pagination — minimal prev/next pager with a centred "Page X of Y" indicator.
//
// Designed to sit at the bottom of a <Table>. The component is controlled —
// keep `page` in your own state and call `onChange` to advance. Prev/Next are
// disabled at the bounds (page <= 1, page >= pageCount).
//
// If `pageCount <= 1`, the component renders nothing — so it's safe to drop
// in unconditionally.

"use client";

import type { CSSProperties } from "react";

type PaginationProps = {
  /** Current 1-based page index. */
  page: number;
  /** Total number of pages (1-based). */
  pageCount: number;
  onChange: (page: number) => void;
  style?: CSSProperties;
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={{
        transform: dir === "right" ? "rotate(180deg)" : undefined,
      }}
    >
      <path
        d="M8.5 3L4.5 7L8.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pagination({
  page,
  pageCount,
  onChange,
  style,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;

  const btnBase: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 32,
    padding: "0 10px",
    background: "#FFFFFF",
    border: "1px solid rgba(17,24,39,0.08)",
    borderRadius: 8,
    color: "#0A0A0A",
    fontFamily:
      "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1,
    transition: "background-color 150ms ease, color 150ms ease",
  };

  const disabledStyles: CSSProperties = {
    color: "#A3A3A3",
    background: "#FAFAFA",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 4px",
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => !prevDisabled && onChange(page - 1)}
        disabled={prevDisabled}
        className={prevDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        style={{ ...btnBase, ...(prevDisabled ? disabledStyles : {}) }}
        onMouseEnter={(e) => {
          if (!prevDisabled) e.currentTarget.style.background = "#FAFAFA";
        }}
        onMouseLeave={(e) => {
          if (!prevDisabled) e.currentTarget.style.background = "#FFFFFF";
        }}
      >
        <Chevron dir="left" />
        Prev
      </button>

      <div
        style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: "#525252",
        }}
      >
        Page {page} of {pageCount}
      </div>

      <button
        type="button"
        onClick={() => !nextDisabled && onChange(page + 1)}
        disabled={nextDisabled}
        className={nextDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        style={{ ...btnBase, ...(nextDisabled ? disabledStyles : {}) }}
        onMouseEnter={(e) => {
          if (!nextDisabled) e.currentTarget.style.background = "#FAFAFA";
        }}
        onMouseLeave={(e) => {
          if (!nextDisabled) e.currentTarget.style.background = "#FFFFFF";
        }}
      >
        Next
        <Chevron dir="right" />
      </button>
    </div>
  );
}
