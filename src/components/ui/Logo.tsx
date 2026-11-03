import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/**
 * ICF brand marks, all cut from the client-supplied logo artwork.
 * - variant "full": complete logo (footer plate, admin login). Has a white ground, so use `plate` on dark backgrounds.
 * - variant "lockup": emblem plus the name set in type. Used in the header, where the full logo's wordmark
 *   would be too small to read.
 */
export function Logo({ className, plate = false, variant = 'full' }: { className?: string; plate?: boolean; variant?: 'full' | 'lockup' }) {
  if (variant === 'lockup') {
    return (
      <Link to="/" className={cn('inline-flex shrink-0 items-center gap-3', className)} aria-label="International Conference Forum (ICF), home">
        <img src="/images/icf-emblem.webp" alt="" width={400} height={181} className="h-11 w-auto sm:h-12" />
        <span className="hidden border-l border-rule pl-3 font-serif leading-[1.1] text-navy-900 sm:block" aria-hidden>
          <span className="block text-[0.98rem] font-semibold">International</span>
          <span className="block text-[0.98rem] font-semibold">Conference Forum</span>
        </span>
      </Link>
    );
  }
  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0', plate && 'rounded-[var(--radius-md)] bg-white px-3 py-2', className)}
      aria-label="International Conference Forum (ICF), home"
    >
      <picture className="h-full">
        <source srcSet="/images/icf-logo.webp" type="image/webp" />
        <img src="/images/icf-logo.png" alt="International Conference Forum (ICF)" width={560} height={373} className="h-full w-auto" />
      </picture>
    </Link>
  );
}
