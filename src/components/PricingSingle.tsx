"use client";

import Link from "next/link";
import { formatTRY } from "@/lib/site";
import { useSettings } from "@/lib/useSettings";

const INCLUDED = [
  "Pazaryeri reklam yetkilendirmesi ve Meta Business kurulumu",
  "CPAS katalog bağlantısı ve ürün feed'i yapılandırması",
  "Piksel, event ve dönüşüm ölçümleme kurulumu",
  "Kampanya mimarisi: retargeting + prospecting katmanları",
  "Haftalık optimizasyon ve bütçe yönetimi",
  "Her hafta PDF rapor + WhatsApp özeti",
  "Aylık strateji görüşmesi",
  "Öncelikli destek hattı",
];

/**
 * Tek paket fiyatlandırma: 1. ay kurulum + ilk ay yönetim,
 * 2. aydan itibaren aylık yönetim.
 */
export default function PricingSingle() {
  const { pricing } = useSettings();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-xl shadow-ink-900/5">
        {/* Üst vurgu şeridi */}
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Kurulum paketi */}
          <div className="relative border-b border-ink-100 p-8 lg:border-b-0 lg:border-r sm:p-10">
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
              Başlangıç · Tek seferlik
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
              Kurulum + İlk Ay Yönetim
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Yetkilendirmeden kampanyaların yayına alınmasına kadar tüm teknik
              kurulum ve <strong className="text-ink-800">ilk ayın yönetimi dahildir.</strong>
            </p>
            <div className="mt-6">
              {pricing.listSetupFee > pricing.setupFee && (
                <p className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-ink-400 line-through">
                    {formatTRY(pricing.listSetupFee)}
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                    Kampanya
                  </span>
                </p>
              )}
              <p className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                  {formatTRY(pricing.setupFee)}
                </span>
                <span className="text-sm font-semibold text-ink-500">+ KDV</span>
              </p>
            </div>
            <p className="mt-2 text-xs text-ink-500">
              Kartla <strong className="text-ink-700">9&apos;a kadar taksit</strong> ·
              Havale/EFT&apos;te <strong className="text-green-700">%5 indirim</strong>
            </p>
          </div>

          {/* İsteğe bağlı devam */}
          <div className="p-8 sm:p-10">
            <span className="inline-flex rounded-full bg-ink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-600 ring-1 ring-ink-200">
              İsteğe bağlı · Devam
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
              Aylık Yönetim
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              İlk ay pakete dahil. Sonrasında <strong className="text-ink-800">dilerseniz</strong>{" "}
              aylık yönetimle devam edersiniz — <strong className="text-ink-800">taahhüt yok</strong>,
              istediğiniz ay durdurabilirsiniz.
            </p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                {formatTRY(pricing.managementFee)}
              </span>
              <span className="text-sm font-semibold text-ink-500">+ KDV / ay</span>
            </p>
            <p className="mt-2 text-xs text-ink-500">
              Yalnızca devam ederseniz · Fatura karşılığı ·{" "}
              <strong className="text-brand-700">satın alırken %10 indirimle peşin eklenebilir</strong>
            </p>
          </div>
        </div>

        {/* İkili alım şeridi */}
        <div className="border-t border-ink-100 bg-brand-50/60 px-8 py-4 sm:px-10">
          <p className="text-center text-sm font-medium text-brand-800">
            🎉 <strong>İkili alım avantajı:</strong> İkinci pazaryerinizi (Trendyol +
            Hepsiburada) kurulum ve yönetimde <strong>%50 indirimle</strong> ekleyin.
          </p>
        </div>

        {/* Dahil olanlar */}
        <div className="border-t border-ink-100 bg-ink-50/50 p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
            Pakete dahil olanlar
          </p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {INCLUDED.map((itemText) => (
              <li key={itemText} className="flex items-start gap-2.5 text-sm text-ink-700">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {itemText}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs leading-relaxed text-ink-500">
              Reklam bütçeniz bu tutarlara dahil değildir; doğrudan Meta&apos;ya, kendi
              hesabınızdan ödenir. <br className="hidden sm:block" />
              Operasyon kalitesi için her ay <strong className="text-ink-700">sınırlı sayıda</strong> yeni mağaza kabul ediyoruz.
            </p>
            <Link
              href="/satin-al"
              className="w-full shrink-0 rounded-xl bg-brand-600 px-8 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg sm:w-auto"
            >
              Hemen Başla →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
