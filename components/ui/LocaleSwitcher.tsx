'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const other = locale === 'es' ? 'en' : 'es';

  return (
    <button
      type="button"
      aria-label={t('switchLocale')}
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded-full border border-border-soft px-3 py-1 text-xs font-semibold uppercase text-muted transition-colors duration-150 ease-out hover:border-accent hover:text-text active:scale-[0.97]"
    >
      {other}
    </button>
  );
}
