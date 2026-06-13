import { describe, it, expect } from 'vitest';
import es from '../../messages/es.json';
import en from '../../messages/en.json';

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatKeys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe('mensajes i18n', () => {
  it('es y en tienen exactamente las mismas claves', () => {
    expect(flatKeys(es).sort()).toEqual(flatKeys(en).sort());
  });

  it('ningún valor vacío', () => {
    const all = [...flatKeys(es), ...flatKeys(en)];
    expect(all.length).toBeGreaterThan(0);
    const get = (obj: unknown, path: string) =>
      path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj);
    for (const key of flatKeys(es)) expect(get(es, key), `es:${key}`).toBeTruthy();
    for (const key of flatKeys(en)) expect(get(en, key), `en:${key}`).toBeTruthy();
  });
});
