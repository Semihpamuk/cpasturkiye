import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import { PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kurulum Hizmeti",
  description: `Trendyol–Meta CPAS kurulumunu uzman ekibimiz yapar: Trendyol yetkilendirme, Meta Business kurulumu, katalog bağlantısı. ${PRICING.setupDays} iş günü, ${formatTRY(PRICING.setupFee)} + KDV.`,
};

const TIMELINE = [
  {
    day: "1. Gün",
    title: "Başlangıç görüşmesi ve yetkilendirme",
    description:
      "Sizinle online bir başlangıç toplantısı yapıyoruz. Trendyol Satıcı Paneli üzerinden reklam yetkilendirme sürecini birlikte başlatıyoruz ve gerekli erişimleri tanımlıyoruz.",
  },
  {
    day: "2-3. Gün",
    title: "Trendyol reklam yetkisi onayı",
    description:
      "Trendyol tarafında mağazanız için CPAS reklam yetkisi onay sürecini takip ediyoruz. Bu aşamada mağaza kataloğunuzun reklamlara uygunluğunu da kontrol ediyoruz.",
  },
  {
    day: "4-5. Gün",
    title: "Meta Business Manager kurulumu",
    description:
      "Meta Business Manager hesabınızı kuruyor veya mevcut hesabınızı düzenliyoruz: reklam hesabı, ödeme yöntemi, sayfa bağlantıları ve gerekli izinler. Trendyol kataloğunuzu Meta'ya bağlıyoruz.",
  },
  {
    day: "6. Gün",
    title: "CPAS bağlantısı ve Jale entegrasyonu",
    description:
      "CPAS katalog segmentinizi oluşturup reklam hesabınızla eşleştiriyoruz. Mağazanızı Jale paneline bağlıyor, veri akışını ve satış eşleştirmesini test ediyoruz.",
  },
  {
    day: "7. Gün",
    title: "Test, eğitim ve teslim",
    description:
      "İlk test kampanyasını birlikte kuruyoruz. Size panelin kullanımını anlatan birebir eğitim veriyoruz. Sistem teslim — artık reklamlarınızı yönetmeye hazırsınız.",
  },
];

const INCLUDED = [
  "Trendyol Satıcı Paneli reklam yetkilendirme süreci yönetimi",
  "Meta Business Manager kurulumu veya mevcut hesap düzenlemesi",
  "Reklam hesabı, sayfa ve ödeme yapılandırması",
  "CPAS katalog bağlantısı ve segment oluşturma",
  "Jale paneline mağaza entegrasyonu ve veri doğrulama",
  "İlk test kampanyasının birlikte kurulması",
  "Birebir panel kullanım eğitimi (online)",
  "Kurulum sonrası 14 gün öncelikli destek",
];

export default function SetupPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            Tek seferlik profesyonel kurulum
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Teknik kurulumu biz yapıyoruz, sen satışa odaklan
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Trendyol yetkilendirmesinden Meta bağlantısına kadar tüm süreci uzman
            ekibimiz yönetir. {PRICING.setupDays} iş günü sonunda sistemin tamamen hazır.
          </p>
          <div className="mt-8 inline-flex flex-col items-center gap-1 rounded-2xl border border-brand-200 bg-white px-10 py-6 shadow-md">
            <span className="font-display text-4xl font-extrabold text-ink-900">
              {formatTRY(PRICING.setupFee)}
              <span className="text-lg font-semibold text-ink-500"> + KDV</span>
            </span>
            <span className="text-sm text-ink-500">
              tek seferlik · ortalama {PRICING.setupDays} iş günü
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900">
            7 günlük kurulum süreci
          </h2>
          <p className="mt-3 text-center text-ink-600">
            Adım adım ne olacağını bil — sürpriz yok.
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
            Kuruluma neler dahil?
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
            Trendyol ve Meta tarafındaki onay süreçlerine bağlı olarak değişebilir.
            Ortalama süre {PRICING.setupDays} iş günüdür; süreç boyunca her aşamada
            bilgilendirilirsiniz. Kurulum ücreti aboneliklerden bağımsız, tek seferlik
            tahsil edilir. Detaylar için{" "}
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
