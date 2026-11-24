import type { Metadata } from "next";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { TarjetaTaller } from "@/components/TarjetaTaller";
import { talleresPublicados } from "@/lib/datos";

export const revalidate = 60;
export const metadata: Metadata = { title: "Talleres" };

export default async function Talleres() {
  const talleres = await talleresPublicados();
  return (
    <>
      <Portada
        ceja="Talleres"
        titulo="La forja"
        bajada="En el mito, los enanos forjaron los tesoros de los dioses. Acá se forjan talleres de varios encuentros, pensados para aprender, practicar y llevarte herramientas que podés aplicar desde el primer día."
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
