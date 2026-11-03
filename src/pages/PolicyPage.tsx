import { useParams } from 'react-router-dom';
import { FileClock } from 'lucide-react';
import { footerNav, site } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { Notice } from '@/components/ui/Notice';
import NotFoundPage from './NotFoundPage';

/**
 * Legal pages linked from the footer. Their wording must come from ICF (or its legal adviser);
 * the page shells exist so links work and the layout is ready.
 */
export default function PolicyPage() {
  const { slug = '' } = useParams();
  const policy = footerNav.legal.find((l) => l.to === `/policies/${slug}`);
  usePageMeta(policy?.label ?? 'Policy');
  if (!policy) return <NotFoundPage />;

  return (
    <>
      <PageHeader tone="paper" title={policy.label} crumbs={[{ label: policy.label }]} />
      <Container narrow className="py-14">
        <Notice tone="pending" title="Policy text awaiting client approval">
          The {policy.label} for {site.name} has not been supplied yet. This page will publish the approved text once ICF provides it.
        </Notice>
        <div className="mt-10 flex items-start gap-4 text-muted">
          <FileClock aria-hidden className="size-8 shrink-0 text-gold-500" strokeWidth={1.4} />
          <p className="max-w-[60ch]">
            In the meantime, questions about this policy can be sent to{' '}
            <a className="link-underline" href={`mailto:${site.contact.supportEmail}`}>
              {site.contact.supportEmail}
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
