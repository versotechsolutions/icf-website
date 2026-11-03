import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, CircleDashed, Clock3, RotateCcw, XCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AdminPageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.875rem] leading-tight">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-muted">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, bodyClass }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn('rounded-[var(--radius-lg)] border border-rule bg-white', className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
          <h2 className="font-serif text-lg">{title}</h2>
          {action}
        </div>
      )}
      <div className={cn('p-5', bodyClass)}>{children}</div>
    </section>
  );
}

/** Summary card: one number, its label, and an optional supporting line. */
export function StatCard({ label, value, note, icon: Icon }: { label: string; value: ReactNode; note?: ReactNode; icon: LucideIcon }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <Icon aria-hidden className="size-[1.125rem] text-globe-600" strokeWidth={1.7} />
      </div>
      <p className="mt-3 font-serif text-[2.25rem] font-semibold leading-none text-navy-900 tabular-nums">{value}</p>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
    </div>
  );
}

/** Status pill: always icon + label, never colour alone. */
const statusMap: Record<string, { icon: LucideIcon; cls: string }> = {
  Successful: { icon: CheckCircle2, cls: 'bg-success/10 text-success' },
  Confirmed: { icon: CheckCircle2, cls: 'bg-success/10 text-success' },
  Delivered: { icon: CheckCircle2, cls: 'bg-success/10 text-success' },
  Published: { icon: CheckCircle2, cls: 'bg-success/10 text-success' },
  Active: { icon: CheckCircle2, cls: 'bg-success/10 text-success' },
  Pending: { icon: Clock3, cls: 'bg-warning/10 text-warning' },
  'Awaiting payment': { icon: Clock3, cls: 'bg-warning/10 text-warning' },
  Scheduled: { icon: Clock3, cls: 'bg-globe-100 text-globe-700' },
  Invited: { icon: Clock3, cls: 'bg-globe-100 text-globe-700' },
  Draft: { icon: CircleDashed, cls: 'bg-navy-50 text-navy-800' },
  Completed: { icon: CheckCircle2, cls: 'bg-navy-50 text-navy-800' },
  Failed: { icon: XCircle, cls: 'bg-danger/10 text-danger' },
  Bounced: { icon: AlertTriangle, cls: 'bg-danger/10 text-danger' },
  Cancelled: { icon: XCircle, cls: 'bg-danger/10 text-danger' },
  Refunded: { icon: RotateCcw, cls: 'bg-navy-50 text-navy-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { icon: CircleDashed, cls: 'bg-navy-50 text-navy-800' };
  const Icon = s.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold', s.cls)}>
      <Icon aria-hidden className="size-3.5" />
      {status}
    </span>
  );
}

export function Table({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] text-left text-[0.92rem]">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
export const th = 'border-b border-rule bg-mist px-4 py-3 text-xs font-semibold text-muted';
export const td = 'border-b border-rule px-4 py-3 align-middle';

export function SegmentedFilter<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-rule bg-white p-1">
      {options.map((o) => (
        <button
          key={o}
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={cn('rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-semibold', o === value ? 'bg-navy-900 text-white' : 'text-ink/75 hover:bg-mist')}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Builds and downloads a CSV in the browser from demo rows. */
export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
