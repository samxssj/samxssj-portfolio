import { describe, it, expect } from 'vitest';
import { STACK } from '../../content/stack';
import { ICONS } from '../../components/three/keyboardIcons';

describe('content/stack', () => {
  it('ids únicos', () => {
    const ids = STACK.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('teclas físicas únicas y de un carácter', () => {
    const keys = STACK.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k).toMatch(/^[a-z]$/);
  });

  it('todo icono referenciado existe con path SVG', () => {
    for (const tech of STACK) {
      const icon = ICONS[tech.iconSlug];
      expect(icon, `falta icono ${tech.iconSlug}`).toBeDefined();
      expect(icon.path.length).toBeGreaterThan(10);
    }
  });

  it('experiencia en ambos idiomas', () => {
    for (const tech of STACK) {
      expect(tech.experience.es.length).toBeGreaterThan(10);
      expect(tech.experience.en.length).toBeGreaterThan(10);
    }
  });

  it('posiciones de teclado válidas (3 filas, sin solapes)', () => {
    const cells = STACK.map((s) => `${s.row}:${s.col}`);
    expect(new Set(cells).size).toBe(cells.length);
    for (const s of STACK) {
      expect(s.row).toBeGreaterThanOrEqual(0);
      expect(s.row).toBeLessThanOrEqual(2);
    }
  });
});
