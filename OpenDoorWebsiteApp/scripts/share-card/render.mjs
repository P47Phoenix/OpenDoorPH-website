// One-off generator. Run from OpenDoorWebsiteApp/:  node scripts/share-card/render.mjs
// Writes public/share-card.png (1200x630). Never overwrite a released card in place:
// bump the filename (share-card-v2.png) and both meta tags (AC-32).
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { statSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const template = pathToFileURL(resolve(here, 'template.html')).href;
const out = resolve(here, '../../public/share-card.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(template, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// FACES = the four rendered faces only (PRD AC-30). '16px Lora' / '16px Inter' are never requested by the template, so
// document.fonts.check() reports them false on every run, online or offline.
const FACES = ['700 72px Lora', 'italic 400 40px Lora', '700 32px Inter', '600 36px Inter'];
await page.evaluate((faces) => Promise.all(faces.map((f) => document.fonts.load(f))), FACES);
// Gate (QA W-5 / Architect DoD B-1): fonts.load() resolves even when a face fails to fetch, so check() is the real test.
const fontsOk = await page.evaluate((faces) => faces.every((f) => document.fonts.check(f)), FACES);
if (!fontsOk) { console.error('share-card: Lora/Inter not loaded (offline or Google Fonts blocked); refusing to render a Georgia fallback'); await browser.close(); process.exit(1); }
const LINES = ['Open Door Full Gospel Church', 'Pleasant Hill, Missouri', '"Restore such a one in a spirit of gentleness." Galatians 6:1', 'Sundays 10:30 AM'];
// textContent (DOM text as typed): K2 is CSS text-transform: uppercase, so a rendered-text read returns 'PLEASANT HILL, MISSOURI' and fails the verbatim match.
const text = await page.evaluate(() => document.body.textContent);
const missing = LINES.filter((l) => !text.includes(l));
if (missing.length) { console.error(`share-card: template text missing: ${missing.join(' | ')}`); await browser.close(); process.exit(1); }
await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 }, omitBackground: false });
await browser.close();

const bytes = statSync(out).size;
if (bytes > 307200) { console.error(`share-card.png is ${bytes} bytes (> 300 KB)`); process.exit(1); }
console.log(`wrote ${out} (${bytes} bytes)`);
