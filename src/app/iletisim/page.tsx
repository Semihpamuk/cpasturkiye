import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "CPAS Türkiye ekibiyle iletişime geçin: demo talep edin, fiyat teklifi alın veya sorularınızı sorun. 1 iş günü içinde dönüş yapıyoruz.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Hadi konuşalım
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
            Mağazan CPAS&apos;e uygun mu? Hangi plan sana göre? Formu doldur, ekibimiz en
            geç 1 iş günü içinde seni arasın ve ücretsiz ön değerlendirme yapsın.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-900">E-posta</h3>
                <p className="mt-0.5 text-sm text-ink-600">{SITE.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Adres</h3>
                <p className="mt-0.5 text-sm text-ink-600">{SITE.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Telefon</h3>
                <p className="mt-0.5 text-sm text-ink-600">{SITE.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Yanıt süresi</h3>
                <p className="mt-0.5 text-sm text-ink-600">
                  Hafta içi 09:00 – 18:00, en geç 1 iş günü içinde dönüş
                </p>
              </div>
            </div>
          </div>

          {/* iyzico / yasal uyumluluk için şirket bilgileri */}
          <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50 p-6 text-xs text-ink-500 space-y-1.5">
            <p className="font-semibold text-ink-700 text-sm mb-3">Şirket Bilgileri</p>
            <p><strong>Unvan:</strong> {SITE.company}</p>
            <p><strong>Adres:</strong> {SITE.address}</p>
            <p><strong>MERSİS No:</strong> {SITE.mersis}</p>
            <p><strong>Ticaret Sicil No:</strong> {SITE.tradeRegistryNo}</p>
            <p><strong>Vergi Dairesi / No:</strong> {SITE.taxOffice} / {SITE.taxId}</p>
            <p><strong>E-posta:</strong> {SITE.email}</p>
            <p><strong>Telefon:</strong> {SITE.phone}</p>
            <p><strong>KEP:</strong> {SITE.kep}</p>
            <p className="pt-2">
              <Link href="/mesafeli-satis-sozlesmesi" className="underline hover:text-brand-600">Mesafeli Satış Sözleşmesi</Link>
              {" · "}
              <Link href="/gizlilik-politikasi" className="underline hover:text-brand-600">Gizlilik Politikası</Link>
              {" · "}
              <Link href="/iptal-iade-politikasi" className="underline hover:text-brand-600">İptal ve İade</Link>
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-200 bg-white p-8 shadow-xl shadow-ink-100 sm:p-10">
          <ContactForm />
        </div>
      </div>
      </section>
    </>
  );
}
