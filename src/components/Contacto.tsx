import { CONTACTO } from "@/lib/site";
import { FormContacto } from "./FormContacto";

export function Contacto({ talleres }: { talleres: string[] }) {
  return (
    <section id="contacto" className="seccion banda">
      <div className="contenedor" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div>
          <span className="ceja">Contacto</span>
          <h2>¿Hablamos?</h2>
          <p>
            Escribinos para reservar tu lugar en un taller, consultar por un espacio para tu equipo o contarnos qué te
            gustaría aprender.
          </p>
          <p>
            Email: {CONTACTO.email}
            <br />
            WhatsApp: {CONTACTO.whatsapp}
            <br />
            Instagram: {CONTACTO.instagram}
          </p>
        </div>
        <div className="caja" style={{ color: "var(--texto)" }}>
          <FormContacto talleres={talleres} />
        </div>
      </div>
    </section>
  );
}
