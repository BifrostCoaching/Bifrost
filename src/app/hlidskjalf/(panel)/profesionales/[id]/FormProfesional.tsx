"use client";
import { useActionState } from "react";
import { guardarProfesional, type EstadoPanel } from "../../../acciones";
import type { Profesional } from "@/lib/types";
import { EditorImagenes } from "../../componentes/EditorImagenes";

export function FormProfesional({ profesional: p }: { profesional: Profesional | null }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarProfesional, null);
  return (
    <form action={accion} className="form caja">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="doble">
        <label>
          Nombre y apellido
          <input name="nombre" required defaultValue={p?.nombre} />
        </label>
        <label>
          Oficio
          <input name="oficio" defaultValue={p?.oficio} placeholder="Coach ontológica, asesor de imagen, contadora…" />
        </label>
      </div>
      <label>
        Descripción <small>(qué hace y cómo trabaja con Bifröst)</small>
        <textarea name="descripcion" defaultValue={p?.descripcion} />
      </label>
      <label>
        Contacto <small>(email, WhatsApp con código de área, @instagram o un link; el sitio arma el botón solo)</small>
        <input name="contacto" defaultValue={p?.contacto} />
      </label>
      <EditorImagenes carpeta="profesionales" iniciales={p?.imagen ? [p.imagen] : []} max={1} ayuda="Una foto de la persona, en lo posible cuadrada." />
      <div className="doble">
        <label>
          Orden en la lista
          <input name="orden" type="number" defaultValue={p?.orden ?? 0} />
        </label>
        <label className="check" style={{ alignSelf: "end" }}>
          <input name="publicado" type="checkbox" defaultChecked={p?.publicado ?? false} /> Publicado en el sitio
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
