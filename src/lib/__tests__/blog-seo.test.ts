import { describe, expect, test } from "vitest";
import { BLOG_POSTS } from "@/lib/blog";
import { META_DESCRIPTION_MAX } from "@/lib/seo";

/**
 * SERP'e basılan başlık ve açıklamanın kesilmemesini koruyan testler.
 *
 * 24 Eyl 2026 GSC denetimi: 11 yazının 11'inde başlık şablonla birlikte
 * 60 karakteri, açıklama 155'i aşıyordu; Google başlığı tam da satan
 * kısmından kırpıyor, açıklama ise kendi `metaDescription()` yardımcımız
 * tarafından cümle ortasında "…" ile kesiliyordu.
 */

/** Kök layout her başlığa " | CPAS Türkiye" ekler. */
const TITLE_TEMPLATE_SUFFIX = " | CPAS Türkiye";

/** Google başlığı ~600 pikselde keser; karakter karşılığı yaklaşık budur. */
const SERP_TITLE_MAX = 60;

/**
 * Henüz kısaltılmamış yazılar.
 *
 * Bu liste yalnızca KÜÇÜLMELİ. Bir yazıyı düzelttiğinizde buradan silin;
 * yeni yazı eklerken buraya eklemeyin — kurala uyarak yazın.
 */
const PENDING_SLUGS = new Set<string>([
  // 24 Eyl 2026: 11 yazının 11'i de kısaltıldı, liste boşaldı.
  // Yeni yazı eklerken buraya ekleme — kurala uyarak yaz.
]);

/** `generateMetadata` ile aynı kural: seoTitle varsa o, yoksa title. */
function serpTitleLength(post: { title: string; seoTitle?: string }): number {
  return (post.seoTitle ?? post.title).length + TITLE_TEMPLATE_SUFFIX.length;
}

describe("blog SERP metinleri", () => {
  const posts = BLOG_POSTS;

  test("en az bir yazı var", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  test("düzeltilmiş yazıların başlığı şablonla birlikte sınırı aşmaz", () => {
    // Arrange
    const migrated = posts.filter((p) => !PENDING_SLUGS.has(p.slug));

    // Act
    const tooLong = migrated
      .filter((p) => serpTitleLength(p) > SERP_TITLE_MAX)
      .map((p) => `${p.slug} (${serpTitleLength(p)})`);

    // Assert
    expect(tooLong).toEqual([]);
  });

  test("düzeltilmiş yazıların açıklaması kesilmeden sığar", () => {
    // Arrange
    const migrated = posts.filter((p) => !PENDING_SLUGS.has(p.slug));

    // Act
    const tooLong = migrated
      .filter((p) => p.excerpt.length > META_DESCRIPTION_MAX)
      .map((p) => `${p.slug} (${p.excerpt.length})`);

    // Assert — sığmayan açıklama metaDescription() tarafından "…" ile kesilir.
    expect(tooLong).toEqual([]);
  });

  test("bekleyen liste yalnızca gerçekten var olan yazıları içerir", () => {
    // Arrange
    const slugs = new Set(posts.map((p) => p.slug));

    // Act
    const stale = [...PENDING_SLUGS].filter((slug) => !slugs.has(slug));

    // Assert — yazı silindiyse ya da düzeltildiyse liste de temizlenmeli.
    expect(stale).toEqual([]);
  });

  test("bekleyen listedeki bir yazı artık kurala uyuyorsa listeden çıkarılmalı", () => {
    // Arrange
    const pending = posts.filter((p) => PENDING_SLUGS.has(p.slug));

    // Act
    const alreadyFixed = pending
      .filter(
        (p) => serpTitleLength(p) <= SERP_TITLE_MAX && p.excerpt.length <= META_DESCRIPTION_MAX
      )
      .map((p) => p.slug);

    // Assert — liste sessizce şişmesin diye ratchet iki yönlü çalışır.
    expect(alreadyFixed).toEqual([]);
  });
});
