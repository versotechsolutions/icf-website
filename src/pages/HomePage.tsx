import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Lightbulb, MessageSquareQuote, TrendingUp, Users } from 'lucide-react';
import { aboutIntro, mission, peerReviewSteps, pillars, vision } from '@/data/content';
import { continents, countryByCode } from '@/data/countries';
import { topics } from '@/data/topics';
import { site } from '@/data/site';
import { conferenceSnapshot } from '@/services/conferences';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { ConferenceFinder } from '@/components/home/ConferenceFinder';
import { ConferenceRow } from '@/components/conference/ConferenceRow';
import { TopicIcon } from '@/components/conference/TopicIcon';
import { cn } from '@/utils/cn';
import type { Continent } from '@/types';

const pillarIcons = [Users, Lightbulb, Handshake, TrendingUp];

function Hero() {
  return (
    <section className="relative">
      {/* Client-supplied home page banner (logo, tagline and the four pillars are part of the artwork) */}
      <h1 className="sr-only">International Conference Forum (ICF): {site.heroLine}</h1>
      <div className="bg-[#eaf2fb]">
        <picture>
          <source srcSet="/images/home-banner.webp" type="image/webp" />
          <img
            src="/images/home-banner.jpg"
            width={1093}
            height={436}
            alt="International Conference Forum. Connect, Share, Advance. Bringing researchers, professionals and innovators together for a better tomorrow: global networking, knowledge sharing, collaboration opportunities and impactful research."
            className="mx-auto block h-auto w-full max-w-[1600px]"
            fetchPriority="high"
          />
        </picture>
      </div>
      <Container className="relative mt-8 lg:-mt-14">
        <ConferenceFinder />
      </Container>
    </section>
  );
}

function Pillars() {
  return (
    <section aria-label="What ICF offers" className="border-b border-rule bg-white">
      <Container className="pb-10 pt-12 lg:pt-14">
        <ul className="grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-rule">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <li key={p} className="flex items-center gap-3 lg:justify-center lg:px-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-500/50 text-navy-800">
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
                <span className="font-semibold leading-tight text-navy-900">{p}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function AboutIntro() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="about-heading">
      <Container className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <SectionHeading id="about-heading" title="About International Conference Forum (ICF)" />
          <div className="prose-icf mt-6 text-[1.075rem] leading-[1.75] text-ink/90">
            {aboutIntro.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <ButtonLink to="/about" variant="secondary" className="mt-8">
            Read more about ICF
          </ButtonLink>
        </div>
        <div className="flex flex-col justify-center gap-10 lg:border-l lg:border-rule lg:pl-14">
          <figure>
            <figcaption className="font-serif text-h3 text-navy-900">Our mission</figcaption>
            <blockquote className="mt-3 border-l-2 border-gold-500 pl-5 text-lg leading-relaxed text-ink/85">{mission}</blockquote>
          </figure>
          <figure>
            <figcaption className="font-serif text-h3 text-navy-900">Our vision</figcaption>
            <blockquote className="mt-3 border-l-2 border-gold-500 pl-5 text-lg leading-relaxed text-ink/85">{vision}</blockquote>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function Upcoming() {
  const list = conferenceSnapshot.upcoming(6);
  return (
    <section className="bg-mist py-20 lg:py-24" aria-labelledby="upcoming-heading">
      <Container>
        <SectionHeading
          id="upcoming-heading"
          title="Upcoming conferences"
          intro="Find conferences by subject, country and month, then view the event details, call for papers and registration information."
          action={
            <ButtonLink to="/conferences" variant="primary">
              View all conferences
            </ButtonLink>
          }
        />
        <Notice tone="sample" className="mt-8">
          These listings are development sample data used to demonstrate the design. They will be replaced by ICF's live conference records.
        </Notice>
        <div className="mt-6 grid rounded-[var(--radius-lg)] border border-rule bg-white px-6 lg:grid-cols-2 lg:gap-x-12 lg:px-8">
          {[list.slice(0, Math.ceil(list.length / 2)), list.slice(Math.ceil(list.length / 2))].map((col, ci) => (
            <div key={ci} className={cn('divide-y divide-rule', ci === 0 && 'max-lg:border-b max-lg:border-rule')}>
              {col.map((c) => (
                <ConferenceRow key={c.id} c={c} compact />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TopicIndex() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="topics-heading">
      <Container>
        <SectionHeading
          id="topics-heading"
          title="Browse by topic"
          intro="Ten subject areas, each covering a defined set of research themes. Choose a subject to see its conferences."
          action={
            <Link to="/topics" className="link-underline font-semibold">
              Explore all research themes
            </Link>
          }
        />
        <ul className="mt-10 grid border-t border-navy-900 md:grid-cols-2 md:gap-x-12">
          {topics.map((t) => (
            <li key={t.slug} className="border-b border-rule">
              <Link to={`/conferences?topic=${t.slug}`} className="group flex items-center gap-5 py-5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                  <TopicIcon slug={t.slug} className="size-[1.375rem]" />
                </span>
                <span className="flex-1">
                  <span className="block font-serif text-[1.2rem] font-semibold text-navy-900 group-hover:text-globe-700">{t.name}</span>
                  <span className="text-sm text-muted">{t.subtopics.length} research themes</span>
                </span>
                <ArrowRight aria-hidden className="size-5 text-gold-500 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ByContinent() {
  const [active, setActive] = useState<Continent>('Asia');
  const inUse = conferenceSnapshot.countriesInUse().map((c) => countryByCode(c)!).filter(Boolean);
  const here = inUse.filter((c) => c.continent === active).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <section className="bg-navy-900 py-20 text-white lg:py-24" aria-labelledby="continent-heading">
      <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <SectionHeading id="continent-heading" tone="dark" title="Conference by continent" intro="Choose a region to see the countries currently hosting conferences." />
          <p className="mt-6 text-sm text-white/60">Country and conference counts shown here use development sample data.</p>
        </div>
        <div>
          <div role="tablist" aria-label="Continents" className="flex flex-wrap gap-2">
            {continents.map((c) => (
              <button
                key={c}
                role="tab"
                id={`tab-${c}`}
                aria-selected={c === active}
                aria-controls="continent-panel"
                onClick={() => setActive(c)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  c === active ? 'border-gold-400 bg-gold-400 text-navy-950' : 'border-white/25 text-white/85 hover:border-white/60',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div id="continent-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-8 border-t border-white/15 pt-8">
            {here.length ? (
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {here.map((c) => (
                  <li key={c.code}>
                    <Link to={`/conferences/${c.slug}`} className="group flex items-center justify-between border-b border-white/10 py-3 hover:text-gold-300">
                      <span className="font-semibold">{c.name}</span>
                      <ArrowRight aria-hidden className="size-4 text-gold-400 opacity-60 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70">No conferences are listed in {active} yet. Explore all upcoming conferences instead.</p>
            )}
            <Link to={`/conferences?continent=${encodeURIComponent(active)}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-gold-400">
              View all conferences in {active}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PeerReview() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="review-heading">
      <Container>
        <SectionHeading id="review-heading" title="Peer review process" intro="Every submission follows the same route from abstract to final decision." />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          <span className="absolute left-6 right-6 top-6 hidden h-px bg-gold-500/60 lg:block" aria-hidden />
          {peerReviewSteps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 lg:flex-col">
              <span className="relative z-10 inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-500 bg-white font-serif text-lg font-semibold text-navy-900">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-[1.15rem] font-semibold">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Delegates() {
  return (
    <section className="border-t border-rule bg-mist py-20 lg:py-24" aria-labelledby="delegates-heading">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
        <SectionHeading id="delegates-heading" title="Experience shared by our delegates" intro="Reflections from researchers and professionals who have presented at and attended ICF conferences." />
        <figure className="relative rounded-[var(--radius-lg)] border border-dashed border-navy-100 bg-white p-8 sm:p-10">
          <MessageSquareQuote aria-hidden className="size-9 text-gold-500" strokeWidth={1.4} />
          <blockquote className="mt-4 font-serif text-[1.35rem] leading-snug text-navy-900/60">
            Delegate testimonials will appear here as a slider once ICF supplies approved quotes, names, affiliations and photographs.
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm text-muted">
            <span className="size-10 rounded-full bg-navy-50" aria-hidden />
            Awaiting client content
          </figcaption>
          <div className="mt-8 flex gap-2" aria-hidden>
            <span className="h-1.5 w-8 rounded-full bg-navy-900" />
            <span className="h-1.5 w-4 rounded-full bg-navy-100" />
            <span className="h-1.5 w-4 rounded-full bg-navy-100" />
          </div>
        </figure>
      </Container>
    </section>
  );
}

function Partners() {
  return (
    <section className="py-16" aria-labelledby="partners-heading">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="lg:w-64 lg:shrink-0">
            <h2 id="partners-heading" className="text-h3">
              Our associated partners
            </h2>
            <p className="mt-2 text-sm text-muted">Partner logos will be added once ICF provides approved artwork.</p>
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex h-20 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-rule text-sm text-muted/80">
                Partner logo
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  usePageMeta('', 'International Conference Forum (ICF) connects researchers, academicians, students and industry professionals with international academic conferences across ten subject areas.');
  return (
    <>
      <Hero />
      <Pillars />
      <AboutIntro />
      <Upcoming />
      <TopicIndex />
      <ByContinent />
      <PeerReview />
      <Delegates />
      <Partners />
    </>
  );
}
