import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Instrument_Serif } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import SkilliesChatWidget from "@/components/SkilliesChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
  title: "Skillies.AI — AI sales workers for Indian businesses",
  description:
    "Skillies for [your business]. The AI sales worker that closes leads in WhatsApp + Instagram DMs in 5 Indian languages. Tools don't sell. Workers do.",
  keywords: [
    "AI sales agent India",
    "WhatsApp AI for business",
    "AI for real estate India",
    "AI for hajj umrah",
    "AI sales worker Kerala",
    "Skillies.AI",
    "AI for clinics",
    "AI for study abroad",
    "AI for coaching institutes",
    "AI for modular kitchen",
    "Kerala",
    "Malappuram",
  ],
  openGraph: {
    title: "Skillies.AI — Tools don't sell. Workers do.",
    description:
      "AI sales workers for Indian businesses. Built per-vertical, in 5 Indic languages. From Malappuram, Kerala.",
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
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MetaPixel />
        {children}
        <SkilliesChatWidget />
      </body>
    </html>
  );
}
