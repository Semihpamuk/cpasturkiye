"use client";

/**
 * Hero akış animasyonu: Trendyol + Hepsiburada + Amazon kataloglarından
 * CPAS Türkiye'ye, oradan Meta'ya (Facebook/Instagram) akan ışıklı veri
 * hatları ve Meta'dan dönen "gerçek satış verisi" hattı.
 *
 * Salt SVG — responsive, JS animasyon döngüsü yok (CSS keyframes).
 */

const SOURCES = [
  { label: "Trendyol", color: "#f27a1a", cy: 84, soon: false },
  { label: "Hepsiburada", color: "#ff6000", cy: 220, soon: false },
  { label: "Amazon", color: "#ff9900", cy: 356, soon: true },
];

export default function AnimatedBeamFlow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 440"
      role="img"
      aria-label="Trendyol, Hepsiburada ve Amazon mağaza verilerinin CPAS Türkiye üzerinden Meta reklamlarına bağlanması"
      className={`h-auto w-full ${className}`}
    >
      <defs>
        <linearGradient id="beam-orange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f27a1a" stopOpacity="0" />
          <stop offset="50%" stopColor="#fb863c" />
          <stop offset="100%" stopColor="#f27a1a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0866ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#4d94ff" />
          <stop offset="100%" stopColor="#0866ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hub-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Bağlantı hatları (zemin) ── */}
      {SOURCES.map((s) => (
        <path
          key={`base-${s.label}`}
          d={`M 208 ${s.cy} C 268 ${s.cy}, 260 220, 306 220`}
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
      ))}
      <path d="M 454 196 C 510 180, 512 152, 552 148" fill="none" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M 454 244 C 510 260, 512 288, 552 292" fill="none" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* ── Işıklı beam hatları ── */}
      {SOURCES.map((s, i) =>
        s.soon ? null : (
          <path
            key={`beam-${s.label}`}
            d={`M 208 ${s.cy} C 268 ${s.cy}, 260 220, 306 220`}
            fill="none"
            stroke="url(#beam-orange)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="beam-line"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        )
      )}
      <path
        d="M 454 196 C 510 180, 512 152, 552 148"
        fill="none"
        stroke="url(#beam-blue)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="beam-line"
        style={{ animationDelay: "0.4s" }}
      />
      <path
        d="M 454 244 C 510 260, 512 288, 552 292"
        fill="none"
        stroke="url(#beam-blue)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="beam-line"
        style={{ animationDelay: "1.6s" }}
      />

      {/* ── Kaynak düğümleri: pazaryerleri ── */}
      {SOURCES.map((s) => (
        <g key={s.label}>
          <rect x="28" y={s.cy - 30} width="180" height="60" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx="58" cy={s.cy} r="7" fill={s.color} className="flow-node" />
          <text x="76" y={s.cy + (s.soon ? -2 : 5)} fill="#e2e8f0" fontSize="16" fontWeight="700" fontFamily="var(--font-display), sans-serif">
            {s.label}
          </text>
          {s.soon && (
            <text x="76" y={s.cy + 18} fill="#94a3b8" fontSize="11" fontWeight="600">
              ÇOK YAKINDA
            </text>
          )}
        </g>
      ))}

      {/* ── Merkez düğüm: CPAS Türkiye ── */}
      <g filter="url(#node-glow)">
        <rect x="306" y="158" width="148" height="124" rx="20" fill="url(#hub-fill)" stroke="#475569" strokeWidth="1.2" />
      </g>
      <text x="380" y="212" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--font-display), sans-serif">
        <tspan fill="#ffffff">c</tspan>
        <tspan fill="#4d94ff">p</tspan>
        <tspan fill="#ffffff">a</tspan>
        <tspan fill="#fb863c">s</tspan>
      </text>
      <text x="380" y="234" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="3">
        TÜRKİYE
      </text>
      <text x="380" y="258" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
        KURULUM + YÖNETİM
      </text>

      {/* ── Hedef düğümler: Meta reklamları ── */}
      <g>
        <rect x="552" y="118" width="180" height="60" rx="14" fill="#0f172a" stroke="#1d4ed8" strokeWidth="1" />
        <circle cx="582" cy="148" r="7" fill="#0866ff" className="flow-node" />
        <text x="600" y="143" fill="#e2e8f0" fontSize="15" fontWeight="700" fontFamily="var(--font-display), sans-serif">
          Facebook
        </text>
        <text x="600" y="161" fill="#94a3b8" fontSize="11" fontWeight="600">
          Katalog reklamları
        </text>
      </g>
      <g>
        <rect x="552" y="262" width="180" height="60" rx="14" fill="#0f172a" stroke="#1d4ed8" strokeWidth="1" />
        <circle cx="582" cy="292" r="7" fill="#4d94ff" className="flow-node" />
        <text x="600" y="287" fill="#e2e8f0" fontSize="15" fontWeight="700" fontFamily="var(--font-display), sans-serif">
          Instagram
        </text>
        <text x="600" y="305" fill="#94a3b8" fontSize="11" fontWeight="600">
          Dinamik ürün reklamları
        </text>
      </g>

      {/* ── Dönen satış verisi hattı ── */}
      <path
        d="M 642 322 C 642 384, 460 396, 380 396 C 300 396, 118 390, 118 386"
        fill="none"
        stroke="#16a34a"
        strokeWidth="1.5"
        strokeOpacity="0.55"
        className="flow-line"
      />
      <rect x="300" y="382" width="160" height="28" rx="14" fill="#052e16" stroke="#166534" strokeWidth="1" />
      <text x="380" y="400" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="700">
        GERÇEK SATIŞ VERİSİ ↩
      </text>
    </svg>
  );
}
