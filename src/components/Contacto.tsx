import { CONTACTO } from "@/lib/site";
import { FormContacto } from "./FormContacto";

export function Contacto({ talleres }: { talleres: string[] }) {
  return (
    <section id="contacto" className="seccion sup borde">
      <div className="ancho">
        <FormContacto talleres={talleres}>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p className="ceja">Contacto</p>
            <h2 className="h2">¿Hablamos?</h2>
            <p className="apagado" style={{ margin: "0 0 24px", maxWidth: 620 }}>
              Escribinos para reservar tu lugar en un taller, consultar por un espacio para tu equipo o contarnos qué te
              gustaría aprender.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "12px 32px", fontWeight: 600 }}>
              <li>
                Email: <span style={{ color: "var(--green-text)" }}>{CONTACTO.email}</span>
              </li>
              <li>
                WhatsApp: <span style={{ color: "var(--green-text)" }}>{CONTACTO.whatsapp}</span>
              </li>
              <li>
                Instagram: <span style={{ color: "var(--green-text)" }}>{CONTACTO.instagram}</span>
              </li>
            </ul>
          </div>
        </FormContacto>
      </div>
    </section>
  );
}
