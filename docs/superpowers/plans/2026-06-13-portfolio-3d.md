# Portfolio 3D samxssj — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-pager de portfolio personal bilingüe (ES/EN) con avatar 3D en hero y teclado mecánico 3D interactivo en tech stack, desplegado en Vercel.

**Architecture:** Next.js 16 App Router con rutas `[locale]` vía next-intl. Secciones server components; escenas 3D client components con React Three Fiber montadas lazy por IntersectionObserver y protegidas por ErrorBoundary (fallback estático sin WebGL). Data tipada en `content/`, sin CMS. Contact form por Server Action → Resend con fallback Gmail SMTP.

**Tech Stack:** Next.js 16 · TypeScript estricto · Tailwind v4 · next-intl · @react-three/fiber + @react-three/drei + maath · simple-icons · Zod v4 · Resend + nodemailer · Vitest · Playwright · Montserrat (next/font).

**Spec:** `docs/superpowers/specs/2026-06-13-portfolio-3d-design.md`

**Reglas git del proyecto (obligatorias):** commits en español, presente, descriptivos. NUNCA añadir `Co-Authored-By` ni "Generated with Claude Code". Push y deploy SOLO con confirmación explícita de Samuel.

**Gotcha Next.js 16:** breaking changes vs entrenamiento. Antes de tocar routing/middleware, leer `node_modules/next/dist/docs/` (tras Task 1) y docs de next-intl vía context7. En particular: `params` es Promise (hay que `await`), y verificar si el middleware se llama `middleware.ts` o `proxy.ts` en Next 16.

---

## Fase 0 — Setup

### Task 1: Scaffold Next.js 16

**Files:**
- Create: proyecto Next.js en `/home/samuel/projects/samxssj-portfolio/` (la carpeta ya existe con `.git/` y `docs/`)
- Create: `.env.example`
- Create: `CLAUDE.md`

- [ ] **Step 1: Scaffold**

```bash
cd /home/samuel/projects/samxssj-portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: scaffold sin errores (create-next-app tolera `.git/` y `docs/` existentes). Si se queja de archivos en conflicto, listar cuáles y resolver — nunca borrar `docs/`.

- [ ] **Step 2: Verificar dev server**

```bash
npm run dev &
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Expected: `200`. Matar el server después.

- [ ] **Step 3: Leer docs de Next.js 16 instalado**

Leer por encima `node_modules/next/dist/docs/` (o el README de la versión instalada): confirmar nombre del archivo de middleware (`middleware.ts` vs `proxy.ts`), forma de `params` (Promise), y API de `next/font`. Anotar diferencias relevantes en `CLAUDE.md` del proyecto.

- [ ] **Step 4: Dependencias del proyecto**

```bash
npm install next-intl three @react-three/fiber @react-three/drei maath simple-icons zod resend nodemailer
npm install -D vitest vite-tsconfig-paths @types/three @types/nodemailer @playwright/test
```

Expected: instala sin conflictos de peer deps (R3F v9+ requiere React 19, que trae Next 16).

- [ ] **Step 5: `.env.example`**

```bash
# Email del formulario de contacto
# Destinatario de los mensajes del form
CONTACT_TO_EMAIL=samuelbermudez2812@gmail.com
# Remitente verificado en Resend (si no hay dominio, usar onboarding@resend.dev)
CONTACT_FROM_EMAIL=onboarding@resend.dev
# API key de Resend (https://resend.com/api-keys) — proveedor principal
RESEND_API_KEY=
# Fallback Gmail SMTP (app password, no la contraseña real)
SMTP_USER=
SMTP_PASS=
```

- [ ] **Step 6: `CLAUDE.md` del proyecto**

```markdown
# samxssj-portfolio

Portfolio 3D personal de Samuel (marca personal dev). One-pager bilingüe ES/EN.

- Spec: `docs/superpowers/specs/2026-06-13-portfolio-3d-design.md`
- Plan: `docs/superpowers/plans/2026-06-13-portfolio-3d.md`
- Stack: Next.js 16 + TS estricto + Tailwind v4 + next-intl + R3F/drei + Resend.
- 3D: avatar GLB en `public/models/avatar.glb` (pipeline Higgsfield), teclado 100% procedural.
- Tests: `npm test` (Vitest, solo `tests/unit/`), `npm run test:e2e` (Playwright, `e2e/`).
- Deploy: Vercel, directo desde `main`.

## Notas Next.js 16
(rellenar en Task 1 Step 3 con lo encontrado en node_modules/next/dist/docs)
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "scaffold Next.js 16 con dependencias del portfolio 3D"
```

### Task 2: Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts)
- Test: `tests/unit/smoke.test.ts`

- [ ] **Step 1: Config**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    // gotcha aprendido en NutriCita: excluir e2e o vitest intenta cargar specs de Playwright
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
```

- [ ] **Step 2: Scripts en `package.json`**

Añadir a `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 3: Test trivial para validar pipeline**

`tests/unit/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('vitest', () => {
  it('corre', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Verificar**

```bash
npm test
```

Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json tests/
git commit -m "add configuración de Vitest"
```

### Task 3: Tema Tailwind v4 + Montserrat

**Files:**
- Modify: `app/globals.css` (reemplazar contenido del scaffold)

- [ ] **Step 1: `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-montserrat), system-ui, sans-serif;

  /* fondo negro-violeta profundo; acento violeta hue 293 (no 264, se ve azul) */
  --color-bg: oklch(13% 0.02 293);
  --color-surface: oklch(17% 0.025 293);
  --color-surface-2: oklch(21% 0.03 293);
  --color-border-soft: oklch(100% 0 0 / 8%);
  --color-accent: oklch(54.1% 0.247 293);
  --color-accent-soft: oklch(54.1% 0.247 293 / 15%);
  --color-text: oklch(97% 0.005 293);
  --color-muted: oklch(70% 0.02 293);
  --color-ok: oklch(72% 0.19 145);
  --color-error: oklch(63% 0.21 25);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

/* foco visible sobre fondo oscuro — accesibilidad obligatoria */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Nota: Montserrat se carga con `next/font` en el layout de Task 4 (variable `--font-montserrat`). Si el scaffold trajo otros fonts (Geist), se eliminan en Task 4.

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: build OK (la página default del scaffold puede verse rara con el fondo oscuro — da igual, se reemplaza en Task 7).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "add tema oscuro violeta y tokens Tailwind v4"
```

---

## Fase 1 — i18n y data

### Task 4: next-intl completo

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`
- Create: `middleware.ts` (o `proxy.ts` según lo verificado en Task 1 Step 3)
- Create: `messages/es.json`, `messages/en.json`
- Modify: `next.config.ts`
- Create: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Delete: `app/layout.tsx`, `app/page.tsx` del scaffold (el root layout pasa a `app/[locale]/`)
- Test: `tests/unit/messages.test.ts`

Antes de codificar: consultar docs actuales de next-intl (context7, librería `next-intl`) — la API de `getRequestConfig`/`hasLocale` cambió entre v3 y v4.

- [ ] **Step 1: Test de paridad de mensajes (falla primero)**

`tests/unit/messages.test.ts`:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

```bash
npm test
```

Expected: FAIL — `messages/es.json` no existe.

- [ ] **Step 3: Mensajes completos**

`messages/es.json`:

```json
{
  "meta": {
    "title": "Samuel Bermúdez — Creative Developer",
    "description": "Portfolio 3D de Samuel Bermúdez (samxssj): desarrollador creativo full-stack. Next.js, React Three Fiber y TypeScript."
  },
  "nav": {
    "about": "Sobre mí",
    "stack": "Stack",
    "work": "Proyectos",
    "contact": "Contacto",
    "switchLocale": "Switch to English",
    "github": "GitHub de Samuel"
  },
  "hero": {
    "greeting": "Hola, soy",
    "name": "Samuel",
    "role1": "Creative",
    "role2": "Developer",
    "tagline": "Construyo webs que se sienten vivas.",
    "cta": "Ver proyectos",
    "scroll": "desliza"
  },
  "about": {
    "title": "Sobre mí",
    "bio": "Dev de Envigado, Colombia. Graduado en DAM y construyendo Synth Studio, mi propio estudio de desarrollo. Me obsesiona que las cosas se sientan bien: cada pixel, cada animación, cada milisegundo.",
    "card1Title": "Web apps",
    "card1Body": "Aplicaciones completas con Next.js, React y TypeScript: del diseño al deploy.",
    "card2Title": "SaaS",
    "card2Body": "Productos con auth, dashboards y datos en tiempo real sobre Supabase o PostgreSQL.",
    "card3Title": "E-commerce",
    "card3Body": "Tiendas rápidas y con personalidad, pensadas para convertir."
  },
  "stack": {
    "title": "Mi stack",
    "hint": "pista: pulsa una tecla",
    "fallback": "Tecnologías con las que trabajo a diario:"
  },
  "work": {
    "title": "Proyectos",
    "visit": "Ver demo",
    "code": "Código"
  },
  "contact": {
    "title": "Hablemos",
    "subtitle": "¿Tienes una idea? Cuéntamela.",
    "name": "Tu nombre",
    "namePlaceholder": "¿Cómo te llamas?",
    "email": "Tu email",
    "emailPlaceholder": "tu@email.com",
    "message": "Tu mensaje",
    "messagePlaceholder": "Cuéntame tu idea…",
    "send": "Enviar",
    "sending": "Enviando…",
    "success": "Mensaje enviado. Te respondo pronto.",
    "error": "No se pudo enviar. Escríbeme directo a {email}",
    "validation": {
      "name": "Escribe tu nombre",
      "email": "Ese email no parece válido",
      "message": "El mensaje necesita al menos 10 caracteres"
    }
  },
  "footer": {
    "made": "Hecho con Next.js + React Three Fiber",
    "rights": "© {year} Samuel Bermúdez"
  }
}
```

`messages/en.json`:

```json
{
  "meta": {
    "title": "Samuel Bermúdez — Creative Developer",
    "description": "3D portfolio of Samuel Bermúdez (samxssj): creative full-stack developer. Next.js, React Three Fiber and TypeScript."
  },
  "nav": {
    "about": "About",
    "stack": "Stack",
    "work": "Work",
    "contact": "Contact",
    "switchLocale": "Cambiar a español",
    "github": "Samuel's GitHub"
  },
  "hero": {
    "greeting": "Hi, I'm",
    "name": "Samuel",
    "role1": "Creative",
    "role2": "Developer",
    "tagline": "I build websites that feel alive.",
    "cta": "See my work",
    "scroll": "scroll"
  },
  "about": {
    "title": "About me",
    "bio": "Developer from Envigado, Colombia. DAM graduate building Synth Studio, my own dev studio. I'm obsessed with making things feel right: every pixel, every animation, every millisecond.",
    "card1Title": "Web apps",
    "card1Body": "Complete applications with Next.js, React and TypeScript: from design to deploy.",
    "card2Title": "SaaS",
    "card2Body": "Products with auth, dashboards and real-time data on Supabase or PostgreSQL.",
    "card3Title": "E-commerce",
    "card3Body": "Fast stores with personality, built to convert."
  },
  "stack": {
    "title": "My stack",
    "hint": "hint: press a key",
    "fallback": "Technologies I work with daily:"
  },
  "work": {
    "title": "Work",
    "visit": "Live demo",
    "code": "Code"
  },
  "contact": {
    "title": "Let's talk",
    "subtitle": "Got an idea? Tell me about it.",
    "name": "Your name",
    "namePlaceholder": "What's your name?",
    "email": "Your email",
    "emailPlaceholder": "you@email.com",
    "message": "Your message",
    "messagePlaceholder": "Tell me your idea…",
    "send": "Send",
    "sending": "Sending…",
    "success": "Message sent. I'll get back to you soon.",
    "error": "Couldn't send. Email me directly at {email}",
    "validation": {
      "name": "Please write your name",
      "email": "That email doesn't look valid",
      "message": "The message needs at least 10 characters"
    }
  },
  "footer": {
    "made": "Built with Next.js + React Three Fiber",
    "rights": "© {year} Samuel Bermúdez"
  }
}
```

- [ ] **Step 4: Verificar test de paridad**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Routing y request config**

`i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});
```

`i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

`i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

- [ ] **Step 6: Middleware (o proxy, según Task 1 Step 3)**

`middleware.ts` (renombrar a `proxy.ts` con el mismo contenido si Next 16 lo exige):

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 7: Plugin en `next.config.ts`**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 8: Layout localizado**

Borrar `app/page.tsx` y `app/layout.tsx` del scaffold. Crear `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-montserrat',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('title'), description: t('description') };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={montserrat.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`app/[locale]/page.tsx` (provisional, se completa en Task 8):

```tsx
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hero');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-extrabold">
        {t('greeting')} <span className="text-accent">{t('name')}</span>
      </h1>
    </main>
  );
}
```

- [ ] **Step 9: Verificar en dev**

```bash
npm run dev &
sleep 8
curl -s http://localhost:3000/es | grep -o 'Hola, soy' | head -1
curl -s http://localhost:3000/en | grep -o "Hi, I'm" | head -1
curl -s -o /dev/null -w "%{http_code}" -L http://localhost:3000/
```

Expected: `Hola, soy`, `Hi, I'm`, y redirect de `/` con código `200` final. Matar server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "add i18n bilingüe ES/EN con next-intl y layout localizado"
```

### Task 5: Data del stack (teclado)

**Files:**
- Create: `content/stack.ts`
- Create: `components/three/keyboardIcons.ts`
- Test: `tests/unit/stack.test.ts`

- [ ] **Step 1: Test (falla primero)**

`tests/unit/stack.test.ts`:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

```bash
npm test
```

Expected: FAIL — módulos no existen.

- [ ] **Step 3: Iconos**

`components/three/keyboardIcons.ts`:

```ts
// Mapa explícito (imports nombrados) para que tree-shaking no meta las 3000+ marcas de simple-icons
import {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siNodedotjs,
  siTailwindcss,
  siSupabase,
  siPostgresql,
  siPrisma,
  siDocker,
  siGit,
  siGithub,
  siVercel,
  siLinux,
} from 'simple-icons';

export type SimpleIcon = { path: string; hex: string; title: string };

export const ICONS: Record<string, SimpleIcon> = {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siNodedotjs,
  siTailwindcss,
  siSupabase,
  siPostgresql,
  siPrisma,
  siDocker,
  siGit,
  siGithub,
  siVercel,
  siLinux,
};
```

(Si algún import nombrado no existe en la versión instalada de simple-icons, el test del Step 1 y el compilador lo cazan — sustituir por la tecnología equivalente más cercana.)

- [ ] **Step 4: Data**

`content/stack.ts`:

```ts
export type TechKey = {
  id: string;
  label: string;
  /** tecla física que activa esta keycap */
  key: string;
  /** clave dentro de ICONS (components/three/keyboardIcons.ts) */
  iconSlug: string;
  /** color de marca para la cara superior de la keycap */
  color: string;
  row: number;
  col: number;
  experience: { es: string; en: string };
};

export const STACK: TechKey[] = [
  { id: 'typescript', label: 'TypeScript', key: 't', iconSlug: 'siTypescript', color: '#3178C6', row: 0, col: 0,
    experience: { es: 'Mi lenguaje por defecto. Modo estricto siempre, en todos los proyectos.', en: 'My default language. Strict mode always, in every project.' } },
  { id: 'javascript', label: 'JavaScript', key: 'j', iconSlug: 'siJavascript', color: '#F7DF1E', row: 0, col: 1,
    experience: { es: 'La base de todo lo que hago en web desde que empecé.', en: 'The foundation of everything I build for the web.' } },
  { id: 'react', label: 'React', key: 'r', iconSlug: 'siReact', color: '#61DAFB', row: 0, col: 2,
    experience: { es: 'Componentes, hooks, server components. Mi día a día.', en: 'Components, hooks, server components. My daily driver.' } },
  { id: 'nextjs', label: 'Next.js', key: 'n', iconSlug: 'siNextdotjs', color: '#171717', row: 0, col: 3,
    experience: { es: 'App Router, Server Actions y RSC. Framework de cabecera para todo proyecto nuevo.', en: 'App Router, Server Actions and RSC. My go-to framework for every new project.' } },
  { id: 'nodejs', label: 'Node.js', key: 'o', iconSlug: 'siNodedotjs', color: '#5FA04E', row: 0, col: 4,
    experience: { es: 'Backends, scripts y tooling. Node 22 en todos mis entornos.', en: 'Backends, scripts and tooling. Node 22 across all my environments.' } },
  { id: 'tailwind', label: 'Tailwind', key: 'w', iconSlug: 'siTailwindcss', color: '#06B6D4', row: 1, col: 0,
    experience: { es: 'v4 con OKLCH y design tokens. CSS rápido sin perder control.', en: 'v4 with OKLCH and design tokens. Fast CSS without losing control.' } },
  { id: 'supabase', label: 'Supabase', key: 's', iconSlug: 'siSupabase', color: '#3FCF8E', row: 1, col: 1,
    experience: { es: 'Auth + Postgres + RLS en producción (NutriCita).', en: 'Auth + Postgres + RLS in production (NutriCita).' } },
  { id: 'postgresql', label: 'PostgreSQL', key: 'p', iconSlug: 'siPostgresql', color: '#4169E1', row: 1, col: 2,
    experience: { es: 'Mi base de datos por defecto, en Docker o gestionada.', en: 'My default database, in Docker or managed.' } },
  { id: 'prisma', label: 'Prisma', key: 'm', iconSlug: 'siPrisma', color: '#2D3748', row: 1, col: 3,
    experience: { es: 'ORM tipado para modelar datos sin sorpresas.', en: 'Typed ORM to model data without surprises.' } },
  { id: 'docker', label: 'Docker', key: 'd', iconSlug: 'siDocker', color: '#2496ED', row: 1, col: 4,
    experience: { es: 'Compose en mi homelab tras Traefik. Todo containerizado.', en: 'Compose in my homelab behind Traefik. Everything containerized.' } },
  { id: 'git', label: 'Git', key: 'g', iconSlug: 'siGit', color: '#F05032', row: 2, col: 0,
    experience: { es: 'Commits descriptivos, ramas por feature, historia limpia.', en: 'Descriptive commits, feature branches, clean history.' } },
  { id: 'github', label: 'GitHub', key: 'h', iconSlug: 'siGithub', color: '#181717', row: 2, col: 1,
    experience: { es: 'Donde vive todo mi código: github.com/samxssj.', en: 'Where all my code lives: github.com/samxssj.' } },
  { id: 'vercel', label: 'Vercel', key: 'v', iconSlug: 'siVercel', color: '#000000', row: 2, col: 2,
    experience: { es: 'Deploy de todos mis proyectos de cara a cliente.', en: 'Where I deploy every client-facing project.' } },
  { id: 'linux', label: 'Linux', key: 'l', iconSlug: 'siLinux', color: '#FCC624', row: 2, col: 3,
    experience: { es: 'WSL2 + Ubuntu como entorno diario, homelab incluido.', en: 'WSL2 + Ubuntu as my daily environment, homelab included.' } },
];

/** filas con menos columnas se centran con offset */
export const COLS_PER_ROW = [5, 5, 4];
```

- [ ] **Step 5: Verificar tests**

```bash
npm test
```

Expected: PASS (todos).

- [ ] **Step 6: Commit**

```bash
git add content/stack.ts components/three/keyboardIcons.ts tests/unit/stack.test.ts
git commit -m "add data tipada del stack para el teclado 3D"
```

### Task 6: Data de proyectos

**Files:**
- Create: `content/projects.ts`
- Test: `tests/unit/projects.test.ts`

Antes de escribir las descripciones: leer `CLAUDE.md` de cada repo (`portfolio/NutriCita`, `GrapplersParadise`, `portfolio/Banking`, `portfolio/e-commerce-samx`, `portfolio/Q-Engine`, y el de RoninWear si existe — buscar con `ls /home/samuel/projects/`) y la nota del vault `Proyectos/MOC-Proyectos.md` para URLs de demo/repos y para afinar el copy. Las descripciones de abajo son el borrador a ajustar. Q-Engine: si tras leer su CLAUDE.md no es presentable (sin UI o sin demo posible), dejarlo fuera y quitarlo del test.

- [ ] **Step 1: Test (falla primero)**

`tests/unit/projects.test.ts`:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

```bash
npm test
```

Expected: FAIL — módulo no existe.

- [ ] **Step 3: Data (borrador a ajustar con lo leído en cada repo)**

`content/projects.ts`:

```ts
export type Project = {
  id: string;
  name: string;
  description: { es: string; en: string };
  stack: string[];
  /** screenshot en public/projects/ — se captura en la fase de contenido */
  image: string;
  demoUrl?: string;
  repoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'nutricita',
    name: 'NutriCita',
    description: {
      es: 'Sistema de reservas para una clínica de nutrición: agenda con slots por hora, panel de administración con estadísticas, fichas de pacientes con progreso de peso y emails transaccionales con identidad propia. En producción.',
      en: 'Booking system for a nutrition clinic: hourly slot scheduling, admin dashboard with statistics, patient records with weight progress and branded transactional emails. In production.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    image: '/projects/nutricita.png',
  },
  {
    id: 'grapplers-paradise',
    name: 'Grapplers Paradise',
    description: {
      es: 'Web y gestor de torneos para eventos de grappling: brackets, inscripciones y gestión de competidores para un cliente real.',
      en: 'Website and tournament manager for grappling events: brackets, registrations and competitor management for a real client.',
    },
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    image: '/projects/grapplers-paradise.png',
  },
  {
    id: 'roninwear',
    name: 'RoninWear',
    description: {
      es: 'Demo de e-commerce moderno para una marca de ropa de artes marciales: catálogo, carrito y una estética cuidada al detalle.',
      en: 'Modern e-commerce demo for a martial arts apparel brand: catalog, cart and a carefully crafted aesthetic.',
    },
    stack: ['Next.js 15', 'TypeScript', 'Tailwind'],
    image: '/projects/roninwear.png',
  },
  {
    id: 'banking',
    name: 'Banking Platform',
    description: {
      es: 'Plataforma de gestión para agencia con portal de clientes: dashboards, gestión de cuentas y vistas por cliente.',
      en: 'Agency management platform with client portal: dashboards, account management and per-client views.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma'],
    image: '/projects/banking.png',
  },
  {
    id: 'ecommerce-samx',
    name: 'E-commerce SamX',
    description: {
      es: 'Tienda online full-stack con frontend React, SEO con datos estructurados JSON-LD y backend propio.',
      en: 'Full-stack online store with a React frontend, JSON-LD structured data SEO and a custom backend.',
    },
    stack: ['React', 'Node.js', 'PostgreSQL'],
    image: '/projects/ecommerce-samx.png',
  },
];
```

(Añadir `demoUrl`/`repoUrl` reales según lo encontrado; añadir Q-Engine como sexta entrada si es presentable.)

- [ ] **Step 4: Verificar tests**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/projects.ts tests/unit/projects.test.ts
git commit -m "add data tipada de proyectos para la sección work"
```

---

## Fase 2 — Shell UI (sin 3D)

### Task 7: Primitivas UI

**Files:**
- Create: `components/ui/SectionHeading.tsx`
- Create: `components/ui/Badge.tsx`

- [ ] **Step 1: SectionHeading**

`components/ui/SectionHeading.tsx`:

```tsx
export function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-4xl font-extrabold tracking-tight text-text sm:text-5xl"
    >
      {children}
      <span className="text-accent">.</span>
    </h2>
  );
}
```

- [ ] **Step 2: Badge**

`components/ui/Badge.tsx`:

```tsx
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border-soft bg-surface px-3 py-1 text-xs font-semibold text-muted">
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/
git commit -m "add primitivas UI: SectionHeading y Badge"
```

### Task 8: Nav, Footer y esqueleto del one-pager

**Files:**
- Create: `components/sections/Nav.tsx`
- Create: `components/sections/Footer.tsx`
- Create: `components/ui/LocaleSwitcher.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: LocaleSwitcher (client)**

`components/ui/LocaleSwitcher.tsx`:

```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const other = locale === 'es' ? 'en' : 'es';

  return (
    <button
      type="button"
      aria-label={t('switchLocale')}
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded-full border border-border-soft px-3 py-1 text-xs font-semibold uppercase text-muted transition-colors duration-150 ease-out hover:border-accent hover:text-text active:scale-[0.97]"
    >
      {other}
    </button>
  );
}
```

- [ ] **Step 2: Nav**

`components/sections/Nav.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

const ANCHORS = ['about', 'stack', 'work', 'contact'] as const;

export function Nav() {
  const t = useTranslations('nav');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-soft bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="text-sm font-extrabold tracking-tight">
          samxssj<span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-5 sm:flex">
            {ANCHORS.map((a) => (
              <li key={a}>
                <a
                  href={`#${a}`}
                  className="text-xs font-semibold uppercase tracking-wide text-muted transition-colors duration-150 ease-out hover:text-text"
                >
                  {t(a)}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/samxssj"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('github')}
            className="text-muted transition-colors duration-150 ease-out hover:text-text"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Footer**

`components/sections/Footer.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border-soft py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted sm:flex-row">
        <p>{t('rights', { year: new Date().getFullYear() })}</p>
        <p>{t('made')}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Esqueleto del one-pager**

`app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top">
      <Nav />
      <main>
        {/* Las secciones se montan en sus tareas: Hero (12), About (9), TechStack (14), Work (10), Contact (11) */}
        <section id="hero-placeholder" className="flex min-h-screen items-center justify-center">
          <p className="text-muted">hero</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Verificar en dev**

```bash
npm run dev &
sleep 8 && curl -s http://localhost:3000/es | grep -c 'samxssj'
```

Expected: ≥ 1. Matar server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "add nav con switcher de idioma, footer y esqueleto del one-pager"
```

### Task 9: Sección About

**Files:**
- Create: `components/sections/About.tsx`
- Modify: `app/[locale]/page.tsx` (montar sección)

- [ ] **Step 1: Componente**

`components/sections/About.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/ui/SectionHeading';

const CARDS = [
  { title: 'card1Title', body: 'card1Body' },
  { title: 'card2Title', body: 'card2Body' },
  { title: 'card3Title', body: 'card3Body' },
] as const;

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading>{t('title')}</SectionHeading>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t('bio')}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-border-soft bg-surface p-6 transition-colors duration-200 ease-out hover:border-accent/40"
          >
            <h3 className="text-base font-extrabold">{t(card.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t(card.body)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Montar en page**

En `app/[locale]/page.tsx`, importar y colocar `<About />` después del placeholder del hero:

```tsx
import { About } from '@/components/sections/About';
```

```tsx
      <main>
        <section id="hero-placeholder" className="flex min-h-screen items-center justify-center">
          <p className="text-muted">hero</p>
        </section>
        <About />
      </main>
```

- [ ] **Step 3: Verificar en dev (ambos idiomas)**

```bash
npm run dev &
sleep 8
curl -s http://localhost:3000/es | grep -c 'Sobre mí'
curl -s http://localhost:3000/en | grep -c 'About me'
```

Expected: ≥ 1 cada uno. Matar server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "add sección about con bio y cards de servicios"
```

### Task 10: Sección Work

**Files:**
- Create: `components/sections/Work.tsx`
- Create: `components/ui/TiltCard.tsx`
- Modify: `app/[locale]/page.tsx`
- Create: `public/projects/.gitkeep` (screenshots llegan en Task 17)

- [ ] **Step 1: TiltCard (client, tilt 3D con CSS)**

`components/ui/TiltCard.tsx`:

```tsx
'use client';

import { useRef } from 'react';

/** Tilt 3D sutil siguiendo el cursor. Respeta prefers-reduced-motion. */
export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Work**

`components/sections/Work.tsx`:

```tsx
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { PROJECTS } from '@/content/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';

export function Work() {
  const t = useTranslations('work');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <TiltCard key={project.id}>
            <article className="overflow-hidden rounded-2xl border border-border-soft bg-surface">
              <div className="relative aspect-[16/10] bg-surface-2">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold">{project.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.description[locale]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
                <div className="mt-5 flex gap-4 text-sm font-semibold">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent transition-colors duration-150 ease-out hover:text-text"
                    >
                      {t('visit')} ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors duration-150 ease-out hover:text-text"
                    >
                      {t('code')} ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Montar en page** (después de About; los screenshots aún no existen — `next/image` dará 404 en dev, aceptable hasta Task 17; si el build de producción falla por imágenes faltantes, crear PNGs vacíos de 1×1 como provisionales)

```tsx
import { Work } from '@/components/sections/Work';
```

```tsx
        <About />
        <Work />
```

- [ ] **Step 4: Verificar**

```bash
npm run dev &
sleep 8 && curl -s http://localhost:3000/es | grep -c 'NutriCita'
```

Expected: ≥ 1. Matar server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "add sección work con cards de proyecto y tilt 3D"
```

### Task 11: Contact (schema TDD + email + Server Action + form)

**Files:**
- Create: `lib/contactSchema.ts`
- Create: `lib/email.ts`
- Create: `lib/actions/contact.ts`
- Create: `components/sections/Contact.tsx`
- Modify: `app/[locale]/page.tsx`
- Test: `tests/unit/contactSchema.test.ts`

Antes de codificar: verificar API de Zod v4 instalada (¿`z.email()` o `z.string().email()`?) vía context7 o `node_modules/zod/README.md`. El código de abajo asume v4 (`z.email()`).

- [ ] **Step 1: Test del schema (falla primero)**

`tests/unit/contactSchema.test.ts`:

```ts
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
```

- [ ] **Step 2: Verificar que falla**

```bash
npm test
```

Expected: FAIL — módulo no existe.

- [ ] **Step 3: Schema**

`lib/contactSchema.ts`:

```ts
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
```

- [ ] **Step 4: Verificar tests del schema**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Envío de email con fallback**

`lib/email.ts`:

```ts
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

type ContactPayload = { name: string; email: string; message: string };

/**
 * Envía el mensaje del form: Resend primero, Gmail SMTP de fallback.
 * Lanza error si ningún proveedor está configurado o ambos fallan.
 */
export async function sendContactEmail({ name, email, message }: ContactPayload): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error('CONTACT_TO_EMAIL no configurado');

  const subject = `Portfolio: mensaje de ${name}`;
  const text = `De: ${name} <${email}>\n\n${message}`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
      to,
      replyTo: email,
      subject,
      text,
    });
    if (!error) return;
    console.error('contact: Resend falló, probando SMTP', error.message);
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({ from: process.env.SMTP_USER, to, replyTo: email, subject, text });
    return;
  }

  throw new Error('Sin proveedor de email configurado');
}
```

- [ ] **Step 6: Server Action**

`lib/actions/contact.ts`:

```ts
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
```

- [ ] **Step 7: Form (client, useActionState de React 19)**

`components/sections/Contact.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactState } from '@/lib/actions/contact';
import { SectionHeading } from '@/components/ui/SectionHeading';

const CONTACT_EMAIL = 'samuelbermudez2812@gmail.com';

const initialState: ContactState = { status: 'idle' };

export function Contact() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  const fieldError = (field: string) =>
    state.status === 'error' && state.fieldErrors?.[field] ? (
      <p role="alert" className="mt-1 text-xs font-semibold text-error">
        {t(`validation.${field}`)}
      </p>
    ) : null;

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading>{t('title')}</SectionHeading>
      <p className="mt-4 text-muted">{t('subtitle')}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_auto]">
        <form action={formAction} className="max-w-xl space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              {t('name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t('namePlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('name')}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-semibold">
              {t('message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t('messagePlaceholder')}
              className="mt-1 w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm placeholder:text-muted/60 focus:border-accent"
            />
            {fieldError('message')}
          </div>

          {/* honeypot: oculto para humanos, irresistible para bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-white transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {pending ? t('sending') : t('send')}
          </button>

          <div aria-live="polite">
            {state.status === 'success' && (
              <p className="text-sm font-semibold text-ok">{t('success')}</p>
            )}
            {state.status === 'error' && !state.fieldErrors && (
              <p className="text-sm font-semibold text-error">
                {t('error', { email: CONTACT_EMAIL })}
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-3 text-sm">
          <a
            href="https://github.com/samxssj"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-semibold text-muted transition-colors duration-150 ease-out hover:text-text"
          >
            GitHub ↗
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="block font-semibold text-muted transition-colors duration-150 ease-out hover:text-text"
          >
            {CONTACT_EMAIL}
          </a>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Montar en page** (después de Work)

```tsx
import { Contact } from '@/components/sections/Contact';
```

```tsx
        <Work />
        <Contact />
```

- [ ] **Step 9: Verificar manual en dev**

```bash
npm run dev &
sleep 8 && curl -s http://localhost:3000/es | grep -c 'Hablemos'
```

Expected: ≥ 1. Probar también en navegador: submit vacío → errores por campo. Matar server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "add formulario de contacto con server action, zod, resend y honeypot"
```

### Task 12: Sección Hero (texto; el avatar 3D llega en Task 16)

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/[locale]/page.tsx` (reemplazar placeholder)

- [ ] **Step 1: Componente**

`components/sections/Hero.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export function Hero({ scene }: { scene?: React.ReactNode }) {
  const t = useTranslations('hero');

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* hueco central para la escena 3D del avatar (Task 16) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {scene}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 text-center sm:grid-cols-[1fr_minmax(220px,360px)_1fr] sm:text-left">
        <div className="sm:justify-self-end sm:text-right">
          <p className="text-lg font-semibold text-muted">{t('greeting')}</p>
          <p className="text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">
            {t('name')}
          </p>
        </div>

        {/* columna central vacía: deja respirar al avatar */}
        <div className="hidden sm:block" />

        <div>
          <p className="text-5xl font-extrabold leading-none tracking-tight text-accent sm:text-7xl">
            {t('role1')}
          </p>
          <p className="text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">
            {t('role2')}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-4">
        <p className="max-w-md px-6 text-center text-sm text-muted">{t('tagline')}</p>
        <a
          href="#work"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-white transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.97]"
        >
          {t('cta')}
        </a>
        <span className="animate-bounce text-xs uppercase tracking-widest text-muted/60">
          ↓ {t('scroll')}
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Reemplazar placeholder en page**

```tsx
import { Hero } from '@/components/sections/Hero';
```

```tsx
      <main>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev &
sleep 8
curl -s http://localhost:3000/es | grep -c 'Hola, soy'
curl -s http://localhost:3000/en | grep -c 'Creative'
```

Expected: ≥ 1 cada uno. Revisar en navegador que el layout partido se ve bien en móvil (columnas colapsan a vertical). Matar server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "add hero con tipografía partida y hueco para escena 3D"
```

---

## Fase 3 — 3D

### Task 13: LazyMount + CanvasBoundary

**Files:**
- Create: `components/three/LazyCanvas.tsx`

- [ ] **Step 1: Componente**

`components/three/LazyCanvas.tsx`:

```tsx
'use client';

import { Component, type ReactNode, useEffect, useRef, useState } from 'react';

/** Monta children solo cuando el contenedor entra en viewport (+margen de precarga). */
export function LazyMount({
  children,
  placeholder,
  rootMargin = '300px',
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? children : (placeholder ?? null)}
    </div>
  );
}

/** Si WebGL revienta (móvil viejo, driver raro), cae al fallback estático. */
export class CanvasBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** true si el usuario pide menos movimiento — las escenas congelan animaciones */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/three/LazyCanvas.tsx
git commit -m "add lazy mount, error boundary y hook reduced-motion para escenas 3D"
```

### Task 14: Teclado mecánico 3D

**Files:**
- Create: `components/three/KeyboardScene.tsx`
- Create: `components/sections/TechStack.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Escena del teclado completa**

`components/three/KeyboardScene.tsx`:

```tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { STACK, COLS_PER_ROW, type TechKey } from '@/content/stack';
import { ICONS } from './keyboardIcons';

const KEY_SIZE = 1;
const GAP = 0.18;
const PITCH = KEY_SIZE + GAP;
const MAX_COLS = Math.max(...COLS_PER_ROW);
const ROWS = COLS_PER_ROW.length;

export function keyPosition(row: number, col: number): [number, number, number] {
  // filas con menos teclas se centran con medio paso de offset
  const offset = (MAX_COLS - COLS_PER_ROW[row]) / 2;
  const x = (col + offset) * PITCH - ((MAX_COLS - 1) * PITCH) / 2;
  const z = row * PITCH - ((ROWS - 1) * PITCH) / 2;
  return [x, 0, z];
}

function useIconTexture(tech: TechKey): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = tech.color;
    ctx.fillRect(0, 0, 256, 256);
    // simple-icons usa viewBox 24×24 → icono de 150px centrado
    ctx.translate(53, 53);
    ctx.scale(6.25, 6.25);
    // blanco sobre marcas oscuras, negro sobre marcas claras (JS amarillo, Linux…)
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(tech.color.slice(1 + i, 3 + i), 16));
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    ctx.fillStyle = luminance > 160 ? '#111111' : '#ffffff';
    ctx.fill(new Path2D(ICONS[tech.iconSlug].path));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [tech]);
}

function Keycap({
  tech,
  pressed,
  active,
  onActivate,
  locale,
}: {
  tech: TechKey;
  pressed: boolean;
  active: boolean;
  onActivate: (id: string | null) => void;
  locale: 'es' | 'en';
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useIconTexture(tech);
  const [x, , z] = keyPosition(tech.row, tech.col);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!group.current) return;
    easing.damp(group.current.position, 'y', pressed ? -0.18 : 0, 0.06, delta);
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      <RoundedBox
        args={[KEY_SIZE, 0.55, KEY_SIZE]}
        radius={0.08}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(active ? null : tech.id);
        }}
      >
        <meshStandardMaterial color={hovered ? '#3d3552' : '#262033'} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.281, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {active && (
        <Html position={[0, 0.9, 0]} center distanceFactor={8} occlude={false}>
          <div className="w-56 origin-bottom scale-100 rounded-xl border border-border-soft bg-surface/95 p-3 text-center shadow-none backdrop-blur-sm">
            <p className="text-xs font-extrabold text-text">{tech.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted">{tech.experience[locale]}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function KeyboardModel({ locale, reducedMotion }: { locale: 'es' | 'en'; reducedMotion: boolean }) {
  const board = useRef<THREE.Group>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // teclas físicas: solo si no hay un input/textarea enfocado
  useEffect(() => {
    function isTypingTarget() {
      const el = document.activeElement;
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    }
    function onDown(e: KeyboardEvent) {
      if (isTypingTarget() || e.metaKey || e.ctrlKey || e.altKey) return;
      const tech = STACK.find((s) => s.key === e.key.toLowerCase());
      if (!tech) return;
      setPressedId(tech.id);
      setActiveId(tech.id);
    }
    function onUp() {
      setPressedId(null);
    }
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!board.current || reducedMotion) return;
    easing.dampE(
      board.current.rotation,
      [state.pointer.y * 0.06, state.pointer.x * 0.12, 0],
      0.3,
      delta,
    );
  });

  const plateWidth = MAX_COLS * PITCH + 0.5;
  const plateDepth = ROWS * PITCH + 0.5;

  return (
    <group ref={board} rotation={[0.12, 0, 0]} onPointerMissed={() => setActiveId(null)}>
      <RoundedBox args={[plateWidth, 0.4, plateDepth]} radius={0.12} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#16121f" roughness={0.5} />
      </RoundedBox>
      {STACK.map((tech) => (
        <Keycap
          key={tech.id}
          tech={tech}
          locale={locale}
          pressed={pressedId === tech.id || activeId === tech.id}
          active={activeId === tech.id}
          onActivate={setActiveId}
        />
      ))}
    </group>
  );
}

export default function KeyboardScene({
  locale,
  reducedMotion,
}: {
  locale: 'es' | 'en';
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 6.2, 5.4], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 4]} intensity={1.4} />
      <pointLight position={[-4, 3, -2]} intensity={8} color="#7c3aed" />
      <KeyboardModel locale={locale} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Sección TechStack con lazy mount y fallback**

`components/sections/TechStack.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { LazyMount, CanvasBoundary, usePrefersReducedMotion } from '@/components/three/LazyCanvas';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { STACK } from '@/content/stack';

const KeyboardScene = dynamic(() => import('@/components/three/KeyboardScene'), { ssr: false });

function StackFallback() {
  const t = useTranslations('stack');
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <p className="text-sm text-muted">{t('fallback')}</p>
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {STACK.map((tech) => (
          <Badge key={tech.id}>{tech.label}</Badge>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const t = useTranslations('stack');
  const locale = useLocale() as 'es' | 'en';
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="stack" className="mx-auto max-w-6xl px-6 py-28">
      <div className="text-center">
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-3 text-xs uppercase tracking-widest text-muted/70">{t('hint')}</p>
      </div>
      <div className="mt-10 h-[420px] sm:h-[480px]">
        <LazyMount placeholder={<StackFallback />}>
          <CanvasBoundary fallback={<StackFallback />}>
            <KeyboardScene locale={locale} reducedMotion={reducedMotion} />
          </CanvasBoundary>
        </LazyMount>
      </div>
      {/* contenido textual real para lectores de pantalla y SEO: el 3D nunca es la única fuente */}
      <ul className="sr-only">
        {STACK.map((tech) => (
          <li key={tech.id}>
            {tech.label}: {tech.experience[locale]}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Montar en page** (entre About y Work)

```tsx
import { TechStack } from '@/components/sections/TechStack';
```

```tsx
        <About />
        <TechStack />
        <Work />
```

- [ ] **Step 4: Verificar en navegador (obligatorio, no solo curl)**

```bash
npm run dev
```

Con Playwright MCP o navegador: abrir `http://localhost:3000/es`, scroll a Stack. Verificar: teclado renderiza, hover cambia color de keycap, click baja keycap y muestra tooltip, tecla física `t` activa TypeScript, tooltip se cierra clicando fuera. Verificar que escribir en el form de contacto NO dispara el teclado 3D.

- [ ] **Step 5: tsc + tests**

```bash
npx tsc --noEmit && npm test
```

Expected: limpio + tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "add teclado mecánico 3D interactivo con keycaps del stack"
```

### Task 15: Assets del avatar (Higgsfield) — TAREA DE SESIÓN PRINCIPAL

⚠️ Esta tarea la ejecuta la sesión principal (tiene los MCP de Higgsfield), NO un subagente. Tiene gate de aprobación de Samuel.

**Files:**
- Create: `public/models/avatar.glb` (resultado final)

- [ ] **Step 1: Concept art del personaje**

Con `mcp__higgsfield__generate_image`: personaje 3D cartoon estilo Pixar/blind-box, cuerpo entero, chico ~20 años, pelo oscuro rizado, hoodie violeta #7c3aed, audífonos al cuello, zapatillas blancas, sonrisa pícara, fondo neutro liso, iluminación de estudio, vista frontal y vista 3/4 (dos generaciones). Estética premium, sin texto.

- [ ] **Step 2: GATE — aprobación de Samuel**

Mostrar concepts a Samuel. Iterar hasta OK explícito. No continuar sin aprobación.

- [ ] **Step 3: Imagen → modelo 3D**

Con `mcp__higgsfield__generate_3d` sobre el concept aprobado → GLB. Descargar a `public/models/avatar.glb`.

- [ ] **Step 4: Optimizar**

```bash
npx @gltf-transform/cli optimize public/models/avatar.glb public/models/avatar.glb --compress draco --texture-compress webp
ls -la public/models/avatar.glb
```

Expected: GLB < 3 MB (idealmente < 1.5 MB).

- [ ] **Step 5: Evaluar calidad del mesh**

Cargarlo en la escena de Task 16 (o en https://gltf-viewer.donmccurdy.com/ vía navegador). Si la calidad no da (caras rotas, texturas sucias): **fallback** — `remove_background` sobre el concept aprobado → PNG del personaje en `public/avatar.png`, y en Task 16 usar la variante de parallax por capas (incluida allí).

- [ ] **Step 6: Commit**

```bash
git add public/models/ 
git commit -m "add modelo 3D del avatar generado con higgsfield"
```

### Task 16: Escena del avatar en el hero

**Files:**
- Create: `components/three/AvatarScene.tsx`
- Create: `components/sections/HeroScene.tsx`
- Modify: `app/[locale]/page.tsx` (pasar escena al Hero)

- [ ] **Step 1: Escena**

`components/three/AvatarScene.tsx`:

```tsx
'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Stars, Center } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

function Avatar({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/avatar.glb');

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    // el avatar "mira" al cursor con amortiguación suave
    easing.dampE(
      group.current.rotation,
      [state.pointer.y * -0.12, state.pointer.x * 0.45, 0],
      0.25,
      delta,
    );
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.6}
      rotationIntensity={reducedMotion ? 0 : 0.15}
      floatIntensity={reducedMotion ? 0 : 0.4}
    >
      <group ref={group}>
        {/* Center normaliza el origen del GLB; escala ajustada a ojo tras ver el modelo real */}
        <Center>
          <primitive object={scene} scale={2.2} />
        </Center>
      </group>
    </Float>
  );
}

useGLTF.preload('/models/avatar.glb');

export default function AvatarScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 4.2], fov: 35 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-3, 1, -2]} intensity={10} color="#7c3aed" />
      <Stars radius={60} depth={40} count={1200} factor={3} saturation={0} fade speed={reducedMotion ? 0 : 0.6} />
      <Suspense fallback={null}>
        <Avatar reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
```

Nota: `scale={2.2}` y la cámara son punto de partida — ajustar a ojo con el GLB real hasta que el avatar ocupe la columna central del hero sin tapar el texto.

**Variante fallback (solo si Task 15 Step 5 descartó el GLB):** en vez de `AvatarScene`, crear `components/sections/AvatarParallax.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { useRef } from 'react';

export function AvatarParallax() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    el.style.transform = `translate(${px * 14}px, ${py * 10}px) rotateY(${px * 6}deg)`;
  }

  return (
    <div className="flex h-full items-center justify-center" onMouseMove={handleMove}>
      <div ref={ref} className="relative h-[420px] w-[300px] transition-transform duration-200 ease-out will-change-transform">
        <Image src="/avatar.png" alt="" fill priority className="object-contain" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wrapper client para el hero**

`components/sections/HeroScene.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { CanvasBoundary, usePrefersReducedMotion } from '@/components/three/LazyCanvas';

const AvatarScene = dynamic(() => import('@/components/three/AvatarScene'), { ssr: false });

export function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="h-full w-full">
      <CanvasBoundary fallback={null}>
        <AvatarScene reducedMotion={reducedMotion} />
      </CanvasBoundary>
    </div>
  );
}
```

(El hero está above-the-fold: no necesita LazyMount, pero el `dynamic import` con `ssr: false` ya saca three.js del bundle inicial. El fallback `null` deja el hero tipográfico limpio si WebGL falla.)

- [ ] **Step 3: Pasar escena al Hero en page**

```tsx
import { HeroScene } from '@/components/sections/HeroScene';
```

```tsx
        <Hero scene={<HeroScene />} />
```

Y en `Hero.tsx` quitar `pointer-events-none` del contenedor de la escena (el avatar debe recibir el movimiento del cursor — el Canvas de R3F escucha en window para `pointer`, así que `pointer-events-none` puede quedarse; verificar en navegador que el cursor-follow funciona con él puesto, y quitarlo solo si no).

- [ ] **Step 4: Verificar en navegador**

`npm run dev` → `http://localhost:3000/es`: avatar visible y centrado, sigue el cursor, flota; texto legible encima; starfield sutil; sin jank de scroll. Probar también con `prefers-reduced-motion` activado (DevTools → Rendering): todo estático.

- [ ] **Step 5: tsc + tests**

```bash
npx tsc --noEmit && npm test
```

Expected: limpio.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "add escena del avatar 3D en el hero con cursor-follow y starfield"
```

---

## Fase 4 — Contenido y polish

### Task 17: Screenshots de proyectos

**Files:**
- Create: `public/projects/nutricita.png`, `grapplers-paradise.png`, `roninwear.png`, `banking.png`, `ecommerce-samx.png` (+ `q-engine.png` si entró)

- [ ] **Step 1: Localizar URLs**

Para cada proyecto de `content/projects.ts`: URL de producción en su `CLAUDE.md` o en el vault (`Proyectos/`). Si no hay deploy, levantar su dev server local.

- [ ] **Step 2: Capturar**

Por proyecto (con el server o URL viva):

```bash
npx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=4000 "<URL>" public/projects/<id>.png
```

Para los que no se puedan levantar: generar imagen hero del proyecto con Higgsfield `generate_image` (mockup de browser con la UI del proyecto, estilo limpio) como último recurso.

- [ ] **Step 3: Optimizar peso**

```bash
ls -la public/projects/
```

Si algún PNG > 400 KB, convertir a WebP (y actualizar la extensión en `content/projects.ts` — el test de Task 6 acepta `.webp`):

```bash
npx sharp-cli -i public/projects/<id>.png -o public/projects/<id>.webp
rm public/projects/<id>.png
```

- [ ] **Step 4: Verificar tests + dev**

```bash
npm test
npm run dev &
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/_next/image?url=%2Fprojects%2Fnutricita.png&w=828&q=75
```

Expected: tests PASS; imagen sirve `200` (ajustar extensión en la URL si fue webp). Matar server.

- [ ] **Step 5: Commit**

```bash
git add public/projects/ content/projects.ts
git commit -m "add screenshots reales de los proyectos"
```

### Task 18: Motion polish + a11y

**Files:**
- Create: `components/ui/Reveal.tsx`
- Modify: `components/sections/About.tsx`, `Work.tsx`, `Contact.tsx`, `TechStack.tsx` (envolver contenido en Reveal)

- [ ] **Step 1: Reveal on scroll (CSS + IntersectionObserver, sin GSAP)**

`components/ui/Reveal.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

/** Aparece con scale(0.95)+opacity:0 → ease-out al entrar en viewport. Regla Emil: las cosas salen, no entran. */
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
        transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Envolver secciones**

En `About.tsx`: envolver cada card del grid en `<Reveal delay={i * 80}>` (convertir el `.map` para tener índice). About es server component y Reveal es client — válido (children server pasan a client). En `Work.tsx`: envolver cada `<TiltCard>` en `<Reveal delay={i * 80}>`. En `Contact.tsx` y `TechStack.tsx`: envolver el bloque principal en `<Reveal>`.

- [ ] **Step 3: Pass de a11y manual**

Con navegador: recorrer toda la página solo con Tab — todo interactivo alcanzable y con foco visible; tooltips del teclado no atrapan foco; `aria-live` del form anuncia resultado; contraste del texto muted sobre bg ≥ 4.5:1 (verificar con DevTools; si falla, subir lightness de `--color-muted`).

- [ ] **Step 4: tsc + tests + verificación visual**

```bash
npx tsc --noEmit && npm test
```

Expected: limpio. En navegador: reveals suaves al hacer scroll, sin saltos.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "add reveals con ease-out y pass de accesibilidad"
```

---

## Fase 5 — Verificación y deploy

### Task 19: E2E smoke con Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`

- [ ] **Step 1: Config**

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
```

- [ ] **Step 2: Smoke tests**

`e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('carga ES con hero y secciones', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByText('Hola, soy')).toBeVisible();
  await expect(page.locator('#about')).toBeAttached();
  await expect(page.locator('#stack')).toBeAttached();
  await expect(page.locator('#work')).toBeAttached();
  await expect(page.locator('#contact')).toBeAttached();
});

test('switch de idioma a EN', async ({ page }) => {
  await page.goto('/es');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText("Hi, I'm")).toBeVisible();
});

test('canvas del teclado monta al hacer scroll', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await expect(page.locator('#stack canvas')).toBeVisible({ timeout: 15_000 });
});

test('tecla física activa tooltip del stack', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await page.locator('#stack canvas').waitFor({ timeout: 15_000 });
  await page.keyboard.press('t');
  await expect(page.getByText('TypeScript', { exact: true })).toBeVisible();
});

test('validación del form de contacto', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByText('Escribe tu nombre')).toBeVisible();
  await expect(page.getByText('Ese email no parece válido')).toBeVisible();
});

test('proyectos visibles con imágenes', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.getByText('NutriCita')).toBeVisible();
});
```

- [ ] **Step 3: Ejecutar**

```bash
npx playwright install chromium 2>/dev/null; npm run test:e2e
```

Expected: 6 passed. Si el test del tooltip falla por foco (el listener ignora inputs enfocados), añadir `await page.locator('body').click()` antes del `keyboard.press`.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e/
git commit -m "add suite e2e smoke con Playwright"
```

### Task 20: Build de producción + presupuesto de performance

- [ ] **Step 1: Build limpio**

```bash
npm run build
```

Expected: sin errores ni warnings de tipos. Mirar el output: el First Load JS de la ruta `/[locale]` debe quedar < 200 KB (three.js NO debe estar en el bundle inicial — está tras dynamic import).

- [ ] **Step 2: Lighthouse local**

```bash
npm run start &
sleep 5
npx lighthouse http://localhost:3000/es --only-categories=performance,accessibility --preset=perf --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json
node -e "const r=require('/tmp/lh.json'); console.log('perf', r.categories.performance.score, 'a11y', r.categories.accessibility.score, 'LCP', r.audits['largest-contentful-paint'].displayValue)"
```

Expected: performance ≥ 0.85, accessibility ≥ 0.95, LCP < 2.5 s. Si falla: revisar que el GLB no carga eager (debe ir tras dynamic import), que las imágenes usan `sizes` correcto, y bajar `count` de Stars.

- [ ] **Step 3: Commit de ajustes (si hubo)**

```bash
git add -A
git commit -m "fix: ajustes de performance tras lighthouse"
```

### Task 21: GitHub + Vercel deploy + verificación en vivo

⚠️ Push y deploy requieren confirmación explícita de Samuel. Preguntar antes: visibilidad del repo (recomendado: público — es marca personal) y OK al deploy.

- [ ] **Step 1: Crear repo y push (tras OK de Samuel)**

```bash
gh repo create samxssj/samxssj-portfolio --public --source=. --push
```

Expected: repo creado, `main` pusheado.

- [ ] **Step 2: Deploy a Vercel**

Usar skill `vercel:deploy` con argumento `prod` (o `vercel --prod`). Configurar env vars en Vercel antes: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` (pedir a Samuel la key o crearla en su cuenta Resend), `SMTP_USER`/`SMTP_PASS` opcionales.

- [ ] **Step 3: Verificación en vivo**

```bash
E2E_BASE_URL=https://<deployment-url> npm run test:e2e
```

Expected: 6 passed contra producción. Además, golden path manual con Playwright MCP: enviar un mensaje real por el form y confirmar que llega el email.

- [ ] **Step 4: Guardar en memoria**

Actualizar vault Obsidian: nota `Proyectos/samxssj-portfolio.md` (URL, stack, decisiones, pipeline del avatar) + entrada en `MOC-Proyectos.md` + aprendizajes nuevos a `Conocimiento/` (pipeline Higgsfield→GLB, teclado procedural R3F).

---

## Self-review del plan (hecho)

- **Cobertura del spec:** hero/avatar (12, 15, 16), about (9), teclado (5, 14), work (6, 10, 17), contact (11), i18n (4), design system (3), motion (18), a11y (14, 18), errores/fallbacks (13, 14, 16), performance (13, 20), testing (2, 19), deploy (21). Sin huecos.
- **Placeholders:** las descripciones de proyectos son borradores explícitos con instrucción concreta de ajuste (leer CLAUDE.md de cada repo); el `scale` del avatar se calibra con el GLB real — decisión que no puede tomarse antes de Task 15. No quedan TBD.
- **Consistencia de tipos:** `TechKey`/`STACK`/`COLS_PER_ROW` (Task 5) usados igual en Task 14; `Project`/`PROJECTS` (Task 6) en Task 10; `contactSchema`/`ContactState` (Task 11) coherentes entre schema, action y form; `LazyMount`/`CanvasBoundary`/`usePrefersReducedMotion` (Task 13) usados en 14 y 16 con las mismas firmas.
