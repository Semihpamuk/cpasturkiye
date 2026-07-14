"use client";

import { useSettings, type ReferenceItem } from "@/lib/useSettings";

const FALLBACK_REFERENCES: ReferenceItem[] = [
  { name: "Modavera", url: "" },
  { name: "LunaHome Tekstil", url: "" },
  { name: "Trendline Ayakkabı", url: "" },
  { name: "Bella Cosmetics", url: "" },
  { name: "KidsJoy Oyuncak", url: "" },
  { name: "UrbanFit Spor", url: "" },
  { name: "Nordica Living", url: "" },
  { name: "Pearl Aksesuar", url: "" },
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
        Reklamlarını CPAS Türkiye&apos;nin yönettiği mağazalardan bazıları
      </p>
      <div className="relative mt-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-ticker items-center gap-12 px-6">
          {doubled.map((item, index) => (
            <span
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-lg font-bold text-ink-400 transition-colors hover:text-brand-600"
                >
                  {item.name}
                </a>
              ) : (
                <span className="font-display text-lg font-bold text-ink-400">
                  {item.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
