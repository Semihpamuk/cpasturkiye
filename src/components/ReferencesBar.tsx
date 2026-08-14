"use client";

import { useSettings, type ReferenceItem } from "@/lib/useSettings";

/* Şerit yalnızca gerçek referans varken görünür. Uydurma marka adlarından
   oluşan bir fallback listesi TUTULMAZ — admin'de liste boşaltıldığında
   sahte müşteri adları yayına çıkardı. Tek bir referans şerit görünümünü
   hak etmediği için asgari eşik altında bölüm tamamen gizlenir. */
const MIN_REFERENCES = 3;

/* Ticker animasyonu translateX(-50%) ile döndüğü için şeridin iki yarısı
   birebir aynı olmalı. Az sayıda referansla tek yarı geniş ekranı doldurmaz
   ve dönüşte boşluk görünür; bu yüzden yarım şerit bu sayıya ulaşana kadar
   tekrarlanır, sonra ikiye katlanır. */
const MIN_ITEMS_PER_HALF = 8;

/* Logo + mağaza adı birlikte gösterilir. Pazaryeri satıcı logoları kendi
   arka planı olan kare avatarlar; grayscale altında üçü de gri kutuya
   dönüşüp okunmuyordu, bu yüzden renk korunur ve kare zemin yuvarlatılıp
   ince bir çerçeveyle beyaz şeritten ayrılır. Adın yazıyla tekrarlanması
   logo okunmadığında da referansın kim olduğunu bırakır. */
function ReferenceMark({ item }: { item: ReferenceItem }) {
  return (
    <>
      {item.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- logo kaynakları admin panelinden serbest domain
        <img
          src={item.logo}
          // Ad hemen yanında yazıyla da geçtiği için logo dekoratiftir;
          // alt dolu olsaydı ekran okuyucu adı iki kez seslendirirdi.
          alt=""
          height={44}
          loading="lazy"
          decoding="async"
          className="h-11 w-11 shrink-0 rounded-xl object-contain opacity-90 ring-1 ring-ink-100 transition duration-300 group-hover:opacity-100 group-hover:ring-brand-200"
        />
      )}
      <span className="font-display text-base font-semibold text-ink-600 transition-colors group-hover:text-brand-700">
        {item.name}
      </span>
    </>
  );
}

export default function ReferencesBar() {
  const { references } = useSettings();

  if (references.length < MIN_REFERENCES) return null;

  // Kesintisiz kayan şerit: yarım şerit doldurulur, sonra iki kez render edilir
  const repeatCount = Math.ceil(MIN_ITEMS_PER_HALF / references.length);
  const half = Array.from({ length: repeatCount }, () => references).flat();
  const doubled = [...half, ...half];

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
          {doubled.map((item, index) => {
            // Şeridi doldurmak için basılan kopyalar yalnızca görseldir; ekran
            // okuyucuya ve klavyeye ilk turdaki mağazalar bir kez sunulur.
            const isDuplicate = index >= references.length;

            return item.url ? (
              <a
                key={`${item.name}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 whitespace-nowrap"
                aria-hidden={isDuplicate || undefined}
                tabIndex={isDuplicate ? -1 : undefined}
              >
                <ReferenceMark item={item} />
              </a>
            ) : (
              <span
                key={`${item.name}-${index}`}
                className="group flex items-center gap-3 whitespace-nowrap"
                aria-hidden={isDuplicate || undefined}
              >
                <ReferenceMark item={item} />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
