import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { faqs } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { Accordion } from '@/components/ui/Accordion';
import { ContactBlock } from '@/components/layout/ContactBlock';

export default function FaqPage() {
  usePageMeta('Conference FAQ', 'Frequently asked questions about International Conference Forum (ICF) conferences, registration, papers and certificates.');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return faqs.filter((f) => !s || f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s));
  }, [q]);

  return (
    <>
      <PageHeader title="Frequently asked questions" crumbs={[{ label: 'Conference information' }, { label: 'FAQ' }]} intro="Answers to common questions about finding, registering for and presenting at ICF conferences." />
      <EventInfoLayout>
        <div className="relative max-w-md">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="faq-search" className="field-input pl-9" placeholder="Search questions" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {q ? `${list.length} of ${faqs.length} questions match` : `${faqs.length} questions`}
        </p>
        <div className="mt-6">
          {list.length ? (
            <Accordion
              key={q}
              numbered
              defaultOpen={[list[0].question]}
              items={list.map((f) => ({ id: f.question, title: f.question, content: <p className="max-w-[64ch]">{f.answer}</p> }))}
            />
          ) : (
            <p className="rounded-[var(--radius-md)] border border-dashed border-rule p-8 text-center text-muted">No question matches "{q}". Contact the ICF team and we will help.</p>
          )}
        </div>
        <ContactBlock className="mt-16" />
      </EventInfoLayout>
    </>
  );
}
