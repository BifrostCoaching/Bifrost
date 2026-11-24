import Link from "next/link";
import { Arcos } from "./Arcos";

export function Pie() {
  return (
    <footer className="pie">
      <div className="ancho">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Arcos claro size={34} />
          <span className="nombre">Bifröst</span>
        </div>
        <p style={{ margin: 0, fontSize: "1rem" }}>
          © {new Date().getFullYear()} Bifröst · Espacios de aprendizaje · <Link href="/hlidskjalf">Ingreso del equipo</Link>
        </p>
      </div>
    </footer>
  );
}
