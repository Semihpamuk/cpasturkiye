import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Jale ekibiyle iletişime geçin: demo talep edin, fiyat teklifi alın veya sorularınızı sorun. 1 iş günü içinde dönüş yapıyoruz.",
};

export default function ContactPage() {
  return (
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
        </div>

        <div className="rounded-3xl border border-ink-200 bg-white p-8 shadow-xl shadow-ink-100 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
