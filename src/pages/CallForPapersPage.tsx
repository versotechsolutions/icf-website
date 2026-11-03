import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, FileText, Search, Send } from 'lucide-react';
import { topics } from '@/data/topics';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TopicIcon } from '@/components/conference/TopicIcon';
import { QuickLinks } from '@/components/conference/QuickLinks';

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-gold-300/60 px-0.5 text-navy-950">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function CallForPapersPage() {
  usePageMeta('Call for papers', 'ICF invites research papers across ten subject areas. Browse the research themes and prepare your abstract.');
  const [q, setQ] = useState('');
  const total = topics.reduce((n, t) => n + t.subtopics.length, 0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return topics
      .map((t) => ({ ...t, subtopics: s ? t.subtopics.filter((x) => x.toLowerCase().includes(s)) : t.subtopics }))
      .filter((t) => t.subtopics.length > 0 || !s);
  }, [q]);
  const matchCount = filtered.reduce((n, t) => n + t.subtopics.length, 0);

  return (
    <>
      <PageHeader
        title="Call for papers"
        crumbs={[{ label: 'Conference information' }, { label: 'Call for papers' }]}
        intro={`ICF invites researchers, academicians, students and industry professionals to submit original research. Papers are welcomed across ${topics.length} subject areas and ${total} research themes.`}
      >
        <ButtonLink to="/paper-submission" variant="gold">
          Read the submission guidelines
        </ButtonLink>
        <ButtonLink to="/registration" variant="onDark">
          Registration and fees
        </ButtonLink>
      </PageHeader>

      {/* How it works strip */}
      <section aria-label="How to respond to the call" className="border-b border-rule bg-mist">
        <Container>
          <ol className="grid divide-rule md:grid-cols-3 md:divide-x">
            {[
              [Search, 'Find your theme', 'Locate your research area in the subject list below.'],
              [FileText, 'Prepare your abstract', 'A single paragraph of 200–250 words in English, as a .doc or .docx file.'],
              [Send, 'Submit for review', 'Submit through the ICF submission process; papers undergo peer review.'],
            ].map(([Icon, title, text], i) => {
              const I = Icon as typeof Search;
              return (
                <li key={title as string} className="flex gap-4 py-7 md:px-8 md:first:pl-0">
                  <span className="font-serif text-2xl font-semibold text-gold-700 tabular-nums">{i + 1}</span>
                  <div>
                    <h2 className="flex items-center gap-2 font-sans text-base font-semibold text-navy-900">
                      <I aria-hidden className="size-4 text-globe-600" />
                      {title as string}
                    </h2>
                    <p className="mt-1 text-[0.95rem] text-muted">{text as string}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-14">
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="rule-gold mb-4" aria-hidden />
              <h2 className="text-h2">Research themes by subject area</h2>
            </div>
            <div className="w-full sm:w-80">
              <label htmlFor="cfp-search" className="sr-only">
                Search research themes
              </label>
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input id="cfp-search" className="field-input pl-9" placeholder="Search research themes" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            {q ? `${matchCount} matching ${matchCount === 1 ? 'theme' : 'themes'}` : `${total} themes in ${topics.length} subject areas`}
          </p>

          {/* Subject jump links */}
          {!q && (
            <nav aria-label="Jump to subject area" className="mt-6 flex flex-wrap gap-2">
              {topics.map((t) => (
                <a key={t.slug} href={`#cfp-${t.slug}`} className="rounded-full border border-rule px-3 py-1.5 text-sm font-semibold text-navy-900 hover:border-navy-900">
                  {t.name}
                </a>
              ))}
            </nav>
          )}

          {filtered.length === 0 && (
            <p className="mt-10 rounded-[var(--radius-md)] border border-dashed border-rule p-8 text-center text-muted">
              No research theme contains "{q}". Try a broader word, or contact ICF if your area is not listed.
            </p>
          )}

          <div className="mt-10 space-y-12">
            {filtered.map((t) => (
              <section key={t.slug} id={`cfp-${t.slug}`} aria-labelledby={`cfp-h-${t.slug}`} className="scroll-mt-32">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-navy-900 pb-3">
                  <h3 id={`cfp-h-${t.slug}`} className="flex items-center gap-3 text-h3">
                    <TopicIcon slug={t.slug} className="size-6 text-globe-600" />
                    {t.name}
                  </h3>
                  <Link to={`/conferences?topic=${t.slug}`} className="text-sm font-semibold text-globe-700 hover:underline">
                    Conferences in this area
                  </Link>
                </div>
                <ul className="mt-4 columns-1 gap-8 sm:columns-2 xl:columns-3">
                  {t.subtopics.map((s) => (
                    <li key={s} className="break-inside-avoid border-b border-rule/70 py-2 text-[0.97rem] leading-snug">
                      {highlight(s, q.trim())}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-14 grid gap-6 rounded-[var(--radius-lg)] border border-rule p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <FileCheck2 aria-hidden className="size-9 text-gold-500" strokeWidth={1.4} />
            <div>
              <h2 className="text-h3">Before you submit</h2>
              <p className="mt-2 text-muted">
                Review the abstract and full paper guidelines, and check the specific conference page for its submission deadline. Acceptance of an abstract does not automatically guarantee acceptance of the full paper.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink to="/paper-submission">Submission guidelines</ButtonLink>
                <ButtonLink to="/awards" variant="secondary">
                  Awards for presented papers
                </ButtonLink>
              </div>
            </div>
          </div>
          <Notice tone="pending" className="mt-6">
            Submission deadlines and the online submission portal link are set per conference and have not yet been supplied.
          </Notice>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <QuickLinks />
        </div>
      </Container>
    </>
  );
}
