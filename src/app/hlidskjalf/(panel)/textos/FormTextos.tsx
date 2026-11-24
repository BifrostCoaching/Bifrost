"use client";
import { useActionState } from "react";
import { guardarTextos, type EstadoPanel } from "../../acciones";

type Seccion = { id: string; nombre: string; titulo: string; bajada: string; tituloOriginal: string; bajadaOriginal: string };

export function FormTextos({ temas, secciones }: { temas: string; secciones: Seccion[] }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarTextos, null);
  const boton = (
    <div>
      <button className="boton" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar todo"}
      </button>
    </div>
  );
  return (
    <form action={accion} className="form caja">
      <h2 style={{ margin: 0 }}>Temas del blog</h2>
      <label>
        Un tema por línea <small>(en el sitio solo aparecen los temas que tienen algún artículo publicado)</small>
        <textarea name="temas_blog" defaultValue={temas} style={{ minHeight: "9rem" }} />
      </label>
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      {boton}
      {secciones.map((s) => (
        <fieldset key={s.id} className="editor-imagenes">
          <legend>{s.nombre}</legend>
          <label>
            Título
            <input name={`${s.id}.titulo`} defaultValue={s.titulo} placeholder={s.tituloOriginal} maxLength={160} />
          </label>
          <label>
            Leyenda
            <textarea name={`${s.id}.bajada`} defaultValue={s.bajada} placeholder={s.bajadaOriginal} maxLength={600} />
          </label>
        </fieldset>
      ))}
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      {boton}
    </form>
  );
}
