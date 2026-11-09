import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL, HERO_STACK, SOCIAL_LINKS } from '@/content/profile';

const LINK_CLASS =
  'text-sm font-semibold text-muted underline-offset-4 transition-colors duration-150 ease-out hover:text-text hover:underline';

const FACTS = ['Location', 'Education', 'Focus', 'Languages'] as const;

/**
 * Hero editorial orientado a reclutadores: en 5 segundos se lee quién, qué rol,
 * dónde y si está disponible. Sin ilustraciones: la jerarquía tipográfica hace el trabajo.
 * La entrada es CSS puro (animate-rise) para no retrasar el LCP esperando a la hidratación.
 */
export function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center px-6 pb-12 pt-24 lg:pb-16 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="motion-safe:animate-rise inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
          <span className="size-2 rounded-full bg-ok" aria-hidden="true" />
          {t('availability')}
        </p>

        <h1
          id="hero-title"
          className="motion-safe:animate-rise mt-6 text-[2.75rem] font-extrabold leading-[0.95] tracking-tight [animation-delay:60ms] sm:text-7xl lg:text-8xl"
        >
          {t('name')}
          <span className="mt-4 block text-2xl font-semibold tracking-normal text-muted sm:text-4xl">
            {t('role')}
          </span>
        </h1>

        <p className="motion-safe:animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-muted [animation-delay:120ms]">
          {t('tagline')}
        </p>

        <ul
          aria-label={t('stackLabel')}
          className="motion-safe:animate-rise mt-6 flex flex-wrap gap-2 [animation-delay:160ms]"
        >
          {HERO_STACK.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border-soft px-2.5 py-1 text-xs font-semibold text-text"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="motion-safe:animate-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:200ms]">
          <a
            href="#work"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-white transition-[filter,transform] duration-150 ease-out hover:brightness-110 active:scale-[0.97]"
          >
            {t('ctaWork')}
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-border-soft px-6 py-3 text-sm font-extrabold text-text transition-[background-color,transform] duration-150 ease-out hover:bg-surface active:scale-[0.97]"
          >
            {t('ctaContact')}
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                GitHub
              </a>
            </li>
            <li>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
                {t('email')}
              </a>
            </li>
          </ul>
        </div>

        <dl
          aria-label={t('factsLabel')}
          className="motion-safe:animate-rise mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border-soft pt-8 [animation-delay:260ms] lg:grid-cols-4"
        >
          {FACTS.map((fact) => (
            <div key={fact}>
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                {t(`fact${fact}Label`)}
              </dt>
              <dd className="mt-2 text-sm font-semibold text-text">{t(`fact${fact}`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
