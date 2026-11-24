"use client";
import { useActionState } from "react";
import { registrarInteres, type EstadoForm } from "@/app/acciones";

export function FormInteres({ tallerId }: { tallerId: string }) {
  const [estado, accion, enviando] = useActionState<EstadoForm, FormData>(registrarInteres, null);
  if (estado?.ok) return <p className="aviso" role="status">{estado.mensaje}</p>;
  return (
    <form action={accion} className="form">
      <input type="hidden" name="taller_id" value={tallerId} />
      <label>
        Nombre y apellido
        <input name="nombre" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={200} autoComplete="email" />
      </label>
      <label>
        Teléfono o WhatsApp <small>(opcional)</small>
        <input name="telefono" type="tel" maxLength={40} autoComplete="tel" />
      </label>
      <label>
        ¿Querés contarnos algo? <small>(opcional)</small>
        <textarea name="comentario" maxLength={2000} style={{ minHeight: "5rem" }} />
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
          {enviando ? "Enviando…" : "Me interesa"}
        </button>
      </div>
    </form>
  );
}
