import Link from "next/link";
import { PRICING } from "@/lib/site";

export default function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="section-dark relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-ink-950 px-8 py-20 text-center shadow-2xl sm:px-16">
        <div className="bg-dot-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            Mağazan hazır.
            <br className="hidden sm:block" /> Meta&apos;nın kitlesi seni bekliyor.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-400">
            Ödemenin ardından ekip arkadaşımız 24 saat içinde seni arar; ortalama{" "}
            {PRICING.setupDays} iş günü içinde reklamların yayında olur.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/satin-al"
              className="rounded-full bg-brand-600 px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-brand-500"
            >
              Hemen Başla →
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-white/15 px-9 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Önce Konuşalım
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
