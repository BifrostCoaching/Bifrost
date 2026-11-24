import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Post } from "@/lib/types";
import { borrarPost } from "../../../acciones";
import { FormPost } from "./FormPost";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string }> };

export default async function EditarPost({ params, searchParams }: Props) {
  const { id } = await params;
  const { guardado } = await searchParams;
  let post: Post | null = null;
  if (id !== "nuevo") {
    const { supabase } = await requireEquipo();
    const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    post = data as Post;
  }
  return (
    <>
      <p>
        <Link href="/hlidskjalf/blog">← Blog</Link>
      </p>
      <h1>{post ? post.titulo : "Nuevo artículo"}</h1>
      {guardado && <p className="aviso" role="status">Guardado.</p>}
      {post?.publicado && (
        <p>
          <Link href={`/blog/${post.slug}`} target="_blank">Ver cómo se ve en el sitio ↗</Link>
        </p>
      )}
      <FormPost post={post} />
      {post && (
        <form action={borrarPost} style={{ marginTop: "2rem" }}>
          <input type="hidden" name="id" value={post.id} />
          <button className="boton peligro chico">Eliminar artículo</button>
        </form>
      )}
    </>
  );
}
