import { requireEquipo } from "@/lib/supabase/equipo";
import { salir } from "../acciones";
import { NavPanel } from "./NavPanel";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireEquipo();
  return (
    <div className="panel">
      <aside>
        <NavPanel />
        <p className="apagado" style={{ fontSize: "0.9rem", margin: "24px 0 10px", wordBreak: "break-all" }}>
          {user.email}
        </p>
        <form action={salir}>
          <button className="boton secundario">Salir</button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
