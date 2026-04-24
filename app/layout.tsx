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
    "Skillies.AI does two things: builds AI systems for businesses that need to ship faster, and teaches AI skills to students who want to earn real money. Built in Malappuram, Kerala. Proof: ₹8,71,982 earned from 63 books on Amazon KDP. Kerala Tour ₹999 · 50-day cohort ₹35,000 · founding mentorship ₹1,75,000.",
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
    title: "Skillies.AI — AI Services for Businesses. AI Skills for Students.",
    description:
      "AI systems for businesses that need to move faster. AI skills for students who want to earn real money. Built in Kerala. ₹8,71,982 earned from 63 books on Amazon KDP.",
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
