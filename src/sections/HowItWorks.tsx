import { CalendarCheck, MessageCircle, MessagesSquare } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Entre em contato',
    text: 'Envie uma mensagem pelo WhatsApp contando, em poucas palavras, o que você busca.',
  },
  {
    number: '02',
    icon: MessagesSquare,
    title: 'Converse com Luiz',
    text: 'A partir do seu objetivo, vocês identificam o atendimento ou acompanhamento adequado.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Combine os detalhes',
    text: 'O horário, o local do atendimento a domicílio ou o formato do acompanhamento são alinhados.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Como funciona" title="Começar pode ser simples." align="center" />
        <ol className="relative mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <li key={number} className="relative">
              {index < steps.length - 1 && (
                <span
                  className="absolute top-12 left-[calc(50%+3rem)] hidden h-px w-[calc(100%-6rem)] bg-navy/13 lg:block"
                  aria-hidden="true"
                />
              )}
              <article className="relative h-full rounded-[1.5rem] border border-navy/8 bg-white p-7 text-center shadow-[0_14px_40px_rgba(11,33,40,0.05)]">
                <span className="absolute top-5 right-6 font-display text-4xl text-navy/7">
                  {number}
                </span>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-teal text-white shadow-[0_10px_24px_rgba(23,107,104,0.22)]">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-2xl text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
