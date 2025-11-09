#!/usr/bin/env node
/**
 * scripts/optimize-pngs.js
 * Re-encodes project icon PNGs with sharper compression settings using sharp.
 * Safe: only overwrites files that exist.
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
const imgDir = path.join(ROOT, 'assets', 'images');

const files = [
  'icon.png',
  'android-icon-foreground.png',
  'android-icon-background.png',
  'favicon.png',
  'splash-icon.png',
];

async function optimize(file) {
  const p = path.join(imgDir, file);
  if (!fs.existsSync(p)) return false;
  try {
    // Re-encode using palette / higher compression where possible
    await sharp(p)
      .png({ compressionLevel: 9, adaptiveFiltering: true, quality: 80, palette: true })
      .toBuffer()
      .then((buf) => fs.writeFileSync(p, buf));
    console.log('Optimized', file);
    return true;
  } catch (err) {
    console.warn('Failed to optimize', file, err.message || err);
    return false;
  }
}

(async () => {
  console.log('Optimizing PNG icons in', imgDir);
  for (const f of files) {
    await optimize(f);
  }
  console.log('Optimization complete.');
})();
