import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

const content = {
  privacidade: {
    title: 'Política de privacidade',
    intro: 'Esta política explica, em linguagem direta, quais dados o Kamba usa nesta versão.',
    sections: [
      [
        'Dados tratados',
        'Nome, e-mail, sessão e o conteúdo que você insere nos quadros são tratados para prestar o serviço. Senhas são gerenciadas pelo Supabase Auth e não são gravadas nas tabelas do Kamba.',
      ],
      [
        'Compartilhamento',
        'O conteúdo de um quadro fica disponível apenas para o proprietário e os membros adicionados a ele. Não vendemos dados pessoais.',
      ],
      [
        'Segurança e retenção',
        'As políticas de acesso são aplicadas no banco. Você pode solicitar exclusão dos seus quadros e da conta; prazos legais de retenção podem ser aplicáveis.',
      ],
      [
        'Contato',
        'Antes de uma publicação comercial, inclua aqui o canal oficial do controlador e os dados exigidos pela legislação aplicável.',
      ],
    ],
  },
  termos: {
    title: 'Termos de uso',
    intro: 'Estes termos descrevem as regras básicas para usar a versão gratuita do Kamba.',
    sections: [
      [
        'Uso responsável',
        'Use o Kamba apenas para fins lícitos e não tente acessar quadros, contas ou dados sem autorização.',
      ],
      [
        'Disponibilidade',
        'Esta é uma versão inicial gratuita. Recursos podem mudar, e ainda não oferecemos garantia de disponibilidade contínua ou suporte com nível de serviço.',
      ],
      [
        'Seu conteúdo',
        'Você continua responsável pelo conteúdo inserido e por conceder acesso somente às pessoas adequadas.',
      ],
      [
        'Limitações',
        'Não use esta versão para dados críticos sem manter cópias apropriadas. Antes do lançamento comercial, estes termos devem passar por revisão jurídica.',
      ],
    ],
  },
};

export function LegalPage({ type }: { type: keyof typeof content }) {
  const page = content[type];
  return (
    <div className="min-h-dvh bg-[#fffaf5] px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link className="text-sm font-bold text-orange-700 hover:underline" to="/">
            Voltar ao início
          </Link>
        </div>
        <main className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
          <p className="eyebrow">Kamba</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{page.intro}</p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Última atualização: 31 de agosto de 2026.
          </p>
          <div className="mt-10 space-y-9">
            {page.sections.map(([title, text]) => (
              <section key={title}>
                <h2 className="text-xl font-extrabold">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
