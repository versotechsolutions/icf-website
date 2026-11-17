// End-to-end smoke test of frontend interactions (no backend involved).
// Usage: node scripts/smoke-test.mjs [baseUrl]   (run `npm run build && npm run preview` first)
import puppeteer from 'puppeteer-core';
import * as XLSX from 'xlsx';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
  // Wait until the Japan results have rendered (every listed conference is in Japan).
  await page.waitForFunction(() => {
    const found = /^\d+ conferences? found/.test(document.querySelector('#results-heading')?.textContent ?? '');
    const cards = [...document.querySelectorAll('section[aria-labelledby=results-heading] article')];
    return found && cards.length > 0 && cards.every((c) => c.textContent.includes('Japan'));
  });
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

await test('Month tab narrows results', async () => {
  await go('/conferences');
  await page.waitForFunction(() => /found/.test(document.querySelector('#results-heading')?.textContent ?? ''));
  const all = parseInt(await text('#results-heading'), 10);
  await page.click('nav[aria-label="Conferences by month"] li:nth-child(2) button');
  await page.waitForFunction(() => location.search.includes('month='));
  // Wait for the new results (the heading briefly shows the old count, then "Loading…").
  await page.waitForFunction(
    (n) => { const m = (document.querySelector('#results-heading')?.textContent ?? '').match(/^(\d+) conferences? found/); return m && Number(m[1]) !== n; },
    { timeout: 5000 },
    all,
  ).catch(() => {});
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
  try {
    await go('/');
    await page.click('button[aria-controls="mobile-menu"]');
    await page.waitForSelector('#mobile-menu:not([hidden])');
    const [grp] = await page.$$('xpath/.//*[@id="mobile-menu"]//button[contains(., "Conferences")]');
    await grp.click();
    // Let the expand animation finish so the link is in its final position before clicking.
    await new Promise((r) => setTimeout(r, 700));
    const [link] = await page.$$('xpath/.//*[@id="mobile-menu"]//a[contains(., "Browse by topic")]');
    await link.click();
    await page.waitForFunction(() => location.pathname === '/topics');
    assert(await page.$('#mobile-menu[hidden]'), 'menu did not close after navigation');
  } finally {
    await page.setViewport({ width: 1366, height: 900 });
  }
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

// ---- Admin: one common login, seven connected modules, Excel bulk upload ----
const adminModules = [
  ['Dashboard', '/admin', 'Dashboard'],
  ['Conferences', '/admin/conferences', 'Conference management'],
  ['Registrations', '/admin/registrations', 'Registration management'],
  ['Payment status', '/admin/payments', 'Payment status'],
  ['Email notifications', '/admin/emails', 'Email notifications'],
  ['Reports', '/admin/reports', 'Reports'],
  ['Conference content', '/admin/content', 'Conference content'],
];
const sidebarLink = async (label) => (await page.$$(`xpath/.//nav[@aria-label="Admin"]//a[normalize-space(.)="${label}"]`))[0];

await test('Admin sidebar: seven modules, each opens its page and is highlighted', async () => {
  await go('/admin');
  const labels = await page.$$eval('nav[aria-label=Admin] a', (as) => as.map((a) => a.textContent.trim()));
  assert(JSON.stringify(labels) === JSON.stringify(adminModules.map((m) => m[0])), `sidebar items: ${labels.join(', ')}`);
  for (const [label, p, h1] of [...adminModules.slice(1), adminModules[0]]) {
    await (await sidebarLink(label)).click();
    await page.waitForFunction((x) => location.pathname === x, {}, p);
    await page.waitForFunction((t) => document.querySelector('main h1')?.textContent === t, {}, h1);
    const current = await page.$eval('nav[aria-label=Admin] a[aria-current=page]', (a) => a.textContent.trim());
    assert(current === label, `active item is "${current}" on ${p}`);
  }
});

await test('Admin access and roles removed; old address redirects to dashboard', async () => {
  await go('/admin/access');
  await page.waitForFunction(() => location.pathname === '/admin');
  const body = await page.$eval('body', (b) => b.innerText);
  for (const word of ['Admin access', 'Super admin', 'Role permissions', 'Invite admin', 'Add conference']) assert(!body.includes(word), `"${word}" still shown`);
});

const setInputValue = (sel, v) =>
  page.$eval(
    sel,
    (el, val) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    v,
  );
const totalConferences = () =>
  page.$$eval('main p', (ps) => {
    const label = ps.find((p) => p.textContent === 'Total conferences');
    return label ? parseInt(label.parentElement.nextElementSibling.textContent, 10) : NaN;
  });

await test('Admin: manual conference creation appears in the list and dashboard', async () => {
  await go('/admin/conferences/new');
  await page.type('#f-title', 'Smoke Test Conference on Law');
  await page.type('#f-acronym', 'STCL-27');
  await page.select('#f-topic', 'law');
  await setInputValue('#f-startDate', '2027-06-10');
  await setInputValue('#f-endDate', '2027-06-11');
  await page.type('#f-city', 'Chennai');
  await page.type('#f-country', 'India');
  await page.keyboard.press('Enter');
  await page.type('#f-description', 'Created by the smoke test.');
  const [submit] = await page.$$('xpath/.//button[contains(., "Create conference")]');
  await submit.click();
  await page.waitForFunction(() => location.pathname === '/admin/conferences');
  await page.waitForFunction(() => document.querySelector('tbody')?.innerText.includes('STCL-27'));
  await (await sidebarLink('Dashboard')).click();
  await page.waitForFunction(() => document.querySelector('main h1')?.textContent === 'Dashboard');
  const n = await totalConferences();
  assert(n === 28, `dashboard total is ${n}, expected 28`);
});

const tmp = mkdtempSync(join(tmpdir(), 'icf-smoke-'));
const header = ['Conference Title', 'Short Form', 'Subject Area', 'Event Type', 'Format', 'Start Date', 'End Date', 'Start Time', 'Time Zone', 'Venue Name', 'Venue Address', 'City', 'State / Region', 'Country', 'Description', 'Early Registration Deadline', 'Final Registration Deadline', 'Paper Submission Deadline', 'Tags', 'Status', 'Featured'];
const row = (o) => header.map((h) => o[h] ?? '');
const baseRow = { 'Subject Area': 'Education', 'Start Date': '2027-08-10', 'End Date': '2027-08-11', City: 'Kyoto', Country: 'Japan', Description: 'Demo' };
const writeBook = (name, rows) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header, ...rows]), 'Conferences');
  const file = join(tmp, name);
  writeFileSync(file, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  return file;
};
const openBulk = async (reload = true) => {
  if (reload) await go('/admin/conferences');
  const [btn] = await page.$$('xpath/.//button[contains(., "Bulk upload (Excel)")]');
  await btn.click();
  await page.waitForFunction(() => document.querySelector('dialog[open]'));
};
const upload = async (file) => (await page.$('#bulk-file')).uploadFile(file);
const dialogText = () => page.$eval('dialog[open]', (d) => d.innerText);

await test('Admin bulk upload: template downloads with headers and instructions', async () => {
  await openBulk();
  const cdp = await page.createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: tmp });
  const [btn] = await page.$$('xpath/.//dialog[@open]//button[contains(., "Download Excel template")]');
  await btn.click();
  const file = join(tmp, 'icf-conference-upload-template.xlsx');
  for (let i = 0; i < 50 && !existsSync(file); i++) await sleep(100);
  assert(existsSync(file), 'template was not downloaded');
  const wb = XLSX.read(readFileSync(file));
  assert(wb.SheetNames.join() === 'Conferences,Instructions', `sheets: ${wb.SheetNames}`);
  const got = XLSX.utils.sheet_to_json(wb.Sheets.Conferences, { header: 1 })[0];
  assert(JSON.stringify(got) === JSON.stringify(header), 'template header mismatch');
});

await test('Admin bulk upload: more than 10 records is rejected', async () => {
  await openBulk();
  await upload(writeBook('eleven.xlsx', Array.from({ length: 11 }, (_, i) => row({ ...baseRow, 'Conference Title': `Bulk ${i}`, 'Short Form': `BLK-${i}` }))));
  await page.waitForFunction(() => document.querySelector('#bulk-file-error')?.textContent.includes('The limit is 10'));
});

await test('Admin bulk upload: wrong file type is rejected', async () => {
  await openBulk();
  const csv = join(tmp, 'list.csv');
  writeFileSync(csv, 'a,b\n1,2');
  await upload(csv);
  await page.waitForFunction(() => document.querySelector('#bulk-file-error')?.textContent.includes('.xlsx'));
});

await test('Admin bulk upload: preview validates, cancel keeps list, confirm imports valid rows', async () => {
  const file = writeBook('mixed.xlsx', [
    row({ ...baseRow, 'Conference Title': 'Bulk Education One', 'Short Form': 'BEO-27' }),
    row({ ...baseRow, 'Conference Title': 'Bulk Education Two', 'Short Form': 'BET-27', Format: 'Online', Status: 'Published', Featured: 'Yes' }),
    row({ ...baseRow, 'Conference Title': 'Duplicate of existing', 'Short Form': 'ICICGB-26' }),
    row({ ...baseRow, 'Conference Title': 'Repeat in file', 'Short Form': 'BEO-27' }),
    row({ ...baseRow, 'Conference Title': 'Bad dates', 'Short Form': 'BAD-27', 'Start Date': '2027-13-40' }),
    row({ ...baseRow, 'Conference Title': 'Ends before start', 'Short Form': 'EBS-27', 'End Date': '2027-08-01' }),
    row({ ...baseRow, 'Conference Title': 'Unknown subject', 'Short Form': 'UNK-27', 'Subject Area': 'Astrology' }),
    row({ 'Conference Title': 'Missing fields', 'Short Form': 'MIS-27' }),
  ]);
  await openBulk();
  const before = (await page.$$('tbody tr')).length;
  await upload(file);
  await page.waitForFunction(() => document.querySelector('dialog[open]')?.innerText.includes('2 ready to import'));
  const preview = await dialogText();
  for (const msg of ['6 with errors', 'already exists in the conference list', 'is repeated (also on row 2)', 'is not a valid date', 'End Date must be on or after', 'is not one of the ten ICF subject areas', 'City is required']) {
    assert(preview.includes(msg), `preview missing: ${msg}`);
  }
  const [cancel] = await page.$$('xpath/.//dialog[@open]//button[contains(., "Cancel import")]');
  await cancel.click();
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  assert((await page.$$('tbody tr')).length === before, 'cancel changed the list');

  await openBulk(false);
  await upload(file);
  await page.waitForFunction(() => document.querySelector('dialog[open]')?.innerText.includes('2 ready to import'));
  const [ok] = await page.$$('xpath/.//dialog[@open]//button[contains(., "Import 2 conferences")]');
  await ok.click();
  await page.waitForFunction(() => document.querySelector('dialog[open] h2')?.textContent === 'Import summary');
  const summary = await dialogText();
  assert(summary.includes('2 imported') && summary.includes('6 rejected') && summary.includes('Row 4'), 'summary content wrong');
  const [done] = await page.$$('xpath/.//dialog[@open]//button[normalize-space(.)="Done"]');
  await done.click();
  await page.waitForFunction((n) => document.querySelectorAll('tbody tr').length === n + 2, {}, before);
  const list = await page.$eval('tbody', (t) => t.innerText);
  assert(list.includes('BEO-27') && list.includes('BET-27') && !list.includes('UNK-27'), 'imported rows not in list');
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
