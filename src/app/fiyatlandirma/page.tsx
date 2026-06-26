import type { Metadata } from "next";
import Link from "next/link";
import PricingCards from "@/components/PricingCards";
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
    "Jale CPAS platformu fiyatları: tek mağaza, çoklu mağaza ve ajans planları. Yıllık ödemede %20 indirim. Şeffaf fiyatlandırma, gizli ücret yok.",
  alternates: { canonical: "/fiyatlandirma" },
};

const buildFaq = (setupFee: number) => [
  {
    question: "Kurulum ücreti neden ayrı?",
    answer: `Trendyol'dan reklam yetkisi alınması, Meta Business Manager kurulumu, CPAS katalog bağlantısı ve sistemin teste hazır hale getirilmesi uzman ekibimiz tarafından yapılan, ortalama ${DEFAULTS.setupDays} iş günü süren teknik bir süreçtir. Bu tek seferlik hizmetin bedeli ${formatTRY(setupFee)} + KDV'dir. Dilersen satın alma sırasında siparişe ekleyebilir, dilersen daha sonra ayrıca ödeyebilirsin.`,
  },
  {
    question: "Mağaza sayımı sonradan artırabilir miyim?",
    answer:
      "Evet. Panelden veya hesap yöneticinizle iletişime geçerek istediğiniz zaman yeni mağaza ekleyebilirsiniz. Her yeni mağaza için kurulum süreci ayrıca planlanır ve aboneliğinize ek mağaza ücreti yansıtılır.",
  },
  {
    question: "Yıllık ödemede indirim nasıl çalışıyor?",
    answer:
      "Yıllık ödemeyi seçtiğinizde tüm abonelik kalemlerinde %20 indirim uygulanır ve 12 aylık tutar tek seferde faturalandırılır. Kurulum ücreti indirimden ayrı, tek seferlik tahsil edilir.",
  },
  {
    question: "Reklam bütçesi fiyata dahil mi?",
    answer:
      "Hayır. Meta'ya ödediğiniz reklam harcaması size aittir ve doğrudan kendi Meta hesabınızdan tahsil edilir. Jale aboneliği yalnızca platform ve yönetim hizmetini kapsar. Bütçenizin tam kontrolü sizdedir.",
  },
  {
    question: "7 veya daha fazla mağazam var, ne yapmalıyım?",
    answer:
      "Agency planında 7 ve üzeri mağaza için özel hacim fiyatlandırması sunuyoruz. İletişim sayfasından bize ulaşın, ihtiyacınıza göre teklif hazırlayalım.",
  },
  {
    question: "İstediğim zaman iptal edebilir miyim?",
    answer:
      "Evet, abonelik taahhüt içermez. Dönem sonunda yenilenmemesini talep edebilirsiniz. Detaylar İptal ve İade Politikası sayfamızdadır.",
  },
];

export default async function PricingPage() {
  const { pricing } = await getSettings();
  const PRICING_FAQ = buildFaq(pricing.setupFee);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Fiyatlandırma", path: "/fiyatlandirma" },
        ])}
      />
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Şeffaf fiyatlandırma
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Mağaza sayına göre öde. Gizli ücret yok, sürpriz yok. Büyüdükçe planını
            yükselt.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PricingCards />
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
