'use server';

import { contactFormSchema, ContactFormValues } from "types/contact-form-values";

 
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function sendContactEmail(data: ContactFormValues): Promise<{ success: boolean; message: string; errors?: any }> {
  const validation = contactFormSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, message: "Erro de validação.", errors: validation.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/contact/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Falha ao enviar o email.' };
    }

    return { success: true, message: 'Email enviado com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
