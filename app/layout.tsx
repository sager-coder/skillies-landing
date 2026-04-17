import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Skillies.AI — Human Brain + AI Skills = Real Income",
  description:
    "Learn to use AI skills that generate real income. Our flagship KDP Mastery Program has generated ₹8,00,000+ in royalties from 63 books. Join the founding batch.",
  keywords: [
    "AI skills",
    "Amazon KDP",
    "passive income",
    "AI publishing",
    "Skillies.AI",
    "KDP course India",
  ],
  openGraph: {
    title: "Skillies.AI — Human Brain + AI Skills = Real Income",
    description:
      "Learn AI skills that make actual money. ₹8,00,000+ earned from 63 books using our AI-powered publishing system.",
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
