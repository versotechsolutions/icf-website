// Captures full-page screenshots and reports browser console errors for each route.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [routes...]
//   e.g. node scripts/screenshots.mjs http://localhost:4173 docs/screenshots / /about
// Set CHROME_PATH if Chrome is not in the default Windows location.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4173';
const outDir = process.argv[3] ?? 'docs/screenshots';
const defaultRoutes = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/conferences', 'conference-listing'],
  ['/event/icicgb-26', 'conference-details'],
  ['/call-for-papers', 'call-for-papers'],
  ['/registration', 'registration'],
  ['/gallery', 'gallery'],
  ['/contact', 'contact'],
  ['/admin', 'admin-dashboard'],
];
const routes = process.argv.length > 4 ? process.argv.slice(4).map((r) => [r, r.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home']) : defaultRoutes;
const viewports = (process.env.VIEWPORTS ?? 'desktop,mobile').split(',');
const sizes = { desktop: { width: 1440, height: 900 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 } };

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-first-run', '--disable-gpu'],
});

let problems = 0;
for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport(sizes[vp]);
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
  for (const [route, name] of routes) {
    errors.length = 0;
    await page.goto(base + route, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2600)); // let the hero line-draw and sample "loading" finish
    const file = `${outDir}/${name}-${vp}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const status = errors.length ? `ERRORS: ${errors.join(' | ')}` : 'ok';
    if (errors.length) problems++;
    console.log(`${vp.padEnd(7)} ${route.padEnd(28)} ${status}`);
  }
  await page.close();
}
await browser.close();
process.exit(problems ? 1 : 0);
