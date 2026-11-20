import { registrationIntro } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useSitePath } from '@/hooks/useEventSite';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EventInfoLayout } from '@/layouts/EventInfoLayout';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { RegistrationInfoSection } from '@/components/conference/ConferenceSections';

/** Event site "Registration Benefits" page (text: "Registration Information" in event details site/About Conf page.docx). */
export default function RegistrationBenefitsPage() {
  usePageMeta('Registration benefits', 'Early registration, student and researcher benefits, and what conference registration includes.');
  const sitePath = useSitePath();
  return (
    <>
      <PageHeader title="Registration benefits" crumbs={[{ label: 'Registration' }, { label: 'Registration benefits' }]} intro={registrationIntro}>
        <ButtonLink to={sitePath('/registration')} variant="gold">
          View fee details
        </ButtonLink>
      </PageHeader>
      <EventInfoLayout>
        <div className="space-y-16">
          <RegistrationInfoSection />
          <ContactBlock closing="" showWebsite={false} />
        </div>
      </EventInfoLayout>
    </>
  );
}
