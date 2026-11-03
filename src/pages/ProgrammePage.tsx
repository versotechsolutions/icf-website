import { Coffee, Mic2, Sparkles } from 'lucide-react';
import { agendaHighlights, agendaIntro, schedule, scheduleIntro } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { Notice } from '@/components/ui/Notice';
import { cn } from '@/utils/cn';

const kindStyle = {
  session: { icon: Mic2, dot: 'bg-navy-900 border-navy-900', label: 'Session' },
  ceremony: { icon: Sparkles, dot: 'bg-gold-500 border-gold-500', label: 'Ceremony' },
  break: { icon: Coffee, dot: 'bg-white border-navy-100', label: 'Break' },
};

export default function ProgrammePage() {
  usePageMeta('Programme', 'ICF conference agenda: key agenda highlights and the indicative day schedule.');
  return (
    <>
      <PageHeader title="Conference programme" crumbs={[{ label: 'Conference information' }, { label: 'Programme' }]} intro={agendaIntro[0]} />
      <EventInfoLayout>
        <section aria-labelledby="agenda-h">
          <h2 id="agenda-h" className="text-h2">
            Conference agenda
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <p className="mt-6 max-w-[66ch] leading-relaxed text-ink/90">{agendaIntro[1]}</p>
          <h3 className="mt-10 text-h3">Key agenda highlights</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {agendaHighlights.map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-mist px-4 py-3.5 font-semibold text-navy-900">
                <span className="size-2 shrink-0 rotate-45 bg-gold-500" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sched-h" className="mt-16">
          <h2 id="sched-h" className="text-h2">
            Conference schedule
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          {scheduleIntro.map((p) => (
            <p key={p.slice(0, 20)} className="mt-5 max-w-[66ch] leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
          <Notice tone="info" className="mt-6">
            Indicative one-day schedule supplied by ICF. Each conference publishes its own timings, speakers and sessions.
          </Notice>

          {/* Timeline: time rail on the left, sessions on the right */}
          <ol className="relative mt-10 border-l-2 border-navy-100 pl-0 sm:ml-[8.5rem]">
            {schedule.map((s) => {
              const k = kindStyle[s.kind];
              const Icon = k.icon;
              return (
                <li key={s.time} className="relative pb-7 pl-8 last:pb-0">
                  <span className={cn('absolute -left-[0.5625rem] top-1.5 size-4 rounded-full border-2', k.dot)} aria-hidden />
                  <time className="block text-sm font-semibold tabular-nums text-gold-700 sm:absolute sm:-left-[8.5rem] sm:top-1 sm:w-[7rem] sm:text-right sm:text-[0.95rem]">{s.time}</time>
                  <div className={cn('mt-1 flex items-center gap-3 rounded-[var(--radius-md)] sm:mt-0', s.kind === 'break' ? 'text-muted' : 'border border-rule bg-white px-4 py-3 shadow-[var(--shadow-lift)]')}>
                    <Icon aria-hidden className={cn('size-4.5 shrink-0', s.kind === 'break' ? 'text-muted' : 'text-globe-600')} />
                    <span className={cn(s.kind === 'break' ? 'italic' : 'font-semibold text-navy-900')}>{s.session}</span>
                    <span className="sr-only">({k.label})</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </EventInfoLayout>
    </>
  );
}
