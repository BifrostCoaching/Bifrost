import type { Metadata } from "next";
import Link from "next/link";
import { Portada } from "@/components/Portada";
import { ETAPAS } from "@/components/campus/Etapas";
import { datosCampus } from "@/lib/campus";
import { rango } from "@/lib/format";
import type { Cuando, Evento, Modulo, Taller } from "@/lib/types";
import { agregarPlan, borrarPlan, inscribirme, marcarModulo, salirCampus } from "./acciones";
import { textosPortada } from "@/lib/portadas";

export const metadata: Metadata = { title: "Campus", robots: { index: false } };

type Seccion = "bosque" | "agenda" | "talleres" | "mios" | "eventos";
const SECCIONES: [Seccion, string][] = [
  ["bosque", "Mi bosque"],
  ["agenda", "Mi agenda"],
  ["talleres", "Talleres"],
  ["mios", "Mis talleres"],
  ["eventos", "Eventos"],
];
const NOMBRES_ETAPA = ["Retoño", "Brote", "Arbolito", "Árbol joven", "Árbol"];
const HORIZONTES: [Cuando, string, string][] = [
  ["semana", "Esta semana", "#D9808A"],
  ["mes", "Este mes", "var(--green-text)"],
  ["anio", "Este año", "var(--eyebrow)"],
  ["largo", "Largo plazo", "#9FB4E0"],
];

const lineas = (v: string) => v.split("\n").map((l) => l.trim()).filter(Boolean);

/** Un material puede ser un link: si empieza con http, se muestra como link. */
function Linea({ texto }: { texto: string }) {
  const m = texto.match(/^(.*?)(https?:\/\/\S+)\s*$/);
  if (!m) return <li>{texto}</li>;
  const etiqueta = m[1].replace(/[:\-–·\s]+$/, "").trim() || m[2];
  return (
    <li>
      <a href={m[2]} target="_blank" rel="noopener noreferrer">{etiqueta}</a>
    </li>
  );
}

type MiTaller = { taller: Taller; modulos: (Modulo & { hecho: boolean })[]; hechos: number; etapa: number };

/** El primer árbol va en el centro y los demás se suman de a uno, alternando a cada lado. */
function desdeElCentro<T>(lista: T[]): T[] {
  const out: T[] = [];
  lista.forEach((x, i) => (i % 2 === 1 ? out.push(x) : out.unshift(x)));
  return out;
}

export default async function Campus({ searchParams }: { searchParams: Promise<{ seccion?: string; taller?: string }> }) {
  const portada = await textosPortada("campus");
  const { participante, talleres: todos, eventos, inscripciones, modulos, hechos, agenda } = await datosCampus();
  const { seccion, taller: tallerSel } = await searchParams;
  const tab: Seccion = SECCIONES.some(([s]) => s === seccion) ? (seccion as Seccion) : "bosque";
  const talleres = todos.filter((t) => t.publicado);
  const confirmadas = inscripciones.filter((i) => i.estado === "confirmada");

  const mios: MiTaller[] = confirmadas
    .map((i) => todos.find((t) => t.id === i.taller_id))
    .filter((t): t is Taller => Boolean(t))
    .map((taller) => {
      const ms = modulos.filter((m) => m.taller_id === taller.id).map((m) => ({ ...m, hecho: hechos.has(m.id) }));
      const n = ms.filter((m) => m.hecho).length;
      const etapa = !ms.length || n === 0 ? 0 : n >= ms.length ? 4 : Math.min(3, 1 + Math.floor((n / ms.length) * 3));
      return { taller, modulos: ms, hechos: n, etapa };
    });
  const pendientes = inscripciones
    .filter((i) => i.estado === "pendiente")
    .map((i) => todos.find((t) => t.id === i.taller_id))
    .filter((t): t is Taller => Boolean(t));
  const arboles = mios.filter((m) => m.etapa === 4).length;
  const creciendo = mios.length - arboles;
  const elegido = mios.find((m) => m.taller.id === tallerSel) ?? mios[0];
  const nombre = participante.nombre || participante.email.split("@")[0];

  return (
    <>
      <Portada ceja="Campus" titulo={portada.titulo} bajada={portada.bajada} />
      <section id="campus" className="seccion">
        <div className="ancho">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div aria-hidden="true" className="h" style={{ width: 52, height: 52, borderRadius: 999, background: "#1E6B5A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.2rem" }}>
                {(nombre.match(/\p{L}/u)?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem" }}>Hola, {nombre}</p>
                <form action={salirCampus}>
                  <button style={{ background: "none", border: 0, padding: 0, color: "var(--muted)", font: "inherit", fontSize: "0.95rem", cursor: "pointer", textDecoration: "underline" }}>Salir</button>
                </form>
              </div>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 10 }} aria-label="Secciones del campus">
              {SECCIONES.map(([s, texto]) => (
                <Link key={s} href={`/campus?seccion=${s}`} scroll={false} className={`chip${tab === s ? " on" : ""}`} aria-current={tab === s ? "page" : undefined}>
                  {texto}
                </Link>
              ))}
            </nav>
          </div>

          {tab === "bosque" && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                <h2 className="h2">Mi bosque</h2>
                {mios.length > 0 && (
                  <p style={{ margin: "0 0 20px", fontWeight: 600, color: "var(--green-text)" }}>
                    {arboles === 1 ? "1 árbol" : `${arboles} árboles`} · {creciendo === 1 ? "1 en crecimiento" : `${creciendo} en crecimiento`}
                  </p>
                )}
              </div>
              <p className="apagado" style={{ margin: "0 0 28px", maxWidth: 720 }}>
                Cada taller en el que participás planta un retoño. A medida que completás sus módulos va creciendo, y cuando terminás el
                taller se vuelve un árbol. Taller a taller, se forma tu bosque.
              </p>
              {pendientes.length > 0 && (
                <p className="apagado" style={{ margin: "0 0 20px" }}>Los talleres con inscripción pendiente se plantan cuando el equipo la confirma.</p>
              )}
              {mios.length === 0 ? (
                <p className="vacio">Todavía no plantaste ningún retoño. Cuando se confirme tu primer taller, aparece acá.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px", padding: "24px 20px 20px", borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
                  {desdeElCentro(mios.map((m, i) => ({ ...m, i }))).map((m) => (
                    <div key={m.taller.id} style={{ flex: "0 1 200px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6, paddingBottom: 12 }}>
                      <div style={{ width: "100%", maxWidth: 200, transform: m.i % 2 === 1 ? "scaleX(-1)" : undefined }}>{ETAPAS[m.etapa]}</div>
                      <p className="h" style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.25 }}>{m.taller.nombre}</p>
                      <p style={{ margin: 0, fontWeight: 600, color: "var(--eyebrow)" }}>{NOMBRES_ETAPA[m.etapa]}</p>
                      <p className="apagado" style={{ margin: 0, fontSize: "0.9rem" }}>
                        {m.modulos.length ? `${m.hechos} de ${m.modulos.length} módulos completados` : "Módulos [PENDIENTE]"}
                      </p>
                      <Link href={`/campus?seccion=mios&taller=${m.taller.id}`} scroll={false} className="boton borde mini" style={{ marginTop: 4 }}>
                        Seguir el taller
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "agenda" && (
            <>
              <h2 className="h2" style={{ marginBottom: 8 }}>Mi agenda</h2>
              <p className="apagado" style={{ margin: "0 0 24px", maxWidth: 680 }}>Tu planificación, del corto al largo plazo. Sumá lo que querés hacer y elegí cuándo.</p>
              <form action={agregarPlan} className="form" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) auto", alignItems: "end", marginBottom: 28 }}>
                <div className="campo">
                  <label htmlFor="a-texto">¿Qué querés hacer?</label>
                  <input id="a-texto" name="texto" required maxLength={80} />
                </div>
                <div className="campo">
                  <label htmlFor="a-cuando">¿Cuándo?</label>
                  <select id="a-cuando" name="cuando">
                    {HORIZONTES.map(([v, t]) => (
                      <option key={v} value={v}>{t}</option>
                    ))}
                  </select>
                </div>
                <button className="boton">Agregar</button>
              </form>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
                {HORIZONTES.map(([v, t, color]) => {
                  const items = agenda.filter((a) => a.cuando === v);
                  return (
                    <div key={v} style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 240, padding: 20, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
                      <p className="h" style={{ margin: 0, fontWeight: 700, fontSize: "1.15rem", color }}>{t}</p>
                      {items.length === 0 && <p className="apagado" style={{ margin: 0, fontSize: "0.95rem" }}>Todavía no hay nada acá.</p>}
                      {items.map((it) => (
                        <div key={it.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, padding: "10px 12px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--line)" }}>
                          <span>{it.texto}</span>
                          <form action={borrarPlan}>
                            <input type="hidden" name="id" value={it.id} />
                            <button aria-label={`Quitar: ${it.texto}`} style={{ background: "none", border: 0, color: "var(--muted)", cursor: "pointer", font: "inherit", fontSize: "1.1rem", lineHeight: 1 }}>×</button>
                          </form>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "talleres" && (
            <>
              <h2 className="h2" style={{ marginBottom: 8 }}>Talleres</h2>
              <p className="apagado" style={{ margin: "0 0 28px", maxWidth: 720 }}>
                Cada taller tiene su espacio, con los materiales, las clases y las fechas. Desde acá también te anotás.
              </p>
              {talleres.length === 0 && <p className="vacio">Pronto vas a ver acá los próximos talleres.</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {talleres.map((t) => {
                  const insc = inscripciones.find((i) => i.taller_id === t.id);
                  const mio = mios.find((m) => m.taller.id === t.id);
                  return (
                    <article key={t.id} style={{ display: "flex", flexDirection: "column", gap: 18, padding: 26, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>
                        <div style={{ minWidth: 0, maxWidth: 640 }}>
                          <span className={`tag ${t.tipo === "gratuito" ? "free" : "paid"}`}>Taller · {t.tipo === "gratuito" ? "Gratuito" : "Pago"}</span>
                          <h3 style={{ margin: "10px 0 4px", fontSize: "1.5rem", lineHeight: 1.2 }}>{t.nombre}</h3>
                          <p className="apagado" style={{ margin: 0 }}>{t.bajada}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                          <p style={{ margin: 0, fontWeight: 600, textAlign: "right", maxWidth: 320 }}>{t.tipo === "gratuito" ? "Gratuito" : t.precio_texto || "[PENDIENTE]"}</p>
                          {!insc || insc.estado === "cancelada" ? (
                            <form action={inscribirme}>
                              <input type="hidden" name="taller_id" value={t.id} />
                              <button className="boton chico">Inscribirme</button>
                            </form>
                          ) : insc.estado === "confirmada" ? (
                            <Link href={`/campus?seccion=mios&taller=${t.id}`} scroll={false} className="boton chico">Entrar al taller</Link>
                          ) : (
                            <span className="tag paid">Esperando confirmación del equipo</span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                        <div>
                          <p className="ceja" style={{ margin: "0 0 6px", fontSize: "0.8rem" }}>Clases</p>
                          {mio?.modulos.length ? (
                            <ul style={{ margin: 0, paddingLeft: 20 }}>{mio.modulos.map((m) => <li key={m.id}>{m.titulo}</li>)}</ul>
                          ) : (
                            <p className="apagado" style={{ margin: 0 }}>{t.detalle ? t.detalle.split("\n").filter(Boolean).slice(0, 5).join(" · ") : "[PENDIENTE]"}</p>
                          )}
                        </div>
                        <div>
                          <p className="ceja" style={{ margin: "0 0 6px", fontSize: "0.8rem" }}>Materiales</p>
                          <p className="apagado" style={{ margin: 0 }}>{mio ? "En Mis talleres, módulo por módulo." : "Se abren cuando se confirma tu inscripción."}</p>
                        </div>
                        <div>
                          <p className="ceja" style={{ margin: "0 0 6px", fontSize: "0.8rem" }}>Fechas</p>
                          <p style={{ margin: 0, fontWeight: 600 }}>{rango(t.inicio, t.fin)}</p>
                          <p className="apagado" style={{ margin: 0 }}>{t.modalidad || "[PENDIENTE]"}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {tab === "mios" && (
            <>
              <h2 className="h2" style={{ marginBottom: 8 }}>Mis talleres</h2>
              <p className="apagado" style={{ margin: "0 0 24px", maxWidth: 720 }}>
                Los talleres en los que ya estás inscripto, cada uno con sus módulos, clases y materiales.
              </p>
              {pendientes.length > 0 && (
                <div className="caja" style={{ marginBottom: 24 }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700 }}>Esperando confirmación</p>
                  {pendientes.map((t) => (
                    <p key={t.id} className="apagado" style={{ margin: 0 }}>
                      {t.nombre}: tu lugar queda confirmado cuando el equipo registra tu inscripción, y ahí se abre el taller acá.
                    </p>
                  ))}
                </div>
              )}
              {!elegido ? (
                <p className="vacio">Todavía no tenés talleres confirmados. Podés anotarte desde la pestaña Talleres.</p>
              ) : (
                <>
                  {mios.length > 1 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }} role="group" aria-label="Elegí un taller">
                      {mios.map((m) => (
                        <Link key={m.taller.id} href={`/campus?seccion=mios&taller=${m.taller.id}`} scroll={false} className={`chip${m === elegido ? " on" : ""}`}>
                          {m.taller.nombre}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="caja" style={{ marginBottom: 20 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "var(--green-text)" }}>Inscripción confirmada</p>
                    <h3 style={{ margin: "6px 0", fontSize: "1.6rem" }}>{elegido.taller.nombre}</h3>
                    <p className="apagado" style={{ margin: 0 }}>{elegido.taller.bajada}</p>
                    <p style={{ margin: "8px 0 0" }}>{rango(elegido.taller.inicio, elegido.taller.fin)} · {elegido.taller.modalidad || "[PENDIENTE]"}</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 600, color: "var(--eyebrow)" }}>
                      Tu retoño: {NOMBRES_ETAPA[elegido.etapa]} · {elegido.modulos.length ? `${elegido.hechos} de ${elegido.modulos.length} módulos completados` : "Módulos [PENDIENTE]"}
                    </p>
                  </div>
                  {elegido.modulos.length === 0 && <p className="vacio">Los módulos de este taller todavía no están cargados [PENDIENTE].</p>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {elegido.modulos.map((md) => (
                      <article key={md.id} style={{ display: "flex", flexDirection: "column", gap: 14, padding: 24, borderRadius: 20, background: "var(--surface)", border: `1px solid ${md.hecho ? "var(--green-text)" : "var(--line)"}` }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
                            <span className="h" style={{ fontWeight: 700, color: "var(--eyebrow)" }}>Módulo {md.numero}</span>
                            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{md.titulo}</h3>
                          </div>
                          <form action={marcarModulo}>
                            <input type="hidden" name="modulo_id" value={md.id} />
                            <input type="hidden" name="hecho" value={md.hecho ? "1" : "0"} />
                            <button className={`boton mini${md.hecho ? "" : " borde"}`} aria-pressed={md.hecho}>
                              {md.hecho ? "✓ Completado" : "Marcar como completado"}
                            </button>
                          </form>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                          <div>
                            <p className="ceja" style={{ margin: "0 0 6px", fontSize: "0.8rem" }}>Clases</p>
                            {lineas(md.clases).length ? (
                              <ul style={{ margin: 0, paddingLeft: 20 }}>{lineas(md.clases).map((l, i) => <Linea key={i} texto={l} />)}</ul>
                            ) : (
                              <p className="apagado" style={{ margin: 0 }}>Sin clases en este módulo.</p>
                            )}
                          </div>
                          <div>
                            <p className="ceja" style={{ margin: "0 0 6px", fontSize: "0.8rem" }}>Materiales</p>
                            {lineas(md.materiales).length ? (
                              <ul style={{ margin: 0, paddingLeft: 20 }}>{lineas(md.materiales).map((l, i) => <Linea key={i} texto={l} />)}</ul>
                            ) : (
                              <p className="apagado" style={{ margin: 0 }}>Sin materiales en este módulo.</p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab === "eventos" && (
            <>
              <h2 className="h2" style={{ marginBottom: 8 }}>Eventos</h2>
              <p className="apagado" style={{ margin: "0 0 28px", maxWidth: 720 }}>
                Recordatorios de eventos puntuales de Bifröst y de los profesionales aliados. Se cargan en el calendario desde el panel del equipo.
              </p>
              <ListaEventos titulo="Gratuitos" eventos={eventos.filter((e) => e.tipo === "gratuito")} vacio="Todavía no hay eventos gratuitos cargados." />
              <ListaEventos titulo="Pagos" eventos={eventos.filter((e) => e.tipo === "pago")} vacio="Todavía no hay eventos pagos cargados." />
            </>
          )}
        </div>
      </section>
    </>
  );
}

function ListaEventos({ titulo, eventos, vacio }: { titulo: string; eventos: Evento[]; vacio: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: "1.4rem" }}>{titulo}</h3>
      {eventos.length === 0 ? (
        <p className="vacio">{vacio}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {eventos.map((e) => (
            <article key={e.id} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 22, borderRadius: 18, background: "var(--surface)", border: "1px solid var(--line)" }}>
              {e.imagen && <img src={e.imagen} alt="" className="foto-evento" loading="lazy" />}
              <span className={`tag ${e.tipo === "pago" ? "paid" : "free"}`}>{e.tipo === "pago" ? "Pago" : "Gratuito"}</span>
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{e.titulo}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>{rango(e.inicio, e.fin)}</p>
              <p className="apagado" style={{ margin: 0 }}>Organiza: {e.organiza}</p>
              {e.descripcion && <p className="apagado" style={{ margin: 0 }}>{e.descripcion}</p>}
              {e.tipo === "pago" && <p style={{ margin: 0, fontWeight: 600 }}>{e.precio_texto || "[PENDIENTE]"}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
