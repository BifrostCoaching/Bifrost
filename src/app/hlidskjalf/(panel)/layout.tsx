import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import { salir } from "../acciones";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireEquipo();
  return (
    <div className="panel">
      <aside>
        <nav className="panel-nav" aria-label="Panel">
          <Link href="/hlidskjalf">Resumen</Link>
          <Link href="/hlidskjalf/talleres">Talleres</Link>
          <Link href="/hlidskjalf/eventos">Eventos</Link>
          <Link href="/hlidskjalf/interesados">Interesados</Link>
          <Link href="/hlidskjalf/consultas">Consultas</Link>
        </nav>
        <p className="apagado" style={{ fontSize: "0.85rem", marginTop: "1.5rem" }}>
          {user.email}
        </p>
        <form action={salir}>
          <button className="boton secundario chico">Salir</button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
