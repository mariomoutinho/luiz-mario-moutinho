import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Columns3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

const demoColumns = [
  {
    title: 'Ideias',
    count: 2,
    cards: [
      { title: 'Mapear jornada de entrada', label: 'Pesquisa', color: '#0ea5e9' },
      { title: 'Revisar mensagens vazias', label: 'Conteúdo', color: '#8b5cf6' },
    ],
  },
  {
    title: 'Em andamento',
    count: 2,
    cards: [
      { title: 'Protótipo da navegação mobile', label: 'Prioridade', color: '#f97316' },
      { title: 'Validar contraste dos botões', label: 'Acessibilidade', color: '#10b981' },
    ],
  },
  {
    title: 'Concluído',
    count: 1,
    cards: [{ title: 'Objetivos do trimestre', label: 'Estratégia', color: '#eab308' }],
  },
];

const benefits = [
  {
    icon: Columns3,
    title: 'Fluxo que cabe no seu projeto',
    text: 'Monte colunas, mova cartões e enxergue o trabalho sem planilhas paralelas.',
  },
  {
    icon: UsersRound,
    title: 'Contexto compartilhado',
    text: 'Responsáveis, prazos, etiquetas e checklists mantêm cada entrega compreensível.',
  },
  {
    icon: ShieldCheck,
    title: 'Seus dados, suas permissões',
    text: 'O acesso é validado no banco e cada quadro fica restrito aos membros autorizados.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#fffaf5] text-slate-950">
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-orange-950/8 bg-[#fffaf5]/92 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <Link className="button-link button-link--ghost hidden sm:inline-flex" to="/entrar">
              Entrar
            </Link>
            <Link className="button-link button-link--primary" to="/cadastro">
              Criar conta grátis
            </Link>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:pt-24 lg:px-8 lg:pb-28">
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-2 text-xs font-extrabold tracking-wide text-orange-800 uppercase shadow-sm">
                <Sparkles className="size-4" aria-hidden="true" />
                Organização sem peso
              </span>
              <h1 className="mt-7 max-w-2xl text-5xl leading-[0.98] font-black tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
                Projetos em movimento, <span className="text-orange-600">sem perder o fio.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                O Kamba reúne tarefas, decisões e prazos em quadros claros para você e sua equipe
                saberem o que vem agora.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="button-link button-link--primary button-link--large"
                  to="/cadastro"
                >
                  Começar gratuitamente <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
                <a
                  className="button-link button-link--secondary button-link--large"
                  href="#como-funciona"
                >
                  Ver como funciona
                </a>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                <Check className="size-4 text-emerald-600" aria-hidden="true" />
                Gratuito nesta versão. Sem planos pagos escondidos.
              </p>
            </div>

            <div className="relative min-w-0" aria-label="Demonstração de um quadro Kamba">
              <div className="absolute -inset-5 -z-10 rotate-2 rounded-[2.5rem] bg-orange-200/45" />
              <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_32px_90px_rgba(120,53,15,0.18)]">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5">
                  <div>
                    <p className="text-xs font-bold text-orange-700">Produto</p>
                    <p className="font-extrabold">Experiência do cliente</p>
                  </div>
                  <div className="flex -space-x-2" aria-label="3 membros">
                    {['AM', 'BL', 'CS'].map((initials, index) => (
                      <span
                        key={initials}
                        className={`grid size-8 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold text-white ${['bg-orange-500', 'bg-sky-600', 'bg-violet-600'][index]}`}
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 overflow-hidden bg-slate-100/80 p-3 sm:p-4">
                  {demoColumns.map((column) => (
                    <div
                      key={column.title}
                      className="w-[78%] shrink-0 rounded-xl bg-slate-200/70 p-2.5 sm:w-[220px]"
                    >
                      <div className="mb-2.5 flex items-center justify-between px-1">
                        <span className="text-xs font-extrabold">{column.title}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          {column.count}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {column.cards.map((card) => (
                          <article
                            key={card.title}
                            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                          >
                            <span
                              className="inline-flex rounded-full px-2 py-1 text-[9px] font-extrabold text-white"
                              style={{ backgroundColor: card.color }}
                            >
                              {card.label}
                            </span>
                            <h2 className="mt-2 text-xs leading-5 font-bold">{card.title}</h2>
                            <div className="mt-3 flex items-center justify-between text-slate-400">
                              <span className="flex items-center gap-1 text-[9px]">
                                <Clock3 className="size-3" /> hoje
                              </span>
                              <MessageSquareText className="size-3.5" aria-hidden="true" />
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="eyebrow">Menos ruído, mais direção</p>
              <h2 className="section-title">
                Tudo que importa, no lugar em que o trabalho acontece.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-[#fffdf9] p-6 sm:p-7"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow">Como funciona</p>
              <h2 className="section-title">Do plano à entrega em três movimentos.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Comece pequeno e deixe o quadro ganhar forma conforme o projeto avança.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                ['01', 'Crie um quadro', 'Dê um nome ao projeto e organize as etapas em colunas.'],
                [
                  '02',
                  'Transforme trabalho em cartões',
                  'Registre contexto, responsável, prazo, etiquetas e checklist.',
                ],
                [
                  '03',
                  'Mova, filtre e conclua',
                  'Acompanhe prioridades e mantenha o time alinhado a cada mudança.',
                ],
              ].map(([number, title, text]) => (
                <li
                  key={number}
                  className="grid gap-4 rounded-2xl border border-orange-950/10 bg-white p-5 shadow-sm sm:grid-cols-[56px_1fr] sm:p-6"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold">{title}</h3>
                    <p className="mt-1 leading-7 text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16">
            <div className="max-w-2xl">
              <CheckCircle2 className="size-8 text-orange-400" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Seu próximo projeto pode começar mais claro.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Crie seu espaço, convide quem precisa participar e avance cartão por cartão.
              </p>
            </div>
            <Link className="button-link button-link--light mt-8 shrink-0 lg:mt-0" to="/cadastro">
              Criar minha conta <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3">
              © {new Date().getFullYear()} Kamba. Todos os direitos reservados.
            </p>
          </div>
          <nav className="flex gap-5" aria-label="Links legais">
            <Link className="footer-link" to="/privacidade">
              Política de privacidade
            </Link>
            <Link className="footer-link" to="/termos">
              Termos de uso
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
