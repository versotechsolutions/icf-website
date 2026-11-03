import type { ReactNode } from 'react';
import { FlaskConical, Hourglass, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Marks development sample data so it is never mistaken for real ICF information. */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-dashed border-gold-500/70 bg-gold-50 px-2 py-0.5 text-[0.72rem] font-semibold text-gold-700',
        className,
      )}
      title="Development sample data, not a real ICF conference"
    >
      <FlaskConical aria-hidden className="size-3" />
      Sample
    </span>
  );
}

const tones = {
  sample: { icon: FlaskConical, cls: 'border-dashed border-gold-500/60 bg-gold-50 text-gold-700' },
  pending: { icon: Hourglass, cls: 'border-navy-100 bg-navy-50 text-navy-800' },
  info: { icon: Info, cls: 'border-globe-600/25 bg-globe-100/60 text-navy-900' },
};

export function Notice({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: keyof typeof tones;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, cls } = tones[tone];
  return (
    <div className={cn('flex gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-[0.92rem] leading-relaxed', cls, className)} role="note">
      <Icon aria-hidden className="mt-0.5 size-[1.125rem] shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && 'mt-0.5', 'text-ink/85')}>{children}</div>
      </div>
    </div>
  );
}
