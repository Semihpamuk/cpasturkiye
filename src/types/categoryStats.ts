// Kategori bazlı vaka istatistikleri tipleri — server (categoryStats.ts) ve
// client (CaseStudies) tarafından paylaşılır. Nötr: yan etkisi yok.

export interface CategoryMonthPoint {
  month: string; // "YYYY-MM"
  spend: number;
  revenue: number;
  roas: number;
}

export interface CategoryStat {
  name: string;
  color: string | null;
  firmCount: number;
  spend: number;
  sales: number;
  revenue: number;
  roas: number;
  monthly: CategoryMonthPoint[];
}

export interface CategoryStatsPayload {
  categories: CategoryStat[];
  updatedAt: string;
}
