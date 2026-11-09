'use server';

import { headers } from 'next/headers';
import { contactSchema } from '@/lib/contactSchema';
import { sendContactEmail } from '@/lib/email';
import { clientIpFrom, createRateLimiter } from '@/lib/rateLimit';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  /** campo → clave de mensaje en contact.validation */
  fieldErrors?: Record<string, string>;
  /** motivo de un error que no es de validación */
  reason?: 'rateLimited';
};

const MINUTE_MS = 60_000;

function envInt(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

// Dos límites: por IP frena a un abusón; el global protege la bandeja aunque roten IPs.
const perIpLimiter = createRateLimiter({
  max: envInt('CONTACT_RATE_IP_MAX', 3),
  windowMs: envInt('CONTACT_RATE_IP_WINDOW_MIN', 10) * MINUTE_MS,
});
const globalLimiter = createRateLimiter({
  max: envInt('CONTACT_RATE_GLOBAL_MAX', 30),
  windowMs: envInt('CONTACT_RATE_GLOBAL_WINDOW_MIN', 60) * MINUTE_MS,
});
const GLOBAL_KEY = 'all';

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

  // Solo cuentan los envíos válidos que llegarían a mandar correo.
  // peek antes de consumir para no gastar cupo de un límite si el otro bloquea.
  const ip = clientIpFrom(await headers());
  if (!perIpLimiter.peek(ip).allowed || !globalLimiter.peek(GLOBAL_KEY).allowed) {
    console.warn('contact: envío bloqueado por rate limit');
    return { status: 'error', reason: 'rateLimited' };
  }
  perIpLimiter.consume(ip);
  globalLimiter.consume(GLOBAL_KEY);

  try {
    await sendContactEmail(parsed.data);
    return { status: 'success' };
  } catch (err) {
    // nunca loguear el contenido del mensaje (dato del usuario)
    console.error('contact: fallo el envío:', err instanceof Error ? err.message : 'desconocido');
    return { status: 'error' };
  }
}
