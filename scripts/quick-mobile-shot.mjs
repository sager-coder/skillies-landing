import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE || "https://skillies.ai";
const ROUTES = ["/", "/workshop", "/dashboard", "/courses"];
const browser = await chromium.launch();

const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, // iPhone 14
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
});
const page = await ctx.newPage();

fs.mkdirSync("/tmp/mobile-shots", { recursive: true });
for (const r of ROUTES) {
  const slug = r === "/" ? "landing" : r.replace(/^\//, "");
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  // Top (above-fold) only, not full page
  await page.screenshot({ path: `/tmp/mobile-shots/${slug}-top.png`, fullPage: false });
  // Scroll down halfway and take another
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `/tmp/mobile-shots/${slug}-mid.png`, fullPage: false });
  console.log("done", r);
}
await browser.close();
