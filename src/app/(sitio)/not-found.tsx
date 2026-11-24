import Link from "next/link";
import { Portada } from "@/components/Portada";

export default function NoEncontrado() {
  return (
    <Portada ceja="Página no encontrada" titulo="Este puente no lleva a ningún lado" bajada="Puede que el enlace haya cambiado o que el taller ya no esté publicado.">
      <div className="botones" style={{ marginTop: 32 }}>
        <Link href="/" className="boton">Ir al inicio</Link>
      </div>
    </Portada>
  );
}
