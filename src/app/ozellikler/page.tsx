import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hizmet Kapsamı",
  description:
    "CPAS Türkiye hizmet kapsamı: Meta CPAS kurulumu, kampanya mimarisi, haftalık optimizasyon, gerçek satış verisiyle raporlama, katalog senkronu ve anomali izleme. Trendyol, Hepsiburada ve yakında Amazon.",
  alternates: { canonical: "/ozellikler" },
};

interface ServiceDetail {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  accent: string;
  icon: ReactNode;
}

const SERVICE_DETAILS: ServiceDetail[] = [
  {
    badge: "Kurulum",
    title: "Sıfırdan, uçtan uca teknik kurulum",
    description:
      "Pazaryeri yetkilendirmesinden Meta Business Manager'a, katalog bağlantısından ölçümlemeye kadar tüm teknik kurulum bizde. Siz yalnızca ilk gün yetkilendirmeleri onaylarsınız — gerisi ortalama 7 iş günü içinde hazır teslim edilir.",
    bullets: [
      "Trendyol / Hepsiburada CPAS reklam yetkilendirme sürecinin yönetimi",
      "Meta Business Manager kurulumu veya mevcut hesabın düzenlenmesi",
      "CPAS katalog bağlantısı ve ürün feed'i yapılandırması",
      "Piksel, event ve dönüşüm ölçümleme kurulumu + doğrulama testleri",
    ],
    accent: "from-brand-500 to-brand-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    ),
  },
  {
    badge: "Kampanya Mimarisi",
    title: "Mağazanıza özel kampanya mimarisi",
    description:
      "Tüm katalogla tek kampanya açıp beklemeyiz. Kataloğunuz kâr marjı, stok derinliği ve satış hızına göre segmentlere ayrılır; retargeting ve prospecting katmanları birbirini besleyecek şekilde kurgulanır.",
    bullets: [
      "Katalog segmentasyonu: şampiyon ürünler, yeni ürünler, sezonluklar",
      "Retargeting: ürününüzü görüp almayanlara dinamik hatırlatma",
      "Prospecting: benzer alışveriş davranışındaki yeni kitlelere keşif",
      "Bütçe dağılımı ve teklif stratejisinin mağazaya özel kurulması",
    ],
    accent: "from-violet-500 to-violet-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
  },
  {
    badge: "Yönetim",
    title: "Haftalık optimizasyon döngüsü",
    description:
      "Kurulum bitince asıl iş başlar. Kampanyalarınız her hafta aynı disiplinli döngüden geçer: izle, analiz et, optimize et, raporla. Bütçe kararları duyguyla değil, haftalık veriyle alınır.",
    bullets: [
      "Günlük harcama ve ROAS takibi",
      "Ürün bazlı performans kırılımı ve kreatif yorgunluğu analizi",
      "Zarar eden setlerin kapatılması, kazananların ölçeklenmesi",
      "Yeni segment ve kitle testlerinin planlı yürütülmesi",
    ],
    accent: "from-green-500 to-green-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    ),
  },
  {
    badge: "Raporlama",
    title: "Gerçek satış verisiyle şeffaf raporlama",
    description:
      "CPAS'in en büyük avantajı: reklam harcamanız gerçek pazaryeri siparişleriyle eşleşir. Her hafta sade bir raporla neyin harcandığını, neyin kazanıldığını ve ne yaptığımızı görürsünüz.",
    bullets: [
      "Haftalık PDF rapor + WhatsApp özeti",
      "Sipariş bazlı dönüşüm — piksel tahmini değil, gerçek satış",
      "Yapılan her optimizasyonun gerekçesiyle listelenmesi",
      "Aylık birebir strateji görüşmesi",
    ],
    accent: "from-sky-500 to-sky-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    ),
  },
  {
    badge: "İzleme",
    title: "7/24 anomali izleme ve hızlı müdahale",
    description:
      "ROAS aniden düştü mü? Harcama fırladı mı? Satışlar durdu mu? Sorunlar haftalık raporu beklemez — aynı gün tespit edilir, müdahale edilir ve size bildirilir.",
    bullets: [
      "Harcama sıçraması, satış düşüşü, sıfır satış uyarıları",
      "Stok tükenen ürünlerin reklamdan otomatik düşürülmesi",
      "Fiyat değişikliklerinin Meta kataloğuna otomatik yansıması",
      "Kritik durumlarda aynı gün telefonla bilgilendirme",
    ],
    accent: "from-rose-500 to-rose-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    ),
  },
  {
    badge: "Çoklu Pazaryeri",
    title: "Trendyol + Hepsiburada + yakında Amazon",
    description:
      "Birden fazla pazaryerinde satıyorsanız hepsi tek pakette, tek ekipte, tek raporda birleşir. Her kanalın kataloğu ayrı bağlanır, bütçeler kanal performansına göre yönetilir.",
    bullets: [
      "Trendyol ve Hepsiburada mağazalarının birlikte yönetimi",
      "Kanal bazlı performans kırılımı tek raporda",
      "Bütçenin kanallar arasında veriyle dağıtılması",
      "Amazon entegrasyonu çok yakında — mevcut müşterilere öncelik",
    ],
    accent: "from-amber-500 to-amber-700",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    ),
  },
];

export default function ServiceScopePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Hizmet Kapsamı", path: "/ozellikler" },
        ])}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-ink-50 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            Hizmet kapsamı
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            &ldquo;Yönetiyoruz&rdquo; derken
            <span className="block bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              tam olarak bunu yapıyoruz
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            Kurulumdan haftalık optimizasyona, raporlamadan anomali müdahalesine —
            paketin içinde ne var, madde madde.
          </p>
        </div>

        {/* Kapsam bandı */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {SERVICE_DETAILS.map((f) => (
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

      {/* Hizmet bölümleri */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl divide-y divide-ink-100">
          {SERVICE_DETAILS.map((service, index) => (
            <div
              key={service.title}
              className={`grid items-center gap-12 py-20 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Metin */}
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${service.accent} px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {service.icon}
                  </svg>
                  {service.badge}
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">{service.description}</p>
              </div>

              {/* Maddeler */}
              <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-7">
                <ul className="space-y-4">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-ink-700">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${service.accent}`}>
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
            CPAS (Collaborative Ads), Meta&apos;nın pazaryeri satıcıları için
            geliştirdiği reklam çözümüdür. Pazaryeri kataloğunuz Meta&apos;ya bağlanır
            ve reklamlarınız doğrudan mağazanıza satış olarak döner — tüm dönüşümler
            gerçek sipariş verisiyle ölçülür.{" "}
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
