import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import SiteChrome from "@/components/SiteChrome";
import { ORGANIZATION_JSONLD, WEBSITE_JSONLD } from "@/lib/organization-schema";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Google Search Console doğrulama kodu.
 *
 * GSC'de "HTML etiketi" yöntemini seçtiğinizde verilen `content` değeridir.
 * Tanımlı değilse meta etiketi hiç basılmaz — boş bir doğrulama etiketi
 * göndermek GSC tarafında hatalı doğrulama denemesi olarak görünüyor.
 */
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Trendyol, Hepsiburada ve Amazon için Meta CPAS Reklam Yönetimi`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "CPAS",
    "CPAS nedir",
    "CPAS kurulum",
    "CPAS ajansı",
    "Trendyol CPAS",
    "Hepsiburada CPAS",
    "Amazon CPAS",
    "Trendyol reklam yönetimi",
    "Hepsiburada reklam yönetimi",
    "Trendyol Meta reklam",
    "Collaborative Ads",
    "pazaryeri reklam yönetimi",
    "Trendyol Facebook reklam",
    "Trendyol Instagram reklam",
    "Trendyol ROAS",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Pazaryeri Reklamlarınızı Meta'da Biz Yönetiyoruz`,
    description: SITE.description,
    images: [
      {
        url: `${SITE.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Meta CPAS Kurulum ve Reklam Yönetim Hizmeti`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Pazaryeri Reklamlarınızı Meta'da Biz Yönetiyoruz`,
    description: SITE.description,
    images: [`${SITE.url}/og-image.png`],
  },
  alternates: {
    canonical: SITE.url,
  },
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <JsonLd data={ORGANIZATION_JSONLD} />
        <JsonLd data={WEBSITE_JSONLD} />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
