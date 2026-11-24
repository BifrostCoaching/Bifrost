"use client";
import { useActionState } from "react";
import { enviarConsulta, type EstadoForm } from "@/app/acciones";

export function FormContacto({ talleres }: { talleres: string[] }) {
  const [estado, accion, enviando] = useActionState<EstadoForm, FormData>(enviarConsulta, null);
  if (estado?.ok) {
    return <p className="aviso" role="status">{estado.mensaje}</p>;
  }
  return (
    <form action={accion} className="form">
      <div className="doble">
        <label>
          Nombre
          <input name="nombre" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <label>
        Motivo
        <select name="motivo" defaultValue="">
          <option value="" disabled>
            Elegí una opción
          </option>
          {talleres.map((t) => (
            <option key={t}>{t}</option>
          ))}
          <option>Quiero un espacio para mi equipo</option>
          <option>Quiero sumarme como profesional</option>
          <option>Otra consulta</option>
        </select>
      </label>
      <label>
        Mensaje
        <textarea name="mensaje" required maxLength={3000} />
      </label>
      <div className="trampa" aria-hidden="true">
        <label>
          No completar
          <input name="sitio_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {estado && !estado.ok && <p className="aviso error" role="alert">{estado.mensaje}</p>}
      <div>
        <button className="boton" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
