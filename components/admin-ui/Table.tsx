// Table — generic, lightly-styled data table for admin lists.
//
// Pass columns + rows + a keyExtractor. The component takes care of the
// uppercase tracked header band, the soft hairline dividers between rows, the
// optional click-through behaviour, and the empty state. It is intentionally
// dumb about sorting / pagination — combine with `Pagination` if you need it.
//
// Generic over the row shape `T`.

"use client";

import type { CSSProperties, ReactNode } from "react";

export type Column<T> = {
  /** Unique key for this column; also used as the React key. */
  key: string;
  /** Header content (often a string, but any ReactNode works). */
  header: ReactNode;
  /** Optional custom cell renderer. Defaults to `String(row[key])`. */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Optional fixed column width (px or any CSS dimension). */
  width?: number | string;
  /** Optional alignment for the cell + header. */
  align?: "left" | "right" | "center";
};

type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  /** Must return a stable, unique key for each row. */
  keyExtractor: (row: T) => string;
  /** If provided, rows become clickable + show a hover bg + pointer cursor. */
  onRowClick?: (row: T) => void;
  /** Message shown inside the table when `rows` is empty. */
  emptyMessage?: ReactNode;
  /** Optional wrapper style overrides. */
  style?: CSSProperties;
};

export default function Table<T>({
  columns,
  rows,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data yet.",
  style,
}: TableProps<T>) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(17,24,39,0.08)",
        borderRadius: 12,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        overflow: "hidden",
        fontFamily:
          "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13.5,
            color: "#0A0A0A",
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{
                    textAlign: col.align || "left",
                    padding: "10px 16px",
                    background: "#FAFAFA",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#A3A3A3",
                    borderBottom: "1px solid rgba(17,24,39,0.08)",
                    width: col.width,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "#A3A3A3",
                    fontSize: 13,
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={
                    onRowClick
                      ? "cursor-pointer transition-colors duration-100"
                      : "transition-colors duration-100"
                  }
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "12px 16px",
                        textAlign: col.align || "left",
                        borderTop:
                          rowIndex === 0
                            ? "none"
                            : "1px solid rgba(17,24,39,0.06)",
                        color: "#0A0A0A",
                        verticalAlign: "middle",
                      }}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : // Best-effort default: stringify the matching key on the row.
                          // Consumers should pass `render` for anything non-trivial.
                          String(
                            (row as Record<string, unknown>)[col.key] ?? "—",
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
