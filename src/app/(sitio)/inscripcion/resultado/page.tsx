import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Inscripción", robots: { index: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Mercado Pago vuelve acá después del pago. Este mensaje es solo informativo:
 * la inscripción se confirma cuando llega el aviso firmado de Mercado Pago al servidor.
 */
export default async function Resultado({ searchParams }: Props) {
  const sp = await searchParams;
  const tipo = String(sp.tipo ?? "");
  const estado = String(sp.collection_status ?? sp.status ?? "");

  let titulo: string;
  let texto: string;
  if (tipo === "gratuito") {
    titulo = "¡Listo, ya estás inscripto!";
    texto = "Te escribimos por email con los detalles del taller.";
  } else if (estado === "approved") {
    titulo = "¡Gracias! Recibimos tu pago.";
    texto = "Tu lugar quedó reservado. Te escribimos por email con los detalles del taller.";
  } else if (estado === "pending" || estado === "in_process") {
    titulo = "Tu pago está en proceso.";
    texto = "Cuando Mercado Pago lo acredite, tu inscripción queda confirmada. No hace falta que hagas nada más.";
  } else {
    titulo = "El pago no se completó.";
    texto = "No se hizo ningún cobro. Podés volver a intentarlo o escribirnos si necesitás otra forma de pago.";
  }

  return (
    <section className="seccion">
      <div className="contenedor" style={{ maxWidth: 640 }}>
        <span className="ceja">Inscripción</span>
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <div className="botones">
          <Link href="/talleres" className="boton">
            Volver a los talleres
          </Link>
          <Link href="/#contacto" className="boton secundario">
            Escribirnos
          </Link>
        </div>
      </div>
    </section>
  );
}
