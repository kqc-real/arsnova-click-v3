#!/usr/bin/env node
/**
 * Erzeugt Screenshots der aktuellen Startseite für die PWA-Manifest.
 * Voraussetzung: App läuft unter http://localhost:4200 (ng serve)
 * oder: npm run build && npx serve dist/browser -p 4200 -s
 *
 * Run: node apps/frontend/scripts/capture-screenshots.mjs
 */
import { chromium, webkit } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'src', 'assets', 'icons');
const BASE_URL = process.env.SCREENSHOT_URL || 'http://localhost:4200';

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Server nicht bereit
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  console.log(`Warte auf ${BASE_URL}…`);
  const ready = await waitForServer(BASE_URL);
  if (!ready) {
    console.error('App nicht erreichbar. Starte zuerst: ng serve');
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    browser = await webkit.launch({ headless: true });
  }
  const context = await browser.newContext({
    viewport: null,
    userAgent: 'Mozilla/5.0 (compatible; ScreenshotBot/1.0)',
  });

  const page = await context.newPage();

  // Dark Mode + Spielerisch-Preset für Screenshots (nach Load setzen)
  const applyScreenshotTheme = () =>
    page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark', 'preset-playful');
    });

  // Desktop: 1280x720
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await applyScreenshotTheme();
  await page.waitForTimeout(800); // Kurz warten für Animationen/Render
  await page.screenshot({
    path: join(iconsDir, 'screenshot-wide.png'),
    fullPage: false,
  });
  console.log('Generated screenshot-wide.png (1280x720, dark, spielerisch)');

  // Mobile: 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await applyScreenshotTheme();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(iconsDir, 'screenshot-narrow.png'),
    fullPage: false,
  });
  console.log('Generated screenshot-narrow.png (390x844, dark, spielerisch)');

  await browser.close();
  console.log('Fertig.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
