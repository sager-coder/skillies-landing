import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 360, height: 780 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto("https://skillies.ai/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

const report = await page.evaluate(() => {
  const vw = window.innerWidth;
  const out = [];

  // First pass: find elements where bounding-rect right > vw (any position/transform)
  // but filter to just the ones that are NOT inside a transform-rotated ancestor.
  document.querySelectorAll("body *").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const r = el.getBoundingClientRect();
    if (r.right <= vw + 1) return;
    if (r.width < 4 || r.height < 4) return;
    const s = getComputedStyle(el);
    if (s.position === "fixed" || s.position === "sticky") return;
    // Is any ancestor using transform?
    let p = el.parentElement;
    let transformed = false;
    while (p && p !== document.body) {
      const ps = getComputedStyle(p);
      if (ps.transform !== "none") {
        transformed = true;
        break;
      }
      p = p.parentElement;
    }
    // Only skip if it's transformed AND not large
    if (transformed && r.width < vw) return;

    const inline = el.getAttribute("style") || "";
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 80),
      right: Math.round(r.right),
      width: Math.round(r.width),
      left: Math.round(r.left),
      inline: inline.slice(0, 160),
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
    });
  });

  // Also report body + main + all sections
  const firstLevel = [];
  document.querySelectorAll("body > *, main > *, section > *").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    firstLevel.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 50),
      scrollW: el.scrollWidth,
      clientW: el.clientWidth,
    });
  });

  return {
    vw,
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    overflowCount: out.length,
    topOverhang: out.sort((a, b) => b.right - a.right).slice(0, 10),
    firstLevel: firstLevel.filter(f => f.scrollW > vw + 1).slice(0, 15),
  };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
