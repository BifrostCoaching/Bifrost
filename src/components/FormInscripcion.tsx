"use client";
import { useActionState } from "react";
import { inscribirse, type EstadoForm } from "@/app/acciones";

export function FormInscripcion({ tallerId, pago }: { tallerId: string; pago: boolean }) {
  const [estado, accion, enviando] = useActionState<EstadoForm, FormData>(inscribirse, null);
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
        Teléfono <small>(opcional, para avisos del taller)</small>
        <input name="telefono" type="tel" maxLength={40} autoComplete="tel" />
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
          {enviando ? "Un momento…" : pago ? "Ir a pagar con Mercado Pago" : "Confirmar inscripción"}
        </button>
      </div>
    </form>
  );
}
