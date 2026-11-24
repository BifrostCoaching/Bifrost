import Link from "next/link";
import { Diapositivas } from "./Diapositivas";
import { imagenesTaller, rango } from "@/lib/format";
import type { Taller } from "@/lib/types";

export function insignia(t: Taller) {
  return { texto: t.tipo === "gratuito" ? "Gratuito" : "Taller pago", cls: t.tipo === "gratuito" ? "tag free" : "tag paid" };
}

export function TarjetaTaller({ t, indice = 0, detalle = false, children }: { t: Taller; indice?: number; detalle?: boolean; children?: React.ReactNode }) {
  const ins = insignia(t);
  const Titulo = detalle ? "h2" : "h3";
  return (
    <article className="taller">
      <div className="taller-media" aria-hidden="true">
        <Diapositivas imagenes={imagenesTaller(t)} desfase={indice * 2000} />
        <div className="media-shade" />
      </div>
      <div className="taller-cuerpo">
        <p className={ins.cls} style={{ margin: 0 }}>{ins.texto}</p>
        <div>
          <Titulo className="nombre" style={{ margin: "0 0 6px", fontSize: "2rem", lineHeight: 1.15, fontWeight: 700 }}>{t.nombre}</Titulo>
          <p className="sub">{t.bajada}</p>
        </div>
        <p className="apagado" style={{ margin: 0 }}>{t.descripcion}</p>
        {t.detalle && <p className="apagado preline" style={{ margin: 0 }}>{t.detalle}</p>}
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
        {children ?? (
          <Link href={`/talleres/${t.slug}#me-interesa`} className="boton chico" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
            Quiero inscribirme
          </Link>
        )}
      </div>
    </article>
  );
}
