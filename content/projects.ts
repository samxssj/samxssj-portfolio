export type Project = {
  id: string;
  name: string;
  description: { es: string; en: string };
  stack: string[];
  /** screenshot en public/projects/ — se captura en una tarea posterior */
  image: string;
  demoUrl?: string;
  repoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'nutricita',
    name: 'NutriCita',
    image: '/projects/nutricita.webp',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind', 'Resend'],
    description: {
      es: 'Sistema de reservas para una clínica de nutrición: agenda pública con slots por hora, cuestionario pre-visita, panel de gestión con estadísticas, fichas de pacientes con progreso de peso, recordatorios automáticos 24h y emails transaccionales con identidad propia. En producción.',
      en: 'Appointment booking system for a nutrition clinic: public scheduling with hourly slots, pre-visit questionnaire, admin dashboard with stats, patient records with weight progress, automated 24h reminders, and branded transactional emails. Live in production.',
    },
    demoUrl: 'https://nutricita.vercel.app',
    // sin remoto público — repo local
  },
  {
    id: 'porthive',
    name: 'PortHive',
    image: '/projects/porthive.webp',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind'],
    description: {
      es: 'SaaS multi-tenant white-label para agencias: panel de gestión de clientes, proyectos con fases, entregables, facturas con pago Stripe y portal de cliente con la marca de cada agencia. En producción.',
      en: 'Multi-tenant white-label SaaS for agencies: client management dashboard, phased projects, deliverables, Stripe-powered invoices, and a branded client portal per agency. Live in production.',
    },
    demoUrl: 'https://porthive.vercel.app',
    repoUrl: 'https://github.com/samxssj/PortHive',
  },
  {
    id: 'grapplers-paradise',
    name: 'Grapplers Paradise',
    image: '/projects/grapplers-paradise.webp',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase'],
    description: {
      es: 'Ecosistema digital para una academia de Brazilian Jiu-Jitsu en Barcelona: web corporativa y panel de administración para gestión de alumnos, torneos y operaciones del gimnasio. Primer cliente real de Synth Studio.',
      en: 'Digital ecosystem for a Brazilian Jiu-Jitsu academy in Barcelona: corporate site and admin panel for managing members, tournaments, and gym operations. First real client of Synth Studio.',
    },
    repoUrl: 'https://github.com/samxssj/GrapplersParadiseWeb',
  },
  {
    id: 'ecommerce-samx',
    name: 'E-commerce SamX',
    image: '/projects/ecommerce-samx.webp',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    description: {
      es: 'Tienda online full-stack para equipamiento de artes marciales: auth JWT en cookies HTTP-only, pagos reales con Stripe, panel de administración, visor 3D con Three.js y microservicio Python para quitar fondo de imágenes.',
      en: 'Full-stack online store for martial arts equipment: HTTP-only cookie JWT auth, live Stripe payments, admin panel, Three.js 3D product viewer, and a Python microservice for background removal.',
    },
    repoUrl: 'https://github.com/samxssj/e-commerce-samx',
  },
  {
    id: 'q-engine',
    name: 'Q-Engine',
    image: '/projects/q-engine.webp',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion'],
    description: {
      es: 'Aplicación web de evaluación de movilidad basada en el método Q-Engine: protocolo paramétrico con visualización de resultados, generación de QR para compartir informes y envío por email.',
      en: 'Web app for mobility assessment based on the Q-Engine method: parametric protocol with results visualization, QR code sharing, and email report delivery.',
    },
    repoUrl: 'https://github.com/samxssj/Q-Engine',
  },
];
