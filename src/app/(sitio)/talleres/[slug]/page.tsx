import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FormInteres } from "@/components/FormInteres";
import { tallerPorSlug } from "@/lib/datos";
import { rango } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await tallerPorSlug((await params).slug);
  return t ? { title: t.nombre, description: t.bajada || t.descripcion.slice(0, 160) } : {};
}

export default async function TallerPage({ params }: Props) {
  const t = await tallerPorSlug((await params).slug);
  if (!t) notFound();

  return (
    <section className="seccion">
      <div className="contenedor">
        <p>
          <Link href="/talleres">← Todos los talleres</Link>
        </p>
        <div className="taller">
          <div>
            <span className={`insignia ${t.inicio ? "" : "ambar"}`}>{t.inicio ? rango(t.inicio, t.fin) : "Fecha a confirmar"}</span>
            <h1 style={{ marginTop: "0.8rem" }}>{t.nombre}</h1>
            <p className="apagado">{t.bajada}</p>
            <p>{t.descripcion}</p>
            {t.detalle && <p className="preline">{t.detalle}</p>}
          </div>
          <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
            <dl className="datos">
              <div>
                <dt>Fechas</dt>
                <dd>{rango(t.inicio, t.fin)}</dd>
              </div>
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

            <div className="caja" id="inscripcion">
              <h2 style={{ fontSize: "1.4rem" }}>¿Te interesa?</h2>
              <p className="apagado">
                Dejanos tus datos y alguien del equipo te contacta para contarte los detalles y reservar tu lugar.
              </p>
              <FormInteres tallerId={t.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
