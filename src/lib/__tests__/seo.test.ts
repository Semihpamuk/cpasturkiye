import { describe, expect, test } from "vitest";
import { META_DESCRIPTION_MAX, metaDescription } from "../seo";

describe("metaDescription", () => {
  test("kısa metni olduğu gibi bırakır, boşlukları sadeleştirir", () => {
    expect(metaDescription("  Kısa   bir\n açıklama. ")).toBe("Kısa bir açıklama.");
  });

  test("sınıra yakın cümle sonunda keser", () => {
    const text = "İlk cümle burada bitiyor. " + "x".repeat(120) + ". Sonraki cümle çok uzun ve kesilmeli.";
    const out = metaDescription(text, 155);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith(".")).toBe(true);
    expect(out).not.toContain("…");
  });

  test("cümle sonu yoksa kelime sınırında keser ve … ekler", () => {
    const text = Array(40).fill("kelime").join(" ");
    const out = metaDescription(text, 60);
    expect(out.length).toBeLessThanOrEqual(61);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/kelim…$/); // kelime ortasından kesmez
  });

  test("varsayılan sınır 155 ve gerçek site açıklaması buna sığar", () => {
    const long = "Trendyol, Hepsiburada ve Amazon mağazanız için Meta CPAS reklamlarını uçtan uca kuruyor ve yönetiyoruz. Profesyonel kurulum, haftalık optimizasyon, gerçek satış verisiyle raporlama.";
    const out = metaDescription(long);
    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
    expect(out).toBe("Trendyol, Hepsiburada ve Amazon mağazanız için Meta CPAS reklamlarını uçtan uca kuruyor ve yönetiyoruz.");
  });
});
