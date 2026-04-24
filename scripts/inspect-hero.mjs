import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3370";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

const r = await page.evaluate(() => {
  let p = null;
  for (const el of document.querySelectorAll("p")) {
    if ((el.textContent || "").includes("Skillies.AI does two things")) {
      p = el;
      break;
    }
  }
  if (!p) return { err: "not found" };

  const chain = [];
  let n = p;
  while (n && n.tagName !== "HTML") {
    const rect = n.getBoundingClientRect();
    const s = getComputedStyle(n);
    chain.push({
      tag: n.tagName,
      cls: (n.className || "").toString().slice(0, 60),
      width: Math.round(rect.width),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      paddingL: s.paddingLeft,
      paddingR: s.paddingRight,
      maxWidth: s.maxWidth,
      display: s.display,
      gridTemplateColumns: s.gridTemplateColumns,
      inline: (n.getAttribute("style") || "").slice(0, 120),
    });
    n = n.parentElement;
  }
  return { chain, vw: window.innerWidth, clientW: document.documentElement.clientWidth };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
