import { AlertTriangle, CheckSquare, FileCheck2, Luggage, Stamp } from 'lucide-react';
import { travel } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { ButtonLink } from '@/components/ui/Button';

export default function TravelPage() {
  usePageMeta('Travel and accommodation', 'Visa, invitation letter, travel and accommodation guidance for ICF conference participants.');
  return (
    <>
      <PageHeader title="Travel and accommodation information" crumbs={[{ label: 'Conference information' }, { label: 'Travel information' }]} intro={travel.visaIntro.join(' ')} />
      <EventInfoLayout>
        {/* Visa & invitation letter */}
        <section aria-labelledby="visa-h">
          <h2 id="visa-h" className="flex items-center gap-3 text-h2">
            <Stamp aria-hidden className="size-7 text-gold-500" strokeWidth={1.4} />
            Visa and invitation letter guidelines
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-rule p-6">
              <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
                <FileCheck2 aria-hidden className="size-5 text-globe-600" /> Invitation letter issuance
              </h3>
              <p className="mt-3 leading-relaxed text-ink/85">{travel.issuance}</p>
              <ButtonLink to="/invitation-letter" variant="ghost" size="sm" className="-ml-3 mt-4">
                How to request a letter
              </ButtonLink>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-rule p-6">
              <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
                <CheckSquare aria-hidden className="size-5 text-globe-600" /> Required documents
              </h3>
              <ul className="mt-3 space-y-2">
                {travel.documents.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-[var(--radius-lg)] border-l-4 border-gold-500 bg-gold-50 p-6">
            <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
              <AlertTriangle aria-hidden className="size-5 text-gold-700" /> Please be advised
            </h3>
            <ul className="mt-3 space-y-2">
              {travel.advised.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-700" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Participant responsibility */}
        <section aria-labelledby="resp-h" className="mt-16">
          <h2 id="resp-h" className="flex items-center gap-3 text-h2">
            <Luggage aria-hidden className="size-7 text-gold-500" strokeWidth={1.4} />
            Participant responsibility
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule md:grid-cols-3">
            {travel.responsibility.map((r) => (
              <div key={r.title} className="bg-white p-6">
                <h3 className="font-serif text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visa support & communication */}
        <section aria-labelledby="comm-h" className="mt-16">
          <h2 id="comm-h" className="text-h2">
            Visa support and communication
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {travel.visaSupport.map((v) => (
              <div key={v.title} className="grid gap-1 py-5 sm:grid-cols-[15rem_1fr] sm:gap-6">
                <dt className="font-semibold text-navy-900">{v.title}</dt>
                <dd className="leading-relaxed text-ink/85">{v.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </EventInfoLayout>
    </>
  );
}
