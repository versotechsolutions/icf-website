import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  const linkCls = tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-muted hover:text-navy-900';
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link to="/" className={linkCls}>
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden className={tone === 'dark' ? 'size-3.5 text-gold-400' : 'size-3.5 text-gold-500'} />
            {c.to ? (
              <Link to={c.to} className={linkCls}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === 'dark' ? 'text-white' : 'text-navy-900'}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
