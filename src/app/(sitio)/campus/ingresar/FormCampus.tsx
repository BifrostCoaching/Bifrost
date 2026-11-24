"use client";
import { useActionState } from "react";
import { ingresarCampus } from "../acciones";

export function FormCampus() {
  const [error, accion, enviando] = useActionState<string | null, FormData>(ingresarCampus, null);
  return (
    <form action={accion} className="form" style={{ gridTemplateColumns: "1fr" }}>
      <div className="campo">
        <label htmlFor="cp-email">Email</label>
        <input id="cp-email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="campo">
        <label htmlFor="cp-pass">Contraseña</label>
        <input id="cp-pass" name="password" type="password" required autoComplete="current-password" />
      </div>
      {error && <p className="aviso error" role="alert">{error}</p>}
      <div>
        <button className="boton" disabled={enviando}>{enviando ? "Entrando…" : "Entrar al campus"}</button>
      </div>
    </form>
  );
}
