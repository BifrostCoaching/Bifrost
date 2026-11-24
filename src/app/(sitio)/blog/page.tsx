import type { Metadata } from "next";
import Link from "next/link";
import { Contacto } from "@/components/Contacto";
import { BandaReflexiones } from "@/components/BandaReflexiones";
import { Portada } from "@/components/Portada";
import { postsPublicados, temasBlog } from "@/lib/datos";
import { textosPortada } from "@/lib/portadas";

export const revalidate = 60;
export const metadata: Metadata = { title: "Blog" };

export default async function Blog({ searchParams }: { searchParams: Promise<{ tema?: string }> }) {
  const portada = await textosPortada("blog");
  const { tema } = await searchParams;
  const [posts, todos] = await Promise.all([postsPublicados(), temasBlog()]);
  // Solo se muestran los temas que tienen al menos un artículo publicado.
  const TEMAS = todos.filter((t) => posts.some((p) => p.tema === t));
  const elegido = tema && TEMAS.includes(tema) ? tema : "Todos";
  const visibles = elegido === "Todos" ? posts : posts.filter((p) => p.tema === elegido);

  return (
    <>
      <Portada
        ceja="Blog"
        titulo={portada.titulo}
        bajada={portada.bajada}
      />
      <section id="articulos" className="seccion">
        <div className="ancho">
          {TEMAS.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }} role="group" aria-label="Filtrar por tema">
            {["Todos", ...TEMAS].map((t) => (
              <Link
                key={t}
                href={t === "Todos" ? "/blog#articulos" : `/blog?tema=${encodeURIComponent(t)}#articulos`}
                className={`chip${elegido === t ? " on" : ""}`}
                aria-current={elegido === t ? "true" : undefined}
                scroll={false}
              >
                {t}
              </Link>
            ))}
          </div>
          )}
          {visibles.length === 0 ? (
            <p className="apagado" style={{ margin: 0 }}>
              {posts.length === 0 ? "Pronto vas a encontrar acá los primeros artículos." : "Todavía no hay artículos en este tema."}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {visibles.map((p) => (
                <article key={p.id} className="post">
                  <span className="tema">{p.tema}</span>
                  <h3>{p.titulo}</h3>
                  <p className="apagado" style={{ margin: 0 }}>{p.resumen}</p>
                  <Link href={`/blog/${p.slug}`} style={{ marginTop: "auto", fontWeight: 600 }}>
                    Leer →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <BandaReflexiones />
      <Contacto />
    </>
  );
}
