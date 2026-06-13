import { describe, it, expect } from 'vitest';
import { PROJECTS } from '../../content/projects';

describe('content/projects', () => {
  it('hay al menos 4 proyectos', () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(4);
  });

  it('ids únicos', () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('descripciones en ambos idiomas, no vacías', () => {
    for (const p of PROJECTS) {
      expect(p.description.es.length, p.id).toBeGreaterThan(20);
      expect(p.description.en.length, p.id).toBeGreaterThan(20);
    }
  });

  it('urls válidas cuando existen', () => {
    for (const p of PROJECTS) {
      if (p.demoUrl) expect(p.demoUrl).toMatch(/^https:\/\//);
      if (p.repoUrl) expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('imagen apunta a public/projects', () => {
    for (const p of PROJECTS) expect(p.image).toMatch(/^\/projects\/[\w-]+\.(png|webp|jpg)$/);
  });
});
