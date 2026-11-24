"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

type Paso = "cargando" | "clave" | "vencido" | "guardando";

let cliente: ReturnType<typeof createBrowserClient> | null = null;
/** Se crea recién en el navegador (al armar el sitio no hay sesión que leer). */
function supa() {
  cliente ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return cliente;
}

/** Recibe el link de acceso que mandó el equipo y deja elegir la contraseña. */
export function ElegirClave() {
  const [paso, setPaso] = useState<Paso>("cargando");
  const [error, setError] = useState("");

  useEffect(() => {
    // El link trae la sesión en la parte de la dirección que va después de "#".
    const datos = new URLSearchParams(window.location.hash.slice(1));
    const access_token = datos.get("access_token");
    const refresh_token = datos.get("refresh_token");
    window.history.replaceState(null, "", window.location.pathname);
    const supabase = supa();
    (async () => {
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        setPaso(error ? "vencido" : "clave");
        return;
      }
      const { data } = await supabase.auth.getUser();
      setPaso(data.user ? "clave" : "vencido");
    })();
  }, []);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const clave = String(fd.get("clave") ?? "");
    if (clave.length < 8) return setError("La contraseña tiene que tener al menos 8 caracteres.");
    if (clave !== fd.get("repetir")) return setError("Las dos contraseñas no coinciden.");
    setError("");
    setPaso("guardando");
    const { error } = await supa().auth.updateUser({ password: clave });
    if (error) {
      setPaso("clave");
      return setError("No se pudo guardar la contraseña. Probá con otra o pedile un link nuevo al equipo.");
    }
    window.location.href = "/campus";
  }

  if (paso === "cargando") return <p className="apagado" role="status">Abriendo tu acceso…</p>;
  if (paso === "vencido")
    return (
      <p className="aviso error" role="alert">
        Este link ya se usó o venció. Pedile uno nuevo al equipo de Bifröst. Si ya elegiste tu contraseña, entrá desde{" "}
        <a href="/campus/ingresar">Ingresar al campus</a>.
      </p>
    );
  return (
    <form onSubmit={guardar} className="form" style={{ gridTemplateColumns: "1fr" }}>
      <h2 className="h2" style={{ fontSize: "1.8rem", margin: 0 }}>Elegí tu contraseña</h2>
      <div className="campo">
        <label htmlFor="b-clave">Contraseña <small>(al menos 8 caracteres)</small></label>
        <input id="b-clave" name="clave" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="campo">
        <label htmlFor="b-repetir">Repetila</label>
        <input id="b-repetir" name="repetir" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {error && <p className="aviso error" role="alert">{error}</p>}
      <div>
        <button className="boton" disabled={paso === "guardando"}>{paso === "guardando" ? "Guardando…" : "Guardar y entrar"}</button>
      </div>
    </form>
  );
}
