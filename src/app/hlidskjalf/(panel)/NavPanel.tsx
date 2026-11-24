"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/hlidskjalf", "Resumen"],
  ["/hlidskjalf/talleres", "Talleres"],
  ["/hlidskjalf/eventos", "Eventos"],
  ["/hlidskjalf/interesados", "Interesados"],
  ["/hlidskjalf/consultas", "Consultas"],
];

export function NavPanel() {
  const path = usePathname();
  return (
    <nav className="chips" aria-label="Panel">
      {LINKS.map(([href, texto]) => {
        const activo = href === "/hlidskjalf" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} className="chip" aria-current={activo ? "page" : undefined}>
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}
