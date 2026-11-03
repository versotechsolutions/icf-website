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

const openCount = () => page.$$eval('nav[aria-label=Main] button[aria-expanded=true]', (b) => b.length);
const panelState = (id) => page.$eval(`#${id}`, (el) => ({ state: el.dataset.state, opacity: getComputedStyle(el).opacity, visibility: getComputedStyle(el).visibility }));
const center = async (sel) => {
  const r = await page.$eval(sel, (el) => { const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, top: b.top, bottom: b.bottom, left: b.left }; });
  return r;
};

await test('Dropdown: hover opens with transition, aligned directly below its menu item', async () => {
  await go('/');
  const t = await center('button[aria-controls="menu-conferences"]');
  await page.mouse.move(t.x, t.y);
  await sleep(300);
  const st = await panelState('menu-conferences');
  assert(st.state === 'open' && st.opacity === '1' && st.visibility === 'visible', `panel not visible: ${JSON.stringify(st)}`);
  const li = await page.$eval('button[aria-controls="menu-conferences"]', (b) => b.parentElement.getBoundingClientRect().left);
  const panel = await page.$eval('#menu-conferences', (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top }; });
  const header = await page.$eval('header', (h) => h.getBoundingClientRect().bottom);
  assert(Math.abs(panel.left - li) < 1, `panel not aligned with item (${panel.left} vs ${li})`);
  assert(Math.abs(panel.top - header) < 2, `panel not directly below header (${panel.top} vs ${header})`);
});

await test('Dropdown: moving the mouse from item into the panel does not flicker closed', async () => {
  await go('/');
  const t = await center('button[aria-controls="menu-for-participants"]');
  await page.mouse.move(t.x, t.y);
  await sleep(250);
  const link = await center('#menu-for-participants a[href="/awards"]');
  // move diagonally in small steps through the gap, sampling the state on the way
  let closedOnTheWay = false;
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(t.x + ((link.x - t.x) * i) / 12, t.y + ((link.y - t.y) * i) / 12);
    await sleep(25);
    if ((await panelState('menu-for-participants')).state !== 'open') closedOnTheWay = true;
  }
  assert(!closedOnTheWay, 'panel closed while moving into it');
});

await test('Dropdown: only one dropdown open at a time; leaving closes it', async () => {
  await go('/');
  const a = await center('button[aria-controls="menu-conferences"]');
  const b = await center('button[aria-controls="menu-conference-info"]');
  await page.mouse.move(a.x, a.y);
  await sleep(250);
  await page.mouse.move(b.x, b.y, { steps: 6 });
  await sleep(300);
  assert((await openCount()) === 1, 'more than one dropdown open');
  assert((await panelState('menu-conference-info')).state === 'open', 'hovered dropdown not open');
  await page.mouse.move(b.x, 600, { steps: 4 });
  await page.mouse.move(40, 700);
  await sleep(400);
  assert((await openCount()) === 0, 'dropdown did not close after leaving');
});

await test('Dropdown: click opens/keeps open, click outside closes, submenu link navigates', async () => {
  await go('/');
  await page.click('button[aria-controls="menu-conferences"]');
  await sleep(250);
  assert((await panelState('menu-conferences')).state === 'open', 'click did not open');
  await page.mouse.click(700, 600);
  await sleep(300);
  assert((await openCount()) === 0, 'outside click did not close');
  const t = await center('button[aria-controls="menu-conferences"]');
  await page.mouse.move(t.x, t.y);
  await sleep(250);
  await page.click('#menu-conferences a[href="/topics"]');
  await page.waitForFunction(() => location.pathname === '/topics');
  await sleep(300);
  assert((await openCount()) === 0, 'menu stayed open after navigating');
});

await test('Dropdown: keyboard (Enter, arrows, Home/End, Escape, Tab out)', async () => {
  await go('/');
  await page.focus('button[aria-controls="menu-conference-info"]');
  await page.keyboard.press('ArrowDown');
  await sleep(100);
  let href = await page.evaluate(() => document.activeElement.getAttribute('href'));
  assert(href === '/call-for-papers', `ArrowDown did not focus first link (${href})`);
  await page.keyboard.press('ArrowDown');
  href = await page.evaluate(() => document.activeElement.getAttribute('href'));
  assert(href === '/programme', 'ArrowDown did not move to next link');
  await page.keyboard.press('End');
  href = await page.evaluate(() => document.activeElement.getAttribute('href'));
  assert(href === '/video-conferencing', 'End did not move to last link');
  await page.keyboard.press('Escape');
  await sleep(50);
  const focused = await page.evaluate(() => document.activeElement.getAttribute('aria-controls'));
  assert(focused === 'menu-conference-info' && (await openCount()) === 0, 'Escape did not close and return focus');
  await page.keyboard.press('Enter');
  await sleep(50);
  assert((await openCount()) === 1, 'Enter did not open');
  await page.keyboard.press('Enter');
  await sleep(50);
  assert((await openCount()) === 0, 'Enter did not toggle closed');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 7; i++) await page.keyboard.press('Tab');
  await sleep(50);
  assert((await openCount()) === 0, 'tabbing out did not close the menu');
});

await test('Dropdown: touch tap toggles on large touch screens', async () => {
  await page.setViewport({ width: 1366, height: 1024, hasTouch: true, isMobile: false });
  await go('/');
  const t = await center('button[aria-controls="menu-for-participants"]');
  await page.touchscreen.tap(t.x, t.y);
  await sleep(250);
  assert((await panelState('menu-for-participants')).state === 'open', 'tap did not open');
  await page.touchscreen.tap(t.x, t.y);
  await sleep(250);
  assert((await openCount()) === 0, 'second tap did not close');
  await page.setViewport({ width: 1366, height: 900 });
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
