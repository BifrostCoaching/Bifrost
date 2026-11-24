"use client";
import { useActionState } from "react";
import { guardarPost, type EstadoPanel } from "../../../acciones";
import { TEMAS_BLOG } from "@/lib/site";
import type { Post } from "@/lib/types";

export function FormPost({ post }: { post: Post | null }) {
  const [estado, accion, guardando] = useActionState<EstadoPanel, FormData>(guardarPost, null);
  const p = post;
  return (
    <form action={accion} className="form caja">
      {p && <input type="hidden" name="id" value={p.id} />}
      <label>
        Título
        <input name="titulo" required defaultValue={p?.titulo} />
      </label>
      <label>
        Dirección en el sitio <small>(se arma sola con el título si la dejás vacía)</small>
        <input name="slug" defaultValue={p?.slug} placeholder="el-lenguaje-no-describe-genera" />
      </label>
      <div className="doble">
        <label>
          Tema
          <select name="tema" defaultValue={p?.tema ?? TEMAS_BLOG[0]}>
            {TEMAS_BLOG.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Fecha
          <input name="fecha" type="date" defaultValue={p?.fecha ?? ""} />
        </label>
      </div>
      <label>
        Resumen <small>(dos o tres líneas que se ven en la lista)</small>
        <textarea name="resumen" defaultValue={p?.resumen} />
      </label>
      <label>
        Texto completo <small>(dejá una línea en blanco entre párrafos)</small>
        <textarea name="texto" defaultValue={p?.texto} style={{ minHeight: "22rem" }} />
      </label>
      <label className="check">
        <input name="publicado" type="checkbox" defaultChecked={p?.publicado ?? false} /> Publicado en el sitio
      </label>
      {estado && <p className={`aviso ${estado.ok ? "" : "error"}`} role="status">{estado.mensaje}</p>}
      <div>
        <button className="boton" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
