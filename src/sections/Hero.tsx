import { ArrowDown, HeartPulse, House, Sparkles } from 'lucide-react';
import portraitImage640 from '../assets/images/luiz-moutinho-retrato-640.webp';
import portraitImage960 from '../assets/images/luiz-moutinho-retrato-960.webp';
import { ButtonLink } from '../components/ButtonLink';
import { ServiceImageRail } from '../components/ServiceImageRail';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { contactMessages } from '../data/contact';

const specialties = ['Terapias integrativas', 'Treinamento físico', 'Cuidado personalizado'];

export function Hero() {
  return (
    <section
      id="inicio"
      className="hero-pattern relative overflow-hidden bg-paper pt-[72px]"
      aria-labelledby="hero-title"
    >
      <ServiceImageRail />

      <div className="mx-auto grid min-h-[calc(100svh-72px-12rem)] max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        <div className="relative z-10 max-w-3xl animate-[rise-in_700ms_ease-out_both]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal/18 bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-teal uppercase shadow-sm backdrop-blur">
            <House aria-hidden="true" className="size-4" />
            Atendimento a domicílio em Recife/PE
          </div>

          <p className="mb-4 text-sm font-bold tracking-[0.14em] text-terracotta uppercase">
            Luiz Mario Moutinho
          </p>
          <h1
            id="hero-title"
            className="font-display max-w-4xl text-[clamp(3.2rem,7.2vw,6.6rem)] leading-[0.93] tracking-[-0.045em] text-navy"
          >
            Cuidado que integra <span className="text-teal italic">corpo</span> e movimento.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
            Um acompanhamento que reúne terapias corporais, práticas da Medicina Tradicional Chinesa
            e treinamento físico personalizado para cuidar da mobilidade, do condicionamento e da
            qualidade de vida.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#terapias" variant="primary" className="sm:px-6">
              Conhecer os atendimentos
              <ArrowDown aria-hidden="true" className="size-4" />
            </ButtonLink>
            <WhatsAppButton
              message={contactMessages.general}
              variant="secondary"
              className="sm:px-6"
            >
              Falar comigo
            </WhatsAppButton>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3" aria-label="Áreas de atuação">
            {specialties.map((specialty) => (
              <li
                key={specialty}
                className="flex items-center gap-2 text-sm font-semibold text-navy/68"
              >
                <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
                {specialty}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-[rise-in_700ms_180ms_ease-out_both] lg:mr-0">
          <div className="absolute -top-8 -right-10 size-52 rounded-full bg-sand/45 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-64 rounded-full bg-teal/18 blur-3xl" />

          <div className="relative overflow-hidden rounded-[3rem_3rem_8rem_3rem] border border-white/70 bg-cream shadow-[0_35px_90px_rgba(11,33,40,0.18)]">
            <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
            <img
              src={portraitImage960}
              srcSet={`${portraitImage640} 640w, ${portraitImage960} 960w`}
              alt="Retrato profissional de Luiz Mario Moutinho."
              width="960"
              height="1200"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-top"
              sizes="(min-width: 1024px) 43vw, 92vw"
            />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <p className="font-display text-2xl">Luiz Mario Moutinho</p>
              <p className="mt-1 text-sm text-white/76">Terapeuta integrativo & personal trainer</p>
            </div>
          </div>

          <div
            className="
              relative z-10 mx-3 mt-4 flex max-w-[212px] items-center gap-3 min-[360px]:max-w-[245px]
              rounded-2xl border border-navy/8 bg-white p-4
              shadow-[0_18px_50px_rgba(11,33,40,0.16)]
              sm:absolute sm:bottom-28 sm:-left-8 sm:mx-0 sm:mt-0
            "
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
              <HeartPulse aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-bold leading-5 text-navy">
              Escuta, presença e cuidado adaptado a você.
            </p>
          </div>

          <div className="absolute top-10 -right-3 grid size-16 place-items-center rounded-full bg-terracotta text-white shadow-xl sm:-right-7">
            <Sparkles aria-hidden="true" className="size-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
