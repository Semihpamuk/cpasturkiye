import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Jale'nin hikayesi: yıllarca Trendyol satıcılarının Meta reklamlarını yönettik, şimdi bu deneyimi platforma dönüştürdük.",
};

const VALUES = [
  {
    title: "Şeffaflık",
    description:
      "Gerçek veriyle çalışırız. Raporlarda makyaj yok: hangi reklam ne kazandırdıysa onu görürsün. Fiyatlandırmada gizli kalem yok.",
  },
  {
    title: "Satıcının yanında",
    description:
      "Bütçenin sahibi sensin. AI önerilerimiz dahil hiçbir aksiyon onayın olmadan uygulanmaz. Platformu satıcıyı büyütmek için kurduk, bağımlı kılmak için değil.",
  },
  {
    title: "Uzmanlık",
    description:
      "CPAS Türkiye'de yeni; biz değiliz. Yüzlerce kampanya, milyonlarca liralık reklam harcaması yönetiminden gelen deneyimi platforma kodladık.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Reklam ajansından SaaS platformuna
          </h1>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="prose-sm mx-auto max-w-2xl space-y-5 leading-relaxed text-ink-600">
          <p>
            Jale, yıllardır Trendyol satıcılarının Meta reklamlarını yöneten bir ekibin
            ürünü. CPAS Türkiye&apos;de kullanılmaya başlandığından beri sahadayız:
            katalog bağlantılarını kurduk, kampanyaları optimize ettik, satıcıların
            cirolarını katladık.
          </p>
          <p>
            Zamanla şunu fark ettik: yaptığımız işin büyük kısmı tekrarlanabilir,
            ölçülebilir ve otomatikleştirilebilirdi. Bütçe optimizasyonu, anomali takibi,
            katalog senkronizasyonu, raporlama... Bunların hepsini her müşteri için elle
            yapmak yerine, bir platforma dönüştürdük.
          </p>
          <p>
            Bugün Jale; Trendyol satıcılarının kendi reklamlarını teknik bilgi
            gerektirmeden yönetebildiği, ajansların onlarca mağazayı tek panelden kontrol
            edebildiği bir SaaS platformu. Ajans deneyimimizden gelen tüm bilgi birikimi —
            hangi kampanya yapısı işler, bütçe ne zaman artırılır, hangi sinyal tehlike
            işaretidir — platformun yapay zekasına ve otomasyonlarına işlenmiş durumda.
          </p>
          <p>
            Misyonumuz net: <strong className="text-ink-900">Türkiye&apos;deki her Trendyol satıcısının,
            büyüklüğü ne olursa olsun, Meta&apos;nın reklam gücüne profesyonel kalitede
            erişebilmesi.</strong>
          </p>
        </div>
      </section>

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

      <CtaSection />
    </>
  );
}
