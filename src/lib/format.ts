const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-12-15" → "15 dic 2026". Las fechas se guardan sin hora, así que no hay corrimientos de zona. */
export function fecha(v: string | null | undefined): string {
  if (!v) return "[PENDIENTE]";
  const [a, m, d] = v.split("-").map(Number);
  if (!a || !m || !d) return v;
  return `${d} ${MESES[m - 1]} ${a}`;
}

export function rango(inicio: string | null, fin: string | null): string {
  if (!inicio) return "[PENDIENTE]";
  if (!fin || fin === inicio) return fecha(inicio);
  const [a1, m1, d1] = inicio.split("-").map(Number);
  const [a2, m2, d2] = fin.split("-").map(Number);
  if (a1 === a2 && m1 === m2) return `Del ${d1} al ${d2} de ${MESES_LARGOS[m1 - 1]} de ${a1}`;
  return `Del ${fecha(inicio)} al ${fecha(fin)}`;
}

export function pesos(n: number | null | undefined): string {
  if (n == null) return "[PENDIENTE]";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

/** Fecha de hoy en Buenos Aires, como "AAAA-MM-DD". */
export function hoyBA(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());
}

export function sumarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Imágenes de cada taller (las de la maqueta). Si un taller nuevo no tiene, usa las de la portada. */
export function imagenesTaller(slug: string): string[] {
  if (slug.startsWith("vestirse")) return ["/img/vestirse-1.jpg", "/img/vestirse-2.jpg", "/img/vestirse-3.jpg"];
  if (slug.includes("presupuesto")) return ["/img/presupuesto-1.jpg", "/img/presupuesto-2.jpg", "/img/presupuesto-3.jpg"];
  return ["/img/portada-1.jpg", "/img/portada-2.jpg", "/img/portada-3.jpg"];
}

/** Convierte un dato de contacto suelto (email, WhatsApp, @usuario o link) en un link. */
export function linkContacto(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return `mailto:${t}`;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^@[\w.]+$/.test(t)) return `https://instagram.com/${t.slice(1)}`;
  const digitos = t.replace(/\D/g, "");
  if (digitos.length >= 8 && /^[+\d\s()-]+$/.test(t)) return `https://wa.me/${digitos}`;
  return null;
}
