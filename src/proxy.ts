import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Refresca la sesión y protege el panel Hliðskjálf y el Campus. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const ruta = request.nextUrl.pathname;
  const esCampus = ruta === "/campus" || ruta.startsWith("/campus/");
  const libre = ruta.startsWith("/hlidskjalf/login") || ruta.startsWith("/campus/ingresar") || ruta.startsWith("/campus/bienvenida");
  if (!user && !libre) {
    const destino = request.nextUrl.clone();
    destino.pathname = esCampus ? "/campus/ingresar" : "/hlidskjalf/login";
    destino.search = "";
    return NextResponse.redirect(destino);
  }
  return response;
}

export const config = { matcher: ["/hlidskjalf/:path*", "/campus", "/campus/:path*"] };
