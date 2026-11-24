/** Tipos de espacio comunitario, con el color y el ícono de la maqueta. */
export const TIPOS_ESPACIO = ["Refugios de animales", "Medioambiente", "Comedores", "Educación", "Salud", "Otro"] as const;

const ESTILO: Record<string, { bg: string; tx: string; icono: React.ReactNode }> = {
  "Refugios de animales": {
    bg: "#F3E3C3", tx: "#6B4A12",
    icono: (<><circle cx="7" cy="9" r="1.8" /><circle cx="12" cy="6.5" r="1.8" /><circle cx="17" cy="9" r="1.8" /><path d="M8 17c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5c0 1.5-1.2 2-2.5 1.6-1-.3-2-.3-3 0C9.2 19 8 18.5 8 17z" /></>),
  },
  Medioambiente: { bg: "#D5ECE4", tx: "#0B4A3E", icono: (<><path d="M5 19c0-8 6-13 14-14-1 8-6 14-14 14z" /><path d="M5 19l7-7" /></>) },
  Comedores: { bg: "#F6D9DD", tx: "#6E1A26", icono: (<><path d="M4 12h16a8 8 0 0 1-16 0z" /><path d="M9 4v4M12 3v5M15 4v4" /></>) },
  "Educación": { bg: "#E2E7F3", tx: "#22365F", icono: (<><path d="M3 9l9-4 9 4-9 4-9-4z" /><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4" /></>) },
  Salud: { bg: "#EFE7DA", tx: "#5A4A35", icono: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /> },
  Otro: { bg: "#E6E3DC", tx: "#3C4352", icono: (<><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></>) },
};

export function IconoEspacio({ tipo, grande = false }: { tipo: string; grande?: boolean }) {
  const e = ESTILO[tipo] ?? ESTILO.Otro;
  const lado = grande ? 52 : 40;
  const svg = grande ? 28 : 22;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: lado, height: lado, borderRadius: grande ? 14 : 12, background: e.bg, color: e.tx, flex: "none" }}>
      <svg width={svg} height={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {e.icono}
      </svg>
    </span>
  );
}
