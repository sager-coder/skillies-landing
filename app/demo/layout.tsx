import type { Metadata } from "next";

/**
 * Interactive demo pages are not landing pages — they're live sandboxes.
 * Keep them out of the index so ranking signals concentrate on the
 * canonical /for/<vertical> landing pages (still followable for crawl).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
