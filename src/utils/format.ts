const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d };
};

/** "14–15 Dec 2026" or "30 Mar – 1 Apr 2027" */
export function formatDateRange(start: string, end: string) {
  const a = parts(start);
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) return a.d === b.d ? `${a.d} ${MONTHS[a.m]} ${a.y}` : `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`;
  return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

export const dayOf = (iso: string) => String(parts(iso).d);
export const monthShort = (iso: string) => MONTHS[parts(iso).m];
export const yearOf = (iso: string) => String(parts(iso).y);

/** "2027-03" -> "March 2027" */
export function formatMonthKey(key: string) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

export const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
