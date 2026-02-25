#!/usr/bin/env node
/**
 * Prüft: Kein horizontales Scrollen bei 320px Viewport (Backlog DoD, Story 6.4).
 * Erwartet: App läuft unter BASE_URL (z. B. npx serve dist/browser -s).
 *
 * Run: BASE_URL=http://localhost:3000 node scripts/check-viewport-320.mjs
 */
import { chromium, webkit } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const VIEWPORT_WIDTH = 320;
const VIEWPORT_HEIGHT = 568;

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
    console.error('App nicht erreichbar. Starte zuerst: npx serve dist/browser -s');
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    browser = await webkit.launch({ headless: true });
  }
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  const paths = ['/', '/legal/imprint', '/legal/privacy', '/quiz', '/session/DEMO01'];
  let failed = 0;

  for (const path of paths) {
    const page = await context.newPage();
    const url = `${BASE_URL}${path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});

    const result = await page.evaluate(
      (w) => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(
          body.scrollWidth,
          body.offsetWidth,
          doc.scrollWidth,
          doc.offsetWidth,
          doc.clientWidth
        );
        const clientWidth = doc.clientWidth;
        const ok = scrollWidth <= w && clientWidth === w;
        return { ok, scrollWidth, clientWidth };
      },
      VIEWPORT_WIDTH
    );

    await page.close();

    if (result.ok) {
      console.log(`  ${path} … OK (scrollWidth=${result.scrollWidth}, client=${result.clientWidth})`);
    } else {
      console.error(`  ${path} … FEHLER: scrollWidth=${result.scrollWidth} > ${VIEWPORT_WIDTH}`);
      failed++;
    }
  }

  await browser.close();

  if (failed > 0) {
    console.error(`\n${failed} Seite(n) mit horizontalem Overflow bei ${VIEWPORT_WIDTH}px.`);
    process.exit(1);
  }
  console.log(`\n✓ Kein horizontales Scrollen bei ${VIEWPORT_WIDTH}px (${paths.length} Seiten).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
