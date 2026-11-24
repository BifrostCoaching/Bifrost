import { requireEquipo } from "@/lib/supabase/equipo";
import { PORTADAS } from "@/lib/portadas";
import { TEMAS_BLOG } from "@/lib/site";
import { FormTextos } from "./FormTextos";

export default async function Textos() {
  const { supabase } = await requireEquipo();
  const { data } = await supabase.from("ajustes").select("clave, valor");
  const valores: Record<string, string> = {};
  for (const f of (data ?? []) as { clave: string; valor: string }[]) valores[f.clave] = f.valor;
  const secciones = Object.entries(PORTADAS).map(([id, p]) => ({
    id,
    nombre: p.nombre,
    titulo: valores[`portada.${id}.titulo`] ?? "",
    bajada: valores[`portada.${id}.bajada`] ?? "",
    tituloOriginal: p.titulo,
    bajadaOriginal: p.bajada,
  }));
  return (
    <>
      <h1>Textos del sitio</h1>
      <p className="apagado">
        El título grande y la leyenda de abajo de cada pestaña, y los temas del blog. Si dejás un campo vacío, se usa el texto original
        (el que ves en gris).
      </p>
      <FormTextos temas={valores.temas_blog ?? TEMAS_BLOG.join("\n")} secciones={secciones} />
    </>
  );
}
