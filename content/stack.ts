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
  {
    id: 'typescript', label: 'TypeScript', key: 't', iconSlug: 'siTypescript', color: '#3178C6',
    row: 0, col: 0,
    experience: {
      es: 'Mi lenguaje por defecto. Modo estricto siempre, en todos los proyectos.',
      en: 'My default language. Strict mode always, in every project.',
    },
  },
  {
    id: 'javascript', label: 'JavaScript', key: 'j', iconSlug: 'siJavascript', color: '#F7DF1E',
    row: 0, col: 1,
    experience: {
      es: 'La base de todo lo que hago en web desde que empecé.',
      en: 'The foundation of everything I build for the web.',
    },
  },
  {
    id: 'react', label: 'React', key: 'r', iconSlug: 'siReact', color: '#61DAFB',
    row: 0, col: 2,
    experience: {
      es: 'Componentes, hooks, server components. Mi día a día.',
      en: 'Components, hooks, server components. My daily driver.',
    },
  },
  {
    id: 'nextjs', label: 'Next.js', key: 'n', iconSlug: 'siNextdotjs', color: '#171717',
    row: 0, col: 3,
    experience: {
      es: 'App Router, Server Actions y RSC. Framework de cabecera para todo proyecto nuevo.',
      en: 'App Router, Server Actions and RSC. My go-to framework for every new project.',
    },
  },
  {
    id: 'nodejs', label: 'Node.js', key: 'o', iconSlug: 'siNodedotjs', color: '#5FA04E',
    row: 0, col: 4,
    experience: {
      es: 'Backends, scripts y tooling. Node 22 en todos mis entornos.',
      en: 'Backends, scripts and tooling. Node 22 across all my environments.',
    },
  },
  {
    id: 'tailwind', label: 'Tailwind', key: 'w', iconSlug: 'siTailwindcss', color: '#06B6D4',
    row: 1, col: 0,
    experience: {
      es: 'v4 con OKLCH y design tokens. CSS rápido sin perder control.',
      en: 'v4 with OKLCH and design tokens. Fast CSS without losing control.',
    },
  },
  {
    id: 'supabase', label: 'Supabase', key: 's', iconSlug: 'siSupabase', color: '#3FCF8E',
    row: 1, col: 1,
    experience: {
      es: 'Auth + Postgres + RLS en producción (NutriCita, PortHive).',
      en: 'Auth + Postgres + RLS in production (NutriCita, PortHive).',
    },
  },
  {
    id: 'postgresql', label: 'PostgreSQL', key: 'p', iconSlug: 'siPostgresql', color: '#4169E1',
    row: 1, col: 2,
    experience: {
      es: 'Mi base de datos por defecto, en Docker o gestionada.',
      en: 'My default database, in Docker or managed.',
    },
  },
  {
    id: 'prisma', label: 'Prisma', key: 'm', iconSlug: 'siPrisma', color: '#2D3748',
    row: 1, col: 3,
    experience: {
      es: 'ORM tipado para modelar datos sin sorpresas.',
      en: 'Typed ORM to model data without surprises.',
    },
  },
  {
    id: 'docker', label: 'Docker', key: 'd', iconSlug: 'siDocker', color: '#2496ED',
    row: 1, col: 4,
    experience: {
      es: 'Compose en mi homelab tras Traefik. Todo containerizado.',
      en: 'Compose in my homelab behind Traefik. Everything containerized.',
    },
  },
  {
    id: 'git', label: 'Git', key: 'g', iconSlug: 'siGit', color: '#F05032',
    row: 2, col: 0,
    experience: {
      es: 'Commits descriptivos, ramas por feature, historia limpia.',
      en: 'Descriptive commits, feature branches, clean history.',
    },
  },
  {
    id: 'github', label: 'GitHub', key: 'h', iconSlug: 'siGithub', color: '#181717',
    row: 2, col: 1,
    experience: {
      es: 'Donde vive todo mi código: github.com/samxssj.',
      en: 'Where all my code lives: github.com/samxssj.',
    },
  },
  {
    id: 'vercel', label: 'Vercel', key: 'v', iconSlug: 'siVercel', color: '#000000',
    row: 2, col: 2,
    experience: {
      es: 'Deploy de todos mis proyectos de cara a cliente.',
      en: 'Where I deploy every client-facing project.',
    },
  },
  {
    id: 'linux', label: 'Linux', key: 'l', iconSlug: 'siLinux', color: '#FCC624',
    row: 2, col: 3,
    experience: {
      es: 'WSL2 + Ubuntu como entorno diario, homelab incluido.',
      en: 'WSL2 + Ubuntu as my daily environment, homelab included.',
    },
  },
];

/** filas con menos columnas se centran con offset */
export const COLS_PER_ROW = [5, 5, 4];
