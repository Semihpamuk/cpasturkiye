import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import { SITE } from "@/lib/site";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
