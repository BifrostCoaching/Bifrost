import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEquipo } from "@/lib/supabase/equipo";
import type { Evento } from "@/lib/types";
import { borrarEvento } from "../../../acciones";
import { FormEvento } from "./FormEvento";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string }> };

export default async function EditarEvento({ params, searchParams }: Props) {
  const { id } = await params;
  const { guardado } = await searchParams;
  let evento: Evento | null = null;
  if (id !== "nuevo") {
    const { supabase } = await requireEquipo();
    const { data } = await supabase.from("eventos").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    evento = data as Evento;
  }
  return (
    <>
      <p>
        <Link href="/hlidskjalf/eventos">← Eventos</Link>
      </p>
      <h1>{evento ? evento.titulo : "Nuevo evento"}</h1>
      {guardado && <p className="aviso" role="status">Guardado. Ya se ve en el calendario.</p>}
      <FormEvento evento={evento} />
      {evento && (
        <form action={borrarEvento} style={{ marginTop: "2rem" }}>
          <input type="hidden" name="id" value={evento.id} />
          <button className="boton peligro chico">Eliminar evento</button>
        </form>
      )}
    </>
  );
}
