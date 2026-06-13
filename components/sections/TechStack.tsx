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
