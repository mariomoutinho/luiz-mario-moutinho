import { ArrowUpRight, Check, Clock3 } from 'lucide-react';
import type { Therapy } from '../data/services';
import { formatCurrency } from '../data/services';
import { WhatsAppButton } from './WhatsAppButton';

type ServiceCardProps = {
  service: Therapy;
  featured?: boolean;
};

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
  return (
    <article
      id={service.id}
      className={`group flex scroll-mt-24 flex-col overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_18px_60px_rgba(11,33,40,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(11,33,40,0.12)] ${featured ? 'border-teal/35 lg:col-span-2 lg:grid lg:grid-cols-[0.9fr_1.1fr]' : 'border-navy/8'}`}
    >
      <div
        className={`relative overflow-hidden ${featured ? 'min-h-72 lg:min-h-full' : 'aspect-[16/10]'}`}
      >
        <img
          src={service.image}
          alt={service.imageAlt}
          width="1280"
          height="853"
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
          sizes={featured ? '(min-width: 1024px) 38vw, 100vw' : '(min-width: 1024px) 31vw, 100vw'}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/55 to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-paper/94 px-3 py-2 text-xs font-extrabold text-navy backdrop-blur">
          <Clock3 aria-hidden="true" className="size-4 text-teal" />
          {service.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div>
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.18em] text-teal uppercase">
            Terapia integrativa
          </p>
          <h3 className="font-display text-3xl leading-tight text-navy">{service.name}</h3>
          <p className="mt-4 leading-7 text-ink-muted">{service.description}</p>
          <p className="mt-3 text-sm leading-6 text-navy/68">{service.indications}</p>
        </div>

        <ul
          className="mt-5 grid gap-2 sm:grid-cols-3"
          aria-label={`Possíveis benefícios de ${service.name}`}
        >
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm font-semibold text-navy/78">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-3 gap-2 border-y border-navy/8 py-5">
          <div>
            <span className="block text-[10px] font-bold tracking-wide text-ink-muted uppercase">
              Avulsa
            </span>
            <strong className="mt-1 block text-base text-navy">
              {formatCurrency(service.singlePrice)}
            </strong>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wide text-ink-muted uppercase">
              4 sessões
            </span>
            <strong className="mt-1 block text-base text-navy">
              {formatCurrency(service.packageFour)}
            </strong>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wide text-ink-muted uppercase">
              10 sessões
            </span>
            <strong className="mt-1 block text-base text-navy">
              {formatCurrency(service.packageTen)}
            </strong>
          </div>
        </div>

        <WhatsAppButton
          message={service.message}
          variant="secondary"
          className="mt-6 w-full sm:w-fit"
        >
          Quero saber mais
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </WhatsAppButton>
      </div>
    </article>
  );
}
