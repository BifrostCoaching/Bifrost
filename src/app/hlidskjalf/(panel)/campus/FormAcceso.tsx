"use client";
import { useActionState, useState } from "react";
import { darAcceso, type EstadoAcceso } from "../../acciones";

type Props = { talleres: { id: string; nombre: string }[]; email?: string; nombre?: string; taller?: string; estado?: string };

export function FormAcceso({ talleres, email, nombre, taller, estado: estadoInicial }: Props) {
  const [estado, accion, creando] = useActionState<EstadoAcceso, FormData>(darAcceso, null);
  const [copiado, setCopiado] = useState(false);
  return (
    <form action={accion} className="form caja" id="acceso">
      <h2 style={{ margin: 0 }}>Dar acceso al campus</h2>
      <p className="apagado" style={{ margin: 0 }}>
        Se genera un link para que la persona elija su contraseña. Mandáselo vos por WhatsApp o email. Si ya tenía acceso, el link le sirve
        para elegir una contraseña nueva.
      </p>
      <div className="doble">
        <label>
          Email
          <input name="email" type="email" required defaultValue={email} />
        </label>
        <label>
          Nombre
          <input name="nombre" maxLength={120} defaultValue={nombre} />
        </label>
      </div>
      <div className="doble">
        <label>
          Taller <small>(opcional)</small>
          <select name="taller_id" defaultValue={taller ?? ""}>
            <option value="">Sin taller por ahora</option>
            {talleres.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </label>
        <label>
          Inscripción
          <select name="estado" defaultValue={estadoInicial === "confirmada" ? "confirmada" : "pendiente"}>
            <option value="confirmada">Confirmada (ya pagó o es gratuito)</option>
            <option value="pendiente">Pendiente (falta confirmar el pago)</option>
          </select>
        </label>
      </div>
      {estado && (
        <div className={`aviso ${estado.ok ? "" : "error"}`} role="status">
          <p style={{ margin: 0 }}>{estado.mensaje}</p>
          {estado.link && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <input readOnly value={estado.link} onFocus={(e) => e.currentTarget.select()} style={{ flex: "1 1 320px", fontSize: "0.85rem" }} aria-label="Link de acceso" />
              <button
                type="button"
                className="boton chico"
                onClick={() => navigator.clipboard.writeText(estado.link!).then(() => setCopiado(true))}
              >
                {copiado ? "¡Copiado!" : "Copiar link"}
              </button>
            </div>
          )}
        </div>
      )}
      <div>
        <button className="boton" disabled={creando}>{creando ? "Creando…" : "Crear link de acceso"}</button>
      </div>
    </form>
  );
}
