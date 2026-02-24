#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('../../landing/node_modules/sharp');
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'src', 'assets', 'icons');

const bg = { r: 15, g: 23, b: 42, alpha: 1 };
const brand = { r: 14, g: 165, b: 233, alpha: 1 };

async function createScreenshot(width, height, label, filename) {
  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${width * 0.1}" y="${height * 0.15}" width="${width * 0.8}" height="${height * 0.08}" rx="12" fill="rgb(14,165,233)" opacity="0.15"/>
      <text x="${width / 2}" y="${height * 0.38}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="${Math.round(width * 0.08)}" fill="white">arsnova.click</text>
      <text x="${width / 2}" y="${height * 0.50}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="400" font-size="${Math.round(width * 0.03)}" fill="rgb(148,163,184)">Live-Quiz &amp; Abstimmung für Hochschulen</text>
      <rect x="${width * 0.3}" y="${height * 0.58}" width="${width * 0.4}" height="${height * 0.07}" rx="14" fill="rgb(14,165,233)"/>
      <text x="${width / 2}" y="${height * 0.625}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="${Math.round(width * 0.025)}" fill="white">Quiz starten</text>
      <text x="${width / 2}" y="${height * 0.92}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${Math.round(width * 0.02)}" fill="rgb(100,116,139)">100 % DSGVO-konform · Open Source · Kostenlos</text>
    </svg>`;

  await sharp({ create: { width, height, channels: 4, background: bg } })
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .png()
    .toFile(join(iconsDir, filename));
  console.log(`Generated ${filename} (${width}x${height})`);
}

await createScreenshot(1280, 720, 'Desktop', 'screenshot-wide.png');
await createScreenshot(390, 844, 'Mobile', 'screenshot-narrow.png');
