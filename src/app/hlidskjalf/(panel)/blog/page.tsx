import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import { fecha } from "@/lib/format";
import type { Post } from "@/lib/types";

export default async function BlogPanel() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase.from("posts").select("*").order("fecha", { ascending: false });
  const posts = (data ?? []) as Post[];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Blog</h1>
        <Link href="/hlidskjalf/blog/nuevo" className="boton">
          Nuevo artículo
        </Link>
      </div>
      <p className="apagado">Los artículos publicados se ven en la página Blog. Los borradores solo los ve el equipo.</p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Tema</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={4}>Todavía no hay nada cargado.</td>
              </tr>
            )}
            {posts.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/hlidskjalf/blog/${p.id}`}>{p.titulo}</Link>
                </td>
                <td>{p.tema}</td>
                <td>{fecha(p.fecha)}</td>
                <td>{p.publicado ? "Publicado" : "Borrador"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
