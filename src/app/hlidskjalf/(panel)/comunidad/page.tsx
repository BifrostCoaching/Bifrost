import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { EstadoComunidad } from "@/lib/types";
import { borrarComunidad, corregirComunidad, moderar } from "../../acciones";

type Fila = { id: string; estado: EstadoComunidad; created_at: string; texto: string; nombre?: string; titulo?: string; taller?: string; tipo?: string; tema?: string };

const SECCIONES = [
  { tabla: "reflexiones", nombre: "Reflexiones", lugar: "Pozo de Mímir", columnas: "id, estado, created_at, nombre, titulo, texto" },
  { tabla: "foro", nombre: "Foro", lugar: "Hvergelmir", columnas: "id, estado, created_at, nombre, titulo, texto, tema" },
  { tabla: "experiencias", nombre: "Experiencias", lugar: "Pozo de Urd", columnas: "id, estado, created_at, nombre, texto, taller, tipo" },
  { tabla: "suenos", nombre: "Sueños", lugar: "Yggdrasil", columnas: "id, estado, created_at, texto" },
];

/** Largo máximo de cada texto, igual que en el formulario público. */
const LARGO: Record<string, number> = { suenos: 60, experiencias: 220, reflexiones: 3000, foro: 2000 };

const ETIQUETA: Record<EstadoComunidad, string> = { publicado: "Publicado", pendiente: "Por aprobar", oculto: "Retirado" };

function Boton({ tabla, id, estado, texto, peligro }: { tabla: string; id: string; estado: EstadoComunidad; texto: string; peligro?: boolean }) {
  return (
    <form action={moderar} style={{ display: "inline" }}>
      <input type="hidden" name="tabla" value={tabla} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="estado" value={estado} />
      <button className={`boton chico${peligro ? " peligro" : ""}`}>{texto}</button>
    </form>
  );
}

export default async function ComunidadPanel({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { supabase } = await requireEquipo();
  const { ver } = await searchParams;
  const actual = SECCIONES.find((s) => s.tabla === ver) ?? SECCIONES[0];
  const { data } = await supabase
    .from(actual.tabla)
    .select(actual.columnas)
    .order("estado", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(300);
  const filas = ((data ?? []) as unknown as Fila[]).sort((a, b) => Number(b.estado === "pendiente") - Number(a.estado === "pendiente"));

  return (
    <>
      <h1>Comunidad</h1>
      <p className="apagado">
        Lo que deja la gente en Yggdrasil, el pozo de Urd y Hvergelmir se publica enseguida; acá podés retirarlo si no respeta las normas, corregir su ortografía o borrarlo para siempre. Quien lo publicó no puede borrarlo.
        Las reflexiones del pozo de Mímir esperan tu aprobación antes de verse.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "1rem 0 1.5rem" }}>
        {SECCIONES.map((s) => (
          <Link key={s.tabla} href={`/hlidskjalf/comunidad?ver=${s.tabla}`} className="chip" aria-current={s.tabla === actual.tabla ? "page" : undefined}>
            {s.nombre}
          </Link>
        ))}
        <Link href="/hlidskjalf/comunidad/ratatoskr" className="chip">
          Frases de Ratatoskr
        </Link>
      </div>
      <h2 style={{ marginTop: 0 }}>
        {actual.nombre} <small className="apagado">· {actual.lugar}</small>
      </h2>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Qué dejó</th>
              <th>Quién</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada.</td>
              </tr>
            )}
            {filas.map((f) => (
              <tr key={f.id}>
                <td style={{ maxWidth: 520 }}>
                  {f.titulo && <strong>{f.titulo}<br /></strong>}
                  {(f.tema || f.taller) && <small className="apagado">{[f.tema, f.taller, f.tipo].filter(Boolean).join(" · ")}<br /></small>}
                  <span className="preline">{f.texto}</span>
                </td>
                <td>{f.nombre || "—"}</td>
                <td>{ETIQUETA[f.estado]}</td>
                <td id={f.id} style={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                  {f.estado !== "publicado" && <Boton tabla={actual.tabla} id={f.id} estado="publicado" texto={f.estado === "pendiente" ? "Aprobar" : "Volver a publicar"} />}{" "}
                  {f.estado !== "oculto" && <Boton tabla={actual.tabla} id={f.id} estado="oculto" texto="Retirar" peligro />}
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>Corregir o borrar</summary>
                    <form action={corregirComunidad} className="form" style={{ marginTop: 10, minWidth: 280 }}>
                      <input type="hidden" name="tabla" value={actual.tabla} />
                      <input type="hidden" name="id" value={f.id} />
                      {f.titulo !== undefined && (actual.tabla === "reflexiones" || actual.tabla === "foro") && (
                        <label>
                          Título
                          <input name="titulo" defaultValue={f.titulo} maxLength={200} />
                        </label>
                      )}
                      <label>
                        Texto
                        <textarea name="texto" defaultValue={f.texto} required maxLength={LARGO[actual.tabla]} />
                      </label>
                      <button className="boton chico">Guardar corrección</button>
                    </form>
                    <form action={borrarComunidad} style={{ marginTop: 10 }}>
                      <input type="hidden" name="tabla" value={actual.tabla} />
                      <input type="hidden" name="id" value={f.id} />
                      <button className="boton chico peligro">Borrar para siempre</button>
                    </form>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
