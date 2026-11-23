import { CalendarDays, FileText, FileUp, Handshake, Lightbulb, MapPin, MonitorPlay, TrendingUp, Users } from 'lucide-react';
import { pillars } from '@/data/content';
import { countryByCode } from '@/data/countries';
import { topicBySlug } from '@/data/topics';
import { useSitePath } from '@/hooks/useEventSite';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { SampleTag } from '@/components/ui/Notice';
import { formatDateRange } from '@/utils/format';
import type { Conference } from '@/types';

const pillarIcons = [Users, Lightbulb, Handshake, TrendingUp];

/**
 * Conference banner shown at the top of every event site page, with the client-supplied ICF banner artwork as its
 * background. The conference title is the page heading only on the event home; inner pages have their own heading.
 */
export function EventBanner({ conference: conf, isHome }: { conference: Conference; isHome: boolean }) {
  const sitePath = useSitePath();
  const country = countryByCode(conf.countryCode);
  const topic = topicBySlug(conf.topicSlug);
  const Title = isHome ? 'h1' : 'p';

  const facts = [
    { icon: CalendarDays, label: 'Dates', value: formatDateRange(conf.startDate, conf.endDate) },
    { icon: MapPin, label: 'Location', value: `${conf.city}, ${country?.name}` },
    { icon: MonitorPlay, label: 'Format', value: conf.mode, note: conf.mode === 'Hybrid' ? 'Online + In person' : undefined },
  ];

  return (
    <section aria-label="Conference" className="relative overflow-hidden bg-navy-950 text-white">
      <picture>
        <source srcSet="/images/home-banner-900.webp 900w, /images/home-banner.webp 1774w" sizes="100vw" type="image/webp" />
        <img src="/images/home-banner.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-40" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-800/85 to-globe-700/30" aria-hidden />
      <Container className="relative py-12 sm:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-[var(--radius-sm)] border border-gold-400/70 px-2.5 py-1 font-serif text-lg font-semibold text-gold-300">{conf.acronym}</span>
          {topic && <span className="text-white/85">{topic.name}</span>}
          <SampleTag />
        </div>
        <Title className="mt-4 max-w-4xl text-left font-serif text-[1.85rem] font-bold leading-[1.15] tracking-[-0.01em] text-balance text-white sm:text-[2.35rem]">
          {conf.title}
        </Title>
        <span className="mt-5 block h-1 w-24 rounded-full bg-gold-400" aria-hidden />

        {/* Date, location and format cards (stacked below tablet width) */}
        <dl className="mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          {facts.map(({ icon: Icon, label, value, note }) => (
            <div key={label} className="flex items-center gap-4 rounded-[var(--radius-lg)] bg-white px-5 py-4 text-navy-900 shadow-[0_10px_30px_rgb(0_0_0/0.3)] ring-1 ring-white/70 md:gap-3 md:px-4 lg:gap-4 lg:px-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-globe-100 text-globe-700 lg:size-14">
                <Icon aria-hidden className="size-6 lg:size-7" strokeWidth={1.8} />
              </span>
              <div>
                <dt className="text-[0.8rem] font-bold uppercase tracking-wider text-globe-700">
                  {label}
                  {label !== 'Format' && <span className="sr-only"> (sample)</span>}
                </dt>
                <dd className="whitespace-nowrap text-[1.25rem] font-bold leading-tight md:text-[1.1rem] lg:text-[1.35rem]">{value}</dd>
                {note && <dd className="text-[0.92rem] font-medium text-globe-700">{note}</dd>}
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid max-w-5xl gap-4 md:grid-cols-3">
          <ButtonLink to={sitePath('/paper-submission')} variant="gold" size="lg" className="w-full bg-gradient-to-b from-gold-300 to-gold-500 shadow-[0_8px_22px_rgb(0_0_0/0.3)]">
            <FileUp aria-hidden className="size-5 shrink-0" />
            Submit Abstract / Paper
          </ButtonLink>
          <ButtonLink to={sitePath('/registration?category=attendee#fees')} variant="onDark" size="lg" className="w-full">
            <Users aria-hidden className="size-5 shrink-0" />
            Join as Attendee
          </ButtonLink>
          <ButtonLink to={sitePath('/call-for-papers')} variant="onDark" size="lg" className="w-full">
            <FileText aria-hidden className="size-5 shrink-0" />
            Call for Papers
          </ButtonLink>
        </div>

        {/* ICF highlights (Organization Home page Details.docx banner pillars) */}
        <ul className="mt-10 grid max-w-5xl grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-white/25">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <li key={p} className="flex items-center gap-3 px-2 lg:justify-center lg:px-4">
                <Icon aria-hidden className="size-8 shrink-0 text-white/90" strokeWidth={1.5} />
                <span className="text-[0.98rem] font-semibold leading-snug text-white/90">{p}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
