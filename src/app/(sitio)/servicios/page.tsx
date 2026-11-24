import type { Metadata } from "next";
import Link from "next/link";
import { Contacto } from "@/components/Contacto";
import { Diapositivas } from "@/components/Diapositivas";
import { IMAGENES_PORTADA, Portada } from "@/components/Portada";
import { serviciosPublicados } from "@/lib/datos";
import { textosPortada } from "@/lib/portadas";

export const revalidate = 60;
export const metadata: Metadata = { title: "Servicios" };

export default async function Servicios() {
  const portada = await textosPortada("servicios");
  const servicios = await serviciosPublicados();
  return (
    <>
      <Portada
        ceja="Servicios"
        titulo={portada.titulo}
        bajada={portada.bajada}
      />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho">
          {servicios.length === 0 ? (
            <p className="vacio">Pronto vas a ver acá los servicios de Bifröst.</p>
          ) : (
            <div className="fila" style={{ gap: 32 }}>
              {servicios.map((s, i) => (
                <article key={s.id} className="taller" id={`servicio-${s.id}`}>
                  <div className="taller-media" aria-hidden="true">
                    <Diapositivas imagenes={s.imagenes.length ? s.imagenes : IMAGENES_PORTADA} desfase={i * 2000} />
                    <div className="media-shade" />
                  </div>
                  <div className="taller-cuerpo">
                    <p className="tag free" style={{ margin: 0 }}>Servicio</p>
                    <div>
                      <h2 className="nombre" style={{ margin: "0 0 6px", fontSize: "2rem", lineHeight: 1.15, fontWeight: 700 }}>{s.nombre}</h2>
                      {s.bajada && <p className="sub">{s.bajada}</p>}
                    </div>
                    {s.descripcion && <p className="apagado preline" style={{ margin: 0 }}>{s.descripcion}</p>}
                    <dl className="datos">
                      <div>
                        <dt>Para quién</dt>
                        <dd>{s.para_quien || "[PENDIENTE]"}</dd>
                      </div>
                      <div>
                        <dt>Modalidad</dt>
                        <dd>{s.modalidad || "[PENDIENTE]"}</dd>
                      </div>
                      <div>
                        <dt>Inversión</dt>
                        <dd>{s.precio_texto || "[PENDIENTE]"}</dd>
                      </div>
                    </dl>
                    <Link href="#contacto" className="boton chico" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
                      Consultar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Contacto />
    </>
  );
}
