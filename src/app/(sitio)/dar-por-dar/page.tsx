import type { Metadata } from "next";
import Link from "next/link";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { FormEspacio } from "@/components/dar/FormEspacio";
import { IconoEspacio, TIPOS_ESPACIO } from "@/components/dar/TiposEspacio";
import { darPorDarPublico, talleresPublicados } from "@/lib/datos";
import { fecha, linkContacto } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "Dar por dar" };

const VALORES = [
  ["Nadie aprende solo", "Aprendemos y crecemos en relación con otros. Lo comunitario es donde eso se vuelve concreto.", "#8C2433", "#FFFFFF"],
  ["Lo común nos sostiene", "Un refugio, un comedor o una huerta cuidan algo que es de todos. Sumarse también es cuidarlo.", "#1E6B5A", "#FFFFFF"],
  ["Dar sin esperar a cambio", "Acá no hay intercambio ni ganancia: se da porque hace falta y porque se puede.", "#C9974A", "#14213D"],
  ["Somos solo el puente", "Bifröst no intermedia. Cada contacto va directo al espacio, y cada espacio decide cómo recibir ayuda.", "#14213D", "#F3F1EC"],
];

const fechaCorta = (v: string | null) => (v ? fecha(v) : "[PENDIENTE]");

export default async function DarPorDar({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = await searchParams;
  const elegido = tipo && (TIPOS_ESPACIO as readonly string[]).includes(tipo) ? tipo : "Todos";
  const [{ espacios, convocatorias }, talleres] = await Promise.all([darPorDarPublico(), talleresPublicados()]);
  const visibles = elegido === "Todos" ? espacios : espacios.filter((e) => e.tipo === elegido);
  const tiposConEspacios = TIPOS_ESPACIO.filter((t) => espacios.some((e) => e.tipo === t));

  return (
    <>
      <Portada
        ceja="Dar por dar"
        titulo="Gefn"
        bajada="Gefn, «la que da», es uno de los nombres de Freyja. Un puente entre quienes quieren dar y quienes lo necesitan. Espacios comunitarios que trabajan por el bien común, y personas que quieren sumarse. Nosotros solo hacemos el puente."
      />

      <section id="vision" className="seccion sup">
        <div className="ancho">
          <p className="ceja">El bien común</p>
          <h2 className="h2">Por qué Dar por dar</h2>
          <p className="apagado" style={{ margin: "0 0 40px", maxWidth: 720 }}>
            Bifröst nació para ser un puente entre dos mundos. Este espacio lleva esa idea más allá de los talleres: conectar a quienes
            quieren dar con los lugares que sostienen a su comunidad.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {VALORES.map(([t, d, bg, tx]) => (
              <div key={t} style={{ flex: "1 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10, padding: 28, borderRadius: 18, background: bg, color: tx }}>
                <p className="h" style={{ margin: 0, fontSize: "1.45rem", lineHeight: 1.25, fontWeight: 700 }}>{t}</p>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="eventos" className="seccion">
        <div className="ancho">
          <p className="ceja">Eventos</p>
          <h2 className="h2">Convocatorias de los espacios</h2>
          <p className="apagado" style={{ margin: "0 0 40px", maxWidth: 720 }}>
            Jornadas, colectas y actividades que publica cada espacio. Al contactar, le escribís directamente a quienes lo organizan.
          </p>
          {convocatorias.length === 0 ? (
            <p className="vacio">Pronto vas a ver acá las convocatorias de los espacios.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {convocatorias.map((c) => {
                const link = c.espacio ? linkContacto(c.espacio.contacto) : null;
                return (
                  <article key={c.id} style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14, padding: 26, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <IconoEspacio tipo={c.espacio?.tipo ?? "Otro"} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--muted)" }}>{c.espacio?.tipo}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: "1.4rem", lineHeight: 1.25, fontWeight: 600 }}>{c.titulo}</h3>
                    <p className="apagado" style={{ margin: 0 }}>
                      {c.espacio?.nombre}
                      {c.espacio?.zona ? ` · ${c.espacio.zona}` : ""}
                    </p>
                    <div style={{ display: "flex", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--line)" }}>
                      <div style={{ flex: "1 1 0", padding: "12px 16px" }}>
                        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Inicio</p>
                        <p style={{ margin: 0, fontWeight: 700 }}>{fechaCorta(c.inicio)}</p>
                      </div>
                      <div style={{ flex: "1 1 0", padding: "12px 16px", textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Fin</p>
                        <p style={{ margin: 0, fontWeight: 700 }}>{fechaCorta(c.fin ?? c.inicio)}</p>
                      </div>
                    </div>
                    {c.necesita && (
                      <p style={{ margin: 0 }}>
                        <strong>Qué se necesita:</strong> <span className="apagado">{c.necesita}</span>
                      </p>
                    )}
                    {link ? (
                      <a href={link} className="boton chico" target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                        Contactar al espacio
                      </a>
                    ) : (
                      c.espacio?.contacto && <p style={{ margin: "auto 0 0", fontWeight: 600 }}>Contacto: {c.espacio.contacto}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          <p style={{ margin: "32px 0 0" }}>
            <Link href="/calendario" style={{ fontWeight: 600 }}>Ver todas las fechas en el calendario →</Link>
          </p>
        </div>
      </section>

      <section id="espacios" className="seccion sup">
        <div className="ancho">
          <p className="ceja">Espacios afiliados</p>
          <h2 className="h2">Los lugares que se suman</h2>
          <p className="apagado" style={{ margin: "0 0 40px", maxWidth: 720 }}>Cada espacio tiene su propio contacto. Bifröst solo facilita que se encuentren.</p>
          {espacios.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }} role="group" aria-label="Filtrar por tipo de espacio">
              {["Todos", ...tiposConEspacios].map((t) => (
                <Link
                  key={t}
                  href={t === "Todos" ? "/dar-por-dar#espacios" : `/dar-por-dar?tipo=${encodeURIComponent(t)}#espacios`}
                  scroll={false}
                  className={`chip${elegido === t ? " on" : ""}`}
                  aria-current={elegido === t ? "true" : undefined}
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
          {visibles.length === 0 ? (
            <p className="vacio">Todavía no hay espacios publicados. ¿Tenés uno? Sumalo abajo.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
              {visibles.map((e) => {
                const link = linkContacto(e.contacto);
                return (
                  <article key={e.id} style={{ minHeight: 230, minWidth: 0, display: "flex", flexDirection: "column", gap: 10, padding: 22, borderRadius: 18, background: "var(--surface)", border: "1px solid var(--line)" }}>
                    <IconoEspacio tipo={e.tipo} grande />
                    <p style={{ margin: "6px 0 0", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)" }}>{e.tipo}</p>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", lineHeight: 1.25, fontWeight: 600 }}>{e.nombre}</h3>
                    {e.zona && <p className="apagado" style={{ margin: 0, fontSize: "0.95rem" }}>{e.zona}</p>}
                    {e.descripcion && <p className="apagado" style={{ margin: 0, fontSize: "0.95rem" }}>{e.descripcion}</p>}
                    {link ? (
                      <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ marginTop: "auto", fontWeight: 600 }}>
                        Contactar →
                      </a>
                    ) : (
                      e.contacto && <p style={{ margin: "auto 0 0", fontWeight: 600, fontSize: "0.95rem" }}>{e.contacto}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="sumar" className="seccion">
        <div className="ancho" style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <p className="ceja">Sumá tu espacio</p>
            <h2 className="h2">¿Tenés un espacio comunitario?</h2>
            <p className="apagado" style={{ margin: "0 0 16px" }}>
              Refugios, comedores, huertas, bibliotecas populares, grupos ambientales y cualquier lugar que trabaje por lo común.
            </p>
            <p className="apagado" style={{ margin: 0 }}>Completá el formulario y lo publicamos en la lista. Las consultas te van a llegar directo a vos.</p>
          </div>
          <FormEspacio />
        </div>
      </section>

      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}
