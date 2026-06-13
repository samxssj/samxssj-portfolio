import { describe, it, expect } from 'vitest';
import { contactSchema } from '../../lib/contactSchema';

const valid = {
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Hola, quiero una web para mi negocio.',
  website: '',
};

describe('contactSchema', () => {
  it('acepta input válido', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rechaza nombre vacío (string vacío → null, gotcha zod)', () => {
    const r = contactSchema.safeParse({ ...valid, name: '   ' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe('name');
  });

  it('rechaza email inválido', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'no-es-email' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe('email');
  });

  it('rechaza mensaje corto', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'corto' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe('message');
  });

  it('acepta honeypot relleno a nivel de schema (se gestiona en la action)', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'spam.com' }).success).toBe(true);
  });

  it('rechaza mensaje gigante (>5000)', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) });
    expect(r.success).toBe(false);
  });
});
