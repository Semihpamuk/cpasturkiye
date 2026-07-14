"use client";

import { useEffect, useState } from "react";

/**
 * 2. ay ve sonrası: haftalık yönetim döngüsü.
 * Dört faz sırayla vurgulanır; her fazın altında o hafta
 * yapılan işlerin örnekleri görünür.
 */

const PHASES = [
  {
    key: "izle",
    title: "İzle",
    description: "Kampanyalar günlük takip edilir: harcama, ROAS, stok ve fiyat değişimleri.",
    items: ["Günlük harcama kontrolü", "Anomali tespiti", "Stok/fiyat senkronu"],
  },
  {
    key: "analiz",
    title: "Analiz Et",
    description: "Hangi ürün, hangi kitle, hangi kreatif kazandırıyor — veriden okunur.",
    items: ["Ürün bazlı ROAS kırılımı", "Kitle performansı", "Kreatif yorgunluğu analizi"],
  },
  {
    key: "optimize",
    title: "Optimize Et",
    description: "Bütçe kazanan taraflara kaydırılır, zarar eden setler kapatılır.",
    items: ["Bütçe realokasyonu", "Teklif ayarları", "Yeni segment testleri"],
  },
  {
    key: "raporla",
    title: "Raporla",
    description: "Her hafta ne yapıldı, ne kazanıldı — sade bir raporla önünüzde.",
    items: ["Haftalık PDF rapor", "WhatsApp özeti", "Aylık strateji görüşmesi"],
  },
];

const CYCLE_MS = 3500;

export default function ManagementCycle() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || paused) return;

    const id = setInterval(() => {
      setActive((a) => (a + 1) % PHASES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {PHASES.map((phase, i) => {
        const isActive = i === active;
        return (
          <button
            key={phase.key}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={isActive}
            className={`relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-500 ${
              isActive
                ? "border-brand-300 bg-white shadow-lg shadow-brand-600/5"
                : "border-ink-200 bg-ink-50/50 hover:border-ink-300"
            }`}
          >
            {/* İlerleme çubuğu */}
            <span className="absolute inset-x-5 top-0 h-0.5 overflow-hidden rounded-full bg-ink-100">
              <span
                key={isActive ? `run-${active}` : "idle"}
                className={`block h-full origin-left bg-brand-500 ${isActive && !paused ? "animate-[cycle-progress_3.5s_linear]" : ""}`}
                style={{ transform: isActive ? undefined : "scaleX(0)" }}
              />
            </span>

            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-extrabold transition-colors duration-500 ${
                isActive ? "bg-brand-600 text-white" : "bg-ink-200 text-ink-500"
              }`}
            >
              {i + 1}
            </span>
            <h3 className="mt-3 font-display text-base font-bold text-ink-900">
              {phase.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
              {phase.description}
            </p>
            <ul
              className={`mt-3 space-y-1 overflow-hidden transition-all duration-500 ${
                isActive ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {phase.items.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-[11px] font-medium text-ink-700">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
