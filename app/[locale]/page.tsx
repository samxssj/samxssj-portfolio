import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hero');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-extrabold">
        {t('greeting')} <span className="text-accent">{t('name')}</span>
      </h1>
    </main>
  );
}
