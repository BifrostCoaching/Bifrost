import { requireEquipo } from "@/lib/supabase/equipo";
import type { Interesado, EstadoInteresado } from "@/lib/types";
import { actualizarInteresado } from "../../acciones";

const NOMBRES: Record<EstadoInteresado, string> = {
  nuevo: "Nuevo, para contactar",
  contactado: "Contactado",
  inscripto: "Inscripto",
  descartado: "Descartado",
};

export default async function InteresadosPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase
    .from("interesados")
    .select("*, talleres(nombre)")
    .order("created_at", { ascending: false })
    .limit(500);
  const filas = (data ?? []) as Interesado[];
  return (
    <>
      <h1>Interesados</h1>
      <p className="apagado">
        Las personas que tocaron "Me interesa" en un taller. El equipo de ventas las contacta y va marcando en qué
        estado está cada una.
      </p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Persona</th>
              <th>Taller</th>
              <th>Seguimiento</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay interesados.</td>
              </tr>
            )}
            {filas.map((i) => (
              <tr key={i.id}>
                <td>
                  <strong>{i.nombre}</strong>
                  <br />
                  <a href={`mailto:${i.email}`}>{i.email}</a>
                  {i.telefono && (
                    <>
                      <br />
                      {i.telefono}
                    </>
                  )}
                  {i.comentario && (
                    <p className="apagado preline" style={{ margin: "0.4rem 0 0", fontSize: "0.9rem" }}>
                      “{i.comentario}”
                    </p>
                  )}
                </td>
                <td>{i.talleres?.nombre ?? "—"}</td>
                <td>
                  <span className={`estado-${i.estado}`}>{NOMBRES[i.estado]}</span>
                  <form action={actualizarInteresado} className="form" style={{ marginTop: "0.5rem", gap: "0.4rem" }}>
                    <input type="hidden" name="id" value={i.id} />
                    <select name="estado" defaultValue={i.estado} aria-label="Estado" style={{ padding: "0.35rem" }}>
                      {Object.entries(NOMBRES).map(([v, n]) => (
                        <option key={v} value={v}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <textarea name="notas" defaultValue={i.notas} aria-label="Notas" placeholder="Notas del equipo" style={{ minHeight: "3.5rem", fontSize: "0.9rem" }} />
                    <div>
                      <button className="boton secundario chico">Guardar</button>
                    </div>
                  </form>
                </td>
                <td>
                  {new Date(i.created_at).toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
