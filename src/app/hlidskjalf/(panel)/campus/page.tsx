import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Inscripcion, Modulo, Participante, Taller } from "@/lib/types";
import { agregarInscripcion, borrarModulo, cambiarInscripcion, guardarModulo, quitarAcceso } from "../../acciones";
import { FormAcceso } from "./FormAcceso";

type Props = { searchParams: Promise<{ ver?: string; taller?: string; email?: string; nombre?: string; estado?: string }> };

const ESTADOS = { pendiente: "Pendiente", confirmada: "Confirmada", cancelada: "Cancelada" };

export default async function CampusPanel({ searchParams }: Props) {
  const { supabase } = await requireEquipo();
  const q = await searchParams;
  const pestaña = q.ver === "modulos" ? "modulos" : "personas";

  const [t, p, i, m] = await Promise.all([
    supabase.from("talleres").select("id, nombre").order("orden").order("created_at"),
    supabase.from("participantes").select("*").order("created_at", { ascending: false }),
    supabase.from("inscripciones").select("*"),
    supabase.from("modulos").select("*").order("numero"),
  ]);
  if (p.error) {
    return (
      <>
        <h1>Campus</h1>
        <p className="aviso error">Falta crear las tablas: corré el archivo 05-dar-por-dar-y-campus.sql en Supabase &gt; SQL Editor.</p>
      </>
    );
  }
  const talleres = (t.data ?? []) as Pick<Taller, "id" | "nombre">[];
  const participantes = (p.data ?? []) as Participante[];
  const inscripciones = (i.data ?? []) as Inscripcion[];
  const modulos = (m.data ?? []) as Modulo[];
  const nombreTaller = new Map(talleres.map((x) => [x.id, x.nombre]));
  const pendientes = inscripciones.filter((x) => x.estado === "pendiente").length;
  const tallerSel = talleres.find((x) => x.id === q.taller) ?? talleres[0];

  return (
    <>
      <h1>Campus</h1>
      <p className="apagado">
        Quién tiene acceso al campus, a qué talleres está inscripto y qué módulos tiene cada taller. Las inscripciones pendientes no ven
        los módulos hasta que las confirmás.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "1rem 0 1.5rem" }}>
        <Link href="/hlidskjalf/campus" className="chip" aria-current={pestaña === "personas" ? "page" : undefined}>
          Personas{pendientes > 0 ? ` (${pendientes} por confirmar)` : ""}
        </Link>
        <Link href="/hlidskjalf/campus?ver=modulos" className="chip" aria-current={pestaña === "modulos" ? "page" : undefined}>
          Módulos de los talleres
        </Link>
      </div>

      {pestaña === "personas" && (
        <>
          <FormAcceso talleres={talleres} email={q.email} nombre={q.nombre} taller={q.taller} estado={q.estado} />
          <h2 style={{ marginTop: "2rem" }}>Personas con acceso</h2>
          {participantes.length === 0 && <p className="vacio">Todavía nadie tiene acceso al campus.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {participantes.map((pa) => {
              const suyas = inscripciones.filter((x) => x.participante_id === pa.id);
              const sinInscribir = talleres.filter((x) => !suyas.some((s) => s.taller_id === x.id));
              return (
                <div key={pa.id} className="caja">
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <strong>{pa.nombre || pa.email}</strong>
                      <br />
                      <a href={`mailto:${pa.email}`}>{pa.email}</a>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                      <Link
                        href={`/hlidskjalf/campus?${new URLSearchParams({ email: pa.email, nombre: pa.nombre })}#acceso`}
                        className="boton borde mini"
                      >
                        Nuevo link de acceso
                      </Link>
                      <form action={quitarAcceso}>
                        <input type="hidden" name="id" value={pa.id} />
                        <button className="boton peligro mini">Quitar acceso</button>
                      </form>
                    </div>
                  </div>
                  <ul style={{ margin: "12px 0 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {suyas.map((s) => (
                      <li key={s.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                        <span>{nombreTaller.get(s.taller_id) ?? "Taller borrado"}</span>
                        <strong style={{ color: s.estado === "confirmada" ? "var(--green-text)" : s.estado === "pendiente" ? "var(--eyebrow)" : "var(--muted)" }}>
                          · {ESTADOS[s.estado]}
                        </strong>
                        {(["confirmada", "pendiente", "cancelada"] as const)
                          .filter((e) => e !== s.estado)
                          .map((e) => (
                            <form key={e} action={cambiarInscripcion} style={{ display: "inline" }}>
                              <input type="hidden" name="id" value={s.id} />
                              <input type="hidden" name="estado" value={e} />
                              <button className={`boton mini ${e === "confirmada" ? "" : "borde"}`}>
                                {e === "confirmada" ? "Confirmar" : e === "pendiente" ? "Dejar pendiente" : "Cancelar"}
                              </button>
                            </form>
                          ))}
                      </li>
                    ))}
                  </ul>
                  {sinInscribir.length > 0 && (
                    <form action={agregarInscripcion} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                      <input type="hidden" name="participante_id" value={pa.id} />
                      <select name="taller_id" aria-label="Sumar a un taller" style={{ padding: "0.35rem" }}>
                        {sinInscribir.map((x) => (
                          <option key={x.id} value={x.id}>{x.nombre}</option>
                        ))}
                      </select>
                      <button className="boton borde mini">Sumar a este taller (confirmado)</button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {pestaña === "modulos" && (
        <>
          {!tallerSel ? (
            <p className="vacio">Primero cargá un taller.</p>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                {talleres.map((x) => (
                  <Link key={x.id} href={`/hlidskjalf/campus?ver=modulos&taller=${x.id}`} className="chip" aria-current={x.id === tallerSel.id ? "page" : undefined}>
                    {x.nombre}
                  </Link>
                ))}
              </div>
              <p className="apagado">
                Escribí una clase o un material por línea. Si una línea termina con un link (https://…), en el campus se muestra como link.
                Por ejemplo: <em>Presentación del encuentro 1: https://drive.google.com/…</em>
              </p>
              {[...modulos.filter((x) => x.taller_id === tallerSel.id), undefined].map((md, k, arr) => (
                <details key={md?.id ?? "nuevo"} className="caja" style={{ marginBottom: 12 }} open={!md && arr.length === 1}>
                  <summary style={{ cursor: "pointer" }}>
                    {md ? (
                      <strong>Módulo {md.numero} · {md.titulo}</strong>
                    ) : (
                      <strong>+ Nuevo módulo</strong>
                    )}
                  </summary>
                  <form action={guardarModulo} className="form" style={{ marginTop: "1rem" }}>
                    {md && <input type="hidden" name="id" value={md.id} />}
                    <input type="hidden" name="taller_id" value={tallerSel.id} />
                    <div className="doble">
                      <label>
                        Número
                        <input name="numero" type="number" min={1} defaultValue={md?.numero ?? arr.length} />
                      </label>
                      <label>
                        Título
                        <input name="titulo" required maxLength={200} defaultValue={md?.titulo} placeholder="Apreciatividad" />
                      </label>
                    </div>
                    <label>
                      Clases <small>(una por línea)</small>
                      <textarea name="clases" defaultValue={md?.clases} />
                    </label>
                    <label>
                      Materiales <small>(uno por línea)</small>
                      <textarea name="materiales" defaultValue={md?.materiales} />
                    </label>
                    <div>
                      <button className="boton chico">Guardar módulo</button>
                    </div>
                  </form>
                  {md && (
                    <form action={borrarModulo} style={{ marginTop: 12 }}>
                      <input type="hidden" name="id" value={md.id} />
                      <button className="boton peligro chico">Eliminar módulo</button>
                    </form>
                  )}
                </details>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}
