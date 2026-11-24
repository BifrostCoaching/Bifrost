import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cliente con la sesión de quien navega. Respeta las reglas de seguridad (RLS). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies; el proxy refresca la sesión.
        }
      },
    },
  });
}
