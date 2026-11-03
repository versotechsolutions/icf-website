# Phase 1 build and testing report

**Date:** 3 November 2026
**Environment:** Windows 11, Node 24.16, Chrome (headless, via puppeteer-core)
**Build tested:** the production build (`npm run build` + `npm run preview`)

## 1. Build

| Check | Result |
|---|---|
| `tsc -b` (strict TypeScript, no unused locals/params) | Pass, 0 errors |
| `vite build` | Pass |
| Main bundle (public site) | 418 kB (121 kB gzip) |
| Admin area | Code-split into separate chunks (~2–3 kB gzip per page); not loaded by public visitors |
| CSS | 65 kB (12 kB gzip) |

## 2. Route and console check (`npm run screenshots`)

34 routes × 2 viewports (desktop 1440×900, mobile 390×844 @2x) = **68 page loads**. Routes covered: every public page, country and topic listing variants, an empty-result country, two conference detail pages, a policy page, the 404 page, the admin login and all 10 admin screens.

**Result:** 68/68 loaded with **0 console errors, 0 page errors and 0 failed requests.**

## 3. Interaction tests (`npm run test:smoke`), 21/21 passed

| # | Test |
|---|---|
| 1 | Home conference finder submits a subject filter to the listing |
| 2 | Searchable country combobox (type + Enter) navigates to the `/conferences/japan` SEO page |
| 3 | Empty state appears for a country with no conferences |
| 4 | Pagination moves to page 2 (URL and current-page state) |
| 5 | Month filter narrows the results |
| 6 | Contact form: empty submit shows the error summary and marks ≥6 invalid fields; valid input succeeds |
| 7 | Contact form: invalid email shows the format message on blur |
| 8 | Registration: clicking a fee pre-fills category and period; paper title appears and is required for author categories; summary shows $349.00 |
| 9 | Registration: complete valid submission shows confirmation with the correct fee |
| 10 | Call for papers: theme search ("blockchain") returns 1 match |
| 11 | FAQ: accordion expands; search filters questions |
| 12 | Download brochure: modal opens, validates, closes with Esc |
| 13 | Awards: tabs switch content |
| 14 | Desktop dropdown navigation opens and navigates |
| 15 | Mobile menu opens, expands a group, navigates and closes |
| 16 | Admin login validates, then opens the dashboard |
| 17 | Admin: delete conference with confirmation removes the row |
| 18 | Admin: conference form rejects an end date before the start date |
| 19 | Admin: "Mark received" on a pending bank transfer updates status |
| 20 | **Internal link crawl:** 48 internal URLs reached from 8 entry pages, 0 resolve to the 404 page |
| 21 | No console errors during the whole run |

## 4. Responsive review

Full-page screenshots were reviewed at desktop, tablet (820px, home) and mobile widths. Issues found and fixed during review:

| Issue | Fix |
|---|---|
| Header logo wordmark unreadable at header size | Header uses an emblem + typeset name lockup; the full logo stays in footer and admin |
| Native select rendered taller and with a double chevron | Custom select styling in `field-input` |
| Desktop nav labels wrapped after the logo change | `whitespace-nowrap`, shorter "Conference info" label |
| Email addresses broke mid-word in footer and contact blocks | Break opportunity after `@`; contact block uses a wrapping flex row |
| Contact form and admin dashboard overflowed horizontally on mobile | Grid children allowed to shrink (`min-width: 0`); wide tables scroll inside their panel |
| Hovering a dropdown and then clicking closed it again (found by test 14) | Mouse clicks keep the menu open; keyboard Enter/Space toggles |
| Admin sidebar background stopped at viewport height | Sidebar column painted full height, inner panel sticky |
| Sample registration dates later than today | Sample data limited to May–October 2026 |
| About page "Core values" heading sat at the bottom of its column | Top-aligned and sticky |

## 5. Accessibility spot checks

- Keyboard: skip link; all menus, the combobox, accordion, tabs and dialogs are operable by keyboard; visible focus ring.
- Forms: every input has a label; errors are linked by `aria-describedby`; an error summary uses `role="alert"`; focus moves to the first invalid field.
- Status is never shown by colour alone (icon + label badges); charts have a table view.
- Reduced motion respected.

## 6. Not tested in Phase 1

Cross-browser runs beyond Chromium (Safari, Firefox), screen-reader walkthroughs, Lighthouse audits on a hosted URL, and any backend behaviour (none exists yet).

## 7. Reference website

`igaeglobal.com` returned HTTP 403 to automated requests from the development environment, so it could not be reviewed directly. The information architecture follows the client's documents, which closely mirror that site's structure.
