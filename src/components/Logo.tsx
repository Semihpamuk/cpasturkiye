interface LogoProps {
  /** Tailwind text-size + spacing classes to control overall scale */
  className?: string;
  /** true => açık zemin (koyu harfler), false => koyu zemin (açık harfler) */
  onLight?: boolean;
}

/**
 * "cpas Türkiye" wordmark — arka planı yok (şeffaf), vektörel gibi
 * ölçeklenir. Marka kimliği: mavi "p" (Meta) + turuncu "s" (Trendyol/brand).
 */
export default function Logo({ className, onLight = true }: LogoProps) {
  const base = onLight ? "text-ink-900" : "text-white";
  const muted = onLight ? "text-ink-500" : "text-white/60";
  // Turuncu "s" zemine göre ton değiştirir: açıkta brand-700, koyuda brand-600.
  const accent = onLight ? "text-brand-700" : "text-brand-600";

  return (
    <span
      aria-label="CPAS Türkiye"
      className={`inline-flex items-end font-display font-extrabold leading-none tracking-tight ${className ?? "text-2xl"}`}
    >
      <span className={base}>c</span>
      <span className="text-meta">p</span>
      <span className={base}>a</span>
      <span className={accent}>s</span>
      <span className={`ml-1.5 pb-0.5 text-[0.34em] font-bold uppercase tracking-[0.22em] ${muted}`}>
        Türkiye
      </span>
    </span>
  );
}
