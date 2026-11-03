import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  as?: 'h2' | 'h3';
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  action?: ReactNode;
  className?: string;
  id?: string;
};

/** Section heading: gold hairline, serif title, optional intro and a right-aligned action. */
export function SectionHeading({ title, intro, as: Tag = 'h2', align = 'left', tone = 'light', action, className, id }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <span className={cn('rule-gold mb-4', align === 'center' && 'mx-auto')} aria-hidden />
        <Tag id={id} className={cn(Tag === 'h2' ? 'text-h2' : 'text-h3', tone === 'dark' && 'text-white')}>
          {title}
        </Tag>
        {intro && <div className={cn('mt-3 text-[1.0625rem] leading-relaxed', tone === 'dark' ? 'text-white/75' : 'text-muted')}>{intro}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
