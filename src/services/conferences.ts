/**
 * Conference data access.
 *
 * Phase 1: reads local sample data (no network, so results are immediate).
 * Phase 2: replace the bodies of these functions with API calls (e.g. GET /api/conferences?country=in&page=2).
 * UI components only depend on these function signatures, not on where the data comes from.
 */
import { sampleConferences } from '@/data/conferences.sample';
import { countryByCode, countryBySlug } from '@/data/countries';
import type { Conference, ConferenceQuery, Country, Paged } from '@/types';

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Conferences visible on the public site: published and not yet finished. */
const publicConferences = () =>
  sampleConferences
    .filter((c) => c.status === 'Published' && c.endDate >= todayIso())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

export function filterConferences(list: Conference[], q: ConferenceQuery): Conference[] {
  const keyword = q.keyword?.trim().toLowerCase();
  const countryCode = q.country ? (countryBySlug(q.country)?.code ?? q.country.toUpperCase()) : undefined;
  return list.filter((c) => {
    if (q.topic && c.topicSlug !== q.topic) return false;
    if (countryCode && c.countryCode !== countryCode) return false;
    if (q.month && !c.startDate.startsWith(q.month)) return false;
    if (q.continent && countryByCode(c.countryCode)?.continent !== q.continent) return false;
    if (keyword) {
      const hay = `${c.title} ${c.acronym} ${c.city} ${countryByCode(c.countryCode)?.name ?? ''}`.toLowerCase();
      if (!hay.includes(keyword)) return false;
    }
    return true;
  });
}

export async function listConferences(q: ConferenceQuery = {}): Promise<Paged<Conference>> {
  const pageSize = q.pageSize ?? 8;
  const all = filterConferences(publicConferences(), q);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const page = Math.min(Math.max(1, q.page ?? 1), totalPages);
  return {
    items: all.slice((page - 1) * pageSize, page * pageSize),
    total: all.length,
    page,
    pageSize,
    totalPages,
  };
}

export async function getConference(slug: string): Promise<Conference | undefined> {
  return sampleConferences.find((c) => c.slug === slug);
}

/** Synchronous helpers for static sections (homepage counts, month options). */
export const conferenceSnapshot = {
  upcoming: (limit?: number) => publicConferences().slice(0, limit),
  countByTopic: (slug: string) => publicConferences().filter((c) => c.topicSlug === slug).length,
  months: () => Array.from(new Set(publicConferences().map((c) => c.startDate.slice(0, 7)))),
  countriesInUse: () => Array.from(new Set(publicConferences().map((c) => c.countryCode))),
  /** Countries that have at least one listed conference, A to Z: the options for the search filters. */
  countriesWithConferences: (): Country[] =>
    conferenceSnapshot
      .countriesInUse()
      .map((code) => countryByCode(code))
      .filter((c): c is Country => Boolean(c))
      .sort((a, b) => a.name.localeCompare(b.name)),
};
