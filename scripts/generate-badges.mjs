// Generates the "Powered by Genera" / "Book with Genera" badge PNGs that the
// /badge-kit copy-paste embeds reference at /badges/<id>.png.
//
// It drives the *running* badge-kit page with the system Chrome so the Adobe
// Typekit fonts (massilia / niveau-grotesk) are already loaded, then runs the
// same canvas code as app/(site)/badge-kit/_components/BadgeKit.tsx at 3x scale.
//
// Usage:
//   1. Start the app:   npm run dev   (or `npm start` after `npm run build`)
//   2. Generate:        BADGE_URL=http://localhost:3000/badge-kit node scripts/generate-badges.mjs
//
// Defaults to http://localhost:3000/badge-kit if BADGE_URL is unset.

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BADGE_URL = process.env.BADGE_URL || "http://localhost:3000/badge-kit";
const OUT_DIR = path.resolve("public/badges");
const SCALE = 3;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("Could not find Chrome. Set CHROME_PATH to your Chrome binary.");
  process.exit(1);
}

const PAW_D =
  "M73.79,53.42c-5.3,4.1-11.93,4.82-17.92,2.15-10.49-4.68-15.79-16.71-16.42-27.95-.43-7.78,1.67-15.39,6.75-21.25,7.4-8.55,19.07-8.29,27.1-.35,9.01,8.91,12.15,22.82,8.6,34.83-1.47,4.97-3.95,9.37-8.1,12.57Z M125.39,54.11c-4.4,2.68-9.39,3.85-14.32,2.46-6.55-1.85-11.24-6.89-13.63-13.22-3.95-10.44-2.76-21.98,2.99-31.51,4.83-8.01,13.91-13.84,23.12-11.19,5.16,1.49,8.91,5.25,11.51,9.81,2.55,4.48,3.54,9.21,3.72,14.4.27,8.1-1.71,16.08-6.51,22.62-1.93,2.63-4,4.87-6.87,6.62Z M24.6,94.92c-6.08.64-12.02-2.72-16.25-7.12C.4,79.54-2.81,64.99,2.89,55.23c4.94-8.46,14.18-10.56,22.89-5.86,4.07,2.19,7.12,5.39,9.6,9.29,4.35,6.84,5.87,15.05,3.88,22.91-1.81,7.12-7.31,12.58-14.65,13.36Z M166.1,89.1c-5.73,5.26-13.42,7.74-20.56,4.23-3.51-1.73-5.96-4.44-7.62-8-1.78-3.8-2.22-7.74-2.07-12.07.29-8.18,4-15.98,10.24-21.27,8.01-6.79,18.64-7.1,25.06,1.01,4.65,5.88,5.1,13.34,3.56,20.63-1.26,5.97-4.15,11.38-8.62,15.48Z M148.74,112.24c-2.15-3.24-4.87-5.79-7.8-8.29-3.43-2.93-6.58-5.84-9.68-9.18-5.37-5.8-8.8-12.74-13.13-17.85-6.27-7.39-14.77-11.71-24.47-12.62-3.14-.3-6.27-.36-9.4.04-10.27,1.32-20.03,6.58-25.86,15.11l-5.86,8.57c-3.29,4.82-7.07,8.99-11.49,12.87-2.99,2.63-6.04,4.91-8.66,7.94-3.33,3.86-5.81,8.09-7.2,13.05-2.18,7.72-2.15,15.86.82,23.37,2.95,7.48,10.14,12.82,17.87,14.83,9.85,2.56,20.15,1.16,29.66-2.33,11.7-4.29,20.08-4.22,31.71-.07,7.62,2.72,15.42,4.35,23.5,3.52,7.64-.79,14.76-3.77,19.88-9.53,4.22-4.74,5.9-10.96,6.28-17.26.47-7.84-1.82-15.62-6.16-22.16ZM94.98,143.87h-27.38c-4.68,0-8.48-3.8-8.48-8.48v-40.57c0-4.69,3.8-8.49,8.49-8.48h5.97s0,43.1,0,43.1h21.59s-.2,14.43-.2,14.43ZM102.32,143.87l.02-21.59h-21.59s0-14.38,0-14.38h27.53c4.68,0,8.48,3.8,8.48,8.48v26.53s0,.96,0,.96h-14.44ZM80.75,100.8v-14.47s27.53,0,27.53,0c4.68,0,8.48,3.79,8.48,8.48v5.99s-36.01,0-36.01,0Z";

const SPECS = [
  // Powered by Genera
  { id: "powered-by-genera-pill-forest", kind: "powered", shape: "pill", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
  { id: "powered-by-genera-pill-cream", kind: "powered", shape: "pill", bg: "#EAF3F4", border: "#D5E7E9", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
  { id: "powered-by-genera-pill-light", kind: "powered", shape: "pill", bg: null, border: "#C2E2E6", paw: "#FFA800", word: "#003E45", small: "#6A8A8F" },
  { id: "powered-by-genera-card-forest", kind: "powered", shape: "card", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "#FFC34D" },
  { id: "powered-by-genera-card-cream", kind: "powered", shape: "card", bg: "#FFFFFF", border: "#E2EEF0", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
  { id: "powered-by-genera-stamp-forest", kind: "powered", shape: "stamp", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
  // Book with Genera
  { id: "book-with-genera-pill-forest", kind: "book", shape: "pill", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
  { id: "book-with-genera-pill-cream", kind: "book", shape: "pill", bg: "#EAF3F4", border: "#D5E7E9", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
  { id: "book-with-genera-pill-light", kind: "book", shape: "pill", bg: null, border: "#C2E2E6", paw: "#FFA800", word: "#003E45", small: "#6A8A8F" },
  { id: "book-with-genera-card-forest", kind: "book", shape: "card", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "#FFC34D" },
  { id: "book-with-genera-card-cream", kind: "book", shape: "card", bg: "#FFFFFF", border: "#E2EEF0", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
  { id: "book-with-genera-stamp-forest", kind: "book", shape: "stamp", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
];

// Runs in the browser context. Mirrors BadgeKit.tsx's layout()/render().
function renderInPage(PAW_D, specs, scale) {
  const PAW_W = 175.51, PAW_H = 161.41;
  const pawPath = new Path2D(PAW_D);
  const GOLD_FAM = '"massilia"', BODY = '"niveau-grotesk"';

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function setFont(ctx, weight, size, fam, ls) {
    ctx.font = weight + " " + size + "px " + fam;
    try { ctx.letterSpacing = (ls || 0) + "px"; } catch (e) {}
  }
  function measure(ctx, text, weight, size, fam, ls) {
    setFont(ctx, weight, size, fam, ls);
    return ctx.measureText(text).width;
  }

  function layout(spec, mctx) {
    const isBook = spec.kind === "book";
    const SMALL = isBook ? "BOOK WITH" : "POWERED BY";
    const LEAD = isBook ? "Book with GENERA" : "Powered by GENERA";
    const TAGLINE = isBook ? "Online booking made easy" : "A Better Breed of Software";

    if (spec.shape === "pill") {
      const pawH = 30, padL = 22, padR = 25, gap = 13, H = 56;
      const smallW = measure(mctx, SMALL, 700, 10.5, BODY, 2);
      const wordW = measure(mctx, "GENERA", 800, 22, GOLD_FAM, 1);
      const pawW = PAW_W * (pawH / PAW_H);
      const textW = Math.max(smallW, wordW);
      const W = padL + pawW + gap + textW + padR;
      return { w: W, h: H, draw(ctx) {
        const tx = padL + pawW + gap, ph = pawH, py = (H - ph) / 2;
        ctx.save(); ctx.translate(padL, py); ctx.scale(ph / PAW_H, ph / PAW_H);
        ctx.fillStyle = spec.paw; ctx.fill(pawPath); ctx.restore();
        ctx.textBaseline = "middle"; ctx.textAlign = "left";
        ctx.fillStyle = spec.small; setFont(ctx, 700, 10.5, BODY, 2);
        ctx.fillText(SMALL, tx, H / 2 - 10);
        ctx.fillStyle = spec.word; setFont(ctx, 800, 22, GOLD_FAM, 1);
        ctx.fillText("GENERA", tx, H / 2 + 8);
      } };
    }
    if (spec.shape === "card") {
      const pawHc = 48, padLc = 27, padRc = 30, gapc = 18, Hc = 96;
      const l1W = measure(mctx, LEAD, 700, 20, GOLD_FAM, 0.3);
      const l2W = measure(mctx, TAGLINE, 600, 12.5, BODY, 0.4);
      const pawWc = PAW_W * (pawHc / PAW_H);
      const textWc = Math.max(l1W, l2W);
      const Wc = padLc + pawWc + gapc + textWc + padRc;
      return { w: Wc, h: Hc, draw(ctx) {
        const ph = pawHc, py = (Hc - ph) / 2, tx = padLc + pawWc + gapc;
        ctx.save(); ctx.translate(padLc, py); ctx.scale(ph / PAW_H, ph / PAW_H);
        ctx.fillStyle = spec.paw; ctx.fill(pawPath); ctx.restore();
        ctx.textBaseline = "middle"; ctx.textAlign = "left";
        ctx.fillStyle = spec.word; setFont(ctx, 700, 20, GOLD_FAM, 0.3);
        ctx.fillText(LEAD, tx, Hc / 2 - 11);
        ctx.fillStyle = spec.small; setFont(ctx, 600, 12.5, BODY, 0.4);
        ctx.fillText(TAGLINE, tx, Hc / 2 + 14);
      } };
    }
    // stamp
    const pawHs = 50, padXs = 26, padTop = 22, padBot = 22, gapPaw = 13, gapTxt = 6;
    const isBookS = spec.kind === "book";
    const SMALLS = isBookS ? "BOOK WITH" : "POWERED BY";
    const smallWs = measure(mctx, SMALLS, 700, 10, BODY, 2.5);
    const wordWs = measure(mctx, "GENERA", 800, 22, GOLD_FAM, 1.5);
    const pawWs = PAW_W * (pawHs / PAW_H);
    const Ws = Math.max(pawWs, smallWs, wordWs) + padXs * 2;
    const Hs = padTop + pawHs + gapPaw + 10 + gapTxt + 22 + padBot;
    return { w: Ws, h: Hs, draw(ctx) {
      const cx = Ws / 2;
      ctx.save(); ctx.translate(cx - pawWs / 2, padTop); ctx.scale(pawHs / PAW_H, pawHs / PAW_H);
      ctx.fillStyle = spec.paw; ctx.fill(pawPath); ctx.restore();
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      const yLabel = padTop + pawHs + gapPaw + 5, yWord = yLabel + 5 + gapTxt + 11;
      ctx.fillStyle = spec.small; setFont(ctx, 700, 10, BODY, 2.5);
      ctx.fillText(SMALLS, cx, yLabel);
      ctx.fillStyle = spec.word; setFont(ctx, 800, 22, GOLD_FAM, 1.5);
      ctx.fillText("GENERA", cx, yWord);
    } };
  }

  function render(spec, scale) {
    const m = document.createElement("canvas").getContext("2d");
    const L = layout(spec, m);
    const w = Math.round(L.w), h = Math.round(L.h);
    const cv = document.createElement("canvas");
    cv.width = Math.round(L.w * scale);
    cv.height = Math.round(L.h * scale);
    const ctx = cv.getContext("2d");
    ctx.scale(scale, scale);
    if (spec.bg) {
      rr(ctx, 0, 0, L.w, L.h, spec.shape === "pill" ? L.h / 2 : spec.shape === "stamp" ? 26 : 18);
      ctx.fillStyle = spec.bg; ctx.fill();
    }
    if (spec.border) {
      const inset = 0.75;
      rr(ctx, inset, inset, L.w - inset * 2, L.h - inset * 2, spec.shape === "pill" ? (L.h - inset * 2) / 2 : spec.shape === "stamp" ? 26 : 18);
      ctx.lineWidth = 1.5; ctx.strokeStyle = spec.border; ctx.stroke();
    }
    L.draw(ctx);
    return { dataURL: cv.toDataURL("image/png"), w, h };
  }

  return specs.map((spec) => {
    const r = render(spec, scale);
    return { id: spec.id, dataURL: r.dataURL, w: r.w, h: r.h };
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--force-device-scale-factor=1"],
  });
  try {
    const page = await browser.newPage();
    console.log(`Loading ${BADGE_URL} …`);
    await page.goto(BADGE_URL, { waitUntil: "networkidle0", timeout: 60000 });

    // Ensure the Typekit faces the canvas needs are actually loaded.
    await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('800 23px "massilia"'),
        document.fonts.load('700 21px "massilia"'),
        document.fonts.load('700 11px "niveau-grotesk"'),
        document.fonts.load('600 13px "niveau-grotesk"'),
      ]);
      await document.fonts.ready;
    });

    const results = await page.evaluate(renderInPage, PAW_D, SPECS, SCALE);

    for (const r of results) {
      const base64 = r.dataURL.replace(/^data:image\/png;base64,/, "");
      const file = path.join(OUT_DIR, `${r.id}.png`);
      await writeFile(file, Buffer.from(base64, "base64"));
      console.log(`  ✓ ${r.id}.png  (${r.w}×${r.h})`);
    }
    console.log(`\nWrote ${results.length} badges to ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
