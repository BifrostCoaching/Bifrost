import Link from "next/link";
import { TIPOS_ESPACIO } from "@/components/dar/TiposEspacio";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Convocatoria, Espacio } from "@/lib/types";
import { borrarConvocatoria, borrarEspacio, guardarConvocatoria, guardarEspacio } from "../../acciones";

const ETIQUETA = { publicado: "Publicado", pendiente: "Por revisar", oculto: "Oculto" };

function CamposEspacio({ e }: { e?: Espacio }) {
  return (
    <>
      <div className="doble">
        <label>
          Nombre
          <input name="nombre" required maxLength={120} defaultValue={e?.nombre} />
        </label>
        <label>
          Tipo
          <select name="tipo" defaultValue={e?.tipo ?? TIPOS_ESPACIO[0]}>
            {TIPOS_ESPACIO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="doble">
        <label>
          Zona
          <input name="zona" maxLength={120} defaultValue={e?.zona} />
        </label>
        <label>
          Contacto <small>(WhatsApp, email, @usuario o link)</small>
          <input name="contacto" maxLength={200} defaultValue={e?.contacto} />
        </label>
      </div>
      <label>
        Qué hacen y qué necesitan
        <textarea name="descripcion" maxLength={1500} defaultValue={e?.descripcion} />
      </label>
      <label>
        Estado
        <select name="estado" defaultValue={e?.estado ?? "publicado"}>
          <option value="publicado">Publicado en el sitio</option>
          <option value="pendiente">Por revisar (no se ve)</option>
          <option value="oculto">Oculto (no se ve)</option>
        </select>
      </label>
    </>
  );
}

export default async function DarPorDarPanel({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { supabase } = await requireEquipo();
  const { ver } = await searchParams;
  const [e, c] = await Promise.all([
    supabase.from("espacios").select("*").order("created_at", { ascending: false }),
    supabase.from("convocatorias").select("*").order("inicio", { ascending: false, nullsFirst: true }),
  ]);
  if (e.error) {
    return (
      <>
        <h1>Dar por dar</h1>
        <p className="aviso error">Falta crear las tablas: corré el archivo 05-dar-por-dar-y-campus.sql en Supabase &gt; SQL Editor.</p>
      </>
    );
  }
  const espacios = ((e.data ?? []) as Espacio[]).sort((a, b) => Number(b.estado === "pendiente") - Number(a.estado === "pendiente"));
  const convocatorias = (c.data ?? []) as Convocatoria[];
  const nombre = new Map(espacios.map((x) => [x.id, x.nombre]));
  const pestaña = ver === "convocatorias" ? "convocatorias" : "espacios";
  const pendientes = espacios.filter((x) => x.estado === "pendiente").length;

  return (
    <>
      <h1>Dar por dar</h1>
      <p className="apagado">
        Los espacios que llegan por el formulario del sitio quedan &quot;Por revisar&quot; hasta que los publicás. Las convocatorias las
        cargás vos y se muestran mientras no haya pasado su fecha.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "1rem 0 1.5rem" }}>
        <Link href="/hlidskjalf/dar-por-dar" className="chip" aria-current={pestaña === "espacios" ? "page" : undefined}>
          Espacios{pendientes > 0 ? ` (${pendientes} por revisar)` : ""}
        </Link>
        <Link href="/hlidskjalf/dar-por-dar?ver=convocatorias" className="chip" aria-current={pestaña === "convocatorias" ? "page" : undefined}>
          Convocatorias
        </Link>
      </div>

      {pestaña === "espacios" && (
        <>
          <details className="caja" style={{ marginBottom: "1.5rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>+ Agregar un espacio</summary>
            <form action={guardarEspacio} className="form" style={{ marginTop: "1rem" }}>
              <CamposEspacio />
              <div>
                <button className="boton">Guardar espacio</button>
              </div>
            </form>
          </details>
          {espacios.length === 0 && <p className="vacio">Todavía no hay espacios.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {espacios.map((x) => (
              <details key={x.id} className="caja" open={x.estado === "pendiente"}>
                <summary style={{ cursor: "pointer" }}>
                  <strong>{x.nombre}</strong> <span className="apagado">· {x.tipo} · {ETIQUETA[x.estado]}</span>
                </summary>
                <form action={guardarEspacio} className="form" style={{ marginTop: "1rem" }}>
                  <input type="hidden" name="id" value={x.id} />
                  <CamposEspacio e={x} />
                  <div>
                    <button className="boton chico">Guardar</button>
                  </div>
                </form>
                <form action={borrarEspacio} style={{ marginTop: 12 }}>
                  <input type="hidden" name="id" value={x.id} />
                  <button className="boton peligro chico">Eliminar espacio</button>
                </form>
              </details>
            ))}
          </div>
        </>
      )}

      {pestaña === "convocatorias" && (
        <>
          {espacios.length === 0 ? (
            <p className="vacio">Primero cargá al menos un espacio: cada convocatoria pertenece a uno.</p>
          ) : (
            [undefined, ...convocatorias].map((cv) => (
              <details key={cv?.id ?? "nueva"} className="caja" style={{ marginBottom: 12 }} open={!cv && convocatorias.length === 0}>
                <summary style={{ cursor: "pointer" }}>
                  {cv ? (
                    <>
                      <strong>{cv.titulo}</strong>{" "}
                      <span className="apagado">
                        · {nombre.get(cv.espacio_id) ?? "?"} · {cv.inicio ?? "sin fecha"} {cv.publicado ? "" : "· oculta"}
                      </span>
                    </>
                  ) : (
                    <strong>+ Nueva convocatoria</strong>
                  )}
                </summary>
                <form action={guardarConvocatoria} className="form" style={{ marginTop: "1rem" }}>
                  {cv && <input type="hidden" name="id" value={cv.id} />}
                  <label>
                    Título
                    <input name="titulo" required maxLength={200} defaultValue={cv?.titulo} placeholder="Jornada de adopción" />
                  </label>
                  <label>
                    Espacio
                    <select name="espacio_id" defaultValue={cv?.espacio_id ?? espacios[0].id}>
                      {espacios.map((x) => (
                        <option key={x.id} value={x.id}>{x.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <div className="doble">
                    <label>
                      Inicio
                      <input name="inicio" type="date" defaultValue={cv?.inicio ?? ""} />
                    </label>
                    <label>
                      Fin
                      <input name="fin" type="date" defaultValue={cv?.fin ?? ""} />
                    </label>
                  </div>
                  <label>
                    Qué se necesita
                    <textarea name="necesita" maxLength={600} defaultValue={cv?.necesita} placeholder="Voluntarios, alimento, mantas…" />
                  </label>
                  <label className="check">
                    <input name="publicado" type="checkbox" defaultChecked={cv?.publicado ?? true} /> Publicada en el sitio
                  </label>
                  <div>
                    <button className="boton chico">Guardar</button>
                  </div>
                </form>
                {cv && (
                  <form action={borrarConvocatoria} style={{ marginTop: 12 }}>
                    <input type="hidden" name="id" value={cv.id} />
                    <button className="boton peligro chico">Eliminar convocatoria</button>
                  </form>
                )}
              </details>
            ))
          )}
        </>
      )}
    </>
  );
}
