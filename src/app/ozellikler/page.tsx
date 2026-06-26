import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

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
  accent: string;
  icon: ReactNode;
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
    accent: "from-brand-500 to-brand-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    ),
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
    accent: "from-green-500 to-green-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    ),
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
    accent: "from-violet-500 to-violet-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
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
    accent: "from-sky-500 to-sky-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    ),
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
    accent: "from-rose-500 to-rose-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    ),
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
    accent: "from-amber-500 to-amber-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    ),
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Özellikler", path: "/ozellikler" },
        ])}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            Tüm özellikler
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Mağazanı büyütmek için
            <span className="block bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              tasarlanmış araçlar
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            Jale, Trendyol satıcılarının Meta reklamlarını teknik bilgi gerektirmeden
            yönetebilmesi için geliştirildi. İşte kaputun altındakiler.
          </p>
        </div>

        {/* Özellik sayısı bandı */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {FEATURE_DETAILS.map((f) => (
              <div key={f.badge} className="flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${f.accent}`}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    {f.icon}
                  </svg>
                </div>
                <p className="text-center text-[10px] font-semibold leading-tight text-ink-500">{f.badge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl divide-y divide-ink-100">
          {FEATURE_DETAILS.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid items-center gap-12 py-20 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Text */}
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${feature.accent} px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {feature.icon}
                  </svg>
                  {feature.badge}
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  {feature.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">{feature.description}</p>
              </div>

              {/* Bullets card */}
              <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-7">
                <ul className="space-y-4">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-ink-700">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${feature.accent}`}>
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CPAS bilgi kutusu */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
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
