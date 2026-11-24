/** El símbolo de Bifröst: tres arcos concéntricos, un puente. */
export function Arcos({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 100 62" aria-hidden="true" className={className}>
      <path d="M8 58 A42 42 0 0 1 92 58" fill="none" stroke="#14213D" strokeWidth="8" strokeLinecap="round" />
      <path d="M22 58 A28 28 0 0 1 78 58" fill="none" stroke="#0B6866" strokeWidth="8" strokeLinecap="round" />
      <path d="M36 58 A14 14 0 0 1 64 58" fill="none" stroke="#D9913B" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** Versión grande y clara para la portada oscura. */
export function ArcosPortada({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 340" aria-hidden="true" className={className}>
      <path d="M30 330 A270 270 0 0 1 570 330" fill="none" stroke="#2E4A7A" strokeWidth="34" strokeLinecap="round" />
      <path d="M110 330 A190 190 0 0 1 490 330" fill="none" stroke="#0B6866" strokeWidth="34" strokeLinecap="round" />
      <path d="M190 330 A110 110 0 0 1 410 330" fill="none" stroke="#D9913B" strokeWidth="34" strokeLinecap="round" />
    </svg>
  );
}
