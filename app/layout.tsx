import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import SkilliesVoiceWidget from "@/components/SkilliesVoiceWidget";

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
    "One batch. 20 students. ₹50,000 to start. The rest only when you earn ₹1L+/mo. Plus AI services for Kerala businesses. Built in Malappuram. Proof: ₹8,71,982 earned from 63 books on Amazon KDP using the same methodology.",
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
      "One batch. ₹50,000 to start. The rest only when you earn ₹1L+/mo. Plus AI services for Kerala businesses. Built in Malappuram.",
    siteName: "Skillies.AI",
    type: "website",
  },
};

// Inline script that runs SYNCHRONOUSLY in the document <head>, before any
// other JS, before React hydrates, before the ElevenLabs widget script
// loads. Patches Element.prototype.attachShadow so that the moment the
// widget creates its shadow root, we inject CSS that hides the
// `_poweredBy_*` watermark element. Because this happens BEFORE the widget
// paints anything to screen, there's no flash of "Powered by ElevenLabs
// Agents" — it's never rendered visibly at all.
//
// Idempotent · safe across HMR + double-mount.
const ELEVENLABS_WATERMARK_BLOCKER = `(function(){
  if (window.__skilliesShadowPatched) return;
  window.__skilliesShadowPatched = true;
  var orig = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(){
    var root = orig.apply(this, arguments);
    try {
      if (this.tagName && this.tagName.toLowerCase() === 'elevenlabs-convai') {
        var s = document.createElement('style');
        s.textContent = '[class*="_poweredBy_"]{display:none !important}';
        root.appendChild(s);
      }
    } catch (e) {}
    return root;
  };
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          // Must execute before the ElevenLabs widget script attaches its
          // shadow root. Placed in <head> so it runs before <body> mounts.
          dangerouslySetInnerHTML={{ __html: ELEVENLABS_WATERMARK_BLOCKER }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <MetaPixel />
        {children}
        <SkilliesVoiceWidget />
      </body>
    </html>
  );
}
