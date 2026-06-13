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
