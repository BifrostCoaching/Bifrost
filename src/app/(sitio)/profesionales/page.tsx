import type { Metadata } from "next";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { profesionalesPublicados } from "@/lib/datos";
import { linkContacto } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "Profesionales" };

export default async function Profesionales() {
  const profesionales = await profesionalesPublicados();
  return (
    <>
      <Portada
        ceja="Profesionales"
        titulo="Los Vanir"
        bajada="En el mito, los Vanir vienen de su propio reino y se suman a los Æsir con lo que cada uno sabe hacer. Así llegan a Bifröst coaches, asesores de imagen, contadores y otros profesionales, cada uno con su oficio."
      />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho">
          {profesionales.length === 0 ? (
            <p className="vacio">Pronto vas a conocer acá a los profesionales que trabajan con Bifröst.</p>
          ) : (
            <div className="grilla-vanir">
              {profesionales.map((p) => {
                const link = linkContacto(p.contacto);
                return (
                  <article key={p.id} className="vanir">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} loading="lazy" />
                    ) : (
                      <div className="vanir-inicial" aria-hidden="true">{p.nombre.replace(/\[.*?\]\s*/g, "").charAt(0) || "·"}</div>
                    )}
                    <div className="vanir-cuerpo">
                      <h2>{p.nombre}</h2>
                      {p.oficio && <p className="sub" style={{ margin: 0 }}>{p.oficio}</p>}
                      {p.descripcion && <p className="apagado preline" style={{ margin: 0 }}>{p.descripcion}</p>}
                      {p.contacto &&
                        (link ? (
                          <a href={link} target="_blank" rel="noopener noreferrer" className="boton chico" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
                            Contactar
                          </a>
                        ) : (
                          <p style={{ margin: "auto 0 0", fontWeight: 600 }}>Contacto: {p.contacto}</p>
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Contacto />
    </>
  );
}
