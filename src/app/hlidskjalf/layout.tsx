import type { Metadata } from "next";
import Link from "next/link";
import { Arcos } from "@/components/Arcos";

export const metadata: Metadata = { title: "Hliðskjálf · Panel del equipo", robots: { index: false, follow: false } };

export default function HlidskjalfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="encabezado">
        <div className="contenedor">
          <Link href="/hlidskjalf" className="marca">
            <Arcos /> Hliðskjálf
          </Link>
          <nav className="nav" aria-label="Sitio">
            <Link href="/">Ver el sitio</Link>
          </nav>
        </div>
      </header>
      <main id="contenido" className="contenedor">
        {children}
      </main>
    </>
  );
}
