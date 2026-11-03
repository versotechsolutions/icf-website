import { Compass } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <Container narrow className="py-24 text-center">
      <Compass aria-hidden className="mx-auto size-12 text-gold-500" strokeWidth={1.4} />
      <h1 className="mt-6 text-h1">This page could not be found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">The address may be mistyped, or the page may have moved. Use the menu above or start from one of these pages.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Go to the homepage</ButtonLink>
        <ButtonLink to="/conferences" variant="secondary">
          Browse conferences
        </ButtonLink>
      </div>
    </Container>
  );
}
