import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-8 py-16 text-center shadow-2xl shadow-brand-200 sm:px-16">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Trendyol mağazan hazır. Meta&apos;nın gücü seni bekliyor.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-100">
          Kurulumdan optimizasyona kadar her adımda yanındayız. 7 günde sistemin hazır,
          reklamların yayında.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/satin-al"
            className="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Hemen Satın Al
          </Link>
          <Link
            href="/iletisim"
            className="w-full rounded-xl border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Önce Sizi Arayalım
          </Link>
        </div>
      </div>
    </section>
  );
}
