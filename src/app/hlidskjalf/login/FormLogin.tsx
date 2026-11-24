"use client";
import { useActionState } from "react";
import { ingresar } from "../acciones";

export function FormLogin() {
  const [error, accion, enviando] = useActionState<string | null, FormData>(ingresar, null);
  return (
    <form action={accion} className="form">
      <label>
        Email
        <input name="email" type="email" required autoComplete="username" />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {error && <p className="aviso error" role="alert">{error}</p>}
      <div>
        <button className="boton" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </form>
  );
}
