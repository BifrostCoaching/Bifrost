import { requireEquipo } from "@/lib/supabase/equipo";
import type { Consulta } from "@/lib/types";
import { marcarConsulta } from "../../acciones";

export default async function ConsultasPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase.from("consultas").select("*").order("created_at", { ascending: false }).limit(300);
  const consultas = (data ?? []) as Consulta[];
  return (
    <>
      <h1>Consultas</h1>
      <p className="apagado">Los mensajes que llegan desde el formulario de contacto del sitio.</p>
      {consultas.length === 0 && <p>Todavía no llegó ninguna consulta.</p>}
      <div style={{ display: "grid", gap: "1rem" }}>
        {consultas.map((c) => (
          <article key={c.id} className="caja" style={{ opacity: c.leida ? 0.7 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong>{c.nombre}</strong> · <a href={`mailto:${c.email}`}>{c.email}</a>
                <br />
                <small className="apagado">
                  {c.motivo || "Sin motivo"} ·{" "}
                  {new Date(c.created_at).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short" })}
                </small>
                <br />
                <a href={`/hlidskjalf/campus?${new URLSearchParams({ email: c.email, nombre: c.nombre })}#acceso`} style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  Dar acceso al campus →
                </a>
              </div>
              <form action={marcarConsulta}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="leida" value={c.leida ? "0" : "1"} />
                <button className="boton secundario chico">{c.leida ? "Marcar sin leer" : "Marcar leída"}</button>
              </form>
            </div>
            <p className="preline" style={{ margin: "0.8rem 0 0" }}>
              {c.mensaje}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
