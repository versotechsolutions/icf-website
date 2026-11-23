import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { Container } from './Container';
import { OrbitLines } from './OrbitLines';
import { useEventSite } from '@/hooks/useEventSite';
import { cn } from '@/utils/cn';

type Props = {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
  /** 'navy' for organisation pages, 'paper' for quieter reference pages. */
  tone?: 'navy' | 'paper';
  aside?: ReactNode;
};

/**
 * Compact interior page header. Deliberately short (no oversized empty hero):
 * breadcrumb, serif title, one intro paragraph, optional actions or aside.
 * On an event site it sits as a light strip under the conference banner.
 */
export function PageHeader({ title, intro, crumbs, children, tone = 'navy', aside }: Props) {
  const event = useEventSite();
  const dark = tone === 'navy' && !event;
  return (
    <header className={cn('relative overflow-hidden', dark ? 'bg-navy-900 text-white' : 'border-b border-rule bg-mist')}>
      {dark && <OrbitLines faint className="absolute inset-0 h-full w-full" />}
      <Container className={cn('relative', event ? 'py-8 sm:py-10' : 'py-10 sm:py-14')}>
        <Breadcrumbs items={crumbs} tone={dark ? 'dark' : 'light'} />
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <h1 className={cn(event ? 'text-h2' : 'text-h1', dark && 'text-white')}>{title}</h1>
            {intro && <div className={cn('mt-4 max-w-[62ch] text-lg leading-relaxed', dark ? 'text-white/80' : 'text-muted')}>{intro}</div>}
            {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
          </div>
          {aside}
        </div>
      </Container>
    </header>
  );
}
