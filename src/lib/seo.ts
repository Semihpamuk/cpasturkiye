import { SITE } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Site köküne göre yol, örn. "/ozellikler". Ana sayfa için "" kullanın. */
  path: string;
}

/**
 * Schema.org BreadcrumbList JSON-LD üretir.
 * Google'da kırıntı navigasyonu (breadcrumb) zengin sonucu için kullanılır.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path}`,
    })),
  };
}

/** Arama sonucunda kesilmeden görünmesi için meta description üst sınırı */
export const META_DESCRIPTION_MAX = 155;

/**
 * Uzun metni meta description için kelime sınırında kısaltır; yalnızca <meta>
 * etiketi için — kartlarda/sayfada tam metin kullanılmaya devam eder.
 * Cümle sonu sınıra yakınsa orada keser, değilse kelime sonunda "…" ekler.
 */
export function metaDescription(text: string, max: number = META_DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  if (sentenceEnd >= max * 0.6) return window.slice(0, sentenceEnd + 1);
  const wordEnd = window.lastIndexOf(" ");
  return `${window.slice(0, wordEnd > 0 ? wordEnd : max).replace(/[,;:—-]$/, "")}…`;
}
