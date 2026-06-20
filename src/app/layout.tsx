import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Trendyol Reklamlarını Meta'dan Yönet | CPAS Platformu`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "CPAS",
    "CPAS nedir",
    "Trendyol CPAS",
    "Trendyol reklam",
    "Trendyol Meta reklam",
    "Trendyol Meta entegrasyonu",
    "Collaborative Performance Advertising Solution",
    "Trendyol satıcı reklam",
    "CPAS reklam yetkisi",
    "Trendyol Facebook reklam",
    "Trendyol Instagram reklam",
    "CPAS kurulum",
    "Trendyol ROAS",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Trendyol Reklamlarını Meta'dan Yönet`,
    description: SITE.description,
    images: [
      {
        url: `${SITE.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Trendyol CPAS Reklam Yönetim Platformu`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Trendyol Reklamlarını Meta'dan Yönet`,
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
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
