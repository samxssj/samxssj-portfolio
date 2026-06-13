import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top">
      <Nav />
      <main>
        {/* Las secciones se montan en sus tareas: Hero, About, TechStack, Work, Contact */}
        <Hero />
        <About />
        <Work />
      </main>
      <Footer />
    </div>
  );
}
