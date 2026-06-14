@AGENTS.md

# samxssj-portfolio

Portfolio 3D personal de Samuel (marca personal dev). One-pager bilingüe ES/EN.

- Spec: `docs/superpowers/specs/2026-06-13-portfolio-3d-design.md`
- Plan: `docs/superpowers/plans/2026-06-13-portfolio-3d.md`
- Stack: Next.js 16 + TS estricto + Tailwind v4 + next-intl + R3F/drei + Resend.
- 3D: **avatar = parallax 2D** (`public/avatar.webp`, concept Higgsfield con fondo recortado — NO hay GLB; el plan free de Higgsfield no llegaba a los 30 cr del image-to-3D). Teclado 100% procedural en R3F.
- Tests: `npm test` (Vitest, solo `tests/unit/`), `npm run test:e2e` (Playwright, `e2e/`).
- Deploy: Vercel, directo desde `main`. **Prod: https://samxssj-portfolio.vercel.app** (repo privado).
- Env prod: `CONTACT_TO_EMAIL` seteada. Falta `RESEND_API_KEY` → el form muestra "escríbeme directo" hasta añadirla.

## Gotchas de entorno
- Puerto **3000 ocupado por contenedores Docker** del homelab. Usar `PORT=3100` para dev/start/e2e.
- Playwright: chromium bundled (`channel: undefined`); no hay Chrome de sistema y `npx playwright install chrome` pide sudo.
- zsh: `$path` es variable reservada (= array PATH). No usar `path` como var de loop o rompe el PATH.

## Notas Next.js 16

Versión instalada: **16.2.9**

### Middleware → Proxy (breaking rename)
- El archivo se llama **`proxy.ts`** (no `middleware.ts`). El export nombrado es `proxy` (o default export).
- La configuración sigue siendo `export const config = { matcher: '...' }`.
- Import de tipos igual: `import type { NextRequest } from 'next/server'`.
- Docs oficiales: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

### `params` y `searchParams` son Promises
- En páginas y layouts, `params` y `searchParams` son `Promise<{...}>`.
- Se deben `await`ear: `const { slug } = await params`.
- No acceder síncronamente (deprecado desde Next 15, eliminado en 16).

### `next/font`
- API sin cambios respecto a Next 15: `import { Montserrat } from 'next/font/google'`.
- Soporte de `variable` (CSS var) y `className`.
- Para Tailwind v4: usar `variable: '--font-montserrat'` y referenciar en `@theme { --font-sans: var(--font-montserrat); }`.
- Importar y llamar **fuera** de cualquier componente (nivel módulo).

### Otras diferencias relevantes
- `next.config.ts` (TypeScript nativo, sin `.js`).
- Turbopack activo por defecto en `next dev` (`--turbo` implícito).
- `params` en route handlers (`route.ts`) también son Promise.
