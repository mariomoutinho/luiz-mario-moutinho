import { Plus } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { faqItems } from '../data/faq';

export function Faq() {
  return (
    <section id="duvidas" className="scroll-mt-20 bg-paper py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="O que você pode querer saber antes de começar."
            description="Se a sua dúvida não estiver aqui, fale comigo pelo WhatsApp."
          />
        </div>

        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {faqItems.map((item, index) => (
            <details key={item.question} name="faq" className="faq-item group" open={index === 0}>
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-extrabold text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal sm:text-lg">
                {item.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-teal transition group-open:rotate-45 group-open:bg-teal group-open:text-white">
                  <Plus aria-hidden="true" className="size-[18px]" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-ink-muted sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
