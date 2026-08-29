import { ArrowUpRight, Clock3 } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { createWhatsAppUrl } from '../data/contact';
import { formatCurrency, therapies, trainingServices } from '../data/services';

type PriceRow = {
  id: string;
  service: string;
  duration: string;
  single: string;
  four: string;
  ten: string;
  message: string;
  savings?: { four: string; ten: string };
};

const therapyRows: PriceRow[] = therapies.map((therapy) => ({
  id: therapy.id,
  service: therapy.name,
  duration: therapy.duration.replace('Aproximadamente ', 'Aprox. '),
  single: formatCurrency(therapy.singlePrice),
  four: formatCurrency(therapy.packageFour),
  ten: formatCurrency(therapy.packageTen),
  message: therapy.message,
  savings: {
    four: `${formatCurrency(therapy.packageFour / 4)} / sessão`,
    ten: `${formatCurrency(therapy.packageTen / 10)} / sessão`,
  },
}));

const trainingRows: PriceRow[] = trainingServices.map((service) => ({
  id: service.id,
  service: service.shortTitle,
  duration: 'Consulte os detalhes',
  single: formatCurrency(service.price),
  four: 'Não se aplica',
  ten: 'Não se aplica',
  message: service.message,
}));

const rows = [...therapyRows, ...trainingRows];

export function Pricing() {
  return (
    <section id="valores" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Valores"
          title="Informação clara para você escolher com tranquilidade."
          description="Os pacotes reduzem o valor por sessão. Para treinamento e consultoria, confirme pelo WhatsApp a periodicidade e os detalhes do acompanhamento."
        />

        <div className="mt-12 hidden overflow-hidden rounded-[1.5rem] border border-navy/9 shadow-[0_18px_60px_rgba(11,33,40,0.06)] md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Tabela de preços dos serviços de Luiz Mario Moutinho
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                {[
                  'Serviço',
                  'Duração ou formato',
                  'Avulso / investimento',
                  'Pacote com 4',
                  'Pacote com 10',
                  'Ação',
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-4 text-xs font-extrabold tracking-wide uppercase lg:px-5"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-cream/55">
                  <th scope="row" className="px-4 py-5 text-sm font-extrabold text-navy lg:px-5">
                    {row.service}
                  </th>
                  <td className="px-4 py-5 text-sm text-ink-muted lg:px-5">{row.duration}</td>
                  <td className="px-4 py-5 text-sm font-bold text-navy lg:px-5">{row.single}</td>
                  <td className="px-4 py-5 text-sm font-bold text-navy lg:px-5">
                    {row.four}
                    {row.savings && (
                      <span className="mt-1 block text-[11px] font-semibold text-teal">
                        {row.savings.four}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-navy lg:px-5">
                    {row.ten}
                    {row.savings && (
                      <span className="mt-1 block text-[11px] font-semibold text-teal">
                        {row.savings.ten}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 lg:px-5">
                    <a
                      href={createWhatsAppUrl(row.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Conversar sobre ${row.service} no WhatsApp`}
                      className="grid size-11 place-items-center rounded-full bg-terracotta text-white transition hover:-translate-y-0.5 hover:bg-[#c87049] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
                    >
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 md:hidden">
          {rows.map((row) => (
            <article key={row.id} className="rounded-[1.4rem] border border-navy/9 bg-paper p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.16em] text-teal uppercase">
                    Serviço
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-navy">{row.service}</h3>
                </div>
                <a
                  href={createWhatsAppUrl(row.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Conversar sobre ${row.service} no WhatsApp`}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-terracotta text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
                >
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                <Clock3 aria-hidden="true" className="size-4 text-teal" />
                {row.duration}
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-navy/8 pt-4">
                <div>
                  <dt className="text-[9px] font-bold tracking-wide text-ink-muted uppercase">
                    Avulso
                  </dt>
                  <dd className="mt-1 text-sm font-extrabold text-navy">{row.single}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold tracking-wide text-ink-muted uppercase">
                    4 sessões
                  </dt>
                  <dd className="mt-1 text-sm font-extrabold text-navy">{row.four}</dd>
                  {row.savings && (
                    <dd className="mt-1 text-[10px] font-semibold text-teal">{row.savings.four}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-[9px] font-bold tracking-wide text-ink-muted uppercase">
                    10 sessões
                  </dt>
                  <dd className="mt-1 text-sm font-extrabold text-navy">{row.ten}</dd>
                  {row.savings && (
                    <dd className="mt-1 text-[10px] font-semibold text-teal">{row.savings.ten}</dd>
                  )}
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
