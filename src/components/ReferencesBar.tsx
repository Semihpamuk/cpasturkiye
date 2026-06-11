"use client";

import { useSettings } from "@/lib/useSettings";

const FALLBACK_REFERENCES = [
  "Modavera",
  "LunaHome Tekstil",
  "Trendline Ayakkabı",
  "Bella Cosmetics",
  "KidsJoy Oyuncak",
  "UrbanFit Spor",
  "Nordica Living",
  "Pearl Aksesuar",
];

export default function ReferencesBar() {
  const { references } = useSettings();
  const items = references.length > 0 ? references : FALLBACK_REFERENCES;

  // Kesintisiz kayan şerit için liste iki kez render edilir
  const doubled = [...items, ...items];

  return (
    <section
      aria-label="Referans mağazalar"
      className="border-y border-ink-100 bg-white py-6"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-400">
        Reklamlarını Jale ile yöneten mağazalar
      </p>
      <div className="relative mt-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-ticker items-center gap-12 px-6">
          {doubled.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              <span className="font-display text-lg font-bold text-ink-400">
                {name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
