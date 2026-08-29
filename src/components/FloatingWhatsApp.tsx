import { MessageCircle } from 'lucide-react';
import { contactMessages, createWhatsAppUrl } from '../data/contact';

export function FloatingWhatsApp() {
  return (
    <a
      href={createWhatsAppUrl(contactMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Luiz pelo WhatsApp"
      className="floating-safe fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_34px_rgba(11,33,40,0.3)] transition hover:-translate-y-1 hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy sm:right-6 sm:bottom-6"
    >
      <MessageCircle aria-hidden="true" className="size-7" strokeWidth={2.2} />
    </a>
  );
}
