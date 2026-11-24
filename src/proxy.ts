import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Refresca la sesión del equipo y protege el panel Hliðskjálf. */
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
  const esLogin = request.nextUrl.pathname.startsWith("/hlidskjalf/login");
  if (!user && !esLogin) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/hlidskjalf/login";
    destino.search = "";
    return NextResponse.redirect(destino);
  }
  return response;
}

export const config = { matcher: ["/hlidskjalf/:path*"] };
