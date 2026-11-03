import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { QuickLinks } from '@/components/conference/QuickLinks';

/**
 * Body layout for conference information pages: content column plus the
 * sticky "Quick Links" panel required on every event page.
 */
export function EventInfoLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-14 lg:py-16">
      <div className="min-w-0">{children}</div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <QuickLinks />
      </div>
    </Container>
  );
}
