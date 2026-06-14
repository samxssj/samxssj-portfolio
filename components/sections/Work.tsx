import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { PROJECTS } from '@/content/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/TiltCard';
import { Reveal } from '@/components/ui/Reveal';

export function Work() {
  const t = useTranslations('work');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.id} delay={i * 80}>
          <TiltCard>
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
