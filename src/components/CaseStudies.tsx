"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";
import type { CategoryStat } from "@/types/categoryStats";

/**
 * Vaka çalışmaları — Jale panelinden KATEGORİ BAZLI canlı veri çeker.
 * Firma adı hiçbir zaman gösterilmez; yalnızca sektör kategorisi + "N mağaza".
 * "0 çeken" firmalar Jale tarafında zaten ayıklanmıştır.
 *
 * Canlı veri yoksa (API kapalı / Jale henüz redeploy edilmemiş) statik
 * örneklere düşer — bölüm asla boş kalmaz.
 */

interface Metric {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}

interface CaseCard {
  key: string;
  badge: string;
  badgeColor: string;
  subLabel: string;
  curve: number[]; // 0-100 normalize
  color: string;
  metrics: Metric[];
  note: string;
}

const PALETTE = ["#f27a1a", "#0866ff", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

// Vaka kartına layık "gerçekten performans gösteren" kategori eşikleri.
// Bu değerlerin altındaki (ör. 0 çeken, cılız) kategoriler gösterilmez.
const MIN_REVENUE = 10_000; // toplam ciro (TL)
const MIN_SPEND = 1_000; // toplam harcama (TL)
const MIN_ROAS = 3; // vaka-değer ROAS tabanı
const MAX_CARDS = 3;

// ── Statik fallback (Jale verisi yokken) ──────────────────────────────────
const FALLBACK: CaseCard[] = [
  {
    key: "ev-tekstili",
    badge: "Ev Tekstili",
    badgeColor: "#f27a1a",
    color: "#f27a1a",
    subLabel: "temsili örnek",
    curve: [18, 22, 30, 46, 58, 74, 88],
    metrics: [
      { label: "Önce", value: "3.8x" },
      { label: "Sonra", value: <CountUp end={11.2} decimals={1} suffix="x" />, accent: true },
      { label: "Ciro", value: "3,1x", accent: true },
    ],
    note: "Katalog segmentasyonu + retargeting katmanı sonrası reklam kaynaklı ciro 3 kattan fazla arttı.",
  },
  {
    key: "kozmetik",
    badge: "Kozmetik",
    badgeColor: "#0866ff",
    color: "#0866ff",
    subLabel: "temsili örnek",
    curve: [26, 24, 38, 52, 70, 82, 92],
    metrics: [
      { label: "Önce", value: "5.1x" },
      { label: "Sonra", value: <CountUp end={14.6} decimals={1} suffix="x" />, accent: true },
      { label: "Ciro", value: "2,7x", accent: true },
    ],
    note: "Zarar eden geniş hedeflemeler kapatıldı; bütçe kazanan ürün setlerine kaydırıldı.",
  },
  {
    key: "zuccaciye",
    badge: "Züccaciye",
    badgeColor: "#16a34a",
    color: "#16a34a",
    subLabel: "temsili örnek",
    curve: [14, 20, 34, 44, 60, 71, 80],
    metrics: [
      { label: "Önce", value: "2.9x" },
      { label: "Sonra", value: <CountUp end={8.4} decimals={1} suffix="x" />, accent: true },
      { label: "Ciro", value: "2,2x", accent: true },
    ],
    note: "İlk 60 günde ROAS yaklaşık 3 katına çıktı.",
  },
];

function formatRevenue(rev: number): React.ReactNode {
  if (rev >= 1_000_000) return <CountUp end={rev / 1_000_000} decimals={1} prefix="₺" suffix="M" />;
  if (rev >= 1_000) return <CountUp end={rev / 1_000} decimals={0} prefix="₺" suffix="K" />;
  return <CountUp end={rev} decimals={0} prefix="₺" />;
}

/** Aylık ciro serisini 0-100 aralığına normalize eder (kendi maksimumuna göre). */
function normalizeCurve(values: number[]): number[] {
  const max = Math.max(...values, 0);
  if (max <= 0) return values.map(() => 8); // düz taban
  return values.map((v) => Math.max(6, Math.round((v / max) * 100)));
}

function toCard(cat: CategoryStat, index: number): CaseCard {
  const color = cat.color || PALETTE[index % PALETTE.length];
  const revenueCurve = cat.monthly.map((m) => m.revenue);

  // Önce/Sonra: ilk ve son "harcama olan" ayın ROAS'ı
  const spentMonths = cat.monthly.filter((m) => m.spend > 0);
  const hasBeforeAfter = spentMonths.length >= 2;
  const firstRoas = hasBeforeAfter ? spentMonths[0].roas : 0;
  const lastRoas = hasBeforeAfter ? spentMonths[spentMonths.length - 1].roas : 0;
  const improved = hasBeforeAfter && lastRoas > firstRoas && firstRoas > 0;

  const metrics: Metric[] = improved
    ? [
        { label: "Önce", value: `${firstRoas.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x` },
        { label: "Sonra", value: <CountUp end={lastRoas} decimals={1} suffix="x" />, accent: true },
        { label: "Ciro", value: formatRevenue(cat.revenue), accent: true },
      ]
    : [
        { label: "ROAS", value: <CountUp end={cat.roas} decimals={1} suffix="x" />, accent: true },
        { label: "Mağaza", value: <CountUp end={cat.firmCount} /> },
        { label: "Ciro", value: formatRevenue(cat.revenue), accent: true },
      ];

  return {
    key: cat.name,
    badge: cat.name,
    badgeColor: color,
    color,
    subLabel: `${cat.firmCount} mağaza`,
    curve: normalizeCurve(revenueCurve),
    metrics,
    note: `${cat.firmCount} aktif mağazanın son ${cat.monthly.length} aydaki toplam Meta CPAS performansı.`,
  };
}

function buildPath(curve: number[], width: number, height: number): string {
  if (curve.length < 2) return "";
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
  const areaPath = linePath ? `${linePath} L ${W} ${H} L 0 ${H} Z` : "";
  const gradientId = `case-area-${color.replace("#", "")}`;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      ))}
      {areaPath && (
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
          className="transition-opacity duration-1000"
          style={{ opacity: drawn ? 1 : 0, transitionDelay: "0.9s" }}
        />
      )}
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

interface ApiResponse {
  success: boolean;
  data?: { categories: CategoryStat[] };
}

export default function CaseStudies() {
  const [cards, setCards] = useState<CaseCard[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/category-stats")
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        if (cancelled || !json.success || !json.data) return;

        // Yalnızca gerçekten performans gösteren kategoriler; ROAS'a göre (en iyi önce).
        const live = json.data.categories
          .filter(
            (c) =>
              c.revenue >= MIN_REVENUE &&
              c.spend >= MIN_SPEND &&
              c.roas >= MIN_ROAS
          )
          .sort((a, b) => b.roas - a.roas)
          .slice(0, MAX_CARDS)
          .map(toCard);

        // 3'ten az gerçek kategori varsa kalanı temsili örneklerle doldur.
        const fillers = FALLBACK.filter(
          (f) => !live.some((l) => l.badge.toLowerCase() === f.badge.toLowerCase())
        );
        const filled = [...live, ...fillers].slice(0, MAX_CARDS);
        if (filled.length > 0) setCards(filled);
      })
      .catch(() => {
        // Sessizce yut — statik fallback kalır.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {cards.map((c) => (
        <article
          key={c.key}
          className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
        >
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: `${c.badgeColor}1f`, color: c.badgeColor }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.badgeColor }} />
              {c.badge}
            </span>
            <span className="text-xs font-medium text-ink-400">{c.subLabel}</span>
          </div>

          <div className="mt-4 text-ink-400">
            <CaseChart curve={c.curve} color={c.color} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            {c.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  {m.label}
                </p>
                <p
                  className={`mt-1 font-display text-xl font-extrabold ${
                    m.accent ? "text-white" : "text-ink-300"
                  }`}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-400">{c.note}</p>
        </article>
      ))}
    </div>
  );
}
