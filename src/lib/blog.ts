import {
  countWords,
  readingMinutes,
  type BlogPost,
  type BlogPostSource,
} from "@/lib/blog-types";

import cpasNedir from "@/content/blog/cpas-nedir-trendyol-saticilari-icin-rehber";
import neZamanGecmeli from "@/content/blog/trendyol-saticisi-meta-reklamlarina-ne-zaman-gecmeli";
import roasTaktikleri from "@/content/blog/roas-nasil-yukseltilir-cpas-kampanyalarinda-5-taktik";
import reklamYetkisi from "@/content/blog/trendyol-cpas-reklam-yetkisi-nasil-alinir";
import metaEntegrasyonu from "@/content/blog/trendyol-meta-reklam-entegrasyonu-nedir";
import icReklamKarsilastirma from "@/content/blog/cpas-ile-trendyol-ic-reklam-karsilastirma";
import hepsiburadaKurulum from "@/content/blog/hepsiburada-cpas-kurulumu-adim-adim";
import maliyetRehberi from "@/content/blog/cpas-maliyeti-ve-butce-planlamasi";
import satisGetirmiyor from "@/content/blog/cpas-kampanyasi-neden-satis-getirmiyor";
import ajansSecimi from "@/content/blog/cpas-ajansi-nasil-secilir";
import businessManager from "@/content/blog/meta-business-manager-kurulumu-pazaryeri-saticilari";

export type { BlogBlock, BlogFaq, BlogPost } from "@/lib/blog-types";

/**
 * Yayın sırası — listede yukarıdan aşağıya bu sırayla görünür.
 * İlk kayıt blog sayfasında öne çıkan yazı olarak basılır.
 */
const SOURCES: BlogPostSource[] = [
  cpasNedir,
  reklamYetkisi,
  hepsiburadaKurulum,
  maliyetRehberi,
  satisGetirmiyor,
  roasTaktikleri,
  ajansSecimi,
  businessManager,
  metaEntegrasyonu,
  icReklamKarsilastirma,
  neZamanGecmeli,
];

/** Okuma süresi ve kelime sayısı içerikten türetilir, elle girilmez. */
function enrich(source: BlogPostSource): BlogPost {
  const wordCount = countWords(source.content);
  return { ...source, wordCount, readingMinutes: readingMinutes(wordCount) };
}

export const BLOG_POSTS: BlogPost[] = SOURCES.map(enrich);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Yazının son güncellenme tarihi — `updated` yoksa yayın tarihine düşer. */
export function lastModified(post: BlogPost): string {
  return post.updated ?? post.date;
}

/**
 * Aynı kategorideki diğer yazılar; yazının altına iç link olarak basılır.
 * Kategori eşleşmesi yetmezse listeden tamamlanır — iç linkler taranabilirlik
 * için önemli, yazının ilgili yazısı olmaması kabul edilebilir değil.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const others = BLOG_POSTS.filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);
  const rest = others.filter((post) => post.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
