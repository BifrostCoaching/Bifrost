import { requireEquipo } from "@/lib/supabase/equipo";
import { pesos } from "@/lib/format";
import type { Inscripcion, EstadoInscripcion } from "@/lib/types";
import { cambiarEstadoInscripcion } from "../../acciones";

const NOMBRES: Record<EstadoInscripcion, string> = {
  pendiente_pago: "Pago pendiente",
  confirmada: "Confirmada",
  rechazada: "Pago rechazado",
  cancelada: "Cancelada",
};

export default async function InscripcionesPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase
    .from("inscripciones")
    .select("*, talleres(nombre)")
    .order("created_at", { ascending: false })
    .limit(500);
  const filas = (data ?? []) as Inscripcion[];
  return (
    <>
      <h1>Inscripciones</h1>
      <p className="apagado">
        Las de talleres pagos se confirman solas cuando Mercado Pago aprueba el pago. Si alguien te paga por
        transferencia o en efectivo, podés confirmarla a mano.
      </p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Persona</th>
              <th>Taller</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={5}>Todavía no hay inscripciones.</td>
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
                  {i.notas && (
                    <>
                      <br />
                      <small className="pendiente">{i.notas}</small>
                    </>
                  )}
                </td>
                <td>{i.talleres?.nombre ?? "—"}</td>
                <td>{i.monto != null ? pesos(Number(i.monto)) : "Gratuito"}</td>
                <td>
                  <span className={`estado-${i.estado}`}>{NOMBRES[i.estado]}</span>
                  {i.mp_payment_id && (
                    <>
                      <br />
                      <small className="apagado">MP #{i.mp_payment_id}</small>
                    </>
                  )}
                  <form action={cambiarEstadoInscripcion} className="fila-acciones" style={{ marginTop: "0.4rem" }}>
                    <input type="hidden" name="id" value={i.id} />
                    <select name="estado" defaultValue={i.estado} aria-label="Cambiar estado" style={{ width: "auto", padding: "0.3rem" }}>
                      {Object.entries(NOMBRES).map(([v, n]) => (
                        <option key={v} value={v}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button className="boton secundario chico">Cambiar</button>
                  </form>
                </td>
                <td>{new Date(i.created_at).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
