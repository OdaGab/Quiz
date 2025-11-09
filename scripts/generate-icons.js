#!/usr/bin/env node
/**
 * scripts/generate-icons.js
 *
 * Usage:
 *  node scripts/generate-icons.js [sourceImagePath]
 *
 * Default source path: ./assets/images/icon-source.png
 * Generates:
 *  - assets/images/icon.png (1024x1024)
 *  - assets/images/android-icon-foreground.png (432x432)
 *  - assets/images/android-icon-background.png (1080x1080) (solid color)
 *  - assets/images/favicon.png (192x192)
 *  - assets/images/splash-icon.png (200x200)
 *
 * Requires: npm i sharp
 */

const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Missing dependency: sharp. Run `npm i -D sharp` and try again.');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const defaultSrc = path.join(ROOT, 'assets', 'images', 'icon-source.png');
const src = process.argv[2] ? path.resolve(process.argv[2]) : defaultSrc;

const outDir = path.join(ROOT, 'assets', 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const out = (name) => path.join(outDir, name);

async function run() {
  if (!fs.existsSync(src)) {
    console.error('\nSource image not found:', src);
    console.error('Place your logo at', defaultSrc, 'or pass its path as an argument.');
    process.exit(1);
  }

  console.log('Using source:', src);

  // icon.png 1024x1024
  await sharp(src).resize(1024, 1024, { fit: 'contain' }).png().toFile(out('icon.png'));
  console.log('Wrote', out('icon.png'));

  // android foreground 432x432 (keep alpha)
  await sharp(src).resize(432, 432, { fit: 'contain' }).png().toFile(out('android-icon-foreground.png'));
  console.log('Wrote', out('android-icon-foreground.png'));

  // android background 1080x1080 (solid color)
  const backgroundColor = '#E6F4FE';
  await sharp({ create: { width: 1080, height: 1080, channels: 3, background: backgroundColor } })
    .png()
    .toFile(out('android-icon-background.png'));
  console.log('Wrote', out('android-icon-background.png'));

  // favicon 192x192
  await sharp(src).resize(192, 192, { fit: 'cover' }).png().toFile(out('favicon.png'));
  console.log('Wrote', out('favicon.png'));

  // splash icon 200x200
  await sharp(src).resize(200, 200, { fit: 'contain' }).png().toFile(out('splash-icon.png'));
  console.log('Wrote', out('splash-icon.png'));

  console.log('\nAll icons generated into', outDir);
}

run().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(2);
});
