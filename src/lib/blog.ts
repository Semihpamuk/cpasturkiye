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
/** Aynı kategori, anahtar kelime örtüşmesine eşdeğer bir yakınlık sayılır. */
const SAME_CATEGORY_BONUS = 1;

function normalizeKeyword(keyword: string): string {
  return keyword.toLocaleLowerCase("tr").trim();
}

/**
 * "İlgili yazılar" bloğunu doldurur.
 *
 * Eskiden sıralama yoktu: aynı kategoridekiler + kalanlar birleştirilip ilk
 * 3'ü alınıyordu. Sonuç, SOURCES dizisindeki konuma göre belirleniyordu —
 * dizinin başındaki yazı 10 iç bağlantı alırken sonundaki yazılar sıfır
 * alıyordu. En çok gösterim alan yazı (trendyol-meta-reklam-entegrasyonu-nedir,
 * 236 gösterim) hiçbir yazıdan bağlantı almıyordu.
 *
 * Artık yakınlık anahtar kelime örtüşmesinden hesaplanıyor; hem bağlantılar
 * konuya göre anlamlı oluyor hem de dizideki konum belirleyici olmaktan çıkıyor.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const currentKeywords = new Set(current.keywords.map(normalizeKeyword));

  const others = BLOG_POSTS.filter((post) => post.slug !== slug);

  const byRelevance = others
    .map((post) => {
      const shared = post.keywords.filter((keyword) =>
        currentKeywords.has(normalizeKeyword(keyword))
      ).length;
      const score = shared + (post.category === current.category ? SAME_CATEGORY_BONUS : 0);
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || lastModified(b.post).localeCompare(lastModified(a.post)))
    .map((entry) => entry.post);

  // Son slot sırayla "bir sonraki yazı"ya ayrılır. Yalnızca benzerliğe göre
  // seçince birkaç yazı tüm bağlantıları topluyor, bazıları hiç bağlantı
  // alamıyordu; bu dönüşüm tüm yazıları kapsayan bir halka oluşturduğu için
  // her yazı en az bir iç bağlantı almış olur.
  const currentIndex = BLOG_POSTS.findIndex((post) => post.slug === slug);
  const rotationPick = BLOG_POSTS[(currentIndex + 1) % BLOG_POSTS.length];

  const picked: BlogPost[] = [];
  const add = (post: BlogPost | undefined) => {
    if (!post || post.slug === slug) return;
    if (picked.some((existing) => existing.slug === post.slug)) return;
    if (picked.length >= limit) return;
    picked.push(post);
  };

  byRelevance.slice(0, Math.max(0, limit - 1)).forEach(add);
  add(rotationPick);
  byRelevance.forEach(add); // limit dolmadıysa tamamla

  return picked;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
