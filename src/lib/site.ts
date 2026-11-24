export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const CALENDAR_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ||
  "2621bf8a432143553116176bfdd69319ff6157c0c356ed51cd210ed11b74e6b2@group.calendar.google.com";

export const ZONA = "America/Argentina/Buenos_Aires";

// Datos de contacto: se cargan desde el panel (Hliðskjálf > Contacto).
export type DatosContacto = { email: string; whatsapp: string; instagram: string; linkedin: string };
export const CLAVES_CONTACTO = ["email", "whatsapp", "instagram", "linkedin"] as const;

/** Temas del blog, en el orden en que aparecen los filtros. */
export const TEMAS_BLOG = ["Lenguaje", "Emociones", "Liderazgo", "Sistemas", "Imagen", "Presupuesto"];
