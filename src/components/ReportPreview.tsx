"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

/**
 * Örnek haftalık performans raporu — "her hafta böyle bir rapor alırsınız"
 * güven bölümünün görsel kanıtı. Görünürlüğe girince barlar ve
 * sayılar animasyonla dolar.
 */

const DAILY_BARS = [42, 58, 51, 74, 68, 88, 96]; // % yükseklik
const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function ReportPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xl shadow-ink-900/5"
    >
      {/* Rapor başlığı */}
      <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 font-display text-xs font-extrabold text-white">
            <span>c</span>
            <span className="text-meta-light">p</span>
          </span>
          <div>
            <p className="text-xs font-bold text-ink-900">Haftalık Performans Raporu</p>
            <p className="text-[10px] text-ink-500">23–29 Haziran · Trendyol + Hepsiburada</p>
          </div>
        </div>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
          HEDEF ÜSTÜ
        </span>
      </div>

      <div className="p-5">
        {/* KPI kutuları */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Harcama", value: <CountUp end={48350} prefix="₺" />, delta: null },
            { label: "Reklam Cirosu", value: <CountUp end={512400} prefix="₺" />, delta: "+%18" },
            { label: "ROAS", value: <CountUp end={10.6} decimals={1} suffix="x" />, delta: "+0.9" },
            { label: "Siparişler", value: <CountUp end={1284} />, delta: "+%12" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-ink-100 bg-ink-50/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                {kpi.label}
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-ink-900">
                {kpi.value}
              </p>
              {kpi.delta && (
                <p className="text-[10px] font-bold text-green-600">{kpi.delta} geçen haftaya göre</p>
              )}
            </div>
          ))}
        </div>

        {/* Günlük ciro bar grafiği */}
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            Günlük Reklam Cirosu
          </p>
          <div className="mt-3 flex h-28 items-end gap-2">
            {DAILY_BARS.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-full w-full items-end overflow-hidden rounded-md bg-ink-100">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-1000 ease-out"
                    style={{
                      height: visible ? `${h}%` : "0%",
                      transitionDelay: `${i * 90}ms`,
                    }}
                  />
                </div>
                <span className="text-[9px] font-medium text-ink-400">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Haftanın aksiyonları */}
        <div className="mt-5 rounded-xl border border-ink-100 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            Bu Hafta Yapılan Optimizasyonlar
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Düşük ROAS'lı 2 reklam seti durduruldu, bütçe kazananlara aktarıldı",
              "Sepet terk kitlesine yeni retargeting katmanı açıldı",
              "Stok tükenen 14 ürün kataloğdan otomatik düşürüldü",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-600">
                <svg className="mt-0.5 h-3 w-3 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50/60 px-5 py-2.5">
        <p className="text-[10px] text-ink-400">Her Pazartesi e-posta + WhatsApp özeti</p>
        <p className="text-[10px] font-semibold text-ink-500">PDF · Sayfa 1/4</p>
      </div>
    </div>
  );
}
