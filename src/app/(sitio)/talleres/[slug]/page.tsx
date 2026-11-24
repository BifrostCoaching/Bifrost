import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FormInteres } from "@/components/FormInteres";
import { Portada } from "@/components/Portada";
import { TarjetaTaller } from "@/components/TarjetaTaller";
import { tallerPorSlug } from "@/lib/datos";

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
    <>
      <Portada ceja="Talleres" titulo={t.nombre} bajada={t.bajada} />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho">
          <p style={{ margin: "0 0 24px" }}>
            <Link href="/talleres">← Todos los talleres</Link>
          </p>
          <div className="fila" style={{ gap: 32, alignItems: "flex-start" }}>
            <TarjetaTaller t={t} detalle>
              <span />
            </TarjetaTaller>
            <div id="me-interesa" className="caja" style={{ flex: "1 1 360px", minWidth: 0 }}>
              <p className="ceja">Me interesa</p>
              <h2 className="h2" style={{ fontSize: "2rem" }}>¿Querés sumarte?</h2>
              <p className="apagado">Dejanos tus datos y alguien del equipo de Bifröst te contacta para contarte los detalles y reservar tu lugar.</p>
              <FormInteres tallerId={t.id} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
