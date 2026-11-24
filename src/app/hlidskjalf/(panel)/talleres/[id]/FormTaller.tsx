"use client";
import { useActionState, useState } from "react";
import { guardarTaller, type EstadoPanel } from "../../../acciones";
import type { Taller } from "@/lib/types";
import { EditorImagenes } from "../../componentes/EditorImagenes";

export function FormTaller({ taller }: { taller: Taller | null }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarTaller, null);
  const [tipo, setTipo] = useState(taller?.tipo ?? "pago");
  const t = taller;
  return (
    <form action={accion} className="form caja">
      {t && <input type="hidden" name="id" value={t.id} />}
      <label>
        Nombre del taller
        <input name="nombre" required defaultValue={t?.nombre} />
      </label>
      <label>
        Dirección en el sitio <small>(se arma sola con el nombre si la dejás vacía)</small>
        <input name="slug" defaultValue={t?.slug} placeholder="vestirse-tambien-es-comunicar" />
      </label>
      <label>
        Bajada corta
        <input name="bajada" defaultValue={t?.bajada} />
      </label>
      <label>
        Descripción
        <textarea name="descripcion" defaultValue={t?.descripcion} />
      </label>
      <label>
        Detalle <small>(encuentros, quién lo dicta, cómo reservar)</small>
        <textarea name="detalle" defaultValue={t?.detalle} style={{ minHeight: "10rem" }} />
      </label>
      <div className="doble">
        <label>
          Fecha de inicio
          <input name="inicio" type="date" defaultValue={t?.inicio ?? ""} />
        </label>
        <label>
          Fecha de fin
          <input name="fin" type="date" defaultValue={t?.fin ?? ""} />
        </label>
      </div>
      <div className="doble">
        <label>
          Modalidad
          <input name="modalidad" defaultValue={t?.modalidad} />
        </label>
        <label>
          Cantidad de encuentros
          <input name="encuentros" type="number" min={1} defaultValue={t?.encuentros ?? ""} />
        </label>
      </div>
      <div className="doble">
        <label>
          ¿Pago o gratuito?
          <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as "pago" | "gratuito")}>
            <option value="pago">Pago</option>
            <option value="gratuito">Gratuito</option>
          </select>
        </label>
      </div>
      {tipo === "pago" && (
        <>
          <label>
            Inversión, como se muestra en el sitio
            <input name="precio_texto" defaultValue={t?.precio_texto} placeholder="$115.000 transferencia · $127.000 con tarjeta" />
          </label>
        </>
      )}
      <EditorImagenes
        carpeta="talleres"
        iniciales={t?.imagenes ?? []}
        ayuda="Se muestran en la tarjeta del taller, pasando una tras otra. La primera es la principal. Si no cargás ninguna, el sitio usa las fotos de muestra."
      />
      <div className="doble">
        <label>
          Orden en la lista
          <input name="orden" type="number" defaultValue={t?.orden ?? 0} />
        </label>
        <label className="check" style={{ alignSelf: "end" }}>
          <input name="publicado" type="checkbox" defaultChecked={t?.publicado ?? false} /> Publicado en el sitio
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
