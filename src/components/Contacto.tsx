import { datosContacto } from "@/lib/datos";
import { FormContacto } from "./FormContacto";

/** Arma el link de cada dato; si falta, muestra [PENDIENTE]. */
function Dato({ valor, href, texto }: { valor: string; href: string; texto?: string }) {
  const estilo = { color: "var(--green-text)" };
  if (!valor) return <span style={estilo}>[PENDIENTE]</span>;
  return (
    <a href={href} style={estilo} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {texto ?? valor}
    </a>
  );
}

export async function Contacto() {
  const c = await datosContacto();
  const wa = c.whatsapp.replace(/\D/g, "");
  const ig = c.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  const li = /^https?:\/\//.test(c.linkedin) ? c.linkedin : `https://www.linkedin.com/${c.linkedin.replace(/^\/+/, "")}`;
  const yt = /^https?:\/\//.test(c.youtube) ? c.youtube : `https://www.youtube.com/${c.youtube.startsWith("@") ? c.youtube : `@${c.youtube.replace(/^\/+/, "")}`}`;
  return (
    <section id="contacto" className="seccion sup borde">
      <div className="ancho">
        <FormContacto>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p className="ceja">Contacto</p>
            <h2 className="h2">¿Hablamos?</h2>
            <p className="apagado" style={{ margin: "0 0 24px", maxWidth: 620 }}>
              Escribinos para reservar tu lugar en un taller, consultar por un espacio para tu equipo o contarnos qué te
              gustaría aprender.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "12px 32px", fontWeight: 600 }}>
              <li>
                Email: <Dato valor={c.email} href={`mailto:${c.email}`} />
              </li>
              <li>
                WhatsApp: <Dato valor={c.whatsapp} href={`https://wa.me/${wa}`} />
              </li>
              <li>
                Instagram: <Dato valor={c.instagram} href={`https://instagram.com/${ig}`} />
              </li>
              <li>
                LinkedIn: <Dato valor={c.linkedin} href={li} texto={c.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(company\/|in\/)?/, "").replace(/\/$/, "")} />
              </li>
              {c.youtube && (
                <li>
                  YouTube: <Dato valor={c.youtube} href={yt} texto={c.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\//, "").replace(/\/$/, "")} />
                </li>
              )}
            </ul>
          </div>
        </FormContacto>
      </div>
    </section>
  );
}
