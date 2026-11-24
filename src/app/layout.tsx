import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const titulos = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-titulos" });
const textos = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-texto" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Bifröst · Espacios de aprendizaje", template: "%s · Bifröst" },
  description:
    "Bifröst crea espacios de aprendizaje con mirada humana y empresarial, para que lo que aprendés se transforme en resultados concretos.",
  openGraph: { locale: "es_AR", siteName: "Bifröst", type: "website" },
};

// Aplica el tema guardado antes de pintar, para que no parpadee. Por defecto, oscuro.
const temaInicial = `try{var t=localStorage.getItem('bifrost-tema');document.documentElement.className=document.documentElement.className.replace(/\\bt-(dark|light)\\b/,'')+(t==='claro'?' t-light':' t-dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${titulos.variable} ${textos.variable} t-dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
      </head>
      <body>
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
