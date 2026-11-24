import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { eventosPublicados, talleresPublicados } from "./datos";
import type { Evento, Inscripcion, ItemAgenda, Modulo, Participante, Taller } from "./types";

/** Devuelve la sesión del participante, o lo manda a ingresar. */
export async function requireParticipante() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/campus/ingresar");
  const { data } = await supabase.from("participantes").select("*").eq("id", user.id).maybeSingle();
  if (!data) redirect("/campus/ingresar?error=sin-acceso");
  return { supabase, user, participante: data as Participante };
}

export type DatosCampus = {
  participante: Participante;
  talleres: Taller[];
  eventos: Evento[];
  inscripciones: Inscripcion[];
  modulos: Modulo[];
  hechos: Set<string>;
  agenda: ItemAgenda[];
};

/** Todo lo que necesita la página del campus para quien está adentro. */
export async function datosCampus(): Promise<DatosCampus> {
  if (process.env.BIFROST_DEMO === "1" && !process.env.NEXT_PUBLIC_SUPABASE_URL) return demo();
  const { supabase, participante } = await requireParticipante();
  const [talleres, eventos, ins, mods, av, ag] = await Promise.all([
    talleresPublicados(),
    eventosPublicados(),
    supabase.from("inscripciones").select("*").eq("participante_id", participante.id),
    supabase.from("modulos").select("*").order("numero"),
    supabase.from("avances").select("modulo_id").eq("participante_id", participante.id),
    supabase.from("agenda").select("id, texto, cuando, created_at").eq("participante_id", participante.id).order("created_at"),
  ]);
  const inscripciones = (ins.data ?? []) as Inscripcion[];
  // Los talleres confirmados pueden no estar publicados (ya terminaron): se buscan aparte.
  const faltan = inscripciones.filter((i) => i.estado !== "cancelada" && !talleres.some((t) => t.id === i.taller_id)).map((i) => i.taller_id);
  const extra = faltan.length ? (((await supabase.from("talleres").select("*").in("id", faltan)).data ?? []) as Taller[]) : [];
  return {
    participante,
    talleres: [...talleres, ...extra.map((t) => ({ ...t, publicado: false }))],
    eventos,
    inscripciones,
    modulos: (mods.data ?? []) as Modulo[],
    hechos: new Set(((av.data ?? []) as { modulo_id: string }[]).map((a) => a.modulo_id)),
    agenda: (ag.data ?? []) as ItemAgenda[],
  };
}

/** Datos de ejemplo para ver el diseño sin base de datos (BIFROST_DEMO=1). */
async function demo(): Promise<DatosCampus> {
  const talleres = await talleresPublicados();
  const nombres = ["Taller de ejemplo A", "Taller de ejemplo B", "Taller de ejemplo C", "Taller de ejemplo D", "Taller de ejemplo E"];
  const base = talleres[0];
  const todos: Taller[] = [...talleres, ...nombres.map((nombre, k) => ({ ...base, id: `x${k}`, slug: `x${k}`, nombre, publicado: false }))];
  const ids = [talleres[0].id, "x0", "x1", "x2", "x3", talleres[1].id];
  const inscripciones: Inscripcion[] = ids.map((taller_id, k) => ({
    id: `i${k}`, participante_id: "demo", taller_id, estado: k === 5 ? "pendiente" : "confirmada", created_at: "",
  }));
  const modulos: Modulo[] = ids.slice(0, 5).flatMap((taller_id) =>
    [1, 2, 3, 4].map((n) => ({
      id: `${taller_id}-m${n}`, taller_id, numero: n, titulo: `Módulo de ejemplo ${n}`,
      clases: `Clase ${n} [PENDIENTE]`, materiales: `Material de ejemplo: https://example.com/material-${n}`,
    })),
  );
  const avance = [4, 2, 0, 1, 3]; // módulos hechos por taller
  const hechos = new Set(ids.slice(0, 5).flatMap((t, k) => [1, 2, 3, 4].slice(0, avance[k]).map((n) => `${t}-m${n}`)));
  return {
    participante: { id: "demo", email: "persona@ejemplo.com", nombre: "[Nombre]", created_at: "" },
    talleres: todos,
    eventos: [],
    inscripciones,
    modulos,
    hechos,
    agenda: [
      { id: "a1", texto: "Repasar el material del módulo 2", cuando: "semana", created_at: "" },
      { id: "a2", texto: "Armar mi presupuesto del mes", cuando: "mes", created_at: "" },
    ],
  };
}
