import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BandaReflexiones } from "@/components/BandaReflexiones";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { postPorSlug, talleresPublicados } from "@/lib/datos";
import { fecha } from "@/lib/format";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await postPorSlug((await params).slug);
  return post ? { title: post.titulo, description: post.resumen } : { title: "Blog" };
}

export default async function Articulo({ params }: Params) {
  const post = await postPorSlug((await params).slug);
  if (!post) notFound();
  const talleres = await talleresPublicados();
  // El texto se guarda como texto plano: cada línea en blanco separa un párrafo.
  const parrafos = (post.texto || post.resumen).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <Portada ceja={`Blog · ${post.tema}`} titulo={post.titulo} bajada={post.resumen} />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <article className="articulo">
          {post.fecha && (
            <p className="apagado" style={{ margin: "0 0 24px", fontSize: "1rem" }}>
              {fecha(post.fecha)}
            </p>
          )}
          {parrafos.map((p, i) => (
            <p key={i} className="preline" style={{ margin: "0 0 1.2em" }}>
              {p}
            </p>
          ))}
          <p style={{ marginTop: 40 }}>
            <Link href="/blog" style={{ fontWeight: 600 }}>
              ← Volver al blog
            </Link>
          </p>
        </article>
      </section>
      <BandaReflexiones />
      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}
