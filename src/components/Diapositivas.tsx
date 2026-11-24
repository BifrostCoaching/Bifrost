"use client";
import { useEffect, useState } from "react";

/** Imágenes que se alternan suavemente cada 6 segundos (se detiene si la persona prefiere menos movimiento). */
export function Diapositivas({ imagenes, desfase = 0 }: { imagenes: string[]; desfase?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let intervalo: ReturnType<typeof setInterval> | undefined;
    const inicio = setTimeout(() => {
      intervalo = setInterval(() => setI((n) => n + 1), 6000);
    }, desfase);
    return () => {
      clearTimeout(inicio);
      if (intervalo) clearInterval(intervalo);
    };
  }, [desfase]);
  return (
    <>
      {imagenes.map((src, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" className={`slide${i % imagenes.length === k ? " on" : ""}`} loading={k === 0 ? "eager" : "lazy"} />
      ))}
    </>
  );
}
