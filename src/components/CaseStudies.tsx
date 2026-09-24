"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";
import type { CaseCardData } from "@/lib/caseCards";

/**
 * Vaka çalışmaları — Jale panelinden KATEGORİ BAZLI canlı veri gösterir.
 * Firma adı hiçbir zaman gösterilmez; yalnızca sektör kategorisi + "N mağaza".
 *
 * Veri SUNUCUDA seçilir (bkz. lib/caseCards.ts) ve prop olarak gelir; bu bileşen
 * yalnızca çizim yapar. Daha önce veriyi istemcide çekiyordu — canlı veri
 * gelene kadar "temsili örnek" kartlar görünüyor, sonra yerlerine gerçekleri
 * geçiyordu. Temsili kartlar tamamen kaldırıldı: veri yoksa bölüm hiç çizilmez.
 */

function formatRevenue(rev: number): React.ReactNode {
  if (rev >= 1_000_000) return <CountUp end={rev / 1_000_000} decimals={1} prefix="₺" suffix="M" />;
  if (rev >= 1_000) return <CountUp end={rev / 1_000} decimals={0} prefix="₺" suffix="K" />;
  return <CountUp end={rev} decimals={0} prefix="₺" />;
}

function formatRoas(value: number): string {
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`;
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

export default function CaseStudies({ cards }: { cards: CaseCardData[] }) {
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
              style={{ backgroundColor: `${c.color}1f`, color: c.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
              {c.badge}
            </span>
            <span className="text-xs font-medium text-ink-400">{c.subLabel}</span>
          </div>

          <div className="mt-4 text-ink-400">
            <CaseChart curve={c.curve} color={c.color} />
          </div>

          {/* Tek metrik şeması: İlk ay / En iyi ay / Ciro. Etiketler bilerek
              "Önce/Sonra" değil — gösterilen zirve son ay olmak zorunda değil,
              "sonra" demek olmayan bir trend ima ederdi. */}
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                İlk ay
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-ink-300">
                {formatRoas(c.firstRoas)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                En iyi ay
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-white">
                <CountUp end={c.bestRoas} decimals={1} suffix="x" />
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Ciro
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-white">
                {formatRevenue(c.revenue)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-400">{c.note}</p>
        </article>
      ))}
    </div>
  );
}
