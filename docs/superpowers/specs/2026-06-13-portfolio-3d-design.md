# Portfolio 3D — samxssj (diseño)

**Fecha:** 2026-06-13
**Proyecto:** `samxssj-portfolio`
**Referencia visual:** reel de Instagram (lusi.uxui) mostrando moncy.dev, nareshkhatri.site y gamma.vercel.app — portfolios dark con 3D interactivo en React Three Fiber.

## Propósito

Portfolio de **marca personal dev** para Samuel Bermúdez (`samxssj`): identidad como desarrollador creativo, proyectos, stack y personalidad. Orientado a networking, comunidad y oportunidades futuras. No es página comercial de Synth Studio ni CV para recruiters.

## Decisiones clave

| Decisión | Elección |
|---|---|
| Concepto 3D | Mezcla: avatar 3D en hero + teclado mecánico interactivo en tech stack |
| Avatar | Estilizado inspirado en Samuel, sin parecido exacto, diseño libre con acento violeta |
| Enfoque técnico | React Three Fiber completo (3D real e interactivo en navegador) |
| Idioma | Bilingüe ES/EN con `next-intl` |
| Deploy | Vercel, subdominio `*.vercel.app` gratis (dominio propio conectable después) |
| Proyectos en Work | Todos los presentables: NutriCita, GrapplersParadise, RoninWear, Banking, e-commerce-samx, Q-Engine (auditar calidad de screenshot por proyecto) |

## Estructura del sitio

One-pager con scroll. Nav sticky con anchors (About · Stack · Work · Contact) + switcher ES/EN + icono GitHub.

1. **Hero** — avatar 3D estilizado que sigue el cursor con la cabeza, float en idle. Tipografía gigante partida: "Hola, soy **Samuel**" / "Creative **Developer**". Fondo casi negro con starfield sutil.
2. **About** — bio breve (dev junior de Envigado, DAM, fundando Synth Studio) + 3 cards "qué hago": web apps, SaaS, e-commerce. Sin 3D pesado: respiro entre escenas.
3. **Tech Stack** — teclado mecánico 3D procedural. Cada keycap una tecnología (TypeScript, React, Next.js, Node, Tailwind, Supabase, PostgreSQL, Prisma, Docker, Git, Playwright, Vercel…). Click o tecla física → keycap baja con spring + tooltip con experiencia. Texto "hint: press a key".
4. **Work** — grid de cards de proyecto: screenshot, descripción corta, badges de stack, hover tilt 3D, links a demo/repo.
5. **Contact** — form (nombre, email, mensaje) → Resend. Al lado: GitHub, LinkedIn, email directo. Footer mínimo.

### Avatar (concepto aprobado "sorpréndeme")

Chico cartoon de pelo oscuro rizado, hoodie violeta `#7c3aed`, audífonos al cuello, zapatillas blancas, sonrisa pícara. Vibes dev-paisa sin cliché.

## Arquitectura técnica

**Stack:** Next.js 16 App Router · TypeScript estricto · Tailwind v4 (`@import "tailwindcss"`, OKLCH) · `next-intl` · `@react-three/fiber` + `@react-three/drei` · Resend + Zod · Vitest + Playwright · Montserrat vía `next/font`.

```
app/[locale]/layout.tsx, page.tsx     ← one-pager
components/sections/  Hero About TechStack Work Contact
components/three/     AvatarScene KeyboardScene LazyCanvas
components/ui/        Badge Tooltip Button…
content/              projects.ts stack.ts   ← data tipada, sin CMS
messages/             es.json en.json
lib/actions/contact.ts                ← Server Action
public/models/ avatar.glb · public/projects/ screenshots
```

### i18n

`next-intl` con rutas `/es` y `/en`, middleware de detección por navegador con fallback a `es`. Todo string de UI en `messages/*.json`. Data de proyectos con campos por locale.

### Assets 3D

- **Avatar:** pipeline Higgsfield — `generate_image` (concept frontal + 3/4) → aprobación de Samuel → `generate_3d` → GLB → compresión draco con `gltf-transform`. **Fallback** si el mesh no da calidad: capas pre-renderizadas con parallax por cursor. La decisión se toma en la fase de assets y no bloquea el resto del desarrollo.
- **Teclado:** 100 % procedural en R3F. Keycaps `RoundedBox` + logos como texturas canvas (SVG de simple-icons). Spring al pulsar, raycast hover, escucha de teclas físicas. Sin GLB externo.

### Contact form

Server Action con validación Zod (con `z.preprocess` para strings vacíos → null), honeypot anti-spam, envío con Resend y fallback Gmail SMTP (nodemailer). Nada sensible en logs ni URLs. `.env.example` documentado (`RESEND_API_KEY`, SMTP fallback).

### Performance

- Cada Canvas con `dynamic import` + IntersectionObserver: solo monta al entrar la sección en viewport; poster estático mientras tanto.
- `dpr` clamp [1, 2]. Modelos draco. El 3D nunca bloquea el primer render.
- Presupuesto: LCP < 2.5 s en móvil.

## Design system

- Fondo: negro-violeta profundo (OKLCH ~`0.13 0.02 293`), starfield de baja densidad (drei `Stars`).
- Acento: violeta `#7c3aed` (OKLCH hue 293 — no 264). Verde/rojo solo semánticos (estados del form).
- Montserrat pesos 400/600/800. Hero con `clamp(3rem … 7rem)`.
- Cards con borde 1px blanco al 8 %, sin gradientes llamativos.

### Motion (reglas Emil Kowalski)

- Apariciones: `scale(0.95) + opacity 0` → ease-out. Propiedades exactas, nunca `transition: all`.
- Botones `scale(0.97)` en `:active`. Tooltips del teclado escalan desde su keycap.
- Scroll reveals con IntersectionObserver + CSS; GSAP solo si hace falta pinning.
- `prefers-reduced-motion`: avatar estático, keycaps sin spring, reveals sin translate.

## Manejo de errores

- ErrorBoundary por Canvas: si WebGL falla, cae al poster estático. Sitio 100 % usable sin WebGL.
- Form: errores descriptivos por campo, estado de envío explícito; si Resend falla, mensaje con email directo como alternativa.

## Accesibilidad

- Contenido textual real bajo cada escena 3D (el 3D nunca es la única fuente de información).
- Focus visible, navegación por teclado completa.
- El listener de teclas del teclado 3D solo activo con la sección en viewport y sin input enfocado.
- Contraste AA sobre fondo oscuro.

## Testing

- **Vitest:** validación del contact form, helpers i18n, integridad de `content/projects.ts` (links válidos, ambos locales presentes).
- **Playwright smoke:** carga, switch ES/EN, scroll por secciones, validación de form, golden path completo antes de declarar terminado.
- Verificación en vivo del deploy en Vercel con Playwright.

## Fuera de alcance

- CMS o panel de administración (data en código).
- Blog.
- Dominio propio (se conecta después sin cambios de código).
- Analytics (añadible después con Vercel Analytics).
