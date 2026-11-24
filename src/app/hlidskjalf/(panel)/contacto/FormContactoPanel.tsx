"use client";
import { useActionState } from "react";
import { guardarContacto, type EstadoPanel } from "../../acciones";

export function FormContactoPanel({ email, whatsapp, instagram, linkedin }: { email: string; whatsapp: string; instagram: string; linkedin: string }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarContacto, null);
  return (
    <form action={accion} className="form caja">
      <label>
        Email
        <input name="email" type="email" defaultValue={email} placeholder="hola@bifrost.com.ar" />
      </label>
      <label>
        WhatsApp <small>(con código de país, por ejemplo +54 9 11 1234 5678)</small>
        <input name="whatsapp" defaultValue={whatsapp} placeholder="+54 9 11 1234 5678" />
      </label>
      <label>
        Instagram <small>(el usuario, con o sin @)</small>
        <input name="instagram" defaultValue={instagram} placeholder="@bifrost" />
      </label>
      <label>
        LinkedIn <small>(pegá el link de la página, por ejemplo https://www.linkedin.com/company/bifrost)</small>
        <input name="linkedin" defaultValue={linkedin} placeholder="https://www.linkedin.com/company/..." />
      </label>
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      <div>
        <button className="boton" disabled={guardando}>{guardando ? "Guardando…" : "Guardar"}</button>
      </div>
    </form>
  );
}
