import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Servicio } from "@/lib/types";
import { borrarServicio } from "../../../acciones";
import { FormServicio } from "./FormServicio";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string }> };

export default async function EditarServicio({ params, searchParams }: Props) {
  const { id } = await params;
  const { guardado } = await searchParams;
  let servicio: Servicio | null = null;
  if (id !== "nuevo") {
    const { supabase } = await requireEquipo();
    const { data } = await supabase.from("servicios").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    servicio = data as Servicio;
  }
  return (
    <>
      <p>
        <Link href="/hlidskjalf/servicios">← Servicios</Link>
      </p>
      <h1>{servicio ? servicio.nombre : "Nuevo servicio"}</h1>
      {guardado && <p className="aviso" role="status">Guardado. Ya se ve en el sitio.</p>}
      <FormServicio servicio={servicio} />
      {servicio && (
        <form action={borrarServicio} style={{ marginTop: "2rem" }}>
          <input type="hidden" name="id" value={servicio.id} />
          <button className="boton peligro chico">Eliminar servicio</button>
          <p className="apagado" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Se borra junto con sus fotos. Si solo querés ocultarlo, destildá &quot;Publicado&quot; y guardá.
          </p>
        </form>
      )}
    </>
  );
}
