import React from "react";

/**
 * Per-vertical line icons, keyed by slug. Kept here (a .tsx) so lib/verticals.ts
 * stays a pure data module. Any component that needs a vertical glyph reads from
 * this single map — add a vertical's icon once, it shows everywhere.
 */
const I = (paths: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

export const VERTICAL_ICONS: Record<string, React.ReactNode> = {
  "real-estate": I(
    <>
      <path d="M3 21h18" />
      <path d="M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </>,
  ),
  ecommerce: I(
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>,
  ),
  retail: I(
    <>
      <path d="M3 9 4 4h16l1 5" />
      <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <path d="M9 21v-6h6v6" />
    </>,
  ),
  "study-abroad": I(
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </>,
  ),
  coaching: I(
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>,
  ),
  interiors: I(
    <>
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>,
  ),
  hajj: I(
    <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8l-8.2-1.8a.5.5 0 0 0-.5.8l3.9 3.9-2.2 2.2H4l-1 1 3 1.5L9.5 21l1-1v-2.1l2.2-2.2 3.9 3.9a.5.5 0 0 0 .8-.5z" />,
  ),
  insurance: I(
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
  ),
};
