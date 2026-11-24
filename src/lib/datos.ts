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

export async function talleresPublicados(): Promise<Taller[]> {
  const db = publico();
  if (!db) return [];
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
  if (!db) return null;
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
