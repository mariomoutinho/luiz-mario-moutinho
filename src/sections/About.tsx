import { Activity, Dumbbell, HandHeart, Leaf, MapPin, Waves } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';

const areas = [
  {
    icon: HandHeart,
    title: 'Cuidado integrativo',
    text: 'Uma escuta atenta para compreender necessidades e objetivos.',
  },
  {
    icon: Leaf,
    title: 'Práticas da MTC',
    text: 'Acupuntura e técnicas corporais aplicadas com responsabilidade.',
  },
  {
    icon: Dumbbell,
    title: 'Exercício físico',
    text: 'Treinos personalizados para diferentes metas e momentos.',
  },
  {
    icon: Waves,
    title: 'Mobilidade e recuperação',
    text: 'Estratégias para apoiar o movimento e o bem-estar corporal.',
  },
];

export function About() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Sobre Luiz"
              title="Um olhar inteiro para saúde, corpo e movimento."
              description="O atendimento parte de uma conversa honesta sobre o que você busca e integra recursos terapêuticos ou treinamento físico de acordo com essa necessidade."
            />
            <div className="mt-8 rounded-[1.5rem] bg-cream p-6">
              <MapPin aria-hidden="true" className="size-6 text-terracotta" />
              <p className="mt-3 font-display text-2xl text-navy">Cuidado no seu espaço</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Os atendimentos terapêuticos são realizados a domicílio. Local, disponibilidade e
                horário são confirmados diretamente pelo WhatsApp.
              </p>
            </div>
          </div>

          <div>
            <p className="text-lg leading-8 text-navy/76">
              Luiz atua como terapeuta integrativo, acupunturista, massoterapeuta, personal trainer
              e consultor de treinamento físico. Seu trabalho aproxima o cuidado corporal do
              movimento consciente, respeitando a individualidade, o contexto e os limites de cada
              pessoa.
            </p>
            <p className="mt-5 text-lg leading-8 text-navy/76">
              A proposta pode apoiar objetivos ligados a dor, mobilidade, qualidade de vida,
              emagrecimento, condicionamento físico e preparação para desafios específicos — sem
              fórmulas prontas ou promessas de resultado.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {areas.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-[1.4rem] border border-navy/8 bg-paper p-6 transition hover:border-teal/30 hover:bg-cream/55"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-4 border-l-2 border-terracotta pl-5">
              <Activity aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-terracotta" />
              <p className="text-sm leading-6 text-navy/68">
                Cada atendimento respeita suas condições atuais. Quando necessário, o cuidado é
                articulado com avaliação e acompanhamento de outros profissionais de saúde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
