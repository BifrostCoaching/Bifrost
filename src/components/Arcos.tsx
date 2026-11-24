/** El símbolo de Bifröst: tres arcos concéntricos, un puente. */
export function Arcos({ claro = false, size = 40 }: { claro?: boolean; size?: number }) {
  const [a, b, c] = claro ? ["#D9808A", "#7FC4B0", "#E0B877"] : ["#8C2433", "#1E7A64", "#C9974A"];
  return (
    <svg width={size} height={(size * 28) / 40} viewBox="0 0 40 28" aria-hidden="true">
      <path d="M3 25 A17 17 0 0 1 37 25" fill="none" stroke={a} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M9 25 A11 11 0 0 1 31 25" fill="none" stroke={b} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M15 25 A5 5 0 0 1 25 25" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArcosGrandes() {
  return (
    <svg viewBox="0 0 240 140" style={{ width: "100%", maxWidth: 360, height: "auto" }} aria-hidden="true">
      <path d="M20 130 A100 100 0 0 1 220 130" fill="none" stroke="#8C2433" strokeWidth="10" strokeLinecap="round" />
      <path d="M48 130 A72 72 0 0 1 192 130" fill="none" stroke="#1E7A64" strokeWidth="10" strokeLinecap="round" />
      <path d="M76 130 A44 44 0 0 1 164 130" fill="none" stroke="#C9974A" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}
