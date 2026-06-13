import { useTranslations } from 'next-intl';

export function Hero({ scene }: { scene?: React.ReactNode }) {
  const t = useTranslations('hero');

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* hueco central para la escena 3D del avatar (tarea posterior) */}
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
