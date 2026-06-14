import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

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
        {CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 80}>
            <article className="rounded-2xl border border-border-soft bg-surface p-6 transition-colors duration-200 ease-out hover:border-accent/40">
              <h3 className="text-base font-extrabold">{t(card.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(card.body)}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
