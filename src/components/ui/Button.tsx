import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
const variants: Record<Variant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950',
  gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400',
  secondary: 'border border-navy-900 text-navy-900 bg-white hover:bg-navy-50',
  ghost: 'text-globe-700 hover:bg-globe-100',
  onDark: 'border border-white/50 text-white hover:bg-white/10 hover:border-white',
};
const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-[0.95rem] px-5 py-2.5',
  lg: 'text-base px-6 py-3.5',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant, size, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
