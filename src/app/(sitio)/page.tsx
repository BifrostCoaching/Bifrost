import Link from "next/link";
import { ArcosPortada } from "@/components/Arcos";
import { Contacto } from "@/components/Contacto";
import { talleresPublicados } from "@/lib/datos";
import { rango } from "@/lib/format";

export const revalidate = 60;

export default async function Inicio() {
  const talleres = await talleresPublicados();
  return (
    <>
      <section className="portada">
        <ArcosPortada className="portada-arcos" />
        <div className="contenedor">
          <span className="ceja">Coaching · Espacios de aprendizaje</span>
          <h1>
            Un puente entre donde estás
            <br />y donde querés llegar.
          </h1>
          <p>
            Creamos espacios de aprendizaje con mirada humana y empresarial, para que lo que aprendés se transforme en
            resultados concretos.
          </p>
          <div className="botones">
            <Link href="/talleres" className="boton">
              Ver talleres
            </Link>
            <Link href="/calendario" className="boton secundario">
              Ver calendario
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor" style={{ maxWidth: 760 }}>
          <span className="ceja">Por qué Bifröst</span>
          <h2>Un puente entre dos mundos</h2>
          <p>
            En la mitología nórdica, el Bifröst es el puente arcoíris que une dos mundos. Elegimos ese nombre porque es
            lo que queremos ser: un puente entre donde estás hoy y donde querés llegar.
          </p>
          <p>Cada espacio que creamos es una parte de ese recorrido: mirar, aprender con otros y llevarlo a la acción.</p>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: 0 }}>
        <div className="contenedor">
          <span className="ceja">Cómo trabajamos</span>
          <h2>Tres pasos, un mismo recorrido</h2>
          <div className="pasos" style={{ marginTop: "1.5rem" }}>
            <div className="paso">
              <h3>1. Observar</h3>
              <p className="apagado">Desde dónde miramos la situación y qué queremos lograr.</p>
            </div>
            <div className="paso">
              <h3>2. Aprender en encuentros</h3>
              <p className="apagado">Espacios grupales, prácticos y cercanos, donde aprendemos con otros.</p>
            </div>
            <div className="paso">
              <h3>3. Llevar a la acción</h3>
              <p className="apagado">Compromisos concretos y resultados que se pueden ver.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: 0 }}>
        <div className="contenedor">
          <span className="ceja">Talleres</span>
          <h2>Próximos talleres</h2>
          {talleres.length === 0 ? (
            <p className="apagado">Pronto vas a ver acá los próximos talleres.</p>
          ) : (
            <div className="grilla" style={{ marginTop: "1.5rem" }}>
              {talleres.map((t) => (
                <Link key={t.id} href={`/talleres/${t.slug}`} className="tarjeta">
                  <span className="insignia">{rango(t.inicio, t.fin)}</span>
                  <h3>{t.nombre}</h3>
                  <p className="apagado" style={{ margin: 0 }}>
                    {t.bajada}
                  </p>
                  <span className="entrar">Ver el taller →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Contacto talleres={talleres.map((t) => t.nombre)} />
    </>
  );
}
