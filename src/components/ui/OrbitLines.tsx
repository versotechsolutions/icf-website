import { cn } from '@/utils/cn';

/**
 * Gold orbital linework echoing the swoosh around the globe in the ICF logo.
 * This is the site's single decorative signature: full strength in the home hero,
 * faint in page headers.
 */
export function OrbitLines({ className, animate = false, faint = false }: { className?: string; animate?: boolean; faint?: boolean }) {
  const line = animate ? 'orbit-line' : undefined;
  const k = faint ? 0.55 : 1;
  return (
    <svg viewBox="0 0 800 600" fill="none" aria-hidden className={cn('pointer-events-none', className)} preserveAspectRatio="xMidYMid slice">
      <g stroke="#ffffff" strokeOpacity={0.07 * k}>
        <circle cx="660" cy="300" r="250" />
        <ellipse cx="660" cy="300" rx="165" ry="250" />
        <ellipse cx="660" cy="300" rx="70" ry="250" />
        <path d="M410 300 H910 M428 190 H892 M428 410 H892" />
      </g>
      <g strokeLinecap="round">
        <path className={line} d="M-40 600 C 220 470, 560 380, 880 330" stroke="var(--color-gold-400)" strokeOpacity={0.55 * k} strokeWidth="1.6" />
        <path className={line} d="M-60 650 C 230 520, 580 440, 900 400" stroke="var(--color-gold-400)" strokeOpacity={0.28 * k} strokeWidth="1.1" />
        <path className={line} d="M420 -20 C 560 60, 700 120, 900 140" stroke="#ffffff" strokeOpacity={0.12 * k} strokeWidth="1" />
      </g>
    </svg>
  );
}
