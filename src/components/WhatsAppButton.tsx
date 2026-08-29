import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { createWhatsAppUrl } from '../data/contact';
import { ButtonLink } from './ButtonLink';

type WhatsAppButtonProps = {
  message: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'ghost';
  className?: string;
  showArrow?: boolean;
};

export function WhatsAppButton({
  message,
  children,
  variant = 'primary',
  className,
  showArrow = false,
}: WhatsAppButtonProps) {
  return (
    <ButtonLink
      href={createWhatsAppUrl(message)}
      target="_blank"
      variant={variant}
      className={className}
    >
      <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
      {children}
      {showArrow && <ArrowUpRight aria-hidden="true" className="size-4" />}
    </ButtonLink>
  );
}
