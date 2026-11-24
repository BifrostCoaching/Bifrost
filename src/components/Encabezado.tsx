import Link from "next/link";
import { Arcos } from "./Arcos";
import { NavLink } from "./NavLink";

export function Encabezado() {
  return (
    <header className="encabezado">
      <div className="contenedor">
        <Link href="/" className="marca" aria-label="Bifröst, inicio">
          <Arcos /> Bifröst
        </Link>
        <nav className="nav" aria-label="Principal">
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/talleres">Talleres</NavLink>
          <NavLink href="/calendario">Calendario</NavLink>
          <Link href="/#contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
