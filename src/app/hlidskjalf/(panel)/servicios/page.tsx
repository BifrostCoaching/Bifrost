import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Servicio } from "@/lib/types";

export default async function ServiciosPanel() {
  const { supabase } = await requireEquipo();
  const { data, error } = await supabase.from("servicios").select("*").order("orden").order("created_at");
  const servicios = (data ?? []) as Servicio[];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Servicios</h1>
        <Link href="/hlidskjalf/servicios/nuevo" className="boton">
          Nuevo servicio
        </Link>
      </div>
      <p className="apagado">Los servicios directos de Bifröst, aparte de los talleres. Se muestran en la pestaña Servicios.</p>
      {error && <p className="aviso error">Falta preparar la base: ejecutá el archivo 06-servicios-e-imagenes.sql en Supabase.</p>}
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Modalidad</th>
              <th>Fotos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {servicios.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada cargado.</td>
              </tr>
            )}
            {servicios.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link href={`/hlidskjalf/servicios/${s.id}`}>{s.nombre}</Link>
                </td>
                <td>{s.modalidad || "[PENDIENTE]"}</td>
                <td>{s.imagenes.length}</td>
                <td>{s.publicado ? "Publicado" : "Borrador"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
