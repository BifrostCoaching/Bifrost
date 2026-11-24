"use server";
import { createAdminClient } from "@/lib/supabase/admin";

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

export async function registrarInteres(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (texto(fd, "sitio_web", 200)) return { ok: true, mensaje: "¡Gracias! Recibimos tus datos." };

  const tallerId = texto(fd, "taller_id", 60);
  const nombre = texto(fd, "nombre", 120);
  const email = texto(fd, "email", 200);
  const telefono = texto(fd, "telefono", 40);
  const comentario = texto(fd, "comentario", 2000);
  if (!nombre) return { ok: false, mensaje: "Completá tu nombre." };
  if (!EMAIL.test(email)) return { ok: false, mensaje: "Revisá el email: parece que tiene un error." };

  try {
    const db = createAdminClient();
    const { data: taller } = await db.from("talleres").select("id").eq("id", tallerId).eq("publicado", true).maybeSingle();
    if (!taller) return { ok: false, mensaje: "Ese taller ya no está disponible." };
    const { error } = await db.from("interesados").insert({ taller_id: taller.id, nombre, email, telefono, comentario });
    if (error) throw error;
  } catch (e) {
    console.error("interesado:", e);
    return { ok: false, mensaje: "No pudimos guardar tus datos. Probá de nuevo en un rato." };
  }
  return { ok: true, mensaje: `¡Gracias, ${nombre}! Ya tenemos tus datos. Alguien del equipo de Bifröst te va a contactar para contarte todo y reservar tu lugar.` };
}

const TIPOS_OK = ["Refugios de animales", "Medioambiente", "Comedores", "Educación", "Salud", "Otro"];

export async function sumarEspacio(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  if (texto(fd, "sitio_web", 200)) return { ok: true, mensaje: "¡Gracias! Recibimos los datos del espacio." };
  const nombre = texto(fd, "nombre", 120);
  const tipo = texto(fd, "tipo", 40);
  const zona = texto(fd, "zona", 120);
  const contacto = texto(fd, "contacto", 200);
  const descripcion = texto(fd, "descripcion", 1500);
  if (!nombre || !contacto) return { ok: false, mensaje: "Completá el nombre del espacio y un contacto." };
  try {
    const { error } = await createAdminClient()
      .from("espacios")
      .insert({ nombre, tipo: TIPOS_OK.includes(tipo) ? tipo : "Otro", zona, contacto, descripcion, estado: "pendiente" });
    if (error) throw error;
  } catch (e) {
    console.error("espacio:", e);
    return { ok: false, mensaje: "No pudimos guardar los datos. Probá de nuevo en un rato." };
  }
  return { ok: true, mensaje: `¡Gracias! Recibimos los datos de ${nombre}. El equipo de Bifröst lo revisa y lo publica en la lista.` };
}
