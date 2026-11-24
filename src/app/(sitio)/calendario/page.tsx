import type { Metadata } from "next";
import Link from "next/link";
import { eventosPublicados, talleresPublicados } from "@/lib/datos";
import { hoyBA, rango, sumarDias } from "@/lib/format";
import { CALENDAR_ID, ZONA } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = { title: "Calendario" };

type Actividad = { id: string; nombre: string; inicio: string; fin: string | null; tipo: string; href?: string };

export default async function Calendario() {
  const [talleres, eventos] = await Promise.all([talleresPublicados(), eventosPublicados()]);
  const hoy = hoyBA();
  const en30 = sumarDias(hoy, 30);

  const actividades: Actividad[] = [
    ...talleres
      .filter((t) => t.inicio)
      .map((t) => ({ id: t.id, nombre: t.nombre, inicio: t.inicio!, fin: t.fin, tipo: "Taller", href: `/talleres/${t.slug}` })),
    ...eventos
      .filter((e) => e.inicio)
      .map((e) => ({ id: e.id, nombre: e.titulo, inicio: e.inicio!, fin: e.fin, tipo: e.tipo === "pago" ? "Evento pago" : "Evento gratuito" })),
  ]
    .filter((a) => (a.fin ?? a.inicio) >= hoy)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const verdandi = actividades.filter((a) => a.inicio <= en30);
  const skuld = actividades.filter((a) => a.inicio > en30);

  const src = `https://calendar.google.com/calendar/embed?${new URLSearchParams({
    src: CALENDAR_ID,
    ctz: ZONA,
    hl: "es",
    mode: "MONTH",
    showPrint: "0",
    showTitle: "0",
    showTz: "0",
  }).toString()}`;

  return (
    <section className="seccion">
      <div className="contenedor">
        <span className="ceja">Calendario</span>
        <h1>Las Nornas</h1>
        <p className="apagado" style={{ maxWidth: 680 }}>
          Urd, Verdandi y Skuld: lo que fue, lo que está siendo y lo que será. Las fechas de Bifröst, la vista del mes y
          la proyección del año.
        </p>

        <iframe title="Calendario de Bifröst" src={src} className="calendario-google" loading="lazy" style={{ marginTop: "1.5rem" }} />

        <div className="nornas" style={{ marginTop: "2.5rem" }}>
          <Columna titulo="Verdandi" bajada="Lo que está siendo: en curso o en los próximos 30 días" items={verdandi} />
          <Columna titulo="Skuld" bajada="Lo que será: más adelante" items={skuld} />
        </div>
      </div>
    </section>
  );
}

function Columna({ titulo, bajada, items }: { titulo: string; bajada: string; items: Actividad[] }) {
  return (
    <div className="caja">
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>{titulo}</h2>
      <p className="apagado">{bajada}</p>
      {items.length === 0 ? (
        <p className="apagado">Nada por ahora.</p>
      ) : (
        <ul className="lista-limpia">
          {items.map((a) => (
            <li key={a.id} style={{ borderTop: "1px solid var(--linea)", paddingTop: "0.8rem" }}>
              <span className="insignia">{a.tipo}</span>
              <h3 style={{ margin: "0.4rem 0 0.2rem" }}>{a.href ? <Link href={a.href}>{a.nombre}</Link> : a.nombre}</h3>
              <span className="apagado">{rango(a.inicio, a.fin)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
