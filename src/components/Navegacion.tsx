"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/que-hacemos", texto: "Qué hacemos" },
  { href: "/talleres", texto: "Talleres" },
  { href: "/blog", texto: "Blog" },
  { href: "/calendario", texto: "Calendario" },
  { href: "/comunidad", texto: "Comunidad" },
  { href: "/campus", texto: "Campus" },
  { href: "/dar-por-dar", texto: "Dar por dar" },
];

export function Navegacion() {
  const path = usePathname();
  return (
    <>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="nav-link"
          aria-current={path === l.href || path.startsWith(`${l.href}/`) ? "page" : undefined}
        >
          {l.texto}
        </Link>
      ))}
    </>
  );
}
