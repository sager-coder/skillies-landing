/**
 * Workshop page · visual audit · captures every section as a separate
 * desktop screenshot + a single mobile capture per section. Output goes
 * to /audits/workshop-2026-04-25/ for the improvement report.
 *
 * Run:  node scripts/audit-workshop.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.env.BASE || "http://localhost:3370";
const OUT = "audits/workshop-2026-04-25";

// Each entry: a logical section + a CSS selector or scroll trigger.
// We screenshot the full visible area at that scroll position.
// The order matches the visual top-to-bottom flow on /workshop.
const SECTIONS = [
  { id: "01-hero", scrollTo: 0, label: "Hero · book stack + headline" },
  { id: "02-ticket-stub", scrollTo: 800, label: "Ticket stub" },
  { id: "03-book-gallery-top", scrollTo: 1100, label: "Book gallery · header" },
  { id: "04-book-gallery-grid", scrollTo: 1400, label: "Book gallery · 6 covers" },
  { id: "05-book-gallery-stats", scrollTo: 1900, label: "Gallery stats strip" },
  { id: "06-outcomes", scrollTo: 2200, label: "Outcomes · 3 cards" },
  { id: "07-wedge", scrollTo: 2900, label: "Wedge · what this isn't / is" },
  { id: "08-day-structure-top", scrollTo: 3500, label: "Day structure · header" },
  { id: "09-day-structure-rows", scrollTo: 3900, label: "Day structure · rows 1-3" },
  { id: "10-day-structure-rows2", scrollTo: 4400, label: "Day structure · rows 4-6" },
  { id: "11-proof", scrollTo: 4900, label: "Proof · Ehsan quote + receipt" },
  { id: "12-selection-top", scrollTo: 5500, label: "Selection · headline + seat map" },
  { id: "13-selection-paths", scrollTo: 5900, label: "Selection · two paths" },
  { id: "14-pricing", scrollTo: 6400, label: "Pricing · EB + Regular" },
  { id: "15-logistics", scrollTo: 7100, label: "Logistics · 8 cards" },
  { id: "16-faq", scrollTo: 7800, label: "FAQ" },
  { id: "17-final-cta", scrollTo: 8500, label: "Final CTA" },
];

async function run() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();

  // ---- DESKTOP capture (1440 x 900) ----
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktop = await desktopCtx.newPage();
  console.log(`▷ Loading ${BASE}/workshop in desktop viewport...`);
  await desktop.goto(`${BASE}/workshop`, { waitUntil: "domcontentloaded" });
  // Let images / fonts settle.
  await desktop.waitForTimeout(2000);

  const totalH = await desktop.evaluate(() => document.body.scrollHeight);
  console.log(`  page height: ${totalH}px`);

  for (const s of SECTIONS) {
    if (s.scrollTo > totalH) continue; // skip if section is past page end
    await desktop.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.scrollTo);
    await desktop.waitForTimeout(450);
    const path = join(OUT, `desktop-${s.id}.png`);
    await desktop.screenshot({ path, fullPage: false });
    console.log(`  ✓ desktop ${s.id} @ y=${s.scrollTo}`);
  }

  // ---- DESKTOP fullpage (one big capture) ----
  await desktop.evaluate(() => window.scrollTo(0, 0));
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: join(OUT, "desktop-FULL.png"),
    fullPage: true,
  });
  console.log("  ✓ desktop FULL");

  await desktopCtx.close();

  // ---- MOBILE capture (390 x 844 · iPhone 14 Pro proportions) ----
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await mobileCtx.newPage();
  console.log(`▷ Loading ${BASE}/workshop in mobile viewport...`);
  await mobile.goto(`${BASE}/workshop`, { waitUntil: "domcontentloaded" });
  await mobile.waitForTimeout(2000);

  // Mobile: capture every ~700px of scroll.
  const mobileH = await mobile.evaluate(() => document.body.scrollHeight);
  let i = 0;
  for (let y = 0; y < mobileH; y += 700) {
    await mobile.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await mobile.waitForTimeout(350);
    await mobile.screenshot({
      path: join(OUT, `mobile-${String(i).padStart(2, "0")}.png`),
      fullPage: false,
    });
    console.log(`  ✓ mobile slice ${i} @ y=${y}`);
    i++;
  }

  // ---- MOBILE fullpage ----
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.waitForTimeout(500);
  await mobile.screenshot({
    path: join(OUT, "mobile-FULL.png"),
    fullPage: true,
  });
  console.log("  ✓ mobile FULL");

  await mobileCtx.close();
  await browser.close();
  console.log(`\nDone · screenshots in ${OUT}/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
