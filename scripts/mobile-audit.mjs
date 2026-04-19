#!/usr/bin/env node
/**
 * Mobile layout audit.
 * Runs a headless Chromium against skillies.ai at five mobile-class
 * viewports, takes full-page screenshots, and detects horizontal
 * overflow (the #1 sign of broken mobile layout).
 *
 * Usage:
 *   node scripts/mobile-audit.mjs                     # audit live prod
 *   BASE=http://localhost:3000 node scripts/mobile-audit.mjs   # audit local
 *
 * Output:
 *   /tmp/mobile-audit/<route>_<viewport>.png
 *   /tmp/mobile-audit/issues.json
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "https://skillies.ai";
const ROUTES = ["/", "/workshop", "/dashboard", "/courses"];
const VIEWPORTS = [
  { name: "360w-sm-android", width: 360, height: 780 },
  { name: "375w-iphone-se", width: 375, height: 812 },
  { name: "390w-iphone-14", width: 390, height: 844 },
  { name: "430w-iphone-15pm", width: 430, height: 932 },
  { name: "768w-tablet", width: 768, height: 1024 },
];

const OUT = "/tmp/mobile-audit";
fs.mkdirSync(OUT, { recursive: true });
// nuke stale screenshots so we don't confuse runs
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".png") || f === "issues.json" || f === "summary.md") {
    fs.unlinkSync(path.join(OUT, f));
  }
}

console.log(`\n▶ Auditing ${BASE} across ${ROUTES.length} routes × ${VIEWPORTS.length} viewports\n`);

const browser = await chromium.launch();
const issues = [];
const summary = [];

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.width < 768,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const page = await ctx.newPage();

    const slug = route === "/" ? "landing" : route.replace(/^\//, "").replace(/\//g, "-");
    const fname = `${slug}_${vp.name}.png`;
    const label = `${route.padEnd(10)} @ ${vp.name.padEnd(18)}`;

    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      // Let fonts + hydration settle
      await page.waitForTimeout(2000);

      // Horizontal overflow?
      const { hasOverflow, scrollW, clientW } = await page.evaluate(() => ({
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));

      // Find elements that push the layout past the viewport — use
      // offsetLeft + offsetWidth (real layout positions), skipping
      // transformed decoratives and ancestor-clipped elements.
      let offenders = [];
      if (hasOverflow) {
        offenders = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const results = [];

          // Walk from body down, resolve offsetLeft relative to document
          function docLeft(el) {
            let x = 0;
            let n = el;
            while (n && n !== document.body) {
              x += n.offsetLeft || 0;
              n = n.offsetParent;
            }
            return x;
          }

          document.querySelectorAll("body *").forEach((el) => {
            if (!(el instanceof HTMLElement)) return;
            const w = el.offsetWidth;
            if (!w) return;
            const left = docLeft(el);
            const right = left + w;
            if (right <= vw + 1) return;

            const s = getComputedStyle(el);
            if (s.position === "fixed" || s.position === "sticky") return;
            // ancestor overflow-hidden → not contributing to doc scroll
            let p = el.parentElement;
            let clipped = false;
            while (p) {
              const ps = getComputedStyle(p);
              if (ps.overflow === "hidden" || ps.overflowX === "hidden") {
                clipped = true;
                break;
              }
              p = p.parentElement;
            }
            if (clipped) return;

            const parent = el.parentElement;
            results.push({
              tag: el.tagName.toLowerCase(),
              class: (el.className || "").toString().slice(0, 120),
              id: el.id || "",
              offsetWidth: w,
              layoutLeft: left,
              layoutRight: right,
              overhang: right - vw,
              parentTag: parent?.tagName.toLowerCase() || "",
              parentClass: (parent?.className || "").toString().slice(0, 80),
              inlineStyle: (el.getAttribute("style") || "").slice(0, 200),
              text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 70),
              html: el.outerHTML.slice(0, 260).replace(/\s+/g, " "),
            });
          });
          // Sort by innermost-likely-cause: prefer smaller widths + larger
          // overhangs (deep leaves that still stick out)
          results.sort((a, b) => {
            if (b.overhang !== a.overhang) return b.overhang - a.overhang;
            return a.offsetWidth - b.offsetWidth;
          });
          return results.slice(0, 15);
        });
      }

      await page.screenshot({ path: path.join(OUT, fname), fullPage: true });

      const status = hasOverflow ? "⚠ OVERFLOW" : "✓ ok";
      console.log(`  ${status}  ${label}  (scroll ${scrollW} / client ${clientW})`);

      summary.push({ route, viewport: vp.name, ok: !hasOverflow, scrollW, clientW, file: fname });
      if (hasOverflow) {
        issues.push({ route, viewport: vp.name, scrollW, clientW, overhang: scrollW - clientW, offenders });
      }
    } catch (e) {
      console.log(`  ✗ ERR      ${label}  ${e.message}`);
      summary.push({ route, viewport: vp.name, ok: false, error: e.message });
    } finally {
      await ctx.close();
    }
  }
}

await browser.close();

fs.writeFileSync(path.join(OUT, "issues.json"), JSON.stringify(issues, null, 2));

// Short markdown summary
const md = [];
md.push(`# Mobile audit · ${new Date().toISOString()}`);
md.push(``);
md.push(`Base: \`${BASE}\``);
md.push(``);
md.push(`| Route | Viewport | Status | scrollW | clientW |`);
md.push(`|---|---|---|---|---|`);
for (const s of summary) {
  md.push(`| \`${s.route}\` | ${s.viewport} | ${s.ok ? "✓" : s.error ? "✗ error" : "⚠ overflow"} | ${s.scrollW ?? "-"} | ${s.clientW ?? "-"} |`);
}
md.push(``);
md.push(`**${issues.length}** viewports with horizontal overflow.`);
fs.writeFileSync(path.join(OUT, "summary.md"), md.join("\n"));

console.log(`\n${issues.length ? "⚠" : "✓"} ${issues.length} issue(s). See ${OUT}/`);
if (issues.length) {
  console.log(`  - ${OUT}/issues.json  (per-viewport overflow details)`);
  console.log(`  - ${OUT}/summary.md   (overview table)`);
  console.log(`  - ${OUT}/*.png        (full-page screenshots)`);
}
