import type { Metadata } from "next";
import Link from "next/link";
import PricingSingle from "@/components/PricingSingle";
import FaqAccordion from "@/components/FaqAccordion";
import CtaSection from "@/components/CtaSection";
import { PRICING as DEFAULTS, formatTRY } from "@/lib/site";
import { getSettings } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// Fiyatlar admin panelinden güncellenebildiği için sayfa istek anında render edilir
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description:
    "CPAS Türkiye fiyatlandırması: 1. ay kurulum + yönetim paketi, 2. aydan itibaren aylık yönetim. Tek paket, şeffaf fiyat, gizli ücret yok, taahhüt yok.",
  alternates: { canonical: "/fiyatlandirma" },
};

const buildFaq = (setupFee: number, managementFee: number, setupDays: number) => [
  {
    question: "İlk ay neden daha yüksek?",
    answer: `İlk ay ücretine (${formatTRY(setupFee)} + KDV) tüm teknik kurulum dahildir: pazaryeri reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel/event ölçümleme, kampanya mimarisinin sıfırdan kurulması ve ilk ayın tam yönetimi. Bu, ortalama ${setupDays} iş günü süren yoğun bir mühendislik ve strateji çalışmasıdır. 2. aydan itibaren yalnızca aylık yönetim bedeli (${formatTRY(managementFee)} + KDV) ödersiniz.`,
  },
  {
    question: "Reklam bütçesi fiyata dahil mi?",
    answer:
      "Hayır. Meta'ya ödediğiniz reklam harcaması size aittir ve doğrudan kendi Meta reklam hesabınızdan tahsil edilir. Paranız bizim üzerimizden geçmez; harcamanın her kuruşunu kendi panelinizden görebilirsiniz. Bizim ücretimiz kurulum ve yönetim hizmetinin karşılığıdır.",
  },
  {
    question: "Birden fazla pazaryerinde mağazam var — fiyat değişir mi?",
    answer:
      "Hayır. Trendyol ve Hepsiburada mağazalarınız aynı paket kapsamında birlikte yönetilir. Amazon entegrasyonumuz da yakında aynı pakete dahil olacak.",
  },
  {
    question: "Taahhüt var mı? İstediğim zaman iptal edebilir miyim?",
    answer:
      "Taahhüt yok. Aylık yönetimi dilediğiniz ay sonunda durdurabilirsiniz. Kurduğumuz altyapı (katalog bağlantısı, piksel, kampanya yapısı) sizin hesaplarınızda kalır. Detaylar İptal ve İade Politikası sayfamızdadır.",
  },
  {
    question: "Aylık yönetim ödemesi nasıl yapılıyor?",
    answer:
      "İlk ay paketi sitemizden iyzico güvencesiyle kredi kartıyla ödenir (9'a kadar taksit). 2. aydan itibaren aylık yönetim bedeli her ay fatura karşılığı tahsil edilir.",
  },
  {
    question: "Neden kademeli plan yok?",
    answer:
      "Çünkü verdiğimiz emek mağaza büyüklüğüne göre azalmıyor. Her mağaza aynı kurulum titizliğini, aynı haftalık optimizasyon döngüsünü ve aynı raporlamayı alır. Tek fiyat, tek standart — sürpriz yok.",
  },
];

export default async function PricingPage() {
  const { pricing } = await getSettings();
  const PRICING_FAQ = buildFaq(
    pricing.setupFee,
    pricing.managementFee,
    pricing.setupDays ?? DEFAULTS.setupDays
  );
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Fiyatlandırma", path: "/fiyatlandirma" },
        ])}
      />
      <section className="bg-gradient-to-b from-ink-50 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Tek paket. Sürpriz yok.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Kademeli planlar, gizli kalemler, kur farkı yok. İlk ay kurulum + yönetim,
            sonrası aylık yönetim — hepsi bu.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PricingSingle />
        </div>
      </section>

      <section className="bg-ink-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900">
            Fiyatlandırma hakkında sık sorulanlar
          </h2>
          <div className="mt-10">
            <FaqAccordion items={PRICING_FAQ} />
          </div>
          <p className="mt-8 text-center text-sm text-ink-500">
            Başka sorunuz mu var?{" "}
            <Link href="/sss" className="font-semibold text-brand-700 underline underline-offset-2">
              Tüm SSS&apos;yi inceleyin
            </Link>{" "}
            veya{" "}
            <Link href="/iletisim" className="font-semibold text-brand-700 underline underline-offset-2">
              bize ulaşın
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
