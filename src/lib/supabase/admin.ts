import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Cliente con la clave de servicio. Saltea las reglas de seguridad, así que se usa
 * únicamente en el servidor y solo para guardar interesados y consultas.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
