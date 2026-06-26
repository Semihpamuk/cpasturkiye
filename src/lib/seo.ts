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
