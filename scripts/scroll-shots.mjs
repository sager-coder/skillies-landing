#!/usr/bin/env node
/**
 * Take scroll-position mobile screenshots of every route so the
 * full content can be reviewed page-by-page without 4MB full-page
 * PNGs. Each shot is viewport-sized (390×844).
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE || "https://skillies.ai";
const ROUTES = ["/", "/workshop", "/dashboard", "/courses"];
const OUT = "/tmp/scroll-shots";

// clean
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
});
const page = await ctx.newPage();

for (const route of ROUTES) {
  const slug = route === "/" ? "landing" : route.replace(/^\//, "");
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);

  // Force animations to a state, then take scroll-based shots
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 744; // slightly less than viewport so we see a hint of continuity
  let idx = 0;
  for (let y = 0; y < totalHeight; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(400);
    const filename = `${slug}-${String(idx).padStart(2, "0")}.png`;
    await page.screenshot({
      path: `${OUT}/${filename}`,
      fullPage: false,
    });
    idx++;
    if (idx > 12) break; // cap per route
  }
  console.log(`${route}: ${idx} shots`);
}

await browser.close();
console.log(`\nSaved to ${OUT}`);
