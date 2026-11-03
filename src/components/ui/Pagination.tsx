import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn = 'inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-sm font-semibold';
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <button className={cn(btn, 'text-navy-900 hover:bg-mist disabled:opacity-40')} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(btn, p === page ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-mist')}
        >
          {p}
        </button>
      ))}
      <button className={cn(btn, 'text-navy-900 hover:bg-mist disabled:opacity-40')} disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
