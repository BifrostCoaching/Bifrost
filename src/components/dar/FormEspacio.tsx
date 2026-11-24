"use client";
import { useActionState } from "react";
import { sumarEspacio } from "@/app/acciones";
import { TIPOS_ESPACIO } from "./TiposEspacio";

export function FormEspacio() {
  const [estado, accion, enviando] = useActionState(sumarEspacio, null);
  if (estado?.ok) {
    return (
      <p className="aviso" role="status" style={{ flex: "1 1 520px" }}>
        {estado.mensaje}
      </p>
    );
  }
  return (
    <form action={accion} className="form" style={{ flex: "1 1 520px", minWidth: 0, padding: 32, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
      <div className="campo">
        <label htmlFor="d-nombre">Nombre del espacio</label>
        <input id="d-nombre" name="nombre" required maxLength={120} />
      </div>
      <div className="campo">
        <label htmlFor="d-tipo">Tipo</label>
        <select id="d-tipo" name="tipo">
          {TIPOS_ESPACIO.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor="d-zona">Zona</label>
        <input id="d-zona" name="zona" maxLength={120} />
      </div>
      <div className="campo">
        <label htmlFor="d-contacto">Contacto (WhatsApp, email o red)</label>
        <input id="d-contacto" name="contacto" required maxLength={200} />
      </div>
      <div className="campo todo">
        <label htmlFor="d-necesita">¿Qué hacen y qué necesitan?</label>
        <textarea id="d-necesita" name="descripcion" rows={4} maxLength={1500} />
      </div>
      <div className="trampa" aria-hidden="true">
        <input name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>
      {estado && !estado.ok && <p className="aviso error todo" role="alert">{estado.mensaje}</p>}
      <div className="todo">
        <button className="boton" disabled={enviando}>{enviando ? "Enviando…" : "Sumar mi espacio"}</button>
      </div>
    </form>
  );
}
