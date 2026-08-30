import acupunctureImage from '../assets/images/acupuntura.webp';
import fascialImage from '../assets/images/liberacao-miofascial.webp';
import manipulationImage from '../assets/images/manipulacao-vertebral.webp';
import cuppingImage from '../assets/images/ventosaterapia.webp';

export type Therapy = {
  id: string;
  name: string;
  duration: string;
  description: string;
  indications: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  singlePrice: number;
  packageFour: number;
  packageTen: number;
  message: string;
};

export const therapies: Therapy[] = [
  {
    id: 'acupuntura',
    name: 'Acupuntura',
    duration: 'Aproximadamente 60 min',
    description:
      'Prática da Medicina Tradicional Chinesa que utiliza estímulos em pontos específicos do corpo para apoiar o equilíbrio do organismo.',
    indications:
      'Pode ser considerada por quem busca cuidado complementar para dores, estresse, tensões e bem-estar geral.',
    benefits: ['Alívio de tensões', 'Apoio no manejo da dor', 'Relaxamento e equilíbrio'],
    image: acupunctureImage,
    imageAlt: 'Aplicação cuidadosa de agulhas durante uma sessão de acupuntura.',
    singlePrice: 150,
    packageFour: 540,
    packageTen: 1200,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a acupuntura.',
  },
  {
    id: 'manipulacao-vertebral',
    name: 'Manipulação vertebral',
    duration: 'Aproximadamente 30 min',
    description:
      'Técnica manual direcionada à mobilidade articular e ao cuidado de regiões com rigidez ou desconforto postural.',
    indications:
      'Pode integrar o cuidado de pessoas com restrições de mobilidade, rigidez e tensões relacionadas à postura e ao movimento.',
    benefits: ['Mobilidade articular', 'Redução de rigidez', 'Conforto no movimento'],
    image: manipulationImage,
    imageAlt: 'Técnica manual aplicada com cuidado na região das costas.',
    singlePrice: 120,
    packageFour: 430,
    packageTen: 960,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a manipulação vertebral.',
  },
  {
    id: 'liberacao-miofascial',
    name: 'Liberação miofascial',
    duration: 'Aproximadamente 60 min',
    description:
      'Trabalho manual sobre as fáscias e os tecidos, com pressão e movimentos graduais adaptados à resposta de cada pessoa.',
    indications:
      'Indicada como cuidado complementar para tensões, restrições de movimento e recuperação após esforço físico.',
    benefits: ['Mobilidade dos tecidos', 'Alívio de tensões', 'Recuperação corporal'],
    image: fascialImage,
    imageAlt: 'Pressão manual controlada durante um atendimento corporal.',
    singlePrice: 150,
    packageFour: 540,
    packageTen: 1200,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a liberação miofascial.',
  },
  {
    id: 'ventosaterapia',
    name: 'Ventosaterapia',
    duration: 'Aproximadamente 30 min',
    description:
      'Técnica que utiliza ventosas para mobilizar os tecidos, favorecer o relaxamento muscular e estimular a circulação local.',
    indications:
      'Pode ser integrada ao cuidado de tensões musculares, sensação de rigidez e sobrecarga após atividades físicas.',
    benefits: ['Relaxamento muscular', 'Mobilização dos tecidos', 'Estímulo circulatório local'],
    image: cuppingImage,
    imageAlt: 'Ventosas transparentes aplicadas durante uma sessão de ventosaterapia.',
    singlePrice: 80,
    packageFour: 280,
    packageTen: 640,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a ventosaterapia.',
  },
];

export type TrainingService = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  details: string[];
  price: number;
  message: string;
  cta: string;
  icon: 'smartphone' | 'activity' | 'target';
};

export const trainingServices: TrainingService[] = [
  {
    id: 'mfit',
    title: 'Consultoria de musculação pelo MFIT',
    shortTitle: 'Consultoria MFIT',
    description:
      'Elaboração e acompanhamento do seu treino de musculação por meio do aplicativo MFIT.',
    details: ['Exercícios e orientações', 'Séries e repetições', 'Progressão e acompanhamento'],
    price: 180,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a consultoria de musculação pelo MFIT.',
    cta: 'Quero meu treino no MFIT',
    icon: 'smartphone',
  },
  {
    id: 'corrida',
    title: 'Funcional adaptado para corrida',
    shortTitle: 'Funcional para corrida',
    description:
      'Treinamento complementar para desenvolver qualidades importantes para uma corrida mais consistente.',
    details: ['Força e estabilidade', 'Mobilidade', 'Condicionamento físico'],
    price: 180,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre o treinamento funcional adaptado para corrida.',
    cta: 'Preparar minha corrida',
    icon: 'activity',
  },
  {
    id: 'taf',
    title: 'Preparação para teste físico — TAF',
    shortTitle: 'Preparação para TAF',
    description:
      'Planejamento orientado pelas exigências do edital, pelo seu nível atual e pela evolução individual.',
    details: ['Corrida e resistência', 'Força e abdominais', 'Flexões e barra, quando exigidas'],
    price: 180,
    message:
      'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a preparação para o TAF.',
    cta: 'Conversar sobre meu TAF',
    icon: 'target',
  },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
