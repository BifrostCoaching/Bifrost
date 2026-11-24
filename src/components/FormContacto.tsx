"use client";
import { useActionState, useState } from "react";
import { enviarConsulta, type EstadoForm } from "@/app/acciones";

export function FormContacto({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, enviando] = useActionState<EstadoForm, FormData>(enviarConsulta, null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
        {children}
        <button type="button" className="boton" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} aria-controls="form-contacto">
          <span>{abierto ? "Cerrar formulario" : "Escribinos un mensaje"}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`chev${abierto ? " up" : ""}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {abierto &&
        (estado?.ok ? (
          <p className="aviso" role="status">{estado.mensaje}</p>
        ) : (
          <form id="form-contacto" action={accion} className="form form-caja">
            <div className="campo">
              <label htmlFor="c-nombre">Nombre</label>
              <input id="c-nombre" name="nombre" required maxLength={120} autoComplete="name" />
            </div>
            <div className="campo">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" />
            </div>
            <div className="campo todo">
              <label htmlFor="c-motivo">Motivo</label>
              <select id="c-motivo" name="motivo">
                <option>Talleres</option>
                <option>Servicios</option>
                <option>Quiero un espacio para mi equipo</option>
                <option>Quiero sumarme como profesional</option>
                <option>Otra consulta</option>
              </select>
            </div>
            <div className="campo todo">
              <label htmlFor="c-mensaje">Mensaje</label>
              <textarea id="c-mensaje" name="mensaje" rows={4} required maxLength={3000} />
            </div>
            <div className="trampa" aria-hidden="true">
              <input name="sitio_web" tabIndex={-1} autoComplete="off" />
            </div>
            {estado && !estado.ok && <p className="aviso error todo" role="alert">{estado.mensaje}</p>}
            <div className="todo">
              <button className="boton" disabled={enviando}>
                {enviando ? "Enviando…" : "Enviar mensaje"}
              </button>
            </div>
          </form>
        ))}
    </div>
  );
}
