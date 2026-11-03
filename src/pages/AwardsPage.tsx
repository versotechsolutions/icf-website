import { useState } from 'react';
import { Award as AwardIcon, GraduationCap, Medal, Mic2, ScrollText, Trophy } from 'lucide-react';
import { awards } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const icons = { 'best-paper': Trophy, 'best-presentation': Mic2, 'best-student-paper': GraduationCap, 'certificate-of-participation': ScrollText } as Record<string, typeof Trophy>;
const benefitIcons = [Medal, AwardIcon, GraduationCap];

/** Awards: the client asked for a row of buttons, one per award (Awards page.docx). Implemented as tabs. */
export default function AwardsPage() {
  usePageMeta('Awards', 'ICF conference awards: Best Paper, Best Presentation, Best Student Paper and Certificate of Participation.');
  const [active, setActive] = useState(awards[0].slug);
  const award = awards.find((a) => a.slug === active)!;
  const Icon = icons[award.slug];

  return (
    <>
      <PageHeader
        title="Awards and recognition"
        crumbs={[{ label: 'For participants' }, { label: 'Awards' }]}
        intro="ICF conferences recognise outstanding research, presentation and student contributions, subject to each conference's evaluation criteria."
      />
      <Container className="py-14">
        <div role="tablist" aria-label="Awards" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a) => {
            const I = icons[a.slug];
            const sel = a.slug === active;
            return (
              <button
                key={a.slug}
                role="tab"
                id={`tab-${a.slug}`}
                aria-selected={sel}
                aria-controls="award-panel"
                onClick={() => setActive(a.slug)}
                className={cn(
                  'flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-4 text-left font-semibold transition-colors',
                  sel ? 'border-navy-900 bg-navy-900 text-white' : 'border-rule text-navy-900 hover:border-navy-900',
                )}
              >
                <I aria-hidden className={cn('size-6 shrink-0', sel ? 'text-gold-300' : 'text-gold-500')} strokeWidth={1.5} />
                {a.name}
              </button>
            );
          })}
        </div>

        <section id="award-panel" role="tabpanel" aria-labelledby={`tab-${award.slug}`} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {/* Laurel-style medallion */}
            <div className="flex items-center gap-5">
              <span className="relative inline-flex size-20 items-center justify-center rounded-full border-2 border-gold-500 bg-gold-50">
                <span className="absolute inset-1.5 rounded-full border border-gold-500/40" aria-hidden />
                <Icon aria-hidden className="size-9 text-gold-700" strokeWidth={1.4} />
              </span>
              <h2 className="text-h2">{award.name}</h2>
            </div>
            <div className="mt-8 space-y-4 font-serif text-[1.2rem] leading-relaxed text-ink/90">
              {award.description.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted">Award recipients are announced by each conference. No recipients are listed during this phase.</p>
          </div>
          {award.benefits ? (
            <aside aria-labelledby="benefits-h" className="self-start rounded-[var(--radius-lg)] bg-navy-900 p-7 text-white sm:p-8">
              <h3 id="benefits-h" className="text-h3 text-white">
                Award and benefits
              </h3>
              <ul className="mt-6 space-y-6">
                {award.benefits.map((b, i) => {
                  const B = benefitIcons[i];
                  return (
                    <li key={b.title} className="flex gap-4">
                      <B aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-300" strokeWidth={1.6} />
                      <div>
                        <p className="font-semibold">{b.title}</p>
                        <p className="mt-1 text-white/75">{b.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : (
            <aside className="self-start rounded-[var(--radius-lg)] border border-rule bg-mist p-7">
              <h3 className="text-h3">Eligibility</h3>
              <p className="mt-3 text-ink/85">Issued to attendees who meet the event's attendance requirements.</p>
              <ButtonLink to="/registration" className="mt-6">
                Register to attend
              </ButtonLink>
            </aside>
          )}
        </section>
      </Container>
    </>
  );
}
