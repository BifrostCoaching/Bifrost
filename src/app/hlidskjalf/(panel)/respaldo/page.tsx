import { requireEquipo } from "@/lib/supabase/equipo";

export default async function Respaldo() {
  await requireEquipo();
  return (
    <>
      <h1>Respaldo</h1>
      <div className="caja" style={{ display: "grid", gap: 14 }}>
        <p style={{ margin: 0 }}>
          Descarga un archivo con todo lo que está cargado en el sitio: talleres, eventos, servicios, blog, comunidad, interesados,
          consultas, campus, Dar por dar y contacto.
        </p>
        <p className="apagado" style={{ margin: 0 }}>
          Las fotos no van adentro del archivo, solo sus links. Guardá siempre los originales en la carpeta de Drive del equipo.
        </p>
        <p className="aviso" style={{ margin: 0 }}>
          El archivo tiene datos personales (nombres, emails, teléfonos). Guardalo en un lugar privado y no lo mandes por WhatsApp
          ni por email.
        </p>
        <div>
          {/* Descarga directa: no es una página, así que va con <a> y no con Link. */}
          <a href="/hlidskjalf/respaldo-descarga" className="boton" download>
            Descargar respaldo
          </a>
        </div>
        <p className="apagado" style={{ margin: 0, fontSize: "0.9rem" }}>
          Recomendación: descargalo una vez por mes y antes de cualquier cambio grande.
        </p>
      </div>
    </>
  );
}
