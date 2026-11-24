"use client";
import { useRef, useState } from "react";
import { subirImagen } from "../../acciones";

const LADO_MAX = 1600;

/** Achica la foto en el navegador antes de subirla: carga más rápido y ocupa menos lugar. */
async function achicar(archivo: File): Promise<Blob> {
  const bmp = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bmp.width * escala);
  lienzo.height = Math.round(bmp.height * escala);
  const ctx = lienzo.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
  return new Promise((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error("No se pudo procesar la foto."))), "image/jpeg", 0.85));
}

/**
 * Sube, ordena y quita fotos. Guarda la lista en un campo oculto "imagenes";
 * los cambios quedan firmes al apretar Guardar.
 */
export function EditorImagenes({
  carpeta,
  iniciales,
  max = 8,
  ayuda,
}: {
  carpeta: "talleres" | "eventos" | "servicios" | "profesionales";
  iniciales: string[];
  max?: number;
  ayuda?: string;
}) {
  const [imagenes, setImagenes] = useState<string[]>(iniciales.filter(Boolean));
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const entrada = useRef<HTMLInputElement>(null);

  async function elegir(archivos: FileList | null) {
    if (!archivos?.length) return;
    setError("");
    setSubiendo(true);
    const lugar = max - imagenes.length;
    const nuevas: string[] = [];
    for (const archivo of Array.from(archivos).slice(0, Math.max(lugar, 0))) {
      try {
        const fd = new FormData();
        fd.set("carpeta", carpeta);
        fd.set("archivo", new File([await achicar(archivo)], "foto.jpg", { type: "image/jpeg" }));
        const r = await subirImagen(fd);
        if (r.url) nuevas.push(r.url);
        else setError(r.error ?? "No se pudo subir la foto.");
      } catch {
        setError(`No se pudo leer "${archivo.name}". Probá con una foto JPG o PNG.`);
      }
    }
    if (archivos.length > lugar) setError(`Entran hasta ${max} fotos. Quitá alguna para sumar otra.`);
    setImagenes((v) => (max === 1 ? nuevas.slice(-1) : [...v, ...nuevas]).slice(0, max));
    setSubiendo(false);
    if (entrada.current) entrada.current.value = "";
  }

  const mover = (i: number, d: number) =>
    setImagenes((v) => {
      const c = [...v];
      [c[i], c[i + d]] = [c[i + d], c[i]];
      return c;
    });

  return (
    <fieldset className="editor-imagenes">
      <legend>{max === 1 ? "Foto" : "Fotos"}</legend>
      <input type="hidden" name="imagenes" value={JSON.stringify(imagenes)} />
      {ayuda && <p className="apagado">{ayuda}</p>}
      {imagenes.length === 0 ? (
        <p className="apagado">Todavía no hay fotos cargadas.</p>
      ) : (
        <ul>
          {imagenes.map((url, i) => (
            <li key={url}>
              <img src={url} alt={`Foto ${i + 1}`} />
              <div>
                {max > 1 && i === 0 && <small>Principal</small>}
                {max > 1 && i > 0 && (
                  <button type="button" className="boton chico" onClick={() => mover(i, -1)} aria-label="Mover antes">
                    ←
                  </button>
                )}
                {max > 1 && i < imagenes.length - 1 && (
                  <button type="button" className="boton chico" onClick={() => mover(i, 1)} aria-label="Mover después">
                    →
                  </button>
                )}
                <button type="button" className="boton peligro chico" onClick={() => setImagenes((v) => v.filter((x) => x !== url))}>
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <label className="boton chico" style={{ width: "fit-content", cursor: subiendo ? "wait" : "pointer" }}>
        {subiendo ? "Subiendo…" : max === 1 ? (imagenes.length ? "Reemplazar foto" : "Subir foto") : "Agregar fotos"}
        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={max > 1}
          hidden
          disabled={subiendo}
          onChange={(e) => elegir(e.target.files)}
        />
      </label>
      {error && <p className="aviso error" role="alert">{error}</p>}
      <p className="apagado" style={{ fontSize: "0.85rem" }}>
        Los cambios en las fotos quedan firmes cuando apretás Guardar.
      </p>
    </fieldset>
  );
}
