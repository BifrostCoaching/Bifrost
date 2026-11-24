import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Encabezado />
      <main id="contenido">{children}</main>
      <Pie />
    </>
  );
}
