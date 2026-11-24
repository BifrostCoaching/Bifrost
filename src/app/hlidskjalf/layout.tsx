import type { Metadata } from "next";
import Link from "next/link";
import { Arcos } from "@/components/Arcos";
import { BotonTema } from "@/components/BotonTema";
import { Diapositivas } from "@/components/Diapositivas";
import { IMAGENES_PORTADA } from "@/components/Portada";

export const metadata: Metadata = { title: "Hliðskjálf · Panel del equipo", robots: { index: false, follow: false } };

export default function HlidskjalfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="portada">
        <div className="portada-fondo" aria-hidden="true">
          <Diapositivas imagenes={IMAGENES_PORTADA} />
          <div className="hero-shade" />
          <div className="hero-fade" />
        </div>
        <header className="cabecera">
          <Link href="/" className="marca" aria-label="Bifröst, inicio">
            <Arcos />
            <span>Bifröst</span>
          </Link>
          <nav className="nav" aria-label="Sitio">
            <Link href="/" className="nav-link">Ver el sitio</Link>
            <BotonTema />
          </nav>
        </header>
        <section className="hero" style={{ minHeight: 0, paddingBottom: 72 }}>
          <div style={{ maxWidth: 760 }}>
            <p className="ceja">Panel del equipo</p>
            <h1>Hliðskjálf</h1>
            <p className="bajada">
              Desde su trono, Odín veía todos los mundos. Desde acá, el equipo carga y edita el contenido del sitio sin tocar el código.
            </p>
          </div>
        </section>
      </div>
      <main id="contenido">{children}</main>
    </>
  );
}
