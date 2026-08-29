export const PROFESSIONAL_NAME = 'Luiz Mario Moutinho';
export const WHATSAPP_NUMBER = '5581992579809';
export const WHATSAPP_DISPLAY = '(81) 99257-9809';
export const INSTAGRAM_HANDLE = '@moutinho.lm';
export const INSTAGRAM_URL = 'https://www.instagram.com/moutinho.lm/';
export const SERVICE_LOCATION = 'Atendimento a domicílio em Recife/PE';

export const contactMessages = {
  general:
    'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre os atendimentos.',
  therapies:
    'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber qual terapia é mais adequada para mim.',
  mfit: 'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a consultoria de musculação pelo MFIT.',
  running:
    'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre o treinamento funcional adaptado para corrida.',
  taf: 'Olá, Luiz! Conheci seu trabalho pelo site e gostaria de saber mais sobre a preparação para o TAF.',
} as const;

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
