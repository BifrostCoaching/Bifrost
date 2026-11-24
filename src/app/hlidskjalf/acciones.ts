"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
