"use client";
import { useActionState } from "react";
import { guardarEvento, type EstadoPanel } from "../../../acciones";
import type { Evento } from "@/lib/types";
import { EditorImagenes } from "../../componentes/EditorImagenes";

export function FormEvento({ evento: e }: { evento: Evento | null }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarEvento, null);
  return (
    <form action={accion} className="form caja">
      {e && <input type="hidden" name="id" value={e.id} />}
      <label>
        Nombre del evento
        <input name="titulo" required defaultValue={e?.titulo} />
      </label>
      <div className="doble">
        <label>
          Organiza
          <input name="organiza" defaultValue={e?.organiza ?? "Bifröst"} />
        </label>
        <label>
          Modalidad y lugar
          <input name="modalidad" defaultValue={e?.modalidad} />
        </label>
      </div>
      <div className="doble">
        <label>
          Fecha de inicio
          <input name="inicio" type="date" defaultValue={e?.inicio ?? ""} />
        </label>
        <label>
          Fecha de fin
          <input name="fin" type="date" defaultValue={e?.fin ?? ""} />
        </label>
      </div>
      <div className="doble">
        <label>
          ¿Pago o gratuito?
          <select name="tipo" defaultValue={e?.tipo ?? "gratuito"}>
            <option value="gratuito">Gratuito</option>
            <option value="pago">Pago</option>
          </select>
        </label>
        <label>
          Valor (si es pago)
          <input name="precio_texto" defaultValue={e?.precio_texto} />
        </label>
      </div>
      <label>
        Descripción
        <textarea name="descripcion" defaultValue={e?.descripcion} />
      </label>
      <EditorImagenes
        carpeta="eventos"
        iniciales={e?.imagen ? [e.imagen] : []}
        max={1}
        ayuda="Opcional. Se muestra junto al evento en el calendario y en el campus."
      />
      <label className="check">
        <input name="publicado" type="checkbox" defaultChecked={e?.publicado ?? false} /> Publicado en el sitio
      </label>
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      <div>
        <button className="boton" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
