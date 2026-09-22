/**
 * Blog kapak görseli — yazı başına üretilen SVG kompozisyon.
 *
 * Her yazı için ayrı fotoğraf hazırlamak yerine kategoriye bağlı, marka
 * paletinde soyut bir desen çiziliyor. Kompozisyon slug'dan türeyen sabit bir
 * tohumla oynadığı için aynı yazı her zaman aynı kapağı alır; liste sayfasında
 * kartlar birbirinin kopyası görünmez.
 *
 * Salt SVG: ağ isteği yok, her boyutta net, istemci JS'i gerektirmez.
 */

type CategoryKey = "rehber" | "optimizasyon" | "fiyatlandirma" | "strateji";

interface CategoryTheme {
  /** Arka plan gradyanı (koyu → koyu) */
  from: string;
  to: string;
  /** Desen ve simge rengi */
  accent: string;
  /** Kategoriyi anlatan sade simge */
  glyph: "book" | "trend" | "coin" | "compass";
}

const THEMES: Record<CategoryKey, CategoryTheme> = {
  // Rehber: marka kiremidi — öğretici, sıcak
  rehber: { from: "#a53a1e", to: "#6d2a18", accent: "#f5c2a6", glyph: "book" },
  // Optimizasyon: orman yeşili — büyüme, ölçüm
  optimizasyon: { from: "#0d372c", to: "#101110", accent: "#64b180", glyph: "trend" },
  // Fiyatlandırma: mürekkep — sayılar, sözleşme
  fiyatlandirma: { from: "#3c3d33", to: "#191a14", accent: "#f0a077", glyph: "coin" },
  // Strateji: Meta mavisi ile marka arası — yön seçimi
  strateji: { from: "#16324f", to: "#101110", accent: "#4d94ff", glyph: "compass" },
};

const FALLBACK: CategoryTheme = THEMES.rehber;

function themeFor(category: string): CategoryTheme {
  const key = category
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/[^a-z]/g, "") as CategoryKey;
  return THEMES[key] ?? FALLBACK;
}

/** Slug'dan sabit sayı — aynı yazı her render'da aynı kompozisyonu alır. */
function seedOf(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  return hash;
}

function Glyph({ kind, color }: { kind: CategoryTheme["glyph"]; color: string }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "trend":
      return (
        <g {...common}>
          <path d="M8 44 L24 28 L34 38 L56 12" />
          <path d="M44 12 H56 V24" />
        </g>
      );
    case "coin":
      return (
        <g {...common}>
          <ellipse cx="32" cy="18" rx="20" ry="8" />
          <path d="M12 18 V38 C12 42.4 20.9 46 32 46 C43.1 46 52 42.4 52 38 V18" />
          <path d="M12 28 C12 32.4 20.9 36 32 36 C43.1 36 52 32.4 52 28" />
        </g>
      );
    case "compass":
      return (
        <g {...common}>
          <circle cx="32" cy="29" r="20" />
          <path d="M40 21 L35 34 L22 39 L27 26 Z" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <path d="M32 16 C27 11 19 10 11 12 V42 C19 40 27 41 32 46 C37 41 45 40 53 42 V12 C45 10 37 11 32 16 Z" />
          <path d="M32 16 V46" />
        </g>
      );
  }
}

export interface BlogCoverProps {
  slug: string;
  category: string;
  className?: string;
  /** Kart içinde dekoratif; ekran okuyucuya başlık zaten okunuyor. */
  title?: string;
  /**
   * Dar şerit olarak kullanıldığında (liste kartlarının üstü): kategori yazısı
   * gizlenir — kartın kendi rozetiyle tekrar ederdi ve slice kırpmasında
   * kesilirdi. Simge ortaya alınır.
   */
  compact?: boolean;
}

export default function BlogCover({
  slug,
  category,
  className = "",
  title,
  compact = false,
}: BlogCoverProps) {
  const theme = themeFor(category);
  const seed = seedOf(slug);
  const id = `cover-${slug}`;
  // Kompozisyon varyasyonu: halkaların yeri ve eğik şeridin açısı
  const cx = 150 + (seed % 90);
  const cy = 40 + ((seed >> 3) % 60);
  const tilt = -28 + ((seed >> 5) % 22);
  const ringGap = 26 + ((seed >> 7) % 14);

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.from} />
          <stop offset="100%" stopColor={theme.to} />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0" />
          <stop offset="50%" stopColor={theme.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill={theme.accent} fillOpacity="0.18" />
        </pattern>
      </defs>

      <rect width="320" height="200" fill={`url(#${id}-bg)`} />
      <rect width="320" height="200" fill={`url(#${id}-dots)`} />

      {/* Eğik ışık şeridi */}
      <rect
        x="-40"
        y="70"
        width="400"
        height="46"
        fill={`url(#${id}-band)`}
        transform={`rotate(${tilt} 160 100)`}
      />

      {/* Eş merkezli halkalar — kompozisyonu yazıya göre kaydırır */}
      <g fill="none" stroke={theme.accent} strokeOpacity="0.22">
        <circle cx={cx} cy={cy} r={ringGap} />
        <circle cx={cx} cy={cy} r={ringGap * 2} />
        <circle cx={cx} cy={cy} r={ringGap * 3} strokeOpacity="0.12" />
      </g>

      {/* Kategori simgesi */}
      <g transform={compact ? "translate(26 70)" : "translate(26 118)"}>
        <Glyph kind={theme.glyph} color={theme.accent} />
      </g>

      {/* Kategori etiketi — dar şeritte kırpılmaması için gizli */}
      {!compact && (
        <text
          x="26"
          y="46"
          fill={theme.accent}
          fillOpacity="0.85"
          fontSize="13"
          fontWeight="700"
          letterSpacing="2.5"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          {category.toLocaleUpperCase("tr")}
        </text>
      )}
    </svg>
  );
}
