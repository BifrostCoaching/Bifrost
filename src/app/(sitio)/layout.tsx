import { Pie } from "@/components/Pie";

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="contenido">{children}</main>
      <Pie />
    </>
  );
}
