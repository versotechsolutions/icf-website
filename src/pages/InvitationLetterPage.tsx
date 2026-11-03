import { Camera, ClipboardCheck, CreditCard, IdCard, ShieldAlert } from 'lucide-react';
import { invitationLetter } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';

const docIcons = [ClipboardCheck, CreditCard, Camera, IdCard];

export default function InvitationLetterPage() {
  usePageMeta('Invitation letter', 'How to request an ICF invitation letter for your visa application, required documents and the visa disclaimer.');
  return (
    <>
      <PageHeader title="Invitation letter and visa guidelines" crumbs={[{ label: 'For participants' }, { label: 'Invitation letter' }]} intro="What the ICF invitation letter is, how to request one, and what it can and cannot do for your visa application." />
      <EventInfoLayout>
        {/* The letter itself, presented as a document */}
        <section aria-labelledby="letter-h" className="relative rounded-[var(--radius-md)] border border-rule bg-white p-8 shadow-[var(--shadow-lift)] sm:p-12">
          <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[var(--radius-md)] bg-navy-900" aria-hidden />
          <div className="flex items-start justify-between gap-6 border-b border-rule pb-6">
            <img src="/images/icf-emblem.webp" alt="" className="h-12 w-auto" />
            <p className="text-right text-sm text-muted">
              ICF Organizing Committee
              <br />
              Issued in English
            </p>
          </div>
          <h2 id="letter-h" className="mt-8 text-h2">
            Invitation letter
          </h2>
          <p className="mt-4 max-w-[64ch] font-serif text-[1.2rem] leading-relaxed text-ink/90">{invitationLetter.intro}</p>
        </section>

        <section aria-labelledby="req-h" className="mt-16">
          <h2 id="req-h" className="text-h2">
            Requirements for an invitation letter
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          {invitationLetter.requirementsIntro.map((p) => (
            <p key={p.slice(0, 20)} className="mt-5 max-w-[66ch] leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {invitationLetter.documents.map((d, i) => {
              const Icon = docIcons[i];
              return (
                <li key={d} className="flex items-center gap-4 rounded-[var(--radius-md)] border border-rule p-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-globe-100 text-globe-700">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-semibold text-navy-900">{d}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="visa-h" className="mt-16 rounded-[var(--radius-lg)] border-l-4 border-gold-500 bg-gold-50 p-6 sm:p-8">
          <h2 id="visa-h" className="flex items-center gap-3 text-h3">
            <ShieldAlert aria-hidden className="size-6 text-gold-700" />
            Visa application disclaimer
          </h2>
          {invitationLetter.disclaimer.map((p) => (
            <p key={p.slice(0, 20)} className="mt-4 max-w-[66ch] leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
        </section>
      </EventInfoLayout>
    </>
  );
}
