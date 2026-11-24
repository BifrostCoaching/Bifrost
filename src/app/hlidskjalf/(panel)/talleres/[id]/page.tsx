import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Taller } from "@/lib/types";
import { borrarTaller } from "../../../acciones";
import { FormTaller } from "./FormTaller";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string }> };

export default async function EditarTaller({ params, searchParams }: Props) {
  const { id } = await params;
  const { guardado } = await searchParams;
  let taller: Taller | null = null;
  if (id !== "nuevo") {
    const { supabase } = await requireEquipo();
    const { data } = await supabase.from("talleres").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    taller = data as Taller;
  }
  return (
    <>
      <p>
        <Link href="/hlidskjalf/talleres">← Talleres</Link>
      </p>
      <h1>{taller ? taller.nombre : "Nuevo taller"}</h1>
      {guardado && <p className="aviso" role="status">Guardado. Ya se ve en el sitio.</p>}
      <FormTaller taller={taller} />
      {taller && (
        <form action={borrarTaller} style={{ marginTop: "2rem" }}>
          <input type="hidden" name="id" value={taller.id} />
          <button className="boton peligro chico">Eliminar taller</button>
          <p className="apagado" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Si ya tiene interesados, no se borra: queda despublicado para no perder el registro.
          </p>
        </form>
      )}
    </>
  );
}
