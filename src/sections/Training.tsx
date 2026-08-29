import { Activity, ArrowUpRight, Check, Smartphone, Target } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { formatCurrency, trainingServices } from '../data/services';

const icons = {
  smartphone: Smartphone,
  activity: Activity,
  target: Target,
};

export function Training() {
  return (
    <section
      id="treinamento"
      className="relative scroll-mt-20 overflow-hidden bg-navy py-20 sm:py-24 lg:py-32"
    >
      <div className="absolute -top-20 right-[8%] size-80 rounded-full border border-white/6" />
      <div className="absolute top-20 right-[12%] size-44 rounded-full border border-white/6" />
      <div className="absolute -bottom-48 left-[6%] size-[30rem] rounded-full bg-teal/18 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <SectionHeading
            eyebrow="Treinamento & consultoria"
            title="Movimento planejado para o objetivo que importa a você."
            description="Treinos construídos a partir do seu ponto de partida, com orientação clara e espaço para evoluir de forma consistente."
            theme="dark"
          />
          <p className="max-w-md text-sm leading-6 text-white/55 lg:justify-self-end">
            A periodicidade, a quantidade de encontros e os detalhes do acompanhamento são
            combinados pelo WhatsApp antes de começar.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {trainingServices.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <article
                key={service.id}
                className={`flex flex-col rounded-[1.75rem] border p-7 sm:p-8 ${index === 0 ? 'border-sand/45 bg-white text-navy' : 'border-white/12 bg-white/[0.055] text-white backdrop-blur'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-12 place-items-center rounded-full ${index === 0 ? 'bg-teal/10 text-teal' : 'bg-white/10 text-sand'}`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span
                    className={`rounded-full px-3 py-2 text-xs font-extrabold ${index === 0 ? 'bg-cream text-navy' : 'bg-white/10 text-white'}`}
                  >
                    Investimento: {formatCurrency(service.price)}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-3xl leading-tight">{service.title}</h3>
                <p className={`mt-4 leading-7 ${index === 0 ? 'text-ink-muted' : 'text-white/64'}`}>
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className={`flex items-center gap-3 text-sm font-semibold ${index === 0 ? 'text-navy/76' : 'text-white/74'}`}
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-full ${index === 0 ? 'bg-teal/10 text-teal' : 'bg-white/10 text-sand'}`}
                      >
                        <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>

                <WhatsAppButton
                  message={service.message}
                  variant={index === 0 ? 'primary' : 'ghost'}
                  className="mt-8 w-full"
                >
                  {service.cta}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </WhatsAppButton>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-white/42">
          O planejamento respeita a evolução individual. Não há promessa de prevenção absoluta de
          lesões ou garantia de aprovação em testes físicos.
        </p>
      </div>
    </section>
  );
}
