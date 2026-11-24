import Link from "next/link";

export default function NoEncontrado() {
  return (
    <section className="seccion">
      <div className="contenedor" style={{ maxWidth: 640 }}>
        <h1>No encontramos esta página</h1>
        <p className="apagado">Puede que el enlace haya cambiado o que el taller ya no esté publicado.</p>
        <Link href="/" className="boton">
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
