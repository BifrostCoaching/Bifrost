import type { Metadata } from "next";
import Link from "next/link";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { insignia } from "@/components/TarjetaTaller";
import { talleresPublicados } from "@/lib/datos";
import { rango } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "Qué hacemos" };

const PILARES = [
  ["Ontología del lenguaje", "Rafael Echeverría", "El lenguaje no solo describe la realidad: la genera. Cuando cambiamos nuestras conversaciones, cambian nuestras posibilidades de acción."],
  ["Biología del conocer", "Humberto Maturana", "Somos seres vivos que aprendemos en relación con otros. Las emociones definen qué acciones nos resultan posibles, y aprender necesita un espacio de aceptación y confianza."],
  ["Liderazgo", "Jim Selman y Peter Senge", "Entendemos el liderazgo como la capacidad de abrir posibilidades y de construir organizaciones que aprenden, donde las personas crecen junto con los resultados."],
  ["Pensamiento sistémico y comunicación humana", "Paul Watzlawick", "Todo comunica, incluso el silencio. Miramos a las personas y a los equipos como sistemas, donde cada parte afecta al conjunto."],
];

export default async function QueHacemos() {
  const talleres = await talleresPublicados();
  return (
    <>
      <Portada
        ceja="Qué hacemos"
        titulo="Espacios para aprender y llevarlo a la acción"
        bajada="Creamos espacios de aprendizaje con mirada humana y empresarial. Acá te contamos cómo los pensamos, cómo trabajamos y en qué nos apoyamos."
      />

      <section id="enfoque" className="seccion sup">
        <div className="ancho">
          <p className="ceja">Nuestro enfoque</p>
          <h2 className="h2" style={{ maxWidth: 860 }}>
            Aprender cambia la forma en que miramos. Y lo que miramos cambia lo que hacemos.
          </h2>
          <p className="apagado" style={{ margin: "0 0 56px", maxWidth: 720 }}>
            En Bifröst entendemos el coaching como la creación de espacios de aprendizaje. Trabajamos sobre cualquier tema
            que importe a las personas y a las organizaciones, con una condición: que lo aprendido se note en la práctica.
          </p>
          <div className="fila" style={{ gap: 24 }}>
            <div className="pilar" style={{ borderTop: "3px solid #8C2433" }}>
              <h3>Mirada humana</h3>
              <p className="apagado" style={{ margin: 0 }}>Cada persona es un observador único. Partimos de su historia, sus emociones y su manera de conversar.</p>
            </div>
            <div className="pilar" style={{ borderTop: "3px solid #1E7A64" }}>
              <h3>Mirada empresarial</h3>
              <p className="apagado" style={{ margin: 0 }}>Las organizaciones son redes de conversaciones y compromisos. Trabajamos para que esas redes funcionen mejor.</p>
            </div>
            <div className="pilar" style={{ borderTop: "3px solid #C9974A" }}>
              <h3>Resultados tangibles</h3>
              <p className="apagado" style={{ margin: 0 }}>Cada espacio termina en acciones concretas, que se pueden observar y sostener en el tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-trabajamos" className="seccion">
        <div className="ancho">
          <p className="ceja">Cómo trabajamos</p>
          <h2 className="h2" style={{ marginBottom: 56 }}>Del aprendizaje a la acción</h2>
          <ol className="pasos">
            <li className="paso" style={{ borderTop: "4px solid #8C2433" }}>
              <span className="num" style={{ color: "var(--step1)" }}>1</span>
              <h3 style={{ margin: 0 }}>Observar</h3>
              <p className="apagado" style={{ margin: 0 }}>Identificamos desde dónde estamos mirando la situación y qué queremos lograr.</p>
            </li>
            <li className="paso" style={{ borderTop: "4px solid #1E7A64" }}>
              <span className="num" style={{ color: "var(--step2)" }}>2</span>
              <h3 style={{ margin: 0 }}>Aprender en encuentros</h3>
              <p className="apagado" style={{ margin: 0 }}>Espacios grupales, prácticos y cercanos, donde la teoría se vuelve conversación.</p>
            </li>
            <li className="paso" style={{ borderTop: "4px solid #C9974A" }}>
              <span className="num" style={{ color: "var(--step3)" }}>3</span>
              <h3 style={{ margin: 0 }}>Llevar a la acción</h3>
              <p className="apagado" style={{ margin: 0 }}>Cada encuentro termina en compromisos concretos, para que el cambio se vea fuera del taller.</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="pilares" className="seccion banda">
        <div className="ancho">
          <p className="ceja">Nuestros pilares</p>
          <h2 className="h2">En qué nos apoyamos</h2>
          <p style={{ margin: "0 0 56px", color: "#C9D1D6", maxWidth: 720 }}>
            Nuestro trabajo se sostiene en corrientes que se complementan: el lenguaje, la biología, el liderazgo y la mirada sistémica.
          </p>
          <div className="fila" style={{ gap: 24 }}>
            {PILARES.map(([titulo, autor, texto], i) => (
              <div key={titulo} className="banda-card">
                <p className="titulo" style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "#E0B877" }}>0{i + 1}</p>
                <h3>{titulo}</h3>
                <p style={{ margin: 0, fontWeight: 600, color: "#8FD6CC" }}>{autor}</p>
                <p style={{ margin: 0, color: "#C9D1D6" }}>{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="ancho">
          <p className="ceja">Talleres</p>
          <h2 className="h2">Próximos talleres</h2>
          <p className="apagado" style={{ margin: "0 0 40px", maxWidth: 720 }}>El detalle, las fechas y la inscripción están en la página de cada taller.</p>
          <div className="fila" style={{ gap: 24 }}>
            {talleres.map((t) => (
              <Link key={t.id} href={`/talleres/${t.slug}`} className="card-link" style={{ flex: "1 1 420px" }}>
                <span className={insignia(t).cls}>{t.inicio ? rango(t.inicio, t.fin) : "Fecha [PENDIENTE]"}</span>
                <span className="titulo" style={{ fontSize: "1.6rem" }}>{t.nombre}</span>
                <span className="apagado">{t.bajada}</span>
                <span className="entrar">Ver el taller →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}
