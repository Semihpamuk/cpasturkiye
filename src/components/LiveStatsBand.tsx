"use client";

import { useState } from "react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import type { LiveStats } from "@/types/liveStats";

type RangeKey = "today" | "week" | "month";

interface LiveStatsBandProps {
  stats: LiveStats;
}

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Son 7 Gün" },
  { key: "month", label: "Son 30 Gün" },
];

export default function LiveStatsBand({ stats }: LiveStatsBandProps) {
  const [range, setRange] = useState<RangeKey>("today");
  const active = stats[range];

  return (
    <section className="relative overflow-hidden bg-ink-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Canlı performans
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
              Yönettiğimiz reklamların güncel sonuçları
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-300">
              Tüm müşteri hesaplarımızın toplamı — Meta verisinden otomatik
              güncellenir.
            </p>
          </div>
        </Reveal>

        {/* Zaman aralığı seçici */}
        <div className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Zaman aralığı"
            className="inline-flex rounded-full border border-white/10 bg-white/5 p-1"
          >
            {RANGES.map((r) => {
              const isActive = r.key === range;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setRange(r.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:px-5 ${
                    isActive
                      ? "bg-brand-600 text-white shadow"
                      : "text-ink-300 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrikler */}
        <div className="mt-12 grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
          <Metric
            label="Harcanan reklam bütçesi"
            value={active.spend}
            prefix="₺"
            rangeKey={range}
            metricKey="spend"
          />
          <Metric
            label="Satış adedi"
            value={active.sales}
            rangeKey={range}
            metricKey="sales"
          />
          <Metric
            label="Toplam ciro"
            value={active.revenue}
            prefix="₺"
            rangeKey={range}
            metricKey="revenue"
          />
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: number;
  prefix?: string;
  rangeKey: RangeKey;
  metricKey: string;
}

function Metric({ label, value, prefix = "", rangeKey, metricKey }: MetricProps) {
  return (
    <div>
      <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        {/* key → sekme değişince CountUp remount olur ve yeniden sayar */}
        <CountUp key={`${rangeKey}-${metricKey}`} end={value} prefix={prefix} />
      </p>
      <p className="mt-2 text-sm font-medium text-ink-300">{label}</p>
    </div>
  );
}
