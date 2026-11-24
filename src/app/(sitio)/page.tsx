import Link from "next/link";
import { ArcosGrandes } from "@/components/Arcos";
import { Contacto } from "@/components/Contacto";
import { Portada } from "@/components/Portada";
import { talleresPublicados } from "@/lib/datos";
import { rango } from "@/lib/format";

export const revalidate = 60;

const PRONTO = [
  { titulo: "Profesionales", texto: "Los Vanir: coaches, asesores de imagen, contadores y otros profesionales que se suman a Bifröst con su oficio." },
];

export default async function Inicio() {
  const talleres = await talleresPublicados();
  const resumenTalleres =
    talleres.length > 0
      ? talleres.map((t) => `${t.nombre}, ${t.inicio ? rango(t.inicio, t.fin).toLowerCase() : "fecha [PENDIENTE]"}`).join(". ") + "."
      : "Los próximos talleres de Bifröst.";

  return (
    <>
      <Portada
        grande
        ceja="Coaching · Espacios de aprendizaje"
        titulo="Un puente entre donde estás y donde querés llegar."
        bajada="Creamos espacios de aprendizaje con mirada humana y empresarial, para que lo que aprendés se transforme en resultados concretos."
      >
        <div className="botones">
          <Link href="/que-hacemos" className="boton">
            Conocé qué hacemos
          </Link>
          <Link href="/talleres" className="boton borde">
            Ver talleres
          </Link>
        </div>
      </Portada>

      <section id="nombre" className="seccion sup">
        <div className="ancho" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 56 }}>
          <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", justifyContent: "center" }}>
            <ArcosGrandes />
          </div>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p className="ceja">Por qué Bifröst</p>
            <h2 className="h2">Un puente entre dos mundos</h2>
            <p className="apagado" style={{ margin: "0 0 16px", maxWidth: 640 }}>
              En la mitología nórdica, el Bifröst es el puente arcoíris que une dos mundos. Elegimos ese nombre porque es
              lo que queremos ser: un puente entre donde estás hoy y donde querés llegar.
            </p>
            <p className="apagado" style={{ margin: 0, maxWidth: 640 }}>
              Cada espacio que creamos es una parte de ese recorrido: mirar, aprender con otros y llevarlo a la acción.
            </p>
          </div>
        </div>
      </section>

      <section id="seguir" className="seccion">
        <div className="ancho">
          <p className="ceja">Seguí recorriendo</p>
          <h2 className="h2" style={{ marginBottom: 40 }}>
            ¿Por dónde querés empezar?
          </h2>
          <div className="fila">
            <Tarjeta href="/que-hacemos" titulo="Qué hacemos" texto="Nuestro enfoque, cómo trabajamos y los pilares en los que nos apoyamos." />
            <Tarjeta href="/servicios" titulo="Servicios" texto="Lo que Bifröst brinda en forma directa, más allá de los talleres." />
            <Tarjeta href="/talleres" titulo="Talleres" texto={resumenTalleres} />
            <Tarjeta href="/blog" titulo="Blog" texto="Pensamientos sobre lenguaje, emociones, liderazgo y aprendizaje." />
            <Tarjeta href="/calendario" titulo="Calendario" texto="Las próximas fechas y la proyección del año." />
            <Tarjeta href="/comunidad" titulo="Comunidad" texto="El foro para conversar y el muro donde cada persona cuenta lo que vivió." />
            <Tarjeta href="/campus" titulo="Campus" texto="Tu espacio personal: tu bosque de talleres, tu agenda y tus talleres." />
            <Tarjeta href="/dar-por-dar" titulo="Dar por dar" texto="Espacios comunitarios que se suman: refugios, comedores, grupos ambientales y más." />
            {PRONTO.map((p) => (
              <div key={p.titulo} className="card-link en-bg pronto">
                <span className="titulo">{p.titulo}</span>
                <span className="apagado">{p.texto}</span>
                <span className="entrar" style={{ color: "var(--muted)" }}>
                  Próximamente
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contacto />
    </>
  );
}

function Tarjeta({ href, titulo, texto }: { href: string; titulo: string; texto: string }) {
  return (
    <Link href={href} className="card-link en-bg">
      <span className="titulo">{titulo}</span>
      <span className="apagado">{texto}</span>
      <span className="entrar">Entrar →</span>
    </Link>
  );
}
