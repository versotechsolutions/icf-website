import { Link } from 'react-router-dom';
import { MapPin, MonitorPlay } from 'lucide-react';
import { countryByCode } from '@/data/countries';
import { topicBySlug } from '@/data/topics';
import { SampleTag } from '@/components/ui/Notice';
import { dayOf, formatDateRange, monthShort, yearOf } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Conference } from '@/types';

/** Calendar-style date tile — the recurring signature of a conference listing. */
export function DateTile({ iso, className }: { iso: string; className?: string }) {
  return (
    <div className={cn('flex w-[4.5rem] shrink-0 flex-col items-center overflow-hidden rounded-[var(--radius-sm)] border border-navy-100 bg-white text-center', className)} aria-hidden>
      <span className="w-full bg-navy-900 py-0.5 text-[0.72rem] font-semibold text-white">{monthShort(iso)}</span>
      <span className="pt-1 font-serif text-[1.75rem] font-semibold leading-none text-navy-900">{dayOf(iso)}</span>
      <span className="pb-1.5 pt-0.5 text-[0.72rem] text-muted">{yearOf(iso)}</span>
    </div>
  );
}

export function ConferenceRow({ c, compact = false }: { c: Conference; compact?: boolean }) {
  const country = countryByCode(c.countryCode);
  const topic = topicBySlug(c.topicSlug);
  return (
    <article className="group relative flex gap-5 py-5">
      <DateTile iso={c.startDate} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-gold-700">{c.acronym}</span>
          {topic && <span className="text-muted">{topic.name}</span>}
          {c.isSample && <SampleTag />}
        </div>
        <h3 className={cn('mt-1 font-serif font-semibold leading-snug text-navy-900', compact ? 'text-[1.1rem]' : 'text-[1.25rem]')}>
          <Link to={`/event/${c.slug}`} className="after:absolute after:inset-0 group-hover:text-globe-700">
            {c.title}
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.92rem] text-muted">
          <span>
            <span className="sr-only">Dates: </span>
            {formatDateRange(c.startDate, c.endDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5 text-globe-600" />
            {c.city}, {country?.name}
          </span>
          {c.mode !== 'In person' && (
            <span className="inline-flex items-center gap-1.5">
              <MonitorPlay aria-hidden className="size-3.5 text-globe-600" />
              {c.mode}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
