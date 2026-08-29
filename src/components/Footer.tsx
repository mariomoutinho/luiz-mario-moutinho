import { AtSign, MessageCircle } from 'lucide-react';
import {
  contactMessages,
  createWhatsAppUrl,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PROFESSIONAL_NAME,
  WHATSAPP_DISPLAY,
} from '../data/contact';

const footerLinks = [
  ['Sobre', '#sobre'],
  ['Terapias', '#terapias'],
  ['Treinamento', '#treinamento'],
  ['Valores', '#valores'],
  ['Dúvidas', '#duvidas'],
];

export function Footer() {
  return (
    <footer className="bg-[#07191f] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.4fr_0.7fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-white/10 font-display text-xl">
                LM
              </span>
              <strong className="font-display text-2xl">{PROFESSIONAL_NAME}</strong>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/62">
              Terapeuta integrativo, acupunturista, massoterapeuta, personal trainer e consultor de
              treinamento físico.
            </p>
            <p className="mt-3 text-sm font-bold text-sand">Atendimento a domicílio — Recife/PE</p>
          </div>

          <nav aria-label="Links do rodapé">
            <p className="mb-4 text-xs font-extrabold tracking-[0.18em] text-sand uppercase">
              Navegue
            </p>
            <ul className="space-y-2">
              {footerLinks.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex min-h-8 items-center text-sm text-white/68 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-xs font-extrabold tracking-[0.18em] text-sand uppercase">
              Contato
            </p>
            <a
              href={createWhatsAppUrl(contactMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 text-sm text-white/72 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
            >
              <MessageCircle aria-hidden="true" className="size-5 text-sand" />
              {WHATSAPP_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 text-sm text-white/72 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
            >
              <AtSign aria-hidden="true" className="size-5 text-sand" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 text-xs leading-5 text-white/48 md:flex-row md:items-end md:justify-between">
          <div>
            <p>
              © {new Date().getFullYear()} {PROFESSIONAL_NAME}. Todos os direitos reservados.
            </p>
            <p className="mt-2 max-w-3xl">
              As terapias integrativas e os programas de exercício físico não substituem
              diagnóstico, acompanhamento médico ou outros cuidados de saúde quando necessários.
            </p>
          </div>
          <a
            href="#inicio"
            className="min-h-8 shrink-0 font-bold text-sand transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
          >
            Voltar ao início ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
