import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Evento, Taller } from "./types";

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
