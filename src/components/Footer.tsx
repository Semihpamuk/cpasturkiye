import Link from "next/link";
import { SITE } from "@/lib/site";

const PRODUCT_LINKS = [
  { href: "/satin-al", label: "Satın Al" },
  { href: "/ozellikler", label: "Özellikler" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/kurulum", label: "Kurulum Hizmeti" },
  { href: "/sss", label: "Sık Sorulan Sorular" },
];

const COMPANY_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/hizmet-sozlesmesi", label: "Hizmet Sözleşmesi" },
  { href: "/iptal-iade-politikasi", label: "İptal ve İade Politikası" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-bold text-white">
                J
              </span>
              <span className="font-display text-xl font-bold text-ink-900">Jale</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Türkiye&apos;nin ilk Trendyol–Meta CPAS reklam yönetim platformu.{" "}
              {SITE.slogan}
            </p>
            <p className="mt-4 text-sm text-ink-500">{SITE.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Ürün</h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Şirket</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Yasal</h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-8 sm:flex-row">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {SITE.company}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-ink-400">
            Jale, Meta veya Trendyol ile resmi bir ortaklık iddiasında bulunmaz. CPAS,
            Meta&apos;nın iş ortağı entegrasyon çözümüdür.
          </p>
        </div>
      </div>
    </footer>
  );
}
