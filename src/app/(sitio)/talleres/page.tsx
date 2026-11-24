import type { Metadata } from "next";
import Link from "next/link";
import { Contacto } from "@/components/Contacto";
import { talleresPublicados } from "@/lib/datos";
import { rango } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "Talleres" };

export default async function Talleres() {
  const talleres = await talleresPublicados();
  return (
    <>
      <section className="seccion">
        <div className="contenedor">
          <span className="ceja">Talleres</span>
          <h1>La forja</h1>
          <p className="apagado" style={{ maxWidth: 680 }}>
            En el mito, los enanos forjaron los tesoros de los dioses. Acá se forjan talleres de varios encuentros,
            pensados para aprender, practicar y llevarte herramientas que podés aplicar desde el primer día.
          </p>
          <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
            {talleres.length === 0 && <p className="apagado">Pronto vas a ver acá los próximos talleres.</p>}
            {talleres.map((t) => (
              <article key={t.id} className="taller">
                <div>
                  <span className={`insignia ${t.inicio ? "" : "ambar"}`}>
                    {t.inicio ? rango(t.inicio, t.fin) : "Fecha a confirmar"}
                  </span>
                  <h2 style={{ marginTop: "0.8rem" }}>{t.nombre}</h2>
                  <p className="apagado">{t.bajada}</p>
                  <p>{t.descripcion}</p>
                  <Link href={`/talleres/${t.slug}`} className="boton">
                    {t.tipo === "pago" && t.monto_online ? "Ver detalle e inscribirme" : "Ver detalle"}
                  </Link>
                </div>
                <dl className="datos">
                  <div>
                    <dt>Modalidad</dt>
                    <dd>{t.modalidad || "[PENDIENTE]"}</dd>
                  </div>
                  <div>
                    <dt>Encuentros</dt>
                    <dd>{t.encuentros ?? "[PENDIENTE]"}</dd>
                  </div>
                  <div>
                    <dt>Inversión</dt>
                    <dd>{t.tipo === "gratuito" ? "Gratuito" : t.precio_texto || "[PENDIENTE]"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}
