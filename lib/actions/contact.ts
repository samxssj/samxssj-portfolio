'use server';

import { contactSchema } from '@/lib/contactSchema';
import { sendContactEmail } from '@/lib/email';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  /** campo → clave de mensaje en contact.validation */
  fieldErrors?: Record<string, string>;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) fieldErrors[field] = field;
    }
    return { status: 'error', fieldErrors };
  }

  // Honeypot relleno = bot: fingir éxito para no darle pistas
  if (parsed.data.website) return { status: 'success' };

  try {
    await sendContactEmail(parsed.data);
    return { status: 'success' };
  } catch (err) {
    // nunca loguear el contenido del mensaje (dato del usuario)
    console.error('contact: fallo el envío:', err instanceof Error ? err.message : 'desconocido');
    return { status: 'error' };
  }
}
