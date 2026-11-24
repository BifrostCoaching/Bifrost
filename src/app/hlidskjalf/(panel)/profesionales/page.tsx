import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Profesional } from "@/lib/types";

export default async function ProfesionalesPanel() {
  const { supabase } = await requireEquipo();
  const { data, error } = await supabase.from("profesionales").select("*").order("orden").order("nombre");
  const lista = (data ?? []) as Profesional[];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Profesionales</h1>
        <Link href="/hlidskjalf/profesionales/nuevo" className="boton">
          Nuevo profesional
        </Link>
      </div>
      <p className="apagado">Los Vanir: los profesionales que trabajan con Bifröst. Se muestran en la pestaña Profesionales.</p>
      {error && <p className="aviso error">Falta preparar la base: ejecutá el archivo 07-profesionales.sql en Supabase.</p>}
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Oficio</th>
              <th>Foto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada cargado.</td>
              </tr>
            )}
            {lista.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/hlidskjalf/profesionales/${p.id}`}>{p.nombre}</Link>
                </td>
                <td>{p.oficio || "[PENDIENTE]"}</td>
                <td>{p.imagen ? "Sí" : "No"}</td>
                <td>{p.publicado ? "Publicado" : "Borrador"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
