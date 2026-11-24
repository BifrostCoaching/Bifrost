import Link from "next/link";
import { requireEquipo } from "@/lib/supabase/equipo";
import { borrarFrase, guardarFrase } from "../../../acciones";

type Frase = { id: string; texto: string; orden: number; activa: boolean };

export default async function FrasesRatatoskr() {
  const { supabase } = await requireEquipo();
  const { data, error } = await supabase.from("frases_ratatoskr").select("id, texto, orden, activa").order("orden").order("created_at");
  const frases = (data ?? []) as Frase[];

  return (
    <>
      <p>
        <Link href="/hlidskjalf/comunidad">← Comunidad</Link>
      </p>
      <h1>Frases de Ratatoskr</h1>
      <p className="apagado">
        Son las frases que dice la ardilla en Yggdrasil, una cada 6 segundos, en el orden de la lista. Si destildás &quot;Activa&quot;, la
        frase queda guardada pero no se muestra. Si no hay ninguna activa, la ardilla usa las frases de siempre.
      </p>
      {error && (
        <p className="aviso error" role="status">
          Falta crear la tabla de frases: corré el archivo 03-frases-ratatoskr.sql en Supabase &gt; SQL Editor.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "1.5rem 0" }}>
        {frases.map((f) => (
          <div key={f.id} className="caja" style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 12 }}>
            <form action={guardarFrase} className="form" style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 12, flex: "1 1 520px", margin: 0 }}>
              <input type="hidden" name="id" value={f.id} />
              <label style={{ flex: "1 1 320px" }}>
                Frase
                <input name="texto" required maxLength={140} defaultValue={f.texto} />
              </label>
              <label style={{ width: 90 }}>
                Orden
                <input name="orden" type="number" defaultValue={f.orden} />
              </label>
              <label className="check" style={{ paddingBottom: 10 }}>
                <input name="activa" type="checkbox" defaultChecked={f.activa} /> Activa
              </label>
              <button className="boton chico">Guardar</button>
            </form>
            <form action={borrarFrase}>
              <input type="hidden" name="id" value={f.id} />
              <button className="boton peligro chico">Borrar</button>
            </form>
          </div>
        ))}
      </div>

      {!error && (
        <form action={guardarFrase} className="form caja">
          <h2 style={{ margin: 0 }}>Nueva frase</h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 12 }}>
            <label style={{ flex: "1 1 320px" }}>
              Frase <small>(hasta 140 letras)</small>
              <input name="texto" required maxLength={140} />
            </label>
            <label style={{ width: 90 }}>
              Orden
              <input name="orden" type="number" defaultValue={(frases.at(-1)?.orden ?? 0) + 1} />
            </label>
            <input type="hidden" name="activa" value="on" />
            <button className="boton">Agregar</button>
          </div>
        </form>
      )}
    </>
  );
}
