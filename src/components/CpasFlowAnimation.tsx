export default function CpasFlowAnimation() {
  return (
    <svg
      viewBox="0 0 900 300"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      role="img"
      aria-label="Trendyol kataloğu Jale üzerinden Meta'ya bağlanır, reklamlar satışa döner"
    >
      <defs>
        <linearGradient id="flowBrand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f96716" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <filter id="flowShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Bağlantı çizgileri (animasyonlu) */}
      <path d="M 200 150 C 260 150 280 150 340 150" fill="none" stroke="#f96716" strokeWidth="3" strokeLinecap="round" className="flow-line" />
      <path d="M 560 150 C 620 150 640 150 700 150" fill="none" stroke="#0866ff" strokeWidth="3" strokeLinecap="round" className="flow-line" style={{ animationDelay: "0.4s" }} />
      {/* Satış geri dönüş çizgisi */}
      <path d="M 780 200 C 780 260 450 280 450 215" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" className="flow-line" style={{ animationDelay: "0.8s" }} />

      {/* Trendyol düğümü */}
      <g filter="url(#flowShadow)">
        <rect x="60" y="95" width="140" height="110" rx="18" fill="#ffffff" stroke="#fed0aa" strokeWidth="1.5" />
      </g>
      <circle cx="130" cy="135" r="22" fill="#f27a1a" className="flow-node" />
      <text x="130" y="142" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">T</text>
      <text x="130" y="180" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">Trendyol</text>
      <text x="130" y="196" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">Mağazan + Kataloğun</text>

      {/* Jale düğümü (merkez) */}
      <g filter="url(#flowShadow)">
        <rect x="340" y="80" width="220" height="140" rx="20" fill="url(#flowBrand)" />
      </g>
      <rect x="362" y="102" width="36" height="36" rx="10" fill="#ffffff" opacity="0.95" />
      <text x="380" y="127" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#f2630a" fontFamily="sans-serif">J</text>
      <text x="412" y="120" fontSize="18" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">Jale</text>
      <text x="412" y="136" fontSize="9" fill="#ffe8d5" fontFamily="sans-serif">CPAS Yönetim Paneli</text>
      <text x="362" y="168" fontSize="10" fill="#ffffff" fontFamily="sans-serif">✓ Katalog senkronizasyonu</text>
      <text x="362" y="186" fontSize="10" fill="#ffffff" fontFamily="sans-serif">✓ Kampanya yönetimi</text>
      <text x="362" y="204" fontSize="10" fill="#ffffff" fontFamily="sans-serif">✓ AI bütçe optimizasyonu</text>

      {/* Meta düğümü */}
      <g filter="url(#flowShadow)">
        <rect x="700" y="95" width="140" height="110" rx="18" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
      </g>
      <circle cx="770" cy="135" r="22" fill="#0866ff" className="flow-node" style={{ animationDelay: "1.2s" }} />
      <text x="770" y="143" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">∞</text>
      <text x="770" y="180" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">Meta</text>
      <text x="770" y="196" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">Facebook + Instagram</text>

      {/* Satış etiketi */}
      <g filter="url(#flowShadow)">
        <rect x="380" y="245" width="140" height="36" rx="18" fill="#dcfce7" stroke="#86efac" />
      </g>
      <text x="450" y="268" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#15803d" fontFamily="sans-serif">↻ Gerçek Satış Verisi</text>

      {/* Akış ok uçları */}
      <polygon points="340,150 328,144 328,156" fill="#f96716" />
      <polygon points="700,150 688,144 688,156" fill="#0866ff" />
    </svg>
  );
}
