import { describe, expect, test } from "vitest";
import {
  completedMonths,
  currentMonthKey,
  normalizeCurve,
  roasSpan,
  selectCaseCards,
} from "../caseCards";
import type { CategoryMonthPoint, CategoryStat } from "@/types/categoryStats";

/** Testlerde sabit "bugün": 24 Eylül 2026, yani 2026-09 henüz bitmemiş ay. */
const NOW = new Date("2026-09-24T12:00:00Z");

function month(m: string, spend: number, roas: number): CategoryMonthPoint {
  return { month: m, spend, revenue: spend * roas, roas };
}

const DEFAULT_MONTHLY: CategoryMonthPoint[] = [
  month("2026-06", 10_000, 5),
  month("2026-07", 20_000, 9),
  month("2026-08", 30_000, 7),
  month("2026-09", 5_000, 2), // kısmi ay — seriden çıkarılmalı
];

/** Varsayılan seriyi verilen katsayıyla ölçekler — ciro sıralamasını sürmek için. */
function scaledMonthly(scale: number): CategoryMonthPoint[] {
  return DEFAULT_MONTHLY.map((m) => ({ ...m, spend: m.spend * scale, revenue: m.revenue * scale }));
}

function category(overrides: Partial<CategoryStat> = {}): CategoryStat {
  const { monthly, ...rest } = overrides;
  return {
    name: "Test Kategori",
    color: null,
    firmCount: 2,
    spend: 65_000,
    sales: 100,
    revenue: 500_000,
    roas: 8,
    monthly: monthly ?? DEFAULT_MONTHLY,
    ...rest,
  };
}

describe("currentMonthKey", () => {
  test("Türkiye saatine göre YYYY-MM üretir", () => {
    // Arrange & Act
    const key = currentMonthKey(NOW);

    // Assert
    expect(key).toBe("2026-09");
  });

  test("ay sınırında UTC değil Türkiye saatini esas alır", () => {
    // Arrange — UTC'de hâlâ 30 Eylül, Türkiye'de (UTC+3) 1 Ekim.
    const boundary = new Date("2026-09-30T22:30:00Z");

    // Act & Assert
    expect(currentMonthKey(boundary)).toBe("2026-10");
  });
});

describe("completedMonths", () => {
  test("içinde bulunulan bitmemiş ayı seriden çıkarır", () => {
    // Arrange
    const monthly = category().monthly;

    // Act
    const months = completedMonths(monthly, NOW);

    // Assert
    expect(months.map((m) => m.month)).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  test("veri zaten geçmiş aylarda bitiyorsa hiçbir şey atmaz", () => {
    // Arrange
    const monthly = [month("2026-04", 1_000, 4), month("2026-05", 2_000, 6)];

    // Act
    const months = completedMonths(monthly, NOW);

    // Assert
    expect(months).toHaveLength(2);
  });
});

describe("roasSpan", () => {
  test("ilk harcama ayını ve sonraki en iyi ayı döndürür", () => {
    // Arrange
    const months = [month("2026-06", 10_000, 5), month("2026-07", 20_000, 9), month("2026-08", 30_000, 7)];

    // Act
    const span = roasSpan(months);

    // Assert — "son ay" 7x olsa da anlatının zirvesi 9x.
    expect(span).toEqual({ first: 5, best: 9 });
  });

  test("ölçeklenirken ROAS gerileyen kategoriyi elemez", () => {
    // Arrange — harcama 18 katına çıkmış, son ay ilk aydan düşük.
    const months = [
      month("2026-04", 31_000, 21.5),
      month("2026-05", 88_000, 23.1),
      month("2026-06", 203_000, 33.6),
      month("2026-08", 579_000, 16.1),
    ];

    // Act
    const span = roasSpan(months);

    // Assert
    expect(span).toEqual({ first: 21.5, best: 33.6 });
  });

  test("harcama yapılan tek ay varsa null döner", () => {
    // Arrange
    const months = [month("2026-07", 0, 0), month("2026-08", 10_000, 12)];

    // Act & Assert
    expect(roasSpan(months)).toBeNull();
  });

  test("ilk aydan sonra hiç iyileşme yoksa null döner", () => {
    // Arrange
    const months = [month("2026-07", 10_000, 12), month("2026-08", 10_000, 9)];

    // Act & Assert
    expect(roasSpan(months)).toBeNull();
  });
});

describe("normalizeCurve", () => {
  test("serinin kendi maksimumuna göre 0-100 aralığına taşır", () => {
    // Arrange & Act
    const curve = normalizeCurve([50, 100, 200]);

    // Assert
    expect(curve).toEqual([25, 50, 100]);
  });

  test("tamamı sıfır olan seriyi düz tabana indirir", () => {
    // Arrange & Act & Assert
    expect(normalizeCurve([0, 0, 0])).toEqual([8, 8, 8]);
  });
});

describe("selectCaseCards", () => {
  test("en fazla üç kart döndürür ve ciroya göre sıralar", () => {
    // Arrange — hepsi eşikleri geçiyor, yalnızca büyüklükleri farklı.
    const categories = [
      category({ name: "Küçük", monthly: scaledMonthly(1) }),
      category({ name: "Büyük", monthly: scaledMonthly(10) }),
      category({ name: "Orta", monthly: scaledMonthly(3) }),
      category({ name: "En Küçük", monthly: scaledMonthly(0.5) }),
    ];

    // Act
    const cards = selectCaseCards(categories, NOW);

    // Assert
    expect(cards.map((c) => c.badge)).toEqual(["Büyük", "Orta", "Küçük"]);
  });

  test("eşiklerin altındaki kategoriyi eler", () => {
    // Arrange — her biri tek bir eşiğin altında kalıyor.
    const categories = [
      category({ name: "Cılız Ciro", monthly: scaledMonthly(0.02) }),
      category({
        name: "Az Harcama",
        monthly: [month("2026-06", 300, 15), month("2026-07", 400, 25)],
      }),
      category({
        name: "Düşük ROAS",
        monthly: [month("2026-06", 10_000, 1), month("2026-07", 20_000, 2)],
      }),
    ];

    // Act & Assert
    expect(selectCaseCards(categories, NOW)).toHaveLength(0);
  });

  test("eşikleri kategori toplamından değil gösterilen aylardan hesaplar", () => {
    // Arrange — ciro neredeyse tamamen bitmemiş ayda; tam aylar eşiğin altında.
    const categories = [
      category({
        name: "Sadece Bu Ay",
        monthly: [month("2026-07", 100, 4), month("2026-08", 200, 9), month("2026-09", 90_000, 20)],
      }),
    ];

    // Act & Assert — kategori toplamı milyonluk olsa da kart çıkmaz.
    expect(selectCaseCards(categories, NOW)).toHaveLength(0);
  });

  test("kart cirosu yalnızca gösterilen tam ayların toplamıdır", () => {
    // Arrange — 2026-09 kısmi ayının cirosu toplama girmemeli.
    const categories = [category({ name: "Ev Tekstili" })];

    // Act
    const [card] = selectCaseCards(categories, NOW);

    // Assert
    expect(card.monthCount).toBe(3);
    expect(card.revenue).toBe(10_000 * 5 + 20_000 * 9 + 30_000 * 7);
  });

  test("tek mağazalı kategoriyi 'sektör verisi' olarak etiketler", () => {
    // Arrange
    const categories = [category({ firmCount: 1 })];

    // Act
    const [card] = selectCaseCards(categories, NOW);

    // Assert
    expect(card.subLabel).toBe("sektör verisi");
  });

  test("veri gelmezse boş liste döner — temsili örneğe düşmez", () => {
    // Arrange & Act & Assert
    expect(selectCaseCards([], NOW)).toEqual([]);
  });
});
