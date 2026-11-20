import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { countryByCode } from '@/data/countries';
import { SampleTag } from '@/components/ui/Notice';
import { dayOf, formatDateRange, monthShort, yearOf } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Conference } from '@/types';

/** Desk-calendar date block: two binder rings, day and month on navy, year on a darker strip. */
function CalendarBlock({ iso }: { iso: string }) {
  return (
    <div aria-hidden className="relative w-[4.25rem] shrink-0 self-start">
      <span className="absolute -top-1 left-3 z-10 size-2.5 rounded-full border-2 border-white bg-gold-400" />
      <span className="absolute -top-1 right-3 z-10 size-2.5 rounded-full border-2 border-white bg-gold-400" />
      <div className="overflow-hidden rounded-[var(--radius-sm)] text-center shadow-[var(--shadow-lift)]">
        <div className="bg-navy-800 px-1 pb-1.5 pt-3 text-white">
          <span className="block font-serif text-[1.65rem] font-semibold leading-none">{dayOf(iso)}</span>
          <span className="mt-1 block text-[0.72rem] font-semibold uppercase tracking-wider">{monthShort(iso)}</span>
        </div>
        <div className="bg-navy-950 py-1 text-[0.75rem] font-semibold text-gold-300">{yearOf(iso)}</div>
      </div>
    </div>
  );
}

/** Upcoming-events card for the conference listing grid; opens the conference's event site in a new tab. Use tone="white" on a grey section background. */
export function ConferenceCard({ c, tone = 'mist' }: { c: Conference; tone?: 'mist' | 'white' }) {
  const country = countryByCode(c.countryCode);
  return (
    <article
      className={cn(
        'group relative flex gap-4 rounded-[var(--radius-md)] border p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-100 hover:bg-white hover:shadow-[var(--shadow-lift)]',
        tone === 'white' ? 'border-rule bg-white' : 'border-transparent bg-mist',
      )}
    >
      <CalendarBlock iso={c.startDate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-4 text-[0.98rem] font-sans font-semibold leading-snug text-navy-900">
          <Link to={`/event/${c.slug}`} target="_blank" rel="noopener" className="after:absolute after:inset-0 group-hover:text-globe-700" title={c.title}>
            {c.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
        </h3>
        <p className="sr-only">Dates: {formatDateRange(c.startDate, c.endDate)}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-sm text-muted">
          <MapPin aria-hidden className="size-3.5 shrink-0 text-gold-500" />
          <span className="truncate">
            {c.city}, {country?.name}
          </span>
        </p>
        {c.isSample && <SampleTag className="mt-2 self-start" />}
      </div>
    </article>
  );
}
