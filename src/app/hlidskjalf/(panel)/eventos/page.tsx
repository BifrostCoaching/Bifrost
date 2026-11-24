import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import { rango } from "@/lib/format";
import type { Evento } from "@/lib/types";

export default async function EventosPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase.from("eventos").select("*").order("inicio", { ascending: false });
  const eventos = (data ?? []) as Evento[];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Eventos</h1>
        <Link href="/hlidskjalf/eventos/nuevo" className="boton">
          Nuevo evento
        </Link>
      </div>
      <p className="apagado">Charlas, encuentros abiertos y actividades sueltas. Se muestran en el Calendario.</p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Fechas</th>
              <th>Tipo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada cargado.</td>
              </tr>
            )}
            {eventos.map((e) => (
              <tr key={e.id}>
                <td>
                  <Link href={`/hlidskjalf/eventos/${e.id}`}>{e.titulo}</Link>
                </td>
                <td>{rango(e.inicio, e.fin)}</td>
                <td>{e.tipo === "pago" ? "Pago" : "Gratuito"}</td>
                <td>{e.publicado ? "Publicado" : "Borrador"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
