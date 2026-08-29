import type { ReactNode } from 'react';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'ghost';
  className?: string;
  target?: '_blank';
  ariaLabel?: string;
};

const variants = {
  primary:
    'bg-terracotta text-white shadow-[0_12px_30px_rgba(217,130,88,0.24)] hover:bg-[#c87049] hover:-translate-y-0.5',
  secondary:
    'border border-navy/15 bg-white text-navy hover:border-teal hover:text-teal hover:-translate-y-0.5',
  light:
    'bg-paper text-navy shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:bg-white hover:-translate-y-0.5',
  ghost: 'border border-white/30 text-white hover:border-white hover:bg-white/10',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  target,
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
