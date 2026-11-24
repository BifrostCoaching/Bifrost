import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";

/** Devuelve el cliente si quien navega es del equipo; si no, lo manda al login. */
export async function requireEquipo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/hlidskjalf/login");
  const { data: esEquipo } = await supabase.rpc("es_equipo");
  if (!esEquipo) redirect("/hlidskjalf/login?error=sin-permiso");
  return { supabase, user };
}
