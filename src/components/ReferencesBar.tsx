"use client";

import { useSettings, type ReferenceItem } from "@/lib/useSettings";

/* Şerit yalnızca gerçek referans varken görünür. Uydurma marka adlarından
   oluşan bir fallback listesi TUTULMAZ — admin'de liste boşaltıldığında
   sahte müşteri adları yayına çıkardı. Az sayıda referans da inandırıcı
   durmadığı için asgari eşik altında bölüm tamamen gizlenir. */
const MIN_REFERENCES = 4;

// Logo varsa görsel, yoksa mağaza adı yazıyla gösterilir.
// Renkli logolar şeridi bozmasın diye normalde gri, hover'da renkli.
function ReferenceMark({ item }: { item: ReferenceItem }) {
  if (item.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo kaynakları admin panelinden serbest domain
      <img
        src={item.logo}
        alt={item.name}
        height={32}
        loading="lazy"
        decoding="async"
        className="h-8 w-auto max-w-[150px] object-contain font-display text-lg font-bold text-ink-400 opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      />
    );
  }

  return (
    <span className="font-display text-lg font-bold text-ink-500 transition-colors group-hover:text-brand-700">
      {item.name}
    </span>
  );
}

export default function ReferencesBar() {
  const { references } = useSettings();

  if (references.length < MIN_REFERENCES) return null;

  // Kesintisiz kayan şerit için liste iki kez render edilir
  const doubled = [...references, ...references];

  return (
    <section
      aria-label="Referans mağazalar"
      className="border-y border-ink-100 bg-white py-6"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">
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
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center"
                  aria-label={item.name}
                >
                  <ReferenceMark item={item} />
                </a>
              ) : (
                <span className="group flex items-center">
                  <ReferenceMark item={item} />
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
