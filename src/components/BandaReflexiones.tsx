import Link from "next/link";

export function BandaReflexiones() {
  return (
    <section id="reflexiones" className="seccion sup">
      <div className="ancho">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, padding: 32, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div style={{ minWidth: 0, maxWidth: 680 }}>
            <p className="ceja">Reflexiones de la comunidad</p>
            <h2 className="h2" style={{ marginBottom: 8 }}>¿Querés compartir lo que pensás?</h2>
            <p className="apagado" style={{ margin: 0 }}>
              Las reflexiones de la comunidad viven en el pozo de Mímir. Cada una deja una runa en el fondo del agua.
            </p>
          </div>
          <Link href="/comunidad?seccion=mimir" className="boton">
            Ir al pozo de Mímir
          </Link>
        </div>
      </div>
    </section>
  );
}
