import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Profesional } from "@/lib/types";
import { borrarProfesional } from "../../../acciones";
import { FormProfesional } from "./FormProfesional";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string }> };

export default async function EditarProfesional({ params, searchParams }: Props) {
  const { id } = await params;
  const { guardado } = await searchParams;
  let profesional: Profesional | null = null;
  if (id !== "nuevo") {
    const { supabase } = await requireEquipo();
    const { data } = await supabase.from("profesionales").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    profesional = data as Profesional;
  }
  return (
    <>
      <p>
        <Link href="/hlidskjalf/profesionales">← Profesionales</Link>
      </p>
      <h1>{profesional ? profesional.nombre : "Nuevo profesional"}</h1>
      {guardado && <p className="aviso" role="status">Guardado. Ya se ve en el sitio.</p>}
      <FormProfesional profesional={profesional} />
      {profesional && (
        <form action={borrarProfesional} style={{ marginTop: "2rem" }}>
          <input type="hidden" name="id" value={profesional.id} />
          <button className="boton peligro chico">Eliminar profesional</button>
          <p className="apagado" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Se borra junto con su foto. Si solo querés ocultarlo, destildá &quot;Publicado&quot; y guardá.
          </p>
        </form>
      )}
    </>
  );
}
