import { CalendarDays, MapPin, MonitorPlay } from 'lucide-react';
import { countryByCode } from '@/data/countries';
import { topicBySlug } from '@/data/topics';
import { useSitePath } from '@/hooks/useEventSite';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { SampleTag } from '@/components/ui/Notice';
import { formatDateRange } from '@/utils/format';
import type { Conference } from '@/types';

/**
 * Conference banner shown at the top of every event site page, with the client-supplied ICF banner artwork as its
 * background. The conference title is the page heading only on the event home; inner pages have their own heading.
 */
export function EventBanner({ conference: conf, isHome }: { conference: Conference; isHome: boolean }) {
  const sitePath = useSitePath();
  const country = countryByCode(conf.countryCode);
  const topic = topicBySlug(conf.topicSlug);
  const Title = isHome ? 'h1' : 'p';

  return (
    <section aria-label="Conference" className="relative overflow-hidden bg-navy-950 text-white">
      <picture>
        <source srcSet="/images/home-banner-900.webp 900w, /images/home-banner.webp 1774w" sizes="100vw" type="image/webp" />
        <img src="/images/home-banner.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-35" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" aria-hidden />
      <Container className="relative py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-[var(--radius-sm)] border border-gold-400/70 px-2.5 py-1 font-serif text-lg font-semibold text-gold-300">{conf.acronym}</span>
          {topic && <span className="text-white/75">{topic.name}</span>}
          <SampleTag />
        </div>
        <Title className="mt-4 max-w-4xl text-left font-serif text-h1 font-semibold tracking-[-0.01em] text-balance text-white">{conf.title}</Title>
        <dl className="mt-8 grid max-w-4xl gap-x-10 gap-y-5 text-[1.2rem] sm:grid-cols-3">
          <div className="flex gap-3">
            <CalendarDays aria-hidden className="mt-1 size-6 shrink-0 text-gold-400" />
            <div>
              <dt className="text-base text-white/65">Dates (sample)</dt>
              <dd className="font-semibold">{formatDateRange(conf.startDate, conf.endDate)}</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin aria-hidden className="mt-1 size-6 shrink-0 text-gold-400" />
            <div>
              <dt className="text-base text-white/65">Location (sample)</dt>
              <dd className="font-semibold">
                {conf.city}, {country?.name}
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <MonitorPlay aria-hidden className="mt-1 size-6 shrink-0 text-gold-400" />
            <div>
              <dt className="text-base text-white/65">Format</dt>
              <dd className="font-semibold">{conf.mode}</dd>
            </div>
          </div>
        </dl>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink to={sitePath('/paper-submission')} variant="gold" size="lg">
            Submit Abstract / Paper
          </ButtonLink>
          <ButtonLink to={sitePath('/registration?category=attendee#fees')} variant="onDark" size="lg">
            Join as Attendee
          </ButtonLink>
          <ButtonLink to={sitePath('/call-for-papers')} variant="onDark" size="lg">
            Call for Paper
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
