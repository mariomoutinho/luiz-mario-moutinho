import { ArrowUpRight } from 'lucide-react';
import { therapies } from '../data/services';

export function ServiceImageRail() {
  return (
    <div
      className="service-rail border-y border-white/10 bg-navy py-3 text-white"
      role="region"
      aria-label="Imagens dos serviços ofertados"
    >
      <div className="mx-auto mb-3 flex max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-sand uppercase">
          Atendimentos em destaque
        </p>
        <p className="hidden text-xs text-white/55 md:block">
          Selecione uma imagem para conhecer o serviço
        </p>
      </div>

      <div className="service-rail__viewport">
        <div id="service-image-rail-track" className="service-rail__track">
          {[false, true].map((isDuplicate) => (
            <ul
              key={isDuplicate ? 'duplicate' : 'original'}
              className="service-rail__group"
              aria-hidden={isDuplicate || undefined}
            >
              {therapies.map((service) => (
                <li key={`${isDuplicate ? 'duplicate-' : ''}${service.id}`}>
                  <a
                    href={`#${service.id}`}
                    tabIndex={isDuplicate ? -1 : undefined}
                    className="group relative block h-32 w-[250px] overflow-hidden rounded-2xl border border-white/12 bg-teal/20 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand sm:h-36 sm:w-[290px] lg:h-40 lg:w-[330px]"
                  >
                    <img
                      src={service.image}
                      alt={isDuplicate ? '' : service.imageAlt}
                      width="1280"
                      height="853"
                      loading={isDuplicate ? 'lazy' : 'eager'}
                      decoding="async"
                      className="size-full object-cover transition duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                      sizes="(min-width: 1024px) 330px, (min-width: 640px) 290px, 250px"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <span>
                        <small className="block text-[9px] font-extrabold tracking-[0.16em] text-sand uppercase">
                          {service.duration}
                        </small>
                        <strong className="mt-1 block font-display text-lg leading-tight text-white sm:text-xl">
                          {service.name}
                        </strong>
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-terracotta group-focus-visible:bg-terracotta">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
