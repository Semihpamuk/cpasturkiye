import Link from "next/link";
import Hero from "@/components/Hero";
import ReferencesBar from "@/components/ReferencesBar";
import SetupTimeline, { type TimelineStep } from "@/components/SetupTimeline";
import ManagementCycle from "@/components/ManagementCycle";
import ReportPreview from "@/components/ReportPreview";
import CaseStudies from "@/components/CaseStudies";
import LiveStatsBand from "@/components/LiveStatsBand";
import TestimonialsSpotlight from "@/components/TestimonialsSpotlight";
import PricingSingle from "@/components/PricingSingle";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import CtaSection from "@/components/CtaSection";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import JsonLd from "@/components/JsonLd";
import { SITE, PRICING, formatTRY } from "@/lib/site";

/* ─────────────────────────── İçerik verileri ─────────────────────────── */

const WHY_CPAS = [
  {
    title: "Pazaryerinin dışına çık",
    description:
      "Pazaryeri içi reklamlar yalnızca o an sitede gezinen kullanıcıya ulaşır. Meta CPAS ile ürünlerin Facebook ve Instagram'daki milyonlarca aktif kullanıcının karşısına çıkar.",
    stat: "10x",
    statLabel: "daha geniş erişilebilir kitle",
  },
  {
    title: "Rekabet hâlâ düşük",
    description:
      "Pazaryeri içinde aynı kategorideki tüm satıcılarla açık artırmadasın. CPAS kullanan satıcı sayısı Türkiye'de hâlâ çok az — alan erken davrananın.",
    stat: "%3",
    statLabel: "satıcının CPAS kullandığı tahmin ediliyor",
  },
  {
    title: "Tahmin değil, gerçek satış",
    description:
      "CPAS kampanyaları pazaryeri satış verisiyle eşleşir: hangi reklamın kaç sipariş getirdiğini kuruşu kuruşuna görürsün. Bütçe kararları veriyle alınır.",
    stat: "%100",
    statLabel: "satış bazlı ROAS ölçümü",
  },
];

const SETUP_STEPS: TimelineStep[] = [
  {
    day: "Gün 1",
    title: "Tanışma ve yetkilendirme",
    description:
      "Ekip arkadaşımız sizi arar, hedefleri netleştirir. Pazaryeri reklam yetkilendirmesi ve hesap erişimleri güvenli şekilde tanımlanır.",
    deliverable: "Kurulum planı paylaşılır",
  },
  {
    day: "Gün 2–3",
    title: "Meta Business ve katalog bağlantısı",
    description:
      "Meta Business Manager yapılandırılır; Trendyol/Hepsiburada ürün kataloğunuz CPAS ile Meta'ya bağlanır. Ürünleriniz otomatik akmaya başlar.",
    deliverable: "Katalog Meta'da canlı",
  },
  {
    day: "Gün 3–4",
    title: "Ölçümleme kurulumu",
    description:
      "Piksel ve dönüşüm event'leri kurulur, satış verisinin kampanyalarla doğru eşleştiği test edilir. Ölçemediğimiz şeyi yönetmeyiz.",
    deliverable: "Dönüşüm testi raporu",
  },
  {
    day: "Gün 4–6",
    title: "Kampanya mimarisi",
    description:
      "Katalog segmentlere ayrılır; retargeting ve prospecting katmanları, bütçe dağılımı ve teklif stratejisi mağazanıza özel kurgulanır.",
    deliverable: "Mimari şeması onayınıza sunulur",
  },
  {
    day: "Gün 6–7",
    title: "Test yayını ve canlıya alma",
    description:
      "Kampanyalar düşük bütçeyle test edilir, veri akışı doğrulanır ve tam bütçeyle canlıya alınır. İlk haftalık rapor düzeniniz kurulur.",
    deliverable: "Reklamlarınız yayında 🚀",
  },
];

const TECH_CARDS = [
  {
    title: "Katalog Segmentasyonu",
    description:
      "Tüm katalogla tek kampanya açmayız. Kâr marjı, stok derinliği ve satış hızına göre ürün setleri ayrıştırılır; her set kendi bütçe ve teklif stratejisini alır.",
    wide: false,
  },
  {
    title: "Retargeting + Prospecting Katmanları",
    description:
      "Ürününüzü görüp almayanlara dinamik hatırlatma (retargeting), benzer alışveriş davranışı gösteren yeni kitlelere keşif (prospecting). İki katman birbirini besler: keşfin getirdiği trafik, retargeting havuzunu büyütür.",
    wide: true,
  },
  {
    title: "Event ve Dönüşüm Ölçümleme",
    description:
      "Satış verisinin Meta'ya doğru dönmesi CPAS'ın kalbidir. Kurulumda her event tek tek test edilir; veri kopukluğu anında alarm üretir.",
    wide: false,
  },
  {
    title: "Bütçe Kaydırma Disiplini",
    description:
      "Bütçe kararları haftalık veriyle alınır: hedef ROAS'ın altında kalan setler küçülür, kazananlar ölçeklenir. Duyguyla değil, kuralla.",
    wide: false,
  },
  {
    title: "Stok ve Fiyat Senkronu",
    description:
      "Pazaryerinde stok bitti mi, fiyat değişti mi? Meta kataloğu otomatik güncellenir — stokta olmayan ürüne tek kuruş reklam harcanmaz.",
    wide: false,
  },
  {
    title: "Anomali İzleme",
    description:
      "ROAS düşüşü, harcama sıçraması, satış sıfırlanması gibi durumlar aynı gün tespit edilir ve müdahale edilir. Sorunlar haftalık raporu beklemez.",
    wide: false,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Reklamları kendimiz yönetmeye çalışıyorduk, Ads Manager'da kayboluyorduk. Devrettiğimizden beri hem kafamız rahat hem ROAS iki katından fazla. Haftalık raporlar sayesinde ne olup bittiğini her zaman biliyorum.",
    name: "Emre K.",
    role: "Trendyol satıcısı · Ev & Yaşam",
  },
  {
    quote:
      "En çok güven veren şey şeffaflık oldu. Hangi ürüne ne harcanıyor, ne dönüyor — hepsi önümde. İkinci ayın sonunda reklam kaynaklı ciromuz üçe katlandı.",
    name: "Selin A.",
    role: "Trendyol & Hepsiburada satıcısı · Kozmetik",
  },
  {
    quote:
      "Daha önce iki ajansla çalıştık, ikisi de pazaryeri reklamcılığını bilmiyordu. Bu ekip işin CPAS tarafını gerçekten biliyor; kurulum bir haftada bitti, ilk ay hedefin üstünde kapandı.",
    name: "Murat D.",
    role: "Hepsiburada satıcısı · Züccaciye",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "CPAS (Collaborative Ads) tam olarak nedir?",
    answer:
      "CPAS, Meta'nın pazaryeri satıcıları için geliştirdiği reklam çözümüdür: pazaryerindeki ürün kataloğunuz Meta'ya bağlanır ve Facebook/Instagram'da dinamik ürün reklamları yayınlanır. En kritik farkı, kampanya sonuçlarının pazaryerindeki gerçek satış verisiyle eşleşmesidir — hangi reklamın kaç sipariş getirdiğini net görürsünüz.",
  },
  {
    question: "Hangi pazaryerlerinde çalışıyorsunuz?",
    answer:
      "Trendyol ve Hepsiburada mağazaları için kurulum ve yönetim hizmeti veriyoruz. Amazon entegrasyonumuz çok yakında başlıyor. Birden fazla pazaryerinde mağazanız varsa tek pakette birlikte yönetilir.",
  },
  {
    question: "Reklam bütçesi fiyata dahil mi?",
    answer:
      "Hayır. Reklam bütçenizi doğrudan Meta'ya, kendi reklam hesabınızdan ödersiniz — paranız bizim üzerimizden geçmez, harcamanın her kuruşunu kendi panelinizden de görebilirsiniz. Bizim ücretimiz kurulum ve yönetim hizmetinin karşılığıdır.",
  },
  {
    question: "Kurulum ne kadar sürer, süreçte ne yapmam gerekir?",
    answer: `Kurulum ortalama ${PRICING.setupDays} iş günü sürer. Sizden yalnızca ilk gün yetkilendirmeleri onaylamanızı isteriz; teknik işlerin tamamını biz yürütürüz. Gün gün ilerleyişi size raporlarız.`,
  },
  {
    question: "Taahhüt var mı? İstediğim zaman bırakabilir miyim?",
    answer:
      "Taahhüt yok. İlk ay kurulum + yönetim paketiyle başlarsınız; 2. aydan itibaren aylık yönetim ücretiyle devam eder, dilediğiniz ay sonunda durdurabilirsiniz. Kurduğumuz altyapı (katalog bağlantısı, piksel, kampanya yapısı) sizin hesabınızda kalır.",
  },
  {
    question: "Sonuçları nasıl takip edeceğim?",
    answer:
      "Her hafta sade bir PDF rapor ve WhatsApp özeti alırsınız: harcama, ciro, ROAS, sipariş sayısı ve o hafta yapılan optimizasyonlar. Ayda bir de birlikte strateji görüşmesi yaparız. Ayrıca kendi Meta ve pazaryeri panellerinizden her şeyi anlık izleyebilirsiniz.",
  },
  {
    question: "Ödeme nasıl yapılıyor?",
    answer: `İlk ay paketi (${formatTRY(PRICING.setupFee)} + KDV) sitemizden iyzico güvencesiyle kredi kartıyla ödenir; 9'a kadar taksit imkânı vardır. Sonraki ayların yönetim bedeli (${formatTRY(PRICING.managementFee)} + KDV) fatura karşılığı tahsil edilir.`,
  },
];

/* ─────────────────────────── Yapısal veri (SEO) ─────────────────────────── */

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Meta CPAS Kurulum ve Reklam Yönetimi",
  serviceType: "Reklam yönetim hizmeti",
  provider: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
  },
  areaServed: "TR",
  description: SITE.description,
  offers: [
    {
      "@type": "Offer",
      name: "Kurulum + İlk Ay Yönetim",
      price: String(PRICING.setupFee),
      priceCurrency: "TRY",
    },
    {
      "@type": "Offer",
      name: "Aylık Yönetim (2. ay ve sonrası)",
      price: String(PRICING.managementFee),
      priceCurrency: "TRY",
    },
  ],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/* ─────────────────────────── Sayfa ─────────────────────────── */

export default function HomePage() {
  return (
    <>
      <JsonLd data={SERVICE_JSONLD} />
      <JsonLd data={FAQ_JSONLD} />

      {/* ═══ HERO ═══ */}
      <Hero />

      {/* ═══ REFERANSLAR ═══ */}
      <ReferencesBar />

      {/* ═══ NEDEN META CPAS? ═══ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Neden Meta CPAS?
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Pazaryeri içinde herkes aynı kalabalıkta.
              <span className="text-ink-400"> Kazanan, dışarıdan müşteri getiren.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {WHY_CPAS.map((card, i) => (
              <Reveal key={card.title} delay={i * 120}>
                <div className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5">
                  <p className="font-display text-4xl font-extrabold text-brand-600">
                    {card.stat}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
                    {card.statLabel}
                  </p>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {card.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KİM İÇİN? ═══ */}
      <section className="bg-ink-50/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Doğru eşleşme
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Her mağazayla çalışmıyoruz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">
              Operasyon kalitemizi korumak için her ay sınırlı sayıda yeni mağaza kabul
              ediyoruz. Sonuç alacağımıza inanmadığımız mağazayı almayız — bu iki taraf
              için de zaman kaybı.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-green-200 bg-white p-7">
                <p className="flex items-center gap-2 font-display text-base font-bold text-green-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Size göreyiz, eğer:
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
                  <li>• Trendyol veya Hepsiburada&apos;da <strong>aktif satış yapan</strong> bir mağazanız varsa</li>
                  <li>• Ürün kataloğunuz oturmuş, siparişleriniz düzenliyse</li>
                  <li>• Reklama aylık <strong>düzenli bütçe</strong> ayırabiliyorsanız</li>
                  <li>• Reklam yönetimini uzmana bırakıp işinize odaklanmak istiyorsanız</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-ink-200 bg-white p-7">
                <p className="flex items-center gap-2 font-display text-base font-bold text-ink-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Size göre değiliz, eğer:
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                  <li>• Mağazanız yeni açıldıysa ve henüz satış geçmişi yoksa</li>
                  <li>• Reklam bütçesi ayırmadan sonuç bekliyorsanız</li>
                  <li>• &ldquo;Bir haftada 10 kat satış&rdquo; tarzı mucize arıyorsanız — biz veriyle, adım adım büyütürüz</li>
                </ul>
                <p className="mt-5 rounded-xl bg-ink-50 p-4 text-xs leading-relaxed text-ink-500">
                  Emin değil misiniz?{" "}
                  <Link href="/iletisim" className="font-semibold text-brand-700 underline">
                    Ücretsiz ön analiz
                  </Link>{" "}
                  isteyin — mağazanıza bakıp dürüstçe söyleyelim.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 1. AY: KURULUM TIMELINE ═══ */}
      <section id="surec" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              1. Ay — Kurulum + İlk Ay Yönetim · {formatTRY(PRICING.setupFee)} + KDV
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              İlk {PRICING.setupDays} günde neler oluyor?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">
              Kurulum bir kara kutu değil. Hangi gün ne yapılıyor, elinize ne geçiyor —
              adım adım önünüzde.
            </p>
          </Reveal>
          <div className="mt-16">
            <SetupTimeline steps={SETUP_STEPS} />
          </div>
        </div>
      </section>

      {/* ═══ 2. AY+: YÖNETİM ═══ */}
      <section className="bg-ink-50/70 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              2. Ay ve Sonrası — Aylık Yönetim · {formatTRY(PRICING.managementFee)} + KDV/ay
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Her hafta dönen bir optimizasyon çarkı
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">
              Kurulum bitince iş asıl şimdi başlar. Kampanyalarınız her hafta bu döngüden
              geçer — ve her adımı raporda görürsünüz.
            </p>
          </Reveal>

          <div className="mt-12">
            <ManagementCycle />
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                &ldquo;Param nereye gidiyor?&rdquo; sorusu
                <span className="text-brand-600"> bizde sorulmaz.</span>
              </h3>
              <p className="mt-4 leading-relaxed text-ink-600">
                Her Pazartesi kutunuza düşen rapor; harcamayı, reklam kaynaklı ciroyu,
                ROAS&apos;ı ve o hafta yaptığımız her optimizasyonu tek sayfada özetler.
                Teknik bilgi gerekmez — okuyan herkes anlasın diye tasarlandı.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Haftalık PDF rapor + WhatsApp özeti",
                  "Yapılan her optimizasyonun gerekçesiyle listesi",
                  "Aylık birebir strateji görüşmesi",
                  "Dilediğiniz an ulaşabileceğiniz destek hattı",
                ].map((itemText) => (
                  <li key={itemText} className="flex items-start gap-3 text-sm font-medium text-ink-700">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {itemText}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={150}>
              <ReportPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ TEKNİK DERİNLİK (KOYU) ═══ */}
      <section className="section-dark relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="bg-dot-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
              İşin mutfağı
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              &ldquo;Reklam yönetiyoruz&rdquo; demek kolay.
              <span className="text-ink-400"> Nasıl yönettiğimizi gösterelim.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TECH_CARDS.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 90}
                className={card.wide ? "md:col-span-2" : ""}
              >
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.07]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/15 font-display text-sm font-extrabold text-brand-400 ring-1 ring-brand-500/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {card.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ═══ VAKALAR ═══ */}
          <div className="mt-24 lg:mt-32">
            <Reveal className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
                Vaka çalışmaları
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Rakamlar bizden iyi anlatıyor
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-ink-400">
                Onlarca mağazadan üç örnek. Marka adları gizli, sonuçlar gerçek —
                görüşmede sektörünüze benzer vakaları detaylı paylaşırız.
              </p>
            </Reveal>

            <div className="mt-12">
              <CaseStudies />
            </div>

            <Reveal className="mt-12">
              <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] py-8 text-center">
                <div>
                  <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                    <CountUp end={40} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-400">yönetilen mağaza</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                    <CountUp end={9.2} decimals={1} suffix="x" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-400">ortalama ROAS</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                    <CountUp end={250} prefix="₺" suffix="M+" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-400">reklam kaynaklı ciro</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CANLI İSTATİSTİK BANDI ═══ */}
      <LiveStatsBand />

      {/* ═══ MÜŞTERİ YORUMLARI ═══ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Müşterilerimiz
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Bizimle çalışanlar ne diyor?
            </h2>
          </Reveal>
          <TestimonialsSpotlight testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* ═══ FİYATLANDIRMA ═══ */}
      <section id="fiyat" className="bg-ink-50/70 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Fiyatlandırma
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Tek paket. Sürpriz yok.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">
              Kademeli planlar, gizli kalemler, kur farkı yok. İlk ay kurulum + yönetim,
              sonrası aylık yönetim — hepsi bu.
            </p>
          </Reveal>
          <div className="mt-12">
            <PricingSingle />
          </div>
        </div>
      </section>

      {/* ═══ SSS ═══ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Aklınıza takılanlar
            </h2>
            <p className="mt-4 text-ink-600">
              Cevabını bulamadığınız soru için{" "}
              <Link href="/sss" className="font-semibold text-brand-700 underline">
                SSS sayfamıza
              </Link>{" "}
              bakın ya da{" "}
              <Link href="/iletisim" className="font-semibold text-brand-700 underline">
                bize yazın
              </Link>
              .
            </p>
          </Reveal>
          <div className="mt-10">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* ═══ SON CTA ═══ */}
      <CtaSection />
    </>
  );
}
