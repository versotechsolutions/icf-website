import { FileDown, FileText, ScrollText } from 'lucide-react';
import { abstractGuidelines, fullPaperGuidelines, fullPaperIntro, manuscriptStructure } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { Notice } from '@/components/ui/Notice';
import { Button } from '@/components/ui/Button';
import { ContactBlock } from '@/components/layout/ContactBlock';
import type { LabelledText } from '@/types';

function GuidelineList({ items }: { items: LabelledText[] }) {
  return (
    <dl className="mt-6 divide-y divide-rule border-y border-rule">
      {items.map((g) => (
        <div key={g.title} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
          <dt className="font-semibold text-navy-900">{g.title}</dt>
          <dd className="leading-relaxed text-ink/85">{g.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function TemplateButton({ label }: { label: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Button variant="secondary" disabled aria-describedby="template-pending">
        <FileDown aria-hidden className="size-4" />
        {label}
      </Button>
      <span id="template-pending" className="text-sm text-muted">
        Template file to be supplied by ICF
      </span>
    </div>
  );
}

export default function PaperSubmissionPage() {
  usePageMeta('Paper submission', 'Abstract and full paper submission guidelines for International Conference Forum (ICF) conferences.');
  return (
    <>
      <PageHeader
        title="Paper submission"
        crumbs={[{ label: 'For participants' }, { label: 'Paper submission' }]}
        intro="Guidelines for preparing and submitting your abstract and full paper to an ICF conference."
      />
      <EventInfoLayout>
        {/* Two tracks */}
        <nav aria-label="Submission stages" className="grid gap-4 sm:grid-cols-2">
          <a href="#abstract" className="group rounded-[var(--radius-lg)] border border-rule p-5 hover:border-navy-900">
            <p className="text-sm font-semibold text-gold-700">Stage 1</p>
            <p className="mt-1 flex items-center gap-2 font-serif text-xl font-semibold text-navy-900">
              <FileText aria-hidden className="size-5 text-globe-600" /> Abstract submission
            </p>
            <p className="mt-1 text-sm text-muted">200–250 words, single paragraph</p>
          </a>
          <a href="#full-paper" className="group rounded-[var(--radius-lg)] border border-rule p-5 hover:border-navy-900">
            <p className="text-sm font-semibold text-gold-700">Stage 2</p>
            <p className="mt-1 flex items-center gap-2 font-serif text-xl font-semibold text-navy-900">
              <ScrollText aria-hidden className="size-5 text-globe-600" /> Full paper submission
            </p>
            <p className="mt-1 text-sm text-muted">6–8 pages, double-column layout</p>
          </a>
        </nav>

        <section id="abstract" aria-labelledby="abs-h" className="mt-16 scroll-mt-32">
          <h2 id="abs-h" className="text-h2">
            Abstract submission guidelines
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <GuidelineList items={abstractGuidelines} />
          <Notice tone="info" className="mt-6">
            Please review the specific conference requirements and submission deadline before submitting your abstract.
          </Notice>
          <TemplateButton label="Sample abstract template" />
        </section>

        <section id="full-paper" aria-labelledby="fp-h" className="mt-16 scroll-mt-32">
          <h2 id="fp-h" className="text-h2">
            Full paper submission guidelines
          </h2>
          <span className="rule-gold mt-4" aria-hidden />
          <p className="mt-6 max-w-[66ch] leading-relaxed text-ink/90">{fullPaperIntro}</p>
          <GuidelineList items={fullPaperGuidelines} />

          <div className="mt-10 rounded-[var(--radius-lg)] bg-navy-900 p-6 text-white sm:p-8">
            <h3 className="text-h3 text-white">Required manuscript structure</h3>
            <p className="mt-2 text-white/70">Organise the full paper using the following sections, in this order.</p>
            <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {manuscriptStructure.map((s, i) => (
                <li key={s} className="flex items-baseline gap-4 border-b border-white/10 py-2.5">
                  <span className="w-6 text-right font-serif font-semibold text-gold-300 tabular-nums">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <Notice tone="info" title="Important note" className="mt-6">
            Authors should ensure that their manuscripts follow the applicable conference formatting requirements and submission deadlines. Acceptance of an abstract does not automatically guarantee acceptance of the full paper.
          </Notice>
          <TemplateButton label="Sample full paper template" />
          <Notice tone="pending" className="mt-6">
            Online submission portal link: awaiting confirmation from ICF ("[Insert Submission Link]" in the source document).
          </Notice>
        </section>

        <ContactBlock
          className="mt-16"
          closing="Thank you for your interest in the International Conference Forum (ICF). We look forward to your participation and collaboration in advancing global research, knowledge sharing, and academic excellence!"
        />
      </EventInfoLayout>
    </>
  );
}
