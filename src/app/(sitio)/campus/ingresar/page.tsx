import type { Metadata } from "next";
import { Portada } from "@/components/Portada";
import { FormCampus } from "./FormCampus";

export const metadata: Metadata = { title: "Ingresar al Campus", robots: { index: false } };

export default async function IngresarCampus({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <Portada ceja="Campus" titulo="Midgard" bajada="El mundo de las personas, el recinto del medio. Tu bosque de talleres, tu agenda, los eventos y los talleres en los que estás, todo en un mismo lugar." />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho" style={{ maxWidth: 560 }}>
          {error === "sin-acceso" && (
            <p className="aviso error" role="alert" style={{ marginBottom: 20 }}>
              Esa cuenta todavía no tiene acceso al campus. Pedíselo al equipo de Bifröst.
            </p>
          )}
          <div className="form-caja">
            <h2 className="h2" style={{ fontSize: "1.8rem" }}>Ingresar</h2>
            <FormCampus />
            <p className="apagado" style={{ margin: "20px 0 0", fontSize: "0.95rem" }}>
              El acceso al campus lo da el equipo cuando te inscribís a un taller. Si todavía no lo tenés, o te olvidaste la contraseña,
              escribinos y te mandamos un link nuevo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
