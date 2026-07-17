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
    "CPAS Türkiye fiyatlandırması: tek seferlik kurulum + ilk ay yönetim paketi, isteğe bağlı aylık yönetim. Havale/EFT'te %5 indirim, ikinci pazaryerinde %50 indirim, taahhüt yok.",
  alternates: { canonical: "/fiyatlandirma" },
};

const buildFaq = (setupFee: number, managementFee: number, setupDays: number) => [
  {
    question: "Kurulum paketine neler dahil?",
    answer: `Kurulum paketine (${formatTRY(setupFee)} + KDV) tüm teknik kurulum ve ilk ayın yönetimi dahildir: pazaryeri reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel/event ölçümleme, kampanya mimarisinin sıfırdan kurulması ve ilk ayın tam yönetimi. Bu, ortalama ${setupDays} iş günü süren yoğun bir mühendislik ve strateji çalışmasıdır.`,
  },
  {
    question: "Kurulumdan sonra devam etmek zorunda mıyım?",
    answer: `Hayır. Aylık yönetim tamamen isteğe bağlıdır — taahhüt yoktur. İlk ay pakete zaten dahil olduğu için sadece kurulumu alıp bırakabilirsiniz. Devam etmek isterseniz aylık yönetim bedeli (${formatTRY(managementFee)} + KDV/ay) fatura karşılığı tahsil edilir. Dilerseniz satın alırken bir sonraki ayı %10 indirimle peşin de ekleyebilirsiniz.`,
  },
  {
    question: "Reklam bütçesi fiyata dahil mi?",
    answer:
      "Hayır. Meta'ya ödediğiniz reklam harcaması size aittir ve doğrudan kendi Meta reklam hesabınızdan tahsil edilir. Paranız bizim üzerimizden geçmez; harcamanın her kuruşunu kendi panelinizden görebilirsiniz. Bizim ücretimiz kurulum ve yönetim hizmetinin karşılığıdır.",
  },
  {
    question: "Birden fazla pazaryerinde mağazam var — fiyat nasıl?",
    answer:
      "İlk pazaryeriniz tam fiyat, ikinci pazaryeriniz (örn. Trendyol + Hepsiburada) hem kurulumda hem aylık yönetimde %50 indirimlidir. Hepsi tek pakette birlikte yönetilir. Amazon entegrasyonumuz da yakında aynı yapıya dahil olacak.",
  },
  {
    question: "Nasıl ödeme yapabilirim?",
    answer:
      "İki seçenek var: (1) Kredi/banka kartı ile iyzico güvencesinde 9'a kadar taksit; (2) Havale/EFT ile %5 indirimli — ödeme sonrası dekontunuzu yükler, doğrulama sonrası siparişiniz onaylanır. İndirim kodları kart ödemesinde geçerlidir.",
  },
  {
    question: "Taahhüt var mı? İstediğim zaman iptal edebilir miyim?",
    answer:
      "Taahhüt yok. Devam ettiyseniz aylık yönetimi dilediğiniz ay sonunda durdurabilirsiniz. Kurduğumuz altyapı (katalog bağlantısı, piksel, kampanya yapısı) sizin hesaplarınızda kalır. Detaylar İptal ve İade Politikası sayfamızdadır.",
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
            Gizli kalem, kur farkı yok. Tek seferlik kurulum paketi (ilk ay yönetim
            dahil); devam etmek tamamen size kalmış — taahhüt yok.
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
