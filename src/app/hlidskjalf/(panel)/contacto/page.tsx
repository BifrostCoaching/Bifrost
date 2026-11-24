import { requireEquipo } from "@/lib/supabase/equipo";
import { FormContactoPanel } from "./FormContactoPanel";

export default async function ContactoPanel() {
  const { supabase } = await requireEquipo();
  const { data, error } = await supabase.from("ajustes").select("clave, valor");
  const v = Object.fromEntries(((data ?? []) as { clave: string; valor: string }[]).map((x) => [x.clave, x.valor]));
  return (
    <>
      <h1>Datos de contacto</h1>
      <p className="apagado">Se muestran en la sección &quot;¿Hablamos?&quot; de todas las páginas. Lo que dejes vacío aparece como [PENDIENTE].</p>
      {error ? (
        <p className="aviso error" role="status">
          Falta crear la tabla: corré el archivo 04-contacto.sql en Supabase &gt; SQL Editor.
        </p>
      ) : (
        <FormContactoPanel email={v.email ?? ""} whatsapp={v.whatsapp ?? ""} instagram={v.instagram ?? ""} linkedin={v.linkedin ?? ""} />
      )}
    </>
  );
}
