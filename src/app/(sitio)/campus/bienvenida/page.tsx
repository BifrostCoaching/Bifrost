import type { Metadata } from "next";
import { Portada } from "@/components/Portada";
import { ElegirClave } from "./ElegirClave";

export const metadata: Metadata = { title: "Bienvenida al Campus", robots: { index: false } };

export default function Bienvenida() {
  return (
    <>
      <Portada ceja="Campus" titulo="Bienvenida a Midgard" bajada="Elegí tu contraseña y entrás a tu campus: tu bosque, tu agenda y tus talleres." />
      <section className="seccion" style={{ paddingTop: 32 }}>
        <div className="ancho" style={{ maxWidth: 560 }}>
          <div className="form-caja">
            <ElegirClave />
          </div>
        </div>
      </section>
    </>
  );
}
