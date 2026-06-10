import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="font-display text-7xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">
          Sayfa bulunamadı
        </h1>
        <p className="mt-3 text-ink-600">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </section>
  );
}
