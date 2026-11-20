import { usePageMeta } from '@/hooks/usePageMeta';
import { useEventSite } from '@/hooks/useEventSite';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { PaperSubmissionForm } from '@/components/forms/PaperSubmissionForm';

/** Paper submission form. On a conference's event site it is "Article Submission" and shows the Quick Links panel. */
export default function PaperSubmissionPage() {
  const event = useEventSite();
  usePageMeta(event ? 'Article submission' : 'Paper submission', 'Submit your abstract or full paper to an International Conference Forum (ICF) conference.');

  const form = (
    <section aria-label="Paper submission form" className="rounded-[var(--radius-lg)] border border-rule bg-mist p-6 sm:p-8">
      <PaperSubmissionForm />
    </section>
  );

  return (
    <>
      <PageHeader
        title={event ? 'Article submission' : 'Paper submission'}
        crumbs={event ? [{ label: 'Submission' }, { label: 'Article submission' }] : [{ label: 'Paper submission' }]}
        intro="Upload your abstract or full paper using the form below. Fields marked * are required."
      />
      {event ? (
        <EventInfoLayout>{form}</EventInfoLayout>
      ) : (
        <Container className="py-14">
          <div className="mx-auto max-w-4xl">{form}</div>
        </Container>
      )}
    </>
  );
}
