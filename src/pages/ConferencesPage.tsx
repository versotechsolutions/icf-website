import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarX2, SlidersHorizontal, X } from 'lucide-react';
import { countries, countryBySlug, popularCountryCodes, countryByCode } from '@/data/countries';
import { topics, topicBySlug } from '@/data/topics';
import { conferenceSnapshot, listConferences } from '@/services/conferences';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { Notice } from '@/components/ui/Notice';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { CountryCombobox } from '@/components/forms/CountryCombobox';
import { ConferenceRow } from '@/components/conference/ConferenceRow';
import { formatMonthKey } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Conference, Paged } from '@/types';

function Skeleton() {
  return (
    <div aria-hidden className="divide-y divide-rule">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex animate-pulse gap-5 py-5">
          <div className="h-[5.25rem] w-[4.5rem] rounded-[var(--radius-sm)] bg-navy-50" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-3 w-40 rounded bg-navy-50" />
            <div className="h-5 w-3/4 rounded bg-navy-50" />
            <div className="h-3 w-1/2 rounded bg-navy-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ConferencesPage() {
  const { country: countrySlug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const country = countryBySlug(countrySlug);

  const keyword = params.get('q') ?? '';
  const topic = params.get('topic') ?? '';
  const month = params.get('month') ?? '';
  const continent = params.get('continent') ?? '';
  const page = Number(params.get('page') ?? '1') || 1;

  const [draftKeyword, setDraftKeyword] = useState(keyword);
  const [result, setResult] = useState<Paged<Conference> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setDraftKeyword(keyword), [keyword]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    listConferences({ keyword, topic, month, continent, country: countrySlug, page }).then((r) => {
      if (live) {
        setResult(r);
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [keyword, topic, month, continent, countrySlug, page]);

  const topicName = topicBySlug(topic)?.name;
  const heading = country ? `Conferences in ${country.name}` : topicName ? `${topicName} conferences` : 'Upcoming conferences';
  usePageMeta(heading, `Browse upcoming international academic conferences${country ? ` in ${country.name}` : ''}${topicName ? ` in ${topicName}` : ''}. Filter by country, month, subject and keyword.`);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };
  const setCountry = (slug: string) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    const qs = next.toString();
    navigate(`/conferences${slug ? `/${slug}` : ''}${qs ? `?${qs}` : ''}`);
  };
  const clearAll = () => navigate('/conferences');

  const months = useMemo(() => conferenceSnapshot.months(), []);
  const popular = popularCountryCodes.map((c) => countryByCode(c)!).filter(Boolean);
  const activeCount = [keyword, topic, month, continent, countrySlug].filter(Boolean).length;

  const crumbs = country ? [{ label: 'Upcoming conferences', to: '/conferences' }, { label: country.name }] : [{ label: 'Upcoming conferences' }];

  return (
    <>
      <PageHeader
        title={heading}
        crumbs={crumbs}
        intro="Search international conferences, seminars, workshops and symposiums by country, month, subject area or keyword."
      />

      {/* Popular countries */}
      <section aria-label="Popular countries" className="border-b border-rule bg-white">
        <Container className="flex items-center gap-4 overflow-x-auto py-4">
          <span className="shrink-0 text-sm font-semibold text-muted">Popular countries</span>
          <ul className="flex gap-2">
            {popular.map((c) => (
              <li key={c.code}>
                <Link
                  to={`/conferences/${c.slug}`}
                  aria-current={c.slug === countrySlug ? 'page' : undefined}
                  className={cn(
                    'inline-flex whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold',
                    c.slug === countrySlug ? 'border-navy-900 bg-navy-900 text-white' : 'border-rule text-navy-900 hover:border-navy-900',
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        {/* Filters */}
        <div>
          <Button variant="secondary" className="w-full lg:hidden" aria-expanded={filtersOpen} aria-controls="filters" onClick={() => setFiltersOpen((o) => !o)}>
            <SlidersHorizontal aria-hidden className="size-4" />
            {filtersOpen ? 'Hide filters' : `Show filters${activeCount ? ` (${activeCount})` : ''}`}
          </Button>
          <form
            id="filters"
            role="search"
            aria-label="Filter conferences"
            onSubmit={(e) => {
              e.preventDefault();
              setParam('q', draftKeyword.trim());
            }}
            className={cn('mt-4 space-y-6 lg:sticky lg:top-28 lg:mt-0 lg:block', !filtersOpen && 'hidden')}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Filter</h2>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="text-sm font-semibold text-globe-700 hover:underline">
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="flt-q" className="text-[0.92rem] font-semibold text-navy-900">
                Keyword
              </label>
              <div className="flex gap-2">
                <input id="flt-q" className="field-input" placeholder="Title, city or acronym" value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)} />
              </div>
              <Button type="submit" size="sm" className="mt-1 self-start">
                Search
              </Button>
            </div>
            <CountryCombobox label="Country" value={countrySlug ?? ''} onChange={setCountry} placeholder="All countries" options={countries} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="flt-month" className="text-[0.92rem] font-semibold text-navy-900">
                Month
              </label>
              <select id="flt-month" className="field-input" value={month} onChange={(e) => setParam('month', e.target.value)}>
                <option value="">Any month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthKey(m)}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="mb-2 text-[0.92rem] font-semibold text-navy-900">Conference category</legend>
              <div className="space-y-1">
                <label className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1 text-[0.95rem] hover:bg-mist">
                  <input type="radio" name="topic" checked={!topic} onChange={() => setParam('topic', '')} className="size-4 accent-navy-900" />
                  All subject areas
                </label>
                {topics.map((t) => (
                  <label key={t.slug} className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1 text-[0.95rem] hover:bg-mist">
                    <input type="radio" name="topic" checked={topic === t.slug} onChange={() => setParam('topic', t.slug)} className="size-4 accent-navy-900" />
                    {t.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </form>
        </div>

        {/* Results */}
        <section aria-labelledby="results-heading" aria-busy={loading}>
          <Notice tone="sample">Results below are development sample data. In Phase 2 this list will load from ICF's conference database.</Notice>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-navy-900 pb-3">
            <h2 id="results-heading" className="font-serif text-xl" aria-live="polite">
              {loading ? 'Loading conferences…' : `${result?.total ?? 0} conference${result?.total === 1 ? '' : 's'} found`}
            </h2>
            {(continent || keyword) && (
              <div className="flex flex-wrap gap-2">
                {continent && (
                  <button onClick={() => setParam('continent', '')} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-navy-900 hover:bg-navy-100">
                    {continent}
                    <X aria-label="Remove continent filter" className="size-3.5" />
                  </button>
                )}
                {keyword && (
                  <button onClick={() => setParam('q', '')} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-navy-900 hover:bg-navy-100">
                    "{keyword}"
                    <X aria-label="Remove keyword filter" className="size-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {loading && <Skeleton />}

          {!loading && result && result.items.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <CalendarX2 aria-hidden className="size-12 text-gold-500" strokeWidth={1.3} />
              <h3 className="mt-5 text-h3">No conferences match these filters</h3>
              <p className="mt-2 max-w-md text-muted">Try another month or country, or remove some filters to widen the search.</p>
              <Button variant="secondary" className="mt-6" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          )}

          {!loading && result && result.items.length > 0 && (
            <>
              <div className="divide-y divide-rule">
                {result.items.map((c) => (
                  <ConferenceRow key={c.id} c={c} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={result.page} totalPages={result.totalPages} onChange={(p) => {
                  const next = new URLSearchParams(params);
                  next.set('page', String(p));
                  setParams(next);
                  window.scrollTo({ top: 0 });
                }} />
              </div>
            </>
          )}
        </section>
      </Container>
    </>
  );
}
