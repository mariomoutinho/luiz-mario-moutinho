import { Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { contactMessages, createWhatsAppUrl } from '../data/contact';

const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Terapias', href: '#terapias' },
  { label: 'Treinamento', href: '#treinamento' },
  { label: 'Valores', href: '#valores' },
  { label: 'Dúvidas', href: '#duvidas' },
  { label: 'Contato', href: '#contato' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>('a');
    window.requestAnimationFrame(() => firstLink?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (event.key === 'Tab') {
        const focusableElements = mobileNavRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-navy/8 bg-paper/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a
          href="#inicio"
          className="group flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          aria-label="Luiz Mario Moutinho — voltar ao início"
        >
          <span className="grid size-10 place-items-center rounded-full bg-navy font-display text-lg text-paper transition group-hover:bg-teal">
            LM
          </span>
          <span className="leading-tight">
            <strong className="block text-sm tracking-[0.01em] text-navy">Luiz Mario</strong>
            <span className="block text-[11px] font-semibold tracking-[0.14em] text-teal uppercase">
              Cuidado & movimento
            </span>
          </span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-navy/72 transition hover:bg-cream hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              {item.label}
            </a>
          ))}
          <a
            href={createWhatsAppUrl(contactMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#c87049] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          >
            <MessageCircle aria-hidden="true" className="size-[18px]" />
            Falar no WhatsApp
          </a>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-11 place-items-center rounded-full border border-navy/12 bg-white text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal lg:hidden"
          aria-controls="menu-mobile"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-navy/35 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 size-full cursor-default"
            onClick={closeMenu}
          />
          <nav
            id="menu-mobile"
            ref={mobileNavRef}
            aria-label="Navegação móvel"
            className="relative ml-auto flex h-[calc(100dvh-72px)] w-[min(88vw,380px)] flex-col overflow-y-auto bg-paper p-6 shadow-2xl"
          >
            <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-teal uppercase">
              Navegação
            </p>
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center border-b border-navy/8 text-lg font-bold text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                {item.label}
              </a>
            ))}
            <a
              href={createWhatsAppUrl(contactMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <MessageCircle aria-hidden="true" className="size-5" />
              Falar no WhatsApp
            </a>
            <p className="mt-auto pt-8 text-sm leading-6 text-ink-muted">
              Atendimento a domicílio em Recife/PE.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
