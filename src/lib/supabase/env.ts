function requerida(nombre: string, valor: string | undefined): string {
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}. Mirá .env.example.`);
  return valor;
}

export const supabaseUrl = () => requerida("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = () =>
  requerida("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
