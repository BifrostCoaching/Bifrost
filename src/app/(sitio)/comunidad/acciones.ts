"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type EstadoCom = { ok: boolean; mensaje: string; n?: number } | null;

const TABLAS = ["suenos", "experiencias", "reflexiones", "foro"] as const;
type Tabla = (typeof TABLAS)[number];
const COOKIE = "bifrost-yo";

function txt(fd: FormData, k: string, max: number) {
  return String(fd.get(k) ?? "").trim().slice(0, max);
}

/** Código anónimo de este navegador, para que cada persona pueda borrar lo que dejó. */
async function yo(): Promise<string> {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) {
    id = randomUUID();
    jar.set(COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 * 2, path: "/" });
  }
  return id;
}

/** Freno simple contra abusos: como mucho 10 publicaciones por navegador cada 10 minutos. */
async function demasiadas(autor: string): Promise<boolean> {
  const db = createAdminClient();
  const desde = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  let total = 0;
  for (const t of TABLAS) {
    const { count } = await db.from(t).select("id", { count: "exact", head: true }).eq("autor", autor).gte("created_at", desde);
    total += count ?? 0;
  }
  return total >= 10;
}

async function guardar(tabla: Tabla, fila: Record<string, string>, ok: string): Promise<EstadoCom> {
  try {
    const autor = await yo();
    if (await demasiadas(autor)) return { ok: false, mensaje: "Ya dejaste varias cosas en poco tiempo. Probá de nuevo en un rato." };
    const { error } = await createAdminClient().from(tabla).insert({ ...fila, autor });
    if (error) throw error;
  } catch (e) {
    console.error("comunidad:", e);
    return { ok: false, mensaje: "No pudimos guardarlo. Probá de nuevo en un rato." };
  }
  revalidatePath("/comunidad");
  return { ok: true, mensaje: ok, n: Date.now() };
}

export async function colgarSueno(_p: EstadoCom, fd: FormData): Promise<EstadoCom> {
  if (txt(fd, "sitio_web", 100)) return { ok: true, mensaje: "" };
  const texto = txt(fd, "texto", 60);
  if (!texto) return { ok: false, mensaje: "Escribí tu sueño antes de colgarlo." };
  return guardar("suenos", { texto }, "Tu sueño ya cuelga de Yggdrasil.");
}

export async function dejarExperiencia(_p: EstadoCom, fd: FormData): Promise<EstadoCom> {
  if (txt(fd, "sitio_web", 100)) return { ok: true, mensaje: "" };
  const texto = txt(fd, "texto", 220);
  if (!texto) return { ok: false, mensaje: "Contanos tu experiencia." };
  return guardar("experiencias", { nombre: txt(fd, "nombre", 80) || "Anónimo", taller: txt(fd, "taller", 120), tipo: txt(fd, "tipo", 60) || "Lo que me llevé", texto }, "Tu experiencia ya flota en el pozo de Urd.");
}

export async function enviarReflexion(_p: EstadoCom, fd: FormData): Promise<EstadoCom> {
  if (txt(fd, "sitio_web", 100)) return { ok: true, mensaje: "" };
  const texto = txt(fd, "texto", 3000);
  if (!texto) return { ok: false, mensaje: "Escribí tu reflexión." };
  return guardar("reflexiones", { nombre: txt(fd, "nombre", 80) || "Anónimo", titulo: txt(fd, "titulo", 120), texto }, "Gracias. Tu reflexión queda para revisión del equipo y después se publica acá.");
}

export async function abrirTema(_p: EstadoCom, fd: FormData): Promise<EstadoCom> {
  if (txt(fd, "sitio_web", 100)) return { ok: true, mensaje: "" };
  const titulo = txt(fd, "titulo", 70);
  if (!titulo) return { ok: false, mensaje: "El tema necesita un título." };
  return guardar("foro", { tema: txt(fd, "tema", 40) || "General", nombre: txt(fd, "nombre", 80) || "Anónimo", titulo, texto: txt(fd, "texto", 2000) }, "Tu tema ya está en Hvergelmir.");
}

/** Borra algo: quien lo dejó (mismo navegador) o el equipo de Bifröst. */
export async function borrar(fd: FormData) {
  const tabla = txt(fd, "tabla", 20) as Tabla;
  const id = txt(fd, "id", 60);
  if (!TABLAS.includes(tabla) || !id) return;
  const supabase = await createClient();
  const { data: esEquipo } = await supabase.rpc("es_equipo");
  const db = createAdminClient();
  if (esEquipo) {
    await db.from(tabla).update({ estado: "oculto" }).eq("id", id);
  } else {
    const autor = (await cookies()).get(COOKIE)?.value;
    if (!autor) return;
    await db.from(tabla).delete().eq("id", id).eq("autor", autor);
  }
  revalidatePath("/comunidad");
}
