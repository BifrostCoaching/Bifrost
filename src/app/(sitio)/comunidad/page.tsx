import type { Metadata } from "next";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { Comunidad, type Seccion } from "@/components/comunidad/Comunidad";
import { comunidadPublica, talleresPublicados } from "@/lib/datos";
import { createClient } from "@/lib/supabase/server";
import { textosPortada } from "@/lib/portadas";

export const metadata: Metadata = { title: "Comunidad" };

const SECCIONES: Seccion[] = ["arbol", "muro", "mimir", "foro"];
const hayBase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function esEquipo(): Promise<boolean> {
  if (!hayBase()) return false;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.rpc("es_equipo");
  return Boolean(data);
}

export default async function PaginaComunidad({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const portada = await textosPortada("comunidad");
  const { seccion } = await searchParams;
  const inicial = SECCIONES.includes(seccion as Seccion) ? (seccion as Seccion) : "arbol";
  const [datos, talleres, equipo] = await Promise.all([comunidadPublica(), talleresPublicados(), esEquipo()]);
  const nombres = talleres.map((t) => t.nombre);

  return (
    <>
      <Portada
        ceja="Comunidad"
        titulo={portada.titulo}
        bajada={portada.bajada}
      />
      <Comunidad datos={datos} equipo={equipo} talleres={nombres} inicial={inicial} />
      <section className="seccion" style={{ paddingTop: 0 }}>
        <div className="ancho">
          <div style={{ padding: 28, borderRadius: 20, background: "var(--bg)", border: "1px solid var(--line)" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "1.4rem", lineHeight: 1.25, fontWeight: 600 }}>Normas de convivencia</h3>
            <p className="apagado" style={{ margin: "0 0 14px" }}>Para que este sea un espacio cuidado para todos.</p>
            <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Respeto ante todo: se conversa sobre ideas, nunca contra personas.</li>
              <li>Escuchar antes de responder. Cada experiencia es válida para quien la vive.</li>
              <li>Hablar en primera persona, desde lo propio.</li>
              <li>Cuidar la privacidad: no compartas datos ni historias de otros sin su permiso.</li>
              <li>Sin discriminación, agresiones ni burlas de ningún tipo.</li>
              <li>Sin publicidad ni mensajes comerciales.</li>
              <li>El equipo de Bifröst revisa lo que se publica y puede no publicar o quitar lo que no respete estas normas.</li>
            </ol>
          </div>
        </div>
      </section>
      <Contacto />
    </>
  );
}
