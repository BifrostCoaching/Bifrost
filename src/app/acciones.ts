"use server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearPreferencia } from "@/lib/mercadopago";
import type { Taller } from "@/lib/types";

export type EstadoForm = { ok: boolean; mensaje: string } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(fd: FormData, campo: string, max: number): string {
  return String(fd.get(campo) ?? "").trim().slice(0, max);
}

export async function enviarConsulta(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  // Campo trampa: las personas no lo ven; los robots lo completan.
  if (texto(fd, "sitio_web", 200)) return { ok: true, mensaje: "¡Gracias! Recibimos tu mensaje." };

  const nombre = texto(fd, "nombre", 120);
  const email = texto(fd, "email", 200);
  const motivo = texto(fd, "motivo", 200);
  const mensaje = texto(fd, "mensaje", 3000);
  if (!nombre || !mensaje) return { ok: false, mensaje: "Completá tu nombre y tu mensaje." };
  if (!EMAIL.test(email)) return { ok: false, mensaje: "Revisá el email: parece que tiene un error." };

  try {
    const { error } = await createAdminClient().from("consultas").insert({ nombre, email, motivo, mensaje });
    if (error) throw error;
  } catch (e) {
    console.error("consulta:", e);
    return { ok: false, mensaje: "No pudimos enviar el mensaje. Probá de nuevo en un rato." };
  }
  return { ok: true, mensaje: `¡Gracias, ${nombre}! Recibimos tu mensaje y te respondemos por email.` };
}

export async function inscribirse(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (texto(fd, "sitio_web", 200)) return { ok: false, mensaje: "No pudimos procesar la inscripción." };

  const tallerId = texto(fd, "taller_id", 60);
  const nombre = texto(fd, "nombre", 120);
  const email = texto(fd, "email", 200);
  const telefono = texto(fd, "telefono", 40);
  if (!nombre) return { ok: false, mensaje: "Completá tu nombre." };
  if (!EMAIL.test(email)) return { ok: false, mensaje: "Revisá el email: parece que tiene un error." };

  const db = createAdminClient();
  const { data: tallerData } = await db.from("talleres").select("*").eq("id", tallerId).eq("publicado", true).maybeSingle();
  const taller = tallerData as Taller | null;
  if (!taller) return { ok: false, mensaje: "Ese taller ya no está disponible." };

  if (taller.cupo) {
    const { count } = await db
      .from("inscripciones")
      .select("id", { count: "exact", head: true })
      .eq("taller_id", taller.id)
      .eq("estado", "confirmada");
    if ((count ?? 0) >= taller.cupo) return { ok: false, mensaje: "El taller ya completó su cupo. Escribinos y te avisamos si se libera un lugar." };
  }

  const gratuito = taller.tipo === "gratuito";
  const monto = gratuito ? null : taller.monto_online;
  if (!gratuito && !monto) {
    return { ok: false, mensaje: "La inscripción online de este taller todavía no está habilitada. Escribinos por el formulario de contacto." };
  }

  const { data: insc, error } = await db
    .from("inscripciones")
    .insert({
      taller_id: taller.id,
      nombre,
      email,
      telefono,
      monto,
      estado: gratuito ? "confirmada" : "pendiente_pago",
    })
    .select("id")
    .single();
  if (error || !insc) {
    console.error("inscripción:", error);
    return { ok: false, mensaje: "No pudimos registrar la inscripción. Probá de nuevo en un rato." };
  }

  if (gratuito) redirect(`/inscripcion/resultado?tipo=gratuito`);

  let destino: string;
  try {
    const titulo = taller.concepto_online ? `${taller.nombre} · ${taller.concepto_online}` : taller.nombre;
    const pref = await crearPreferencia({
      inscripcionId: insc.id,
      tallerId: taller.id,
      titulo,
      monto: Number(monto),
      nombre,
      email,
    });
    await db.from("inscripciones").update({ mp_preference_id: pref.id }).eq("id", insc.id);
    destino = pref.init_point;
  } catch (e) {
    console.error("Mercado Pago:", e);
    await db.from("inscripciones").update({ estado: "cancelada", notas: "No se pudo crear el pago en Mercado Pago." }).eq("id", insc.id);
    return { ok: false, mensaje: "No pudimos conectar con Mercado Pago. Probá de nuevo en un rato." };
  }
  redirect(destino);
}
