export default function DashboardMockup() {
  return (
    <svg
      viewBox="0 0 640 460"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full drop-shadow-2xl"
      role="img"
      aria-label="Jale platform dashboard önizlemesi"
    >
      <defs>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f96716" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f96716" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f96716" stopOpacity="0" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Ana pencere */}
      <rect x="0" y="0" width="640" height="460" rx="16" fill="#ffffff" stroke="#e2e8f0" />

      {/* Üst bar */}
      <rect x="0" y="0" width="640" height="44" rx="16" fill="#f8fafc" />
      <rect x="0" y="28" width="640" height="16" fill="#f8fafc" />
      <circle cx="24" cy="22" r="5" fill="#fda4af" />
      <circle cx="42" cy="22" r="5" fill="#fcd34d" />
      <circle cx="60" cy="22" r="5" fill="#86efac" />
      <rect x="220" y="13" width="200" height="18" rx="9" fill="#e2e8f0" />
      <text x="320" y="26" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">
        app.cpasturkiye.com
      </text>

      {/* Sol menü */}
      <rect x="0" y="44" width="140" height="416" fill="#0f172a" />
      <rect x="16" y="64" width="24" height="24" rx="6" fill="url(#brandGrad)" />
      <text x="48" y="81" fontSize="13" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
        Jale
      </text>
      <rect x="12" y="108" width="116" height="28" rx="6" fill="#f96716" opacity="0.95" />
      <text x="24" y="126" fontSize="10" fill="#ffffff" fontFamily="sans-serif">Dashboard</text>
      <text x="24" y="162" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Kampanyalar</text>
      <text x="24" y="194" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Ürünler</text>
      <text x="24" y="226" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Katalog</text>
      <text x="24" y="258" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Raporlar</text>
      <text x="24" y="290" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">AI Asistan</text>

      {/* Başlık */}
      <text x="164" y="80" fontSize="15" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        Mağaza Performansı
      </text>
      <rect x="500" y="62" width="116" height="26" rx="13" fill="#fff5ed" stroke="#fed0aa" />
      <circle cx="516" cy="75" r="4" fill="#22c55e" />
      <text x="526" y="79" fontSize="9" fill="#c2410c" fontFamily="sans-serif">CPAS Bağlı</text>

      {/* KPI kartları */}
      <g filter="url(#softShadow)">
        <rect x="164" y="100" width="142" height="74" rx="10" fill="#ffffff" stroke="#f1f5f9" />
        <rect x="322" y="100" width="142" height="74" rx="10" fill="#ffffff" stroke="#f1f5f9" />
        <rect x="480" y="100" width="136" height="74" rx="10" fill="url(#brandGrad)" />
      </g>
      <text x="178" y="124" fontSize="9" fill="#64748b" fontFamily="sans-serif">Günlük Ciro</text>
      <text x="178" y="148" fontSize="17" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        ₺48.250
      </text>
      <text x="178" y="164" fontSize="9" fill="#16a34a" fontFamily="sans-serif">▲ %23 dün</text>

      <text x="336" y="124" fontSize="9" fill="#64748b" fontFamily="sans-serif">Harcama</text>
      <text x="336" y="148" fontSize="17" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        ₺6.870
      </text>
      <text x="336" y="164" fontSize="9" fill="#64748b" fontFamily="sans-serif">3 kampanya</text>

      <text x="494" y="124" fontSize="9" fill="#ffe8d5" fontFamily="sans-serif">ROAS</text>
      <text x="494" y="150" fontSize="20" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
        7.02x
      </text>
      <text x="494" y="164" fontSize="9" fill="#ffe8d5" fontFamily="sans-serif">Hedef: 5.0x ✓</text>

      {/* Grafik kartı */}
      <g filter="url(#softShadow)">
        <rect x="164" y="190" width="300" height="160" rx="10" fill="#ffffff" stroke="#f1f5f9" />
      </g>
      <text x="180" y="214" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        Satış Trendi — Son 14 Gün
      </text>
      <polyline
        points="180,320 204,310 228,316 252,296 276,302 300,280 324,286 348,262 372,268 396,244 420,236 444,218"
        fill="none"
        stroke="#f96716"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="180,320 204,310 228,316 252,296 276,302 300,280 324,286 348,262 372,268 396,244 420,236 444,218 444,338 180,338"
        fill="url(#chartGrad)"
      />
      <circle cx="444" cy="218" r="4" fill="#f96716" stroke="#ffffff" strokeWidth="2" />

      {/* AI önerisi kartı */}
      <g filter="url(#softShadow)">
        <rect x="480" y="190" width="136" height="160" rx="10" fill="#ffffff" stroke="#f1f5f9" />
      </g>
      <rect x="492" y="204" width="56" height="16" rx="8" fill="#eff6ff" />
      <text x="500" y="215" fontSize="8" fill="#0866ff" fontFamily="sans-serif">AI Önerisi</text>
      <text x="492" y="240" fontSize="9" fill="#334155" fontFamily="sans-serif">
        <tspan x="492" dy="0">Şampiyon ürün</tspan>
        <tspan x="492" dy="13">bütçesini %20</tspan>
        <tspan x="492" dy="13">artır → tahmini</tspan>
        <tspan x="492" dy="13">+₺9.400/gün ciro</tspan>
      </text>
      <rect x="492" y="306" width="112" height="26" rx="6" fill="#f96716" />
      <text x="548" y="323" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
        Onayla
      </text>

      {/* Ürün listesi */}
      <g filter="url(#softShadow)">
        <rect x="164" y="366" width="452" height="76" rx="10" fill="#ffffff" stroke="#f1f5f9" />
      </g>
      <rect x="180" y="380" width="20" height="20" rx="4" fill="#fed0aa" />
      <text x="208" y="394" fontSize="9" fill="#0f172a" fontFamily="sans-serif">Oversize Basic T-Shirt</text>
      <text x="430" y="394" fontSize="9" fill="#16a34a" fontFamily="sans-serif">ROAS 9.4x</text>
      <text x="530" y="394" fontSize="9" fill="#64748b" fontFamily="sans-serif">142 satış</text>
      <rect x="180" y="410" width="20" height="20" rx="4" fill="#bfdbfe" />
      <text x="208" y="424" fontSize="9" fill="#0f172a" fontFamily="sans-serif">Keten Gömlek — Bej</text>
      <text x="430" y="424" fontSize="9" fill="#16a34a" fontFamily="sans-serif">ROAS 6.1x</text>
      <text x="530" y="424" fontSize="9" fill="#64748b" fontFamily="sans-serif">87 satış</text>
    </svg>
  );
}
