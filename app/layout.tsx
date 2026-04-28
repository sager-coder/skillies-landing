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
    "One batch. 25 students. ₹50,000 to start. The rest only when you earn ₹1L+/mo. Plus AI services for Kerala businesses. Built in Malappuram. Proof: ₹8,71,982 earned from 63 books on Amazon KDP using the same methodology.",
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
    title: "Skillies.AI — The Batch · 25 students · Malappuram",
    description:
      "One batch. ₹50,000 to start. The rest only when you earn ₹1L+/mo. Plus AI services for Kerala businesses. Built in Malappuram.",
    siteName: "Skillies.AI",
    type: "website",
  },
};

// Inline script that runs SYNCHRONOUSLY in the document <head>, before any
// other JS, before React hydrates, before the ElevenLabs widget script
// loads. Patches Element.prototype.attachShadow so that the moment the
// widget creates its shadow root, we inject Skillies-branded CSS:
//
//   1. Hide the `_poweredBy_*` ElevenLabs watermark (no flash, never paints).
//   2. Match the avatar's image-element background to the Skillies logo red
//      so there's no white flash before the PNG loads.
//   3. Subtle static red ring + hover lift on the avatar.
//   4. A pulsing red ring (Tailwind animate-ping style) around the avatar
//      using ::after with transparent fill + colored border so it never
//      obscures the logo as it expands and fades.
//   5. Refine the widget card's drop shadow into a layered, branded look.
//
// All selectors are class-name-prefix-based (`[class*="_box_"]` etc.) so we
// stay resilient when ElevenLabs rebuilds and rotates the CSS-module hashes.
//
// Idempotent · safe across HMR + double-mount.
const SKILLIES_WIDGET_STYLES = `(function(){
  if (window.__skilliesShadowPatched) return;
  window.__skilliesShadowPatched = true;
  var orig = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(){
    var root = orig.apply(this, arguments);
    try {
      if (this.tagName && this.tagName.toLowerCase() === 'elevenlabs-convai') {
        var s = document.createElement('style');
        s.textContent = [
          '[class*="_poweredBy_"]{display:none !important}',
          '[class*="_avatarImage_"]{background-color:#B81C2E !important}',
          '[class*="_avatar_"]:not([class*="_avatarBackground_"]):not([class*="_avatarImage_"]){position:relative !important;border-radius:50% !important;box-shadow:0 0 0 1.5px rgba(196,30,58,.12),0 4px 14px rgba(31,58,46,.08) !important;transition:transform 280ms cubic-bezier(.4,0,.2,1) !important}',
          '[class*="_avatar_"]:not([class*="_avatarBackground_"]):not([class*="_avatarImage_"]):hover{transform:translateY(-1px) !important}',
          '[class*="_avatar_"]:not([class*="_avatarBackground_"]):not([class*="_avatarImage_"])::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(196,30,58,.6);background:transparent;box-sizing:border-box;animation:skillies-pulse 2s cubic-bezier(0,0,.2,1) infinite;pointer-events:none}',
          '@keyframes skillies-pulse{0%{transform:scale(1);opacity:.75}100%{transform:scale(1.7);opacity:0}}',
          '[class*="_box_"]{box-shadow:0 6px 28px rgba(31,58,46,.10),0 1px 3px rgba(31,58,46,.05),0 0 0 1px rgba(31,58,46,.06) !important}'
        ].join('');
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
          dangerouslySetInnerHTML={{ __html: SKILLIES_WIDGET_STYLES }}
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
