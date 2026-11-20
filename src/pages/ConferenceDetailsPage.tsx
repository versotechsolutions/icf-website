import { Link } from 'react-router-dom';
import { Building2, CalendarDays, FileDown, FileText, Globe2, MapPin, MonitorPlay, Tag } from 'lucide-react';
import { agendaHighlights, exampleVenue } from '@/data/content';
import { countryByCode } from '@/data/countries';
import { topicBySlug } from '@/data/topics';
import { useEventSite, useSitePath } from '@/hooks/useEventSite';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Notice, SampleTag } from '@/components/ui/Notice';
import { QuickLinks } from '@/components/conference/QuickLinks';
import { AboutConferenceSection, HighlightsSection, RegistrationInfoSection } from '@/components/conference/ConferenceSections';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { formatDateRange } from '@/utils/format';

const sections = [
  ['about', 'About the conference'],
  ['highlights', 'Highlights'],
  ['registration', 'Registration'],
  ['programme', 'Programme'],
  ['venue', 'Venue'],
  ['documents', 'Documents'],
] as const;

/** Home page of a conference's event site. */
export default function ConferenceDetailsPage() {
  const { conference: conf } = useEventSite()!;
  const sitePath = useSitePath();
  usePageMeta(`${conf.title} (${conf.acronym})`, `${conf.title}: about the conference, highlights, registration, programme and venue.`);

  const country = countryByCode(conf.countryCode);
  const topic = topicBySlug(conf.topicSlug);
  const isExample = conf.slug === 'icicgb-26';

  return (
    <>
      {/* Event banner using the client-supplied conference photograph */}
      <header className="relative overflow-hidden bg-navy-950 text-white">
        <picture>
          <source srcSet="/images/conference-hall-1400.webp" type="image/webp" />
          <img src="/images/og-image.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" aria-hidden />
        <Container className="relative py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[var(--radius-sm)] border border-gold-400/70 px-2.5 py-1 font-serif text-lg font-semibold text-gold-300">{conf.acronym}</span>
            {topic && <span className="text-white/75">{topic.name}</span>}
            <SampleTag />
          </div>
          <h1 className="mt-4 max-w-4xl text-h1 text-white">{conf.title}</h1>
          <dl className="mt-8 grid max-w-3xl gap-x-10 gap-y-4 text-[0.98rem] sm:grid-cols-3">
            <div className="flex gap-3">
              <CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <dt className="text-sm text-white/60">Dates (sample)</dt>
                <dd className="font-semibold">{formatDateRange(conf.startDate, conf.endDate)}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <dt className="text-sm text-white/60">Location (sample)</dt>
                <dd className="font-semibold">
                  {conf.city}, {country?.name}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MonitorPlay aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <dt className="text-sm text-white/60">Format</dt>
                <dd className="font-semibold">{conf.mode}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={sitePath('/registration')} variant="gold" size="lg">
              Register now
            </ButtonLink>
            <ButtonLink to={sitePath('/paper-submission')} variant="onDark" size="lg">
              Submit a paper
            </ButtonLink>
          </div>
        </Container>
      </header>

      {/* In-page navigation */}
      <nav aria-label="On this page" className="sticky top-[4.5rem] z-30 border-b border-rule bg-white">
        <Container className="flex gap-1 overflow-x-auto">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap border-b-2 border-transparent px-3 py-3.5 text-[0.92rem] font-semibold text-ink/75 hover:border-gold-500 hover:text-navy-900">
              {label}
            </a>
          ))}
        </Container>
      </nav>

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_19.5rem] lg:gap-14">
        <div className="min-w-0 space-y-16">
          <Notice tone="sample" title="Example conference page">
            {isExample
              ? 'ICICGB-26 and its description come from the client brief. Dates, city and format shown here are placeholders until ICF confirms them.'
              : 'This conference is development sample data used to demonstrate the layout.'}
          </Notice>

          <AboutConferenceSection conference={conf} />
          <HighlightsSection />
          <RegistrationInfoSection />

          <section id="programme" aria-labelledby="prog-h">
            <h2 id="prog-h" className="text-h2">
              Programme
            </h2>
            <span className="rule-gold mt-4" aria-hidden />
            <p className="mt-6 max-w-[62ch] text-muted">The detailed schedule for this conference will be published by ICF. Each ICF conference agenda typically includes:</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {agendaHighlights.map((a, i) => (
                <li key={a} className="flex items-baseline gap-3 rounded-[var(--radius-md)] border border-rule px-4 py-3">
                  <span className="font-serif font-semibold text-gold-700 tabular-nums">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
            <Link to={sitePath('/programme')} className="mt-5 inline-block font-semibold text-globe-700 hover:underline">
              View the indicative day schedule
            </Link>
          </section>

          <section id="venue" aria-labelledby="venue-h">
            <h2 id="venue-h" className="text-h2">
              Venue
            </h2>
            <span className="rule-gold mt-4" aria-hidden />
            {isExample ? (
              <div className="mt-6 flex gap-4 rounded-[var(--radius-lg)] border border-rule p-6">
                <Building2 aria-hidden className="size-7 shrink-0 text-globe-600" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-gold-700">Tentative venue (example from client brief)</p>
                  <address className="mt-1 not-italic leading-relaxed">
                    <span className="font-serif text-xl font-semibold text-navy-900">{exampleVenue.name}</span>
                    <br />
                    {exampleVenue.lines.join(', ')}
                  </address>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-muted">The venue will be announced by ICF. Check this page or the tentative venue page for updates.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
              <Link to={sitePath('/venue')} className="text-globe-700 hover:underline">
                Tentative venue
              </Link>
              <Link to={sitePath('/travel')} className="text-globe-700 hover:underline">
                Travel and accommodation
              </Link>
              <Link to={sitePath('/video-conferencing')} className="text-globe-700 hover:underline">
                Joining online
              </Link>
            </div>
          </section>

          <section id="documents" aria-labelledby="docs-h">
            <h2 id="docs-h" className="text-h2">
              Related documents
            </h2>
            <span className="rule-gold mt-4" aria-hidden />
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {[
                ['Conference brochure', 'Request through Download brochure in Quick links'],
                ['Sample abstract template', 'File to be supplied by ICF'],
                ['Sample full paper template', 'File to be supplied by ICF'],
              ].map(([name, note]) => (
                <li key={name} className="flex items-center gap-4 py-4">
                  <FileText aria-hidden className="size-6 shrink-0 text-globe-600" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="font-semibold text-navy-900">{name}</p>
                    <p className="text-sm text-muted">{note}</p>
                  </div>
                  <FileDown aria-hidden className="size-5 text-muted/50" />
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Tag aria-hidden className="size-4" /> {topic?.name}
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 aria-hidden className="size-4" /> {country?.continent}
            </span>
          </div>

          <ContactBlock closing="" showWebsite={false} />
        </div>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <QuickLinks />
        </div>
      </Container>
    </>
  );
}
