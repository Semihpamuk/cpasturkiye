import { SITE } from "@/lib/site";

/**
 * Sitenin kimlik katmanı: Organization + WebSite.
 *
 * Her sayfada basılır ve `@id` ile birbirine bağlanır. Google, marka bilgi
 * panelini ve AI cevaplarındaki kaynak atfını bu iki varlık üzerinden kurar;
 * sayfa bazlı Service/FAQPage/BlogPosting şemaları bunun yerine geçmez.
 */

const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE.name,
  legalName: SITE.company,
  url: SITE.url,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.url}/og-image.png`,
    width: 1200,
    height: 630,
  },
  image: `${SITE.url}/og-image.png`,
  description: SITE.description,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: "İstanbul",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: { "@type": "Country", name: "Türkiye" },
  knowsAbout: [
    "Meta CPAS",
    "Collaborative Ads",
    "Trendyol reklam yönetimi",
    "Hepsiburada reklam yönetimi",
    "pazaryeri reklamcılığı",
    "Facebook ve Instagram reklamları",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  ],
  identifier: [
    { "@type": "PropertyValue", name: "MERSİS", value: SITE.mersis },
    { "@type": "PropertyValue", name: "Vergi Kimlik No", value: SITE.taxId },
  ],
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "tr-TR",
  publisher: { "@id": ORGANIZATION_ID },
};
