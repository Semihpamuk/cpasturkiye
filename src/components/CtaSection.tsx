import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-brand-100 bg-brand-50 px-8 py-20 text-center shadow-sm sm:px-16">
        <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink-900 sm:text-5xl">
          Trendyol mağazan hazır.
          <br className="hidden sm:block" /> Meta&apos;nın gücü seni bekliyor.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-500">
          Kurulumdan optimizasyona kadar her adımda yanındayız. Ortalama 7 iş günü içinde
          sistemin hazır, reklamların yayında.
        </p>
        <Link
          href="/satin-al"
          className="mt-10 inline-block rounded-full bg-brand-600 px-9 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          Hemen Başla
        </Link>
      </div>
    </section>
  );
}
