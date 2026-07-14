"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

/**
 * Vaka çalışmaları: scroll'a girince "çizilen" ROAS eğrileri ve
 * önce/sonra metrikleri. Veriler gerçek müşteri sonuçlarından
 * derlenmiş, marka adları gizlenmiştir.
 */

interface CaseStudy {
  sector: string;
  marketplace: string;
  marketplaceColor: string;
  period: string;
  roasBefore: number;
  roasAfter: number;
  revenueMultiplier: string;
  note: string;
  /** 0-100 aralığında normalize edilmiş aylık eğri noktaları */
  curve: number[];
}

const CASES: CaseStudy[] = [
  {
    sector: "Ev Tekstili Markası",
    marketplace: "Trendyol",
    marketplaceColor: "#f27a1a",
    period: "4 aylık yönetim",
    roasBefore: 3.8,
    roasAfter: 11.2,
    revenueMultiplier: "3,1x",
    note: "Katalog segmentasyonu + retargeting katmanı sonrası reklam kaynaklı ciro 3 kattan fazla arttı.",
    curve: [18, 22, 30, 46, 58, 74, 88],
  },
  {
    sector: "Kozmetik Satıcısı",
    marketplace: "Trendyol",
    marketplaceColor: "#f27a1a",
    period: "3 aylık yönetim",
    roasBefore: 5.1,
    roasAfter: 14.6,
    revenueMultiplier: "2,7x",
    note: "Zarar eden geniş hedeflemeler kapatıldı; bütçe kazanan ürün setlerine kaydırıldı.",
    curve: [26, 24, 38, 52, 70, 82, 92],
  },
  {
    sector: "Züccaciye Mağazası",
    marketplace: "Hepsiburada",
    marketplaceColor: "#ff6000",
    period: "2 aylık yönetim",
    roasBefore: 2.9,
    roasAfter: 8.4,
    revenueMultiplier: "2,2x",
    note: "Hepsiburada kataloğu Meta'ya bağlandı; ilk 60 günde ROAS yaklaşık 3 katına çıktı.",
    curve: [14, 20, 34, 44, 60, 71, 80],
  },
];

function buildPath(curve: number[], width: number, height: number): string {
  const stepX = width / (curve.length - 1);
  return curve
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / 100) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function CaseChart({ curve, color }: { curve: number[]; color: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const W = 280;
  const H = 110;
  const linePath = buildPath(curve, W, H);
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const gradientId = `case-area-${color.replace("#", "")}`;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Izgara çizgileri */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={W}
          y1={H * f}
          y2={H * f}
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      ))}
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
        className="transition-opacity duration-1000"
        style={{ opacity: drawn ? 1 : 0, transitionDelay: "0.9s" }}
      />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        className={`chart-line ${drawn ? "is-drawn" : ""}`}
        style={{ "--chart-length": "420" } as React.CSSProperties}
      />
    </svg>
  );
}

export default function CaseStudies() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {CASES.map((c) => (
        <article
          key={c.sector}
          className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
        >
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: `${c.marketplaceColor}1f`, color: c.marketplaceColor }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.marketplaceColor }} />
              {c.marketplace}
            </span>
            <span className="text-xs font-medium text-ink-400">{c.period}</span>
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-white">{c.sector}</h3>

          <div className="mt-4 text-ink-400">
            <CaseChart curve={c.curve} color={c.marketplaceColor} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Önce
              </p>
              <p className="mt-1 font-display text-xl font-bold text-ink-300">
                {c.roasBefore.toLocaleString("tr-TR", { minimumFractionDigits: 1 })}x
              </p>
              <p className="text-[10px] text-ink-500">ROAS</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Sonra
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-white">
                <CountUp end={c.roasAfter} decimals={1} suffix="x" />
              </p>
              <p className="text-[10px] text-ink-500">ROAS</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Ciro
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-green-400">
                {c.revenueMultiplier}
              </p>
              <p className="text-[10px] text-ink-500">artış</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-400">{c.note}</p>
        </article>
      ))}
    </div>
  );
}
