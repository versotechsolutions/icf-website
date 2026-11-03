import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { topics } from '@/data/topics';
import { conferenceSnapshot } from '@/services/conferences';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { TopicIcon } from '@/components/conference/TopicIcon';
import { cn } from '@/utils/cn';

/** Subject discovery: a catalogue of the ten subject areas with their research themes. */
export default function TopicsPage() {
  usePageMeta('Browse by topic', 'Browse ICF conferences across ten subject areas, from Business and Economics to Social Sciences and Humanities.');
  const [active, setActive] = useState(topics[0].slug);
  const topic = topics.find((t) => t.slug === active)!;
  const count = conferenceSnapshot.countByTopic(topic.slug);

  return (
    <>
      <PageHeader
        title="Browse by topic"
        crumbs={[{ label: 'Conferences', to: '/conferences' }, { label: 'Browse by topic' }]}
        intro="Choose a subject area to see its research themes, then open the matching conference listing."
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Subject areas">
            <ul className="divide-y divide-rule border-y border-rule">
              {topics.map((t) => (
                <li key={t.slug}>
                  <button
                    onClick={() => setActive(t.slug)}
                    aria-current={t.slug === active ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center gap-4 border-l-[3px] px-4 py-3.5 text-left transition-colors',
                      t.slug === active ? 'border-gold-500 bg-navy-900 text-white' : 'border-transparent hover:bg-mist',
                    )}
                  >
                    <TopicIcon slug={t.slug} className={cn('size-5 shrink-0', t.slug === active ? 'text-gold-300' : 'text-globe-600')} />
                    <span className="flex-1 font-semibold">{t.name}</span>
                    <span className={cn('text-sm tabular-nums', t.slug === active ? 'text-white/70' : 'text-muted')}>{t.subtopics.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="topic-title" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-navy-900 pb-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                  <TopicIcon slug={topic.slug} className="size-7" />
                </span>
                <div>
                  <h2 id="topic-title" className="text-h2">
                    {topic.name}
                  </h2>
                  <p className="text-muted">
                    {topic.subtopics.length} research themes, {count} upcoming {count === 1 ? 'conference' : 'conferences'} (sample data)
                  </p>
                </div>
              </div>
              <ButtonLink to={`/conferences?topic=${topic.slug}`}>
                View {topic.name} conferences
              </ButtonLink>
            </div>
            <h3 className="mt-8 font-sans text-base font-semibold text-muted">Research themes</h3>
            <ul className="mt-4 columns-1 gap-10 sm:columns-2">
              {topic.subtopics.map((s) => (
                <li key={s} className="flex break-inside-avoid gap-3 border-b border-rule py-2.5 leading-snug">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <Link to="/call-for-papers" className="mt-8 inline-flex items-center gap-2 font-semibold text-globe-700 hover:underline">
              See all subject areas in the call for papers
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </section>
        </div>
      </Container>
    </>
  );
}
