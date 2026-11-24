import "server-only";
import { createClient } from "@supabase/supabase-js";
import { TEMAS_BLOG, type DatosContacto } from "./site";
import type { Convocatoria, Espacio, Evento, Experiencia, Post, Profesional, Reflexion, Servicio, Sueno, Taller, TemaForo } from "./types";

/** Cliente de solo lectura para las páginas públicas (sin sesión, respeta RLS). */
function publico() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Solo para probar el diseño en una compu sin base de datos: BIFROST_DEMO=1. */
const DEMO: Taller[] = [
  {
    id: "demo-1", slug: "vestirse-tambien-es-comunicar", nombre: "Vestirse también es comunicar",
    bajada: "Taller de imagen y coaching · en alianza con Benaroma",
    descripcion: "La forma en que nos vestimos habla antes que nosotros. Juntamos imagen y coaching para descubrir por qué tu ropa te abre o te cierra puertas, y para que tu imagen muestre quién querés ser, sin reglas rígidas.",
    detalle: "Mar 15/12 · Apreciatividad\nMié 16/12 · Los bordes\nJue 17/12 · Seguridad\nSáb 19/12 · Creatividad y autenticidad (presencial)\n\nLo dictan Silvia (Benaroma) y Marcos.",
    inicio: "2026-12-15", fin: "2026-12-19", modalidad: "3 encuentros virtuales por Zoom, de 19 a 21:30 h, y 1 presencial con brunch",
    encuentros: 4, tipo: "pago", precio_texto: "$115.000 transferencia o efectivo · $127.000 con tarjeta, hasta 3 cuotas sin interés", publicado: true, orden: 1,
  },
  {
    id: "demo-2", slug: "el-presupuesto-como-conversacion", nombre: "El presupuesto como conversación", bajada: "La importancia del presupuesto",
    descripcion: "Un presupuesto no es solo una planilla: refleja prioridades, decisiones y compromisos. Aprendemos a armarlo, sostenerlo y usarlo para decidir con más claridad, tanto en lo personal como en lo empresarial.",
    detalle: "", inicio: null, fin: null, modalidad: "", encuentros: null, tipo: "pago", precio_texto: "", publicado: true, orden: 2,
  },
];

export async function talleresPublicados(): Promise<Taller[]> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? DEMO : [];
  const { data, error } = await db
    .from("talleres")
    .select("*")
    .eq("publicado", true)
    .order("orden")
    .order("inicio", { nullsFirst: false });
  if (error) {
    console.error("talleres:", error.message);
    return [];
  }
  return (data ?? []) as Taller[];
}

export async function tallerPorSlug(slug: string): Promise<Taller | null> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? (DEMO.find((t) => t.slug === slug) ?? null) : null;
  const { data } = await db.from("talleres").select("*").eq("slug", slug).eq("publicado", true).maybeSingle();
  return (data as Taller) ?? null;
}

export async function eventosPublicados(): Promise<Evento[]> {
  const db = publico();
  if (!db) return [];
  const { data, error } = await db.from("eventos").select("*").eq("publicado", true).order("inicio");
  if (error) {
    console.error("eventos:", error.message);
    return [];
  }
  return (data ?? []) as Evento[];
}

// ───────── Blog ─────────

const DEMO_POSTS: Post[] = [
  ["El lenguaje no describe: genera", "Lenguaje"],
  ["Lo que la emoción hace posible", "Emociones"],
  ["Liderar es abrir posibilidades", "Liderazgo"],
  ["Todo comunica, incluso el silencio", "Sistemas"],
  ["Lo que tu ropa dice antes que vos", "Imagen"],
  ["Un presupuesto también es una conversación", "Presupuesto"],
].map(([titulo, tema], i) => ({
  id: `demo-p${i}`, slug: `demo-${i}`, titulo, tema, resumen: "Artículo de ejemplo. Acá va el comienzo del texto, con dos o tres líneas que inviten a seguir leyendo.",
  texto: "Texto de ejemplo.", publicado: true, fecha: "2026-11-24",
}));

export async function postsPublicados(): Promise<Post[]> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? DEMO_POSTS : [];
  const { data, error } = await db.from("posts").select("*").eq("publicado", true).order("fecha", { ascending: false });
  if (error) {
    console.error("posts:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

export async function postPorSlug(slug: string): Promise<Post | null> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? (DEMO_POSTS.find((p) => p.slug === slug) ?? null) : null;
  const { data } = await db.from("posts").select("*").eq("slug", slug).eq("publicado", true).maybeSingle();
  return (data as Post) ?? null;
}

// ───────── Comunidad ─────────
export type Comunidad = { suenos: Sueno[]; experiencias: Experiencia[]; reflexiones: Reflexion[]; foro: TemaForo[]; frases: string[] };

const DEMO_COMUNIDAD: Comunidad = {
  suenos: ["[el sueño de alguien de la comunidad]", "[otro sueño]", "[otro sueño]", "[otro sueño]"].map((texto, i) => ({ id: `s${i}`, texto, estado: "publicado", created_at: "" })),
  experiencias: [
    ["Lo que me llevé", "Vestirse también es comunicar", "[PENDIENTE] Lo que esta persona escribió en su nota."],
    ["Lo que cambió después", "El presupuesto como conversación", "[PENDIENTE] Lo que esta persona escribió en su nota."],
    ["Una palabra para el taller", "Vestirse también es comunicar", "[PENDIENTE] Una nota más larga: lo que vivió en el taller, cómo se sintió y qué resultado concreto logró después de los encuentros."],
    ["Mi resultado", "Vestirse también es comunicar", "[PENDIENTE] Lo que esta persona escribió en su nota."],
  ].map(([tipo, taller, texto], i) => ({ id: `e${i}`, nombre: "[Nombre]", taller, tipo, texto, estado: "publicado", created_at: "" })),
  reflexiones: [
    ["[PENDIENTE] Reflexión de ejemplo", "[PENDIENTE] Acá va la reflexión que compartió una persona de la comunidad."],
    ["[PENDIENTE] Otra reflexión de ejemplo", "[PENDIENTE] Lo que esta persona pensó después de un taller o una conversación."],
    ["[PENDIENTE] Una tercera reflexión", "[PENDIENTE] Una idea, una pregunta o algo que se llevó."],
  ].map(([titulo, texto], i) => ({ id: `r${i}`, nombre: "[Nombre]", titulo, texto, estado: "publicado", created_at: "" })),
  foro: [
    ["Imagen", "¿Qué te pasa cuando te mirás al espejo?"],
    ["Presupuesto", "¿Cómo hablan de plata en tu casa?"],
    ["Liderazgo", "Liderar sin tener un cargo"],
    ["Emociones", "Las emociones que nos frenan antes de empezar"],
    ["General", "Presentate: ¿desde dónde llegás a Bifröst?"],
  ].map(([tema, titulo], i) => ({ id: `f${i}`, tema, nombre: "[Nombre]", titulo, texto: "", estado: "publicado", created_at: "" })),
  frases: [],
};

export async function comunidadPublica(): Promise<Comunidad> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? DEMO_COMUNIDAD : { suenos: [], experiencias: [], reflexiones: [], foro: [], frases: [] };
  const [s, e, r, f, fr] = await Promise.all([
    db.from("suenos").select("id, texto, estado, created_at").eq("estado", "publicado").order("created_at").limit(66),
    db.from("experiencias").select("id, nombre, taller, tipo, texto, estado, created_at").eq("estado", "publicado").order("created_at", { ascending: false }).limit(60),
    db.from("reflexiones").select("id, nombre, titulo, texto, estado, created_at").eq("estado", "publicado").order("created_at").limit(500),
    db.from("foro").select("id, tema, nombre, titulo, texto, estado, created_at").eq("estado", "publicado").order("created_at", { ascending: false }).limit(60),
    db.from("frases_ratatoskr").select("texto").eq("activa", true).order("orden").order("created_at"),
  ]);
  for (const x of [s, e, r, f]) if (x.error) console.error("comunidad:", x.error.message);
  return {
    suenos: (s.data ?? []) as Sueno[],
    experiencias: (e.data ?? []) as Experiencia[],
    reflexiones: (r.data ?? []) as Reflexion[],
    foro: (f.data ?? []) as TemaForo[],
    // Si la tabla de frases todavía no existe, Ratatoskr usa las frases por defecto.
    frases: ((fr.data ?? []) as { texto: string }[]).map((x) => x.texto).filter(Boolean),
  };
}

// ───────── Servicios ─────────
const DEMO_SERVICIOS: Servicio[] = [1, 2].map((n) => ({
  id: `serv${n}`, nombre: `[PENDIENTE] Servicio ${n}`, bajada: "[PENDIENTE] Una línea que lo resuma",
  descripcion: "Servicio de ejemplo. Acá va qué es, cómo se trabaja y qué se llevan las personas.",
  para_quien: "[PENDIENTE]", modalidad: "[PENDIENTE]", precio_texto: "", imagenes: [], publicado: true, orden: n,
}));

export async function serviciosPublicados(): Promise<Servicio[]> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? DEMO_SERVICIOS : [];
  const { data, error } = await db.from("servicios").select("*").eq("publicado", true).order("orden").order("created_at");
  if (error) {
    console.error("servicios:", error.message);
    return [];
  }
  return (data ?? []) as Servicio[];
}

// ───────── Profesionales ─────────
export async function profesionalesPublicados(): Promise<Profesional[]> {
  const db = publico();
  if (!db) {
    if (process.env.BIFROST_DEMO !== "1") return [];
    return [1, 2, 3].map((n) => ({ id: `prof${n}`, nombre: `[PENDIENTE] Profesional ${n}`, oficio: "[PENDIENTE] Oficio", descripcion: "Texto de ejemplo: qué hace y cómo trabaja con Bifröst.", contacto: "", imagen: "", publicado: true, orden: n }));
  }
  const { data, error } = await db.from("profesionales").select("*").eq("publicado", true).order("orden").order("nombre");
  if (error) {
    console.error("profesionales:", error.message);
    return [];
  }
  return (data ?? []) as Profesional[];
}

// ───────── Ajustes editables ─────────
/** Lee varios ajustes de una vez. Lo que no está cargado vuelve vacío. */
export async function ajustes(claves: string[]): Promise<Record<string, string>> {
  const res: Record<string, string> = {};
  const db = publico();
  if (!db) return res;
  const { data, error } = await db.from("ajustes").select("clave, valor").in("clave", claves);
  if (error) return res;
  for (const { clave, valor } of (data ?? []) as { clave: string; valor: string }[]) res[clave] = valor ?? "";
  return res;
}

/** Temas del blog: los que cargó el equipo, uno por línea; si no hay, los de siempre. */
export async function temasBlog(): Promise<string[]> {
  const v = (await ajustes(["temas_blog"])).temas_blog ?? "";
  const lista = [...new Set(v.split("\n").map((t) => t.trim()).filter(Boolean))];
  return lista.length ? lista : TEMAS_BLOG;
}

// ───────── Contacto ─────────
export async function datosContacto(): Promise<DatosContacto> {
  const vacio: DatosContacto = { email: "", whatsapp: "", instagram: "", linkedin: "" };
  const db = publico();
  if (!db) return vacio;
  const { data, error } = await db.from("ajustes").select("clave, valor").in("clave", ["email", "whatsapp", "instagram", "linkedin"]);
  if (error) return vacio; // si la tabla todavía no existe, se muestra [PENDIENTE]
  for (const { clave, valor } of (data ?? []) as { clave: keyof DatosContacto; valor: string }[]) vacio[clave] = valor ?? "";
  return vacio;
}

// ───────── Dar por dar ─────────
export type DarPorDar = { espacios: Espacio[]; convocatorias: (Convocatoria & { espacio: Espacio | null })[] };

const DEMO_DPD: DarPorDar = {
  espacios: [
    ["Refugios de animales", "[Nombre del espacio]"], ["Medioambiente", "[Nombre del espacio]"], ["Comedores", "[Nombre del espacio]"],
    ["Educación", "[Nombre del espacio]"], ["Salud", "[Nombre del espacio]"],
  ].map(([tipo, nombre], i) => ({ id: `esp${i}`, nombre, tipo, zona: "[Zona]", contacto: "", descripcion: "", estado: "publicado", created_at: "" })),
  convocatorias: [],
};
DEMO_DPD.convocatorias = [
  ["[PENDIENTE] Jornada de adopción", "[PENDIENTE] Voluntarios, alimento, mantas…", 0],
  ["[PENDIENTE] Plantación o limpieza", "[PENDIENTE] Manos, herramientas, plantines…", 1],
  ["[PENDIENTE] Colecta de alimentos", "[PENDIENTE] Alimentos no perecederos, ayuda en la cocina…", 2],
].map(([titulo, necesita, k], i) => ({
  id: `conv${i}`, espacio_id: `esp${k}`, titulo: String(titulo), inicio: null, fin: null, necesita: String(necesita), publicado: true,
  espacio: DEMO_DPD.espacios[Number(k)],
}));

export async function darPorDarPublico(): Promise<DarPorDar> {
  const db = publico();
  if (!db) return process.env.BIFROST_DEMO === "1" ? DEMO_DPD : { espacios: [], convocatorias: [] };
  const [e, c] = await Promise.all([
    db.from("espacios").select("id, nombre, tipo, zona, contacto, descripcion, estado, created_at").eq("estado", "publicado").order("nombre"),
    db.from("convocatorias").select("*").eq("publicado", true).order("inicio", { ascending: true, nullsFirst: false }),
  ]);
  if (e.error || c.error) {
    console.error("dar por dar:", e.error?.message ?? c.error?.message);
    return { espacios: [], convocatorias: [] };
  }
  const espacios = (e.data ?? []) as Espacio[];
  const porId = new Map(espacios.map((x) => [x.id, x]));
  const hoy = new Date().toISOString().slice(0, 10);
  const convocatorias = ((c.data ?? []) as Convocatoria[])
    .filter((x) => porId.has(x.espacio_id) && (!(x.fin ?? x.inicio) || (x.fin ?? x.inicio)! >= hoy))
    .map((x) => ({ ...x, espacio: porId.get(x.espacio_id) ?? null }));
  return { espacios, convocatorias };
}
