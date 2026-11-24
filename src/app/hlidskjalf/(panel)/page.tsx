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
  const [talleres, confirmadas, pendientes, consultas] = await Promise.all([
    contar("talleres", ["publicado", true]),
    contar("inscripciones", ["estado", "confirmada"]),
    contar("inscripciones", ["estado", "pendiente_pago"]),
    contar("consultas", ["leida", false]),
  ]);
  return (
    <>
      <span className="ceja">Panel del equipo</span>
      <h1>Hliðskjálf</h1>
      <p className="apagado">Desde acá cargás y editás el contenido del sitio sin tocar el código.</p>
      <div className="grilla" style={{ marginTop: "1.5rem" }}>
        <Link href="/hlidskjalf/talleres" className="tarjeta">
          <span className="ceja">Talleres publicados</span>
          <h2>{talleres}</h2>
        </Link>
        <Link href="/hlidskjalf/inscripciones" className="tarjeta">
          <span className="ceja">Inscripciones confirmadas</span>
          <h2>{confirmadas}</h2>
          <span className="apagado">{pendientes} con pago pendiente</span>
        </Link>
        <Link href="/hlidskjalf/consultas" className="tarjeta">
          <span className="ceja">Consultas sin leer</span>
          <h2>{consultas}</h2>
        </Link>
      </div>
    </>
  );
}
