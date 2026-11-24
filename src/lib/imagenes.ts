import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseUrl } from "@/lib/supabase/env";

/** Carpeta pública de Supabase Storage donde el equipo sube fotos (ver supabase/06). */
export const BUCKET = "imagenes";
export const CARPETAS = ["talleres", "eventos", "servicios", "profesionales"] as const;
export type Carpeta = (typeof CARPETAS)[number];
export const MAX_BYTES = 4 * 1024 * 1024;
const TIPOS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const prefijo = () => `${supabaseUrl()}/storage/v1/object/public/${BUCKET}/`;

/** Reconoce el formato por los primeros bytes, sin confiar en lo que dice el navegador. */
function formatoReal(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return "image/webp";
  return null;
}

/** Sube una foto y devuelve su link público. Llamar solo después de requireEquipo(). */
export async function subirArchivo(archivo: File, carpeta: Carpeta): Promise<{ url?: string; error?: string }> {
  if (archivo.size === 0) return { error: "El archivo está vacío." };
  if (archivo.size > MAX_BYTES) return { error: "La foto pesa más de 4 MB." };
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  const tipo = formatoReal(bytes);
  if (!tipo) return { error: "Solo se aceptan fotos JPG, PNG o WEBP." };
  const ruta = `${carpeta}/${crypto.randomUUID()}.${TIPOS[tipo]}`;
  const { error } = await createAdminClient().storage.from(BUCKET).upload(ruta, bytes, { contentType: tipo, upsert: false });
  if (error) return { error: `No se pudo subir: ${error.message}` };
  return { url: prefijo() + ruta };
}

/** Lee la lista de fotos que manda el formulario y deja solo links de nuestra carpeta. */
export function leerImagenes(valor: FormDataEntryValue | null, max = 12): string[] {
  let lista: unknown;
  try {
    lista = JSON.parse(String(valor ?? "[]"));
  } catch {
    return [];
  }
  if (!Array.isArray(lista)) return [];
  const p = prefijo();
  const ok = /^(talleres|eventos|servicios|profesionales)\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
  return [...new Set(lista.filter((u): u is string => typeof u === "string" && u.startsWith(p) && ok.test(u.slice(p.length))))].slice(0, max);
}

/** Borra de la carpeta las fotos que estaban antes y ya no están. */
export async function borrarQuitadas(antes: string[] | null | undefined, despues: string[]) {
  const p = prefijo();
  const rutas = (antes ?? []).filter((u) => u?.startsWith(p) && !despues.includes(u)).map((u) => u.slice(p.length));
  if (rutas.length) await createAdminClient().storage.from(BUCKET).remove(rutas);
}
