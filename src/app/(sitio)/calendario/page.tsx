import type { Metadata } from "next";
import Link from "next/link";
import { Portada } from "@/components/Portada";
import { Contacto } from "@/components/Contacto";
import { eventosPublicados, talleresPublicados } from "@/lib/datos";
import { fecha, hoyBA, sumarDias } from "@/lib/format";
import { CALENDAR_ID, ZONA } from "@/lib/site";

export const metadata: Metadata = { title: "Calendario" };
export const revalidate = 60;

type Actividad = { id: string; nombre: string; inicio: string; fin: string; pago: boolean; badge: string; detalle: string; href?: string };

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type Props = { searchParams: Promise<{ mes?: string }> };

export default async function Calendario({ searchParams }: Props) {
  const [talleres, eventos] = await Promise.all([talleresPublicados(), eventosPublicados()]);
  const hoy = hoyBA();

  const actividades: Actividad[] = [
    ...talleres.filter((t) => t.inicio).map((t) => ({
      id: t.id, nombre: t.nombre, inicio: t.inicio!, fin: t.fin ?? t.inicio!, pago: t.tipo === "pago",
      badge: t.tipo === "pago" ? "Taller pago" : "Taller gratuito", detalle: t.modalidad || t.bajada, href: `/talleres/${t.slug}`,
    })),
    ...eventos.filter((e) => e.inicio).map((e) => ({
      id: e.id, nombre: e.titulo, inicio: e.inicio!, fin: e.fin ?? e.inicio!, pago: e.tipo === "pago",
      badge: e.tipo === "pago" ? "Evento pago" : "Evento gratuito", detalle: [e.organiza, e.modalidad].filter(Boolean).join(" · "),
    })),
  ].sort((a, b) => a.inicio.localeCompare(b.inicio));

  // Mes a mostrar: el pedido, o el de la próxima actividad, o el actual.
  const { mes } = await searchParams;
  const proxima = actividades.find((a) => a.fin >= hoy);
  const base = /^\d{4}-\d{2}$/.test(mes ?? "") ? mes! : (proxima?.inicio ?? hoy).slice(0, 7);
  const [anio, m] = base.split("-").map(Number);
  const semanas = armarSemanas(anio, m);
  const prev = m === 1 ? `${anio - 1}-12` : `${anio}-${String(m - 1).padStart(2, "0")}`;
  const next = m === 12 ? `${anio + 1}-01` : `${anio}-${String(m + 1).padStart(2, "0")}`;

  const en30 = sumarDias(hoy, 30);
  const verdandi = actividades.filter((a) => a.fin >= hoy && a.inicio <= en30);
  const skuld = actividades.filter((a) => a.inicio > en30);
  const urd = actividades.filter((a) => a.fin < hoy).reverse();

  const src = `https://calendar.google.com/calendar/embed?${new URLSearchParams({ src: CALENDAR_ID, ctz: ZONA, hl: "es", mode: "AGENDA", showPrint: "0", showTitle: "0", showTz: "0" })}`;

  return (
    <>
      <Portada ceja="Calendario" titulo="Las Nornas" bajada="Urd, Verdandi y Skuld: lo que fue, lo que está siendo y lo que será. Las fechas de Bifröst, la vista del mes y la proyección del año." />

      <section className="seccion sup">
        <div className="ancho">
          <p className="ceja">{MESES[m - 1]} {anio}</p>
          <div className="mes-nav" style={{ justifyContent: "space-between" }}>
            <h2 className="h2" style={{ margin: 0 }}>Vista del mes</h2>
            <div className="botones" style={{ gap: 10 }}>
              <Link href={`/calendario?mes=${prev}`} className="boton borde mini" scroll={false}>← {MESES[(m + 10) % 12]}</Link>
              <Link href={`/calendario?mes=${next}`} className="boton borde mini" scroll={false}>{MESES[m % 12]} →</Link>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div className="mes">
              <div className="semana cab">{DIAS.map((d) => <div key={d} className="dia-cab">{d}</div>)}</div>
              {semanas.map((sem, k) => {
                const desde = sem.find(Boolean)!;
                const hasta = [...sem].reverse().find(Boolean)!;
                const barras = actividades.filter((a) => a.inicio <= hasta && a.fin >= desde);
                return (
                  <div key={k} className="semana">
                    {sem.map((d, j) => d ? <div key={j} className={`dia${d === hoy ? " hoy" : ""}`}>{Number(d.slice(8))}</div> : <div key={j} aria-hidden="true" />)}
                    {barras.map((a) => {
                      const ini = Math.max(0, sem.findIndex((d) => d && d >= a.inicio));
                      let fin = 6 - [...sem].reverse().findIndex((d) => d && d <= a.fin);
                      if (fin < ini) fin = ini;
                      const contenido = (
                        <>
                          <span style={{ fontWeight: 700 }}>{a.nombre}</span>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rangoCorto(a.inicio, a.fin)}</span>
                        </>
                      );
                      const style = { gridColumn: `${ini + 1} / ${fin + 2}` };
                      return a.href ? (
                        <Link key={a.id} href={a.href} className={`barra ${a.pago ? "paid" : "free"}`} style={style}>{contenido}</Link>
                      ) : (
                        <div key={a.id} className={`barra ${a.pago ? "paid" : "free"}`} style={style}>{contenido}</div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="ancho">
          <p className="ceja">Las tres Nornas</p>
          <h2 className="h2">Lo que fue, lo que está siendo, lo que será</h2>
          <p className="apagado" style={{ margin: "0 0 40px", maxWidth: 720 }}>
            Junto al pozo de Urd, las Nornas cuidan el tiempo. Así ordenamos las actividades de Bifröst que el equipo carga desde el panel.
          </p>
          <Norna nombre="Verdandi" bajada="Lo que está siendo: en curso o en los próximos 30 días" items={verdandi} />
          <Norna nombre="Skuld" bajada="Lo que será: más adelante" items={skuld} />
          <Norna nombre="Urd" bajada="Lo que fue: actividades que ya terminaron" items={urd} />
        </div>
      </section>

      <section className="seccion sup">
        <div className="ancho">
          <p className="ceja">Agenda de Bifröst</p>
          <h2 className="h2">El calendario completo</h2>
          <p className="apagado" style={{ margin: "0 0 32px", maxWidth: 720 }}>
            Desde acá podés sumar cualquier fecha a tu propio calendario de Google.
          </p>
          <iframe title="Calendario de Bifröst en Google Calendar" src={src} className="calendario-google" loading="lazy" />
        </div>
      </section>

      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}

function Norna({ nombre, bajada, items }: { nombre: string; bajada: string; items: Actividad[] }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 16px", marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: "1.6rem", lineHeight: 1.25, fontWeight: 600 }}>{nombre}</h3>
        <p className="apagado" style={{ margin: 0 }}>{bajada}</p>
      </div>
      {items.length === 0 ? (
        <p className="vacio">Nada por ahora.</p>
      ) : (
        <div className="fila" style={{ gap: 24 }}>
          {items.map((a) => (
            <article key={a.id} className="norna">
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <h3>{a.href ? <Link href={a.href} style={{ color: "inherit" }}>{a.nombre}</Link> : a.nombre}</h3>
                <span className={`tag ${a.pago ? "paid" : "free"}`} style={{ fontSize: "0.85rem" }}>{a.badge}</span>
              </div>
              <div className="fechas">
                <div><p className="lbl">Inicio</p><p className="val">{fecha(a.inicio)}</p></div>
                <div className="flecha" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </div>
                <div style={{ textAlign: "right" }}><p className="lbl">Fin</p><p className="val">{fecha(a.fin)}</p></div>
              </div>
              {a.detalle && <p className="apagado" style={{ margin: 0 }}>{a.detalle}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function rangoCorto(ini: string, fin: string) {
  const d1 = Number(ini.slice(8)), d2 = Number(fin.slice(8));
  return ini === fin ? `El ${d1}` : ini.slice(0, 7) === fin.slice(0, 7) ? `Del ${d1} al ${d2}` : `${fecha(ini)} al ${fecha(fin)}`;
}

/** Semanas del mes, de lunes a domingo, con "AAAA-MM-DD" o null en los huecos. */
function armarSemanas(anio: number, mes: number): (string | null)[][] {
  const primero = new Date(Date.UTC(anio, mes - 1, 1));
  const dias = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const offset = (primero.getUTCDay() + 6) % 7;
  const celdas: (string | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= dias; d++) celdas.push(`${anio}-${String(mes).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  while (celdas.length % 7) celdas.push(null);
  const out: (string | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) out.push(celdas.slice(i, i + 7));
  return out;
}
