#!/usr/bin/env node
/**
 * full-capture.mjs — comprehensive screenshot harness.
 *
 * Captures every route × 3 viewports + every dashboard sub-view.
 * Also catches specific interactive states (course filters, FAQ
 * expanded, etc.)
 *
 * Output: /tmp/full-capture/<viewport>/<route>-<index>.png + a
 * readable manifest.
 */

import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE || "https://skillies.ai";
const OUT = "/tmp/full-capture";

const VIEWPORTS = [
  { label: "mobile", width: 390, height: 844, isMobile: true },
  { label: "tablet", width: 768, height: 1024, isMobile: false },
  { label: "desktop", width: 1280, height: 800, isMobile: false },
];

const ROUTES = [
  { path: "/", slug: "landing" },
  { path: "/workshop", slug: "workshop" },
  { path: "/courses", slug: "courses" },
];

// Dashboard sub-views — click each tab and capture
const DASH_VIEWS = [
  { key: "home", label: "Overview" },
  { key: "royalties", label: "KDP Royalties" },
  { key: "books", label: "My Books" },
  { key: "etsy", label: "Etsy" },
  { key: "cohort", label: "Founding batch" },
  { key: "calendar", label: "Teaching calendar" },
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const manifest = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const dir = `${OUT}/${vp.label}`;
  fs.mkdirSync(dir, { recursive: true });

  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    userAgent: vp.isMobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
      : "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15",
  });
  const page = await ctx.newPage();

  // Regular routes
  for (const r of ROUTES) {
    await page.goto(BASE + r.path, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    // scroll to trigger any lazy loads
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Full-page screenshot (high detail for review)
    await page.screenshot({
      path: `${dir}/${r.slug}-FULL.png`,
      fullPage: true,
    });
    manifest.push({ viewport: vp.label, route: r.path, kind: "full", file: `${vp.label}/${r.slug}-FULL.png` });

    // Viewport shots at scroll positions
    const total = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.round(vp.height * 0.85);
    let idx = 0;
    for (let y = 0; y < total; y += step) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
      const filename = `${r.slug}-vp-${String(idx).padStart(2, "0")}.png`;
      await page.screenshot({ path: `${dir}/${filename}`, fullPage: false });
      manifest.push({ viewport: vp.label, route: r.path, kind: "viewport", y, file: `${vp.label}/${filename}` });
      idx++;
      if (idx > 14) break;
    }
    console.log(`  ${vp.label} ${r.path}: ${idx + 1} shots`);
  }

  // Dashboard sub-views
  await page.goto(BASE + "/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  for (const view of DASH_VIEWS) {
    try {
      // click the sidebar button that matches this view's label
      const clicked = await page.evaluate((lbl) => {
        const btns = document.querySelectorAll("aside button, aside a");
        for (const b of btns) {
          if ((b.textContent || "").includes(lbl)) {
            b.click();
            return true;
          }
        }
        return false;
      }, view.label);
      if (!clicked) {
        console.log(`  ${vp.label} /dashboard · ${view.key}: button not found`);
        continue;
      }
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      // full-page of this view
      await page.screenshot({
        path: `${dir}/dashboard-${view.key}-FULL.png`,
        fullPage: true,
      });
      manifest.push({ viewport: vp.label, route: `/dashboard#${view.key}`, kind: "full", file: `${vp.label}/dashboard-${view.key}-FULL.png` });

      // also take a top shot
      await page.screenshot({
        path: `${dir}/dashboard-${view.key}-TOP.png`,
        fullPage: false,
      });
      manifest.push({ viewport: vp.label, route: `/dashboard#${view.key}`, kind: "viewport", y: 0, file: `${vp.label}/dashboard-${view.key}-TOP.png` });

      console.log(`  ${vp.label} /dashboard · ${view.key}: done`);
    } catch (e) {
      console.log(`  ${vp.label} /dashboard · ${view.key}: ERROR ${e.message}`);
    }
  }

  await page.close();
  await ctx.close();
}

await browser.close();

fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} captures written to ${OUT}`);
