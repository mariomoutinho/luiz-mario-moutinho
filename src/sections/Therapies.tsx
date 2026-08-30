import { MessageCircleMore } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { contactMessages } from '../data/contact';
import { therapies } from '../data/services';

export function Therapies() {
  return (
    <section id="terapias" className="soft-grid scroll-mt-20 bg-paper py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Terapias"
            title="Presença e técnica a serviço do seu bem-estar."
            description="Conheça os atendimentos e converse comigo para entender qual caminho pode ser mais adequado ao seu momento."
          />
          <WhatsAppButton
            message={contactMessages.therapies}
            variant="secondary"
            className="w-fit shrink-0"
          >
            <MessageCircleMore aria-hidden="true" className="size-[18px]" />
            Me ajude a escolher
          </WhatsAppButton>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {therapies.map((service, index) => (
            <ServiceCard key={service.id} service={service} featured={index === 0} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-ink-muted">
          Os benefícios descritos são possibilidades de cuidado e não representam promessa de cura
          ou garantia de resultado.
        </p>
      </div>
    </section>
  );
}
