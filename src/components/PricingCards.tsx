"use client";

import { useState } from "react";
import Link from "next/link";
import { PRICING, formatTRY } from "@/lib/site";

function discounted(amount: number, isYearly: boolean): number {
  return isYearly ? Math.round(amount * (1 - PRICING.yearlyDiscount)) : amount;
}

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  priceNote: string;
  cta: string;
  highlighted: boolean;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "Tek mağazasını büyütmek isteyen satıcılar için",
    monthlyPrice: PRICING.starter,
    priceNote: "1 mağaza dahil",
    cta: "Hemen Başla",
    highlighted: false,
    features: [
      { text: "1 Trendyol mağazası", included: true },
      { text: "Trendyol–Meta CPAS bağlantısı", included: true },
      { text: "Gerçek zamanlı ROAS takibi", included: true },
      { text: "Otomatik katalog senkronizasyonu", included: true },
      { text: "Günlük performans raporları", included: true },
      { text: "AI bütçe önerileri", included: true },
      { text: "E-posta desteği", included: true },
      { text: "Çoklu mağaza yönetimi", included: false },
      { text: "White-label raporlar", included: false },
      { text: "Ajans paneli", included: false },
    ],
  },
  {
    name: "Growth",
    tagline: "Birden fazla mağazası olan büyüyen satıcılar için",
    monthlyPrice: PRICING.starter,
    priceNote: `+ her ek mağaza ${formatTRY(PRICING.extraStore)}/ay`,
    cta: "Hemen Başla",
    highlighted: true,
    features: [
      { text: "İlk mağaza dahil, ek mağaza ekleyebilme", included: true },
      { text: "Trendyol–Meta CPAS bağlantısı", included: true },
      { text: "Gerçek zamanlı ROAS takibi", included: true },
      { text: "Otomatik katalog senkronizasyonu", included: true },
      { text: "AI bütçe optimizasyonu + anomali uyarıları", included: true },
      { text: "Mağazalar arası karşılaştırma raporları", included: true },
      { text: "Öncelikli destek (WhatsApp + e-posta)", included: true },
      { text: "Çoklu mağaza yönetimi", included: true },
      { text: "White-label raporlar", included: false },
      { text: "Ajans paneli", included: false },
    ],
  },
  {
    name: "Agency",
    tagline: "Çok sayıda satıcıyı yöneten dijital ajanslar için",
    monthlyPrice: PRICING.agencyPerStore,
    priceNote: "mağaza başına",
    cta: "Hemen Başla",
    highlighted: false,
    features: [
      { text: `${PRICING.agencyContactThreshold - 1} mağazaya kadar mağaza başına fiyat`, included: true },
      { text: `${PRICING.agencyContactThreshold}+ mağaza için özel teklif`, included: true },
      { text: "Tüm Growth özellikleri", included: true },
      { text: "Ajans paneli — tüm müşteriler tek ekranda", included: true },
      { text: "White-label PDF/Excel raporlar", included: true },
      { text: "Müşteri portali (her satıcıya kendi paneli)", included: true },
      { text: "Ekip üyesi davet etme ve yetkilendirme", included: true },
      { text: "Özel hesap yöneticisi", included: true },
      { text: "API erişimi", included: true },
      { text: "Öncelikli kurulum sırası", included: true },
    ],
  },
];

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div>
      {/* Aylık / Yıllık toggle */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-sm font-medium ${!isYearly ? "text-ink-900" : "text-ink-400"}`}
        >
          Aylık
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isYearly}
          aria-label="Yıllık ödemeye geç"
          onClick={() => setIsYearly(!isYearly)}
          className={`relative h-7 w-13 rounded-full transition-colors ${
            isYearly ? "bg-brand-600" : "bg-ink-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
              isYearly ? "left-7" : "left-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${isYearly ? "text-ink-900" : "text-ink-400"}`}
        >
          Yıllık
        </span>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          %20 indirim
        </span>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-ink-500">
        💳 Peşin fiyatına <strong className="text-ink-800">3 taksit</strong> — 6 ve 9
        taksit seçenekleri de mevcut
      </p>

      {/* Plan kartları */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-brand-300 bg-gradient-to-b from-brand-50/80 to-white shadow-xl shadow-brand-100"
                : "border-ink-200 bg-white shadow-sm"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                En Popüler
              </span>
            )}

            <h3 className="font-display text-xl font-bold text-ink-900">{plan.name}</h3>
            <p className="mt-2 min-h-10 text-sm text-ink-500">{plan.tagline}</p>

            <div className="mt-6">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold text-ink-900">
                  {formatTRY(discounted(plan.monthlyPrice ?? 0, isYearly))}
                </span>
                <span className="text-sm text-ink-500">/ay</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-500">{plan.priceNote}</p>
              {isYearly && (
                <p className="mt-1 text-xs font-medium text-green-700">
                  Yıllık ödemede — normal fiyat {formatTRY(plan.monthlyPrice ?? 0)}/ay
                </p>
              )}
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-2.5 text-sm">
                  {feature.included ? (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-ink-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={feature.included ? "text-ink-700" : "text-ink-400 line-through"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/satin-al"
              className={`mt-8 rounded-xl px-6 py-3 text-center text-sm font-semibold transition-all ${
                plan.highlighted
                  ? "bg-brand-600 text-white shadow-md hover:bg-brand-700 hover:shadow-lg"
                  : "border border-ink-300 text-ink-800 hover:border-brand-400 hover:text-brand-700"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Kurulum notu */}
      <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <p className="text-sm text-ink-700">
          <strong className="text-ink-900">Tüm planlara ek olarak tek seferlik kurulum hizmeti gereklidir:</strong>{" "}
          Trendyol yetkilendirme, Meta Business bağlantısı ve CPAS kurulumu —{" "}
          {formatTRY(PRICING.setupFee)} + KDV, yaklaşık {PRICING.setupDays} iş günü.{" "}
          <Link href="/kurulum" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            Kurulum sürecini incele →
          </Link>
        </p>
      </div>
    </div>
  );
}
