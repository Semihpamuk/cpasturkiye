import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import { PRICING as DEFAULTS, formatTRY } from "@/lib/site";
import { getSettings } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// Fiyatlar admin panelinden güncellenebildiği için sayfa istek anında render edilir
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kurulum Süreci",
  description: `Meta CPAS kurulumunu uzman ekibimiz yapar: pazaryeri yetkilendirme, Meta Business kurulumu, katalog bağlantısı, ölçümleme ve kampanya mimarisi. ${DEFAULTS.setupDays} iş günü içinde reklamlarınız yayında.`,
  alternates: { canonical: "/kurulum" },
};

const TIMELINE = [
  {
    day: "1. Gün",
    title: "Başlangıç görüşmesi ve yetkilendirme",
    description:
      "Ekip arkadaşımız sizi arar; hedefleri, ürün gruplarını ve bütçe çerçevesini netleştiririz. Pazaryeri satıcı paneli üzerinden reklam yetkilendirme sürecini birlikte başlatır, gerekli erişimleri güvenli şekilde tanımlarız.",
  },
  {
    day: "2-3. Gün",
    title: "Reklam yetkisi onayı ve Meta Business kurulumu",
    description:
      "Pazaryeri tarafında CPAS reklam yetkisi onay sürecini biz takip ederiz. Eşzamanlı olarak Meta Business Manager hesabınızı kurar veya mevcut hesabınızı düzenleriz: reklam hesabı, ödeme yöntemi, sayfa bağlantıları ve izinler.",
  },
  {
    day: "3-4. Gün",
    title: "Katalog bağlantısı ve ölçümleme",
    description:
      "Ürün kataloğunuz CPAS ile Meta'ya bağlanır. Piksel ve dönüşüm event'leri kurulur; satış verisinin kampanyalarla doğru eşleştiği tek tek test edilir. Ölçemediğimiz şeyi yönetmeyiz.",
  },
  {
    day: "4-6. Gün",
    title: "Kampanya mimarisi",
    description:
      "Katalog; kâr marjı, stok derinliği ve satış hızına göre segmentlere ayrılır. Retargeting ve prospecting katmanları, bütçe dağılımı ve teklif stratejisi mağazanıza özel kurgulanır ve onayınıza sunulur.",
  },
  {
    day: "6-7. Gün",
    title: "Test yayını ve canlıya alma",
    description:
      "Kampanyalar düşük bütçeyle test edilir, veri akışı doğrulanır ve tam bütçeyle canlıya alınır. Haftalık rapor düzeniniz kurulur — artık her Pazartesi performansınız kutunuzda.",
  },
];

const INCLUDED = [
  "Pazaryeri reklam yetkilendirme sürecinin uçtan uca yönetimi",
  "Meta Business Manager kurulumu veya mevcut hesap düzenlemesi",
  "Reklam hesabı, sayfa ve ödeme yapılandırması",
  "CPAS katalog bağlantısı ve segment mimarisi",
  "Piksel, event ve dönüşüm ölçümleme kurulumu + testleri",
  "Retargeting + prospecting kampanya katmanlarının kurulması",
  "Test yayını, doğrulama ve canlıya alma",
  "İlk ayın tam yönetimi ve haftalık raporlama",
];

export default async function SetupPage() {
  const { pricing } = await getSettings();
  const PRICING = { ...DEFAULTS, ...pricing };
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Kurulum Süreci", path: "/kurulum" },
        ])}
      />
      <section className="bg-gradient-to-b from-ink-50 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            1. Ay — Kurulum + İlk Ay Yönetim
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Teknik kurulumu biz yapıyoruz, siz satışa odaklanın
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Pazaryeri yetkilendirmesinden kampanyaların canlıya alınmasına kadar tüm
            süreci uzman ekibimiz yönetir. {PRICING.setupDays} iş günü sonunda
            reklamlarınız yayında.
          </p>
          <div className="mt-8 inline-flex flex-col items-center gap-1 rounded-2xl border border-brand-200 bg-white px-10 py-6 shadow-md">
            <span className="font-display text-4xl font-extrabold text-ink-900">
              {formatTRY(PRICING.setupFee)}
              <span className="text-lg font-semibold text-ink-500"> + KDV</span>
            </span>
            <span className="text-sm text-ink-500">
              kurulum + ilk ay yönetim · ortalama {PRICING.setupDays} iş günü
            </span>
            <span className="mt-1 text-xs text-ink-400">
              2. aydan itibaren {formatTRY(PRICING.managementFee)} + KDV/ay
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/satin-al"
              className="rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition-colors"
            >
              Hemen Başla →
            </Link>
            <Link
              href="/iletisim"
              className="rounded-xl border-2 border-ink-200 bg-white px-8 py-3.5 text-sm font-bold text-ink-700 hover:border-ink-300 transition-colors"
            >
              Önce Görüşelim
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Taahhüt yok · Güvenli iyzico ödemesi · 9&apos;a kadar taksit
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900">
            Ortalama {PRICING.setupDays} iş günlük kurulum süreci
          </h2>
          <p className="mt-3 text-center text-ink-600">
            Adım adım ne olacağını bilin — kurulum bir kara kutu değil.
          </p>

          <ol className="relative mt-12 space-y-10 border-l-2 border-brand-200 pl-8">
            {TIMELINE.map((step) => (
              <li key={step.day} className="relative">
                <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-500 bg-white">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {step.day}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900">
            İlk ay paketine neler dahil?
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 text-sm text-ink-700"
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center text-sm text-ink-700">
            <strong className="text-ink-900">Önemli not:</strong> Kurulum süresi,
            pazaryeri ve Meta tarafındaki onay süreçlerine bağlı olarak değişebilir.
            Ortalama süre {PRICING.setupDays} iş günüdür; süreç boyunca her aşamada
            bilgilendirilirsiniz. Detaylar için{" "}
            <Link
              href="/hizmet-sozlesmesi"
              className="font-semibold text-brand-700 underline underline-offset-2"
            >
              Hizmet Sözleşmesi
            </Link>
            &apos;ni inceleyebilirsiniz.
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
