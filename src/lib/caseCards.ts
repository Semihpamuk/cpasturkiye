/**
 * Vaka kartı seçimi — Jale'nin kategori istatistiklerinden hangi kategorilerin
 * vitrine çıkacağını ve hangi rakamlarla anlatılacağını belirler.
 *
 * Saf fonksiyonlar: JSX yok, yan etki yok, `new Date()` dışarıdan verilebilir.
 * Böylece seçim mantığı testlenebilir ve hem sunucuda hem istemcide çalışır.
 *
 * Neden ayrı dosya: mantık daha önce CaseStudies.tsx içinde JSX'e karışmıştı;
 * "hangi kategori neden elendi" sorusu ancak tarayıcıda çalıştırılarak
 * cevaplanabiliyordu.
 */

import type { CategoryMonthPoint, CategoryStat } from "@/types/categoryStats";

/** Vaka kartına layık "gerçekten performans gösteren" kategori eşikleri. */
const MIN_REVENUE = 10_000; // toplam ciro (TL)
const MIN_SPEND = 1_000; // toplam harcama (TL)
const MIN_ROAS = 3; // vaka-değer ROAS tabanı
export const MAX_CARDS = 3;

/** Kategori kendi rengini vermezse sırayla bu paletten atanır. */
const PALETTE = ["#f27a1a", "#0866ff", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

/** Grafiğin düz taban değeri — sıfır ciro da çizgi üzerinde görünsün. */
const CURVE_FLOOR = 6;

export interface CaseCardData {
  key: string;
  badge: string;
  color: string;
  subLabel: string;
  /** 0-100 normalize aylık ciro serisi. */
  curve: number[];
  /** Harcama yapılan ilk ayın ROAS'ı. */
  firstRoas: number;
  /** Sonraki ayların en iyi ROAS'ı (her zaman firstRoas'tan büyük). */
  bestRoas: number;
  /** Kartta gösterilen ayların toplam cirosu. */
  revenue: number;
  monthCount: number;
  firmCount: number;
  note: string;
}

/**
 * İçinde bulunduğumuz ayın "YYYY-MM" anahtarı — Türkiye saatine göre.
 *
 * Sunucu UTC'de çalışıyor; ay sınırında UTC ile Türkiye (UTC+3) üç saat
 * ayrışıyor ve yanlış ayı "bitmiş" sayabiliyorduk.
 */
export function currentMonthKey(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

/**
 * Henüz bitmemiş ayı seriden çıkarır.
 *
 * Kısmi ay her zaman düşük ciro ve çoğu zaman düşük ROAS gösteriyor; seride
 * son nokta olarak kaldığında büyüyen hesaplar "gerileme" gibi okunuyordu.
 */
export function completedMonths(
  monthly: readonly CategoryMonthPoint[],
  now: Date = new Date()
): CategoryMonthPoint[] {
  const current = currentMonthKey(now);
  return monthly.filter((m) => m.month < current);
}

/**
 * Anlatının iki ucu: harcama yapılan ilk ay ve ondan sonraki en iyi ay.
 *
 * "Son ay" kullanılmıyor — harcamasını 18 katına çıkarmış bir hesapta ROAS'ın
 * bir miktar gerilemesi normaldir ve o kategoriyi vitrinden düşürüyordu.
 * İyileşme yoksa (ilk ay zaten zirveyse) kategori vaka sayılmaz.
 */
export function roasSpan(
  months: readonly CategoryMonthPoint[]
): { first: number; best: number } | null {
  const spentMonths = months.filter((m) => m.spend > 0);
  if (spentMonths.length < 2) return null;

  const first = spentMonths[0].roas;
  if (first <= 0) return null;

  const best = Math.max(...spentMonths.slice(1).map((m) => m.roas));
  if (best <= first) return null;

  return { first, best };
}

/** Aylık ciro serisini 0-100 aralığına normalize eder (kendi maksimumuna göre). */
export function normalizeCurve(values: readonly number[]): number[] {
  const max = Math.max(...values, 0);
  if (max <= 0) return values.map(() => 8); // düz taban
  return values.map((v) => Math.max(CURVE_FLOOR, Math.round((v / max) * 100)));
}

function sum(values: readonly number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

function toCard(cat: CategoryStat, months: CategoryMonthPoint[], index: number): CaseCardData {
  // Filtre garanti ettiği için burada null gelmez.
  const span = roasSpan(months) ?? { first: 0, best: cat.roas };
  const revenue = sum(months.map((m) => m.revenue));

  return {
    key: cat.name,
    badge: cat.name,
    color: cat.color || PALETTE[index % PALETTE.length],
    // Tek mağazalı kategoride "1 mağaza" yazmak inandırıcılığı zedeliyordu
    // (kullanıcı kararı, 21 Eyl 2026): kart sektör verisi olarak sunulur.
    subLabel: cat.firmCount > 1 ? `${cat.firmCount} mağaza` : "sektör verisi",
    curve: normalizeCurve(months.map((m) => m.revenue)),
    firstRoas: span.first,
    bestRoas: span.best,
    revenue,
    monthCount: months.length,
    firmCount: cat.firmCount,
    note:
      cat.firmCount > 1
        ? `${cat.firmCount} aktif mağazanın son ${months.length} aydaki toplam Meta CPAS performansı.`
        : `Bu sektörde yönettiğimiz hesabın son ${months.length} aydaki Meta CPAS performansı.`,
  };
}

/**
 * Vitrine çıkacak kartları seçer: eşikleri geçen ve iyileşme gösterebilen
 * kategoriler arasından **en büyük cirolular**.
 *
 * Sıralama ROAS'a göre yapıldığında tek mağazalı küçük kategoriler öne
 * çıkıyor, milyonluk çok mağazalı kategoriler geride kalıyordu.
 *
 * Eşikler ve sıralama, kategorinin tüm zamanlar toplamından değil **kartta
 * gösterilen tam aylardan** hesaplanır; aksi halde bir kategori kartında
 * yazandan başka bir rakama göre sıralanabiliyordu.
 */
export function selectCaseCards(
  categories: readonly CategoryStat[],
  now: Date = new Date()
): CaseCardData[] {
  return categories
    .map((cat) => {
      const months = completedMonths(cat.monthly, now);
      const revenue = sum(months.map((m) => m.revenue));
      const spend = sum(months.map((m) => m.spend));
      return { cat, months, revenue, spend, roas: spend > 0 ? revenue / spend : 0 };
    })
    .filter(
      ({ months, revenue, spend, roas }) =>
        revenue >= MIN_REVENUE && spend >= MIN_SPEND && roas >= MIN_ROAS && roasSpan(months) !== null
    )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, MAX_CARDS)
    .map(({ cat, months }, index) => toCard(cat, months, index));
}
