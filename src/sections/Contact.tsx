import { ArrowUpRight, AtSign, House, MessageCircle } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import {
  contactMessages,
  createWhatsAppUrl,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
} from '../data/contact';

export function Contact() {
  return (
    <section id="contato" className="scroll-mt-20 bg-white px-5 py-20 sm:py-24 lg:px-8 lg:py-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-teal px-6 py-12 text-white shadow-[0_28px_80px_rgba(23,107,104,0.23)] sm:px-10 lg:px-16 lg:py-16">
        <div className="absolute -top-20 -right-20 size-80 rounded-full border border-white/10" />
        <div className="absolute -right-6 -bottom-36 size-72 rounded-full bg-white/7" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-sand uppercase">Contato</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Vamos conversar sobre o cuidado que faz sentido para você?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Conte seu objetivo, tire suas dúvidas e combine o atendimento diretamente comigo.
            </p>
            <WhatsAppButton
              message={contactMessages.general}
              variant="light"
              className="mt-8 w-full sm:w-fit sm:px-7"
              showArrow
            >
              Iniciar conversa no WhatsApp
            </WhatsAppButton>
          </div>

          <div className="grid gap-3">
            <a
              href={createWhatsAppUrl(contactMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/14 bg-white/9 p-4 backdrop-blur transition hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/12">
                <MessageCircle aria-hidden="true" className="size-5" />
              </span>
              <span>
                <small className="block text-xs font-bold text-white/55">WhatsApp</small>
                <strong className="mt-1 block">{WHATSAPP_DISPLAY}</strong>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="ml-auto size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/14 bg-white/9 p-4 backdrop-blur transition hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/12">
                <AtSign aria-hidden="true" className="size-5" />
              </span>
              <span>
                <small className="block text-xs font-bold text-white/55">Instagram</small>
                <strong className="mt-1 block">{INSTAGRAM_HANDLE}</strong>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="ml-auto size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <div className="flex min-h-20 items-center gap-4 rounded-2xl border border-white/14 bg-white/9 p-4 backdrop-blur">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/12">
                <House aria-hidden="true" className="size-5" />
              </span>
              <span>
                <small className="block text-xs font-bold text-white/55">Modalidade</small>
                <strong className="mt-1 block">Atendimento a domicílio</strong>
                <span className="text-xs text-white/55">Local e disponibilidade pelo WhatsApp</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
