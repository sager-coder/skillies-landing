/**
 * Services page · visual audit
 * Captures one screenshot per logical section in desktop + one in mobile.
 * Output: /audits/v3-visual/
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.env.BASE || "https://skillies.ai";
const OUT = "audits/v3-visual";

// Captured by scrolling to specific Y offsets that fall mid-section.
// We measure live and adjust if any look chopped.
const SECTIONS = [
  { id: "01-hero",            scrollTo: 0,     label: "Hero" },
  { id: "02-wedge",           scrollTo: 760,   label: "Wedge · 'It needs an AI front desk'" },
  { id: "03-frontdesk-top",   scrollTo: 1500,  label: "FrontDesk · headline + cards" },
  { id: "04-frontdesk-mid",   scrollTo: 2200,  label: "FrontDesk · feature grid" },
  { id: "05-frontdesk-bot",   scrollTo: 2900,  label: "FrontDesk · pricing/CTA panel" },
  { id: "06-content-top",     scrollTo: 3600,  label: "ContentEngine · headline" },
  { id: "07-content-mid",     scrollTo: 4300,  label: "ContentEngine · feature cards" },
  { id: "08-content-bot",     scrollTo: 5000,  label: "ContentEngine · 'unfair part'" },
  { id: "09-proof",           scrollTo: 5700,  label: "Proof · 2 reels" },
  { id: "10-why-skillies",    scrollTo: 6500,  label: "Why Skillies · differentiators" },
  { id: "11-compliance",      scrollTo: 7300,  label: "Compliance" },
  { id: "12-talk-to-bot",     scrollTo: 8100,  label: "Talk to the bot · CTA" },
  { id: "13-faq",             scrollTo: 8900,  label: "FAQ" },
  { id: "14-final-cta",       scrollTo: 9700,  label: "FinalCTA" },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  // ─── DESKTOP (1440×900) ────────────────────────────────────────────────
  const desk = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const dPage = await desk.newPage();
  console.log(`▷ desktop: ${BASE}/services`);
  await dPage.goto(`${BASE}/services`, { waitUntil: "networkidle", timeout: 60000 });
  await dPage.waitForTimeout(2500);

  const total = await dPage.evaluate(() => document.body.scrollHeight);
  console.log(`  total height: ${total}px`);

  for (const s of SECTIONS) {
    if (s.scrollTo > total) continue;
    await dPage.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.scrollTo);
    await dPage.waitForTimeout(500);
    const file = join(OUT, `desktop-${s.id}.png`);
    await dPage.screenshot({ path: file, fullPage: false });
    console.log(`  ✓ ${file}`);
  }

  // ─── one full-page desktop capture ──
  await dPage.evaluate(() => window.scrollTo(0, 0));
  await dPage.waitForTimeout(400);
  await dPage.screenshot({
    path: join(OUT, `desktop-FULL.png`),
    fullPage: true,
  });
  console.log(`  ✓ desktop-FULL.png`);

  // ─── MOBILE (375×812 · iPhone 14) ──────────────────────────────────────
  const mob = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mPage = await mob.newPage();
  console.log(`▷ mobile: ${BASE}/services`);
  await mPage.goto(`${BASE}/services`, { waitUntil: "networkidle", timeout: 60000 });
  await mPage.waitForTimeout(2000);

  const mtotal = await mPage.evaluate(() => document.body.scrollHeight);
  console.log(`  mobile total height: ${mtotal}px`);

  // mobile sections at proportional heights
  const M_SCROLLS = [
    { id: "01-hero",         y: 0 },
    { id: "02-frontdesk",    y: Math.round(mtotal * 0.22) },
    { id: "03-content",      y: Math.round(mtotal * 0.40) },
    { id: "04-proof",        y: Math.round(mtotal * 0.55) },
    { id: "05-why",          y: Math.round(mtotal * 0.65) },
    { id: "06-talk-to-bot",  y: Math.round(mtotal * 0.78) },
    { id: "07-faq",          y: Math.round(mtotal * 0.88) },
    { id: "08-final-cta",    y: Math.round(mtotal * 0.96) },
  ];
  for (const s of M_SCROLLS) {
    await mPage.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.y);
    await mPage.waitForTimeout(450);
    const file = join(OUT, `mobile-${s.id}.png`);
    await mPage.screenshot({ path: file, fullPage: false });
    console.log(`  ✓ ${file}`);
  }

  await browser.close();
  console.log("✓ done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
