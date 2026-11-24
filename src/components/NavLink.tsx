"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  const activo = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
  return (
    <Link href={href} aria-current={activo ? "page" : undefined}>
      {children}
    </Link>
  );
}
