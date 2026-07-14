// Canlı istatistik tipleri — hem server (liveStats.ts) hem client (LiveStatsBand)
// tarafından kullanılır. Bu dosya nötr olmalı: "server-only" / "client-only"
// içermez, yan etkisi yoktur.

export interface StatsBucket {
  spend: number;
  sales: number;
  revenue: number;
}

export interface LiveStats {
  today: StatsBucket;
  week: StatsBucket;
  month: StatsBucket;
  /** Tüm zamanlar kümülatif toplam — Jale API v2. Eski API'de bulunmayabilir. */
  allTime?: StatsBucket;
  /** Aktif (ACTIVE) müşteri/mağaza sayısı — Jale API v2. Eski API'de bulunmayabilir. */
  activeStores?: number;
  updatedAt: string;
}
