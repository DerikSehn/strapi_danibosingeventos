import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getStrapiData(url: string) {
  try {
    const response = await fetch(getStrapiURL() + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://127.0.0.1:1337';
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${getStrapiURL()}${url}`;
}



export function generateWhatsAppLink({
  countryCode = '55',
  phoneNumber,
  message,
}: {
  countryCode?: string;
  phoneNumber: string;
  message: string;
}) {
  // Remove caracteres não numéricos do código do país e do número de telefone
  const cleanedCountryCode = countryCode?.replace(/\D/g, '');
  const cleanedPhoneNumber = phoneNumber?.replace(/\D/g, '');

  // Codifica a mensagem para o formato de URL
  const encodedMessage = encodeURIComponent(message);

  // Gera o link do WhatsApp
  const whatsappLink = `https://wa.me/${cleanedCountryCode}${cleanedPhoneNumber}?text=${encodedMessage}`;
  return whatsappLink;
}
