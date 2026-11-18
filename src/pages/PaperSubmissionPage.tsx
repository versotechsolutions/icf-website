import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { PaperSubmissionForm } from '@/components/forms/PaperSubmissionForm';

export default function PaperSubmissionPage() {
  usePageMeta('Paper submission', 'Submit your abstract or full paper to an International Conference Forum (ICF) conference.');
  return (
    <>
      <PageHeader title="Paper submission" crumbs={[{ label: 'Paper submission' }]} intro="Upload your abstract or full paper using the form below. Fields marked * are required." />
      <Container className="py-14">
        <section aria-label="Paper submission form" className="mx-auto max-w-4xl rounded-[var(--radius-lg)] border border-rule bg-mist p-6 sm:p-8">
          <PaperSubmissionForm />
        </section>
      </Container>
    </>
  );
}
