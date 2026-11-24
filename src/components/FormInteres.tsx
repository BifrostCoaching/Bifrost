"use client";
import { useActionState } from "react";
import { registrarInteres, type EstadoForm } from "@/app/acciones";

export function FormInteres({ tallerId }: { tallerId: string }) {
  const [estado, accion, enviando] = useActionState<EstadoForm, FormData>(registrarInteres, null);
  if (estado?.ok) return <p className="aviso" role="status">{estado.mensaje}</p>;
  return (
    <form action={accion} className="form una">
      <input type="hidden" name="taller_id" value={tallerId} />
      <div className="campo">
        <label htmlFor="i-nombre">Nombre y apellido</label>
        <input id="i-nombre" name="nombre" required maxLength={120} autoComplete="name" />
      </div>
      <div className="campo">
        <label htmlFor="i-email">Email</label>
        <input id="i-email" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>
      <div className="campo">
        <label htmlFor="i-tel">
          Teléfono o WhatsApp <small>(opcional)</small>
        </label>
        <input id="i-tel" name="telefono" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="campo">
        <label htmlFor="i-com">
          ¿Querés contarnos algo? <small>(opcional)</small>
        </label>
        <textarea id="i-com" name="comentario" maxLength={2000} style={{ minHeight: "5rem" }} />
      </div>
      <div className="trampa" aria-hidden="true">
        <input name="sitio_web" tabIndex={-1} autoComplete="off" />
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
