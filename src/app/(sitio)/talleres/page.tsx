import type { Metadata } from "next";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { TarjetaTaller } from "@/components/TarjetaTaller";
import { talleresPublicados } from "@/lib/datos";
import { textosPortada } from "@/lib/portadas";

export const revalidate = 60;
export const metadata: Metadata = { title: "Talleres" };

export default async function Talleres() {
  const portada = await textosPortada("talleres");
  const talleres = await talleresPublicados();
  return (
    <>
      <Portada
        ceja="Talleres"
        titulo={portada.titulo}
        bajada={portada.bajada}
      />
      <section id="talleres" className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho">
          {talleres.length === 0 ? (
            <p className="vacio">Pronto vas a ver acá los próximos talleres.</p>
          ) : (
            <div className="fila" style={{ gap: 32 }}>
              {talleres.map((t, i) => (
                <TarjetaTaller key={t.id} t={t} indice={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Contacto />
    </>
  );
}
