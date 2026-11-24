import "server-only";
import { ajustes } from "./datos";

/** Textos de la portada de cada pestaña. El equipo puede cambiar título y bajada desde el panel. */
export const PORTADAS = {
  "inicio": { nombre: "Inicio", ceja: "Coaching · Espacios de aprendizaje", titulo: "Un puente entre donde estás y donde querés llegar.", bajada: "Creamos espacios de aprendizaje con mirada humana y empresarial, para que lo que aprendés se transforme en resultados concretos." },
  "que-hacemos": { nombre: "Qué hacemos", ceja: "Qué hacemos", titulo: "Espacios para aprender y llevarlo a la acción", bajada: "Creamos espacios de aprendizaje con mirada humana y empresarial. Acá te contamos cómo los pensamos, cómo trabajamos y en qué nos apoyamos." },
  "servicios": { nombre: "Servicios", ceja: "Servicios", titulo: "Heimdall", bajada: "El guardián del puente acompaña a quien lo cruza. Estos son los servicios que Bifröst brinda en forma directa, más allá de los talleres." },
  "talleres": { nombre: "Talleres", ceja: "Talleres", titulo: "La forja", bajada: "En el mito, los enanos forjaron los tesoros de los dioses. Acá se forjan talleres de varios encuentros, pensados para aprender, practicar y llevarte herramientas que podés aplicar desde el primer día." },
  "profesionales": { nombre: "Profesionales", ceja: "Profesionales", titulo: "Los Vanir", bajada: "En el mito, los Vanir vienen de su propio reino y se suman a los Æsir con lo que cada uno sabe hacer. Así llegan a Bifröst coaches, asesores de imagen, contadores y otros profesionales, cada uno con su oficio." },
  "blog": { nombre: "Blog", ceja: "Blog", titulo: "Los pensamientos de Mímir", bajada: "Mímir guardaba la sabiduría del mundo. Acá compartimos lo que pensamos en Bifröst sobre el lenguaje, las emociones, el liderazgo y el aprendizaje." },
  "calendario": { nombre: "Calendario", ceja: "Calendario", titulo: "Las Nornas", bajada: "Urd, Verdandi y Skuld: lo que fue, lo que está siendo y lo que será. Las fechas de Bifröst, la vista del mes y la proyección del año." },
  "comunidad": { nombre: "Comunidad", ceja: "Comunidad", titulo: "Yggdrasil y sus tres pozos", bajada: "Colgá tus sueños en Yggdrasil, dejá lo vivido en el pozo de Urd, compartí tus reflexiones en el pozo de Mímir y conversá en Hvergelmir." },
  "dar-por-dar": { nombre: "Dar por dar", ceja: "Dar por dar", titulo: "Gefn", bajada: "Gefn, «la que da», es uno de los nombres de Freyja. Un puente entre quienes quieren dar y quienes lo necesitan. Espacios comunitarios que trabajan por el bien común, y personas que quieren sumarse. Nosotros solo hacemos el puente." },
  "campus": { nombre: "Campus", ceja: "Campus", titulo: "Midgard", bajada: "El mundo de las personas, el recinto del medio. Tu bosque de talleres, tu agenda, los eventos y los talleres en los que estás, todo en un mismo lugar." },
} as const;

export type SeccionPortada = keyof typeof PORTADAS;

export async function textosPortada(seccion: SeccionPortada): Promise<{ titulo: string; bajada: string }> {
  const base = PORTADAS[seccion];
  const a = await ajustes([`portada.${seccion}.titulo`, `portada.${seccion}.bajada`]);
  return { titulo: a[`portada.${seccion}.titulo`] || base.titulo, bajada: a[`portada.${seccion}.bajada`] || base.bajada };
}
