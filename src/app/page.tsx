import Link from "next/link";
import DashboardMockup from "@/components/DashboardMockup";
import PricingCards from "@/components/PricingCards";
import CtaSection from "@/components/CtaSection";

const STEPS = [
  {
    number: "1",
    title: "Trendyol'u Bağla",
    description:
      "Trendyol mağazanın reklam yetkisini Jale'ye tanımlıyoruz. Ürün kataloğun otomatik olarak sisteme akıyor.",
  },
  {
    number: "2",
    title: "Meta'yı Bağla",
    description:
      "Meta Business hesabını CPAS ile Trendyol kataloğuna bağlıyoruz. Facebook ve Instagram reklamların satış verisiyle eşleşiyor.",
  },
  {
    number: "3",
    title: "Yönet ve Büyü",
    description:
      "Tek panelden kampanyalarını yönet, gerçek ROAS'ını gör, AI önerileriyle bütçeni en kârlı ürünlere yönlendir.",
  },
];

const FEATURES = [
  {
    title: "Tek Panelden CPAS Yönetimi",
    description:
      "Trendyol kataloğun ile Meta kampanyaların tek ekranda. Ads Manager karmaşası yok — sadece senin mağazan için tasarlanmış sade bir panel.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    ),
  },
  {
    title: "Gerçek ROAS Takibi",
    description:
      "Tahmin değil, gerçek: Trendyol satış verisiyle eşleşen kampanya raporları. Hangi reklamın kaç sipariş getirdiğini net olarak gör.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    ),
  },
  {
    title: "AI Destekli Bütçe Optimizasyonu",
    description:
      "Yapay zeka, kazandıran ürünlere bütçeyi otomatik kaydırmayı önerir. Sen onayla, sistem uygulasın — zarar eden reklamlara para akmasın.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    ),
  },
  {
    title: "Otomatik Katalog Senkronizasyonu",
    description:
      "Trendyol'da fiyat mı değişti, stok mu bitti? Meta kataloğun otomatik güncellenir. Stokta olmayan ürüne asla reklam harcamazsın.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    ),
  },
  {
    title: "Anomali Uyarıları ve Görevler",
    description:
      "ROAS düştü, harcama fırladı, satış sıfırlandı? Sistem anında yakalar, bildirim gönderir ve çözüm görevi açar. Hiçbir sorun gözden kaçmaz.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    ),
  },
  {
    title: "Ajans Modu ve Çoklu Mağaza",
    description:
      "Birden fazla mağazayı tek panelden yönet. White-label raporlar, müşteri portali ve ekip yetkilendirmesiyle ajansın için tam donanım.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Trendyol'da aylık 800 sipariş alıyorduk ama Meta reklamlarına nasıl geçeceğimizi bilmiyorduk. Jale ekibi 1 haftada her şeyi kurdu. 3. ayın sonunda ciromuz %60 arttı.",
    name: "Emre K.",
    role: "Tekstil Satıcısı — İstanbul",
  },
  {
    quote:
      "Ajans olarak 12 Trendyol satıcısının reklamını yönetiyoruz. Eskiden her hesap için ayrı ayrı Ads Manager açıyorduk. Şimdi hepsi tek panelde, raporlar otomatik gidiyor.",
    name: "Selin A.",
    role: "Dijital Ajans Kurucusu — Ankara",
  },
  {
    quote:
      "En çok korktuğum şey teknik kurulumdu. Meta Business, katalog, piksel... Hiçbiriyle uğraşmadım. ROAS'ım şu an 6'nın üzerinde ve her sabah AI raporumu okuyarak güne başlıyorum.",
    name: "Mehmet T.",
    role: "Ev Tekstili Satıcısı — Bursa",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Türkiye&apos;nin ilk Trendyol–Meta CPAS platformu
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
              Trendyol reklamlarını{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                Meta&apos;dan yönet.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Mağazanı Facebook ve Instagram&apos;ın milyonlarca kullanıcısına aç. Kurulumu
              biz yapıyoruz, sen tek panelden yönetiyorsun — gerçek satış verisiyle,
              gerçek ROAS ile.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/iletisim"
                className="rounded-xl bg-brand-600 px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl"
              >
                Hemen Başla
              </Link>
              <Link
                href="/ozellikler"
                className="rounded-xl border border-ink-300 px-8 py-3.5 text-center text-sm font-semibold text-ink-800 transition-colors hover:border-brand-400 hover:text-brand-700"
              >
                Özellikleri Keşfet
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
              <span className="flex items-center gap-2">
                <CheckIcon /> 7 günde kurulum
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon /> Gerçek satış verisi
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon /> Türkçe destek
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-brand-100/40 blur-3xl" />
            <div className="relative">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ====== NASIL ÇALIŞIR ====== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Nasıl çalışır?
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Üç adımda Trendyol mağazan Meta reklamlarıyla buluşur.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                {index < STEPS.length - 1 && (
                  <div className="absolute left-full top-8 hidden h-px w-8 -translate-x-4 bg-gradient-to-r from-brand-300 to-transparent md:block" />
                )}
                <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-xl font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ÖZELLİKLER ====== */}
      <section className="bg-ink-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Reklam yönetimi için ihtiyacın olan her şey
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Ads Manager&apos;ın karmaşası olmadan, mağazan için tasarlanmış araçlar.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-ink-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/ozellikler"
              className="text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Tüm özellikleri detaylı incele →
            </Link>
          </div>
        </div>
      </section>

      {/* ====== SOSYAL KANIT ====== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Satıcılar ne diyor?
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col rounded-2xl border border-ink-200 bg-white p-7 shadow-sm"
              >
                <div className="flex gap-1 text-brand-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <svg key={starIndex} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-100 pt-4">
                  <p className="text-sm font-semibold text-ink-900">{testimonial.name}</p>
                  <p className="text-xs text-ink-500">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FİYATLANDIRMA ÖZETİ ====== */}
      <section className="bg-ink-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Şeffaf fiyatlandırma
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Gizli ücret yok. Mağaza sayına göre öde, istediğin zaman yükselt.
            </p>
          </div>
          <div className="mt-14">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <CtaSection />
    </>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
