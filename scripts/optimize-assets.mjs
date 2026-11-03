// Generates web-optimised assets from the client-supplied originals in /source-assets.
// Run with: npm run assets
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const src = new URL('../source-assets/', import.meta.url);
const out = new URL('../public/images/', import.meta.url);
mkdirSync(out, { recursive: true });
const p = (base, name) => new URL(name, base).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const logo = p(src, 'icf-logo-original.png');
const meta = await sharp(logo).metadata();
console.log('logo', meta.width, meta.height);

// Full logo (header / footer plate)
await sharp(logo).resize({ width: 560 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(p(out, 'icf-logo.png'));
await sharp(logo).resize({ width: 560 }).webp({ quality: 90 }).toFile(p(out, 'icf-logo.webp'));

// Emblem (globe + figures + ICF letters, without the wordmark line)
const emblem = { left: Math.round(meta.width * 0.025), top: Math.round(meta.height * 0.085), width: Math.round(meta.width * 0.96), height: Math.round(meta.height * 0.65) };
const emblemBuf = await sharp(logo).extract(emblem).toBuffer();
await sharp(emblemBuf).resize({ width: 400 }).webp({ quality: 90 }).toFile(p(out, 'icf-emblem.webp'));

// Favicon/app icons: globe-and-figures mark centred on a white square
const markBox = { left: Math.round(meta.width * 0.115), top: Math.round(meta.height * 0.215), width: Math.round(meta.width * 0.325), height: Math.round(meta.height * 0.455) };
const markBuf = await sharp(logo).extract(markBox).toBuffer();
for (const size of [32, 180, 192, 512]) {
  const inner = Math.round(size * 0.92);
  const resized = await sharp(markBuf).resize({ width: inner, height: inner, fit: 'contain', background: '#ffffff' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(p(new URL('../public/', import.meta.url), size === 32 ? 'favicon-32.png' : size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`));
}

// Client-supplied conference photograph
const photo = p(src, 'conference-hall-supplied.jpeg');
for (const w of [800, 1400]) {
  await sharp(photo).resize({ width: w }).webp({ quality: 78 }).toFile(p(out, `conference-hall-${w}.webp`));
}
await sharp(photo).resize({ width: 1200 }).jpeg({ quality: 80, mozjpeg: true }).toFile(p(out, 'og-image.jpg'));
console.log('done');

// Client-supplied home page banner (1093×436). Kept at its native width: upscaling would only blur it.
const banner = p(src, 'home-banner-supplied.jpg');
await sharp(banner).webp({ quality: 85 }).toFile(p(out, 'home-banner.webp'));
await sharp(banner).jpeg({ quality: 85, mozjpeg: true }).toFile(p(out, 'home-banner.jpg'));
console.log('banner done');
