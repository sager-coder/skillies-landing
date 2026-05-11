import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // weight omitted = variable font (full 100–900 range available),
  // which is required when defining axes like opsz (optical size).
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  // variable axis covers 300–700
  display: "swap",
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
  metadataBase: new URL("https://skillies.ai"),
  title: "Skillies.AI — AI sales workers for Indian businesses",
  description:
    "AI sales workers for Indian businesses — Skillies builds per-vertical AI workers that close leads on WhatsApp and Instagram DMs in 5 Indian languages. Tools don't sell. Workers do.",
  keywords: [
    "AI sales agent India",
    "WhatsApp AI for business",
    "AI for real estate India",
    "AI for hajj umrah",
    "AI sales worker",
    "Skillies.AI",
    "AI for insurance",
    "AI for study abroad",
    "AI for coaching institutes",
    "AI for modular kitchen",
  ],
  icons: {
    icon: [
      { url: "/brand/skillies-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/skillies-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/skillies-icon-400.png",
  },
  openGraph: {
    title: "Skillies.AI — Tools don't sell. Workers do.",
    description:
      "AI sales workers for Indian businesses. Built per-vertical, in 5 Indian languages.",
    url: "https://skillies.ai",
    siteName: "Skillies.AI",
    type: "website",
    images: [
      {
        url: "/brand/skillies-meta-app-icon.png",
        width: 1200,
        height: 630,
        alt: "Skillies — AI sales workers for Indian businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skillies.AI — Tools don't sell. Workers do.",
    description:
      "AI sales workers for Indian businesses, built per-vertical, in 5 Indian languages.",
    images: ["/brand/skillies-meta-app-icon.png"],
  },
};

import GlobalBackground from "@/components/design/GlobalBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative isolate">
        <GlobalBackground />
        <JsonLd variant="site" />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
