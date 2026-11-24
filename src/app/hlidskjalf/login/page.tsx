import { FormLogin } from "./FormLogin";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Login({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <section className="login">
      {error === "sin-permiso" && (
        <p className="aviso error" role="alert" style={{ marginBottom: 20 }}>
          Esa cuenta no forma parte del equipo de Bifröst.
        </p>
      )}
      <div className="caja">
        <h2 className="h2" style={{ fontSize: "1.8rem" }}>Ingreso del equipo</h2>
        <FormLogin />
      </div>
    </section>
  );
}
