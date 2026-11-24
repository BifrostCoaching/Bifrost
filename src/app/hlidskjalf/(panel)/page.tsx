import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";

export default async function Resumen() {
  const { supabase } = await requireEquipo();
  const contar = async (tabla: string, filtro?: [string, string | boolean]) => {
    let q = supabase.from(tabla).select("id", { count: "exact", head: true });
    if (filtro) q = q.eq(filtro[0], filtro[1]);
    const { count } = await q;
    return count ?? 0;
  };
  const [talleres, nuevos, inscriptos, consultas] = await Promise.all([
    contar("talleres", ["publicado", true]),
    contar("interesados", ["estado", "nuevo"]),
    contar("interesados", ["estado", "inscripto"]),
    contar("consultas", ["leida", false]),
  ]);
  return (
    <>
      <h1>Resumen</h1>
      <p className="apagado">Lo más importante de un vistazo.</p>
      <div className="grilla" style={{ marginTop: "1.5rem" }}>
        <Link href="/hlidskjalf/talleres" className="tarjeta">
          <span className="ceja">Talleres publicados</span>
          <h2>{talleres}</h2>
        </Link>
        <Link href="/hlidskjalf/interesados" className="tarjeta">
          <span className="ceja">Interesados para contactar</span>
          <h2>{nuevos}</h2>
          <span className="apagado">{inscriptos} ya inscriptos</span>
        </Link>
        <Link href="/hlidskjalf/consultas" className="tarjeta">
          <span className="ceja">Consultas sin leer</span>
          <h2>{consultas}</h2>
        </Link>
      </div>
    </>
  );
}
