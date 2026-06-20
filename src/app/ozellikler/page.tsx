import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Özellikler",
  description:
    "Jale'nin Trendyol–Meta CPAS reklam yönetimi özellikleri: gerçek ROAS takibi, AI bütçe optimizasyonu, otomatik katalog senkronizasyonu, ajans paneli ve daha fazlası.",
  alternates: { canonical: "/ozellikler" },
};

interface FeatureDetail {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
}

const FEATURE_DETAILS: FeatureDetail[] = [
  {
    badge: "Kampanya Yönetimi",
    title: "Tek panelden CPAS yönetimi",
    description:
      "Meta Ads Manager'ın yüzlerce menüsü arasında kaybolma. Jale, Trendyol satıcısının ihtiyacı olan her şeyi tek sade ekranda toplar: kampanyalar, bütçeler, ürün setleri ve sonuçlar.",
    bullets: [
      "Facebook ve Instagram kampanyalarını tek ekrandan başlat, durdur, düzenle",
      "Trendyol ürün kataloğundan saniyeler içinde ürün seti oluştur",
      "Kampanya bütçelerini panelden anında güncelle",
      "Mobil uyumlu arayüz — mağazanı her yerden yönet",
    ],
  },
  {
    badge: "Raporlama",
    title: "Gerçek ROAS, gerçek satış verisi",
    description:
      "CPAS'in en büyük avantajı: reklam harcaman gerçek Trendyol siparişleriyle eşleşir. Hangi reklamın kaç sipariş, ne kadar ciro getirdiğini tahmin değil, veriyle görürsün.",
    bullets: [
      "Sipariş bazlı dönüşüm takibi — piksel tahmini değil, gerçek satış",
      "Günlük, haftalık, aylık performans raporları",
      "Ürün bazında harcama, tıklama ve ROAS kırılımı",
      "Excel ve PDF olarak dışa aktarma",
    ],
  },
  {
    badge: "Yapay Zeka",
    title: "AI destekli bütçe optimizasyonu",
    description:
      "Sistemin yapay zekası her gün tüm kampanyalarını tarar; kazandıran ürünleri ve zarar eden harcamaları tespit eder. Sana hazır aksiyon kartları sunar — tek tıkla onayla, sistem uygulasın.",
    bullets: [
      "Şampiyon ürünlere bütçe artırma önerileri",
      "Zarar eden ürün setlerini durdurma uyarıları",
      "Sabah raporu: güne tüm mağazanın özetiyle başla",
      "Onay mekanizması — AI asla sensiz harcama yapmaz",
    ],
  },
  {
    badge: "Otomasyon",
    title: "Otomatik katalog senkronizasyonu",
    description:
      "Trendyol'daki fiyat, stok ve ürün değişikliklerin Meta kataloğuna otomatik yansır. Stokta olmayan ürüne reklam harcamazsın, fiyat farkı nedeniyle müşteri kaybetmezsin.",
    bullets: [
      "Günlük otomatik ürün ve görsel senkronizasyonu",
      "Stok bitince reklamdan otomatik çıkarma",
      "Fiyat değişikliklerinin katalogda anında güncellenmesi",
      "Senkronizasyon hatalarında anında bildirim",
    ],
  },
  {
    badge: "İzleme",
    title: "Anomali uyarıları ve görev yönetimi",
    description:
      "ROAS aniden düştü mü? Harcama fırladı mı? Satışlar durdu mu? İstatistiksel anomali motoru 7/24 izler, sorunu yakalar, bildirim gönderir ve çözüm için görev açar.",
    bullets: [
      "Z-score tabanlı istatistiksel anomali tespiti",
      "Harcama sıçraması, satış düşüşü, sıfır satış uyarıları",
      "Kritik anomalilerde otomatik görev oluşturma",
      "Eşik bazlı özel alarm kuralları (örn. ROAS < 3 ise haber ver)",
    ],
  },
  {
    badge: "Ajanslar İçin",
    title: "Ajans modu ve çoklu mağaza yönetimi",
    description:
      "Birden fazla Trendyol satıcısını yöneten ajanslar için tasarlandı. Tüm müşterilerin tek panelde, raporlar kendi markanla, her satıcıya kendi portali.",
    bullets: [
      "Sınırsız müşteri hesabını tek ekrandan yönetme",
      "White-label PDF/Excel raporlar — kendi logon, kendi markan",
      "Müşteri portali: satıcılar kendi verilerini görür, reklamlara dokunamaz",
      "Ekip üyesi davet etme ve rol bazlı yetkilendirme",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Mağazanı büyütmek için tasarlanmış özellikler
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Jale, Trendyol satıcılarının Meta reklamlarını teknik bilgi gerektirmeden
            yönetebilmesi için geliştirildi. İşte kaputun altındakiler.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-16">
          {FEATURE_DETAILS.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <span className="inline-block rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                  {feature.badge}
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  {feature.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">{feature.description}</p>
              </div>
              <ul className="space-y-3.5 rounded-2xl border border-ink-200 bg-ink-50/60 p-7">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm text-ink-700">
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
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink-900">
            CPAS nedir, neden önemli?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            CPAS (Collaborative Performance Advertising Solution), Meta&apos;nın pazaryeri
            satıcıları için geliştirdiği iş ortağı reklam çözümüdür. Trendyol kataloğun
            Meta&apos;ya bağlanır ve reklamların doğrudan Trendyol mağazana satış olarak
            döner — tüm dönüşümler gerçek sipariş verisiyle ölçülür.{" "}
            <Link href="/sss" className="font-semibold text-brand-700 underline underline-offset-2">
              SSS sayfasında daha fazlası →
            </Link>
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
