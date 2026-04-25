import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

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
  title: "Skillies.AI — AI Services for Businesses. AI Skills for Students.",
  description:
    "One batch. 20 students. ₹50,000 to start. The rest only when you earn ₹3L+/mo. Plus AI services for Kerala businesses. Built in Malappuram. Proof: ₹8,71,982 earned from 63 books on Amazon KDP using the same methodology.",
  keywords: [
    "AI services India",
    "AI for business",
    "AI automation Kerala",
    "AI skills training",
    "Amazon KDP",
    "AI publishing",
    "Skillies.AI",
    "KDP course India",
    "Kerala",
    "Malappuram",
  ],
  openGraph: {
    title: "Skillies.AI — The Batch · 20 students · Malappuram",
    description:
      "One batch. ₹50,000 to start. The rest only when you earn ₹3L+/mo. Plus AI services for Kerala businesses. Built in Malappuram.",
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
      <body className="min-h-full flex flex-col">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
