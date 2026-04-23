import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// ⚠️ Critical — without this, mobile browsers render the page at a
// desktop layout width (~760-980px) and scale down. Fixing this is
// what makes every CSS breakpoint actually fire on mobile.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FAF5EB",
};

export const metadata: Metadata = {
  title: "Skillies.AI — Human Brain + AI Skills = Real Income",
  description:
    "A research-and-teach school for the age of AI. ₹8,71,982 earned from 63 books on Amazon KDP. Kerala Tour workshop (3 Sundays in May) ₹999 · 50-day cohort ₹35,000 · founding mentorship ₹1,75,000.",
  keywords: [
    "AI skills",
    "Amazon KDP",
    "passive income",
    "AI publishing",
    "Skillies.AI",
    "KDP course India",
    "Kerala",
    "Malappuram",
  ],
  openGraph: {
    title: "Skillies.AI — Human Brain + AI Skills = Real Income",
    description:
      "Earn while you sleep. ₹8,71,982 earned from 63 books using AI. Join the Kerala Tour workshop.",
    siteName: "Skillies.AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
