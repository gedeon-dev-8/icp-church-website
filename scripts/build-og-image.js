// ────────────────────────────────────────────────────────────────────
// build-og-image.js
//
// Renders public/og-image.svg → public/og-image.jpg at 1200×630.
// Run automatically before `vite build` (see package.json "build"
// script), or manually with `npm run og`.
//
// Why this exists:
//   Facebook's link-preview scraper and a handful of older bots still
//   prefer raster (JPG/PNG) over SVG. Vector keeps shipping as the
//   source of truth — this just emits a rasterised companion file.
//
// Updating the artwork:
//   Edit public/og-image.svg in any vector tool, then re-run this
//   script. The PNG/JPG output regenerates from the latest SVG.
// ────────────────────────────────────────────────────────────────────
import { readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const PROJECT    = resolve(__dirname, '..');
const SVG_PATH   = resolve(PROJECT, 'public', 'og-image.svg');
const JPG_PATH   = resolve(PROJECT, 'public', 'og-image.jpg');
const PNG_PATH   = resolve(PROJECT, 'public', 'og-image.png');

const WIDTH  = 1200;
const HEIGHT = 630;
const QUALITY = 88;

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  if (!(await fileExists(SVG_PATH))) {
    console.error(`✗ Source SVG missing: ${SVG_PATH}`);
    process.exitCode = 1;
    return;
  }

  // sharp is loaded lazily so this script's import cost stays cheap
  // for environments that haven't installed devDeps yet.
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.error('✗ sharp is not installed. Run `npm install` first.');
    console.error('  (sharp is declared in devDependencies for this purpose.)');
    process.exitCode = 1;
    return;
  }

  const svg = await readFile(SVG_PATH);

  // JPG: smaller, what Facebook/LinkedIn/most scrapers prefer.
  const jpg = await sharp(svg, { density: 300 })
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();
  await writeFile(JPG_PATH, jpg);

  // PNG: kept as a backup for platforms that explicitly want lossless.
  const png = await sharp(svg, { density: 300 })
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(PNG_PATH, png);

  console.log(`✓ og-image.jpg  →  ${(jpg.length / 1024).toFixed(1)} KB`);
  console.log(`✓ og-image.png  →  ${(png.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error('✗ OG image build failed:', err);
  process.exitCode = 1;
});
