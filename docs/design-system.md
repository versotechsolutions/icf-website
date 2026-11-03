# ICF academic design system

The design follows the `frontend-design` skill process: a token plan first, a review against the brief, then building, then critique from screenshots.

## Direction

International Conference Forum is a conference *discovery* platform for researchers. The design should read like a serious academic institution: journal-like typography, a navy and white foundation, and gold used the way a university uses it (rules, markers, seals), never as a fill colour on large areas.

**One bold element:** gold orbital linework taken from the swoosh around the globe in the ICF logo. It draws in once on the home hero (the single orchestrated motion) and appears faintly in page headers. Everything else is quiet.

**Changes made at the review stage**, rejecting template defaults:
- A centred headline over a darkened full-bleed photo → an asymmetric split hero: typographic navy panel on the left, the client's own conference photograph on the right, and the conference finder bridging the two.
- A row of invented statistics → removed; no real statistics were supplied.
- Ten identical icon cards for topics → a two-column *subject index* (catalogue style) showing real theme counts.
- Numbered markers everywhere → used only for real sequences (peer review, joining steps, manuscript structure, registration steps).
- All-caps eyebrow labels → none. Sentence case throughout.

## Tokens (`src/styles/index.css`)

### Colour

| Token | Hex | Role |
|---|---|---|
| `navy-900` Forum Navy | `#0E2347` | Primary brand, hero and panels, primary buttons |
| `navy-950` | `#081630` | Utility bar, admin sidebar |
| `globe-600` Globe Blue | `#1F5BB5` | Links, icons, chart bars (from the logo globe) |
| `gold-500` Laurel Gold | `#C8962E` | Hairline rules, markers, primary CTA on navy |
| `gold-700` | `#8A6414` | Gold used as text on white (meets AA contrast) |
| `mist` | `#F2F5F9` | Cool alternate section background |
| `ink` | `#16233A` | Body text |
| `muted` | `#4D5B72` | Secondary text (AA on white and mist) |
| `rule` | `#D9E0EA` | Dividers and borders |

Status colours (`success`, `warning`, `danger`) are reserved for state and always paired with an icon and a label.

### Typography

- **Source Serif 4** (variable, self-hosted): headings, figures, pull quotes. It is scholarly and has optical sizing, and it echoes the classical serif of the logo wordmark.
- **Public Sans** (variable, self-hosted): body text and UI. It is an institutional typeface designed for accessibility.
- Scale (major third, 17px body): display 56 / h1 44 / h2 34 / h3 24, reduced on mobile. Body line-height 1.6, long serif prose 1.75. Line length ≤ 68ch.

### Shape and depth

Radii 3 / 6 / 10px by hierarchy (controls / panels / large panels). There are only two shadows: `lift` for cards and timeline items, and `panel` for floating elements (finder, menus, dialogs).

## Layout

- 1200px content width, left-aligned. Interior pages use a compact header (breadcrumb, title, one paragraph), not an empty hero.
- Event pages (call for papers, submission, registration, programme, FAQ, venue, travel, video conferencing, invitation letter) use `EventInfoLayout`: a content column plus the sticky **Quick links** panel required by the client.
- Each page uses a layout suited to its content: definition lists for guidelines, a document-styled letter for the invitation letter, a time-rail timeline for the programme, tabs for awards, a catalogue for topics, and an accordion for the FAQ.

## Components

| Component | Path |
|---|---|
| Button / ButtonLink (primary, gold, secondary, ghost, onDark) | `src/components/ui/Button.tsx` |
| SectionHeading (gold rule + serif title) | `src/components/ui/SectionHeading.tsx` |
| PageHeader, Breadcrumbs, Container | `src/components/ui/` |
| Notice / SampleTag (sample, pending, info) | `src/components/ui/Notice.tsx` |
| Accordion, Modal (native `<dialog>`), Pagination | `src/components/ui/` |
| Form fields with accessible errors; CountryCombobox (ARIA combobox) | `src/components/forms/` |
| ConferenceRow + DateTile, TopicIcon, QuickLinks | `src/components/conference/` |
| Header (utility bar, dropdowns, mobile drawer), Footer, ContactBlock | `src/components/layout/` |
| Admin: Panel, StatCard, StatusBadge, Table, SegmentedFilter, ColumnChart, BarList, Toast | `src/admin/components/` |

## Accessibility floor

- Skip link; visible gold focus ring; semantic landmarks; `aria-current` in navigation.
- Forms: labels, required markers, inline errors linked by `aria-describedby`, an error summary, and focus moved to the first invalid field.
- Combobox, tabs, accordion and dialog follow WAI-ARIA patterns. Keyboard toggles the dropdowns; Esc closes menus and dialogs.
- `prefers-reduced-motion` disables the line-draw and transitions.
- Charts: single hue validated against the surface with the dataviz validator; tooltip on hover; every chart has a table view; status is never shown by colour alone.
