import { createAdminClient } from "@/lib/supabase/admin";
import { requireEquipo } from "@/lib/supabase/equipo";

export const dynamic = "force-dynamic";

/** Todas las tablas del sitio. Si se suma una tabla nueva, agregarla acá. */
const TABLAS = [
  "talleres", "eventos", "servicios", "profesionales", "posts", "interesados", "consultas", "ajustes",
  "suenos", "experiencias", "reflexiones", "foro", "frases_ratatoskr",
  "espacios", "convocatorias", "participantes", "inscripciones", "modulos", "avances", "agenda", "equipo",
];

/** Descarga un archivo con todos los datos. Solo para el equipo. */
export async function GET() {
  await requireEquipo();
  const db = createAdminClient();
  const datos: Record<string, unknown[]> = {};
  const errores: Record<string, string> = {};
  for (const tabla of TABLAS) {
    const filas: unknown[] = [];
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await db.from(tabla).select("*").range(desde, desde + 999);
      if (error) {
        errores[tabla] = error.message;
        break;
      }
      filas.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    datos[tabla] = filas;
  }
  const fecha = new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }).slice(0, 16).replace(/[ :]/g, "-");
  const cuerpo = JSON.stringify({ sitio: "Bifröst", generado: new Date().toISOString(), datos, errores }, null, 2);
  return new Response(cuerpo, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="bifrost-respaldo-${fecha}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
