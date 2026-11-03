// End-to-end smoke test of frontend interactions (no backend involved).
// Usage: node scripts/smoke-test.mjs [baseUrl]   (run `npm run build && npm run preview` first)
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:4173';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(String(e)));

let pass = 0;
let fail = 0;
async function test(name, fn) {
  try {
    await fn();
    pass++;
    console.log(`PASS  ${name}`);
  } catch (e) {
    fail++;
    console.log(`FAIL  ${name}\n      ${e.message}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const go = (path) => page.goto(base + path, { waitUntil: 'networkidle0' });
const text = (sel) => page.$eval(sel, (el) => el.textContent ?? '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const path = () => new URL(page.url()).pathname + new URL(page.url()).search;

await test('Home finder submits subject filter to listing', async () => {
  await go('/');
  await page.select('#finder-topic', 'law');
  await page.click('form[role=search] button[type=submit]');
  await page.waitForFunction(() => location.pathname === '/conferences');
  assert(path().includes('topic=law'), `unexpected URL ${path()}`);
  await page.waitForFunction(() => /found/.test(document.querySelector('#results-heading')?.textContent ?? ''));
  assert((await text('#results-heading')).match(/^\d+ conferences? found/), 'results heading missing');
  assert((await text('h1')).includes('Law'), 'heading does not reflect topic');
});

await test('Searchable country combobox navigates to SEO country page', async () => {
  await go('/conferences');
  const input = await page.$('form#filters input[role=combobox]');
  await input.click();
  await input.type('Jap');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => location.pathname === '/conferences/japan');
  await page.waitForFunction(() => /found/.test(document.querySelector('#results-heading')?.textContent ?? ''));
  const n = parseInt(await text('#results-heading'), 10);
  assert(n > 0, 'no conferences for Japan');
  assert((await text('h1')) === 'Conferences in Japan', 'country heading missing');
});

await test('Empty state shown when no results', async () => {
  await go('/conferences/iceland');
  await page.waitForFunction(() => document.body.innerText.includes('No conferences match these filters'));
});

await test('Pagination moves to page 2', async () => {
  await go('/conferences');
  await page.waitForSelector('nav[aria-label=Pagination]');
  await page.click('nav[aria-label=Pagination] button[aria-label="Next page"]');
  await page.waitForFunction(() => location.search.includes('page=2'));
  await page.waitForFunction(() => document.querySelector('nav[aria-label=Pagination] [aria-current=page]')?.textContent === '2');
});

await test('Month filter narrows results', async () => {
  await go('/conferences');
  await page.waitForFunction(() => /found/.test(document.querySelector('#results-heading')?.textContent ?? ''));
  const all = parseInt(await text('#results-heading'), 10);
  const opt = await page.$eval('#flt-month option:nth-child(2)', (o) => o.value);
  await page.select('#flt-month', opt);
  await page.waitForFunction(() => /found/.test(document.querySelector('#results-heading')?.textContent ?? '') && location.search.includes('month='));
  const some = parseInt(await text('#results-heading'), 10);
  assert(some > 0 && some < all, `month filter did not narrow (${all} -> ${some})`);
});

await test('Contact form blocks empty submit and accepts valid input', async () => {
  await go('/contact');
  await page.click('form button[type=submit]');
  await page.waitForSelector('[role=alert]');
  assert((await text('[role=alert]')).includes('fields need attention'), 'error summary missing');
  assert((await page.$$('[aria-invalid=true]')).length >= 6, 'invalid fields not marked');
  await page.type('#f-fullName', 'Test Participant');
  await page.type('#f-email', 'test@example.org');
  const c = await page.$('#f-country');
  await c.click();
  await c.type('India');
  await page.keyboard.press('Enter');
  await page.type('#f-subject', 'Registration question');
  await page.select('#f-enquiryType', 'Conference Registration');
  await page.type('#f-message', 'I would like to know about registration categories.');
  await page.click('#f-consent');
  await page.click('form button[type=submit]');
  await page.waitForFunction(() => document.body.innerText.includes('Enquiry ready to send'));
});

await test('Contact email validation message', async () => {
  await go('/contact');
  await page.type('#f-email', 'not-an-email');
  await page.click('#f-fullName');
  await page.waitForFunction(() => document.querySelector('#f-email-error')?.textContent?.includes('format'));
});

await test('Registration: fee table pre-fills form, paper title required for authors', async () => {
  await go('/registration');
  await page.click('button[aria-label^="Select Author Presentation, standard"]');
  await sleep(300);
  assert((await page.$eval('#f-category', (s) => s.value)) === 'Author Presentation', 'category not pre-filled');
  assert((await page.$eval('#f-period', (s) => s.value)) === 'standard', 'period not pre-filled');
  assert(await page.$('#f-paperTitle'), 'paper title field not shown for author category');
  const fee = await page.$eval('aside[aria-label="Registration summary"]', (a) => a.textContent);
  assert(fee.includes('$349.00'), 'summary fee incorrect');
  await page.click('#register-form form button[type=submit]');
  await page.waitForSelector('#f-paperTitle-error');
});

await test('Registration completes with valid data', async () => {
  await go('/registration');
  await page.type('#f-fullName', 'Test Listener');
  await page.type('#f-email', 'listener@example.org');
  await page.type('#f-phone', '9876543210');
  const c = await page.$('#f-country');
  await c.click();
  await c.type('Japan');
  await page.keyboard.press('Enter');
  await page.type('#f-institution', 'Example University');
  const conf = await page.$eval('#f-conference option:nth-child(2)', (o) => o.value);
  await page.select('#f-conference', conf);
  await page.select('#f-category', 'Listener / Attendee');
  await page.click('#f-consent');
  await page.click('#register-form form button[type=submit]');
  await page.waitForFunction(() => document.body.innerText.includes('Registration details checked'));
  assert((await page.content()).includes('$200.00'), 'pre-enrolment listener fee not shown');
});

await test('Call for papers search filters themes', async () => {
  await go('/call-for-papers');
  await page.type('#cfp-search', 'blockchain');
  await page.waitForFunction(() => document.body.innerText.includes('1 matching theme'));
});

await test('FAQ accordion expands and search filters', async () => {
  await go('/faq');
  const btns = await page.$$('#main [aria-expanded]');
  const second = btns[1];
  await second.click();
  assert((await second.evaluate((b) => b.getAttribute('aria-expanded'))) === 'true', 'accordion did not expand');
  await page.type('#faq-search', 'certificate');
  await page.waitForFunction(() => /of 12 questions match/.test(document.body.innerText));
});

await test('Download brochure opens modal form with validation', async () => {
  await go('/programme');
  const [btn] = await page.$$('xpath/.//button[contains(., "Download brochure")]');
  await btn.click();
  await page.waitForFunction(() => document.querySelector('dialog')?.open === true);
  await page.click('dialog button[type=submit]');
  await page.waitForSelector('dialog [aria-invalid=true]');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('dialog')?.open === false);
});

await test('Awards tabs switch content', async () => {
  await go('/awards');
  await page.click('#tab-best-student-paper');
  await page.waitForFunction(() => document.querySelector('#award-panel h2')?.textContent === 'Best Student Paper Award');
});

await test('Desktop dropdown menu opens and navigates', async () => {
  await go('/');
  await page.click('button[aria-controls="menu-for-participants"]');
  await page.waitForSelector('#menu-for-participants:not([hidden])');
  const [link] = await page.$$('xpath/.//*[@id="menu-for-participants"]//a[contains(., "Invitation letter")]');
  await link.click();
  await page.waitForFunction(() => location.pathname === '/invitation-letter');
});

await test('Mobile menu opens, expands a group and navigates', async () => {
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await go('/');
  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForSelector('#mobile-menu:not([hidden])');
  const [grp] = await page.$$('xpath/.//*[@id="mobile-menu"]//button[contains(., "Conferences")]');
  await grp.click();
  const [link] = await page.$$('xpath/.//*[@id="mobile-menu"]//a[contains(., "Browse by topic")]');
  await link.click();
  await page.waitForFunction(() => location.pathname === '/topics');
  assert(await page.$('#mobile-menu[hidden]'), 'menu did not close after navigation');
  await page.setViewport({ width: 1366, height: 900 });
});

await test('Admin login validates then opens dashboard', async () => {
  await go('/admin/login');
  await page.click('form button[type=submit]');
  await page.waitForSelector('#f-email-error');
  await page.type('#f-email', 'admin@example.org');
  await page.type('#f-password', 'demo-password');
  await page.click('form button[type=submit]');
  await page.waitForFunction(() => location.pathname === '/admin');
  await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Dashboard');
});

await test('Admin conference delete confirmation removes row', async () => {
  await go('/admin/conferences');
  const before = (await page.$$('tbody tr')).length;
  await page.click('button[aria-label="Delete ICICGB-26"]');
  await page.waitForFunction(() => document.querySelector('dialog')?.open);
  const [del] = await page.$$('xpath/.//dialog//button[contains(., "Delete conference")]');
  await del.click();
  await page.waitForFunction((n) => document.querySelectorAll('tbody tr').length === n - 1, {}, before);
});

await test('Admin conference form validates dates', async () => {
  await go('/admin/conferences/new');
  await page.type('#f-title', 'Test conference');
  await page.type('#f-acronym', 'TC-27');
  await page.select('#f-topic', 'law');
  await page.$eval('#f-startDate', (el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(el, '2027-05-10');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.$eval('#f-endDate', (el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(el, '2027-05-01');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const [submit] = await page.$$('xpath/.//button[contains(., "Create conference")]');
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#f-endDate-error')?.textContent?.includes('on or after'));
});

await test('Admin payments: mark bank transfer received', async () => {
  await go('/admin/payments');
  const [btn] = await page.$$('xpath/.//button[contains(., "Mark received")]');
  assert(btn, 'no pending bank transfer in sample data');
  const before = (await page.$$('xpath/.//button[contains(., "Mark received")]')).length;
  await btn.click();
  await page.waitForFunction((n) => [...document.querySelectorAll('button')].filter((b) => b.textContent.includes('Mark received')).length === n - 1, {}, before);
});

await test('Every internal link resolves to a real page', async () => {
  const start = ['/', '/about', '/conferences', '/topics', '/event/icicgb-26', '/registration', '/contact', '/admin'];
  const seen = new Set();
  const queue = [...start];
  const broken = [];
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    await go(p);
    await sleep(150);
    const h1 = await page.$eval('h1', (h) => h.textContent).catch(() => '');
    if (h1 === 'This page could not be found') broken.push(p);
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href').split('#')[0]));
    for (const h of hrefs) if (h && !seen.has(h) && !h.startsWith('/images') && seen.size + queue.length < 160) queue.push(h);
  }
  assert(!broken.length, `broken internal links: ${broken.join(', ')}`);
  console.log(`      crawled ${seen.size} internal URLs`);
});

await test('No console errors during the run', async () => {
  assert(!consoleErrors.length, consoleErrors.slice(0, 5).join(' | '));
});

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
