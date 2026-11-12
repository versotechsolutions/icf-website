/**
 * Excel bulk upload for Conference Management (frontend demo).
 * Column set follows the manual Add conference form, which itself follows the "Single/Bulk
 * Events Upload" list in ICF Admin Dashboard.docx within the agreed scope.
 * SheetJS is loaded on demand so it never enters the public site's bundle.
 */
import { countries } from '@/data/countries';
import { topics } from '@/data/topics';
import type { ConferenceMode, ConferenceStatus } from '@/types';
import { slugify, type AdminConference } from './AdminData';

export const MAX_RECORDS = 10;
export const MAX_FILE_BYTES = 1024 * 1024;
export const TEMPLATE_FILENAME = 'icf-conference-upload-template.xlsx';
const SHEET = 'Conferences';

const eventTypes = ['Conference', 'Seminar', 'Workshop', 'Symposium'];
const formats: ConferenceMode[] = ['In person', 'Hybrid', 'Online'];
const statuses: ConferenceStatus[] = ['Draft', 'Pending', 'Published', 'Completed'];

type Col = { key: string; header: string; required?: boolean; rule: string; example: string };

/** Template columns, in order. `header` is what the spreadsheet must contain. */
export const columns: Col[] = [
  { key: 'title', header: 'Conference Title', required: true, rule: 'Text, up to 200 characters', example: 'International Conference on Innovation and Competition in Global Banking' },
  { key: 'acronym', header: 'Short Form', required: true, rule: 'Letters, numbers and hyphens, 2–20 characters. Must be unique.', example: 'ICICGB-26' },
  { key: 'topic', header: 'Subject Area', required: true, rule: `One of: ${topics.map((t) => t.name).join('; ')}`, example: 'Business and Economics' },
  { key: 'eventType', header: 'Event Type', rule: `One of: ${eventTypes.join(', ')}. Default: Conference`, example: 'Conference' },
  { key: 'mode', header: 'Format', rule: `One of: ${formats.join(', ')}. Default: In person`, example: 'Hybrid' },
  { key: 'startDate', header: 'Start Date', required: true, rule: 'Date, YYYY-MM-DD (or an Excel date cell)', example: '2026-12-14' },
  { key: 'endDate', header: 'End Date', required: true, rule: 'Date, YYYY-MM-DD. On or after the start date', example: '2026-12-15' },
  { key: 'time', header: 'Start Time', rule: '24-hour time, HH:MM', example: '09:00' },
  { key: 'timezone', header: 'Time Zone', rule: 'IANA time zone, e.g. Asia/Kolkata', example: 'Asia/Tokyo' },
  { key: 'venueName', header: 'Venue Name', rule: 'Text', example: '' },
  { key: 'venueAddress', header: 'Venue Address', rule: 'Text', example: '' },
  { key: 'city', header: 'City', required: true, rule: 'Text', example: 'Nagoya' },
  { key: 'state', header: 'State / Region', rule: 'Text', example: '' },
  { key: 'country', header: 'Country', required: true, rule: 'Full country name (e.g. Japan) or 2-letter code (JP)', example: 'Japan' },
  { key: 'description', header: 'Description', required: true, rule: "Text. Shown as 'About the conference'", example: 'Brings together scholars, researchers and industry experts…' },
  { key: 'earlyDeadline', header: 'Early Registration Deadline', rule: 'Date, YYYY-MM-DD. Before the start date', example: '' },
  { key: 'finalDeadline', header: 'Final Registration Deadline', rule: 'Date, YYYY-MM-DD. Before the start date', example: '' },
  { key: 'submissionDeadline', header: 'Paper Submission Deadline', rule: 'Date, YYYY-MM-DD. Before the start date', example: '' },
  { key: 'tags', header: 'Tags', rule: 'Separate with commas', example: 'banking, finance' },
  { key: 'status', header: 'Status', rule: `One of: ${statuses.join(', ')}. Default: Draft`, example: 'Draft' },
  { key: 'featured', header: 'Featured', rule: 'Yes or No. Default: No', example: 'No' },
];

export type ParsedRow = {
  /** Spreadsheet row number, for error messages. */
  row: number;
  values: Record<string, string>;
  errors: string[];
  conference?: AdminConference;
};

export type ParseResult = { ok: true; rows: ParsedRow[] } | { ok: false; error: string };

const loadXlsx = () => import('xlsx');

/** Builds the .xlsx template (header-only data sheet + instructions sheet) and downloads it. */
export async function downloadTemplate() {
  const XLSX = await loadXlsx();
  const wb = XLSX.utils.book_new();
  const data = XLSX.utils.aoa_to_sheet([columns.map((c) => c.header)]);
  data['!cols'] = columns.map((c) => ({ wch: Math.max(14, c.header.length + 4) }));
  XLSX.utils.book_append_sheet(wb, data, SHEET);
  const help = XLSX.utils.aoa_to_sheet([
    ['How to use this template'],
    [`Fill in one conference per row on the "${SHEET}" sheet, starting on row 2. Keep the header row unchanged. Up to ${MAX_RECORDS} conferences per file.`],
    [],
    ['Column', 'Required', 'Format / allowed values', 'Example'],
    ...columns.map((c) => [c.header, c.required ? 'Yes' : 'No', c.rule, c.example]),
  ]);
  help['!cols'] = [{ wch: 28 }, { wch: 10 }, { wch: 90 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, help, 'Instructions');
  XLSX.writeFile(wb, TEMPLATE_FILENAME);
}

const isValidIsoDate = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Reads the uploaded workbook and validates every row.
 * File-level problems (wrong type, too large, missing columns, no rows, more than 10 rows)
 * reject the whole file; row-level problems are reported per row in the preview.
 */
export async function parseConferenceFile(file: File, existing: AdminConference[]): Promise<ParseResult> {
  if (!/\.(xlsx|xls)$/i.test(file.name)) return { ok: false, error: 'Choose an Excel file (.xlsx or .xls). Download the template to get the right format.' };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: 'The file is larger than 1 MB. Upload up to 10 conferences per file.' };

  const XLSX = await loadXlsx();
  let grid: unknown[][];
  try {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const ws = wb.Sheets[SHEET] ?? wb.Sheets[wb.SheetNames[0]];
    grid = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: '', blankrows: false });
  } catch {
    return { ok: false, error: 'The file could not be read. Check that it is a valid Excel workbook.' };
  }

  const header = (grid[0] ?? []).map((h) => String(h).trim().toLowerCase());
  const index: Record<string, number> = {};
  columns.forEach((c) => (index[c.key] = header.indexOf(c.header.toLowerCase())));
  const missing = columns.filter((c) => c.required && index[c.key] < 0).map((c) => c.header);
  if (missing.length) return { ok: false, error: `Required column${missing.length > 1 ? 's are' : ' is'} missing: ${missing.join(', ')}. Use the downloaded template.` };

  // Cell → text, converting Excel date/time serial numbers.
  const cellText = (key: string, v: unknown): string => {
    if (typeof v === 'number' && /date|deadline/i.test(key)) {
      const d = XLSX.SSF.parse_date_code(v);
      return d ? `${d.y}-${pad(d.m)}-${pad(d.d)}` : String(v);
    }
    if (typeof v === 'number' && key === 'time') {
      const d = XLSX.SSF.parse_date_code(v);
      return d ? `${pad(d.H)}:${pad(d.M)}` : String(v);
    }
    return String(v ?? '').trim();
  };

  const body = grid
    .slice(1)
    .map((cells, i) => ({ row: i + 2, cells }))
    .filter(({ cells }) => cells.some((v) => String(v ?? '').trim() !== ''));

  if (!body.length) return { ok: false, error: 'No conference records were found. Add at least one row below the header.' };
  if (body.length > MAX_RECORDS) return { ok: false, error: `This file has ${body.length} conference records. The limit is ${MAX_RECORDS} per file: split it into smaller files.` };

  const existingAcronyms = new Set(existing.map((c) => c.acronym.toLowerCase()));
  const existingTitleDates = new Set(existing.map((c) => `${c.title.toLowerCase()}|${c.startDate}`));
  const seenAcronyms = new Map<string, number>();
  const seenTitleDates = new Map<string, number>();
  const stamp = Date.now().toString(36);

  const rows: ParsedRow[] = body.map(({ row, cells }) => {
    const values: Record<string, string> = {};
    columns.forEach((c) => (values[c.key] = index[c.key] >= 0 ? cellText(c.key, cells[index[c.key]]) : ''));
    const errors: string[] = [];

    columns.forEach((c) => c.required && !values[c.key] && errors.push(`${c.header} is required.`));

    if (values.title.length > 200) errors.push('Conference Title must be 200 characters or fewer.');
    if (values.acronym && !/^[A-Za-z0-9-]{2,20}$/.test(values.acronym)) errors.push('Short Form may only use letters, numbers and hyphens (2–20 characters).');

    const topic = values.topic ? topics.find((t) => t.name.toLowerCase() === values.topic.toLowerCase() || t.slug === values.topic.toLowerCase()) : undefined;
    if (values.topic && !topic) errors.push(`Subject Area "${values.topic}" is not one of the ten ICF subject areas.`);

    const country = values.country ? countries.find((c) => c.name.toLowerCase() === values.country.toLowerCase() || c.code === values.country.toUpperCase()) : undefined;
    if (values.country && !country) errors.push(`Country "${values.country}" was not recognised.`);

    const pick = <T extends string>(key: string, label: string, allowed: readonly T[], fallback: T): T => {
      if (!values[key]) return fallback;
      const hit = allowed.find((a) => a.toLowerCase() === values[key].toLowerCase());
      if (!hit) errors.push(`${label} must be one of: ${allowed.join(', ')}.`);
      return hit ?? fallback;
    };
    const eventType = pick('eventType', 'Event Type', eventTypes, 'Conference');
    const mode = pick('mode', 'Format', formats, 'In person');
    const status = pick('status', 'Status', statuses, 'Draft');
    const featured = pick('featured', 'Featured', ['Yes', 'No'], 'No');

    for (const key of ['startDate', 'endDate', 'earlyDeadline', 'finalDeadline', 'submissionDeadline']) {
      if (values[key] && !isValidIsoDate(values[key])) errors.push(`${columns.find((c) => c.key === key)!.header} "${values[key]}" is not a valid date (use YYYY-MM-DD).`);
    }
    const datesOk = isValidIsoDate(values.startDate) && isValidIsoDate(values.endDate);
    if (datesOk && values.endDate < values.startDate) errors.push('End Date must be on or after the Start Date.');
    if (isValidIsoDate(values.startDate)) {
      for (const key of ['earlyDeadline', 'finalDeadline', 'submissionDeadline']) {
        if (isValidIsoDate(values[key]) && values[key] > values.startDate) errors.push(`${columns.find((c) => c.key === key)!.header} must be before the Start Date.`);
      }
    }
    if (values.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)) errors.push('Start Time must be in 24-hour HH:MM format.');

    // Basic duplicate checks: short form, and title + start date, against the list and within the file.
    const acr = values.acronym.toLowerCase();
    if (acr) {
      if (existingAcronyms.has(acr)) errors.push(`Short Form "${values.acronym}" already exists in the conference list.`);
      else if (seenAcronyms.has(acr)) errors.push(`Short Form "${values.acronym}" is repeated (also on row ${seenAcronyms.get(acr)}).`);
      else seenAcronyms.set(acr, row);
    }
    const td = `${values.title.toLowerCase()}|${values.startDate}`;
    if (values.title && values.startDate) {
      if (existingTitleDates.has(td)) errors.push('A conference with this title and start date already exists.');
      else if (seenTitleDates.has(td)) errors.push(`Same title and start date as row ${seenTitleDates.get(td)}.`);
      else seenTitleDates.set(td, row);
    }

    const conference: AdminConference | undefined =
      errors.length || !topic || !country
        ? undefined
        : {
            id: `import-${stamp}-${row}`,
            slug: slugify(values.acronym),
            title: values.title,
            acronym: values.acronym.toUpperCase(),
            topicSlug: topic.slug,
            countryCode: country.code,
            city: values.city,
            startDate: values.startDate,
            endDate: values.endDate,
            mode,
            status,
            featured: featured === 'Yes',
            isSample: true,
            addedInSession: true,
            details: { ...values, eventType, topic: topic.slug, country: country.name },
          };
    return { row, values, errors, conference };
  });

  return { ok: true, rows };
}
