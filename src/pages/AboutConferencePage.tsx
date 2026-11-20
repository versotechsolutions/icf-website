import { useEventSite } from '@/hooks/useEventSite';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { AboutConferenceSection, HighlightsSection, RegistrationInfoSection } from '@/components/conference/ConferenceSections';

/** Event site "About Conference" page (source: event details site/About Conf page.docx). Only used inside an event site. */
export default function AboutConferencePage() {
  const { conference } = useEventSite()!;
  usePageMeta(`About ${conference.acronym}`, `${conference.title}: about the conference, highlights and registration information.`);
  return (
    <>
      <PageHeader title={`About ${conference.acronym}`} crumbs={[{ label: 'About' }, { label: 'About Conference' }]} intro={conference.title} />
      <EventInfoLayout>
        <div className="space-y-16">
          <AboutConferenceSection conference={conference} />
          <HighlightsSection />
          <RegistrationInfoSection />
          <ContactBlock closing="" showWebsite={false} />
        </div>
      </EventInfoLayout>
    </>
  );
}
