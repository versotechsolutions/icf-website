import { usePageMeta } from '@/hooks/usePageMeta';
import { useSitePath } from '@/hooks/useEventSite';
import { PageHeader } from '@/components/ui/PageHeader';
import { Notice } from '@/components/ui/Notice';
import { ButtonLink } from '@/components/ui/Button';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { ContactBlock } from '@/components/layout/ContactBlock';

/** Event site "Presentation Guidelines" page. The guideline text is still to be supplied by ICF (see docs/pending-client-items.md). */
export default function PresentationGuidelinesPage() {
  usePageMeta('Presentation guidelines', 'Presentation guidelines for International Conference Forum (ICF) conferences.');
  const sitePath = useSitePath();
  return (
    <>
      <PageHeader title="Presentation guidelines" crumbs={[{ label: 'Submission' }, { label: 'Presentation guidelines' }]} intro="Guidelines for presenting your paper at an ICF conference." />
      <EventInfoLayout>
        <div className="space-y-10">
          <Notice tone="pending" title="To be published by ICF">
            The presentation guidelines for this conference will be published on this page.
          </Notice>
          <div>
            <h2 className="text-h3">Presenting online</h2>
            <p className="mt-3 text-ink/85">Online presenters can read how to join the session, share slides and take part in the discussion in the video conference guide.</p>
            <ButtonLink to={sitePath('/video-conferencing')} variant="secondary" className="mt-5">
              Video conference guide
            </ButtonLink>
          </div>
          <ContactBlock closing="" showWebsite={false} />
        </div>
      </EventInfoLayout>
    </>
  );
}
