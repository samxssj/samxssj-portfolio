import { z } from 'zod';

// Inputs HTML mandan '' en vez de ausente: normalizar a null para que falle el required
const emptyToNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v);

export const contactSchema = z.object({
  name: z.preprocess(emptyToNull, z.string().min(1).max(100)),
  email: z.preprocess(emptyToNull, z.email().max(200)),
  message: z.preprocess(emptyToNull, z.string().min(10).max(5000)),
  /** honeypot: los humanos no lo ven, los bots lo rellenan */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
