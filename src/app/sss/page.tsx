import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import CtaSection from "@/components/CtaSection";
import { PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "CPAS nedir? Trendyol mağazam Meta'ya nasıl bağlanır? Jale hakkında sık sorulan soruların yanıtları.",
};

const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: "CPAS ve Platform",
    items: [
      {
        question: "CPAS nedir?",
        answer:
          "CPAS (Collaborative Performance Advertising Solution), Meta'nın pazaryeri satıcıları için geliştirdiği iş ortağı reklam çözümüdür. Trendyol ürün kataloğunuz Meta'ya bağlanır; Facebook ve Instagram'da verdiğiniz reklamlar doğrudan Trendyol mağazanıza yönlenir ve satışlar gerçek sipariş verisiyle ölçülür. Yani 'reklamım işe yarıyor mu?' sorusunun cevabını tahminle değil, gerçek satış rakamlarıyla görürsünüz.",
      },
      {
        question: "Jale tam olarak ne yapıyor?",
        answer:
          "Jale, Trendyol–Meta CPAS reklamlarınızı tek panelden yönetmenizi sağlayan bir SaaS platformudur. Kampanya yönetimi, gerçek ROAS raporlama, otomatik katalog senkronizasyonu, AI destekli bütçe önerileri ve anomali uyarıları sunar. Meta Ads Manager'ın karmaşasıyla uğraşmadan reklamlarınızı yönetirsiniz.",
      },
      {
        question: "Normal Meta reklamından farkı ne?",
        answer:
          "Normal Meta reklamlarında dönüşümler piksel tahminiyle ölçülür ve kendi e-ticaret siteniz gerekir. CPAS'te ise reklamlar doğrudan Trendyol mağazanıza yönlenir ve her satış, Trendyol sipariş verisiyle birebir eşleşir. Kendi siteniz olmasa bile Meta'nın dev kitlesine reklam verebilirsiniz.",
      },
      {
        question: "Hangi satıcılar için uygun?",
        answer:
          "Trendyol'da aktif satış yapan ve aylık en az 100 sipariş hacmine ulaşmış satıcılar için idealdir. Bu hacmin altındaki mağazalarda reklam verisi optimize olacak kadar sinyal üretemeyebilir. Ayrıca birden fazla satıcıyı yöneten dijital ajanslar için özel ajans planımız mevcuttur.",
      },
    ],
  },
  {
    title: "Kurulum ve Başlangıç",
    items: [
      {
        question: "Kurulum süreci nasıl işliyor?",
        answer: `Kurulum, uzman ekibimiz tarafından yapılan ${PRICING.setupDays} iş günlük bir süreçtir: Trendyol reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, Jale entegrasyonu ve birebir eğitim. Ücreti tek seferlik ${formatTRY(PRICING.setupFee)} + KDV'dir. Detaylar Kurulum sayfamızdadır.`,
      },
      {
        question: "Teknik bilgim yok, sorun olur mu?",
        answer:
          "Hayır. Jale tam da bu yüzden var. Kurulumun tamamını biz yapıyoruz; size teslim ettiğimizde sistem çalışır durumda oluyor. Panel, teknik bilgisi olmayan satıcılar için tasarlandı ve teslimden önce birebir kullanım eğitimi veriyoruz.",
      },
      {
        question: "Meta Business hesabım yoksa?",
        answer:
          "Sorun değil. Kurulum sürecinde Meta Business Manager hesabınızı sıfırdan biz oluşturuyoruz: reklam hesabı, ödeme yöntemi, sayfa bağlantıları dahil her şey kurulum hizmetine dahildir.",
      },
      {
        question: "Trendyol'dan nasıl yetki alınıyor?",
        answer:
          "Trendyol Satıcı Paneli üzerinden CPAS reklam yetkilendirme talebini birlikte başlatıyoruz. Onay süreci Trendyol tarafında genellikle birkaç iş günü sürer; biz süreci sizin adınıza takip ediyoruz.",
      },
    ],
  },
  {
    title: "Ücretlendirme ve Abonelik",
    items: [
      {
        question: "Aylık ücretin içinde neler var?",
        answer:
          "Abonelik; Jale paneline erişim, kampanya yönetimi, raporlama, otomatik katalog senkronizasyonu, AI önerileri, anomali uyarıları ve destek hizmetini kapsar. Meta'ya ödenen reklam bütçesi dahil değildir — o tamamen sizin kontrolünüzdedir.",
      },
      {
        question: "Reklam bütçemi kim yönetiyor?",
        answer:
          "Bütçenin sahibi sizsiniz ve Meta'ya doğrudan kendi hesabınızdan ödersiniz. Jale, harcamanızı optimize etmenize yardım eder; AI önerileri ancak sizin onayınızla uygulanır. Sistem asla sizden habersiz harcama yapmaz.",
      },
      {
        question: "Sözleşme veya taahhüt var mı?",
        answer:
          "Aylık planlarda taahhüt yoktur; dilediğiniz dönem sonunda iptal edebilirsiniz. Yıllık planlarda %20 indirim karşılığında 12 aylık ödeme alınır. Detaylar İptal ve İade Politikamızda yer alır.",
      },
      {
        question: "Ajans olarak müşterilerime nasıl fiyatlandırma yapmalıyım?",
        answer:
          "Agency planında mağaza başına ödersiniz ve white-label raporlarla hizmeti kendi markanız altında sunarsınız. Kendi müşterilerinize uygulayacağınız fiyat tamamen size aittir. 7+ mağaza için özel hacim indirimi sunuyoruz.",
      },
    ],
  },
  {
    title: "Veri ve Güvenlik",
    items: [
      {
        question: "Verilerim güvende mi?",
        answer:
          "Evet. Tüm API erişim anahtarları veritabanında AES-256 ile şifrelenir, bağlantılar SSL üzerinden yapılır. Verileriniz üçüncü taraflarla paylaşılmaz. Detaylar Gizlilik Politikamız ve KVKK Aydınlatma Metnimizde yer alır.",
      },
      {
        question: "Mağaza şifremi paylaşmam gerekiyor mu?",
        answer:
          "Hayır. Entegrasyonlar resmi yetkilendirme akışlarıyla (Trendyol yetki tanımı ve Meta Business izinleri) yapılır. Şifrenizi hiçbir zaman istemeyiz, görmeyiz, saklamayız.",
      },
      {
        question: "Aboneliğimi iptal edersem verilerime ne olur?",
        answer:
          "İptal sonrası verileriniz 30 gün boyunca saklanır; bu sürede raporlarınızı dışa aktarabilirsiniz. Talep etmeniz halinde tüm verileriniz kalıcı olarak silinir.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
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
