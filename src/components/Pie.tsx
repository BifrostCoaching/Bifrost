import Link from "next/link";
import { Arcos } from "./Arcos";

export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <span className="marca">
          <Arcos size={28} /> Bifröst
        </span>
        <span>
          © {new Date().getFullYear()} Bifröst · Espacios de aprendizaje ·{" "}
          <Link href="/hlidskjalf">Ingreso del equipo</Link>
        </span>
      </div>
    </footer>
  );
}
