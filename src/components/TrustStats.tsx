"use client";

import { useEffect, useState } from "react";
import CountUp from "./CountUp";
import type { LiveStats } from "@/types/liveStats";

/**
 * Ana sayfa güven sayaçları — Jale panelinin canlı verisinden beslenir.
 * Hiçbir zaman uydurma sayı göstermez: veri gelene kadar ince bir iskelet,
 * veri hiç gelmezse (API kapalı) bölüm gizlenir.
 *
 * İki mod (Jale API sürümüne göre otomatik):
 *   - v2 (activeStores + allTime var): Aktif mağaza · Ortalama ROAS · Toplam reklam cirosu
 *   - v1 (yalnızca today/week/month):  Ortalama ROAS · Son 30 günde ciro · Son 30 günde sipariş
 */

interface StatsApiResponse {
  success: boolean;
  data?: LiveStats;
}

interface Stat {
  value: React.ReactNode;
  label: string;
}

function computeStats(data: LiveStats): Stat[] {
  const roas =
    data.month.spend > 0 ? data.month.revenue / data.month.spend : 0;

  const roasStat: Stat = {
    value: <CountUp end={roas} decimals={1} suffix="x" />,
    label: "ortalama ROAS (son 30 gün)",
  };

  // v2: aktif mağaza sayısı ve tüm zamanlar toplamı mevcut
  if (typeof data.activeStores === "number" && data.allTime) {
    return [
      {
        value: <CountUp end={data.activeStores} suffix="+" />,
        label: "aktif yönetilen mağaza",
      },
      roasStat,
      {
        value: (
          <CountUp
            end={data.allTime.revenue / 1_000_000}
            decimals={1}
            prefix="₺"
            suffix="M+"
          />
        ),
        label: "toplam reklam kaynaklı ciro",
      },
    ];
  }

  // v1: yalnızca canlı 30 günlük metrikler (hepsi gerçek)
  return [
    roasStat,
    {
      value: (
        <CountUp
          end={data.month.revenue / 1_000_000}
          decimals={1}
          prefix="₺"
          suffix="M+"
        />
      ),
      label: "son 30 günde yönetilen ciro",
    },
    {
      value: <CountUp end={data.month.sales} suffix="+" />,
      label: "son 30 günde sipariş",
    },
  ];
}

export default function TrustStats() {
  const [stats, setStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/live-stats")
      .then((res) => res.json())
      .then((json: StatsApiResponse) => {
        if (!cancelled && json.success && json.data) {
          setStats(computeStats(json.data));
        }
      })
      .catch(() => {
        // Sessizce yut — veri yoksa bölüm gizli kalır.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Veri yok: hiçbir uydurma sayı gösterme
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] py-8 text-center">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-medium text-ink-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
