import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import CtaSection from "@/components/CtaSection";
import { PRICING, formatTRY } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular — CPAS, Kurulum ve Yönetim",
  description:
    "CPAS nedir? Kurulum nasıl işler? Reklam bütçesi kimde? Hangi pazaryerleri destekleniyor? CPAS Türkiye'nin kurulum ve yönetim hizmeti hakkında sık sorulan tüm sorular.",
  alternates: { canonical: "/sss" },
};

const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: "CPAS ve Hizmetimiz",
    items: [
      {
        question: "CPAS nedir?",
        answer:
          "CPAS (Collaborative Performance Advertising Solution / Collaborative Ads), Meta'nın pazaryeri satıcıları için geliştirdiği reklam çözümüdür. Pazaryerindeki ürün kataloğunuz Meta'ya bağlanır; Facebook ve Instagram'da verilen reklamlar doğrudan mağazanıza yönlenir ve satışlar gerçek sipariş verisiyle ölçülür. Yani 'reklamım işe yarıyor mu?' sorusunun cevabını tahminle değil, gerçek satış rakamlarıyla görürsünüz.",
      },
      {
        question: "CPAS Türkiye tam olarak ne yapıyor?",
        answer:
          "Trendyol, Hepsiburada ve yakında Amazon satıcıları için Meta CPAS reklamlarını uçtan uca kurar ve yönetiriz. İlk ay tüm teknik kurulum (yetkilendirme, katalog bağlantısı, ölçümleme, kampanya mimarisi) yapılır ve kampanyalar canlıya alınır; sonraki aylarda kampanyalarınız haftalık optimizasyon döngüsüyle bizim ekibimiz tarafından yönetilir. Panel öğrenmeniz, reklam yönetmeniz gerekmez — raporları okumanız yeterlidir.",
      },
      {
        question: "Hangi pazaryerlerinde çalışıyorsunuz?",
        answer:
          "Trendyol ve Hepsiburada aktif olarak destekleniyor; Amazon entegrasyonumuz çok yakında başlıyor. Birden fazla pazaryerinde mağazanız varsa hepsi tek pakette birlikte yönetilir — ikinci pazaryeri kurulum ve yönetimde %50 indirimli eklenir.",
      },
      {
        question: "Normal Meta reklamından farkı ne?",
        answer:
          "Normal Meta reklamlarında dönüşümler piksel tahminiyle ölçülür ve kendi e-ticaret siteniz gerekir. CPAS'te reklamlar doğrudan pazaryeri mağazanıza yönlenir ve her satış, pazaryerinin sipariş verisiyle birebir eşleşir. Kendi siteniz olmasa bile Meta'nın dev kitlesine reklam verebilirsiniz.",
      },
      {
        question: "Hangi satıcılar için uygun?",
        answer:
          "Pazaryerinde aktif satış yapan, kataloğu oturmuş ve reklama düzenli bütçe ayırabilen satıcılar için idealdir. Çok yeni açılmış, satış geçmişi olmayan mağazalarda reklam verisi optimize olacak kadar sinyal üretemeyebilir — bu durumda dürüstçe söyler, doğru zamanı birlikte planlarız.",
      },
      {
        question: "CPAS ile gerçekçi ROAS beklentisi ne olmalı?",
        answer:
          "Doğru kurulu bir CPAS kampanyasında, ilk 4–6 haftalık öğrenme sürecinden sonra ROAS tipik olarak 4–8 bandında seyreder. Retargeting kampanyaları (ürünü görüntüleyip almayan kullanıcılar) genellikle 8–15 bandına çıkar. Bu rakamlar kategori, kâr marjı ve bütçeye göre değişir — görüşmede sektörünüze benzer vakaların gerçek sonuçlarını paylaşırız.",
      },
    ],
  },
  {
    title: "Kurulum ve Başlangıç",
    items: [
      {
        question: "Kurulum süreci nasıl işliyor?",
        answer: `Kurulum, uzman ekibimiz tarafından yürütülen ortalama ${PRICING.setupDays} iş günlük bir süreçtir: pazaryeri reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel/event ölçümleme, kampanya mimarisi ve canlıya alma. Gün gün akışı Kurulum sayfamızda görebilirsiniz.`,
      },
      {
        question: "Teknik bilgim yok, sorun olur mu?",
        answer:
          "Hayır — hizmetimiz tam da bu yüzden var. Kurulumun ve yönetimin tamamını biz yapıyoruz. Sizden yalnızca ilk gün yetkilendirmeleri onaylamanızı isteriz; sonrasında işiniz haftalık raporu okumaktan ibarettir.",
      },
      {
        question: "Meta Business hesabım yoksa?",
        answer:
          "Sorun değil. Kurulum sürecinde Meta Business Manager hesabınızı sıfırdan biz oluşturuyoruz: reklam hesabı, ödeme yöntemi, sayfa bağlantıları dahil her şey pakete dahildir.",
      },
      {
        question: "Pazaryerinden nasıl yetki alınıyor?",
        answer:
          "Satıcı paneli üzerinden CPAS reklam yetkilendirme talebini birlikte başlatıyoruz. Onay süreci pazaryeri tarafında genellikle 2–5 iş günü sürer; biz süreci sizin adınıza takip ediyoruz ve gerekirse ek belge süreçlerini de yönetiyoruz.",
      },
      {
        question: "Ödeme yaptıktan sonra ne oluyor?",
        answer:
          "Ödemenin ardından ekip arkadaşımız 24 saat içinde (iş günü) sizi arar. Bu görüşmede hedefler netleşir, yetkilendirmeler planlanır ve kurulum takviminiz çıkarılır. Ortalama 7 iş günü sonunda reklamlarınız yayındadır.",
      },
    ],
  },
  {
    title: "Ücretlendirme",
    items: [
      {
        question: "Fiyatlandırma nasıl çalışıyor?",
        answer: `Tek seferlik kurulum paketi ${formatTRY(PRICING.setupFee)} + KDV'dir — buna tüm teknik kurulum ve ilk ayın yönetimi dahildir. Devam etmek isterseniz aylık yönetim ${formatTRY(PRICING.managementFee)} + KDV/ay'dır ve tamamen isteğe bağlıdır (taahhüt yok). İkinci pazaryeri %50 indirimli eklenir; havale/EFT ile öderseniz %5 indirim uygulanır. Gizli kalem, kur farkı yok.`,
      },
      {
        question: "Aylık yönetim ücretinin içinde neler var?",
        answer:
          "Haftalık optimizasyon döngüsü (izleme, analiz, bütçe yönetimi, yeni testler), stok/fiyat senkron takibi, 7/24 anomali izleme, haftalık PDF rapor + WhatsApp özeti, aylık strateji görüşmesi ve öncelikli destek. Meta'ya ödenen reklam bütçesi dahil değildir.",
      },
      {
        question: "Reklam bütçemi kim yönetiyor, para kimin hesabından çıkıyor?",
        answer:
          "Bütçenin sahibi sizsiniz ve Meta'ya doğrudan kendi reklam hesabınızdan ödersiniz — paranız bizim üzerimizden geçmez. Biz bütçenin nereye harcanacağını veriyle yönetiriz; harcamanın her kuruşunu kendi panelinizden de görebilirsiniz.",
      },
      {
        question: "Sözleşme veya taahhüt var mı?",
        answer:
          "Taahhüt yoktur. Aylık yönetimi dilediğiniz ay sonunda durdurabilirsiniz; kurduğumuz altyapı (katalog bağlantısı, piksel, kampanya yapısı) sizin hesaplarınızda kalır. Detaylar İptal ve İade Politikamızda yer alır.",
      },
      {
        question: "Ödeme nasıl yapılıyor?",
        answer:
          "Kurulum paketini kredi/banka kartıyla iyzico güvencesinde 9'a kadar taksitle ya da havale/EFT ile %5 indirimli ödeyebilirsiniz. Havalede ödeme sonrası dekontunuzu yükler, doğrulama sonrası siparişiniz onaylanır. Devam ederseniz aylık yönetim bedeli fatura karşılığı tahsil edilir.",
      },
    ],
  },
  {
    title: "Veri ve Güvenlik",
    items: [
      {
        question: "Verilerim güvende mi?",
        answer:
          "Evet. Tüm erişimler resmi yetkilendirme akışlarıyla yapılır, bağlantılar SSL üzerinden gerçekleşir ve verileriniz üçüncü taraflarla paylaşılmaz. Detaylar Gizlilik Politikamız ve KVKK Aydınlatma Metnimizde yer alır.",
      },
      {
        question: "Mağaza şifremi paylaşmam gerekiyor mu?",
        answer:
          "Hayır. Entegrasyonlar resmi yetkilendirme akışlarıyla (pazaryeri yetki tanımı ve Meta Business izinleri) yapılır. Şifrenizi hiçbir zaman istemeyiz, görmeyiz, saklamayız.",
      },
      {
        question: "Hizmeti bırakırsam hesaplarıma ne olur?",
        answer:
          "Her şey sizde kalır: Meta Business Manager, reklam hesabı, katalog bağlantısı ve kampanya yapıları sizin mülkiyetinizdedir. Ayrılırken erişimlerimizi kaldırır, isterseniz devir dokümanı hazırlarız.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Sık Sorulan Sorular", path: "/sss" },
        ])}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-gradient-to-b from-ink-50 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Sık sorulan sorular
          </h1>
          <p className="mt-5 text-lg text-ink-600">
            Aradığınız cevabı bulamadıysanız{" "}
            <Link href="/iletisim" className="font-semibold text-brand-700 underline underline-offset-2">
              bize ulaşın
            </Link>
            , 1 iş günü içinde dönüş yapalım.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="mb-5 font-display text-xl font-bold text-ink-900">
                {section.title}
              </h2>
              <FaqAccordion items={section.items} />
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
