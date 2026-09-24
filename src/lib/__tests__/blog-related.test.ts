import { describe, expect, test } from "vitest";
import { BLOG_POSTS, getRelatedPosts } from "@/lib/blog";

/**
 * "İlgili yazılar" bloğu sitedeki tek yazı-yazı bağlantı kaynağı; bu yüzden
 * hangi yazının kaç bağlantı aldığı doğrudan SEO sonucu doğuruyor.
 *
 * 24 Eyl 2026: eski sürüm sıralamayı SOURCES dizisindeki konuma bırakıyordu;
 * en çok gösterim alan yazı (trendyol-meta-reklam-entegrasyonu-nedir) hiç
 * bağlantı almıyordu.
 */

/** Her yazının kaç yazıdan bağlantı aldığını sayar. */
function inboundLinkCounts(): Map<string, number> {
  const counts = new Map(BLOG_POSTS.map((post) => [post.slug, 0]));
  for (const post of BLOG_POSTS) {
    for (const related of getRelatedPosts(post.slug)) {
      counts.set(related.slug, (counts.get(related.slug) ?? 0) + 1);
    }
  }
  return counts;
}

describe("getRelatedPosts", () => {
  test("hiçbir yazı bağlantısız kalmaz", () => {
    // Arrange & Act
    const orphans = [...inboundLinkCounts()]
      .filter(([, count]) => count === 0)
      .map(([slug]) => slug);

    // Assert
    expect(orphans).toEqual([]);
  });

  test("istenen sayıda ve tekrarsız yazı döndürür", () => {
    for (const post of BLOG_POSTS) {
      // Act
      const related = getRelatedPosts(post.slug);

      // Assert
      expect(related).toHaveLength(Math.min(3, BLOG_POSTS.length - 1));
      expect(new Set(related.map((r) => r.slug)).size).toBe(related.length);
      expect(related.map((r) => r.slug)).not.toContain(post.slug);
    }
  });

  test("anahtar kelimesi örtüşen yazıyı örtüşmeyene tercih eder", () => {
    // Arrange — CPAS rehberi ile yetki rehberi ortak anahtar kelime taşıyor.
    const related = getRelatedPosts("cpas-nedir-trendyol-saticilari-icin-rehber");

    // Assert
    expect(related.map((r) => r.slug)).toContain("trendyol-cpas-reklam-yetkisi-nasil-alinir");
  });

  test("bilinmeyen slug için boş liste döner", () => {
    expect(getRelatedPosts("olmayan-yazi")).toEqual([]);
  });
});
