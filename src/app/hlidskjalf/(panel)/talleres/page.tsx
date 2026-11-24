import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import { pesos, rango } from "@/lib/format";
import type { Taller } from "@/lib/types";

export default async function TalleresPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase.from("talleres").select("*").order("orden").order("created_at");
  const talleres = (data ?? []) as Taller[];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Talleres</h1>
        <Link href="/hlidskjalf/talleres/nuevo" className="boton">
          Nuevo taller
        </Link>
      </div>
      <p className="apagado">Se muestran en Inicio, Talleres y Calendario.</p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Taller</th>
              <th>Fechas</th>
              <th>Cobro online</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {talleres.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada cargado.</td>
              </tr>
            )}
            {talleres.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link href={`/hlidskjalf/talleres/${t.id}`}>{t.nombre}</Link>
                </td>
                <td>{rango(t.inicio, t.fin)}</td>
                <td>{t.tipo === "gratuito" ? "Gratuito" : t.monto_online ? pesos(t.monto_online) : "Sin habilitar"}</td>
                <td>{t.publicado ? "Publicado" : "Borrador"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
