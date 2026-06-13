import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top">
      <Nav />
      <main>
        {/* Las secciones se montan en sus tareas: Hero, About, TechStack, Work, Contact */}
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
