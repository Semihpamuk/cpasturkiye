import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/kurulum", label: "Kurulum Hizmeti" },
  { href: "/blog", label: "CPAS Rehberleri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="font-display text-8xl font-extrabold text-brand-100">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">
          Sayfa bulunamadı
        </h1>
        <p className="mt-3 max-w-sm text-ink-600">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Aşağıdaki
          bağlantılardan devam edebilirsiniz.
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 shadow-sm transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/satin-al"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700"
        >
          Hemen Başla →
        </Link>
      </div>
    </section>
  );
}
