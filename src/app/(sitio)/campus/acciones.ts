"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireParticipante } from "@/lib/campus";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function txt(fd: FormData, k: string, max: number) {
  return String(fd.get(k) ?? "").trim().slice(0, max);
}

export async function ingresarCampus(_prev: string | null, fd: FormData): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: txt(fd, "email", 200), password: String(fd.get("password") ?? "") });
  if (error || !data.user) return "El email o la contraseña no coinciden.";
  const { data: p } = await supabase.from("participantes").select("id").eq("id", data.user.id).maybeSingle();
  if (!p) {
    await supabase.auth.signOut();
    return "Esa cuenta todavía no tiene acceso al campus. Pedíselo al equipo de Bifröst.";
  }
  redirect("/campus");
}

export async function salirCampus() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/campus/ingresar");
}

/** Pide un lugar en un taller: queda pendiente hasta que el equipo lo confirma. */
export async function inscribirme(fd: FormData) {
  const { participante } = await requireParticipante();
  const tallerId = txt(fd, "taller_id", 60);
  const db = createAdminClient();
  const { data: taller } = await db.from("talleres").select("id").eq("id", tallerId).eq("publicado", true).maybeSingle();
  if (!taller) return;
  const { error } = await db.from("inscripciones").insert({ participante_id: participante.id, taller_id: taller.id, estado: "pendiente" });
  if (!error) {
    // También queda como interesado, para que ventas lo vea en su lista de siempre.
    await db.from("interesados").insert({
      taller_id: taller.id, nombre: participante.nombre || participante.email, email: participante.email, comentario: "Se anotó desde el Campus.",
    });
  }
  revalidatePath("/campus");
}

/** Marca o desmarca un módulo como completado. Solo de talleres con inscripción confirmada. */
export async function marcarModulo(fd: FormData) {
  const { supabase, participante } = await requireParticipante();
  const moduloId = txt(fd, "modulo_id", 60);
  const { data: modulo } = await supabase.from("modulos").select("id").eq("id", moduloId).maybeSingle(); // las reglas de seguridad filtran
  if (!modulo) return;
  const db = createAdminClient();
  if (fd.get("hecho") === "1") await db.from("avances").delete().eq("participante_id", participante.id).eq("modulo_id", modulo.id);
  else await db.from("avances").insert({ participante_id: participante.id, modulo_id: modulo.id });
  revalidatePath("/campus");
}

const CUANDO = ["semana", "mes", "anio", "largo"];

export async function agregarPlan(fd: FormData) {
  const { participante } = await requireParticipante();
  const texto = txt(fd, "texto", 80);
  const cuando = txt(fd, "cuando", 10);
  if (!texto) return;
  const db = createAdminClient();
  const { count } = await db.from("agenda").select("id", { count: "exact", head: true }).eq("participante_id", participante.id);
  if ((count ?? 0) >= 200) return;
  await db.from("agenda").insert({ participante_id: participante.id, texto, cuando: CUANDO.includes(cuando) ? cuando : "semana" });
  revalidatePath("/campus");
}

export async function borrarPlan(fd: FormData) {
  const { participante } = await requireParticipante();
  await createAdminClient().from("agenda").delete().eq("id", txt(fd, "id", 60)).eq("participante_id", participante.id);
  revalidatePath("/campus");
}
