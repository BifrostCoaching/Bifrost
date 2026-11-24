import Link from "next/link";
import { Arcos } from "./Arcos";
import { BotonTema } from "./BotonTema";
import { Diapositivas } from "./Diapositivas";
import { Navegacion } from "./Navegacion";

export const IMAGENES_PORTADA = ["/img/portada-1.jpg", "/img/portada-2.jpg", "/img/portada-3.jpg"];

/** Encabezado con las imágenes de fondo de la maqueta, el menú y el título de la página. */
export function Portada({
  ceja,
  titulo,
  bajada,
  grande = false,
  conMenu = true,
  children,
}: {
  ceja: string;
  titulo: string;
  bajada: string;
  grande?: boolean;
  conMenu?: boolean;
  children?: React.ReactNode;
}) {
  return (
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
        <nav className="nav" aria-label="Principal">
          {conMenu && <Navegacion />}
          {conMenu && (
            <Link href="#contacto" className="boton chico">
              Contacto
            </Link>
          )}
          <BotonTema />
        </nav>
      </header>
      <section className={`hero${grande ? " grande" : ""}`}>
        <div style={{ maxWidth: grande ? 660 : 760 }}>
          <p className="ceja">{ceja}</p>
          <h1>{titulo}</h1>
          <p className="bajada">{bajada}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
