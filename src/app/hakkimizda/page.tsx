import type { Metadata } from "next";
import Image from "next/image";
import CtaSection from "@/components/CtaSection";
import { SITE } from "@/lib/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hakkımızda — CPAS Türkiye",
  description:
    "CPAS Türkiye'nin hikayesi: yıllardır pazaryeri satıcılarının Meta CPAS reklamlarını yöneten ekip. Trendyol, Hepsiburada ve yakında Amazon için kurulum ve yönetim uzmanlığı.",
  alternates: { canonical: "/hakkimizda" },
};

const VALUES = [
  {
    title: "Şeffaflık",
    description:
      "Gerçek veriyle çalışırız. Raporlarda makyaj yok: hangi reklam ne kazandırdıysa onu görürsünüz. Fiyatlandırmada gizli kalem yok.",
  },
  {
    title: "Satıcının yanında",
    description:
      "Bütçenin sahibi sizsiniz; Meta'ya kendi hesabınızdan ödersiniz. Kurduğumuz her şey — katalog bağlantısı, piksel, kampanya yapısı — sizin mülkiyetinizde kalır.",
  },
  {
    title: "Uzmanlık",
    description:
      "CPAS, Türkiye pazarında yeni bir alan; biz değiliz. Yüzlerce kampanya ve milyonlarca liralık reklam harcaması yönetiminden gelen deneyimle çalışırız.",
  },
];

const MILESTONES = [
  {
    year: "2021",
    text: "İlk Trendyol–Meta CPAS bağlantılarını kurarak satıcı hesaplarını uçtan uca yönetmeye başladık.",
  },
  {
    year: "2023",
    text: "Yönettiğimiz aylık reklam harcaması 10M TL'yi aştı. Kurulum ve haftalık optimizasyon süreçlerimizi standartlaştırdık.",
  },
  {
    year: "2025",
    text: "Kampanya izleme, anomali tespiti ve raporlama altyapımızı kendi geliştirdiğimiz araçlarla otomatikleştirdik.",
  },
  {
    year: "2026",
    text: "Hepsiburada ile çalışmaya başladık; Amazon entegrasyonu için anlaşma aşamasındayız. Kurulum + yönetim hizmetini tek pakette, online ödemeyle sunuyoruz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            src="/og-image.png"
            alt="CPAS Türkiye"
            width={320}
            height={168}
            className="mx-auto h-20 w-auto rounded-xl"
            priority
          />
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            İşimiz belli: pazaryeri satıcısını Meta&apos;da büyütmek
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Yıllardır pazaryeri satıcılarının Meta CPAS reklamlarını yöneten ekibiz.
            Tek işimiz bu — ve bu yüzden iyi yapıyoruz.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="prose-sm mx-auto max-w-2xl space-y-5 leading-relaxed text-ink-600">
          <p>
            CPAS Türkiye, yıllardır pazaryeri satıcılarının Meta reklamlarını yöneten
            bir ekip. CPAS, Türkiye&apos;de kullanılmaya başlandığından beri sahadayız:
            katalog bağlantılarını kurduk, kampanyaları optimize ettik, satıcıların
            cirolarını katladık.
          </p>
          <p>
            Bu yıllar bize bir şeyi net öğretti: pazaryeri reklamcılığı, klasik dijital
            ajans işi değildir. Katalog segmentasyonu, satış verisi eşleştirmesi, stok
            senkronu, pazaryeri onay süreçleri — hepsi kendi uzmanlığını ister. Genel
            ajanslar bu alanda zorlanırken biz sadece bu işe odaklandık.
          </p>
          <p>
            Bugün Trendyol ve Hepsiburada satıcılarının Meta CPAS reklamlarını uçtan uca
            kuruyor ve yönetiyoruz; Amazon entegrasyonumuz da çok yakında başlıyor.
            Kampanya izleme, anomali tespiti ve raporlama süreçlerimizi kendi
            geliştirdiğimiz araçlarla destekliyoruz — ama işin direksiyonunda her zaman
            deneyimli bir insan var.
          </p>
          <p>
            Misyonumuz net: <strong className="text-ink-900">Türkiye&apos;deki pazaryeri
            satıcılarının, Meta&apos;nın reklam gücüne profesyonel kalitede, şeffaf ve
            ölçülebilir şekilde erişebilmesi.</strong>
          </p>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-ink-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Bugüne kadar
          </h2>
          <ol className="relative mt-10 space-y-8 border-l-2 border-brand-200 pl-8">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-500 bg-white">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {m.year}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink-900">
            Değerlerimiz
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-ink-200 bg-white p-7 shadow-sm"
              >
                <h3 className="font-display text-lg font-bold text-brand-700">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yasal bilgiler (iyzico uyumluluğu) */}
      <section className="border-t border-ink-100 bg-ink-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-lg font-bold text-ink-900">Şirket Bilgileri</h2>
          <div className="mt-4 grid gap-1.5 text-sm text-ink-600 sm:grid-cols-2">
            <p><span className="font-semibold text-ink-800">Ticaret Unvanı:</span> {SITE.company}</p>
            <p><span className="font-semibold text-ink-800">MERSİS No:</span> {SITE.mersis}</p>
            <p><span className="font-semibold text-ink-800">Ticaret Sicil No:</span> {SITE.tradeRegistryNo}</p>
            <p><span className="font-semibold text-ink-800">Vergi Dairesi / No:</span> {SITE.taxOffice} / {SITE.taxId}</p>
            <p><span className="font-semibold text-ink-800">Adres:</span> {SITE.address}</p>
            <p><span className="font-semibold text-ink-800">E-posta:</span> {SITE.email}</p>
            <p><span className="font-semibold text-ink-800">Telefon:</span> {SITE.phone}</p>
            <p><span className="font-semibold text-ink-800">KEP:</span> {SITE.kep}</p>
          </div>
          <p className="mt-4 text-xs text-ink-400">
            Yasal belgeler:{" "}
            <Link href="/mesafeli-satis-sozlesmesi" className="underline hover:text-brand-600">Mesafeli Satış Sözleşmesi</Link>
            {" · "}
            <Link href="/gizlilik-politikasi" className="underline hover:text-brand-600">Gizlilik Politikası</Link>
            {" · "}
            <Link href="/kvkk" className="underline hover:text-brand-600">KVKK</Link>
            {" · "}
            <Link href="/iptal-iade-politikasi" className="underline hover:text-brand-600">İptal ve İade</Link>
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
