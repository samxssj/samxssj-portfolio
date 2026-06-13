import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top">
      <Nav />
      <main>
        {/* Las secciones se montan en sus tareas: Hero, About, TechStack, Work, Contact */}
        <section id="hero-placeholder" className="flex min-h-screen items-center justify-center">
          <p className="text-muted">hero</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
