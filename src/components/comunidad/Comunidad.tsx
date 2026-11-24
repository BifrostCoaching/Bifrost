"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { abrirTema, borrar, colgarSueno, dejarExperiencia, enviarReflexion, type EstadoCom } from "@/app/(sitio)/comunidad/acciones";
import type { Comunidad as Datos } from "@/lib/datos";
import { ArbolYggdrasil } from "./ArbolYggdrasil";
import { NENUFARES } from "./Nenufares";

export type Seccion = "arbol" | "muro" | "mimir" | "foro";

const SLOTS = [[50.2,17.1],[17.2,57.1],[83.2,57.1],[91.5,7.1],[9.0,7.1],[50.2,57.1],[25.5,27.1],[75.0,27.1],[50.2,37.1],[25.5,7.1],[75.0,7.1],[9.0,27.1],[91.5,27.1],[33.7,57.1],[66.7,57.1],[58.5,7.1],[58.5,27.1],[91.5,47.1],[42.0,7.1],[17.2,17.1],[33.7,17.1],[66.7,17.1],[83.2,17.1],[42.0,27.1],[17.2,37.1],[33.7,37.1],[66.7,37.1],[83.2,37.1],[9.0,47.1],[25.5,47.1],[42.0,47.1],[58.5,47.1],[75.0,47.1]];
const ROT = [-2,1,-1,2,0,-1,1,-2,2,-1,-2,1,-1,2,0,-1,1,-2,2,-1,-2,1,-1,2,0,-1,1,-2,2,-1,-2,1,-1];
const PERCHES = [[37.6, 39.4], [48.6, 35.5], [59.1, 28.5], [65.2, 44.9], [50, 59.3]];
const PHRASES = ["No hay sueños ni muy grandes ni muy chicos.", "Cada hoja empezó siendo una pregunta.", "Lo que nombrás empieza a existir.", "Las raíces sostienen lo que las ramas sueñan.", "Un sueño compartido llega más lejos.", "Sin apuro: el árbol crece de a poco.", "Soñar también es un compromiso con vos."];
const PIEDRAS = [[56.8, 54.6, -10], [43.0, 46.1, -24], [43.9, 20.6, -19], [56.0, 80.5, 25], [81.9, 45.7, -23], [31.6, 47.3, 6], [44.6, 82.5, 8], [17.5, 50.5, -21], [70.3, 84.3, -10], [69.2, 45.5, 28], [69.8, 12.3, -9], [31.4, 82.8, -28], [92.1, 45.9, 5], [55.9, 16.2, -19], [32.2, 12.6, 8], [6.0, 87.6, -11], [6.1, 17.3, 15], [80.4, 12.0, 13], [80.9, 86.9, -6], [7.2, 51.6, 20], [17.5, 78.9, 9], [92.6, 82.7, -23], [19.9, 13.6, 19], [94.0, 13.6, -20]];
const RUNAS: [string, string][] = [["Fehu", "M3 1V17M3 4L9 1M3 8L9 5"], ["Uruz", "M3 17V1L9 5V17"], ["Thurisaz", "M3 1V17M3 5L8 9L3 13"], ["Ansuz", "M3 1V17M3 1L9 5M3 6L9 10"], ["Raidho", "M3 17V1L8 4.5L3 8.5L9 17"], ["Kenaz", "M8 2L3 9L8 16"], ["Gebo", "M2 2L10 16M10 2L2 16"], ["Wunjo", "M3 1V17M3 1L8 5L3 9"], ["Hagalaz", "M3 1V17M9 1V17M3 6L9 11"], ["Naudiz", "M6 1V17M3 7L9 11"], ["Isa", "M6 1V17"], ["Jera", "M5 3L2 7L5 11M7 7L10 11L7 15"], ["Eihwaz", "M6 1V17M6 1L9 4M6 17L3 14"], ["Perthro", "M3 1V17M3 1L7 4L9 2M3 17L7 14L9 16"], ["Algiz", "M6 1V17M6 8L2 3M6 8L10 3"], ["Sowilo", "M8 1L3 6L9 12L4 17"], ["Tiwaz", "M6 1V17M2 6L6 1L10 6"], ["Berkano", "M3 1V17M3 1L8 5L3 9L8 13L3 17"], ["Ehwaz", "M2 17V1L6 6L10 1V17"], ["Mannaz", "M2 17V1L10 9M10 17V1L2 9"], ["Laguz", "M3 17V1L9 6"], ["Ingwaz", "M6 2L10 9L6 16L2 9Z"], ["Dagaz", "M2 1V17L10 1V17L2 1"], ["Othala", "M2 17L9 9L6 2L3 9L10 17"]];
const PADV = [[250, 0, -4], [270, 46, 3], [330, 14, -2], [270, 60, 5], [250, 8, -3], [330, 36, 2], [250, 22, -5], [270, 52, 4]];
const LEAFV: [string, number, number][] = [["#4B7A4F", -6, 0], ["#866A2A", 4, 40], ["#7A2E3A", -2, 12], ["#3F6B57", 6, 56], ["#7A6026", -4, 20], ["#6B2A36", 3, 48]];

const TABS: [Seccion, string, string][] = [
  ["arbol", "Yggdrasil", ""],
  ["muro", "El pozo de Urd", "· Experiencias"],
  ["mimir", "El pozo de Mímir", "· Reflexiones"],
  ["foro", "Hvergelmir", "· Foro"],
];

type Props = { datos: Datos; mios: string[]; equipo: boolean; talleres: string[]; inicial: Seccion };

export function Comunidad({ datos, mios, equipo, talleres, inicial }: Props) {
  const [tab, setTab] = useState<Seccion>(inicial);
  const puede = (id: string) => equipo || mios.includes(id);

  function elegir(s: Seccion) {
    setTab(s);
    const url = new URL(window.location.href);
    url.searchParams.set("seccion", s);
    window.history.replaceState(null, "", url);
  }

  return (
    <section id="comunidad" className="seccion">
      <div className="ancho">
        {equipo && (
          <p className="vacio" style={{ marginBottom: 16, borderStyle: "solid" }}>
            Modo equipo activo: podés retirar cualquier tema, nenúfar u hoja. Las reflexiones nuevas se aprueban desde el panel.
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }} role="group" aria-label="Elegir sección">
          {TABS.map(([id, nombre, sub]) => (
            <button key={id} type="button" className={`chip${tab === id ? " on" : ""}`} aria-pressed={tab === id} onClick={() => elegir(id)}>
              {nombre} {sub && <span style={{ fontWeight: 500, opacity: 0.72 }}>&nbsp;{sub}</span>}
            </button>
          ))}
        </div>
        {tab === "arbol" && <Yggdrasil datos={datos} puede={puede} />}
        {tab === "muro" && <PozoDeUrd datos={datos} puede={puede} talleres={talleres} />}
        {tab === "mimir" && <PozoDeMimir datos={datos} />}
        {tab === "foro" && <Hvergelmir datos={datos} puede={puede} />}
      </div>
    </section>
  );
}

function Encabezado({ ceja, titulo, texto, children }: { ceja: string; titulo: string; texto: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
      <div>
        <p className="ceja" style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "0.8rem" }}>{ceja}</p>
        <h2 className="h2" style={{ marginBottom: 8 }}>{titulo}</h2>
        <p className="apagado" style={{ margin: 0, maxWidth: 680 }}>{texto}</p>
      </div>
      {children}
    </div>
  );
}

function Borrar({ tabla, id, etiqueta = "Eliminar" }: { tabla: string; id: string; etiqueta?: string }) {
  return (
    <form action={borrar} style={{ display: "inline" }}>
      <input type="hidden" name="tabla" value={tabla} />
      <input type="hidden" name="id" value={id} />
      <button className="mini-borrar">{etiqueta}</button>
    </form>
  );
}

function Trampa() {
  return (
    <div className="trampa" aria-hidden="true">
      <input name="sitio_web" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function Aviso({ estado }: { estado: EstadoCom }) {
  if (!estado?.mensaje) return null;
  return (
    <p role="status" style={{ margin: 0, fontWeight: 600, color: estado.ok ? "var(--green-text)" : "var(--error-tx)" }}>
      {estado.mensaje}
    </p>
  );
}

/** Limpia el formulario cuando se guardó bien. */
function useLimpiar(estado: EstadoCom) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (estado?.ok) ref.current?.reset();
  }, [estado]);
  return ref;
}

// ───────── Yggdrasil ─────────
function Yggdrasil({ datos, puede }: { datos: Datos; puede: (id: string) => boolean }) {
  const [n, setN] = useState(0);
  const [estado, accion, enviando] = useActionState(colgarSueno, null);
  const form = useLimpiar(estado);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((x) => x + 1), 6000);
    return () => clearInterval(t);
  }, []);
  const perch = PERCHES[n % PERCHES.length];
  const prev = PERCHES[(n + PERCHES.length - 1) % PERCHES.length];
  const hojas = datos.suenos.slice(-SLOTS.length);

  return (
    <>
      <p className="ceja" style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "0.8rem" }}>Árbol común</p>
      <h2 className="h2" style={{ marginBottom: 8 }}>Yggdrasil</h2>
      <p className="apagado" style={{ margin: "0 0 24px", maxWidth: 680 }}>
        El árbol que une los mundos, y el nuestro también. Una sola pregunta para toda la comunidad: cada respuesta se cuelga como una hoja, y el árbol se va llenando de a poco.
      </p>
      <div style={{ overflowX: "auto" }}>
        <div style={{ position: "relative", minWidth: 1000, maxWidth: 1000, margin: "0 auto", aspectRatio: "1000 / 700" }}>
          <ArbolYggdrasil />
          {hojas.map((h, i) => {
            const slot = SLOTS[i % SLOTS.length];
            return (
              <div
                key={h.id}
                className="leaf"
                style={{ left: `${slot[0]}%`, top: `${slot[1]}%`, borderColor: "#1E6B5A", background: "#1E6B5A", color: "#FFFFFF", transform: `translate(-50%, -50%) rotate(${ROT[i % ROT.length]}deg)` }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 3, fill: "#A8DCCD" }}>
                  <path d="M4 20C4 11 10 5 20 4c-1 10-7 16-16 16z" />
                </svg>
                <span>
                  <span style={{ display: "block", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#CFE8DF" }}>Sueño con</span>
                  {h.texto}
                </span>
                {puede(h.id) && (
                  <form action={borrar} style={{ display: "contents" }}>
                    <input type="hidden" name="tabla" value="suenos" />
                    <input type="hidden" name="id" value={h.id} />
                    <button className="leaf-x" aria-label="Eliminar esta hoja">×</button>
                  </form>
                )}
              </div>
            );
          })}
          <div className="rata" style={{ left: `${perch[0]}%`, top: `${perch[1]}%` }}>
            <div key={n} className="globo" role="status" aria-live="polite">
              <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--eyebrow)" }}>Ratatoskr</span>
              {PHRASES[n % PHRASES.length]}
            </div>
            <svg className={perch[0] < prev[0] ? "flip" : ""} width="58" height="50" viewBox="0 0 64 56" aria-hidden="true">
              <path d="M22 49 C5 47 -1 27 10 13 C19 2 36 7 33 19 C31 27 21 25 22 18 C14 28 21 40 27 48 Z" fill="#C98A45" />
              <path d="M14 16 C18 10 26 9 29 15" fill="none" stroke="#E8C79A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <ellipse cx="35" cy="38" rx="12" ry="13" fill="#B5773A" />
              <ellipse cx="39" cy="41" rx="6" ry="8.5" fill="#E8C79A" />
              <circle cx="45" cy="23" r="9" fill="#B5773A" />
              <path d="M41 16 L44 6 L48 16 Z" fill="#B5773A" />
              <path d="M43 14 L44.5 9 L46.5 14 Z" fill="#E8C79A" />
              <circle cx="48.5" cy="22" r="1.7" fill="#14213D" />
              <circle cx="53.6" cy="25.5" r="1.3" fill="#14213D" />
              <ellipse cx="47" cy="36" rx="4" ry="3" fill="#B5773A" />
              <ellipse cx="34" cy="51" rx="9" ry="3" fill="#9E652F" />
            </svg>
          </div>
          <div className="titulo" style={{ position: "absolute", left: "50%", top: "74.4%", transform: "translate(-50%, -50%)", padding: "14px 28px", borderRadius: 999, background: "var(--bg)", border: "2px solid var(--eyebrow)", fontWeight: 700, fontSize: "1.35rem", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,.2)" }}>
            Sueño con…
          </div>
        </div>
      </div>
      <form ref={form} action={accion} style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16, marginTop: 28, padding: 24, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
        <div className="campo" style={{ flex: "1 1 420px" }}>
          <label htmlFor="s-texto" className="titulo" style={{ fontWeight: 700, fontSize: "1.3rem" }}>Sueño con…</label>
          <input id="s-texto" name="texto" type="text" maxLength={60} required />
        </div>
        <Trampa />
        <button className="boton" disabled={enviando}>{enviando ? "Colgando…" : "Colgar mi sueño"}</button>
        <div style={{ flexBasis: "100%" }}><Aviso estado={estado} /></div>
      </form>
    </>
  );
}

// ───────── El pozo de Urd ─────────
function PozoDeUrd({ datos, puede, talleres }: { datos: Datos; puede: (id: string) => boolean; talleres: string[] }) {
  const [estado, accion, enviando] = useActionState(dejarExperiencia, null);
  const form = useLimpiar(estado);
  return (
    <>
      <Encabezado
        ceja="Muro de experiencias"
        titulo="El pozo de Urd"
        texto="Junto al pozo de Urd, las nornas riegan cada día las raíces de Yggdrasil. Acá cada persona deja flotando lo que vivió, lo que se llevó y lo que cambió después: lo vivido que sostiene lo que viene."
      >
        <a href="#sumar" className="boton">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          Dejá tu experiencia
        </a>
      </Encabezado>
      <div style={{ position: "relative", overflow: "hidden", padding: "48px 32px 64px", borderRadius: 28, border: "1px solid var(--line)", background: "radial-gradient(ellipse 60% 45% at 25% 20%, var(--pond-glow), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 85%, var(--pond-glow), transparent 70%), linear-gradient(170deg, var(--pond-a), var(--pond-b))" }}>
        {[[12, 18, 0], [78, 30, 2.5], [40, 82, 5], [88, 76, 1.2], [24, 58, 3.7]].map(([l, t, d]) => (
          <span key={l} className="ripple" aria-hidden="true" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `-${d}s` }} />
        ))}
        {datos.experiencias.length === 0 && (
          <p style={{ position: "relative", margin: 0, textAlign: "center", color: "var(--pad-text)" }}>El pozo está quieto. Dejá la primera experiencia.</p>
        )}
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: "18px 34px" }}>
          {datos.experiencias.map((e, i) => {
            const v = PADV[i % 8];
            const largo = e.texto.length > 90;
            return (
              <article key={e.id} className="pad" style={{ ["--r" as string]: `${v[2]}deg`, animationDelay: `-${(i * 1.3).toFixed(1)}s`, width: largo ? 330 : v[0], marginTop: v[1], position: "relative", flex: "0 0 auto", maxWidth: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {NENUFARES[i % 8]}
                <div style={{ position: "relative", width: "64%", textAlign: "center", color: "var(--pad-text)" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--pad-label)" }}>{e.tipo}</p>
                  <p className="titulo" style={{ margin: "0 0 10px", fontSize: largo ? "0.98rem" : "1.05rem", lineHeight: 1.38, fontWeight: 500 }}>{e.texto}</p>
                  <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.85 }}>{e.nombre}{e.taller ? ` · ${e.taller}` : ""}</p>
                  {puede(e.id) && <div style={{ marginTop: 10 }}><Borrar tabla="experiencias" id={e.id} /></div>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <form ref={form} id="sumar" action={accion} className="form" style={{ marginTop: 40, padding: 32, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
        <p className="todo" style={{ margin: 0, fontWeight: 700, fontSize: "1.3rem" }}>Dejá tu experiencia</p>
        <div className="campo"><label htmlFor="e-nombre">Nombre</label><input id="e-nombre" name="nombre" autoComplete="name" maxLength={80} /></div>
        <div className="campo">
          <label htmlFor="e-taller">Taller</label>
          <select id="e-taller" name="taller">
            {talleres.map((t) => <option key={t}>{t}</option>)}
            <option>Otro espacio de Bifröst</option>
          </select>
        </div>
        <div className="campo todo">
          <label htmlFor="e-tipo">Tipo de nota</label>
          <select id="e-tipo" name="tipo">
            <option>Lo que me llevé</option>
            <option>Lo que cambió después</option>
            <option>Una palabra para el taller</option>
            <option>Mi resultado</option>
          </select>
        </div>
        <div className="campo todo"><label htmlFor="e-texto">Tu experiencia</label><textarea id="e-texto" name="texto" rows={4} maxLength={220} required /></div>
        <Trampa />
        <div className="todo" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
          <button className="boton" disabled={enviando}>{enviando ? "Guardando…" : "Dejar mi experiencia"}</button>
          <Aviso estado={estado} />
        </div>
        <p className="todo apagado" style={{ margin: 0, fontSize: "0.92rem" }}>Podés eliminar lo que dejaste vos desde este mismo navegador. El equipo de Bifröst puede retirar lo que no respete las normas de convivencia.</p>
      </form>
    </>
  );
}

// ───────── El pozo de Mímir ─────────
function PozoDeMimir({ datos }: { datos: Datos }) {
  const todas = datos.reflexiones;
  const vuelta = todas.length ? Math.floor((todas.length - 1) / 24) : 0;
  const enPozo = todas.slice(vuelta * 24);
  const [sel, setSel] = useState(enPozo.length - 1);
  const rsel = enPozo[sel];
  const [estado, accion, enviando] = useActionState(enviarReflexion, null);
  const form = useLimpiar(estado);

  return (
    <>
      <Encabezado
        ceja="Reflexiones de la comunidad"
        titulo="El pozo de Mímir"
        texto="Odín entregó un ojo para beber del pozo de la sabiduría. Acá cada reflexión que comparte la comunidad deja una runa en el fondo del agua. Aparecen en orden hasta completar las 24 del alfabeto rúnico, y ahí el pozo vuelve a empezar. Tocá una runa para leer su reflexión."
      />
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid var(--line)", background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(120,170,190,.14), transparent 70%), linear-gradient(180deg, var(--mimir-a), var(--mimir-b))" }}>
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="piedra-g" cx="38%" cy="32%" r="75%">
              <stop offset="0" stopColor="#7C8A90" />
              <stop offset="0.55" stopColor="#4E5A61" />
              <stop offset="1" stopColor="#2C353B" />
            </radialGradient>
          </defs>
        </svg>
        <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 520", minHeight: 340 }}>
          {enPozo.length === 0 && (
            <p style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", margin: 0, width: "min(420px, 80%)", textAlign: "center", color: "rgba(255,255,255,.7)" }}>
              El pozo espera su primera piedra. Cuando se publique la primera reflexión, su runa va a aparecer en el fondo del agua.
            </p>
          )}
          <div role="group" aria-label="Piedras rúnicas del pozo de Mímir" style={{ position: "absolute", inset: 0 }}>
            {enPozo.map((r, k) => (
              <button
                key={r.id}
                type="button"
                className={`runa${k === sel ? " on" : ""}`}
                style={{ left: `${PIEDRAS[k][0]}%`, top: `${PIEDRAS[k][1]}%`, ["--rot" as string]: `${PIEDRAS[k][2]}deg`, animationDelay: `-${(k * 0.7).toFixed(1)}s` }}
                aria-pressed={k === sel}
                aria-label={`Runa ${RUNAS[k][0]}: ${r.titulo || "Reflexión"}`}
                onClick={() => setSel(k)}
              >
                <svg viewBox="0 0 64 88" aria-hidden="true" style={{ width: "100%", height: "100%", overflow: "visible", transform: "rotate(var(--rot))" }}>
                  <ellipse cx="32" cy="44" rx="30" ry="42" fill="url(#piedra-g)" className="piedra" />
                  <ellipse cx="24" cy="26" rx="12" ry="7" fill="rgba(255,255,255,.10)" transform="rotate(-25 24 26)" />
                  <g transform="translate(16 17) scale(2.7)">
                    <path d={RUNAS[k][1]} className="trazo" fill="none" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </button>
            ))}
          </div>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.04) 0 2px, transparent 2px 26px), linear-gradient(180deg, rgba(40,90,110,.18), rgba(5,15,20,.25))" }} />
          <p style={{ position: "absolute", right: 24, bottom: 16, margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,.7)" }}>
            {enPozo.length} de 24 runas{vuelta > 0 ? ` · vuelta ${vuelta + 1}` : ""}
          </p>
        </div>
      </div>
      {rsel && (
        <article style={{ display: "flex", gap: 22, alignItems: "flex-start", marginTop: 24, padding: 26, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <svg viewBox="0 0 12 18" width="44" height="66" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 auto", stroke: "var(--eyebrow)" }}>
            <path d={RUNAS[sel][1]} />
          </svg>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700, color: "var(--eyebrow)" }}>{RUNAS[sel][0]}</p>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.4rem", lineHeight: 1.25, fontWeight: 600 }}>{rsel.titulo || "Reflexión"}</h3>
            <p className="preline" style={{ margin: "0 0 10px" }}>{rsel.texto}</p>
            <p className="apagado" style={{ margin: 0, fontSize: "0.95rem" }}>{rsel.nombre || "Anónimo"}</p>
          </div>
        </article>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start", marginTop: 36 }}>
        <form ref={form} action={accion} style={{ flex: "2 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16, padding: 28, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem" }}>Dejá tu reflexión en el pozo</p>
          <div className="campo"><label htmlFor="r-nombre">Nombre (opcional)</label><input id="r-nombre" name="nombre" maxLength={80} /></div>
          <div className="campo"><label htmlFor="r-titulo">Título</label><input id="r-titulo" name="titulo" maxLength={120} /></div>
          <div className="campo"><label htmlFor="r-texto">Tu reflexión</label><textarea id="r-texto" name="texto" rows={5} maxLength={3000} required /></div>
          <Trampa />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <button className="boton" disabled={enviando}>{enviando ? "Enviando…" : "Enviar para revisión"}</button>
            <Aviso estado={estado} />
          </div>
          <p className="apagado" style={{ margin: 0, fontSize: "0.92rem" }}>El equipo la lee antes de publicarla. Cuando se aprueba, aparece su runa en el fondo del pozo.</p>
        </form>
        <div style={{ flex: "1 1 300px", minWidth: 0, padding: 24, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "1.1rem" }}>Todas las reflexiones</p>
          {todas.length === 0 && <p className="apagado" style={{ margin: 0 }}>Todavía no hay reflexiones publicadas.</p>}
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {todas.map((r, i) => (
              <li key={r.id} style={{ paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{r.titulo || "Reflexión"}</p>
                <p className="apagado" style={{ margin: 0, fontSize: "0.9rem" }}>{RUNAS[i % 24][0]} · {r.nombre || "Anónimo"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// ───────── Hvergelmir ─────────
function Hvergelmir({ datos, puede }: { datos: Datos; puede: (id: string) => boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, enviando] = useActionState(abrirTema, null);
  const form = useLimpiar(estado);
  useEffect(() => {
    if (estado?.ok) setAbierto(false);
  }, [estado]);

  return (
    <>
      <Encabezado
        ceja="Foro"
        titulo="Hvergelmir"
        texto="En el mito, Hvergelmir es el manantial que hierve y del que nacen todos los ríos. Acá nacen las conversaciones de la comunidad: sobre los temas que nos atraviesan, con respeto y escucha."
      >
        <button type="button" className="boton" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto}>Nuevo tema</button>
      </Encabezado>
      {abierto && (
        <form ref={form} action={accion} className="form" style={{ marginBottom: 24, padding: 28, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <p className="todo" style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem" }}>Nuevo tema</p>
          <div className="campo">
            <label htmlFor="f-tema">Tema</label>
            <select id="f-tema" name="tema">
              {["General", "Imagen", "Presupuesto", "Liderazgo", "Emociones", "Lenguaje"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="campo"><label htmlFor="f-nombre">Tu nombre</label><input id="f-nombre" name="nombre" autoComplete="name" maxLength={80} /></div>
          <div className="campo todo"><label htmlFor="f-titulo">Título</label><input id="f-titulo" name="titulo" maxLength={70} required /></div>
          <div className="campo todo"><label htmlFor="f-texto">¿Qué querés conversar?</label><textarea id="f-texto" name="texto" rows={3} maxLength={2000} /></div>
          <Trampa />
          <div className="todo" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button className="boton" disabled={enviando}>{enviando ? "Publicando…" : "Publicar tema"}</button>
            <button type="button" className="boton borde chico" onClick={() => setAbierto(false)}>Cancelar</button>
          </div>
        </form>
      )}
      <div style={{ marginBottom: 12 }}><Aviso estado={estado} /></div>
      <div style={{ position: "relative", overflow: "hidden", padding: "44px 28px 60px", borderRadius: 28, border: "1px solid var(--line)", background: "radial-gradient(ellipse 55% 40% at 70% 15%, var(--pond-glow), transparent 70%), linear-gradient(170deg, var(--hv-a), var(--hv-b))" }}>
        {[[8, 0, 8], [21, 3.1, 6], [37, 6.2, 10], [52, 1.4, 7], [66, 4.6, 9], [81, 2.3, 6], [93, 7.4, 8]].map(([l, d, s]) => (
          <span key={l} className="burbuja" aria-hidden="true" style={{ left: `${l}%`, animationDelay: `-${d}s`, width: s, height: s }} />
        ))}
        {datos.foro.length === 0 && <p style={{ position: "relative", margin: 0, textAlign: "center", color: "#FBF6E8" }}>Todavía no hay temas. Abrí el primero.</p>}
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: "22px 30px" }}>
          {datos.foro.map((f, i) => {
            const v = LEAFV[i % LEAFV.length];
            return (
              <article key={f.id} className="hoja-f" title={f.texto || undefined} style={{ ["--r" as string]: `${v[1]}deg`, animationDelay: `-${(i * 1.7).toFixed(1)}s`, marginTop: v[2], position: "relative", flex: "0 0 auto", width: 360, maxWidth: "100%", aspectRatio: "2 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 200 100" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", transform: i % 2 === 1 ? "scaleX(-1)" : undefined }}>
                  <path d="M2 50 L14 50" style={{ stroke: "var(--tree)", strokeWidth: 2.4, strokeLinecap: "round" }} />
                  <path d="M12 50 C 46 6, 146 0, 196 50 C 146 100, 46 94, 12 50 Z" style={{ fill: v[0], stroke: "rgba(255,255,255,.18)", strokeWidth: 1 }} />
                  <g style={{ stroke: "rgba(255,255,255,.16)", strokeWidth: 0.9, fill: "none" }}>
                    <path d="M14 50 Q 100 46 192 50" /><path d="M40 49 Q 54 38 66 29" /><path d="M40 51 Q 54 62 66 71" /><path d="M70 49 Q 84 38 96 26" /><path d="M70 51 Q 84 62 96 74" /><path d="M100 49 Q 114 38 126 22" /><path d="M100 51 Q 114 62 126 78" /><path d="M130 49 Q 144 38 156 26" /><path d="M130 51 Q 144 62 156 74" />
                  </g>
                </svg>
                <div style={{ position: "relative", width: "62%", textAlign: "center", color: "#FBF6E8" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F1D79A" }}>{f.tema}</p>
                  <p className="titulo" style={{ margin: "0 0 4px", fontSize: "1rem", lineHeight: 1.3, fontWeight: 600 }}>{f.titulo}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.85 }}>{f.nombre || "Anónimo"}</p>
                  {puede(f.id) && <div style={{ marginTop: 6 }}><Borrar tabla="foro" id={f.id} /></div>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
