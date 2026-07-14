"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import type { LiveStats, StatsBucket } from "@/types/liveStats";

type RangeKey = "today" | "week" | "month";

interface StatsApiResponse {
  success: boolean;
  data?: LiveStats;
  error?: string;
}

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "week", label: "Son 7 Gün" },
  { key: "month", label: "Son 30 Gün" },
];

// ── Ayarlar ──────────────────────────────────────────────────────────────────
const DISPLAY_MULTIPLIER = 1; // bandda gerçek (API) rakamları gösterilir — şişirme yok
const SALE_INTERVAL_MS = 7_000; // her 7 sn'de +1 satış (bugünde; aynı +1 haftaya & aya da yansır)
const CHASE = 0.06; // ekran değerinin hedefe yaklaşma hızı (giriş + sekme geçişi sayma hissi)

type Triple = { spend: number; sales: number; revenue: number };

function displayBucket(b: StatsBucket): Triple {
  return {
    spend: b.spend * DISPLAY_MULTIPLIER,
    sales: b.sales * DISPLAY_MULTIPLIER,
    revenue: b.revenue * DISPLAY_MULTIPLIER,
  };
}

export default function LiveStatsBand() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [range, setRange] = useState<RangeKey>("today");
  const [reduced, setReduced] = useState(false);
  const [display, setDisplay] = useState<Triple>({ spend: 0, sales: 0, revenue: 0 });

  const rangeRef = useRef<RangeKey>("today");
  const shownRef = useRef<Triple>({ spend: 0, sales: 0, revenue: 0 });
  const lastRoundedRef = useRef({ spend: -1, sales: -1, revenue: -1 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/live-stats")
      .then((res) => res.json())
      .then((json: StatsApiResponse) => {
        if (!cancelled && json.success && json.data) {
          setStats(json.data);
        }
      })
      .catch(() => {
        // Sessizce yut — bant zaten stats null iken hiç render edilmez.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    rangeRef.current = range;
  }, [range]);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced || !stats) return;

    // ── Oranları API verisinden türet (hard-code yok; ×5 oranlarda sadeleşir) ──
    // ROAS = ciro/harcama, AOV = ciro/sipariş, CPA = harcama/sipariş.
    // "Bugüne göre": önce bugünü dene; bugün boşsa hafta, sonra ay referans alınır.
    const t = displayBucket(stats.today);
    const w = displayBucket(stats.week);
    const m = displayBucket(stats.month);
    const ref =
      [t, w, m].find((x) => x.spend > 0 && x.revenue > 0 && x.sales > 0) ?? m;

    const aov = ref.sales > 0 ? ref.revenue / ref.sales : 0; // sipariş başına ciro
    const cpa = ref.sales > 0 ? ref.spend / ref.sales : 0; // sipariş başına harcama (=AOV/ROAS)

    // Tüm aralıklar için ORTAK delta: her 10 sn'de +1 satış.
    // Bugünde satış artınca aynı +1 hafta ve ay toplamına da eklenir; ciro/harcama
    // bu siparişe AOV ve CPA oranıyla yansır.
    const deltaOrders = (elapsedMs: number): number =>
      Math.floor(elapsedMs / SALE_INTERVAL_MS);

    let raf = 0;
    let startT = 0;

    const loop = (now: number) => {
      if (!startT) startT = now;
      const d = deltaOrders(now - startT);
      const base = displayBucket(stats[rangeRef.current]);

      // Sipariş deltasını oranlarla tüm metriklere oranlı yansıt:
      const target: Triple = {
        sales: Math.max(0, base.sales + d),
        revenue: Math.max(0, base.revenue + d * aov),
        spend: Math.max(0, base.spend + d * cpa),
      };

      // Ekran değeri hedefi yumuşakça takip eder (0'dan giriş + sekme geçişi sayması).
      const s = shownRef.current;
      const next: Triple = {
        spend: s.spend + (target.spend - s.spend) * CHASE,
        sales: s.sales + (target.sales - s.sales) * CHASE,
        revenue: s.revenue + (target.revenue - s.revenue) * CHASE,
      };
      shownRef.current = next;

      const r = {
        spend: Math.round(next.spend),
        sales: Math.round(next.sales),
        revenue: Math.round(next.revenue),
      };
      const lr = lastRoundedRef.current;
      if (r.spend !== lr.spend || r.sales !== lr.sales || r.revenue !== lr.revenue) {
        lastRoundedRef.current = r;
        setDisplay(next);
      }
      raf = requestAnimationFrame(loop);
    };

    // Orijinaldeki gibi: ekrana girince 0'dan başlasın
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        raf = requestAnimationFrame(loop);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stats, reduced]);

  if (!stats) return null;

  const shown = reduced ? displayBucket(stats[range]) : display;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-900 px-4 py-16 sm:px-6 lg:px-8"
    >
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
          <Metric label="Harcanan reklam bütçesi" value={shown.spend} prefix="₺" />
          <Metric label="Satış adedi" value={shown.sales} />
          <Metric label="Toplam ciro" value={shown.revenue} prefix="₺" />
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: number;
  prefix?: string;
}

function Metric({ label, value, prefix = "" }: MetricProps) {
  const formatted = Math.round(value).toLocaleString("tr-TR");
  return (
    <div>
      <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        {prefix}
        {formatted}
      </p>
      <p className="mt-2 text-sm font-medium text-ink-300">{label}</p>
    </div>
  );
}
