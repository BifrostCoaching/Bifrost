"use client";
import { useActionState } from "react";
import { guardarServicio, type EstadoPanel } from "../../../acciones";
import type { Servicio } from "@/lib/types";
import { EditorImagenes } from "../../componentes/EditorImagenes";

export function FormServicio({ servicio: s }: { servicio: Servicio | null }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarServicio, null);
  return (
    <form action={accion} className="form caja">
      {s && <input type="hidden" name="id" value={s.id} />}
      <label>
        Nombre del servicio
        <input name="nombre" required defaultValue={s?.nombre} />
      </label>
      <label>
        Bajada corta
        <input name="bajada" defaultValue={s?.bajada} />
      </label>
      <label>
        Descripción <small>(qué es, cómo se trabaja, qué se lleva la persona o el equipo)</small>
        <textarea name="descripcion" defaultValue={s?.descripcion} style={{ minHeight: "10rem" }} />
      </label>
      <label>
        Para quién es
        <input name="para_quien" defaultValue={s?.para_quien} placeholder="Personas, equipos de trabajo, empresas…" />
      </label>
      <div className="doble">
        <label>
          Modalidad
          <input name="modalidad" defaultValue={s?.modalidad} placeholder="Presencial, online, a medida…" />
        </label>
        <label>
          Inversión, como se muestra en el sitio <small>(podés poner &quot;A convenir&quot;)</small>
          <input name="precio_texto" defaultValue={s?.precio_texto} />
        </label>
      </div>
      <EditorImagenes
        carpeta="servicios"
        iniciales={s?.imagenes ?? []}
        ayuda="Se muestran en la tarjeta del servicio, pasando una tras otra. La primera es la principal."
      />
      <div className="doble">
        <label>
          Orden en la lista
          <input name="orden" type="number" defaultValue={s?.orden ?? 0} />
        </label>
        <label className="check" style={{ alignSelf: "end" }}>
          <input name="publicado" type="checkbox" defaultChecked={s?.publicado ?? false} /> Publicado en el sitio
        </label>
      </div>
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      <div>
        <button className="boton" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
