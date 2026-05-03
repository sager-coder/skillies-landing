// Skillies.AI · Two-Systems Pitch Deck
// 5 slides · 16:9 · designed for boardroom interactive TV
//
// Brand palette
//   CREAM    #FAF5EB
//   RED      #C62828
//   GOLD     #C9A24E
//   FOREST   #3D5A3D
//   CHARCOAL #1A1A1A

const pptxgen = require("pptxgenjs");
const path = require("path");

const COLORS = {
  CREAM: "FAF5EB",
  RED: "C62828",
  GOLD: "C9A24E",
  GOLD_DARK: "A37226",
  FOREST: "3D5A3D",
  CHARCOAL: "1A1A1A",
  CHARCOAL_SOFT: "2A2A2A",
  CREAM_MUTE: "8B8678",
  CHAR_MUTE: "6B6B6B",
};

const SERIF = "Cambria";
const SERIF_DISPLAY = "Cambria";
const SANS = "Calibri";
const MONO = "Consolas";

const LOGO_PATH = path.resolve(
  __dirname,
  "../public/brand/skillies-icon-512.png",
);

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" × 5.625"
pres.author = "Skillies.AI";
pres.company = "Skillies.AI";
pres.title = "Two Systems · One Operator";

// Reusable helpers (each call returns a fresh object — pptxgenjs mutates)
const goldShadow = () => ({
  type: "outer",
  color: "C9A24E",
  blur: 16,
  offset: 0,
  angle: 90,
  opacity: 0.18,
});
const cardShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 12,
  offset: 4,
  angle: 90,
  opacity: 0.22,
});

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 · THE TWO PAINS  (charcoal)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: COLORS.CHARCOAL };

  // gold vertical accent on the left edge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.08,
    h: 5.625,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });

  // eyebrow
  s.addText("THE PROBLEM", {
    x: 0.6,
    y: 0.45,
    w: 4,
    h: 0.3,
    fontSize: 11,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 6,
    bold: true,
    margin: 0,
  });

  // setup line
  s.addText("You're scaling Meta ads. But:", {
    x: 0.6,
    y: 1.0,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: SANS,
    color: COLORS.CREAM,
    italic: true,
    margin: 0,
  });

  // big serif lines
  s.addText("DMs pile up.", {
    x: 0.6,
    y: 1.7,
    w: 9,
    h: 1.1,
    fontSize: 76,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CREAM,
    bold: false,
    margin: 0,
  });
  s.addText("Content dries up.", {
    x: 0.6,
    y: 2.85,
    w: 9,
    h: 1.1,
    fontSize: 76,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CREAM,
    bold: false,
    margin: 0,
  });

  // bottom punchline
  s.addText("Both kill the scaling.", {
    x: 0.6,
    y: 4.7,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: SANS,
    color: COLORS.RED,
    italic: true,
    bold: true,
    margin: 0,
  });

  // tiny brand mark in corner
  s.addText("SKILLIES.AI", {
    x: 8.0,
    y: 5.2,
    w: 1.8,
    h: 0.3,
    fontSize: 9,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 6,
    align: "right",
    margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 · THE REAL COST  (cream, two columns)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: COLORS.CREAM };

  // eyebrow
  s.addText("THE OLD WAY", {
    x: 0.6,
    y: 0.45,
    w: 4,
    h: 0.3,
    fontSize: 11,
    fontFace: SANS,
    color: COLORS.CHARCOAL,
    charSpacing: 6,
    bold: true,
    margin: 0,
  });

  // title
  s.addText("What scaling demands.", {
    x: 0.6,
    y: 0.9,
    w: 9,
    h: 0.7,
    fontSize: 38,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CHARCOAL,
    margin: 0,
  });

  // two cards
  const cardY = 2.0;
  const cardH = 2.2;
  const leftX = 0.6;
  const rightX = 5.2;
  const cardW = 4.2;

  // left card · sales VA
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX,
    y: cardY,
    w: cardW,
    h: cardH,
    fill: { color: "FFFFFF" },
    line: { color: COLORS.GOLD, width: 0 },
    shadow: cardShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });
  s.addText("HIRE A SALES VA", {
    x: leftX + 0.4,
    y: cardY + 0.25,
    w: cardW - 0.6,
    h: 0.3,
    fontSize: 10,
    fontFace: SANS,
    color: COLORS.CHAR_MUTE,
    charSpacing: 5,
    bold: true,
    margin: 0,
  });
  s.addText("₹35,000 / mo", {
    x: leftX + 0.4,
    y: cardY + 0.6,
    w: cardW - 0.6,
    h: 0.8,
    fontSize: 40,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CHARCOAL,
    margin: 0,
  });
  s.addText(
    [
      { text: "+ training, ramp-up time", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "+ still slow at midnight", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "+ turnover every 6 months", options: { bullet: { code: "2022" } } },
    ],
    {
      x: leftX + 0.4,
      y: cardY + 1.45,
      w: cardW - 0.6,
      h: 0.8,
      fontSize: 12,
      fontFace: SANS,
      color: COLORS.CHARCOAL,
      paraSpaceAfter: 4,
    },
  );

  // right card · content team
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX,
    y: cardY,
    w: cardW,
    h: cardH,
    fill: { color: "FFFFFF" },
    line: { color: COLORS.GOLD, width: 0 },
    shadow: cardShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });
  s.addText("HIRE A CONTENT TEAM", {
    x: rightX + 0.4,
    y: cardY + 0.25,
    w: cardW - 0.6,
    h: 0.3,
    fontSize: 10,
    fontFace: SANS,
    color: COLORS.CHAR_MUTE,
    charSpacing: 5,
    bold: true,
    margin: 0,
  });
  s.addText("₹50,000 / mo", {
    x: rightX + 0.4,
    y: cardY + 0.6,
    w: cardW - 0.6,
    h: 0.8,
    fontSize: 40,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CHARCOAL,
    margin: 0,
  });
  s.addText(
    [
      { text: "+ scripts, scheduling", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "+ edits, re-shoots, drift", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "+ inconsistent delivery", options: { bullet: { code: "2022" } } },
    ],
    {
      x: rightX + 0.4,
      y: cardY + 1.45,
      w: cardW - 0.6,
      h: 0.8,
      fontSize: 12,
      fontFace: SANS,
      color: COLORS.CHARCOAL,
      paraSpaceAfter: 4,
    },
  );

  // bottom punchline
  s.addText(
    [
      { text: "₹85,000 / month", options: { color: COLORS.RED, bold: true } },
      { text: "  ·  and you still answer DMs at midnight.", options: { color: COLORS.CHARCOAL, italic: true } },
    ],
    {
      x: 0.6,
      y: 4.55,
      w: 8.8,
      h: 0.6,
      fontSize: 18,
      fontFace: SERIF_DISPLAY,
      align: "left",
      margin: 0,
    },
  );

  // brand mark
  s.addText("SKILLIES.AI", {
    x: 8.0,
    y: 5.2,
    w: 1.8,
    h: 0.3,
    fontSize: 9,
    fontFace: SANS,
    color: COLORS.GOLD_DARK,
    charSpacing: 6,
    align: "right",
    margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 · THE FIX  (charcoal hero)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: COLORS.CHARCOAL };

  // thin gold lines top & bottom for editorial frame
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6,
    y: 0.4,
    w: 8.8,
    h: 0.02,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6,
    y: 5.2,
    w: 8.8,
    h: 0.02,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });

  // eyebrow
  s.addText("THE FIX", {
    x: 0.6,
    y: 0.6,
    w: 8.8,
    h: 0.3,
    fontSize: 11,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 8,
    bold: true,
    align: "center",
    margin: 0,
  });

  // logo · centered
  s.addImage({
    path: LOGO_PATH,
    x: 4.5,
    y: 1.05,
    w: 1.0,
    h: 1.0,
  });

  // brand name
  s.addText("Skillies.", {
    x: 0,
    y: 2.15,
    w: 10,
    h: 1.4,
    fontSize: 110,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CREAM,
    align: "center",
    margin: 0,
  });

  // tagline
  s.addText("Two systems. One operator. Built for Kerala.", {
    x: 0.6,
    y: 3.7,
    w: 8.8,
    h: 0.5,
    fontSize: 22,
    fontFace: SERIF_DISPLAY,
    color: COLORS.GOLD,
    italic: true,
    align: "center",
    margin: 0,
  });

  // proof line
  s.addText(
    [
      { text: "Founder runs his own AI-published book business  ·  ", options: { color: COLORS.CREAM } },
      { text: "₹1,16,000/month passive", options: { color: COLORS.GOLD, bold: true } },
      { text: "  ·  skillies.ai", options: { color: COLORS.CREAM } },
    ],
    {
      x: 0.6,
      y: 4.45,
      w: 8.8,
      h: 0.4,
      fontSize: 12,
      fontFace: SANS,
      align: "center",
      margin: 0,
    },
  );

  // bottom brand mark
  s.addText("SKILLIES.AI", {
    x: 0,
    y: 5.3,
    w: 10,
    h: 0.3,
    fontSize: 9,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 8,
    align: "center",
    margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 · THE TWO SYSTEMS  (cream, split-card)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: COLORS.CREAM };

  // eyebrow
  s.addText("WHAT YOU GET", {
    x: 0.6,
    y: 0.4,
    w: 9,
    h: 0.3,
    fontSize: 11,
    fontFace: SANS,
    color: COLORS.CHARCOAL,
    charSpacing: 6,
    bold: true,
    margin: 0,
  });

  // title
  s.addText("Two systems. Built to compound.", {
    x: 0.6,
    y: 0.8,
    w: 9,
    h: 0.6,
    fontSize: 32,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CHARCOAL,
    margin: 0,
  });

  // card layout
  const cY = 1.7;
  const cH = 3.5;
  const cW = 4.2;
  const lX = 0.6;
  const rX = 5.2;

  // ──── LEFT CARD · 01 · AI Front Desk
  s.addShape(pres.shapes.RECTANGLE, {
    x: lX,
    y: cY,
    w: cW,
    h: cH,
    fill: { color: COLORS.CHARCOAL },
    line: { color: COLORS.CHARCOAL, width: 0 },
    shadow: cardShadow(),
  });
  // gold accent on left
  s.addShape(pres.shapes.RECTANGLE, {
    x: lX,
    y: cY,
    w: 0.06,
    h: cH,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });
  // big number
  s.addText("01", {
    x: lX + 0.35,
    y: cY + 0.25,
    w: 1.0,
    h: 0.6,
    fontSize: 32,
    fontFace: SERIF_DISPLAY,
    color: COLORS.GOLD,
    margin: 0,
  });
  s.addText("AI FRONT DESK", {
    x: lX + 1.2,
    y: cY + 0.35,
    w: cW - 1.4,
    h: 0.4,
    fontSize: 13,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 6,
    bold: true,
    margin: 0,
  });
  // tagline
  s.addText("Replies in seconds. Manglish. 24/7.", {
    x: lX + 0.35,
    y: cY + 0.95,
    w: cW - 0.55,
    h: 0.45,
    fontSize: 18,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CREAM,
    italic: true,
    margin: 0,
  });
  // bullets
  s.addText(
    [
      { text: "WhatsApp + web  ·  always on", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "Self-improving from closed sales", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "Books only hot leads", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "You only call the interested", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "Customer data delivered before each call", options: { bullet: { code: "2022" } } },
    ],
    {
      x: lX + 0.35,
      y: cY + 1.55,
      w: cW - 0.55,
      h: 1.85,
      fontSize: 12,
      fontFace: SANS,
      color: COLORS.CREAM,
      paraSpaceAfter: 4,
    },
  );

  // ──── RIGHT CARD · 02 · AI Content Engine
  s.addShape(pres.shapes.RECTANGLE, {
    x: rX,
    y: cY,
    w: cW,
    h: cH,
    fill: { color: COLORS.CHARCOAL },
    line: { color: COLORS.CHARCOAL, width: 0 },
    shadow: cardShadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rX,
    y: cY,
    w: 0.06,
    h: cH,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });
  s.addText("02", {
    x: rX + 0.35,
    y: cY + 0.25,
    w: 1.0,
    h: 0.6,
    fontSize: 32,
    fontFace: SERIF_DISPLAY,
    color: COLORS.GOLD,
    margin: 0,
  });
  s.addText("AI CONTENT ENGINE", {
    x: rX + 1.2,
    y: cY + 0.35,
    w: cW - 1.4,
    h: 0.4,
    fontSize: 13,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 6,
    bold: true,
    margin: 0,
  });
  s.addText("You speak. We ship.", {
    x: rX + 0.35,
    y: cY + 0.95,
    w: cW - 0.55,
    h: 0.45,
    fontSize: 18,
    fontFace: SERIF_DISPLAY,
    color: COLORS.CREAM,
    italic: true,
    margin: 0,
  });
  s.addText(
    [
      { text: "Record voice  ·  or write if English", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "We train an AI model on your style", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "3 finished videos per day", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "Never fails at consistency", options: { bullet: { code: "2022" }, breakLine: true } },
      { text: "Stop posting. Start shipping.", options: { bullet: { code: "2022" } } },
    ],
    {
      x: rX + 0.35,
      y: cY + 1.55,
      w: cW - 0.55,
      h: 1.85,
      fontSize: 12,
      fontFace: SANS,
      color: COLORS.CREAM,
      paraSpaceAfter: 4,
    },
  );

  // brand mark
  s.addText("SKILLIES.AI", {
    x: 8.0,
    y: 5.3,
    w: 1.8,
    h: 0.3,
    fontSize: 9,
    fontFace: SANS,
    color: COLORS.GOLD_DARK,
    charSpacing: 6,
    align: "right",
    margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 · PRICING + CTA  (charcoal)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: COLORS.CHARCOAL };

  // gold accent on left edge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.08,
    h: 5.625,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });

  // eyebrow
  s.addText("PRICING", {
    x: 0.6,
    y: 0.45,
    w: 6,
    h: 0.3,
    fontSize: 11,
    fontFace: SANS,
    color: COLORS.GOLD,
    charSpacing: 8,
    bold: true,
    margin: 0,
  });

  // big price
  s.addText(
    [
      { text: "From  ", options: { color: COLORS.CREAM } },
      { text: "₹25,000", options: { color: COLORS.GOLD, bold: true } },
      { text: "  / month", options: { color: COLORS.CREAM } },
    ],
    {
      x: 0.6,
      y: 1.0,
      w: 9,
      h: 1.3,
      fontSize: 64,
      fontFace: SERIF_DISPLAY,
      align: "left",
      margin: 0,
    },
  );

  // setup line
  s.addText(
    [
      { text: "Setup ", options: { color: COLORS.CREAM } },
      { text: "₹70,000", options: { color: COLORS.GOLD, bold: true } },
      { text: "  ·  base pack  ·  scales with conversation + content volume", options: { color: COLORS.CREAM } },
    ],
    {
      x: 0.6,
      y: 2.55,
      w: 9,
      h: 0.4,
      fontSize: 16,
      fontFace: SANS,
      italic: true,
      margin: 0,
    },
  );

  // gold divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6,
    y: 3.4,
    w: 1.5,
    h: 0.025,
    fill: { color: COLORS.GOLD },
    line: { color: COLORS.GOLD, width: 0 },
  });

  // contact block
  s.addText(
    [
      { text: "WhatsApp  ", options: { color: COLORS.CREAM } },
      { text: "+91 80899 41131", options: { color: COLORS.GOLD, bold: true } },
    ],
    {
      x: 0.6,
      y: 3.65,
      w: 9,
      h: 0.5,
      fontSize: 26,
      fontFace: SERIF_DISPLAY,
      margin: 0,
    },
  );
  s.addText("skillies.ai", {
    x: 0.6,
    y: 4.25,
    w: 9,
    h: 0.5,
    fontSize: 26,
    fontFace: SERIF_DISPLAY,
    color: COLORS.GOLD,
    margin: 0,
  });

  // tag
  s.addText("We install  ·  we train  ·  we maintain.   You scale.", {
    x: 0.6,
    y: 5.05,
    w: 9,
    h: 0.4,
    fontSize: 14,
    fontFace: SERIF_DISPLAY,
    color: COLORS.GOLD,
    italic: true,
    margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, "two-systems-deck.pptx");
pres.writeFile({ fileName: outPath }).then((f) => {
  console.log("✓ wrote " + f);
});
