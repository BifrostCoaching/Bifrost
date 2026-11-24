"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireEquipo } from "@/lib/supabase/equipo";
import { slugify } from "@/lib/format";
import type { EstadoInteresado } from "@/lib/types";

// ───────── Sesión ─────────

export async function ingresar(_prev: string | null, fd: FormData): Promise<string | null> {
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return "El email o la contraseña no coinciden.";
  redirect("/hlidskjalf");
}

export async function salir() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/hlidskjalf/login");
}

// ───────── Utilidades ─────────

function txt(fd: FormData, k: string, max = 5000): string {
  return String(fd.get(k) ?? "").trim().slice(0, max);
}
function fechaONull(fd: FormData, k: string): string | null {
  const v = txt(fd, k, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}
function enteroONull(fd: FormData, k: string): number | null {
  const v = txt(fd, k, 12);
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function revalidarSitio() {
  revalidatePath("/", "layout");
}

export type EstadoPanel = { ok: boolean; mensaje: string } | null;

// ───────── Talleres ─────────

export async function guardarTaller(_prev: EstadoPanel, fd: FormData): Promise<EstadoPanel> {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const nombre = txt(fd, "nombre", 200);
  if (!nombre) return { ok: false, mensaje: "El taller necesita un nombre." };
  const tipo = txt(fd, "tipo") === "gratuito" ? "gratuito" : "pago";

  const fila = {
    nombre,
    slug: slugify(txt(fd, "slug", 80) || nombre),
    bajada: txt(fd, "bajada", 300),
    descripcion: txt(fd, "descripcion"),
    detalle: txt(fd, "detalle"),
    inicio: fechaONull(fd, "inicio"),
    fin: fechaONull(fd, "fin"),
    modalidad: txt(fd, "modalidad", 300),
    encuentros: enteroONull(fd, "encuentros"),
    tipo,
    precio_texto: txt(fd, "precio_texto", 300),
    publicado: fd.get("publicado") === "on",
    orden: Number.parseInt(txt(fd, "orden", 6) || "0", 10) || 0,
  };

  const { data, error } = id
    ? await supabase.from("talleres").update(fila).eq("id", id).select("id").single()
    : await supabase.from("talleres").insert(fila).select("id").single();
  if (error) {
    const msj = error.code === "23505" ? "Ya hay otro taller con esa dirección (slug). Cambiala." : error.message;
    return { ok: false, mensaje: `No se pudo guardar: ${msj}` };
  }
  revalidarSitio();
  if (!id) redirect(`/hlidskjalf/talleres/${data.id}?guardado=1`);
  return { ok: true, mensaje: "Guardado. Ya se ve en el sitio." };
}

export async function borrarTaller(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const { error } = await supabase.from("talleres").delete().eq("id", id);
  if (error) {
    // Si tiene interesados no se borra: se despublica para no perder el registro.
    await supabase.from("talleres").update({ publicado: false }).eq("id", id);
  }
  revalidarSitio();
  redirect("/hlidskjalf/talleres");
}

// ───────── Eventos ─────────

export async function guardarEvento(_prev: EstadoPanel, fd: FormData): Promise<EstadoPanel> {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const titulo = txt(fd, "titulo", 200);
  if (!titulo) return { ok: false, mensaje: "El evento necesita un nombre." };
  const fila = {
    titulo,
    organiza: txt(fd, "organiza", 200) || "Bifröst",
    inicio: fechaONull(fd, "inicio"),
    fin: fechaONull(fd, "fin"),
    modalidad: txt(fd, "modalidad", 300),
    tipo: txt(fd, "tipo") === "pago" ? "pago" : "gratuito",
    precio_texto: txt(fd, "precio_texto", 300),
    descripcion: txt(fd, "descripcion"),
    publicado: fd.get("publicado") === "on",
  };
  const { data, error } = id
    ? await supabase.from("eventos").update(fila).eq("id", id).select("id").single()
    : await supabase.from("eventos").insert(fila).select("id").single();
  if (error) return { ok: false, mensaje: `No se pudo guardar: ${error.message}` };
  revalidarSitio();
  if (!id) redirect(`/hlidskjalf/eventos/${data.id}?guardado=1`);
  return { ok: true, mensaje: "Guardado. Ya se ve en el calendario." };
}

export async function borrarEvento(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("eventos").delete().eq("id", txt(fd, "id", 60));
  revalidarSitio();
  redirect("/hlidskjalf/eventos");
}

// ───────── Interesados y consultas ─────────

const ESTADOS: EstadoInteresado[] = ["nuevo", "contactado", "inscripto", "descartado"];

export async function actualizarInteresado(fd: FormData) {
  const { supabase } = await requireEquipo();
  const estado = txt(fd, "estado") as EstadoInteresado;
  if (!ESTADOS.includes(estado)) return;
  await supabase.from("interesados").update({ estado, notas: txt(fd, "notas", 2000) }).eq("id", txt(fd, "id", 60));
  revalidatePath("/hlidskjalf/interesados");
}

export async function marcarConsulta(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("consultas").update({ leida: fd.get("leida") === "1" }).eq("id", txt(fd, "id", 60));
  revalidatePath("/hlidskjalf/consultas");
}

// ───────── Blog ─────────

export async function guardarPost(_prev: EstadoPanel, fd: FormData): Promise<EstadoPanel> {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const titulo = txt(fd, "titulo", 200);
  if (!titulo) return { ok: false, mensaje: "El artículo necesita un título." };
  const fila = {
    titulo,
    slug: slugify(txt(fd, "slug", 80) || titulo),
    tema: txt(fd, "tema", 60) || "Lenguaje",
    resumen: txt(fd, "resumen", 600),
    texto: txt(fd, "texto", 60000),
    fecha: fechaONull(fd, "fecha") ?? new Date().toISOString().slice(0, 10),
    publicado: fd.get("publicado") === "on",
  };
  const { data, error } = id
    ? await supabase.from("posts").update(fila).eq("id", id).select("id").single()
    : await supabase.from("posts").insert(fila).select("id").single();
  if (error) {
    const msj = error.code === "23505" ? "Ya hay otro artículo con esa dirección (slug). Cambiala." : error.message;
    return { ok: false, mensaje: `No se pudo guardar: ${msj}` };
  }
  revalidarSitio();
  if (!id) redirect(`/hlidskjalf/blog/${data.id}?guardado=1`);
  return { ok: true, mensaje: fila.publicado ? "Guardado. Ya se ve en el blog." : "Guardado como borrador." };
}

export async function borrarPost(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("posts").delete().eq("id", txt(fd, "id", 60));
  revalidarSitio();
  redirect("/hlidskjalf/blog");
}

// ───────── Comunidad ─────────

const TABLAS_COMUNIDAD = ["suenos", "experiencias", "reflexiones", "foro"];

export async function moderar(fd: FormData) {
  const { supabase } = await requireEquipo();
  const tabla = txt(fd, "tabla", 20);
  const estado = txt(fd, "estado", 20);
  if (!TABLAS_COMUNIDAD.includes(tabla) || !["publicado", "pendiente", "oculto"].includes(estado)) return;
  await supabase.from(tabla).update({ estado }).eq("id", txt(fd, "id", 60));
  revalidatePath("/comunidad");
  revalidatePath("/hlidskjalf/comunidad");
}

// ───────── Frases de Ratatoskr ─────────

export async function guardarFrase(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const texto = txt(fd, "texto", 140);
  if (!texto) return;
  const fila = { texto, orden: Number.parseInt(txt(fd, "orden", 6) || "0", 10) || 0, activa: fd.get("activa") === "on" };
  if (id) await supabase.from("frases_ratatoskr").update(fila).eq("id", id);
  else await supabase.from("frases_ratatoskr").insert(fila);
  revalidatePath("/comunidad");
  revalidatePath("/hlidskjalf/comunidad/ratatoskr");
}

export async function borrarFrase(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("frases_ratatoskr").delete().eq("id", txt(fd, "id", 60));
  revalidatePath("/comunidad");
  revalidatePath("/hlidskjalf/comunidad/ratatoskr");
}

// ───────── Contacto ─────────

export async function guardarContacto(_prev: EstadoPanel, fd: FormData): Promise<EstadoPanel> {
  const { supabase } = await requireEquipo();
  const email = txt(fd, "email", 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, mensaje: "El email no parece válido." };
  const filas = [
    { clave: "email", valor: email },
    { clave: "whatsapp", valor: txt(fd, "whatsapp", 40) },
    { clave: "instagram", valor: txt(fd, "instagram", 120) },
    { clave: "linkedin", valor: txt(fd, "linkedin", 200) },
  ].map((f) => ({ ...f, updated_at: new Date().toISOString() }));
  const { error } = await supabase.from("ajustes").upsert(filas, { onConflict: "clave" });
  if (error) return { ok: false, mensaje: `No se pudo guardar: ${error.message}` };
  revalidarSitio();
  return { ok: true, mensaje: "Guardado. Ya se ve en el sitio." };
}

// ───────── Dar por dar ─────────

const TIPOS_ESPACIO_OK = ["Refugios de animales", "Medioambiente", "Comedores", "Educación", "Salud", "Otro"];

function revalidarDar() {
  revalidatePath("/dar-por-dar");
  revalidatePath("/hlidskjalf/dar-por-dar");
}

export async function guardarEspacio(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const nombre = txt(fd, "nombre", 120);
  if (!nombre) return;
  const tipo = txt(fd, "tipo", 40);
  const estado = txt(fd, "estado", 20);
  const fila = {
    nombre,
    tipo: TIPOS_ESPACIO_OK.includes(tipo) ? tipo : "Otro",
    zona: txt(fd, "zona", 120),
    contacto: txt(fd, "contacto", 200),
    descripcion: txt(fd, "descripcion", 1500),
    estado: ["publicado", "pendiente", "oculto"].includes(estado) ? estado : "publicado",
  };
  if (id) await supabase.from("espacios").update(fila).eq("id", id);
  else await supabase.from("espacios").insert(fila);
  revalidarDar();
}

export async function borrarEspacio(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("espacios").delete().eq("id", txt(fd, "id", 60));
  revalidarDar();
}

export async function guardarConvocatoria(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const titulo = txt(fd, "titulo", 200);
  const espacio_id = txt(fd, "espacio_id", 60);
  if (!titulo || !espacio_id) return;
  const fila = {
    titulo,
    espacio_id,
    inicio: fechaONull(fd, "inicio"),
    fin: fechaONull(fd, "fin"),
    necesita: txt(fd, "necesita", 600),
    publicado: fd.get("publicado") === "on",
  };
  if (id) await supabase.from("convocatorias").update(fila).eq("id", id);
  else await supabase.from("convocatorias").insert(fila);
  revalidarDar();
}

export async function borrarConvocatoria(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("convocatorias").delete().eq("id", txt(fd, "id", 60));
  revalidarDar();
}

// ───────── Campus ─────────

export type EstadoAcceso = { ok: boolean; mensaje: string; link?: string } | null;

function revalidarCampus() {
  revalidatePath("/campus");
  revalidatePath("/hlidskjalf/campus");
}

/**
 * Crea (o renueva) el acceso de una persona al campus y devuelve un link para mandarle por WhatsApp o email.
 * El link la lleva a elegir su contraseña. No se manda ningún mail automático.
 */
export async function darAcceso(_prev: EstadoAcceso, fd: FormData): Promise<EstadoAcceso> {
  const { supabase } = await requireEquipo();
  const email = txt(fd, "email", 200).toLowerCase();
  const nombre = txt(fd, "nombre", 120);
  const tallerId = txt(fd, "taller_id", 60);
  const estado = txt(fd, "estado", 20) === "confirmada" ? "confirmada" : "pendiente";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, mensaje: "Revisá el email." };

  const admin = createAdminClient();
  const redirectTo = `${SITE_URL}/campus/bienvenida`;
  let res = await admin.auth.admin.generateLink({ type: "invite", email, options: { redirectTo } });
  if (res.error) {
    // Si ya tiene usuario, se genera un link para que elija una contraseña nueva.
    res = await admin.auth.admin.generateLink({ type: "recovery", email, options: { redirectTo } });
  }
  if (res.error || !res.data.user) return { ok: false, mensaje: `No se pudo crear el acceso: ${res.error?.message ?? "error desconocido"}` };

  const userId = res.data.user.id;
  const { data: previo } = await supabase.from("participantes").select("nombre").eq("id", userId).maybeSingle();
  const { error: e1 } = await supabase
    .from("participantes")
    .upsert({ id: userId, email, nombre: nombre || previo?.nombre || "" }, { onConflict: "id" });
  if (e1) return { ok: false, mensaje: `No se pudo guardar la persona: ${e1.message}` };
  if (tallerId) {
    const { error: e2 } = await supabase
      .from("inscripciones")
      .upsert({ participante_id: userId, taller_id: tallerId, estado }, { onConflict: "participante_id,taller_id" });
    if (e2) return { ok: false, mensaje: `Se creó el acceso, pero no la inscripción: ${e2.message}` };
  }
  revalidarCampus();
  return {
    ok: true,
    mensaje: `Listo. Mandale este link a ${nombre || email} (sirve una sola vez y vence en 24 horas):`,
    link: res.data.properties.action_link,
  };
}

export async function cambiarInscripcion(fd: FormData) {
  const { supabase } = await requireEquipo();
  const estado = txt(fd, "estado", 20);
  if (!["pendiente", "confirmada", "cancelada"].includes(estado)) return;
  await supabase.from("inscripciones").update({ estado }).eq("id", txt(fd, "id", 60));
  revalidarCampus();
}

export async function agregarInscripcion(fd: FormData) {
  const { supabase } = await requireEquipo();
  const participante_id = txt(fd, "participante_id", 60);
  const taller_id = txt(fd, "taller_id", 60);
  if (!participante_id || !taller_id) return;
  await supabase.from("inscripciones").upsert({ participante_id, taller_id, estado: "confirmada" }, { onConflict: "participante_id,taller_id" });
  revalidarCampus();
}

export async function quitarAcceso(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  await supabase.from("participantes").delete().eq("id", id);
  // También se borra su usuario, para que el link o la contraseña dejen de servir.
  await createAdminClient().auth.admin.deleteUser(id);
  revalidarCampus();
}

export async function guardarModulo(fd: FormData) {
  const { supabase } = await requireEquipo();
  const id = txt(fd, "id", 60);
  const titulo = txt(fd, "titulo", 200);
  const taller_id = txt(fd, "taller_id", 60);
  if (!titulo || !taller_id) return;
  const fila = {
    taller_id,
    titulo,
    numero: Number.parseInt(txt(fd, "numero", 4) || "1", 10) || 1,
    clases: txt(fd, "clases", 5000),
    materiales: txt(fd, "materiales", 5000),
  };
  if (id) await supabase.from("modulos").update(fila).eq("id", id);
  else await supabase.from("modulos").insert(fila);
  revalidarCampus();
}

export async function borrarModulo(fd: FormData) {
  const { supabase } = await requireEquipo();
  await supabase.from("modulos").delete().eq("id", txt(fd, "id", 60));
  revalidarCampus();
}
