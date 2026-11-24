import { FormLogin } from "./FormLogin";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Login({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <section className="seccion" style={{ maxWidth: 460, marginInline: "auto" }}>
      <span className="ceja">Panel del equipo</span>
      <h1>Hliðskjálf</h1>
      <p className="apagado">
        Desde su trono, Odín veía todos los mundos. Desde acá, el equipo carga y edita el contenido del sitio sin tocar
        el código.
      </p>
      {error === "sin-permiso" && (
        <p className="aviso error" role="alert">
          Esa cuenta no forma parte del equipo de Bifröst.
        </p>
      )}
      <div className="caja">
        <FormLogin />
      </div>
    </section>
  );
}
